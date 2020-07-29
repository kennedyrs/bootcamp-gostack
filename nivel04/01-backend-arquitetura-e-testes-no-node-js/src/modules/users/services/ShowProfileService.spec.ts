import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import ShowProfileService from './ShowProfileService'

import AppError from '@shared/errors/AppError'

let fakeUserRepository: FakeUsersRepository
let showProfileService: ShowProfileService

describe('Show user profile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository()

    showProfileService = new ShowProfileService(fakeUserRepository)
  })

  it('should be able to show a user profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'Batman',
      email: 'batman@gothan.com',
      password: '12341234',
    })

    const profile = await showProfileService.execute({
      user_id: user.id,
    })

    expect(profile.name).toBe('Batman')
    expect(profile.email).toBe('batman@gothan.com')
  })

  it('should not be able to show a non existing user profile', async () => {
    expect(
      showProfileService.execute({
        user_id: 'user.id',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
