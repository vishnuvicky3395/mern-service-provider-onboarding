# Pages

This folder contains the main React pages for the Service Provider Onboarding Portal.

## Pages

### Login.jsx
Handles user authentication.

- Provider login
- Admin login
- JWT token handling
- Role-based navigation
- Redirects providers to Provider Dashboard
- Redirects admins to Admin Dashboard

### RegisterPage.jsx
Handles new provider registration.

- Provider name
- Email
- Password
- Account creation
- Registration validation
- Redirect to Login page after successful registration

### ProviderDashboard.jsx
Main dashboard for service providers.

Features:

- View provider profile
- Update personal information
- Add service categories
- Add skills
- Add experience
- Add bio
- Add service location
- Upload profile photo
- Upload verification documents
- Submit application
- View application status
- View rejection remarks

### AdminDashboard.jsx
Main dashboard for administrators.

Features:

- View dashboard statistics
- View all providers
- Search providers
- Filter providers by status
- Pagination
- View provider details
- View profile photo
- View verification documents
- Approve applications
- Reject applications
- Add rejection remarks

## Routing

The pages are connected through React Router.

```text
/login
/register
/provider
/admin