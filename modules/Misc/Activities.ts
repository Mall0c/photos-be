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

        if (type === "ownerGallery" || type === "guestGallery") {
            const images = (
                await Models.Image.findAll(
                    {
                        attributes: ['id', 'uploaded_at', 'description', 'users_id'],
                        order: [['id', 'DESC']],
                        limit: 10,
                        where: {
                            type: type === "ownerGallery" ? ImageType.ADMIN : ImageType.GUEST
                        }
                    }
                ))
                .map(e => e.dataValues)
                
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
            const comments = (await Models.Comment.findAll(
                {
                    attributes: ['id', 'commented_at', 'comment', 'users_id', 'image_id'],
                    order: [['id', 'DESC']],
                    limit: 10
                })).map(e => {
                    const val = e.dataValues as CommentWithImageType
                    val.type = -1
                    return val
                })
            
            // Get information if image is from owner or guest.
            // TODO Improve. This must be cached to avoid unnecessary database calls.
            for (const comment of comments) {
                const image = await Models.Image.findOne(
                    {
                        where: {
                            id: comment.image_id
                        }
                    }
                )
                comment.type = image.dataValues.type 
            }

            return res.status(200).send(comments)
        } else {
            res.status(400).send()
        }
    }
}