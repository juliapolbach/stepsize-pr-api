import { CodeHostingProvider, PullRequest, Status } from '../pullRequest/domain/models/pullRequestTypes'
import { BitbucketPullRequest } from '../bitbucketMockAPI'
import { GithubPullRequest } from './wrappers/types'

export class Helper {
  public static mapStateToStatus (state) {
    switch (state.toLowerCase()) {
      case 'open': return Status.open
      case 'closed': return Status.closed
      case 'merged': return Status.merged
      default: throw new Error(`Unmapped PR state ${state}`)
    }
  }

  public static mapGitHubStateToStatus (state, merged) {
    // Determine that, if state is closed and PR was merged,
    // final state can be considered 'merged'
    if (state === 'closed' && merged) state = Status.merged

    switch (state.toLowerCase()) {
      case 'open': return Status.open
      case 'closed': return Status.closed
      case 'merged': return Status.merged
      default: throw new Error(`Unmapped PR state ${state}`)
    }
  }

  public static mapBitbucketPullRequest (rawPullRequest: BitbucketPullRequest): PullRequest {
    return {
      id: rawPullRequest.id,
      codeHostingProvider: CodeHostingProvider.bitbucket,
      repository: {
        name: rawPullRequest.repository.name
      },
      title: rawPullRequest.title,
      description: rawPullRequest.description,
      isMergeable: rawPullRequest.isMergeable,
      status: Helper.mapStateToStatus(rawPullRequest.status),
      createdAt: rawPullRequest.createdAt
    }
  }

  public static mapGithubPullRequest (rawPullRequest: GithubPullRequest, repoName: string, isMergeable: boolean): PullRequest {
    return {
      id: rawPullRequest.id,
      codeHostingProvider: CodeHostingProvider.github,
      repository: {
        name: repoName
      },
      title: rawPullRequest.title,
      description: rawPullRequest.body,
      isMergeable,
      status: Helper.mapGitHubStateToStatus(rawPullRequest.state, rawPullRequest.merged),
      createdAt: rawPullRequest.created_at
    }
  }

  public static mapDatabasePullRequest (rawPullRequest): PullRequest {
    return {
      id: rawPullRequest.pull_request_number,
      codeHostingProvider: rawPullRequest.code_hosting_provider,
      repository: {
        name: rawPullRequest.name
      },
      title: rawPullRequest.title,
      description: '',
      isMergeable: null,
      createdAt: rawPullRequest.creation_date,
      status: rawPullRequest.status
    }
  }
}
