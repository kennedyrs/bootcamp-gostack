import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

import AppError from '@shared/errors/AppError'

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUserRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    )

    const authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    )

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
    const fakeUserRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    )

    expect(
      authenticateUser.execute({
        email: 'batman@gothan.com',
        password: '12341234',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to authenticate with wrong pass', async () => {
    const fakeUserRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    )

    const authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    )

    await createUser.execute({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    expect(
      authenticateUser.execute({
        email: 'batman@gothan.com',
        password: '99999999',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
