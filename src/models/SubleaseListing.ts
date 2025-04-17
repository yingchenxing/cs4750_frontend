import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'
import Listing from './Listing'

class SubleaseListing extends Model {
  public sublease_listing_id!: number
  public listing_id!: number
  public sublease_reason!: string
}

SubleaseListing.init(
  {
    sublease_listing_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    listing_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: Listing,
        key: 'listing_id',
      },
    },
    sublease_reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SubleaseListing',
    tableName: 'sublease_listings',
  }
)

// Define the relationship with Listing
SubleaseListing.belongsTo(Listing, { foreignKey: 'listing_id' })

export default SubleaseListing
