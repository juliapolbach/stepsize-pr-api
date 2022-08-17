import { BitbucketPullRequest, MergePullRequestResponse, PullRequestIdentifier } from './types'
import { mockPullRequestGenerator } from './mockPullRequestGenerator'
import assert from 'assert'

export class MockBitbucketClient {
  static async isPullRequestMergeable (identifier: PullRequestIdentifier): Promise<boolean> {
    return Promise.resolve(Math.random() < 0.75)
  }

  static async mergePullRequest (identifier: PullRequestIdentifier): Promise<MergePullRequestResponse> {
    return Promise.resolve({ merged: true, message: 'Pull Request successfully merged' })
  }

  static async getPullRequest (identifier: PullRequestIdentifier): Promise<BitbucketPullRequest> {
    return Promise.resolve(mockPullRequestGenerator(identifier))
  }

  static async getPullRequestListByRepositoryName (repoName: string): Promise<BitbucketPullRequest[]> {
    if (repoName !== 'repository-1' && repoName !== 'repository-2') return []

    const arr = [
      {
        repoName,
        pullRequestId: 1
      },
      {
        repoName,
        pullRequestId: 2
      },
      {
        repoName,
        pullRequestId: 3
      }
    ]
    return await Promise.all(
      arr.map(async (identifier: PullRequestIdentifier) => {
        return await MockBitbucketClient.getPullRequest(identifier)
      })
    )
  }
}
