import { Router } from 'express'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController'
import ProviderMonthAvailabilitycontroller from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilitycontroller'
import ProviderDayAvailabilitycontroller from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilitycontroller'

const providersRouter = Router()

const providersController = new ProvidersController()
const providerDayAvailabilitycontroller = new ProviderDayAvailabilitycontroller()
const providerMonthAvailabilitycontroller = new ProviderMonthAvailabilitycontroller()

providersRouter.use(ensureAuthenticated)

providersRouter.get('/', providersController.index)
providersRouter.get(
  '/:provider_id/month-availability',
  providerMonthAvailabilitycontroller.index,
)
providersRouter.get(
  '/:provider_id/day-availability',
  providerDayAvailabilitycontroller.index,
)

export default providersRouter
