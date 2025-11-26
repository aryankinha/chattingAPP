# CHATTINGAPP

<div align="center">

### *Connect Instantly, Communicate Limitlessly, Empower Every Conversation*

[![Last Commit](https://img.shields.io/badge/last%20commit-today-brightgreen)](https://github.com/aryankinha/chattingAPP)
[![JavaScript](https://img.shields.io/badge/javascript-99.3%25-yellow)](https://github.com/aryankinha/chattingAPP)
[![Languages](https://img.shields.io/badge/languages-3-blue)](https://github.com/aryankinha/chattingAPP)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

**ChattingApp** is a modern, real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO. It provides seamless communication with features like instant messaging, friend management, profile customization, and real-time online status tracking.

### ✨ Key Highlights

- 🚀 **Real-time messaging** with Socket.IO
- 👥 **Friend system** with request management
- 🔐 **Secure authentication** with JWT tokens
- 📧 **OTP-based signup** via Brevo email service
- 🎨 **Modern UI** with Tailwind CSS
- 📱 **Responsive design** for all devices
- ☁️ **Cloud storage** with Cloudinary integration
- 🔄 **Auto-reconnection** and error recovery

---

## 🎯 Features

### 💬 Real-Time Messaging
- Instant message delivery with Socket.IO
- Read receipts and message status
- Unsend message functionality
- Message history persistence
- Typing indicators (coming soon)

### 👤 User Management
- Secure JWT-based authentication
- Email verification with OTP
- Profile customization with avatar upload
- Password change functionality
- Username uniqueness validation

### 🤝 Friend System
- Send and receive friend requests
- Accept/reject friend requests
- Online/offline status indicators
- Friend-only messaging restriction
- View conversation history after unfriending

### 🎨 Modern UI/UX
- Clean and intuitive interface
- Toast notifications for all actions
- Smooth animations and transitions
- Dark/light theme support (coming soon)
- Mobile-responsive design

### 🔒 Security Features
- Encrypted passwords with bcrypt
- JWT access and refresh tokens
- HTTP-only cookies for refresh tokens
- Protected API routes
- Graceful JWT expiration handling

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.16-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.9.5-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.13.2-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-Latest-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.1.0-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.19.2-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.0.2-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

### Additional Technologies
- **Cloudinary** - Image storage and optimization
- **Brevo (Sendinblue)** - Email service for OTP delivery
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **Nodemon** - Development auto-restart

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas account)
- **Git**

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/aryankinha/chattingAPP.git
cd chattingAPP
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=3000

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT Secrets (generate strong random strings)
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Brevo (for OTP emails)
BREVO_API_KEY=your_brevo_api_key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 📁 Project Structure

```
chattingAPP/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js       # Cloudinary configuration
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js   # Authentication logic
│   │   ├── authOtp.controller.js # OTP verification
│   │   ├── friend.controller.js  # Friend management
│   │   ├── messages.controller.js # Message handling
│   │   ├── profile.controller.js # Profile updates
│   │   └── user.controller.js    # User operations
│   ├── middleware/
│   │   ├── authenticate.js      # JWT authentication
│   │   └── multer.js            # File upload config
│   ├── model/
│   │   ├── friend.model.js      # Friendship schema
│   │   ├── messages.model.js    # Message schema
│   │   ├── rooms.model.js       # Chat room schema
│   │   ├── signupOtp.model.js   # OTP schema
│   │   └── user.model.js        # User schema
│   ├── routes/
│   │   ├── auth.routes.js       # Auth endpoints
│   │   ├── friend.routes.js     # Friend endpoints
│   │   ├── message.routes.js    # Message endpoints
│   │   ├── profile.routes.js    # Profile endpoints
│   │   └── user.routes.js       # User endpoints
│   ├── socket/
│   │   ├── middleware/
│   │   │   └── auth.js          # Socket authentication
│   │   ├── chat.js              # Chat socket handlers
│   │   ├── friend.js            # Friend socket handlers
│   │   ├── index.js             # Socket.IO setup
│   │   └── userStatus.js        # Online status tracking
│   ├── utils/
│   │   ├── createOrGetRoom.js   # Room management
│   │   ├── sendEmail.js         # Email service
│   │   └── uploadImage.js       # Image upload utility
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.jsx        # API client with interceptors
│   │   ├── components/
│   │   │   ├── ChatSection.jsx  # Main chat interface
│   │   │   ├── ChatSidebar.jsx  # Navigation sidebar
│   │   │   ├── FriendsSection.jsx # Friend management
│   │   │   ├── GlobalSection.jsx  # User discovery
│   │   │   ├── ProfileSettings.jsx # Profile management
│   │   │   └── VerifyOtp.jsx     # OTP verification
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Main dashboard
│   │   │   ├── Login.jsx        # Login page
│   │   │   └── Signup.jsx       # Signup page
│   │   ├── socket/
│   │   │   └── index.js         # Socket client setup
│   │   ├── utils/
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── App.jsx              # App component
│   │   ├── index.css            # Global styles
│   │   └── main.jsx             # Entry point
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Create new account | ❌ |
| POST | `/api/auth/send-otp` | Send OTP for verification | ❌ |
| POST | `/api/auth/verify-otp` | Verify OTP and complete signup | ❌ |
| POST | `/api/auth/login` | Login to account | ❌ |
| POST | `/api/auth/logout` | Logout current session | ✅ |
| POST | `/api/auth/refresh-token` | Refresh access token | ✅ |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/all` | Get all users | ✅ |
| GET | `/api/users/:id` | Get user by ID | ✅ |

### Profile Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| PUT | `/api/profile/update` | Update profile name | ✅ |
| PUT | `/api/profile/avatar` | Update profile avatar | ✅ |
| PUT | `/api/profile/change-password` | Change password | ✅ |

### Friend Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/friends/request` | Send friend request | ✅ |
| POST | `/api/friends/accept` | Accept friend request | ✅ |
| POST | `/api/friends/reject` | Reject friend request | ✅ |
| POST | `/api/friends/remove` | Remove friend | ✅ |
| GET | `/api/friends/pending` | Get pending requests | ✅ |
| GET | `/api/friends/list` | Get friend list | ✅ |
| GET | `/api/friends/rejected` | Get rejected requests | ✅ |
| GET | `/api/friends/status/:friendId` | Check friendship status | ✅ |

### Message Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/messages` | Send a message | ✅ |
| GET | `/api/messages/:roomId` | Get room messages | ✅ |
| PUT | `/api/messages/unsend/:id` | Unsend a message | ✅ |

### Room Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/rooms` | Get user's chat rooms | ✅ |
| GET | `/api/rooms/with/:friendId` | Get/create room with friend | ✅ |

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/

# JWT Secrets (Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
ACCESS_TOKEN_SECRET=your_64_character_secret
REFRESH_TOKEN_SECRET=your_64_character_secret

# CORS
FRONTEND_URL=http://localhost:5173

# Email Service (Brevo)
BREVO_API_KEY=your_brevo_api_key

# Cloud Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

---

## 🎨 Features in Detail

### 1. Real-Time Communication
- **WebSocket Connection**: Persistent Socket.IO connection for instant updates
- **Room Management**: Automatic room creation and joining
- **Message Delivery**: Real-time message broadcasting
- **Online Status**: Live user presence tracking
- **Reconnection**: Automatic reconnection on connection loss

### 2. Friend Management System
- **Request Flow**: Send → Pending → Accept/Reject
- **Bidirectional Check**: Prevents duplicate requests
- **Status Tracking**: Real-time friendship status updates
- **Messaging Restriction**: Only friends can send messages
- **History Preservation**: Chat history remains after unfriending

### 3. Security Implementation
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Separate access and refresh tokens
- **HTTP-Only Cookies**: Secure refresh token storage
- **Token Expiration**: Graceful handling of expired tokens
- **Protected Routes**: Middleware authentication
- **Input Validation**: Server-side validation for all inputs

### 4. Email Service Integration
- **OTP Generation**: 6-digit random code
- **Email Templates**: Branded HTML email design
- **Expiration**: 5-minute validity window
- **Error Handling**: Robust error recovery
- **Rate Limiting**: Prevents spam (implementation ready)

### 5. File Upload System
- **Image Optimization**: Cloudinary automatic optimization
- **Format Support**: JPEG, PNG, GIF, WebP
- **Size Limits**: Configurable upload limits
- **CDN Delivery**: Fast global image delivery
- **Fallback Handling**: Graceful error handling

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

---

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Set environment variables in your hosting platform
2. Update `FRONTEND_URL` to your production URL
3. Set `NODE_ENV=production`
4. Deploy using Git or CLI

### Frontend Deployment (Vercel/Netlify)

1. Build the project:
```bash
npm run build
```

2. Set `VITE_API_URL` to your backend URL
3. Deploy the `dist` folder

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Aryan Kinha**
- GitHub: [@aryankinha](https://github.com/aryankinha)
- Repository: [chattingAPP](https://github.com/aryankinha/chattingAPP)

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - Frontend framework
- [Express](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Socket.IO](https://socket.io/) - Real-time engine
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [Brevo](https://www.brevo.com/) - Email service

---

## 📞 Support

If you have any questions or need help, please:
- Open an [issue](https://github.com/aryankinha/chattingAPP/issues)
- Contact: [your-email@example.com](mailto:your-email@example.com)

---

<div align="center">

Made with ❤️ by Aryan Kinha

⭐ Star this repository if you found it helpful!

</div>
