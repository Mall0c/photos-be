import { Request, Response } from 'express'
import Models from '../../models/index'
import { isAdmin, isOwner } from '../../common/Middleware'
import type { CommentAttributes } from 'models/Comment.model'
export class Comments {
    constructor() {}

    public async getComments(req: Request, res: Response) {
        // TODO Validate, but not with ajv.

        const imgId = parseInt(req.params.img)

        if (Number.isNaN(imgId)) {
            res.status(404)
            return res.send(null)
        }

        const page = parseInt(req.params.page)

        const comments = await Models.Comment.findAll({
            limit: 10,
            offset: page,
            where: {
                image_id: imgId
            }
        })
        
        if (comments === null) {
            return res.status(401).json({
                text: 'Failed' 
            })
        }

        const commentsResult = []

        for (const comment of comments) {
            const user = await Models.User.findOne({
                attributes: ['name'],
                where: {
                    id: comment.dataValues.users_id
                }
            })

            const clone: CommentAttributes = structuredClone(comment.dataValues)
            clone.author = user.dataValues.name
            commentsResult.push(clone)
        }

        res.status(200)
        return res.json(commentsResult)
    }

    public async createComment(req: Request, res: Response) {
        const imgId = req.params.img
        const comment = req.body.comment
    
        if (typeof comment !== "string") {
            res.status(400)
            return res.json({
                text: "Kommentar ist ungültig."
            })
        }
        
        if (comment.length === 0) {
            res.status(400)
            return res.json({
                text: "Kommentar ist leer."
            })
        }
    
        if (comment.length > 200) {
            res.status(400)
            return res.json({
                text: "Kommentar ist zu lang."
            })
        }
        
        const commentObject = await Models.Comment.create({
            comment: comment,
            commented_at: Math.floor(new Date().valueOf() / 1000),
            users_id: req.userData.id,
            image_id: parseInt(imgId)
        })

        res.status(201)
        return res.json(commentObject)
    }

    public async deleteComment(req: Request, res: Response) {
        const commentId = req.params.id
        
        const comment = await Models.Comment.findOne({
            attributes: ['id', 'users_id'],
            where: {
                id: parseInt(commentId)
            }
        })

        // Check if the request comes from the author of the comment.
        if (comment.dataValues.users_id !== req.userData.id) {
            // Check if the request comes from admin.
            if (isAdmin(req.userData) === false && isOwner(req.userData) === false) {
                res.status(401)
                return res.send({})
            }
        }

        await Models.Comment.destroy({
            where: {
                id: commentId
            }
        })

        res.status(200)
        return res.send({})
    }
}