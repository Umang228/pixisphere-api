const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
const connectPostgreSQL = async () => {
  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL Connection has been established successfully.');
    
    // Sync models with database
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('PostgreSQL models synchronized.');
    }
  } catch (error) {
    logger.error(`Unable to connect to PostgreSQL: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { 
  sequelize,
  connectPostgreSQL
};