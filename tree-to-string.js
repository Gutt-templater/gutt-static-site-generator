function attrsToString (attrs) {
  var result = []

  for (attr in attrs) {
    if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
      result.push(' ' + attr + (attrs[attr] !== false ? '="' + attrs[attr] + '"' : ''))
    }
  }

  return result.join('')
}

module.exports = function treeToString (tree) {
  var buffer = tree.map(function (item) {
    if (typeof item.comment !== 'undefined') {
      return '<!--' + item.comment + '-->'
    }

    if (typeof item.text !== 'undefined') {
      return item.text
    }

    if (typeof item.tag !== 'undefined') {
      return (
        '<' + item.tag + attrsToString(item.attrs) + (typeof item.children !== 'undefined' ?
        '>' + treeToString(item.children) + '</' + item.tag + '>' :
        (item.tag !== '!DOCTYPE' ? ' /' : '') + '>')
      )
    }

    return ''
  })

  return buffer.join('')
}
