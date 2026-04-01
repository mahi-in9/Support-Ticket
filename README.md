# Support-Ticket

# 📌 Ticket Management System (AI-Powered Support)

A full-stack ticket management application that allows users to create support tickets, automatically process them using AI, and manage ticket status and replies through an admin interface.

---

# 🚀 Hosted Application

👉 **Live URL:**
https://support-ticket-one.vercel.app/

---

---

# Backend Api

👉 **Live URL:**
https://support-ticket-0hwg.onrender.com/

---

# ⚙️ Tech Stack

### Frontend

- React (Vite)
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- AI Service Integration (Google-Genai)

---

# 📂 Project Setup

## 1. Clone Repository

```bash
git clone https://github.com/mahi-in9/Support-Ticket.git
cd Support-Ticket
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

### Create `.env` file

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
GOOGLE_API_KEY=your_ai_api_key
FRONTEND_URL=your_frontend_url
```

### Run Backend

```bash
npm run dev
```

Backend runs on:

```
http://localhost:3000
```

---

## 3. Frontend Setup

```bash
cd frontend
npm install
```

### Create `.env` file

```env
VITE_API_URL=your_backend_url
```

### Run Frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🧪 How to Run Locally

1. Start backend server:

```bash
cd backend
npm run dev
```

2. Start frontend:

```bash
cd frontend
npm run dev
```

3. Open browser:

```
http://localhost:5173
```

---

# 📌 Features

- Create support tickets (name, email, description)
- AI-based ticket processing & categorization
- View all tickets
- View ticket details
- Update ticket status (OPEN / PENDING / RESOLVED)
- Clean UI with loading & error states

---

# 🔁 API Endpoints

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| POST   | /api/tickets            | Create ticket         |
| GET    | /api/tickets            | Get all tickets       |
| GET    | /api/tickets/:id        | Get ticket by ID      |
| POST   | /api/tickets/:id/status | Update ticket status  |
| POST   | /api/tickets/:id/reply  | Update AI/admin reply |

---

# ⚠️ Assumptions Made

- AI processing is asynchronous and triggered immediately after ticket creation
- Ticket is defined in service folder individally
- Ticket status defaults to `OPEN`
- No authentication system implemented (admin/user separation assumed)
- MongoDB is used as primary database
- API responses follow a consistent structure:

```json
{
  "category": "PAYMENT",
  "reply": "We’re sorry for the inconvenience. Please share transaction
  details.",
  "confidence": 0.92
}
```
---

# 🧠 Design Decisions

- Redux Toolkit used for centralized state management
- Async thunks handle API communication
- Separation of concerns:
  - Controllers → API logic
  - Services → AI processing

- Minimal UI to focus on functionality

---

# 🛠️ Future Improvements

- Add authentication (JWT)
- Role-based access (Admin/User)
- Ticket threads
- Pagination & filtering
- Better error handling (global middleware)

---

# 👨‍💻 Author

Mahendra
Full Stack Developer (MERN)

---
