import { inject, injectable } from 'tsyringe'
import { FastifyReply, FastifyRequest } from 'fastify'
import { PullRequestService } from '../domain/pullRequestService'

type Request = FastifyRequest<{Params: {param: string, value?: string }, Querystring: any }>

// Controllers are the entry point 🚪 of any query
// and led the request to the services defined
// in /domain

@injectable()
export class PullRequestController {
  constructor (@inject(PullRequestService) private pullRequestService: PullRequestService) {
  }

  getPullRequestsByRepositoryName (request: FastifyRequest<{Params: {param: string, value?: string }, Querystring: any }>, reply: FastifyReply): Promise<void> {
    return this.getPullRequest(request, reply)
  }

  private async getPullRequest (request: Request, reply: FastifyReply): Promise<void> {
    // @ts-ignore
    const repositoryName: string = request.query.repositoryName
    try {
      const response = await this.pullRequestService.getPullRequests(repositoryName)

      reply.status(200).send({
        statusCode: 200,
        message: response
      })
      request.log.info('OK')
    } catch (error: any) {
      reply.status(500).send({
        statusCode: 500,
        error: 'Unexpected error',
        message: error.message
      })
      request.log.error(error.message)
    }
  }
}
