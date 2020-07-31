import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO'

import Notification from '../../infra/typeorm/schemas/Notification'
import { ObjectID } from 'mongodb'

class NotificationsRepository implements INotificationsRepository {
  private notification: Notification[] = []

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification()

    Object.assign(notification, { id: new ObjectID(), content, recipient_id })

    await this.notification.push(notification)

    return notification
  }
}

export default NotificationsRepository
