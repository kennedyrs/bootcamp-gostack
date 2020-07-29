import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import UpdateProfileService from './UpdateProfileService'

import AppError from '@shared/errors/AppError'

let fakeUserRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateProfileService: UpdateProfileService

describe('Update user avatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    updateProfileService = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    )
  })

  it('should be able to update the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Robin',
      email: 'robin@gothan.com',
    })

    expect(updatedUser.name).toBe('Robin')
    expect(updatedUser.email).toBe('robin@gothan.com')
  })

  it('should not be able to change the email address already in use', async () => {
    await fakeUserRepository.create({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    const user = await fakeUserRepository.create({
      name: 'Robin',
      email: 'robin@gothan.com',
      password: '12341234',
    })

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Robin',
        email: 'batman@gothan.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Robin',
      email: 'robin@gothan.com',
      old_password: '12341234',
      password: '2424',
    })

    expect(updatedUser.password).toBe('2424')
  })

  it('should not be able to update the password without old_password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Robin',
        email: 'robin@gothan.com',
        password: '2424',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update the password with the wrog password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Robin',
        email: 'robin@gothan.com',
        old_password: 'wrong-password',
        password: '2424',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update a non existing user profile', async () => {
    expect(
      updateProfileService.execute({
        user_id: 'user.id',
        name: 'test',
        email: 'test@test.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
