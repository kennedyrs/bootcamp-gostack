import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'

import ResetPasswordService from './ResetPasswordService'

import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokenRepository: FakeUserTokenRepository
let fakeHashProvider: FakeHashProvider
let resetPassword: ResetPasswordService

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokenRepository = new FakeUserTokenRepository()
    fakeHashProvider = new FakeHashProvider()

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeHashProvider,
    )
  })

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    const { token } = await fakeUserTokenRepository.generate(user.id)

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    await resetPassword.execute({
      password: '12312333',
      token,
    })

    const updatedUser = await fakeUsersRepository.findById(user.id)

    expect(generateHash).toHaveBeenCalledWith('12312333')
    expect(updatedUser?.password).toBe('12312333')
  })

  it('should not be able to reset the password with non existing token', async () => {
    await expect(
      resetPassword.execute({
        password: '12312333',
        token: 'non-exists ',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset the password with non existing user', async () => {
    const { token } = await fakeUserTokenRepository.generate(
      'non-existing-user',
    )

    await expect(
      resetPassword.execute({
        password: '12312333',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset the password after 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    const { token } = await fakeUserTokenRepository.generate(user.id)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date()

      return customDate.setHours(customDate.getHours() + 3)
    })

    await expect(
      resetPassword.execute({
        password: '12312333',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
