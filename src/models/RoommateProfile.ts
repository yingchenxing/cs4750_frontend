import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'
import User from './User'

class RoommateProfile extends Model {
  public profile_id!: number
  public user_id!: number
  public p_gender?: string
  public p_cleanliness_level?: string
  public p_age?: number
  public p_pets?: boolean
  public p_smoking_habits?: boolean
  public bio?: string
}

RoommateProfile.init(
  {
    profile_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    p_gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    p_cleanliness_level: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    p_age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    p_pets: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    p_smoking_habits: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'RoommateProfile',
    tableName: 'roommate_profiles',
  }
)

// Define the relationship with User
RoommateProfile.belongsTo(User, { foreignKey: 'user_id' })

export default RoommateProfile
