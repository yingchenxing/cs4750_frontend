import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'
import User from './User'

class Listing extends Model {
  public listing_id!: number
  public user_id!: number
  public title!: string
  public description!: string
  public property_type!: string
  public location!: string
  public rent_price!: number
  public lease_duration!: number
  public avail_time_start!: Date
  public avail_time_end!: Date
  public image!: string
}

Listing.init(
  {
    listing_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    property_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rent_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    lease_duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    avail_time_start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    avail_time_end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    sequelize,
    modelName: 'Listing',
    tableName: 'listings',
  }
)

// Define the relationship with User
Listing.belongsTo(User, { foreignKey: 'user_id' })

export default Listing
