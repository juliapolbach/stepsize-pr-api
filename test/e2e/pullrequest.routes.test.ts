import { buildTestServer } from '../buildTestServer'
import { InjectOptions } from 'fastify'

describe('PullRequest routes:', () => {
  const { server, finishServer } = buildTestServer()

  const requestGetOptions: InjectOptions = {
    url: '/api/pullrequest?repositoryName=repository-1',
    method: 'GET',
    headers: {
      token: 'STEPSIZE'
    }
  }

  afterAll(async () => await finishServer())

  describe('Get PR by Repository Name should', () => {
    it('return status 200 with mandatory param', async () => {
      const response = await server.inject(requestGetOptions)

      const body = JSON.parse(response.body)

      expect(response.statusCode).toBe(200)
      expect(body.statusCode).toBe(200)
      expect(body.message).toContain('repository-1')
    })
  })
})
