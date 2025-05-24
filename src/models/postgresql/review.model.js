const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/postgresql');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  partnerId: {
    type: DataTypes.STRING, // MongoDB ObjectId as string
    allowNull: false
  },
  clientId: {
    type: DataTypes.STRING, // MongoDB ObjectId as string
    allowNull: false
  },
  bookingId: {
    type: DataTypes.STRING // MongoDB ObjectId as string
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  response: {
    type: DataTypes.TEXT
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  moderationComment: {
    type: DataTypes.TEXT
  },
  moderatedBy: {
    type: DataTypes.STRING // MongoDB ObjectId as string
  },
  moderatedAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  indexes: [
    {
      fields: ['partnerId']
    },
    {
      fields: ['clientId']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Review;