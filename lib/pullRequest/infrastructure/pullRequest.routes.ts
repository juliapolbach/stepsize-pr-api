import { FastifyInstance } from 'fastify'
import { PullRequestController } from './pullRequest.controller'
import { container } from 'tsyringe'
import { SchemaValidatorRequestPayload, SchemaValidatorWithParam } from './pullRequest.schemaValidator'

// Define here all your API routes 🚴‍
export const pullRequestRoutes = (server: FastifyInstance) => {
  const pullRequestController = container.resolve(PullRequestController)
  server.route({
    url: '/api/pullrequest',
    method: 'GET',
    schema: SchemaValidatorWithParam,
    handler: pullRequestController.getPullRequestsByRepositoryName.bind(pullRequestController)
  })
  server.route({
    url: '/api/pullrequest',
    method: 'POST',
    schema: SchemaValidatorRequestPayload,
    handler: pullRequestController.trackAPullRequestById.bind(pullRequestController)
  })
}
