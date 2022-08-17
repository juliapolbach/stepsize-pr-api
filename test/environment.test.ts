import { Environment } from '../lib/core/environment'

describe('Environment should', () => {
  it('check Node environment is not at production', () => {
    expect(Environment.isProduction()).not.toBeTruthy()
  })
})
