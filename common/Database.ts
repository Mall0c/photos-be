import { Sequelize } from 'sequelize-typescript'

export class Database {

    private static instance: Sequelize
    private constructor() {}

    public static getInstance() {
        if (this.instance === undefined) {
            // logging: false, weil ansonsten per Default *ALLE* ausgeführten SQL Statements in die Console geloggt werden.
            const user = process.env.DATABASE_USER
            const pass = process.env.DATABASE_PW
            const host = process.env.DATABASE_HOST
            const db = "photogallery"
            this.instance = new Sequelize(
                `postgres://${user}:${pass}@${host}:5432/${db}`, 
                {
                    logging: false
                }
            )
            this.instance.authenticate()
        }
        return this.instance
    }
}