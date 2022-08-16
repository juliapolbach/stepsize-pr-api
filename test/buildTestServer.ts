import { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'
import { MySQLDatasource } from '../lib/core'
import { buildServer } from '../lib/server'

interface ServerTestInstance {
  server: FastifyInstance,
  database: MySQLDatasource,
  finishServer: () => Promise<void>
}

export const buildTestServer = (): ServerTestInstance => {
  const database = new MySQLDatasource()
  container.registerInstance(MySQLDatasource, database)
  const server = buildServer()

  return {
    server,
    database,
    finishServer: async () => {
      // await database.end()
      await server.close()
    }
  }
}
