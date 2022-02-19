function init(config) {
  if (!config.flatteners) config.flatteners = {}

  config.flatteners.async = (result) => {
    result.description.children.push({
      type: 'paragraph',
      children: [ {
        type: 'text',
        value: 'This is an asynchronous call. If its last argument is a function, then this function will be called on completion ' +
          'following the standard Node.js callback convection of `(error, result)`. The return value will be `undefined. ' +
          'The callback can be specified even if some optional arguments are omitted. ' +
          'Argument errors will throw, but runtime errors will be reported via the callback. ' +
          'If the last argument is not a callback the function will return a Promise that will resolve with the result. ' +
          'In this case all errors will result in a rejected Promise. '
      } ]
    })
  }

  config.flatteners.asyncGetter = (result) => {
    if (!result.description.children) {
      result.description = { type: 'root', children: [] }
    }
    result.description.children.push({
      type: 'paragraph',
      children: [ {
        type: 'text',
        value: 'Asynchronous read-only getter. Returns a Promise that resolves with the result.'
      } ]
    })
  }
}

module.exports = {
  init
}
