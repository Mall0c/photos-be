import { glob } from 'glob'
import { Database } from '../common/Database'

async function loadImages() {
    const dbConnection = Database.getInstance()
    const IMAGES = await glob('assets/img/*.jpg')
    await dbConnection.query("TRUNCATE TABLE image")
    for (const image of IMAGES) {
        const imgUuid = image.split('/').slice(-1)
        await dbConnection.query(`INSERT INTO image (users_id, uploaded_at, description, filename, type) VALUES (5, 1733419749, 'Test Description', '${imgUuid}', 0)`)
    }
}

loadImages()