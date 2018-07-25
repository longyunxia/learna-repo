#!/usr/bin/env node

const program = require('commander');
const ge = require('../src/generate');


/**
 * Usage.
 */

program
  .command('init <name>')
  .alias('i')
  .description('generate project from a template (short-cut alias: "i")')
  .action(function(name){
    ge.run(name);
  });
program.parse(process.argv);