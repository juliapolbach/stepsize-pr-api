import { injectable } from 'tsyringe'
import { PullRequestType } from './models/pullRequestType'

// Services are intended to encapsulate 🗃 the business logic,
// and they are usually called by the controller

type Data = { reference: string }

@injectable()
export class PullRequestService {
  generate (param: PullRequestType, data: Data, value?: string): string {
    return `Boilerplate API:
    param: ${JSON.stringify(param, null, 2)}
    value: ${JSON.stringify(value, null, 2)}
    data: ${JSON.stringify(data, null, 2)}`
  }
}
