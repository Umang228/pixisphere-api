require('dotenv').config();
const app = require('./app');
const { connectMongoDB } = require('./config/mongodb');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Connect to database
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    
    // Start the server
    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});