import express, { Express } from 'express'
import { router as travelsRouter } from './travels.router'
import { router as usersRouter} from './users.route'
import { router as placesRouter } from './places.router'
import { router as countriesRouter } from './countries.router'

export const routerApi = (app: Express) => {
  const router = express.Router()
  app.use('/api', router)
  router.use('/travels', travelsRouter)
  router.use('/users', usersRouter)
  router.use('/places', placesRouter)
  router.use('/countries', countriesRouter)
}
