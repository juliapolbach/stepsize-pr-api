import { inject, injectable } from 'tsyringe'
import { FastifyReply, FastifyRequest } from 'fastify'
import { GetTrackedPullRequest } from '../application/getTrackedPullRequest.case'

type Request = FastifyRequest<{Params: {param: string, value?: string }, Querystring: any }>

// Controllers are the entry point 🚪 of any query
// and led the request to the services defined
// in /domain

@injectable()
export class PullRequestController {
  constructor (
    @inject(GetTrackedPullRequest) private getTrackedPullRequest: GetTrackedPullRequest
  ) {
  }

  getPullRequestsByRepositoryName (request: FastifyRequest<{Params: {param: string, value?: string }, Querystring: any }>, reply: FastifyReply): Promise<void> {
    return this.getPullRequest(request, reply)
  }

  private async getPullRequest (request: Request, reply: FastifyReply): Promise<void> {
    try {
      const response = await this.getTrackedPullRequest.exec()

      reply.status(200).send({
        statusCode: 200,
        data: response
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
