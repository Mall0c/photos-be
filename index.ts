import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { router } from './routes'
import { Database } from './common/Database'

// https://stackoverflow.com/a/47448486
// Otherwise, we cant set req.userData
export type jwtData = jwt.JwtPayload & { email: string, id: number, role: number }

declare global {
    namespace Express {
        interface Request {
            userData: jwtData
        }
    }
}

;(async () => {
    const HTTP_PORT = 3000
    
    Database.getInstance()
    
    const app = express()
    app.use(cors({
        origin: ["http://localhost", "http://localhost:5173", "http://localhost:4173", "https://www.richardsteinbrecht.de", "https://richardsteinbrecht.de"],
        optionsSuccessStatus: 200
    }))
    
    app.use(express.json())
    app.use('/api', router)
    
    // Start HTTP server.
    app.listen(HTTP_PORT, () => {
        console.log(`Example app listening on port ${HTTP_PORT}`)
    })
})()