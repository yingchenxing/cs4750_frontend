import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'
import User from './User'
import Listing from './Listing'

class PropertyReview extends Model {
  public review_id!: number
  public user_id!: number
  public listing_id!: number
  public rating?: number
  public comment?: string
}

PropertyReview.init(
  {
    review_id: {
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
    listing_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Listing,
        key: 'listing_id',
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'PropertyReview',
    tableName: 'property_reviews',
  }
)

// Define relationships
PropertyReview.belongsTo(User, { foreignKey: 'user_id' })
PropertyReview.belongsTo(Listing, { foreignKey: 'listing_id' })

export default PropertyReview
