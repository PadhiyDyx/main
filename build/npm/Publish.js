#!/usr/bin/env node

'use strict'

const path = require('path')
const fse = require('fs-extra')
const Plugins = require('./Plugins')

class Publish {
  constructor() {
    this.options = {
      verbose: false
    }

    this.getArguments()
  }

  getArguments() {
    if (process.argv.length > 2) {
      const arg = process.argv[2]
      switch (arg) {
        case '-v':
        case '--verbose':
          this.options.verbose = true
          break
        default:
          throw new Error(`Unknown option ${arg}`)
      }
    }
  }

  run() {
    const fseOptions = {
      // Skip copying dot files
      filter(src) {
        return !path.basename(src).startsWith('.')
      }
    }

    // Publish files
    Plugins.forEach(module => {
      fse.copySync(path.resolve(__dirname, '../../', module.from), module.to, fseOptions)

      if (this.options.verbose) {
        console.log(`Copied ${module.from} to ${module.to}`)
      }
    })
  }
}

(new Publish()).run()
