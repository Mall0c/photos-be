import express, { Request, Response } from 'express'
import { Users } from '../modules/Users/Users'
import { loggedIn } from '../common/Middleware'

export const router = express.Router()

router
    .post('/user/register', async (req: Request, res: Response) => {
        return await new Users().register(req, res)
    })
    .post('/user/login', async (req: Request, res: Response) => {
        return await new Users().login(req, res)
    })
    .get('/users/:offset', loggedIn, async (req: Request, res: Response) => {
        return await new Users().getUsers(req, res)
    })
    .post('/user/edit/:userId', loggedIn, async (req: Request, res: Response) => {
        return await new Users().editUser(req, res)
    })
    .delete('/admin/user/:userId', loggedIn, async (req: Request, res: Response) => {
        return await new Users().deleteUser(req, res)
    })