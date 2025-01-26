import { Request, Response } from 'express'
import Models from '../../models/index'
import path from 'node:path'
import fs from 'node:fs'
import { isAdmin, isOwner } from '../../common/Middleware'

export class Images {
    constructor() {}

    public async getImage(req: Request, res: Response, scaled: boolean) {
        // TODO Validate, but not with ajv.
        
        const imgId = req.params.id
        const image = await Models.Image.findOne({
            attributes: ['filename'],
            where: {
                id: parseInt(imgId)
            }
        })

        if (image !== null) {
            res.status(200)
            if (scaled) {
                return res.sendFile(path.resolve(__dirname, `../../assets/img-scaled/${image.dataValues.filename}`))
            } else {
                return res.sendFile(path.resolve(__dirname, `../../assets/img/${image.dataValues.filename}`))
            }
        } else {
            res.status(404)
            return res.send(null)
        }
    }

    public async getAllImageIDs(req: Request, res: Response, ownerPictures: boolean) {
        const images = (await Models.Image.findAll(
            {
                attributes: ['id'],
                order: [['id', 'ASC']],
                where: {
                    type: ownerPictures === true ? 0 : 1
                }
            })).map(elem => elem.dataValues.id)

        res.status(200)
        return res.json(images)
    }

    public async getImageData(req: Request, res: Response) {
        // TODO Validate, but not with ajv.
        
        const imgId = req.params.id
        const image = await Models.Image.findOne({
            attributes: ['id', 'users_id', 'uploaded_at', 'description'],
            where: {
                id: parseInt(imgId)
            }
        })

        if (image !== null) {

            // Get user that uploaded the image.
            const user = await Models.User.findOne({
                where: {
                    id: image.dataValues.users_id
                }
            })

            res.status(200)
            return res.json({
                id: image.dataValues.id,
                description: image.dataValues.description,
                timestamp: image.dataValues.uploaded_at,
                uploader: user.dataValues.name,
                uploaderId: user.dataValues.id
            })
        } else {
            res.status(404)
            return res.json({
                description: null,
                timestamp: 0,
                uploader: null
            })
        }
    }

    public async editDescription(req: Request, res: Response) {
        // TODO Validate, but not with ajv.
        const imgId = req.params.id
        const image = await Models.Image.findOne({
            attributes: ['id', 'users_id', 'uploaded_at', 'description'],
            where: {
                id: parseInt(imgId)
            }
        })

        if (image !== null) {

            // Check if the request comes from the author of the image.
            if (image.dataValues.users_id !== req.userData.id) {
                // Check if the request comes from admin.
                if (isAdmin(req.userData) === false && isOwner(req.userData) === false) {
                    res.status(401)
                    return res.send({})
                }
            }

            await Models.Image.update(
                { description: req.body.description },
                {
                    where: {
                        id: parseInt(imgId)
                    }
                }
            )
            
            res.status(200)
            return res.json({})
        } else {
            res.status(404)
            return res.json({
                description: null,
                timestamp: 0,
                uploader: null
            })
        }
    }

    public async deleteImage(req: Request, res: Response) {
        // TODO Validate, but not with ajv.
        const imgId = req.params.id
        const image = await Models.Image.findOne({
            attributes: ['id', 'users_id', 'uploaded_at', 'description', 'filename'],
            where: {
                id: parseInt(imgId)
            }
        })

        if (image !== null) {

            // Check if the request comes from the author of the image.
            if (image.dataValues.users_id !== req.userData.id) {
                // Check if the request comes from admin.
                if (isAdmin(req.userData) === false && isOwner(req.userData) === false) {
                    res.status(401)
                    return res.send({})
                }
            }

            fs.unlinkSync(path.resolve(__dirname, `../../assets/img/${image.dataValues.filename}`))

            await Models.Image.destroy(
                {
                    where: {
                        id: parseInt(imgId)
                    }
                }
            )
            
            res.status(200)
            return res.json({})
        } else {
            res.status(404)
            return res.json({
                description: null,
                timestamp: 0,
                uploader: null
            })
        }
    }
}