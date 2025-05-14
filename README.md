📊 TeamPolls — Real-Time Polling App
TeamPolls is a real-time polling system built using Fastify, WebSockets, Redis, PostgreSQL, and a modern React frontend. It enables quick decision-making with live results, vote predictions powered by AI, and engaging user interactions.

🚀 Features
✅ REST + WebSocket API with Fastify

✅ Real-time Poll Updates (WebSocket)

✅ Anonymous JWT Authentication (/auth/anon)

✅ Rate-limiting Votes (5 votes/sec per user)

✅ Auto Poll Expiry Handling

✅ AI-Powered Vote Predictions (Gemini API)

✅ Vote Visualization with Recharts

✅ Live Celebration Effects (Framer Motion)

✅ Fully Responsive React + Vite + Tailwind UI

✅ Persistence with PostgreSQL & Prisma ORM

✅ CronJob for detecting the expired polls

✅ Redis for Rate-Limiting & WebSocket Broadcasts

✅ Docker-First Setup

📦 Tech Stack
Backend: Fastify, WebSockets, Prisma ORM, PostgreSQL, Redis, JWT, Docker

Frontend: React (Vite), Tailwind CSS, Recharts, Framer Motion

AI Integration: Google Gemini API

📚 API Endpoints
Method	Endpoint	Description
POST	/auth/anon	Generate Anonymous JWT Token
POST	/poll	Create a New Poll
POST	/poll/:id/vote	Cast Vote (Authenticated)
GET	/poll/:id	Get Poll Tally + Metadata
GET	/poll/:id/predict	AI-Powered Vote Prediction
WS	/polls/ws	Real-time Poll Updates

🐳 Docker Setup
bash
Copy
Edit
docker-compose up --build
⚙️ Manual Setup
Clone the Repo:

bash
Copy
Edit
git clone https://github.com/roshanzamil/teampolls.git
cd teampolls
Install Dependencies:

bash
Copy
Edit
npm install
Setup Prisma:

bash
Copy
Edit
npx prisma migrate dev --name init
Run Redis via Docker:

bash
Copy
Edit
docker run -d --name redis -p 6379:6379 redis
Start Backend & Frontend:

bash
Copy
Edit
# Backend
npx ts-node src/index.ts

# Frontend
cd teampolls-frontend
npm install
npm run dev
🎉 Usage Flow
Create Poll → /poll

Fetch JWT Token → /auth/anon

Cast Vote → /poll/:id/vote

Watch Real-Time Results Update via WebSocket

View AI Prediction on Which Option Will Win

🤖 AI Prediction
Integrated with Google Gemini API.

Predicts winning option based on current votes and vote speed.

API Key is securely managed via environment variables.

📈 Visualizations
Real-time results displayed using Recharts Pie Charts.

AI Prediction Results highlighted directly under the charts.

Celebration Effects powered by Framer Motion on vote cast.

🛡️ Security & Rate Limiting
JWT Authentication for Voting.

Rate Limiting: Max 5 votes/sec per user.

Redis-backed Rate Limiting for distributed environments.

📸 Demo Recording
https://we.tl/t-qX3YEAuAe4
