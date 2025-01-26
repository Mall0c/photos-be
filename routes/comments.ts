import express, { Request, Response } from 'express'
import { Comments } from '../modules/Comments/Comments'
import { loggedIn } from '../common/Middleware'

export const router = express.Router()

router
    .get('/comments/:img/:page', async (req: Request, res: Response) => {
        return await new Comments().getComments(req, res)
    })
    .post('/comments/:img', loggedIn, async (req: Request, res: Response) => {
        return await new Comments().createComment(req, res)
    })
    .delete('/comments/:id', loggedIn, async (req: Request, res: Response) => {
        return await new Comments().deleteComment(req, res)
    })