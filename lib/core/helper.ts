import { PullRequestType } from '../pullRequest/domain/models/pullRequestType'

export class Helper {
  public static isValidParam (param: string): param is PullRequestType {
    return Object.values(PullRequestType).includes(param as PullRequestType)
  }
}
