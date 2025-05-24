const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pixisphere API',
      version: '1.0.0',
      description: 'API documentation for Pixisphere - Photography Service Marketplace',
      contact: {
        name: 'API Support',
        email: 'support@pixisphere.com'
      }
    },
    servers: [
      {
        url: 'https://pixisphere-api.onrender.com',
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerOptions;