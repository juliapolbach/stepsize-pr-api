import 'reflect-metadata'
import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { registerRoutes } from './routes'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
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

function getHttpsOptions () {
  return Environment.isHttpsOptions()
    ? {
        https: {
          allowHTTP1: true, // fallback support for HTTP1
          key: fs.readFileSync(path.join(Environment.getEnvironmentVariables().pathKey, Environment.getEnvironmentVariables().fileKey)),
          cert: fs.readFileSync(path.join(Environment.getEnvironmentVariables().pathCert, Environment.getEnvironmentVariables().fileCert))
        }
      }
    : {}
}

function getDevelopmentOptions () {
  const day = '2020-01-01'

  return Environment.isDevelopment()
    ? {
        logger: {
          level: 'info',
          file: `logs/${day}.log`,
          ignore: 'pid,hostname',
          prettyPrint: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss'
          }
        }
      }
    : {}
}

function registerApiDocs (fastify: FastifyInstance, options: ServerOptions) {
  fastify.register(require('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'Stepsize Pull Requests API',
        description: 'An API to track multiple code hosting providers\' PRs.',
        version: process.env.npm_package_version
      },
      schemes: ['https'],
      consumes: ['application/json'],
      produces: ['application/json']
    },
    host: options.docsHost || '127.0.0.1:3000',
    routePrefix: options.docsRoute || '/docs',
    exposeRoute: true
  })
}
