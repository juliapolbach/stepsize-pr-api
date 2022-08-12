import { addHookForValidateToken } from './addHookForValidateToken'
import { FastifyInstance } from 'fastify'
import { ServerOptions } from '../../server'

export function registerHooks (server: FastifyInstance, options: Required <ServerOptions>): void {
  addHookForValidateToken(server, options)

  // Hooks are registered with the fastify.addHook method and allow you to listen
  // to specific events in the application or request/response lifecycle.
  // + info: 📃 https://www.fastify.io/docs/latest/Reference/Hooks/

  // register here as many 🪝 hooks as you want.
}
