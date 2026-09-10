# Service Provider Onboarding Portal

A full-stack MERN application for service provider registration, profile onboarding, document verification, and admin approval management.

## Features

### Provider

- Provider registration and login
- JWT-based authentication
- Complete provider profile
- Service category selection
- Skills and experience
- Service location
- Profile photo upload
- Verification document upload
- Application status tracking
- Profile editing
- Protected provider routes

### Admin

- Admin login
- Dashboard statistics
- View all providers
- Search providers
- Filter by application status
- Pagination
- View complete provider details
- View profile photo
- View verification documents
- Approve applications
- Reject applications
- Add rejection remarks
- Protected admin routes

## Tech Stack

### Frontend

- React
- Vite
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- CORS

## Project Structure

```text
Dashboard/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md