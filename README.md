# FeatureHub

## Feature Request & Public Roadmap Portal

FeatureHub is a full-stack MERN application that allows users to submit product feature requests, upvote existing requests, participate in threaded discussions, and view the progress of accepted features through a public roadmap.

The application also provides an admin dashboard for managing feature requests, moderating discussions, and updating feature statuses.

---

## Project Description

Product teams often receive feature requests through different channels, making it difficult to organize feedback, identify popular requests, and communicate development progress.

FeatureHub provides a centralized platform where:

- Users can create feature requests.
- Users can upvote feature requests.
- Users can discuss features through threaded comments.
- Users can search, filter, and sort feature requests.
- Administrators can manage feature requests.
- Administrators can update feature statuses.
- A public roadmap displays features based on their current status.

### Feature Status Flow

```text
Under Review → Planned → In Progress → Completed
````

The public roadmap displays:

```text
Planned | In Progress | Completed
```

---

# Technology Stack

## Frontend

* React.js
* Vite
* React Router
* Axios
* Tailwind CSS
* Coss UI
* Lucide React
* Sonner
* React Markdown
* Remark GFM
* Rehype Sanitize

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* cookie-parser
* CORS

## Email

* Brevo API

## Development Tools

* Git
* GitHub
* npm

---

# Main Features

## Authentication

* User signup
* Email verification
* Login
* Logout
* JWT access tokens
* JWT refresh tokens
* Refresh token rotation
* HTTP-only cookies
* Forgot password
* Reset password
* Current user session

### Token Lifetime

| Token         | Lifetime   |
| ------------- | ---------- |
| Access Token  | 15 minutes |
| Refresh Token | 7 days     |

---

## Feature Requests

Users can:

* Create feature requests
* Edit their own feature requests
* Delete their own feature requests
* View feature details
* Search features
* Filter by category
* Filter by status
* Sort by newest
* Sort by most upvoted
* Sort by most discussed

### Categories

* UI/UX
* Integrations
* Performance
* General

---

## Voting

Users can upvote feature requests and remove their votes.

The voting system uses MongoDB atomic operations:

```text
$addToSet
$pull
$inc
```

This prevents duplicate votes and keeps the vote count consistent.

The frontend also implements optimistic UI updates with rollback if the request fails.

---

## Threaded Comments

Users can:

* Add comments
* Reply to comments
* Create nested discussions
* Edit their own comments
* Delete their own comments
* Use Markdown in comments

Administrators can moderate comments.

Deleting a parent comment also removes its descendant comments.

---

## Admin Dashboard

Administrators can:

* View feature requests
* Search features
* Filter features
* Edit features
* Delete features
* Change feature status
* Manage comments

Role-based access control prevents normal users from accessing administrative functionality.

---

## Public Roadmap

The roadmap is generated from the feature status stored in MongoDB.

```text
┌──────────────┬──────────────┬──────────────┐
│   Planned    │ In Progress  │  Completed   │
├──────────────┼──────────────┼──────────────┤
│ Feature A    │ Feature C    │ Feature E    │
│ Feature B    │ Feature D    │ Feature F    │
└──────────────┴──────────────┴──────────────┘
```

There is no separate roadmap collection.

The roadmap is synchronized automatically with feature status changes.

---

# Project Structure

```text
FeatureHub/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── features/
│   │   │   ├── comments/
│   │   │   └── ui/
│   │   │
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── admin/
│   │   │   ├── features/
│   │   │   └── roadmap/
│   │   │
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   │
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# Prerequisites

Before running the project, make sure the following are installed:

* Node.js
* npm
* MongoDB
* Git

You can use either:

* Local MongoDB
* MongoDB Atlas

---

# Installation

## 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project:

```bash
cd FeatureHub
```

---

# Frontend Setup

## 2. Navigate to the Client

```bash
cd client
```

Install dependencies:

```bash
npm install
```

---

# Backend Setup

Open another terminal and navigate to the server:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

The project uses environment variables for configuration and secrets.

Create the following files:

```text
client/.env
server/.env
```

Do not commit these files to GitHub.

---

## Frontend Environment Variables

Create:

```text
client/.env
```

Add:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## Backend Environment Variables

Create:

```text
server/.env
```

Add:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

CORS_ORIGIN=http://localhost:5173

JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=your_verified_email@example.com
EMAIL_FROM_NAME=FeatureHub

CLIENT_URL=http://localhost:5173

NODE_ENV=development
```

Replace the placeholder values with your own local configuration.

---

# Database Setup

FeatureHub uses MongoDB as its database.

You can use a local MongoDB instance or MongoDB Atlas.

### Local MongoDB Example

```env
MONGODB_URI=mongodb://127.0.0.1:27017/featurehub
```

### MongoDB Atlas

Create a MongoDB Atlas database and use the provided connection string:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
```

The application uses Mongoose models to create and manage the required collections.

---

# Database Collections

The application uses three main collections:

```text
User
Feature
Comment
```

## User

Stores:

* Name
* Email
* Hashed password
* Role
* Email verification information
* Password reset information
* Refresh token

Roles:

```text
user
admin
```

---

## Feature

Stores:

* Title
* Description
* Category
* Status
* Author
* Votes
* Vote count
* Created date
* Updated date

---

## Comment

Stores:

* Feature reference
* Author
* Content
* Parent comment
* Created date
* Updated date

The `parentComment` field is used to create threaded discussions.

---

# Running the Application

The frontend and backend need to run separately.

## Start Backend

From the `server` directory:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

## Start Frontend

From the `client` directory:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

---

# Admin Account

The application uses role-based access control.

There are two roles:

```text
user
admin
```

For local development, an administrator account must be created using the project's admin setup/seed process.

Do not commit administrator passwords or credentials to the repository.

After creating an administrator, use that account to access:

```text
/admin
```

---

# Authentication Flow

The authentication flow works as follows:

```text
User Login
    ↓
Backend validates credentials
    ↓
Access Token + Refresh Token generated
    ↓
Tokens stored in HTTP-only cookies
    ↓
Authenticated API requests
    ↓
Access Token expires
    ↓
Refresh Token used
    ↓
New Access Token generated
```

Refresh tokens are rotated when a new access token is generated.

---

# API Overview

The backend provides REST APIs for authentication, features, comments, voting, administration, and roadmap functionality.

Base URL:

```text
http://localhost:5000/api/v1
```

---

## Authentication APIs

### Signup

```http
POST /auth/signup
```

### Login

```http
POST /auth/login
```

### Logout

```http
POST /auth/logout
```

### Current User

```http
GET /auth/me
```

### Refresh Access Token

```http
POST /auth/refresh-token
```

### Verify Email

```http
POST /auth/verify-email
```

### Forgot Password

```http
POST /auth/forgot-password
```

### Reset Password

```http
POST /auth/reset-password
```

---

# Feature APIs

### Get Features

```http
GET /features
```

Supports query parameters such as:

```text
page
limit
search
category
status
sort
```

Example:

```http
GET /features?page=1&limit=10&sort=upvoted
```

### Get Feature

```http
GET /features/:featureId
```

### Create Feature

```http
POST /features
```

Authentication required.

### Update Feature

```http
PATCH /features/:featureId
```

Authentication required.

### Delete Feature

```http
DELETE /features/:featureId
```

Authentication required.

---

# Voting APIs

### Upvote

```http
POST /features/:featureId/vote
```

Authentication required.

### Remove Upvote

```http
DELETE /features/:featureId/vote
```

Authentication required.

---

# Comment APIs

### Get Comments

```http
GET /features/:featureId/comments
```

### Create Comment

```http
POST /features/:featureId/comments
```

Authentication required.

### Update Comment

```http
PATCH /comments/:commentId
```

Authentication required.

### Delete Comment

```http
DELETE /comments/:commentId
```

Authentication required.

---

# Admin API

### Update Feature Status

```http
PATCH /admin/features/:featureId/status
```

Authentication and admin authorization required.

Example request:

```json
{
  "status": "planned"
}
```

Allowed statuses:

```text
under_review
planned
in_progress
completed
```

---

# Roadmap API

### Get Roadmap

```http
GET /roadmap
```

The roadmap is generated using feature statuses.

---

# Security

The project follows several security practices.

### Password Hashing

Passwords are hashed using `bcryptjs`.

Passwords are not stored as plain text.

### Authentication Cookies

Authentication tokens are stored in HTTP-only cookies.

### JWT

The application uses:

* Short-lived access tokens
* Long-lived refresh tokens
* Refresh token rotation

### Authorization

Backend middleware verifies:

1. Authentication
2. User role
3. Resource ownership where required

### Markdown Sanitization

User-generated Markdown is sanitized before rendering using:

```text
rehype-sanitize
```

---

# Error Handling

The backend uses centralized error handling.

API errors follow a consistent response format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

Common HTTP status codes:

| Status Code | Meaning               |
| ----------- | --------------------- |
| 400         | Bad Request           |
| 401         | Unauthorized          |
| 403         | Forbidden             |
| 404         | Not Found             |
| 409         | Conflict              |
| 500         | Internal Server Error |

---

# Assumptions

* Users must authenticate before creating features, voting, or commenting.
* Users can modify their own features.
* Administrators can manage feature requests and moderate comments.
* Feature status determines its position on the public roadmap.
* The roadmap does not use a separate database collection.
* MongoDB is used for persistent data storage.
* Email verification and password reset require Brevo configuration.
* The application is intended to run locally for assessment review.

---

# Limitations

* No real-time notifications are implemented.
* No file/image upload functionality is implemented.
* No OAuth/social login is implemented.
* No dedicated notification center is implemented.
* The roadmap does not currently support drag-and-drop ordering.
* Automated end-to-end testing is not included.
* The current implementation supports one stored refresh-token session per user.
* Advanced product analytics are not implemented.

---

