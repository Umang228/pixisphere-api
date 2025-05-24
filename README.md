# Pixisphere Backend

Pixisphere is a full-stack AI-powered photography service marketplace that connects clients with verified photographers and studios across India.

## Features

- **Role-Based Authentication**: JWT-based auth with three distinct roles (client, partner, admin)
- **Partner Verification Workflow**: Complete partner onboarding and admin verification system
- **Inquiry Management**: Smart lead creation and distribution to relevant partners
- **Portfolio Management**: Partners can manage their portfolio items with ordering capabilities
- **Admin Dashboard**: Complete admin controls with statistics and moderation features

## Tech Stack

- **Backend**: Node.js with Express
- **Databases**: MongoDB
- **Authentication**: JWT
- **Validation**: JWT
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **Security**: Helmet, Rate Limiting

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file based on `.env.example` and fill in your configuration
```bash
cp .env.example .env
```

4. Start the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

Once the server is running, you can access the Swagger documentation at:
```
http://localhost:5000/api-docs
```

## Project Structure

```
/src
|-- /config          # Configuration files
|-- /controllers     # Request handlers
|-- /middlewares     # Express middlewares
|-- /models          # Database models
|-- /routes          # API routes
|-- /utils           # Utility functions
|-- /validations     # Request validation schemas
|-- app.js           # Express app setup
|-- server.js        # Server entry point
```

## Key API Endpoints

| Method | Endpoint                 | Description                  | Role    |
|--------|--------------------------|------------------------------|---------|
| POST   | /api/auth/signup         | Register user                | All     |
| POST   | /api/auth/login          | User login                   | All     |
| POST   | /api/inquiries           | Create inquiry               | Client  |
| GET    | /api/partners/leads      | Get assigned leads           | Partner |
| POST   | /api/portfolios/items    | Add portfolio item           | Partner |
| GET    | /api/admin/verifications | Get verification requests    | Admin   |
| PUT    | /api/admin/verify/:id    | Approve/reject verification  | Admin   |

## Testing

The project includes a Postman collection for API testing in the `postman` directory.

## License

This project is licensed under the MIT License.