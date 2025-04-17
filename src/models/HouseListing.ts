import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'
import Listing from './Listing'

class HouseListing extends Model {
  public house_listing_id!: number
  public listing_id!: number
}

HouseListing.init(
  {
    house_listing_id: {
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
  },
  {
    sequelize,
    modelName: 'HouseListing',
    tableName: 'house_listings',
  }
)

// Define the relationship with Listing
HouseListing.belongsTo(Listing, { foreignKey: 'listing_id' })

export default HouseListing
