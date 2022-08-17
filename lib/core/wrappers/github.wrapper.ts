import { injectable } from 'tsyringe'
import { Octokit } from 'octokit'
import { GithubPullRequest, MergePullRequestResponse, PullRequest, PullRequestIdentifier } from './types'
import { CodeHostingProviderAPIWrapper } from './codeHostingProviderAPIWrapper'

require('dotenv').config()

@injectable()
export class GithubWrapper implements CodeHostingProviderAPIWrapper {
  private octokit

  constructor () {
    this.octokit = new Octokit({ auth: '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' })
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

    return this.mapPullRequest(rawPullRequest.data, id.repoName, isMergeable)
  }

  async getPullRequestListByRepositoryName (repoName: string): Promise<PullRequest[]> {
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner: process.env.OWNER,
      repo: repoName,
      state: 'all'
    })

    const pullRequestList: PullRequest[] = []

    for (const rawPullRequest of response.data) {
      const isMergeable = await this.isMergeable({ repoName, pullRequestId: rawPullRequest.number })

      pullRequestList.push({
        id: rawPullRequest.id,
        repository: {
          name: repoName
        },
        title: rawPullRequest.title,
        description: rawPullRequest.body,
        isMergeable,
        status: rawPullRequest.state,
        createdAt: rawPullRequest.created_at
      })
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

  mapPullRequest (rawPullRequest: GithubPullRequest, repoName: string, isMergeable: boolean): PullRequest {
    return {
      id: rawPullRequest.id,
      repository: {
        name: repoName
      },
      title: rawPullRequest.title,
      description: rawPullRequest.body,
      isMergeable,
      status: rawPullRequest.state,
      createdAt: rawPullRequest.created_at
    }
  }
}
