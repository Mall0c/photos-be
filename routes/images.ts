import express, { Request, Response } from 'express'
import { Images } from '../modules/Images/Images'
import { loggedIn } from '../common/Middleware'

export const router = express.Router()

router
    .get('/images/metadata/:id', async (req: Request, res: Response) => {
        return await new Images().getImageData(req, res)
    })
    .get('/images', async (req: Request, res: Response) => {
        return await new Images().getAllImageIDs(req, res)
    })
    .get('/images/:id', async (req: Request, res: Response) => {
        return await new Images().getImage(req, res, false)
    })
    .get('/images/scaled/:id', async (req: Request, res: Response) => {
        return await new Images().getImage(req, res, true)
    })
    .put('/images/description/:id', loggedIn, async (req: Request, res: Response) => {
        return await new Images().editDescription(req, res)
    })
    .delete('/images/:id', loggedIn, async (req: Request, res: Response) => {
        return await new Images().deleteImage(req, res)
    })