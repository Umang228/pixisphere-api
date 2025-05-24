const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/postgresql');

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: 'India'
  },
  pincode: {
    type: DataTypes.STRING
  },
  latitude: {
    type: DataTypes.FLOAT
  },
  longitude: {
    type: DataTypes.FLOAT
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  popularity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'locations',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['city', 'state', 'country']
    }
  ]
});

module.exports = Location;