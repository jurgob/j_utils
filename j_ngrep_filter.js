#!/usr/bin/env node
// var args = process.argv.slice(2)
var argv = require('minimist')(process.argv.slice(2));
var colors = require('colors');

colors.setTheme({
  silly: 'grey',
  input: 'white',
  prompt: 'white',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

var fs = require('fs');
var beautify = require("json-beautify");
var fileName = argv['_'][0]
console.log(argv)
var orOptions = argv['o']
if(orOptions && typeof orOptions === 'string' )
  orOptions = [orOptions]

var andOptions = argv['a']
if(andOptions && typeof andOptions === 'string' )
  andOptions = [andOptions]


var file = fs.readFileSync(fileName).toString()

function removeDuplicateFilter(item, pos, self) {
  return self.indexOf(item) == pos;
}

function beautifyJson(item) {

  var splitted = item.split('\n.\n')
  var header = splitted[0]
  var body = splitted[1]

  var isMatch = orOptionsFilter(item) && andOptionsFilter(item)
  var print_color = isMatch ? 'prompt' : 'silly'
  console.log( '\n\n '+ header[print_color] +' \n.\n' )

  if(body && body[0] === '{'){
    console.log(beautify(JSON.parse(body),null, 2, 100)[print_color])
  } else {
    console.log((body || '\n')[print_color])
  }
}

function orOptionsFilter(el){
  if(orOptions && orOptions.length){
    return orOptions
      .map(function(opt) { return !!el.match(opt)  })
      .reduce(function(el, prev){return el && prev }, true )
  }else {
    return true
  }


}

function andOptionsFilter(el){
  if(orOptions && orOptions.length){
    return orOptions
      .map(function(opt){ return !!el.match(opt)})
      .reduce(function(el, prev){ return el || prev }   , false )
  }else {
    return true
  }

}

var res = file
  .split('\n\n')
  .filter(removeDuplicateFilter)


res
  .forEach(beautifyJson)

