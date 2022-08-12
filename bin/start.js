'use strict'

require('reflect-metadata')
const { buildServer } = require('../build/server')

// This is the entry point of your application.
// You can use `npm run start` or `npm run dev` (on development) to 🔥 fire execution.

// When using `npm run dev`, you'll be using nodemon, that automatically restarts
// node app when file changes are detected, making your life as a programmer, 🤖 easier.

async function runServer (server) {
  server.listen({ port, host }, (err, address) => {
    if (err) {
      throw err
    }
    console.info(`Listening on ${address}`)
  })
}

async function tearDown (server) {
  try {
    console.info('Closing database pool.')
    // close DB here
    console.info('Closing fastify server.')
    server.close()
  } catch (e) {
    console.error('Error closing database pool or fastify server.')
    console.error(e.toString())
    console.error(e.stack)
  }
}
require('dotenv').config()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const docsRoute = process.env.SWAGGER || '/docs'
const docsHost = `${host}:${port}`

const server = buildServer({ docsHost, docsRoute })

runServer(server).catch(console.error)

process.on('exit', () => tearDown(server))
process.on('SIGINT', () => tearDown(server))
