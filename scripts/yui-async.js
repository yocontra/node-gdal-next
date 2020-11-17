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
Promisifiable callback, always the last parameter, can be specified even if
certain optional parameters are omitted
`
}
