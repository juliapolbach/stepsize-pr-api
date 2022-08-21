import { injectable } from 'tsyringe'
import { Helper, MySQLDatasource } from '../../core'
import { PullRequestRepository } from '../domain/pullRequest.repository'
import { PullRequest, RawPullRequest } from '../domain/models/pullRequestTypes'
import { PullRequestIdentifier } from '../../core/wrappers/types'

@injectable()
export class PullRequestMysqlRepository implements PullRequestRepository {
  constructor () {}

  async getTrackedPullRequestList (repositoryName: string): Promise<PullRequest[] | []> {
    const db = new MySQLDatasource()
    const pullRequestList: PullRequest[] = []

    const [rows] = await db.pool.query(
      `SELECT r.*, pr.* from repository r
           INNER JOIN pull_request pr on pr.repository = r.id
           WHERE name = ?`, [repositoryName])

    await db.pool.end()

    const rawPullRequestList: RawPullRequest[] = JSON.parse(JSON.stringify(rows))

    for (const rawPullRequest of rawPullRequestList) {
      pullRequestList.push(Helper.mapDatabasePullRequest(rawPullRequest))
    }
    return pullRequestList
  }

  async getTrackedPullRequestById (id: PullRequestIdentifier): Promise<PullRequest | null> {
    const db = new MySQLDatasource()

    const [rows] = await db.pool.query(
      `SELECT * from pull_request pr
           inner join repository r on r.id = pr.repository
           WHERE r.name = ? AND pr.pull_request_number = ?`, [id.repoName, id.pullRequestId])

    await db.pool.end()

    const rawPullRequest: RawPullRequest = JSON.parse(JSON.stringify(rows))

    if (rawPullRequest[0] === undefined) return null
    return Helper.mapDatabasePullRequest(rawPullRequest[0])
  }

  async updatePullRequest (id: PullRequestIdentifier, pullRequest: PullRequest): Promise<void> {
    const db = new MySQLDatasource()

    await db.pool.query(
      `UPDATE pull_request pr
           INNER JOIN repository r on r.id = pr.repository
           SET pr.title=?, pr.status=?
           WHERE r.name=? AND pr.pull_request_number=?;`,
      [pullRequest.title, pullRequest.status, id.repoName, id.pullRequestId]
    )

    await db.pool.end()
  }

  async trackPullRequest (pullRequest: PullRequest): Promise<void> {
    const db = new MySQLDatasource()

    const [repositoryCode] = await db.pool.query(
      `SELECT id from repository r
       WHERE r.name =?;`,
      [pullRequest.repository.name]
    )

    await db.pool.query(
      `INSERT INTO pull_request
           (code_hosting_provider, pull_request_number, repository, title, status, description)
           VALUES(?,?,?,?,?,?);`,
      [pullRequest.codeHostingProvider, pullRequest.id, repositoryCode[0].id, pullRequest.title, pullRequest.status, pullRequest.description]
    )

    await db.pool.end()
  }

  async mergePullRequest (id: PullRequestIdentifier, pullRequest: PullRequest): Promise<void> {
    await this.updatePullRequest(id, pullRequest)
  }
}
