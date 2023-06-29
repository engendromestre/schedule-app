import { ICreate } from '../interfaces/ScheduleInterface'
import { isBefore, startOfHour } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { ScheduleRepository } from '../repositories/ScheduleRepository'

class ScheduleService {
    private scheduleRepository: ScheduleRepository

    constructor() {
        this.scheduleRepository = new ScheduleRepository()
    }

    private async validate(date: Date, user_id: string) {
        const dateFormatted = new Date(date)
        const hourStart = startOfHour(dateFormatted)
        const znDate = zonedTimeToUtc(hourStart, 'America/Sao_Paulo')
        const hour = znDate.getUTCHours()

        if (hour <= 9 || hour >= 18) {
            throw new Error('Opening hours from 9 am to 6 pm')
        }
        if (isBefore(hourStart, new Date())) {
            throw new Error('it is not allowed to schedule old date')
        }
        const checkIsAvailable = await this.scheduleRepository.find(
            hourStart,
            user_id
        )
        if (checkIsAvailable) {
            throw new Error('Schedule date is not available')
        }
        return hourStart
    }

    async create({ name, phone, date, user_id }: ICreate) {
        const hourStart = await this.validate(date, user_id)
        const create = await this.scheduleRepository.create({
            name,
            phone,
            date: hourStart,
            user_id,
        })
        return create
    }

    async update(id: string, date: Date, user_id: string) {
        const hourStart = await this.validate(date, user_id)
        const result = await this.scheduleRepository.update(id, hourStart)
        return result
    }

    async delete(id: string) {
        const checkExists = await this.scheduleRepository.findById(id)

        if (!checkExists) {
            throw new Error('Schedule doenst exists')
        }

        const result = await this.scheduleRepository.delete(id)

        return result
    }

    async index(date: Date) {
        const result = await this.scheduleRepository.findAll(date)
        return result
    }
}

export { ScheduleService }
