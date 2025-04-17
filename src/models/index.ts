import User from './User'
import Listing from './Listing'
import HouseListing from './HouseListing'
import SubleaseListing from './SubleaseListing'
import RoommateProfile from './RoommateProfile'
import SavedListing from './SavedListing'
import PropertyReview from './PropertyReview'
import Message from './Message'

// User relationships
User.hasMany(Listing, { foreignKey: 'user_id' })
User.hasOne(RoommateProfile, { foreignKey: 'user_id' })
User.hasMany(SavedListing, { foreignKey: 'user_id' })
User.hasMany(PropertyReview, { foreignKey: 'user_id' })
User.hasMany(Message, { as: 'sentMessages', foreignKey: 'sender_id' })
User.hasMany(Message, { as: 'receivedMessages', foreignKey: 'receiver_id' })

// Listing relationships
Listing.hasOne(HouseListing, { foreignKey: 'listing_id' })
Listing.hasOne(SubleaseListing, { foreignKey: 'listing_id' })
Listing.hasMany(SavedListing, { foreignKey: 'listing_id' })
Listing.hasMany(PropertyReview, { foreignKey: 'listing_id' })

export {
  User,
  Listing,
  HouseListing,
  SubleaseListing,
  RoommateProfile,
  SavedListing,
  PropertyReview,
  Message,
}
