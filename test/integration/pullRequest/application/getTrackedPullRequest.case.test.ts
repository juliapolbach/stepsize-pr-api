import { container } from 'tsyringe'
import { PullRequestMysqlRepository } from '../../../../lib/pullRequest/infrastructure/pullRequest.mysql.repository'
import { GetTrackedPullRequest } from '../../../../lib/pullRequest/application/getTrackedPullRequest.case'
import { GithubWrapper } from '../../../../lib/core/wrappers/github.wrapper'
import { BitbucketWrapper } from '../../../../lib/core/wrappers/bitbucket.wrapper'
import { Helper, MySQLDatasource } from '../../../../lib/core'
import { Status } from '../../../../lib/pullRequest/domain/models/pullRequestTypes'
import { PullRequestIdentifier } from '../../../../lib/core/wrappers/types'

describe('Get tracked pull request case should', () => {
  const repository = new PullRequestMysqlRepository()
  container.registerInstance(PullRequestMysqlRepository, repository)
  const pullRequestMysqlRepository = container.resolve(PullRequestMysqlRepository)
  const githubWrapper = container.resolve(GithubWrapper)
  const bitbucketWrapper = container.resolve(BitbucketWrapper)

  it('return all tracked PRs with data up-to-date', async () => {
    const response = await new GetTrackedPullRequest(
      pullRequestMysqlRepository,
      githubWrapper,
      bitbucketWrapper).exec('repository-1')

    expect(response[0].repository.name).toEqual('repository-1')
  })

  it('update PR when title has been updated on host', async () => {
    const id = { repoName: 'repository-1', pullRequestId: 5 }
    const rows = await modifyTrackedPullRequestInDatabase(id, 'title', 'New title')
    const rawPullRequest = JSON.parse(JSON.stringify(rows))

    expect(rawPullRequest.title).toEqual('New title')

    const response = await new GetTrackedPullRequest(
      pullRequestMysqlRepository,
      githubWrapper,
      bitbucketWrapper).exec('repository-1')

    const pullRequest = response.find(pullRequest => pullRequest.repository.name === id.repoName && pullRequest.id === id.pullRequestId)

    expect(pullRequest?.repository.name).toEqual(id.repoName)
    expect(pullRequest?.id).toEqual(id.pullRequestId)
    expect(pullRequest?.title).toEqual('✨ Add new cool feature')
  })

  it('update PR when status has been updated on host', async () => {
    const id = { repoName: 'repository-1', pullRequestId: 4 }
    const rows = await modifyTrackedPullRequestInDatabase(id, 'status', Status.open)
    const rawPullRequest = JSON.parse(JSON.stringify(rows))

    expect(rawPullRequest.repository.name).toEqual(id.repoName)
    expect(rawPullRequest.id).toEqual(id.pullRequestId)
    expect(rawPullRequest.status).toEqual(Status.open)

    const response = await new GetTrackedPullRequest(
      pullRequestMysqlRepository,
      githubWrapper,
      bitbucketWrapper).exec('repository-1')

    const pullRequest = response.find(pullRequest => pullRequest.repository.name === id.repoName && pullRequest.id === id.pullRequestId)

    expect(pullRequest?.repository.name).toEqual(id.repoName)
    expect(pullRequest?.id).toEqual(id.pullRequestId)
    expect(pullRequest?.status).toEqual(Status.merged)
  })
})

async function modifyTrackedPullRequestInDatabase (id: PullRequestIdentifier, param: string, value: string) {
  const db = new MySQLDatasource()

  await db.pool.query(
    `UPDATE pull_request pr
           INNER JOIN repository r on r.id = pr.repository
           SET pr.${param}=?
           WHERE r.name=? AND pr.pull_request_number=?;`,
    [value, id.repoName, id.pullRequestId]
  )

  const [rows] = await db.pool.query(
    `SELECT * from pull_request pr
           inner join repository r on r.id = pr.repository
           WHERE r.name = ? AND pr.pull_request_number = ?`,
    [id.repoName, id.pullRequestId]
  )

  await db.pool.end()

  return Helper.mapDatabasePullRequest(rows[0])
}
