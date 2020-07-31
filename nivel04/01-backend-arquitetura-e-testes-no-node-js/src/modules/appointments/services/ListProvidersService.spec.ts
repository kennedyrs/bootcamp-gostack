import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import ListProvidersService from './ListProvidersService'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

// import AppError from '@shared/errors/AppError'

let fakeUserRepository: FakeUsersRepository
let listProvidersService: ListProvidersService
let fakeCacheProvider: FakeCacheProvider

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository()
    fakeCacheProvider = new FakeCacheProvider()

    listProvidersService = new ListProvidersService(
      fakeUserRepository,
      fakeCacheProvider,
    )
  })

  it('should be able to list providers', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    const user2 = await fakeUserRepository.create({
      name: 'Batman 2',
      email: 'batman2@gothan.com',
      password: '12341234',
    })

    const loggedUser = await fakeUserRepository.create({
      name: 'Batman 3',
      email: 'batman3@gothan.com',
      password: '12341234',
    })

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    })

    expect(providers).toEqual([user1, user2])
  })
})
