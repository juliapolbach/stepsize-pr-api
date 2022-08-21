import { injectable } from 'tsyringe'
import { Octokit } from 'octokit'
import { GithubPullRequest, MergePullRequestResponse, PullRequestIdentifier } from './types'
import { WrapperInterface } from './wrapper.interface'
import { PullRequest, Status } from '../../pullRequest/domain/models/pullRequestTypes'
import { Helper } from '../helper'

require('dotenv').config()

@injectable()
export class GithubWrapper implements WrapperInterface {
  private octokit

  constructor () {
    this.octokit = new Octokit({ auth: process.env.GITHUB_API })
  }

  async checkAuth (): Promise<string> {
    const {
      data: { login }
    } = await this.octokit.rest.users.getAuthenticated()
    return `Hello, ${login}`
  }

  async getPullRequestById (id: PullRequestIdentifier): Promise<PullRequest> {
    const rawPullRequest = await this.octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
      owner: process.env.OWNER,
      repo: id.repoName,
      pull_number: id.pullRequestId
    })

    const isMergeable = await this.isMergeable({ repoName: id.repoName, pullRequestId: id.pullRequestId })
    const pullRequest = Helper.mapGithubPullRequest(rawPullRequest.data, id.repoName, isMergeable)

    // force isMergeable to false when PR status is 'merged' and isMergeable returns null
    if (pullRequest.status === Status.merged && pullRequest.isMergeable === null) pullRequest.isMergeable = false

    return pullRequest
  }

  async getPullRequestListByRepositoryName (repoName: string): Promise<PullRequest[]> {
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner: process.env.OWNER,
      repo: repoName,
      state: 'all'
    })

    const pullRequestList: PullRequest[] = []
    const rawPullRequestList: GithubPullRequest[] = response.data

    for (const rawPullRequest of rawPullRequestList) {
      const isMergeable = await this.isMergeable({ repoName, pullRequestId: rawPullRequest.number })
      pullRequestList.push(Helper.mapGithubPullRequest(rawPullRequest, repoName, isMergeable))
    }

    return pullRequestList
  }

  async mergePullRequest (id: PullRequestIdentifier): Promise<MergePullRequestResponse> {
    return await this.octokit.request('PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge', {
      owner: process.env.OWNER,
      repo: id.repoName,
      pull_number: id.pullRequestId
    })
  }

  async isMergeable (id: PullRequestIdentifier): Promise<boolean> {
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
      owner: process.env.OWNER,
      repo: id.repoName,
      pull_number: id.pullRequestId
    })

    return response.data.mergeable
  }
}
