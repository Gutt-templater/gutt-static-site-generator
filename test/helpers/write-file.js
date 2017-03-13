/* global Promise */

var fs = require('fs')
var path = require('path')
var tmpFilesDirPath = path.resolve(__dirname, '../../tmp')

module.exports = function (filePath, content) {
  return new Promise(function (resolve, reject) {
    try {
      fs.accessSync(tmpFilesDirPath, fs.F_OK)
    } catch (e) {
      fs.mkdir(tmpFilesDirPath)
    }

    fs.writeFile(filePath, content, function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  });
}
