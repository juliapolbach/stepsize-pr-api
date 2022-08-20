import { container } from 'tsyringe'
import { PullRequestMysqlRepository } from '../../../../lib/pullRequest/infrastructure/pullRequest.mysql.repository'
import { GithubWrapper } from '../../../../lib/core/wrappers/github.wrapper'
import { BitbucketWrapper } from '../../../../lib/core/wrappers/bitbucket.wrapper'
import { CodeHostingProvider, PullRequestTrackRequest } from '../../../../lib/pullRequest/domain/models/pullRequestTypes'
import { TrackAPullRequest } from '../../../../lib/pullRequest/application/trackAPullRequest.case'
import { MySQLDatasource } from '../../../../lib/core'

describe('Track a pull request case should', () => {
  const repository = new PullRequestMysqlRepository()
  container.registerInstance(PullRequestMysqlRepository, repository)
  const pullRequestMysqlRepository = container.resolve(PullRequestMysqlRepository)
  const githubWrapper = container.resolve(GithubWrapper)
  const bitbucketWrapper = container.resolve(BitbucketWrapper)

  it('persist a Pull Request in DB', async () => {
    const id: PullRequestTrackRequest = { repositoryName: 'repository-1', pullRequestNumber: 3, codeHostingProvider: CodeHostingProvider.github }

    const response = await new TrackAPullRequest(
      pullRequestMysqlRepository,
      githubWrapper,
      bitbucketWrapper).exec(id)

    expect(response?.title).toEqual('Fix endpoint status response')

    const db = new MySQLDatasource()
    await db.pool.query(
      `DELETE FROM pull_request
         WHERE code_hosting_provider="${CodeHostingProvider.github}" AND pull_request_number=3;`
    )
    await db.pool.end()
  })

  it('throw an error if PR is already tracked', async () => {
    const id: PullRequestTrackRequest = { repositoryName: 'repository-1', pullRequestNumber: 1, codeHostingProvider: CodeHostingProvider.github }

    try {
      await new TrackAPullRequest(
        pullRequestMysqlRepository,
        githubWrapper,
        bitbucketWrapper).exec(id)
    } catch (err: any) {
      expect(err.message).toEqual('PR with ID 1 from repository-1 (github) already tracked. CreatedAt: 2022-08-13T10:14:10.000Z')
    }
  })
})
