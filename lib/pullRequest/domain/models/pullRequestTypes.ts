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
