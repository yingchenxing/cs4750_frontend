import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'cs4750',
  logging: false, // Set to console.log to see SQL queries
  define: {
    timestamps: false, // Disable automatic timestamp fields (createdAt, updatedAt)
    underscored: true, // Use snake_case rather than camelCase column names
  },
})

export default sequelize
