import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'
import User from './User'

class Message extends Model {
  public message_id!: number
  public sender_id!: number
  public receiver_id!: number
  public content!: string
  public sent_at!: Date
}

Message.init(
  {
    message_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
  }
)

// Define relationships
Message.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' })
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiver_id' })

export default Message
