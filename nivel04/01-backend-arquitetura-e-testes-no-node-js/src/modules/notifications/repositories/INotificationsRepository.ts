import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO'
import Notification from '../infra/typeorm/schemas/Notification'

export default interface INotificationsRepository {
  create(date: ICreateNotificationDTO): Promise<Notification>
}