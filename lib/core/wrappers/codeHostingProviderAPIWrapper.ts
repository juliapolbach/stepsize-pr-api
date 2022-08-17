import { MergePullRequestResponse, PullRequest, PullRequestIdentifier } from './types'

export interface CodeHostingProviderAPIWrapper {
  checkAuth(): Promise<string>
  getPullRequestById(id: PullRequestIdentifier): Promise<PullRequest>
  getPullRequestListByRepositoryName(repositoryName: string): Promise<PullRequest[]>
  isMergeable (id: PullRequestIdentifier): Promise<boolean>
  mergePullRequest(id: PullRequestIdentifier): Promise<MergePullRequestResponse>
}