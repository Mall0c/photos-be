import express, { Request, Response } from 'express'
import { Activities } from '../modules/Misc/Activities'

export const router = express.Router()

router
    .get('/activities/:type', async (req: Request, res: Response) => {
        return await new Activities().getLatestActivities(req, res)
    })