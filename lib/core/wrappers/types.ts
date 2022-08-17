export type Status = 'OPEN' | 'CLOSED' | 'MERGED'
export const Statuses: Status[] = ['OPEN', 'CLOSED', 'MERGED']

export interface PullRequest {
  id: number
  repository: {
    name: string
  }
  title: string
  description: string
  isMergeable: boolean
  status: Status
  createdAt: Date
}

export interface PullRequestIdentifier {
  repoName: string
  pullRequestId: number
}

export interface MergePullRequestResponse {
  merged: boolean
  message: string
}

export interface GithubPullRequest {
  id: number
  repository: {
    name: string
  }
  title: string
  body: string
  isMergeable: boolean
  state: Status
  // eslint-disable-next-line camelcase
  created_at: Date
}
