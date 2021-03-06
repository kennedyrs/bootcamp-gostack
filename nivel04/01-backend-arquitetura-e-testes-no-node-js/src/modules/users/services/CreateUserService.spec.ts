import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import CreateUserService from './CreateUserService'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

import AppError from '@shared/errors/AppError'

let fakeCacheProvider: FakeCacheProvider
let fakeUserRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let createUser: CreateUserService

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeCacheProvider = new FakeCacheProvider()

    createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    )
  })

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a new user with same email', async () => {
    await createUser.execute({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    await expect(
      createUser.execute({
        name: 'Batman',
        email: 'batman@gothan.com',
        password: '12341234',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
