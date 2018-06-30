/* globals describe, it, Promise */

var path = require('path')
var chai = require('chai')
var parse = require('./helpers/parse')
var generateName = require('./helpers/generate-name')
var writeFile = require('./helpers/write-file')
var tempPath = path.resolve(__dirname, '../tmp/')

chai.should()

describe ('Nodejs stringifier common functions', function () {
  it ('html empty comment', function () {
    return parse('<component><!----></component>').should.equal('<!---->')
  })

  it ('html text comment', function () {
    return parse('<component><!-- some text 12345 _ # $ % ! - -\\- = [ ] \{ \} + ; : ( ) " \' \ / ~ _#$%!-\\-=+;:()"\'\/~ qwe123:-_ --></component>')
      .should.equal('<!-- some text 12345 _ # $ % ! - -- = [ ] \{ \} + ; : ( ) " \' \ / ~ _#$%!--=+;:()"\'\/~ qwe123:-_ -->')
  })

  it ('echo expression', function () {
    var params = {
      b: 1,
      c: {
        variable: {
          str: 3
        }
      },
      d: 'variable'
    }

    return parse('<component>{ $b + $c[$d][\'str\'] * 2 }</component>', params).should.equal('7')
  })

  it ('foreach expression without index', function () {
    var template =
      '<component>' +
      '<for-each item={$item} from={$news}>' +
      '<h1>{ $item.title }</h1>' +
      '</for-each>' +
      '</component>'
    var params = {
      news: [
        {
          title: 'News'
        },
        {
          title: 'Olds'
        }
      ],
      l1: {l2: {}}
    }

    return parse(template, params).should.equal('<h1>News</h1><h1>Olds</h1>')
  })

  it ('foreach expression with index', function () {
    var params = {
      news: [
        {
          title: 'News'
        },
        {
          title: 'Olds'
        }
      ]
    }
    var template =
      '<component>' +
      '<for-each key={$index} item={$item} from={$news}>' +
      '<h1 data-index={$index}>{$item[\'title\']}</h1>' +
      '</for-each>' +
      '</component>'

    return parse(template, params)
      .should.equal('<h1 data-index="0">News</h1><h1 data-index="1">Olds</h1>')
  })

  it ('foreach statement at attributes at single tag', function () {
    var template =
      '<component>' +
      '<input title="Hello">' +
      '<for-each item={$item} from={[0..3]}>' +
      '<attribute name={"data-index" ++ $item} value={$item} />' +
      '</for-each>' +
      '</input>' +
      '</component>'
    var result =
      '<input title="Hello" data-index0="0" data-index1="1" data-index2="2" data-index3="3" />'

    return parse(template).should.equal(result)
  })

  it ('foreach statement at attributes at couple tag', function () {
    var template =
      '<component>' +
      '<div title="Hello">' +
      '<for-each item={$item} from={[0..3]}>' +
      '<attribute name={"data-index" ++ $item} value={$item} />' +
      '</for-each>' +
      '</div>' +
      '</component>'

    return parse(template, {item: 2}).should.equal('<div title="Hello" data-index0="0" data-index1="1" data-index2="2" data-index3="3"></div>')
  })

  it ('switch statement for tags with default', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<default>default value</default>' +
      '</switch>' +
      '</component>'

    return parse(template, {}).should.equal('default value')
  })

  it ('switch statement for tags with positive case 1', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={$a > $b}>case 1</case>' +
      '</switch>' +
      '</component>'

    return parse(template, {a: 2, b: 1}).should.equal('case 1')
  })

  it ('switch statement for tags with negative case 1', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={$a > $b}>case 1</case>' +
      '</switch>' +
      '</component>'

    return parse(template, {a: 1, b: 2}).should.equal('')
  })

  it ('switch statement for tags with positive case 2', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={$a > $b}>case 1</case>' +
      '<case test={$b > $a}>case 2</case>' +
      '</switch>' +
      '</component>'

    return parse(template, {a: 1, b: 2}).should.equal('case 2')
  })

  it ('switch statement for tags with positive default statement', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={$a > $b}>case 1</case>' +
      '<default>default statement</default>' +
      '</switch>' +
      '</component>'

    return parse(template, {a: 1, b: 2}).should.equal('default statement')
  })

  it ('switch statement for attributes with default', function () {
    var template =
      '<component>' +
      '<div>' +
      '<switch>' +
      '<default>' +
      '<attribute name="data-id" value="qwerty" />' +
      '</default>' +
      '</switch>' +
      '</div>' +
      '</component>'

    return parse(template, {}).should.equal('<div data-id="qwerty"></div>')
  })

  it ('switch statement for attributes with positive case 1', function () {
    var template =
      '<component>' +
      '<div>' +
      '<switch>' +
      '<case test={$a > $b}>' +
      '<attribute name="case" value="1" />' +
      '</case>' +
      '</switch>' +
      '</div>' +
      '</component>'

    return parse(template, {a: 2, b: 1}).should.equal('<div case="1"></div>')
  })

  it ('switch statement for attributes with negative case 1', function () {
    var template =
      '<component>' +
      '<div>' +
      '<switch>' +
      '<case test={$a > $b}>' +
      '<attribute name="case" value="1" />' +
      '</case>' +
      '</switch>' +
      '</div>' +
      '</component>'

    return parse(template, {a: 1, b: 2}).should.equal('<div></div>')
  })

  it ('switch statement for attributes with positive case 2', function () {
    var template =
      '<component>' +
      '<div>' +
      '<switch>' +
      '<case test={$a > $b}>' +
      '<attribute name="case" value="1" />' +
      '</case>' +
      '<case test={$b > $a}>' +
      '<attribute name="case" value="2" />' +
      '</case>' +
      '</switch>' +
      '</div>' +
      '</component>'

    return parse(template, {a: 1, b: 2}).should.equal('<div case="2"></div>')
  })

  it ('switch statement for attributes with positive default statement', function () {
    var template =
      '<component>' +
      '<div>' +
      '<switch>' +
      '<case test={$a > $b}>' +
      '<attribute name="case" value="1" />' +
      '</case>' +
      '<default>' +
      '<attribute name="case" value="default statement" />' +
      '</default>' +
      '</switch>' +
      '</div>' +
      '</component>'

    return parse(template, {a: 1, b: 2}).should.equal('<div case="default statement"></div>')
  })

  it ('switch expression', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={$a == $b}>' +
      '<variable name={$a} value={$a + $b} />' +
      '</case>' +
      '<case test={$a > $b && $b < $a}>' +
      '<variable name={$a} value={$a - $b} />' +
      '</case>' +
      '<default>' +
      '<variable name={$a} value={$b} />' +
      '</default>' +
      '</switch>' +
      '{$a}' +
      '</component>'
    var params = {a: 5, b: 10}

    return parse(template, params).should.equal('10')
  })

  it ('if expression 2', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={$a == $b}>' +
      '<variable name={$a} value={$a + $b} />' +
      '</case>' +
      '<case test={$a > $b && $b < $a}>' +
      '<variable name={$a} value={$a - $b} />' +
      '</case>' +
      '<default>' +
      '<variable name={$a} value={$b} />' +
      '</default>' +
      '</switch>' +
      '{$a}' +
      '</component>'
    var params = {a: 10, b: 5}

    return parse(template, params).should.equal('5')
  })

  it ('empty statements', function () {
    var template =
      '<component>' +
      '<div>' +
      '<switch>' +
      '<case test={$a > $b}>' +
      '</case>' +
      '<default>' +
      '</default>' +
      '</switch>' +
      '<variable name={$emptyarr} value={[]} />' +
      '<if test={1}></if>' +
      '<for-each item={$item} from={[]}></for-each>' +
      '</div>' +
      '</component>'

    return parse(template, {a: 1, b: 2}).should.equal('<div></div>')
  })

  it ('array expressions open range grow up', function () {
    var template =
      '<component>' +
      '<for-each item={$item} from={[5...$end]}>' +
      '{ $item }' +
      '</for-each>' +
      '</component>'

    return parse(template, {end: 9}).should.equal('5678')
  })

  it ('array expressions open range grow down', function () {
    var template =
      '<component>' +
      '<for-each item={$item} from={[5...$end]}>' +
      '{ $item }' +
      '</for-each>' +
      '</component>'

    return parse(template, {end: 0}).should.equal('54321')
  })

  it ('array expressions closed range grow up', function () {
    var template =
      '<component>' +
      '<for-each item={$item} from={[5..$end]}>' +
      '{ $item }' +
      '</for-each>' +
      '</component>'

    return parse(template, {end: 9}).should.equal('56789')
  })

  it ('array expressions closed range grow down', function () {
    var template =
      '<component>' +
      '<for-each item={$item} from={[5..$end]}>' +
      '{ $item }' +
      '</for-each>' +
      '</component>'

    return parse(template, {end: 0}).should.equal('543210')
  })

  it ('doctype', function () {
    var template =
      '<component>' +
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >' +
      '<html lang="en"><head><meta charset="UTF-8" />' +
      '<title>Document</title>' +
      '</head>' +
      '<body></body>' +
      '</html>' +
      '</component>'
    var result =
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
      '<html lang="en">' +
      '<head>' +
      '<meta charset="UTF-8" />' +
      '<title>Document</title>' +
      '</head>' +
      '<body>' +
      '</body>' +
      '</html>'

    return parse(template).should.equal(result)
  })

  it ('isset', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={!$field[\'hide\']? || ($field[\'hide\']? && !$field[\'hide\'])}>hidden</case>' +
      '<default>show</default>' +
      '</switch>' +
      '</component>'

    return parse(template, {field: {}}).should.equal('hidden')
  })

  it ('param with default value', function () {
    var template =
      '<component>' +
      '<param name={$a} value={1} />' +
      '<switch>' +
      '<case test={$a > $b}>first</case>' +
      '<default>default</default>' +
      '</switch>' +
      '</component>'

    return parse(template, {b: 2}).should.equal('default')
  })

  it ('param with rewritten value', function () {
    var template =
      '<component>' +
      '<param name={$a} value={1} />' +
      '<switch>' +
      '<case test={$a > $b}>first</case>' +
      '<default>default</default>' +
      '</switch>' +
      '</component>'

    return parse(template, {a: 3, b: 2}).should.equal('first')
  })

  it ('bits operations', function () {
    var template =
      '<component>' +
      '<variable name={$flag1} value={1 << 0} />' +
      '<variable name={$flag2} value={1 << 1} />' +
      '<variable name={$flag3} value={1 << 2} />' +
      '<variable name={$mix} value={$flag1 | $flag2} />' +
      '<if test={$mix & $flag1}>1</if>' +
      '<if test={$mix & $flag2}>2</if>' +
      '<if test={$mix & $flag3}>3</if>' +
      '<if test={$mix | $flag1}>4</if>' +
      '<if test={$mix | $flag2}>5</if>' +
      '<if test={$mix | $flag3}>6</if>' +
      '<variable name={$mix} value={$mix & ~$flag1} />' +
      '<if test={$mix & $flag1}>7</if>' +
      '<variable name={$mix} value={1 | 1 << 1 | 1 << 2 | 1 << 3} />' +
      '<if test={$mix & $flag3}>8</if>' +
      '<variable name={$mix} value={$mix & ~(1 << 2)} />' +
      '<if test={$mix & $flag3}>9</if>' +
      '{15 ^ 7}' +
      '</component>'

    return parse(template).should.equal('1245688')
  })

  it ('import and inlude', function () {
    var tempAsideName = generateName()

    return writeFile(tempPath + tempAsideName, '<component><aside>{$children}</aside></component>')
      .then(function () {
        var template =
          '<component>' +
          '<import name="aside-component" from="./tmp/' + tempAsideName + '" />' +
          '<div>' +
          '<aside-component>' +
          '<h1>Hello</h1>' +
          '</aside-component>' +
          '</div>' +
          '</component>'

        return parse(template)
      })
      .should.eventually.equal('<div><aside><h1>Hello</h1></aside></div>')
  })

  it ('include with recursive parameters for single tag', function () {
    var tempCommentsName = generateName()
    var template =
      '<component>' +
      '<import name="user-comments" from="./' + tempCommentsName + '" />' +
      '<for-each item={$comment} from={$comments}>' +
      '<div>' +
      '{$comment.name}' +
      '<div>' +
      '<user-comments comments={$comment.children} />' +
      '</div>' +
      '</div>' +
      '</for-each>' +
      '</component>'
    var data = {
      comments: [
        {
          name: 'Aleksei',
          children: [
            {
              name: 'Natasha',
              children: []
            }
          ]
        }
      ]
    }

    return writeFile(tempPath + tempCommentsName, template)
      .then(function () {
        return parse(template, data, './tmp/tmp.tmplt')
      })
      .should.eventually.equal('<div>Aleksei<div><div>Natasha<div></div></div></div></div>')
  })

  it ('include with recursive parameters for couple tag', function () {
    var tempCommentsName = generateName()
    var template =
      '<component>' +
      '<import name="user-comments" from="./' + tempCommentsName + '" />' +
      '<for-each item={$comment} from={$comments}>' +
      '<div>' +
      '{$comment[\'name\']}' +
      '<div>' +
      '<user-comments comments={$comment[\'children\']}></user-comments>' +
      '</div>' +
      '</div>' +
      '</for-each>' +
      '</component>'
    var data = {
      comments: [
        {
          name: 'Aleksei',
          children: [
            {
              name: 'Natasha',
              children: []
            }
          ]
        }
      ]
    }

    return writeFile(tempPath + tempCommentsName, template)
      .then(function () {
        return parse(template, data, './tmp/tmp.tmplt')
      })
      .should.eventually.equal('<div>Aleksei<div><div>Natasha<div></div></div></div></div>')
  })

  it ('include with common scope of template and children', function () {
    var tempWrapName = generateName()
    var tempAsideName = generateName()
    var wrapTemplate =
      '<component>' +
      '<wrap title={$title}>{$children}</wrap>' +
      '</component>'
    var asideTemplate =
      '<component>' +
      '<aside>{$children}<hr />' +
      '</aside>' +
      '</component>'
    var template =
      '<component>' +
      '<import name="wrap-component" from="./' + tempWrapName + '" />' +
      '<import name="aside-component" from="./' + tempAsideName + '" />' +
      '<variable name={$variable} value={1} />' +
      '<wrap-component title="Title of Wrap!">' +
      '<aside-component>' +
      'Text' +
      '<variable name={$variable} value={num_int($variable) + 1} />' +
      '</aside-component>' +
      '</wrap-component>' +
      '{$variable}' +
      '</component>'

    return Promise.all([
      writeFile(tempPath + tempWrapName, wrapTemplate),
      writeFile(tempPath + tempAsideName, asideTemplate)
    ])
      .then(function () {
        return parse(template, {}, './tmp/tmp.tmplt')
      })
      .should.eventually.equal('<wrap title="Title of Wrap!"><aside>Text<hr /></aside></wrap>2')
  })

  it ('output modified children element', function () {
    var tempWrapName = generateName()
    var wrapTemplate =
      '<component>' +
      '<for-each item={$item} from={$children}>' +
      '<if test={$item.tag? && $item.tag == \'item\'}>' +
      '<variable name={$item.tag} value="option" />' +
      '</if>' +
      '{$item}' +
      '</for-each>' +
      '</component>'

    var template =
      '<component>' +
      '<import name={"wrap-component"} from="./' + tempWrapName + '" />' +
      '<wrap-component>' +
      '<item>line1</item>' +
      '<item>line2</item>' +
      '<item>line3</item>' +
      '<item>line4</item>' +
      '</wrap-component>' +
      '</component>'

    return writeFile(tempPath + tempWrapName,  wrapTemplate)
      .then(function () {
        return parse(template, {}, './tmp/tmp.tmplt')
      })
      .should.eventually.equal('<option>line1</option><option>line2</option><option>line3</option><option>line4</option>')
  })

  it ('using template node', function () {
    var template =
      '<component>' +
      '<template name={$sub-template}>' +
      '<item>line1</item>' +
      '<item>line2</item>' +
      '<item>line3</item>' +
      '<item>line4</item>' +
      '</template>' +
      '{$sub-template}' +
      '</component>'

    return parse(template).should.equal('<item>line1</item><item>line2</item><item>line3</item><item>line4</item>')
  })

  it ('using template node', function () {
    var tempWrapName = generateName()
    var wrapTemplate =
      '<component>' +
      '<param name={$sub-template} value={[]} />' +
      '<for-each item={$child} key={$index} from={$sub-template}>' +
      '<div data-index={$index}>{$child}</div>' +
      '</for-each>' +
      '{$children}' +
      '</component>'

    var template =
      '<component>' +
      '<variable name={$amount} value={22} />' +
      '<import name={"wrap-component"} from="./' + tempWrapName + '" />' +
      '<template name={$sub-template}>' +
      '<item>line1</item>' +
      '<item>line{$amount}</item>' +
      '<item>line3</item>' +
      '<item>line4</item>' +
      '</template>' +
      '<wrap-component sub-template={$sub-template}>' +
      'text as children' +
      '</wrap-component>' +
      '</component>'

    return writeFile(tempPath + tempWrapName, wrapTemplate)
      .then(function () {
        return parse(template, {}, './tmp/tmp.tmplt')
      })
      .should.eventually.equal(
        '<div data-index="0"><item>line1</item></div><div data-index="1"><item>line22</item></div>' +
        '<div data-index="2"><item>line3</item></div><div data-index="3"><item>line4</item></div>' +
        'text as children'
      )
  })

  it ('variables with dash', function () {
    var template =
      '<component>' +
      '<variable name={$variable-with-dash} value={1} />' +
      '{$variable-with-dash + 1}' +
      '{$variable-with-dash - 1}' +
      '</component>'

    return parse(template).should.equal('20')
  })

  it ('classes helper ', function () {
    var template = '<div class={classes("block", "element")}></div>'
    parse(template).should.equal('<div class="block element"></div>')

    template = '<div class={classes("block", $param)}></div>'
    parse(template).should.equal('<div class="block"></div>')

    template =
      '<variable name={$class} value="element" />' +
      '<div class={classes("block", $class)}></div>'
    parse(template).should.equal('<div class="block element"></div>')
  })
})
