import { inject, injectable } from 'tsyringe'
import { FastifyReply, FastifyRequest } from 'fastify'
import { GetTrackedPullRequest } from '../application/getTrackedPullRequest.case'
import { CodeHostingProvider, PullRequestTrackRequest } from '../domain/models/pullRequestTypes'
import { TrackAPullRequest } from '../application/trackAPullRequest.case'
import { MergeAPullRequest } from '../application/mergeAPullRequest.case'
import { PullRequestIdentifier } from '../../core/wrappers/types'

type Request = FastifyRequest<{ Params: {param: string, value? }, Querystring: any }>
type TrackRequest = FastifyRequest<{ Body: { repositoryName: string, pullRequestNumber: number, codeHostingProvider: CodeHostingProvider }; }>
type MergeRequest = FastifyRequest<{ Params: {repository: string, id: number }, Querystring: any }>

// Controllers are the entry point 🚪 of any query
// and led the request to the services defined
// in /domain

@injectable()
export class PullRequestController {
  constructor (
    @inject(GetTrackedPullRequest) private getTrackedPullRequestCase: GetTrackedPullRequest,
    @inject(TrackAPullRequest) private trackAPullRequestCase: TrackAPullRequest,
    @inject(MergeAPullRequest) private mergeAPullRequestCase: MergeAPullRequest

  ) {
  }

  getPullRequestsByRepositoryName (request: Request, reply: FastifyReply): Promise<void> {
    return this.getPullRequestList(request, reply)
  }

  trackAPullRequestById (request: TrackRequest, reply: FastifyReply): Promise<void> {
    return this.trackAPullRequest(request, reply)
  }

  mergeAPullRequestById (request: MergeRequest, reply: FastifyReply): Promise<void> {
    return this.mergeAPullRequest(request, reply)
  }

  private async getPullRequestList (request: Request, reply: FastifyReply): Promise<void> {
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

  private async trackAPullRequest (request: TrackRequest, reply: FastifyReply): Promise<void> {
    try {
      const input: PullRequestTrackRequest = {
        repositoryName: request.body.repositoryName,
        pullRequestNumber: request.body.pullRequestNumber,
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

  private async mergeAPullRequest (request: MergeRequest, reply: FastifyReply): Promise<void> {
    try {
      const input:PullRequestIdentifier = {
        repoName: request.params.repository,
        pullRequestId: request.params.id
      }

      const response = await this.mergeAPullRequestCase.exec(input)

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
