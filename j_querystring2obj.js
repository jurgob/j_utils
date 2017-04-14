#!/usr/bin/env node

var args = process.argv.slice(2)
// console.log(args)
var res = {};
args[0]
  .split('&')
  .map(function(el){ return el.split('=')})
  .forEach(function(el){ res[el[0]] = el[1]  }   )


console.log(res)