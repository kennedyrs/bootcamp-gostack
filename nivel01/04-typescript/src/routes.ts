import { Request, Response } from 'express'
import createUser from './services/CreateUser'

export function helloWorld(request: Request, response: Response) {
  const user = createUser({
    name: 'Kennedy', 
    email: 'Kennedy@com.br', 
    password: 'some-safe-pass',
    techs: [
      'NodeJs',
      {
        title: 'NodeJs',
        experience: 1
      }
    ]
  })

  return response.json({ hi: 'hi' })
}