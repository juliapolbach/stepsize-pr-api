import { FastifyInstance } from 'fastify'
import { PullRequestController } from './pullRequest.controller'
import { container } from 'tsyringe'
import { SchemaValidatorGet } from './pullRequest.schemaValidator'

// Define here all your API routes 🚴‍
export const pullRequestRoutes = (server: FastifyInstance) => {
  const pullRequestController = container.resolve(PullRequestController)
  server.route({
    url: '/api/:param/:value',
    method: 'GET',
    schema: SchemaValidatorGet,
    handler: pullRequestController.get.bind(pullRequestController)
  })
}
