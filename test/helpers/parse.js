var path = require('path')
var fs = require('fs')
var parser = require('gutt')
var nodeStringifier = require('../../index')

function parse (template, data, filePath) {
  if (!data) data = {}

  return parser.parse(template, filePath, '', false).stringifyWith(nodeStringifier)(data);
}

module.exports = parse
