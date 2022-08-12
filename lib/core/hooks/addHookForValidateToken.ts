import { FastifyInstance, FastifyRequest } from 'fastify'
import { ServerOptions } from '../../server'
import { Environment } from '../environment'

export function addHookForValidateToken (server: FastifyInstance, options: Required<ServerOptions>): void {
  server.addHook('onRequest', (request: FastifyRequest, reply, done) => {
    const token = Environment.getEnvironmentVariables().token
    const tokenFromHeader = request.headers.token
    if (!request.url.startsWith(options.docsRoute)) {
      if (tokenFromHeader === undefined || token !== tokenFromHeader || token === '') {
        reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Not authorized token'
        })
      }
    }
    done()
  })
}
