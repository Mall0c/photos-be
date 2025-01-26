import { Model, DataTypes } from 'sequelize'
import { Database } from '../common/Database'

interface ImageAttributes {
    id: number;
    users_id: number;
    uploaded_at: number;
    description: string;
    filename: string;
}

export class Image extends Model<ImageAttributes> implements ImageAttributes {
    id: number;
    users_id: number;
    uploaded_at: number;
    description: string;
    filename: string;
}

Image.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        users_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        uploaded_at: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
        filename: {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
    },
    {
        sequelize: Database.getInstance(),
        tableName: 'image',
        timestamps: false
    }
)