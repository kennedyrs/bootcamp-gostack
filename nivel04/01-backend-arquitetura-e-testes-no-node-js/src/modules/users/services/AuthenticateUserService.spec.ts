import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

import AppError from '@shared/errors/AppError'

let fakeUserRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let createUser: CreateUserService
let authenticateUser: AuthenticateUserService

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider)

    authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    )
  })

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    const response = await authenticateUser.execute({
      email: 'batman@gothan.com',
      password: '12341234',
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(user)
  })

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'batman@gothan.com',
        password: '12341234',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to authenticate with wrong pass', async () => {
    await createUser.execute({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    await expect(
      authenticateUser.execute({
        email: 'batman@gothan.com',
        password: '99999999',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
