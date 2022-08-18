import { injectable } from 'tsyringe'
import { Helper, MySQLDatasource } from '../../core'
import { PullRequestRepository } from '../domain/pullRequest.repository'
import { PullRequest } from '../domain/models/pullRequestTypes'
import { PullRequestIdentifier } from '../../core/wrappers/types'

@injectable()
export class PullRequestMysqlRepository implements PullRequestRepository {
  constructor () {}

  async getTrackedPullRequestList (): Promise<PullRequest[]> {
    const db = new MySQLDatasource()
    const pullRequestList: PullRequest[] = []

    const [rows] = await db.pool.query(
      `SELECT r.*, pr.* from repository r
           INNER JOIN pull_request pr on pr.repository = r.id`)

    await db.pool.end()

    const rawPullRequestList = JSON.parse(JSON.stringify(rows))

    for (const rawPullRequest of rawPullRequestList) {
      pullRequestList.push(Helper.mapDatabasePullRequest(rawPullRequest))
    }
    return pullRequestList
  }

  async getTrackedPullRequestById (id: PullRequestIdentifier): Promise<PullRequest> {
    const db = new MySQLDatasource()

    const [rows] = await db.pool.query(
      `SELECT * from pull_request pr
           inner join repository r on r.id = pr.repository
           WHERE r.name = ? AND pr.pull_request_number = ?`, [id.repoName, id.pullRequestId])

    await db.pool.end()

    const rawPullRequest = JSON.parse(JSON.stringify(rows))

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
}
