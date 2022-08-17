import { PullRequestMysqlRepository } from '../../../../../../lib/pullRequest/infrastructure/pullRequest.mysql.repository'

describe('PullRequest mysql repository should', () => {
  it('return tracked PRs', async () => {
    const response = await new PullRequestMysqlRepository().getTrackedPullRequestList('repository-2')

    expect(response[0]).toHaveProperty('createdAt')
    expect(response[0]).toHaveProperty('description')
    expect(response[0]).toHaveProperty('id')
    expect(response[0]).toHaveProperty('isMergeable')
    expect(response[0]).toHaveProperty('repository')
    expect(response[0].repository).toHaveProperty('name')
    expect(response[0]).toHaveProperty('status')
    expect(response[0]).toHaveProperty('title')
    expect(response[0].createdAt).toEqual('2022-08-17T12:33:14.000Z')
    expect(response[0].description).toEqual('')
    expect(response[0].id).toEqual(2)
    expect(response[0].isMergeable).toEqual(null)
    expect(response[0].repository.name).toEqual('repository-2')
    expect(response[0].status).toEqual('open')
    expect(response[0].title).toEqual('Fix: Add some config files')
  })
})
