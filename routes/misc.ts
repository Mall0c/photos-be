import express, { Request, Response } from 'express'
import { Activities } from '../modules/Misc/Activities'
import { loggedIn } from '../common/Middleware'

export const router = express.Router()

router
    .get('/activities/:type', async (req: Request, res: Response) => {
        return await new Activities().getLatestActivities(req, res)
    })
    .get('/activities/:type/:userId', loggedIn, async (req: Request, res: Response) => {
        return await new Activities().getLatestActivities(req, res)
    })