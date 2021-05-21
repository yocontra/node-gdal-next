module.exports = {
  async: () =>
    `
Asynchronous version.
If the last parameter is a callback, then this callback is called on completion and undefined is returned.
All optional parameters before the callback can be omitted so the callback parameter can be at any position as long
as it is the last parameter. Otherwise the function returns a Promise resolved with the result.
`,
  cb: () =>
    `
standard Node.js \`(error, result)\` callback. It is awalys the last paramater and can be specified even if certain optional parameters are omitted.
On error \`error\` is an \`Error\` object and \`result\` is \`undefined\`. On success \`error\` is \`null\` and \`result\` contains the result.
The function returns a Promise when the callback is \`undefined\`. The return value is undefined when a callback is provided.
Argument type errors are thrown synchronously even when a callback is provided. In Promise mode all errors result in a rejected Promise.
`,
  progress_cb: () =>
    `
optional progress callback. In sync mode at every invocation it will stop the GDAL operation until it returns.
In async mode it will schedule the invocation to be executed at the next event loop iteration while the GDAL operation willl continues in the background.
If the event loop is blocked and a second invocation is scheduled before the first one has been executed, the first one will be discarded.
No progress callbacks will be delivered after the result callback has been triggered or the Promise has been resolved.
If the event loop is blocked for the whole duration of the operation, no progress callbacks will be made at all.
The callback takes two arguments, the first one, \`complete\`, is a number between 0 and 1 indicating the progress towards the operation finish and the second one,
\`message\`, can be used by certain GDAL drivers to return text messages.
`
}
