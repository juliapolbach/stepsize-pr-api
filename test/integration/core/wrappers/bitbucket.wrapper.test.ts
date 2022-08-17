import { BitbucketWrapper } from '../../../../lib/core/wrappers/bitbucket.wrapper'
import { GithubWrapper } from '../../../../lib/core/wrappers/github.wrapper'

describe('Bitbucket Wrapper should', () => {
  it('correctly authenticate', async () => {
    const response = await new BitbucketWrapper().checkAuth()

    expect(response).toEqual('Hello, juliapolbach')
  })

  describe('getPullRequestById method should', () => {
    it('given an id, return a PullRequest', async () => {
      const response = await new BitbucketWrapper().getPullRequestById({ repoName: 'repository-1', pullRequestId: 1 })

      expect(response.id).toEqual(1)
      expect(response.title).toEqual('Feature: Improve CO2 emission calculations for Volkswagen Polo')
      expect(typeof response.isMergeable === 'boolean').toBeTruthy()
    })
  })

  describe('getPullRequestListByRepositoryName method should', () => {
    it('given a repository name, return PR list', async () => {
      const response = await new BitbucketWrapper().getPullRequestListByRepositoryName('repository-1')

      expect(response.length).toEqual(3)
      expect(response[0].title).toEqual('Feature: Improve CO2 emission calculations for Volkswagen Polo')
      expect(typeof response[0].isMergeable === 'boolean').toBeTruthy()
    })
    it('given a nonexistent repository name, return empty', async () => {
      const response = await new BitbucketWrapper().getPullRequestListByRepositoryName('nonexistent-repo')

      expect(response).toEqual([])
    })
  })

  describe('mergePullRequest method should', () => {
    it('given an id of a mergeable PR, merge the PR', async () => {
      const response = await new BitbucketWrapper().mergePullRequest({ repoName: 'repository-1', pullRequestId: 1 })

      expect(response.merged).toEqual(true)
      expect(response.message).toEqual('Pull Request successfully merged')
    })
  })

  describe('isMergeable method should', () => {
    it('return isMergeable value', async () => {
      const response = await new BitbucketWrapper().isMergeable({ repoName: 'repository-1', pullRequestId: 1 })

      expect(typeof response === 'boolean').toBeTruthy()
    })
  })
})
