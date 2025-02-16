import express, { Request, Response } from 'express'
import multer from 'multer'
import path from 'node:path'
import { uid } from 'uid'
import { Images } from '../modules/Images/Images'
import { loggedIn } from '../common/Middleware'

function isValidImage(file: Express.Multer.File): string | null {
    if (file.mimetype.indexOf("png") > -1) {
        return "png"
    } else if (file.mimetype.indexOf("jpg") > -1 || file.mimetype.indexOf("jpeg") > -1) {
        return "jpg"
    }
    return null
} 

const storage = multer.diskStorage({
    destination: path.resolve(__dirname, `../assets/img`),
    filename: (req, file) => {
        const fileExtension = isValidImage(file)
        return "foobar" + "." + fileExtension
        //return uid(32) + "." + fileExtension
    }
})

const imageUpload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const isImage = isValidImage(file)
        if (isImage === null) {
            return cb(new Error("Not an image."))
        }
        return cb(null, true)
    },
    limits: {
        files: 1,
        fields: 1,
        parts: 1,
        fileSize: 10 * 1024 * 1024 // 10 MiB
    }
})

export const router = express.Router()

router
    .get('/images/metadata/:id', async (req: Request, res: Response) => {
        return await new Images().getImageData(req, res)
    })
    .get('/images', async (req: Request, res: Response) => {
        return await new Images().getAllImageIDs(req, res, true)
    })
    .get('/images-by-guests', async (req: Request, res: Response) => {
        return await new Images().getAllImageIDs(req, res, false)
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
    .post('/images-by-guests', loggedIn, imageUpload.single('image'), async (req: Request, res: Response) => {
        return await new Images().uploadImage(req, res)
    })