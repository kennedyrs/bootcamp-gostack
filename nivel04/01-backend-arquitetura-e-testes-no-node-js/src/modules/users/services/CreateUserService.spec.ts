import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import CreateUserService from './CreateUserService'
import AppError from '@shared/errors/AppError'

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    )

    const user = await createUser.execute({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a new user with same email', async () => {
    const fakeUserRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    )

    await createUser.execute({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    expect(
      createUser.execute({
        name: 'Batman',
        email: 'batman@gothan.com',
        password: '12341234',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
