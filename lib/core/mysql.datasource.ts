import { singleton } from 'tsyringe'
import mysql, { Pool } from 'mysql2'

@singleton()
export class MysqlDatasource {
  private pool: Pool

  constructor () {
    this.pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'test',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
  }
}
