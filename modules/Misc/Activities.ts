import type { Request, Response } from "express";
import Models from '../../models/index'
import { ImageType } from "../Images/Images";
import { Users } from "../Users/Users";
import { CommentAttributes } from "models/Comment.model";
import { ImageAttributes } from "models/Image.model";

type CommentWithImageType = CommentAttributes & Pick<ImageAttributes, "type">
export class Activities {
    constructor() {}

    public async getLatestActivities(req: Request, res: Response) {
        const type = req.params.type
        let userId = undefined
        
        if (req.params.userId !== undefined) {
            userId = parseInt(req.params.userId)
        }

        if (userId !== undefined && userId !== req.userData.id) {
            return res.status(401).send({})
        }


        if (type === "ownerGallery" || type === "guestGallery") {
            const queryObject: any = {
                attributes: ['id', 'uploaded_at', 'description', 'users_id'],
                order: [['id', 'DESC']],
                limit: 10,
                where: {
                    type: type === "ownerGallery" ? ImageType.ADMIN : ImageType.GUEST
                }
            }

            // If the request comes from Profile tab, add condition for this user.
            if (userId !== undefined) {
                queryObject.where["users_id"] = userId
            }

            const images = (await Models.Image.findAll(queryObject)).map(e => e.dataValues)
                
            const imagesUsersMapedToNames = await Promise.all(
                images.map(async e => {
                    // TODO Improve. This must be cached to avoid unnecessary database calls.
                    const user = (await new Users().getUserById(e.users_id)).dataValues
                    return { username: user.name, description: e.description, uploaded_at: e.uploaded_at, id: e.id }
                })
            )
            
            return res.status(200).send(imagesUsersMapedToNames)
        } else if (type === "comments") {
            // TODO Improve. This must be cached to avoid unnecessary database calls.
            const queryObject: any = {
                attributes: ['id', 'commented_at', 'comment', 'users_id', 'image_id'],
                order: [['id', 'DESC']],
                limit: 10,
                where: {}
            }

            // If the request comes from Profile tab, add condition for this user.
            if (userId !== undefined) {
                queryObject.where["users_id"] = userId
            }

            const comments = (await Models.Comment.findAll(queryObject))
                .map(e => {
                    const val = e.dataValues as CommentWithImageType
                    val.type = -1
                    return val
                })
            
            // Get information if image is from owner or guest.
            // TODO Improve. This must be cached to avoid unnecessary database calls.
            const commentsUsersMapedToNames: Partial<CommentAttributes>[] = await Promise.all(
                comments.map(async comment => {
                    const image = await Models.Image.findOne(
                        {
                            where: {
                                id: comment.image_id
                            }
                        }
                    )
                    const user = (await new Users().getUserById(comment.users_id)).dataValues
                    comment.type = image.dataValues.type 
                    return { 
                        author: user.name, 
                        comment: comment.comment, 
                        commented_at: comment.commented_at, 
                        id: comment.id 
                    }
                })
            )

            return res.status(200).send(commentsUsersMapedToNames)
        } else {
            res.status(400).send()
        }
    }
}