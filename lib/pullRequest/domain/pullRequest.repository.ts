import { PullRequest } from './models/pullRequestTypes'
import { PullRequestIdentifier } from '../../core/wrappers/types'

export interface PullRequestRepository {
  getTrackedPullRequestList(): Promise<PullRequest[] | []>
  getTrackedPullRequestById(id: PullRequestIdentifier): Promise<PullRequest | null>
  trackPullRequest(pullRequest: PullRequest): Promise<void>
  updatePullRequest(id: PullRequestIdentifier, pullRequest: PullRequest): Promise<void>
  mergePullRequest(id: PullRequestIdentifier, pullRequest: PullRequest): Promise<void>
}
