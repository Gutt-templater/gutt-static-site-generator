var path = require('path')
var fs = require('fs')
var parser = require('gutt')
var nodeStringifier = require('../../index')

function parse (template, data, filePath, prettify) {
  if (!data) data = {}

  return parser.parse(template, filePath, '', prettify ? { prettify: true } : false).stringifyWith(nodeStringifier)(data);
}

module.exports = parse
