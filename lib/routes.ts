import { pullRequestRoutes } from './pullRequest/infrastructure/pullRequest.routes'

export function registerRoutes (server): void {
  pullRequestRoutes(server)
}
