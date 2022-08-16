const response = {
  statusCode: { type: 'number' },
  message: { type: 'string' }
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
      message: 'Boilerplate API'
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

export const SchemaValidatorPost = {
  params,
  headers,
  body: {
    type: 'object',
    required: ['test'],
    properties: {
      test: { type: 'string' }
    }
  },
  response: schemaResponse
}
