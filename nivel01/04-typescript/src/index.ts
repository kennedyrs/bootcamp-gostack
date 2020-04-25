import express from 'express'

import {helloWorld} from './routes'

const app = express()

app.get('/', (request, response) => {
  return response.json({ hi: 'hi'})
})

app.get('hello', helloWorld)


app.listen(3333)