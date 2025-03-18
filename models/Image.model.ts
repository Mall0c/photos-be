import { Model, DataTypes } from 'sequelize'
import { Database } from '../common/Database'

export interface ImageAttributes {
    id: number;
    users_id: number;
    uploaded_at: number;
    description: string;
    filename: string;
    type: number;
}

export class Image extends Model<ImageAttributes> implements ImageAttributes {
    id: number;
    users_id: number;
    uploaded_at: number;
    description: string;
    filename: string;
    type: number;
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
        type: {
            type: DataTypes.SMALLINT,
            allowNull: false
        }
    },
    {
        sequelize: Database.getInstance(),
        tableName: 'image',
        timestamps: false
    }
)