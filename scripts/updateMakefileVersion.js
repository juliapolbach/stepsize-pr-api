#!/usr/bin/env node

const fs = require('fs')
const { version } = require('../package.json')
const { EOL } = require('os')

fs.readFile('./Makefile', (err, text) => {
  if (err) {
    console.error('Error reading Makefile')
    throw err
  }

  const newMakefile = text.toString()
    .split(EOL)
    .map(line => {
      if (line.startsWith('tag =')) {
        return `tag = ${version}`
      }
      return line
    })
    .join(EOL)

  fs.writeFile('./Makefile', newMakefile, (err) => {
    if (err) {
      console.error('Error updating Makefile')
      throw err
    }
    console.log(`Makefile update to version ${version}`)
  })
})
