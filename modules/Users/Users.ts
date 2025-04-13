import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Models from '../../models/index'
import { isAdminOrOwner } from '../../common/Middleware'
import { User } from 'models/User.model'

export enum Roles {
    Owner = 0,
    Admin = 1,
    Guest = 2
}

export class Users {
    constructor() {}

    public async register(req: Request, res: Response) {
        const email = req.body.email
        const name = req.body.name

        // TODO Validate, but not with ajv.

        const user = await Models.User.findOne({
            attributes: ['id', 'email', 'name', 'role'],
            where: {
                email: email
            }
        })
        
        if (user) {
            res.status(400)
            return res.json({
                errorcode: 5,
                text: "Name is already in use."
            })
        }

        const password = bcrypt.hashSync(req.body.password, 10)
        const newUser = await Models.User.create({ 
            email: email, 
            name: name, 
            role: Roles.Guest, 
            password: password
        })

        const token = jwt.sign({ 
            id: newUser.dataValues.id, 
            role: Roles.Guest,
            email: req.body.email
        }, "SECRET")
        
        res.status(201)
        return res.json({
            token: token,
            userInfo: {
                name: req.body.name,
                email: req.body.email,
                id: newUser.dataValues.id, 
                role: Roles.Guest
            }
        })
    }

    public async login(req: Request, res: Response) {
        const email = req.body.email
        const password = req.body.password

        // TODO Validate, but not with ajv.

        const user = await Models.User.findOne({
            attributes: ['id', 'email', 'name', 'role', 'password'],
            where: {
                email: email
            }
        })
        
        if (user === undefined) {
            console.log("Hier 1")
            return res.status(401).json({ 
                errorcode: 1,
                text: 'Authentication failed 1' 
            })
        }

        const passwordCheck = await bcrypt.compare(password, user.dataValues.password)
        if (!passwordCheck) {
            return res.status(401).json({ 
                errorcode: 1,
                text: 'Authentication failed 1' 
            })
        }

        const token = jwt.sign({
            id: user.dataValues.id, 
            role: user.dataValues.role,
            email: user.dataValues.email
        }, "SECRET")
        
        res.status(200)
        return res.json({
            token: token,
            userInfo: {
                name: user.dataValues.name,
                email: user.dataValues.email,
                id: user.dataValues.id, 
                role: user.dataValues.role
            }
        })
    }

    public async getUsers(req: Request, res: Response) {       
        // TODO Now fetch email, name, id, and role from database and push it to userData array.
        const offset = parseInt(req.params.offset)
        
        const users = (await Models.User.findAll({
            attributes: ['email', 'name', 'role', 'id'],
            offset: offset
        })).map(elem => elem.dataValues)

        return res.status(200).json(users)
    }

    public async editUser(req: Request, res: Response) {
        const id = parseInt(req.params.userId)
        const name = req.body.userName
        const role = req.body.role
        const email = req.body.email
        const currentPassword = req.body.currentPassword
        const newPassword = req.body.newPassword

        // If the requests contains a new role for the user, or the userId is not the same is in the jwt token,
        // check if the requests comes from an admin.
        if (role || id !== req.userData.id) {
            if (isAdminOrOwner(req.userData) === false) {
                res.status(401)
                return res.send({})
            }
        }

        if (currentPassword && newPassword) {
            const user = await Models.User.findOne({
                attributes: ['password'],
                where: {
                    id: id
                }
            })

            const passwordCheck = await bcrypt.compare(currentPassword, user.dataValues.password)
            if (!passwordCheck) {
                return res.status(401).json({ 
                    errorcode: 1,
                    text: 'Authentication failed' 
                })
            }
        }
        
        const dataToSave = Object.create(null)
        if (name) dataToSave.name = name
        if (role) dataToSave.role = role
        if (email) dataToSave.email = email
        if (currentPassword && newPassword) dataToSave.password = bcrypt.hashSync(newPassword, 10)

        await Models.User.update(
            dataToSave,
            {
                where: {
                    id: id
                }
            }
        )

        res.status(200)
        return res.send({})
    }

    public async deleteUser(req: Request, res: Response) {
        const id = parseInt(req.params.userId)

        // Check if the request comes from the user itself.
        if (id !== req.userData.id) {
            // Check if the request comes from admin.
            if (isAdminOrOwner(req.userData)) {
                res.status(401)
                return res.send({})
            }
        }

        await Models.User.destroy({
            where: {
                id: id
            }
        })

        res.status(200)
        return res.send({})
    }

    public async getUserById(id: number): Promise<User> {
        const user = await Models.User.findOne({
            attributes: ['id', 'email', 'name', 'role'],
            where: {
                id: id
            }
        })

        return user
    }
}