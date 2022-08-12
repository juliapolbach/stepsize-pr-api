// This class manages environment variables defined on .env
// and made accessing more friendly 👯‍

export const Environments = {
  Development: 'development',
  Production: 'production'
}

export interface EnvironmentVariables {
  origin: string
  token: string
  pathKey: string
  fileKey: string
  pathCert: string
  fileCert: string
}

export class Environment {
  static isDevelopment () {
    return process.env.NODE_ENV === Environments.Development
  }

  static isProduction () {
    return process.env.NODE_ENV === Environments.Production
  }

  static enableApiDocs () {
    return Environment.isDevelopment() || Environment.hasValue(process.env.SWAGGER)
  }

  static isHttpsOptions () {
    return Environment.hasValue(process.env.PATH_CERTIFICATE_KEY) &&
      Environment.hasValue(process.env.FILE_CERTIFICATE_KEY) &&
      Environment.hasValue(process.env.PATH_CERTIFICATE_CERT) &&
      Environment.hasValue(process.env.FILE_CERTIFICATE_CERT)
  }

  static getEnvironmentVariables (): EnvironmentVariables {
    return {
      origin: process.env.ORIGIN_CORS || '*',
      token: process.env.TOKEN || '',
      pathKey: process.env.PATH_CERTIFICATE_KEY || '',
      fileKey: process.env.FILE_CERTIFICATE_KEY || '',
      pathCert: process.env.PATH_CERTIFICATE_CERT || '',
      fileCert: process.env.FILE_CERTIFICATE_CERT || ''
    }
  }

  private static hasValue (envVar: string | undefined): boolean {
    return envVar !== undefined && envVar !== ''
  }
}
