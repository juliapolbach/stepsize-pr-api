export enum Status {
  open = 'open',
  closed = 'closed',
  merged = 'merged'
}

export enum CodeHostingProvider {
  github = 'github',
  bitbucket = 'bitbucket'
}

export interface PullRequest {
  id: number,
  codeHostingProvider: CodeHostingProvider,
  repository: {
    name: string
  }
  title: string
  description: string
  isMergeable: boolean | null // GitHub can return null for isMergeable
  status: Status
  createdAt: Date
}

export interface RawPullRequest {
  // eslint-disable-next-line camelcase
  pull_request_number: number,
  // eslint-disable-next-line camelcase
  code_hosting_provider: CodeHostingProvider,
  name: string
  title: string
  description: string
  isMergeable: boolean | null
  status: Status
  // eslint-disable-next-line camelcase
  creation_date: Date
}

export interface PullRequestTrackRequest {
  repositoryName: string,
  pullRequestNumber: number,
  codeHostingProvider: CodeHostingProvider
}
