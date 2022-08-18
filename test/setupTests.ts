// tsyringe requires a reflect polyfill. Please add 'import "reflect-metadata"'
// to the top of your entry point.
import 'reflect-metadata'

// Little fix for Jest for unrecognized encoding
require('iconv-lite').encodingExists('foo')

console.log = () => {}
