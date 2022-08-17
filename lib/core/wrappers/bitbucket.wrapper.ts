import { injectable } from 'tsyringe'
import { MockBitbucketClient, BitbucketPullRequest, PullRequestIdentifier } from '../../bitbucketMockAPI'
import { CodeHostingProviderAPIWrapper } from './codeHostingProviderAPIWrapper'
import { MergePullRequestResponse, PullRequest } from './types'
require('dotenv').config()

@injectable()
export class BitbucketWrapper implements CodeHostingProviderAPIWrapper {
  async checkAuth (): Promise<string> {
    return `Hello, ${process.env.OWNER}`
  }

  async getPullRequestById (id: PullRequestIdentifier): Promise<PullRequest> {
    const rawPullRequest: BitbucketPullRequest = await MockBitbucketClient.getPullRequest(id)

    return this.mapPullRequest(rawPullRequest)
  }

  async getPullRequestListByRepositoryName (repositoryName: string): Promise<PullRequest[]> {
    const response: BitbucketPullRequest[] = await MockBitbucketClient.getPullRequestListByRepositoryName(repositoryName)
    const pullRequestList: PullRequest[] = []

    for (const rawPullRequest of response) {
      pullRequestList.push(this.mapPullRequest(rawPullRequest))
    }

    return pullRequestList
  }

  async mergePullRequest (id: PullRequestIdentifier): Promise<MergePullRequestResponse> {
    return await MockBitbucketClient.mergePullRequest(id)
  }

  async isMergeable (id: PullRequestIdentifier): Promise<boolean> {
    return await MockBitbucketClient.isPullRequestMergeable(id)
  }

  mapPullRequest (rawPullRequest: BitbucketPullRequest): PullRequest {
    return {
      id: rawPullRequest.id,
      repository: {
        name: rawPullRequest.repository.name
      },
      title: rawPullRequest.title,
      description: rawPullRequest.description,
      isMergeable: rawPullRequest.isMergeable,
      status: rawPullRequest.status,
      createdAt: rawPullRequest.createdAt
    }
  }
}
