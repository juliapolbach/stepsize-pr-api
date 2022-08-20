import { Status } from '../domain/models/pullRequestTypes'

const pullRequestResponse = {
  id: { type: 'number' },
  codeHostingProvider: { type: 'enum' },
  repository: { type: 'string' },
  // title: { type: 'string' },
  // description: { type: 'string' },
  isMergeable: { type: 'boolean' },
  status: {
    type: 'enum',
    description: 'The status of the Pull Request',
    enum: [Status.open, Status.closed, Status.merged]
  },
  createdAt: { type: 'date' }
}

const response = {
  statusCode: { type: 'number' },
  message: { type: 'string' },
  data: pullRequestResponse
}

const errorResponse = {
  statusCode: { type: 'number' },
  error: { type: 'string' },
  message: { type: 'string' }
}

const params = {
  param: { type: 'string' }
}

const headers = {
  type: 'object',
  required: ['token'],
  properties: {
    token: { type: 'string' }
  }
}

const schemaResponse = {
  200: {
    type: 'object',
    properties: response,
    default: {
      statusCode: 200,
      message: ''
    }
  },
  400: {
    type: 'object',
    properties: response,
    default: {
      statusCode: 400,
      message: ''
    }
  },
  401: {
    type: 'object',
    properties: errorResponse,
    default: {
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Not authorized token'
    }
  },
  404: {
    type: 'object',
    properties: errorResponse,
    default: {
      statusCode: 404,
      error: 'Not Found',
      message: 'Route GET:/wrongName/boilerplate/ not found'
    }
  },
  500: {
    type: 'object',
    properties: errorResponse,
    default: {
      statusCode: 500,
      error: 'Unexpected error',
      message: 'Database Boom!!!'
    }
  }
}

export const SchemaValidatorGet = {
  params,
  headers,
  response: schemaResponse
}

export const SchemaValidatorWithParam = {
  querystring: {
    name: { type: 'string' }
  }
}

export const SchemaValidatorRequestPayload = {
  params,
  headers,
  payload: {
    type: 'object',
    required: ['test'],
    properties: {
      repositoryName: { type: 'string' },
      pullRequestNumber: { type: 'number' },
      codeHostingProvider: { type: 'enum' }
    }
  },
  response: schemaResponse
}
