import { Request, Response, NextFunction } from 'express'
import { ScheduleService } from '../services/ScheduleService'
import { parseISO } from 'date-fns'

class ScheduleController {
    private scheduleService: ScheduleService
    constructor() {
        this.scheduleService = new ScheduleService()
    }

    async store(request: Request, response: Response, next: NextFunction) {
        const { name, phone, date } = request.body
        try {
            const result = await this.scheduleService.create({
                name,
                phone,
                date,
            })
            return response.status(201).json(result)
        } catch (error) {
            next(error)
        }
    }
    async index(request: Request, response: Response, next: NextFunction) {
        const { date } = request.query
        const parseDate = date ? parseISO(date.toString()) : new Date()
        try {
            const result = await this.scheduleService.index(parseDate)
            return response.json(result)
        } catch (error) {
            next(error)
        }
    }
    async update(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params
        const { date } = request.body 
        try {
             const result = await this.scheduleService.update(id, date)
             return response.json(result)
        } catch (error) {
            next(error)   
        }
    }
    async delete(request: Request, response: Response, next: NextFunction) {}
}

export { ScheduleController }