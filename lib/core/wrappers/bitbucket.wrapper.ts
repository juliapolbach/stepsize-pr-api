import { injectable } from 'tsyringe'
import { BitbucketPullRequest, MockBitbucketClient, PullRequestIdentifier } from '../../bitbucketMockAPI'
import { WrapperInterface } from './wrapper.interface'
import { MergePullRequestResponse } from './types'
import { PullRequest } from '../../pullRequest/domain/models/pullRequestTypes'
import { Helper } from '../helper'

require('dotenv').config()

@injectable()
export class BitbucketWrapper implements WrapperInterface {
  async checkAuth (): Promise<string> {
    return `Hello, ${process.env.OWNER}`
  }

  async getPullRequestById (id: PullRequestIdentifier): Promise<PullRequest> {
    const rawPullRequest: BitbucketPullRequest = await MockBitbucketClient.getPullRequest(id)

    return Helper.mapBitbucketPullRequest(rawPullRequest)
  }

  async getPullRequestListByRepositoryName (repositoryName: string): Promise<PullRequest[]> {
    const response: BitbucketPullRequest[] = await MockBitbucketClient.getPullRequestListByRepositoryName(repositoryName)
    const pullRequestList: PullRequest[] = []

    for (const rawPullRequest of response) {
      pullRequestList.push(Helper.mapBitbucketPullRequest(rawPullRequest))
    }

    return pullRequestList
  }

  async mergePullRequest (id: PullRequestIdentifier): Promise<MergePullRequestResponse> {
    return await MockBitbucketClient.mergePullRequest(id)
  }

  async isMergeable (id: PullRequestIdentifier): Promise<boolean> {
    return await MockBitbucketClient.isPullRequestMergeable(id)
  }
}
