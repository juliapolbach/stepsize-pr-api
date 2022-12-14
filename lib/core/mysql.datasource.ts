import { singleton } from 'tsyringe'
import mysql, { Pool } from 'mysql2/promise.js'

@singleton()
export class MySQLDatasource {
  pool: Pool

  constructor () {
    this.pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'stepsize',
      port: 33060,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
  }
}
