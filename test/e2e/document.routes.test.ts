import { buildTestServer } from '../buildTestServer'
import { InjectOptions } from 'fastify'

describe('Document routes should', () => {
  const { server, finishServer } = buildTestServer()
  const requestGetOptions: InjectOptions = {
    url: '/api/test/',
    method: 'GET',
    headers: {
      token: 'irrelevant'
    }
  }
  const requestPostOptions: InjectOptions = {
    url: '/api/test/',
    method: 'POST',
    headers: {
      token: 'irrelevant'
    },
    payload: { test: 'test' }
  }

  afterAll(async () => await finishServer())

  describe('response have X-Alterna-Project header', () => {
    it('with GET', async () => {
      const response = await server.inject(requestGetOptions)

      expect(response.headers['x-alterna-project']).not.toBeUndefined()
      expect(response.headers['x-alterna-project']).toBe('Alterna Boilerplate API')
    })
    it('with POST', async () => {
      const response = await server.inject(requestPostOptions)

      expect(response.headers['x-alterna-project']).not.toBeUndefined()
      expect(response.headers['x-alterna-project']).toBe('Alterna Boilerplate API')
    })
  })

  describe('return status 200 ', () => {
    describe('with the mandatory param', () => {
      it('with GET', async () => {
        const response = await server.inject(requestGetOptions)

        const body = JSON.parse(response.body)
        expect(response.statusCode).toBe(200)
        expect(body.statusCode).toBe(200)
        expect(body.message).toContain('Boilerplate API')
      })

      it('with POST', async () => {
        const response = await server.inject(requestPostOptions)

        const body = JSON.parse(response.body)
        expect(response.statusCode).toBe(200)
        expect(body.statusCode).toBe(200)
        expect(body.message).toContain('Boilerplate API')
      })
    })
    describe('with the mandatory param and other optional param', () => {
      it('with GET', async () => {
        const response = await server.inject({ ...requestGetOptions, url: '/api/test/irrelevant' })

        const body = JSON.parse(response.body)
        expect(response.statusCode).toBe(200)
        expect(body.statusCode).toBe(200)
        expect(body.message).toContain('Boilerplate API')
      })

      it('with POST', async () => {
        const response = await server.inject({ ...requestPostOptions, url: '/api/test/more-irrelevant' })

        const body = JSON.parse(response.body)
        expect(response.statusCode).toBe(200)
        expect(body.statusCode).toBe(200)
        expect(body.message).toContain('param: "test"')
        expect(body.message).toContain('Boilerplate API')
      })
    })
  })

  describe('return status 400 if bad request', () => {
    it('with GET', async () => {
      const response = await server.inject({ ...requestGetOptions, url: '/api/wrongName/' })

      const body = JSON.parse(response.body)
      expect(response.statusCode).toBe(400)
      expect(body.statusCode).toBe(400)
      expect(body.message).toBe('')
    })

    it('with POST', async () => {
      const response = await server.inject({ ...requestPostOptions, url: '/api/wrongName/' })

      const body = JSON.parse(response.body)
      expect(response.statusCode).toBe(400)
      expect(body.statusCode).toBe(400)
      expect(body.message).toBe('')
    })
  })

  describe('return status 401 if token provided not equal to expected', () => {
    it('with GET', async () => {
      const response = await server.inject({
        ...requestGetOptions,
        headers: {
          token: 'expected'
        }
      })

      const body = JSON.parse(response.body)
      expect(response.statusCode).toBe(401)
      expect(body.statusCode).toBe(401)
      expect(body.error).toBe('Unauthorized')
      expect(body.message).toBe('Not authorized token')
    })

    it('with POST', async () => {
      const response = await server.inject({
        ...requestPostOptions,
        headers: {
          token: 'expected'
        }
      })

      const body = JSON.parse(response.body)
      expect(response.statusCode).toBe(401)
      expect(body.statusCode).toBe(401)
      expect(body.error).toBe('Unauthorized')
      expect(body.message).toBe('Not authorized token')
    })
  })

  describe('return status 404 if does not exists route', () => {
    it('with GET', async () => {
      const response = await server.inject({ ...requestGetOptions, url: '/apiAA/boilerplate/' })

      const body = JSON.parse(response.body)
      expect(response.statusCode).toBe(404)
      expect(body.statusCode).toBe(404)
      expect(body.error).toBe('Not Found')
      expect(body.message).toBe('Route GET:/apiAA/boilerplate/ not found')
    })

    it('with POST', async () => {
      const response = await server.inject({ ...requestPostOptions, url: '/apiAA/boilerplate/' })

      const body = JSON.parse(response.body)
      expect(response.statusCode).toBe(404)
      expect(body.statusCode).toBe(404)
      expect(body.error).toBe('Not Found')
      expect(body.message).toBe('Route POST:/apiAA/boilerplate/ not found')
    })
  })

  it('return status 500 if not exists body', async () => {
    const response = await server.inject({ ...requestPostOptions, payload: {} })

    const body = JSON.parse(response.body)
    expect(response.statusCode).toBe(500)
    expect(body.statusCode).toBe(500)
    expect(body.error).toBe('Unknown error')
    expect(body.message).toBe('body should have required property \'test\'')
  })
})
