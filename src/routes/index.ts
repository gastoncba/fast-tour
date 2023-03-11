import express, { Express } from 'express'
import { router as travelsRouter } from './travels.router'
import { router as usersRouter} from './users.route'

export const routerApi = (app: Express) => {
  const router = express.Router()
  app.use('/api', router)
  router.use('/travels', travelsRouter)
  router.use('/users', usersRouter)
}
