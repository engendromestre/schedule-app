import { ICreate } from '../interfaces/ScheduleInterface'
import { isBefore, startOfHour } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { ScheduleRepository } from '../repositories/ScheduleRepository'

class ScheduleService {
    private scheduleRepository: ScheduleRepository

    constructor() {
        this.scheduleRepository = new ScheduleRepository()
    }

    private async validate(date: Date) {
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
        const checkIsAvailable = await this.scheduleRepository.find(hourStart)
        if (checkIsAvailable) {
            throw new Error('Schedule date is not available')
        }
        return hourStart
    }

    async create({ name, phone, date }: ICreate) {
        const hourStart = await this.validate(date)
        const create = await this.scheduleRepository.create({
            name,
            phone,
            date: hourStart,
        })
        return create
    }

    async update(id: string, date: Date) {
        const hourStart = await this.validate(date)
        const result = await this.scheduleRepository.update(id, hourStart)
        return result
    }

    async delete() {}

    async index(date: Date) {
        const result = await this.scheduleRepository.findAll(date)
        console.log(result)
        return result
    }
}

export { ScheduleService }
