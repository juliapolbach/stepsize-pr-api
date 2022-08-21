import 'reflect-metadata'
import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { registerRoutes } from './routes'
import dotenv from 'dotenv'
import { registerHooks } from './core/hooks/hook'
import { Environment } from './core/environment'

export type ServerOptions = RouteShorthandOptions & {
  docsHost?: string,
  docsRoute?: string
}

export function buildServer (options: ServerOptions = {}): FastifyInstance {
  dotenv.config()
  const fastify = Fastify({ ...options })

  fastify.register(require('fastify-healthcheck'))

  if (Environment.enableApiDocs()) {
    registerApiDocs(fastify, options)
    fastify.log.info(`Check ${options.docsRoute || '/docs'} for SwaggerUI`)
  }

  registerHooks(fastify, options as Required<ServerOptions>)
  registerRoutes(fastify)

  fastify.setErrorHandler(function (error, request, reply) {
    this.log.error(error.toString())
    reply.status(500).send({
      statusCode: 500,
      error: 'Unknown error',
      message: error.message
    })
  })

  return fastify
}

function registerApiDocs (fastify: FastifyInstance, options: ServerOptions) {
  fastify.register(require('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'Stepsize Pull Requests API',
        description: 'An API to track multiple code hosting providers\' PRs.',
        version: process.env.npm_package_version
      },
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    },
    host: options.docsHost || '127.0.0.1:3000',
    routePrefix: options.docsRoute || '/docs',
    exposeRoute: true
  })
}
