import { PullRequestMysqlRepository } from '../../../../lib/pullRequest/infrastructure/pullRequest.mysql.repository'
import { PullRequestIdentifier } from '../../../../lib/core/wrappers/types'

describe('PullRequest mysql repository should', () => {
  it('return tracked PRs', async () => {
    const response = await new PullRequestMysqlRepository().getTrackedPullRequestList()

    expect(response[0]).toHaveProperty('createdAt')
    expect(response[0]).toHaveProperty('description')
    expect(response[0]).toHaveProperty('id')
    expect(response[0]).toHaveProperty('isMergeable')
    expect(response[0]).toHaveProperty('repository')
    expect(response[0].repository).toHaveProperty('name')
    expect(response[0]).toHaveProperty('status')
    expect(response[0]).toHaveProperty('title')
  })
  it('return a tracked PR by Id', async () => {
    const id: PullRequestIdentifier = { repoName: 'repository-1', pullRequestId: 1 }
    const response = await new PullRequestMysqlRepository().getTrackedPullRequestById(id)

    expect(response).toHaveProperty('createdAt')
    expect(response).toHaveProperty('description')
    expect(response).toHaveProperty('id')
    expect(response).toHaveProperty('isMergeable')
    expect(response).toHaveProperty('repository')
    expect(response.repository).toHaveProperty('name')
    expect(response).toHaveProperty('status')
    expect(response).toHaveProperty('title')

    expect(response.repository.name).toEqual(id.repoName)
    expect(response.id).toEqual(id.pullRequestId)
  })
})
