import { MergePullRequestResponse, PullRequestIdentifier } from './types'
import { PullRequest } from '../../pullRequest/domain/models/pullRequestTypes'

export interface WrapperInterface {
  checkAuth(): Promise<string>
  getPullRequestById(id: PullRequestIdentifier): Promise<PullRequest>
  getPullRequestListByRepositoryName(repositoryName: string): Promise<PullRequest[]>
  isMergeable (id: PullRequestIdentifier): Promise<boolean>
  mergePullRequest(id: PullRequestIdentifier): Promise<MergePullRequestResponse>
}
