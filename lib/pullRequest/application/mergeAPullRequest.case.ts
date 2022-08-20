import { inject, injectable } from 'tsyringe'
import { UseCase } from '../../core/application/useCase'
import { PullRequestRepository } from '../domain/pullRequest.repository'
import { PullRequestMysqlRepository } from '../infrastructure/pullRequest.mysql.repository'
import { PullRequest } from '../domain/models/pullRequestTypes'
import { GithubWrapper } from '../../core/wrappers/github.wrapper'
import { WrapperInterface } from '../../core/wrappers/wrapper.interface'
import { BitbucketWrapper } from '../../core/wrappers/bitbucket.wrapper'
import { PullRequestIdentifier } from '../../core/wrappers/types'

type Input = PullRequestIdentifier
type Output = Promise<PullRequest | undefined>

@injectable()
export class MergeAPullRequest implements UseCase<Input, Output> {
  constructor (
    @inject(PullRequestMysqlRepository) private pullRequestRepository: PullRequestRepository,
    @inject(GithubWrapper) private githubWrapper: WrapperInterface,
    @inject(BitbucketWrapper) private bitbucketWrapper: WrapperInterface
    // When needed, add new CodeHostingProviders wrappers here
  ) {}

  async exec (input: Input): Output {
    console.debug()
    const id = { repoName: input.repoName, pullRequestId: input.pullRequestId }
    const trackedPullRequest: PullRequest | null = await this.pullRequestRepository.getTrackedPullRequestById(id)

    if (trackedPullRequest === null) {
      throw new Error(`Can't merge PR with ID ${input.repoName} from ${input.pullRequestId}. Not previously tracked`)
    }

    const result = await this[`${trackedPullRequest.codeHostingProvider}Wrapper`].mergePullRequest(id)

    if (result.merged) {
      await this.pullRequestRepository.mergePullRequest(id, trackedPullRequest)
      return trackedPullRequest
    }
  }
}
