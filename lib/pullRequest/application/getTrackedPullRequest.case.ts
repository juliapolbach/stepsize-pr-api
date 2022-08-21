import { inject, injectable } from 'tsyringe'
import { UseCase } from '../../core/application/useCase'
import { PullRequestRepository } from '../domain/pullRequest.repository'
import { PullRequestMysqlRepository } from '../infrastructure/pullRequest.mysql.repository'
import { PullRequest, Status } from '../domain/models/pullRequestTypes'
import { GithubWrapper } from '../../core/wrappers/github.wrapper'
import { WrapperInterface } from '../../core/wrappers/wrapper.interface'
import { BitbucketWrapper } from '../../core/wrappers/bitbucket.wrapper'

type Input = string
type Output = Promise<PullRequest[]>

@injectable()
export class GetTrackedPullRequest implements UseCase<Input, Output> {
  constructor (
    @inject(PullRequestMysqlRepository) private pullRequestRepository: PullRequestRepository,
    @inject(GithubWrapper) private githubWrapper: WrapperInterface,
    @inject(BitbucketWrapper) private bitbucketWrapper: WrapperInterface
    // When needed, add new CodeHostingProviders wrappers here
  ) {}

  async exec (input: Input): Output {
    const trackedPullRequestList: PullRequest[] = await this.pullRequestRepository.getTrackedPullRequestList(input)
    const updatedPullRequestList: PullRequest[] = []

    for (const trackedPullRequest of trackedPullRequestList) {
      // Consider 'merged' as final state and return data stored in database.
      if (trackedPullRequest.status === Status.merged) {
        trackedPullRequest.isMergeable = false
        updatedPullRequestList.push(trackedPullRequest)
      } else {
        // Check for updates for 'open' and 'closed' states.
        const hostedPullRequest = await this[`${trackedPullRequest.codeHostingProvider}Wrapper`].getPullRequestById({
          repoName: trackedPullRequest.repository.name,
          pullRequestId: trackedPullRequest.id
        })

        if (trackedPullRequest.title !== hostedPullRequest.title || trackedPullRequest.status !== hostedPullRequest.status) {
          // Update data on database
          const id = { repoName: trackedPullRequest.repository.name, pullRequestId: trackedPullRequest.id }
          await this.pullRequestRepository.updatePullRequest(id, hostedPullRequest)
          const updatedPullRequest = await this.pullRequestRepository.getTrackedPullRequestById(id)
          if (updatedPullRequest) {
            updatedPullRequest.isMergeable = hostedPullRequest.isMergeable
            updatedPullRequestList.push(updatedPullRequest)
          }
        } else {
          trackedPullRequest.isMergeable = hostedPullRequest.isMergeable
          updatedPullRequestList.push(trackedPullRequest)
        }
      }
    }
    return updatedPullRequestList
  }
}
