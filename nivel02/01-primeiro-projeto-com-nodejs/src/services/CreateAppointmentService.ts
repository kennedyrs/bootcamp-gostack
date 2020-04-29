import { startOfHour } from 'date-fns'

import AppointmentsRepository from '../repositories/AppointmentsRepository'
import Appointment from '../models/Appointment'

interface Request {
  provider: string
  date: Date
}

class CreateAppointmentService {
  private appointmentsRepository: AppointmentsRepository

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository
  }

  public execute({ date, provider }: Request): Appointment {
    const appointmentDate = startOfHour(date)

    const findAppointmentInSameDate = this.appointmentsRepository.findByDate(
      appointmentDate,
    )

    if (findAppointmentInSameDate) {
      throw Error('This appointment has already bean taked')
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: appointmentDate,
    })

    return appointment
  }
}

export default CreateAppointmentService
