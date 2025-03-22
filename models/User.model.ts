import { Model, DataTypes } from 'sequelize'
import { Database } from '../common/Database'

interface UserAttributes {
    id: number;
    email: string;
    name: string;
    password: string;
    role: number;
}

export class User extends Model<UserAttributes> {

}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        role: {
            type: DataTypes.SMALLINT,
            allowNull: false
        }
    },
    {
        sequelize: Database.getInstance(),
        tableName: 'users',
        timestamps: false
    }
)