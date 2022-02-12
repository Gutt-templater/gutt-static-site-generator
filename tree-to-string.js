var logicAttrs = ['readonly', 'selected', 'checked', 'disabled', 'autofocus', 'required', 'multiple', 'autoplay', 'controls', 'loop', 'muted']
var inlineTags = ['a', 'address', 'b', 'br', 'code', 'date', 'em', 'i', 'mark', 'q', 's', 'small', 'span', 'strong', 'sub', 'sup', 'u', 'var']

function attrsToString (attrs) {
  var result = []

  for (attr in attrs) {
    if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
      if (~logicAttrs.indexOf(attr)) {
        if (attrs[attr] !== false) {
          result.push(' ' + attr)
        }
      } else {
        result.push(' ' + attr + (attrs[attr] !== null ? '="' + attrs[attr] + '"' : ''))
      }
    }
  }

  return result.join('')
}

function makeIndent(length) {
  return '\n' + new Array(length).fill('\t').join('')
}

function detectNewLine(item) {
  if (typeof item.tag !== 'undefined' && inlineTags.includes(item.tag)) {
    return false
  }

  return true
}

function calcNewIndent(item) {
  if (typeof item.tag !== 'undefined' && item.tag === 'html') {
    return 0
  }

  return 1
}

module.exports = function treeToString (tree, params, ctx) {
  params = params || {}
  ctx = ctx || {
    indent: 0,
    inline: true
  }

  return tree.filter(function (item) {
    if (typeof item.text !== 'undefined') {
      return String(item.text).trim().length
    }

    return true
  }).map(function (item, index, origin) {
    if (typeof item.comment !== 'undefined') {
      return '<!--' + item.comment + '-->'
    }

    if (typeof item.script !== 'undefined') {
      return (
        '<script' + attrsToString(item.attrs) + '>' +
        item.body.str + '</script>'
      )
    }

    if (typeof item.text !== 'undefined') {
      if (params.prettify) {
        var trimmedText = !ctx.inline ? item.text.trim() : !index ? item.text.trimLeft() : index === origin.length - 1 ? item.text.trimRight() :  item.text

        return (!ctx.inline ? makeIndent(ctx.indent) : '') + trimmedText
      }

      return item.text
    }

    if (typeof item.tag !== 'undefined') {
      var newLine = detectNewLine(item)
      var indent = ctx.indent
      var inline = typeof item.children !== 'undefined' ? item.children.reduce(function (result, item) {
        if (typeof item.tag !== 'undefined' && detectNewLine(item)) {
          return false
        }

        return result
      }, true) : true
      var children = typeof item.children !== 'undefined' ? treeToString(item.children, params, { indent: ctx.indent + calcNewIndent(item), inline: inline }) : ''
      var indentChildren = inline && children.length > 120

      var result = (
        (newLine && params.prettify ? makeIndent(indent) : '') + '<' + item.tag + attrsToString(item.attrs) + (typeof item.children !== 'undefined'
          ? '>' + (indentChildren && params.prettify ? makeIndent(ctx.indent + 1) : '') + children + ((indentChildren || !inline) && params.prettify ? makeIndent(indent) : '') + '</' + item.tag + '>'
          : (item.tag !== '!DOCTYPE' ? ' /' : '') +
        '>')
      )

      return result
    }

    return ''
  }).join('')
}
