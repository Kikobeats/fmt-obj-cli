#!/usr/bin/env node
'use strict'

const loadJsonFile = require('load-json-file')
const {createFormatter} = require('fmt-obj')
const getStdin = require('get-stdin')
const chalk = require('chalk')
const path = require('path')

const pkg = require('../package.json')
require('update-notifier')({pkg}).notify()

const cli = require('meow')({
  pkg: pkg,
  help: require('fs').readFileSync(path.join(__dirname, 'help.txt'), 'utf8')
})

getStdin()
  .then(stdin => {
    if (cli.input[0]) return loadJsonFile(cli.input[0])
    if (stdin) return JSON.parse(stdin)
  })
  .then(json => {
    if (!json) return cli.showHelp()
    const {offset = 2, depth = Infinity} = cli.flags

    const format = createFormatter({
      offset,
      formatter: {
        punctuation: chalk.gray,
        annotation: chalk.gray,
        property: chalk.green,
        literal: chalk.magenta,
        number: chalk.cyan,
        string: chalk.bold
      }
    })

    const output = format(json, depth)
    process.stdout.write(output.toString())
  })
