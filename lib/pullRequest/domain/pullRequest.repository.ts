import { PullRequest } from './models/pullRequestTypes'
import { PullRequestIdentifier } from '../../core/wrappers/types'

export interface PullRequestRepository {
  getTrackedPullRequestList(): Promise<PullRequest[]>
  getTrackedPullRequestById(id: PullRequestIdentifier): Promise<PullRequest>
  updatePullRequest(id: PullRequestIdentifier, pullRequest: PullRequest): Promise<void>
}
