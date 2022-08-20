import { buildTestServer } from '../buildTestServer'
import { InjectOptions } from 'fastify'
import { CodeHostingProvider, Status } from '../../lib/pullRequest/domain/models/pullRequestTypes'
import { MySQLDatasource } from '../../lib/core'

describe('PullRequest routes:', () => {
  const { server, finishServer } = buildTestServer()

  const requestGetOptions: InjectOptions = {
    url: '/api/pullrequest?repositoryName=repository-1',
    method: 'GET',
    headers: {
      token: 'STEPSIZE'
    }
  }

  const requestTrackOptions: InjectOptions = {
    url: '/api/pullrequest',
    method: 'POST',
    headers: {
      token: 'STEPSIZE'
    },
    payload: {
      repositoryName: 'repository-1',
      pullRequestNumber: 3,
      codeHostingProvider: CodeHostingProvider.github
    }
  }

  afterAll(async () => await finishServer())

  describe('Get PR by Repository Name should', () => {
    it('return status 200 with mandatory param', async () => {
      const response = await server.inject(requestGetOptions)

      const body = JSON.parse(response.body)

      expect(response.statusCode).toBe(200)
      expect(body.statusCode).toBe(200)
      expect(body.data[0].repository.name).toEqual('repository-1')
      expect(body.data[0].status).toBe(Status.merged)
      expect(body.data[0].isMergeable).toBe(false)
    })
  })

  describe('Track PR by Id should', () => {
    it('return status 200 with mandatory body', async () => {
      const response = await server.inject(requestTrackOptions)

      const body = JSON.parse(response.body)

      expect(response.statusCode).toBe(200)
      expect(body.data.repository.name).toEqual('repository-1')
      expect(body.data.id).toEqual(3)
      expect(body.data.codeHostingProvider).toEqual(CodeHostingProvider.github)
      expect(body.data.status).toEqual(Status.closed)

      const db = new MySQLDatasource()
      await db.pool.query(
        `DELETE FROM pull_request
         WHERE code_hosting_provider="${CodeHostingProvider.github}" AND pull_request_number=3;`
      )
      await db.pool.end()
    })
  })
})
