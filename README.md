# ✈️ AI Travel Planner

An AI-powered travel planning application that generates personalized travel itineraries, hotel recommendations, budget breakdowns, and packing lists based on user preferences.

---

## 🚀 Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes

### AI Travel Planning
- Generate travel itineraries using AI
- Destination-based planning
- Budget-based recommendations
- Interest-based customization

### Trip Management
- View all trips
- View trip details
- Delete trips
- Regenerate daily plans

### Smart Planning
- Day-wise itinerary
- Hotel recommendations
- Budget breakdown
- Packing checklist

### Dashboard
- Total Trips
- Total Budget
- AI Generated Trips

---

## 🛠️ Tech Stack

### Frontend
- Next.js 13
- React.js
- TypeScript
- Tailwind CSS
- Shadcn UI
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

### AI Integration
- Groq API
- Llama 3.3 70B Versatile Model

---

## 📂 Project Structure

### Frontend

```bash
frontend/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── lib/
│   └── hooks/
│
├── public/
├── package.json
└── tailwind.config.js
```

### Backend

```bash
backend/
│
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── config/
│
├── server.js
└── package.json
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_groq_api_key
```

Start backend:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Start frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

---

## API Endpoints

### Authentication

| Method | Endpoint |
|----------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| GET | /api/auth/me |
| PUT | /api/auth/change-password |

### Trips

| Method | Endpoint |
|----------|----------|
| GET | /api/trips |
| GET | /api/trips/:id |
| POST | /api/trips/generate |
| DELETE | /api/trips/:id |
| PATCH | /api/trips/:tripId/packing/:itemId |

### Dashboard

| Method | Endpoint |
|----------|----------|
| GET | /api/trips/dashboard/stats |

---

## 🤖 AI Workflow

1. User enters destination, duration, budget, and interests.
2. Frontend sends data to backend.
3. Backend calls Groq AI API.
4. AI generates:
   - Travel Itinerary
   - Hotels
   - Budget Breakdown
   - Packing List
5. Data is stored in MongoDB.
6. User can view and manage trips.

---

## 🔒 Security

- JWT Authentication
- Password Hashing using bcrypt
- Protected API Routes
- User-specific Trip Access

---



---

## 👨‍💻 Author

Omprakash Karri

B.Tech – Computer Science (Data Science)

---

## 📄 License

This project is created for educational and internship assignment purposes.
