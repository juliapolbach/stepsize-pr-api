import { injectable } from 'tsyringe'
import { MySQLDatasource } from '../../core'
import { PullRequest } from '../../core/wrappers/types'

@injectable()
export class PullRequestMysqlRepository {
  constructor () {}

  async getTrackedPullRequestList (repositoryName: string): Promise<PullRequest[]> {
    const db = new MySQLDatasource()

    const [rows] = await db.pool.query(
      `SELECT r.*, pr.* from repository r
           INNER JOIN pull_request pr on pr.repository = r.id
           WHERE r.name = ${repositoryName}`)

    await db.pool.end()

    const result = JSON.parse(JSON.stringify(rows))

    return result.map((pullRequest) => {
      return {
        id: pullRequest.id,
        repository: {
          name: pullRequest.name
        },
        title: pullRequest.title,
        description: '',
        isMergeable: null,
        createdAt: pullRequest.creation_date,
        status: pullRequest.status
      }
    })
  }
}
