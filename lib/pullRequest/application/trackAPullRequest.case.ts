import { inject, injectable } from 'tsyringe'
import { UseCase } from '../../core/application/useCase'
import { PullRequestRepository } from '../domain/pullRequest.repository'
import { PullRequestMysqlRepository } from '../infrastructure/pullRequest.mysql.repository'
import { PullRequest, PullRequestTrackRequest } from '../domain/models/pullRequestTypes'
import { GithubWrapper } from '../../core/wrappers/github.wrapper'
import { WrapperInterface } from '../../core/wrappers/wrapper.interface'
import { BitbucketWrapper } from '../../core/wrappers/bitbucket.wrapper'

type Input = PullRequestTrackRequest
type Output = Promise<PullRequest | null>

@injectable()
export class TrackAPullRequest implements UseCase<Input, Output> {
  constructor (
    @inject(PullRequestMysqlRepository) private pullRequestRepository: PullRequestRepository,
    @inject(GithubWrapper) private githubWrapper: WrapperInterface,
    @inject(BitbucketWrapper) private bitbucketWrapper: WrapperInterface
    // When needed, add new CodeHostingProviders wrappers here
  ) {}

  async exec (Input): Output {
    const id = { repoName: Input.repositoryName, pullRequestId: Input.pullRequestNumber }
    const trackedPullRequest: PullRequest | null = await this.pullRequestRepository.getTrackedPullRequestById(id)

    if (trackedPullRequest !== null) {
      throw new Error(`PR with ID ${Input.pullRequestNumber} from ${Input.repositoryName} (${Input.codeHostingProvider}) already tracked. CreatedAt: ${trackedPullRequest.createdAt}`)
    }

    const hostedPullRequest: PullRequest = await this[`${Input.codeHostingProvider}Wrapper`].getPullRequestById(id)

    await this.pullRequestRepository.trackPullRequest(hostedPullRequest)

    return hostedPullRequest
  }
}
