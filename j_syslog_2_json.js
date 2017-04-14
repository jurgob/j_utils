#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2));
var readline = require('readline');
var beautify = require("json-beautify");
var fileName = argv['_'][0]
var inputStream;
if(typeof fileName === 'string'){
  inputStream = require('fs')
    .createReadStream(fileName)
} else {
  inputStream = process.stdin
}

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

var orOptions = argv['o']
if(orOptions && typeof orOptions === 'string' )
  orOptions = [orOptions]

var andOptions = argv['a']
if(andOptions && typeof andOptions === 'string' )
  andOptions = [andOptions]



function printBlock(item) {

  var isMatch = orOptionsFilter(item) && andOptionsFilter(item)
  var print_color = isMatch ? 'prompt' : 'silly'
  var log = item.slice(0,item.indexOf('{') - 1)
  var item = item.slice(item.indexOf('{'))
  var toPrint =beautify(JSON.parse(item),null, 3, 100 )
  console.log( toPrint[print_color]  )

  // if(body && body[0] === '{'){
  //   console.log(beautify(JSON.parse(body),null, 2, 100)[print_color])
  // } else {
  //   console.log((body || '\n')[print_color])
  // }
}

function andOptionsFilter(el){
  if(andOptions && andOptions.length){
    return andOptions
      .map(function(opt) { return !!el.match(opt)  })
      .reduce(function(el, prev){return el && prev }, true )
  }else {
    return true
  }
}

function orOptionsFilter(el){
  if(orOptions && orOptions.length){
    return orOptions
      .map(function(opt){ return !!el.match(opt)})
      .reduce(function(el, prev){ return el || prev }   , false )
  }else {
    return true
  }

}

var rl = readline.createInterface({
  input: inputStream,
  // output: process.stdout
});

var alreadyPrintedBlocks = [];
var curBlock;
var lastLine;
rl.on('line', function (line) {
  printBlock(line)
  // console.log('curBlock ',line)
  // if(!line && !lastLine.index){
  //   if(alreadyPrintedBlocks.indexOf(curBlock)  === -1 ){
  //     alreadyPrintedBlocks.push(curBlock)
  //     console.log('curBlock ',curBlock)
  //     // printBlock(curBlock)
  //   }
  //   curBlock = ""
  // } else {
  //   curBlock += '\n'+line
  // }

  // lastLine = line
});
