import express from 'express'
import { router as UsersRouter } from './users'
import { router as CommentsRouter } from './comments'
import { router as ImagesRouter} from './images'
import { router as MiscRouter } from './misc'

export const router = express.Router()

router.use(UsersRouter)
router.use(CommentsRouter)
router.use(ImagesRouter)
router.use(MiscRouter)