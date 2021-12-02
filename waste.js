function waste(print) {
  const buf = Buffer.alloc(1024 * 1024)
  if (print) console.log(typeof buf)
}

for (let i = 0; i < 10e3; i++) {
  waste(i % 1e3 == 0)
  global.gc()
}
