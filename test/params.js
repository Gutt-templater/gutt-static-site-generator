/* globals describe, it */

var chai = require('chai')
var parse = require('./helpers/parse')

chai.should()

describe ('Stringify with different params', function () {
  it ('should be prettify', function () {
    var template = '<!DOCTYPE html>\
<html lang="en">\
<head>\
  <meta charset="UTF-8" />\
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\
  <title>Document</title>\
</head>\
<body>\
  <section><div>Shoul be inline</div><div>Shoul be <hr /> multiline</div><div>Lorem ipsum dolor sit amet consectetur adipisicing elit. <span>Magnam</span> tempore voluptas assumenda quibusdam repellendus velit doloribus vero ab dolorum quam sequi voluptates exercitationem nam, eveniet atque fugit perferendis ullam! Quos?</div></section>\
  <form><fieldset><dl><dt><label>Email</label></dt><dd><input type="email" name="email" id="email" class="form__email" /></dd></dl></fieldset></form>\
  <ul><li>qweqweqweqwe</li><li>qweqweqweqweq<img src="" alt="" /></li></ul>\
</body>\
</html>'
    var result = '<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8" />\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n\t<title>Document</title>\n</head>\n<body>\n\t<section>\n\t\t<div>Shoul be inline</div>\n\t\t<div>\n\t\t\tShoul be\n\t\t\t<hr />\n\t\t\tmultiline\n\t\t</div>\n\t\t<div>\n\t\t\tLorem ipsum dolor sit amet consectetur adipisicing elit. <span>Magnam</span> tempore voluptas assumenda quibusdam repellendus velit doloribus vero ab dolorum quam sequi voluptates exercitationem nam, eveniet atque fugit perferendis ullam! Quos?\n\t\t</div>\n\t</section>\n\t<form>\n\t\t<fieldset>\n\t\t\t<dl>\n\t\t\t\t<dt>\n\t\t\t\t\t<label>Email</label>\n\t\t\t\t</dt>\n\t\t\t\t<dd>\n\t\t\t\t\t<input type="email" name="email" id="email" class="form__email" />\n\t\t\t\t</dd>\n\t\t\t</dl>\n\t\t</fieldset>\n\t</form>\n\t<ul>\n\t\t<li>qweqweqweqwe</li>\n\t\t<li>\n\t\t\tqweqweqweqweq\n\t\t\t<img src="" alt="" />\n\t\t</li>\n\t</ul>\n</body>\n</html>'

    parse(template, {}, '', true).should.equal(result)
  })
})
