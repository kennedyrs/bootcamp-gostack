import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import UpdateUserAvatarService from './UpdateUserAvatarService'

import AppError from '@shared/errors/AppError'

describe('Update user avatar', () => {
  it('should be able to update a new avatar', async () => {
    const fakeUserRepository = new FakeUsersRepository()
    const fakeStorageProvider = new FakeStorageProvider()

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    )

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
    const fakeUserRepository = new FakeUsersRepository()
    const fakeStorageProvider = new FakeStorageProvider()

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    )

    expect(
      updateUserAvatar.execute({
        user_id: 'batman',
        avatarFilename: 'avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should delete avatar when updating a new one', async () => {
    const fakeUserRepository = new FakeUsersRepository()
    const fakeStorageProvider = new FakeStorageProvider()

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    )

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
