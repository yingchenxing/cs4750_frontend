import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'
import User from './User'
import Listing from './Listing'

class SavedListing extends Model {
  public saved_id!: number
  public user_id!: number
  public listing_id!: number
  public saved_at!: Date
}

SavedListing.init(
  {
    saved_id: {
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
    saved_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'SavedListing',
    tableName: 'saved_listings',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'listing_id'],
      },
    ],
  }
)

// Define relationships
SavedListing.belongsTo(User, { foreignKey: 'user_id' })
SavedListing.belongsTo(Listing, { foreignKey: 'listing_id' })

export default SavedListing
