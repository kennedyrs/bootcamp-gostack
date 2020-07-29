import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import UpdateUserAvatarService from './UpdateUserAvatarService'

import AppError from '@shared/errors/AppError'

let fakeUserRepository: FakeUsersRepository
let fakeStorageProvider: FakeStorageProvider
let updateUserAvatar: UpdateUserAvatarService

describe('Update user avatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository()
    fakeStorageProvider = new FakeStorageProvider()

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    )
  })

  it('should be able to update a new avatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png',
    })

    expect(user.avatar).toBe('avatar.png')
  })

  it('should not be able to update a new avatar if user not exists', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'batman',
        avatarFilename: 'avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should delete avatar when updating a new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

    const user = await fakeUserRepository.create({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.png',
    })

    expect(deleteFile).toHaveBeenCalledWith('avatar.png')

    expect(user.avatar).toBe('avatar2.png')
  })
})
