import { Model, DataTypes } from 'sequelize'
import { Database } from '../common/Database'

interface CommentAttributes {
    id: number;
    users_id: number;
    image_id: number;
    commented_at: number;
    comment: string;
}

export interface CommentExtended extends CommentAttributes {
    author?: string
}

export class Comment extends Model<CommentAttributes> implements CommentAttributes {
    id: number;
    users_id: number;
    image_id: number;
    commented_at: number;
    comment: string;
}

Comment.init(
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
        image_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        commented_at: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        comment: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    },
    {
        sequelize: Database.getInstance(),
        tableName: 'comment',
        timestamps: false
    }
)