## 🔗 Live Demo

- **Frontend:** https://news-digest-frontend.vercel.app
- **Backend API:** https://news-digest-backend.vercel.app





📰 Personalized News Digest Service (MERN – Serverless Backend)


A serverless backend application that delivers personalized news digests via email, based on user-selected topics.
The system supports manual email triggering as well as automated daily delivery using cron jobs, built with modern cloud-native practices.

📌 Problem Statement

People follow multiple news topics but:

Don’t want to visit multiple news websites daily

Miss important updates

Face information overload with irrelevant content

✅ Solution

This project automatically sends personalized news summaries via email, curated according to each user’s interests.

🚀 Features

🔐 User authentication using JWT

🗂️ Topic selection per user

📰 Fetches real-time news using NewsAPI

✉️ Sends emails using Brevo (Sendinblue)

⏰ Automated daily emails using Vercel Cron

☁️ Fully serverless backend deployment on Vercel

🧩 Clean and modular backend architecture

🛠️ Tech Stack

Node.js

MongoDB Atlas

Vercel Serverless Functions

Vercel Cron Jobs

NewsAPI

Brevo Email API

JWT Authentication

📁 Project Structure
backend/
├── api/
│   ├── auth/
│   │   ├── register.js
│   │   ├── login.js
│   ├── user/
│   │   ├── profile.js
│   │   ├── topics.js
│   ├── email/
│   │   ├── sendManual.js
│   ├── cron/
│   │   ├── dailyDigest.js
│
├── lib/
│   ├── db.js
│   ├── jwt.js
│   ├── news.js
│
├── models/
│   ├── User.js
│
├── package.json
├── package-lock.json
└── .gitignore

vercel.json
README.md

🔐 Environment Variables

Create a .env file locally (do NOT commit it):

MONGODB_URI=
NEWS_API_KEY=
BREVO_API_KEY=
JWT_SECRET=


In production, these variables are configured directly in the Vercel Dashboard.

🔄 API Flow (High Level)

User registers and logs in

JWT token is issued

User selects preferred news topics

Topics are stored per user in MongoDB

News is fetched from NewsAPI

Email is sent via Brevo:

Manually (API trigger)

Automatically (daily cron job)

⏰ Cron Job (Automated Emails)

Configured using vercel.json

Executes the daily digest endpoint at a scheduled time

Fetches all users with topics

Sends personalized emails to each user

🧪 Local Development
npm install
vercel dev


This runs the backend in a serverless simulation, identical to production.

☁️ Deployment

Backend is deployed on Vercel

Each API file acts as an independent serverless function

Cron jobs are managed by Vercel Cron

MongoDB Atlas is used for cloud database storage

🧠 Key Design Decisions

No always-running server (serverless architecture)

Database connection initialized per request

Stateless authentication using JWT

Modular and scalable codebase

Secure handling of secrets using environment variables

🎯 Use Cases

Daily personalized news emails

Topic-based content delivery

Demonstrates real-world backend + cloud skills

Suitable for academic evaluation and resume projects

👤 Author

Kiran M.M
Computer Science Engineering (Data Science)
Backend | Cloud | Full-Stack Enthusiast