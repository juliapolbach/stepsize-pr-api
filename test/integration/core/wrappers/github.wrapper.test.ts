import { GithubWrapper } from '../../../../lib/core/wrappers/github.wrapper'

describe('Github Wrapper should', () => {
  it('correctly authenticate', async () => {
    const response = await new GithubWrapper().checkAuth()

    expect(response).toEqual('Hello, juliapolbach')
  })

  describe('getPullRequestById method should', () => {
    it('given an id, return a PullRequest', async () => {
      const response = await new GithubWrapper().getPullRequestById({ repoName: 'repository-1', pullRequestId: 5 })

      expect(response.id).toEqual(1028768242)
      expect(response.title).toEqual('✨ Add new cool feature')
      expect(response.isMergeable).toEqual(true)
    })
  })

  describe('getPullRequestListByRepositoryName method should', () => {
    it('given a repository name, return PR list', async () => {
      const response = await new GithubWrapper().getPullRequestListByRepositoryName('repository-1')

      expect(response.length).toEqual(5)
      expect(response[0].title).toEqual('✨ Add new cool feature')
      expect(response[0].isMergeable).toEqual(true)
    })
    it('given a nonexistent repository name, return empty', async () => {
      try {
        await new GithubWrapper().getPullRequestListByRepositoryName('nonexistent-repo')
      } catch (err: any) {
        expect(err.response.data.message).toEqual('Not Found')
      }
    })
  })

  describe('mergePullRequest method should', () => {
    /* const mockedResponse: Promise<MergePullRequestResponse> = new Promise((resolve) => {
      const result: MergePullRequestResponse = {
        merged: true,
        message: 'Pull Request successfully merged'
      }
      resolve(result)
    })
*/
    // const GithubWrapperInstance = new GithubWrapper()
    it.skip('given an id of a mergeable PR, merge the PR', async () => {
      // TODO: mock
      // const spy = jest.spyOn(GithubWrapperInstance, 'mergePullRequest')
      // spy.mockReturnValue(mockedResponse)

      const response = await new GithubWrapper().mergePullRequest({ repoName: 'repository-1', pullRequestId: 4 })

      expect(response.merged).toEqual(true)
      expect(response.message).toEqual('Pull Request successfully merged')
      // spy.mockRestore()
    })
    it.skip('given an if of a non mergeable PR, don\'t merge the PR', async () => {
      const response = await new GithubWrapper().mergePullRequest({ repoName: 'repository-1', pullRequestId: 2 })

      expect(response.merged).toEqual(false)
      expect(response.message).toEqual('Pull Request successfully merged')
    })
    it.skip('given a nonexistent repository name, return error message', async () => {
      try {
        await new GithubWrapper().mergePullRequest({ repoName: 'nonexistent-repo', pullRequestId: 1 })
      } catch (err: any) {
        console.debug(err.data)
        expect(err.data).toEqual('Not found')
      }
    })
  })

  describe('isMergeable method should', () => {
    it('return isMergeable value', async () => {
      const response = await new GithubWrapper().isMergeable({ repoName: 'repository-1', pullRequestId: 5 })

      expect(response).toEqual(true)
    })
  })
})
