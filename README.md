# Programming Courses Website

This is a full-stack web application built with:

- **Frontend**: React, TailwindCSS, TypeScript
- **Backend**: Node.js, Express, TypeScript, SQLite

---

## ✨ Features

Users can:

- Create an account and verify their identity via email
- View and update their profile (username, email, avatar, enrolled courses)
- Enroll in available courses
- Chat with other users via private messages
- Submit contact forms with feedback or requests
- Leave reviews on the platform

---

## 🚀 Getting Started

bash

### 1. Clone the repository

```
git clone https://github.com/azgerarw/courses-website.git
cd courses-website

```

### 2. Install dependencies

```
npm install

```
This will install dependencies for both frontend and backend using concurrently.

### 3. Run the development server

```
npm run dev

```
This command will start both the frontend (Vite) and backend (Nodemon or TSX watcher) servers concurrently.

### 4. Enviromental variables

You will need a .env file in the /backend directory with your configuration.
If you have not created one yet, make sure to define:

```
PORT=3000
JWT_SECRET=your_jwt_secret
SMTP_USER=your_email@example.com
SMTP_PASS=your_smtp_password
...

```
### 5. Build for production

To build the frontend and backend separately:

```
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build

```

### 6. License

This project is licensed under the ISC License.

### 7. Contact

If you have any questions, feel free to open an issue or submit a pull request.
