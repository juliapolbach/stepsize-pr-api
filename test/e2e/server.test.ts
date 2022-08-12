import { buildTestServer } from '../buildTestServer'

describe('Server should', () => {
  describe('use protocol', () => {
    it('https if environment certificate variables exists', async () => {
      process.env.PATH_CERTIFICATE_KEY = './test/assets'
      process.env.FILE_CERTIFICATE_KEY = 'localhost.key'
      process.env.PATH_CERTIFICATE_CERT = './test/assets'
      process.env.FILE_CERTIFICATE_CERT = 'localhost.cert'

      const { server: httpsServer } = buildTestServer()

      expect(httpsServer.initialConfig.https).not.toBeUndefined()

      delete process.env.PATH_CERTIFICATE_KEY
      delete process.env.FILE_CERTIFICATE_KEY
      delete process.env.PATH_CERTIFICATE_CERT
      delete process.env.FILE_CERTIFICATE_CERT
    })

    // this test can only be run when the environment variables of the certificates are empty
    xit('http if no environment certificate variables exists', async () => {
      delete process.env.PATH_CERTIFICATE_KEY
      delete process.env.FILE_CERTIFICATE_KEY
      delete process.env.PATH_CERTIFICATE_CERT
      delete process.env.FILE_CERTIFICATE_CERT

      const { server: httpsServer } = buildTestServer()

      expect(httpsServer.initialConfig.https).toBeUndefined()
    })
  })
})
