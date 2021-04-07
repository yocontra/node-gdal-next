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
`
}
