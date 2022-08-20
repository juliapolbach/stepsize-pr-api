import { inject, injectable } from 'tsyringe'
import { FastifyReply, FastifyRequest } from 'fastify'
import { GetTrackedPullRequest } from '../application/getTrackedPullRequest.case'
import { TrackAPullRequest } from '../application/trackAPullRequest.case'
import { PullRequestTrackRequest } from '../domain/models/pullRequestTypes'

type Request = FastifyRequest<{Params: {param: string, value?: string, body?: PullRequestTrackRequest }, Querystring: any }>

// Controllers are the entry point 🚪 of any query
// and led the request to the services defined
// in /domain

@injectable()
export class PullRequestController {
  constructor (
    @inject(GetTrackedPullRequest) private getTrackedPullRequestCase: GetTrackedPullRequest,
    @inject(TrackAPullRequest) private trackAPullRequestCase: TrackAPullRequest
  ) {
  }

  getPullRequestsByRepositoryName (request: FastifyRequest<{Params: {param: string, value?: string }, Querystring: any }>, reply: FastifyReply): Promise<void> {
    return this.getPullRequest(request, reply)
  }

  trackAPullRequestById (request: FastifyRequest<{Params: {param: string, value?: string }, Querystring: any }>, reply: FastifyReply): Promise<void> {
    return this.trackAPullRequest(request, reply)
  }

  private async getPullRequest (request: Request, reply: FastifyReply): Promise<void> {
    try {
      const response = await this.getTrackedPullRequestCase.exec()

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

  private async trackAPullRequest (request: Request, reply: FastifyReply): Promise<void> {
    try {
      const input: PullRequestTrackRequest = {
        // @ts-ignore
        repositoryName: request.body.repositoryName,
        // @ts-ignore
        pullRequestNumber: request.body.pullRequestNumber,
        // @ts-ignore
        codeHostingProvider: request.body.codeHostingProvider
      }

      const response = await this.trackAPullRequestCase.exec(input)

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
