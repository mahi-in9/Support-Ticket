# AI Support Ticket Assistant

A full-stack web application where users can submit support tickets, and an AI system automatically categorizes issues and generates multiple suggested replies. The system includes role-based access with Admin and User panels.

---

## 📋 Project Description

The **AI Support Ticket Assistant** is a modern support ticket management system that leverages artificial intelligence to streamline customer support operations.

### Key Highlights:

- **AI-Powered Categorization**: Automatically classifies tickets into categories (PAYMENT, LOGIN, BUG, OTHER) using Google Gemini API
- **Multiple Reply Suggestions**: Generates 3-4 professional reply options for each ticket
- **Role-Based Access**: Separate Admin and User dashboards with appropriate permissions
- **Asynchronous Processing**: AI processes tickets in the background without blocking the main thread

---

## ✨ Features

### User Features

- ✅ Submit support tickets (name, email, description)
- ✅ View own tickets in a responsive grid layout
- ✅ View AI-generated category
- ✅ View multiple suggested AI replies
- ✅ Real-time status updates

### Admin Features

- ✅ View all tickets from all users
- ✅ Update ticket status (OPEN → RESOLVED)
- ✅ Edit or select from AI-generated replies
- ✅ Access full ticket details
- ✅ Mark tickets as resolved

### AI Features

- ✅ Categorizes tickets: PAYMENT, LOGIN, BUG, OTHER
- ✅ Generates 3-4 short professional reply suggestions
- ✅ Provides confidence scores
- ✅ Safe JSON extraction with fallback responses
- ✅ Auto-refreshes ticket while processing

---

## 🛠️ Tech Stack

### Frontend

- **React** (Vite)
- **Redux Toolkit** (State Management)
- **React Router DOM** (Routing)
- **Tailwind CSS** (Styling)
- **Axios** (HTTP Client)

### Backend

- **Node.js**
- **Express.js**
- **MongoDB** (Mongoose ODM)

### AI

- **Google Gemini API** (@google/genai)

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Google Gemini API Key

### Backend Setup

```bash
# Clone the repository
git clone <repository-url>
cd support-ticket

# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGO_URI=mongodb://localhost:27017/support-ticket

# JWT
JWT_SECRET=your-super-secret-key-change-in-production

# Google Gemini AI
GOOGLE_API_KEY=your-google-api-key-here

# Admin Secret Key (for seeding admin users)
ADMIN_SECRET_KEY=my-super-secret-admin-key-2024
```

```bash
# Start the backend server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
# Start the frontend server
npm run dev
```

---

## 🖥️ How to Run Locally

1. **Start Backend**: Navigate to `backend` folder and run `npm run dev`
2. **Start Frontend**: Navigate to `frontend` folder and run `npm run dev`
3. **Open Browser**: Go to `http://localhost:5173`

---

## 🌐 Hosted URL

> **Note**: Update these URLs when deploying

- **Frontend**: `<your deployed frontend URL>`
- **Backend**: `<your deployed backend URL>`

---

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Protected |

### Ticket Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/tickets` | Create new ticket | Authenticated |
| GET | `/api/tickets` | Get all tickets | Admin Only |
| GET | `/api/tickets/:id` | Get ticket by ID | Owner/Admin |
| POST | `/api/tickets/:id/status` | Update ticket status | Admin Only |
| POST | `/api/tickets/:id/reply` | Update AI reply | Admin Only |

---

## 📝 Assumptions Made

- ❌ No email verification implemented
- ❌ Basic JWT authentication (no refresh tokens)
- ❌ AI processing is asynchronous and non-blocking
- ❌ Admin role is predefined or manually assigned via seed endpoint
- ❌ No pagination implemented for tickets
- ❌ Simple UI focused on core functionality

---

## 🔮 Future Improvements

- Add real-time updates using WebSockets
- Add ticket priority detection (LOW, MEDIUM, HIGH)
- Add pagination and filtering for tickets
- Add email notifications for ticket updates
- Add retry mechanism for AI failures
- Add user profile management
- Add ticket assignment to support agents

---

## 📦 Notes

- The AI processing happens asynchronously - tickets are created immediately while AI generates suggestions in the background
- The frontend auto-refreshes ticket details every 3 seconds while AI is processing
- Admin users can select from suggested replies or create custom responses
- Regular users can view AI suggestions but cannot modify them
- All API responses follow a consistent format with `success`, `message`, and `data` fields

---

## 🔐 Security

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 7 days
- Users can only access their own tickets
- Admin routes are protected with role-based middleware
- Authorization headers are required for protected endpoints

---

**Built with ❤️ using the MERN Stack and Google Gemini AI**