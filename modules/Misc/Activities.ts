import type { Request, Response } from "express";
import Models from '../../models/index'
import { ImageType } from "../Images/Images";

export class Activities {
    constructor() {}

    public async getLatestActivities(req: Request, res: Response) {
        const type = req.params.type

        if (type === "owner-gallery" || type === "guest-gallery") {
            const images = (await Models.Image.findAll(
                {
                    attributes: ['id', 'uploaded_at', 'description', 'users_id'],
                    order: [['id', 'DESC']],
                    limit: 10,
                    where: {
                        type: type === "owner-gallery" ? ImageType.ADMIN : ImageType.GUEST
                    }
                })).map(e => e.dataValues)
            
                return res.status(200).send(images)
        } else if (type === "comments") {
            const comments = (await Models.Comment.findAll(
                {
                    attributes: ['id', 'commented_at', 'comment', 'users_id'],
                    order: [['id', 'DESC']],
                    limit: 10
                })).map(e => e.dataValues)
            
                return res.status(200).send(comments)
        } else {
            res.status(400).send()
        }
    }
}