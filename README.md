# Service Provider Onboarding Portal

A full-stack Service Provider Onboarding Portal built using the MERN stack. The application allows service providers to register, complete their profiles, upload verification documents, submit applications, and track their application status. Administrators can review, search, filter, approve, or reject provider applications.

## Features

### Provider

- Provider registration and login
- JWT-based authentication
- Complete and update provider profile
- Add phone, address, city, state, and pincode
- Select service categories
- Add skills and experience
- Add provider bio
- Upload profile photo
- Upload verification documents
- Submit onboarding application
- View application status
- View rejection remarks
- Edit profile before approval
- Protected provider routes

### Admin

- Admin login
- Admin dashboard
- Dashboard statistics
- View all service providers
- Search providers
- Filter providers by application status
- Pagination
- View complete provider details
- View uploaded profile photo
- View verification documents
- Approve provider applications
- Reject provider applications
- Add rejection remarks
- Protected admin routes
- Role-based access control

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Multer
- CORS
- dotenv

## Project Structure

```text
Dashboard/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .gitignore
├── .env.example
├── MERN_Onboarding_API.postman_collection.json
└── README.md