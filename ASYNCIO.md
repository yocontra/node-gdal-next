# A note on async I/O scheduling

# The problem

Prior to 3.3, all async I/O was deferred to `Nan::AsyncWorker` which in turn scheduled the I/O work through `libuv`.
Internally, `libuv` uses a thread pool to avoid a costly thread setup and teardown for small jobs. The default size of this pool in Node.js is 4 threads. It can be adjusted by setting the environment variable `UV_THREADPOOL_SIZE`. It is a good idea to raise that value, especially on hosts equipped with more than 4 cores and when doing CPU-bound work such as GDAL.

Consider now the following code:
```js
const ds1 = gdal.open('4bands1.tif')
const data1 = [] // Promise<TypedArray>[]
for (let band = 1; band <= 4; band++)
  data1[band - 1] = ds1.bands.get(band).pixels.readAsync(0, 0,
                    ds1.rasterSize.x, ds1.rasterSize.y)

const ds2 = gdal.open('4bands2.tif')
const data2 = []  // Promise<TypedArray>[]
for (let band = 1; band <= 4; band++)
  data2[band - 1] = ds2.bands.get(band).pixels.readAsync(0, 0,
                    ds2.rasterSize.x, ds2.rasterSize.y)

await Promise.all([Promise.all(data1), Promise.all(data2)])
```

It launches 8 parallel operations: 4 reads for one band on 2 datasets of 4 bands each. One could expect that with 4 threads in the pool, this one will be at least partially parallelized. Alas, this is not really the case.

The first loop will schedule 4 jobs on the Node.js event loop. libuv will place them in 4 different threads - allocating all slots. As GDAL does not support multiple concurrent operations on a single Dataset handle, these 4 threads will compete for a single mutex. One of them will acquire it, leaving the other 3 threads sleeping while occupying a slot on the thread pool. This is a classical example of *thread starvation*. None of the 4 jobs, scheduled by the second loop, will be able to run as there won't be any free slots left.

# Increase the thread pool size

The first and easiest solution is to simply raise the value of `UV_THREADPOOL_SIZE`. It is suboptimal - as it launches more threads than needed - and it works only up to a certain point, ie number of threads.

# Manual I/O scheduling

Taking care to never launch more than operation on the same Dataset in parallel is probably the best solution, but it makes parallel reading much more complex and impractical:
```js
const ds1 = gdal.open('4bands1.tif')
const data1 = [] // Promise<TypedArray>[]
data1[0] = Promise.resolve(null)
for (let band = 1; band <= 4; band++)
  data1[band] = data1[band - 1].then(() =>
    ds1.bands.get(band).pixels.readAsync(0, 0, ds1.rasterSize.x, ds1.rasterSize.y))
 
const ds2 = gdal.open('4bands2.tif')
const data2 = []  // Promise<TypedArray>[]
data2[0] = Promise.resolve(null)
for (let band = 1; band <= 4; band++)
  data2[band] = data2[band - 1].then(() =>
    ds2.bands.get(band).pixels.readAsync(0, 0, ds2.rasterSize.x, ds2.rasterSize.y))

await Promise.all(data1[4], data2[4])
```

Here we are chaining all the Promises one on another. Now the read of the second band of the first dataset won't launch until the first one has completed - ensuring that there will be enough free slots on the thread pool for the jobs of the second loop to run.

# I/O scheduling

3.3 (will) implement(s) a new I/O scheduler that will render this automatic and transparent for the user.
