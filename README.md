# 🌍 Lugaish - Language Learning Platform

**Learn Arabic & English with the best daily learning system**

A full-stack language learning platform built with React + Vite (frontend) and Node.js + Express (backend). Learn languages through interactive lessons, quizzes, and gamified progress tracking.

## 📊 Project Structure

```
lpc-language-portal/
├── frontend/                    # React + Vite app
│   ├── src/
│   │   ├── pages/              # All route pages
│   │   ├── components/         # Reusable components
│   │   ├── state/              # Context API state
│   │   ├── data/               # Course data
│   │   └── styles.css          # Tailwind + animations
│   ├── index.html
│   └── package.json
│
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth middleware
│   │   └── config.js          # Configuration
│   ├── seed.js               # Sample data seeder
│   ├── package.json
│   └── .env
│
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB 4.4+
- npm or yarn

### Setup Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Frontend runs on: **http://localhost:4174**

### Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file with MongoDB and JWT config
# See backend/README.md for details

# Seed sample lessons
node seed.js

# Start backend server
npm run dev
```

Backend runs on: **http://localhost:5000**

## 🗺️ URL Structure

| Path | Purpose |
|------|---------|
| `/` | Home page |
| `/auth` | Login/signup |
| `/pricing` | Pricing plans |
| `/course/:language` | Course overview (English/Arabic) |
| `/today` | Today's lesson |
| `/lesson/:day` | Detailed lesson view |
| `/quiz` | Quiz for lesson |
| `/dashboard` | User dashboard |
| `/progress` | Progress tracking |
| `/profile` | User profile |
| `/leaderboard` | Top learners |

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/signup        - Create account
POST   /api/auth/login         - Login
GET    /api/auth/me            - Current user (protected)
```

### Courses & Lessons

```
GET    /api/courses             - All courses
GET    /api/courses/:language   - Course by language
GET    /api/lessons/:lang/:day  - Lesson details
GET    /api/lessons/today/:lang - Today's lesson (protected)
POST   /api/lessons/complete    - Mark complete (protected)
```

### Progress

```
GET    /api/progress/:language  - User progress (protected)
POST   /api/progress/update     - Update progress (protected)
```

### Quiz

```
POST   /api/quiz/submit         - Submit answers (protected)
```

## 🎯 Key Features

### Frontend (React + Vite)

✅ **Homepage** - Marketing funnel with 7 optimized sections  
✅ **Course Selection** - Choose English or Arabic pathway  
✅ **Daily Lessons** - Structured 10-15 minute lessons  
✅ **Interactive Quizzes** - Reinforce learning  
✅ **Progress Tracking** - XP, streaks, badges, heatmap  
✅ **Dashboard** - User control center  
✅ **User Auth** - Login/signup system  
✅ **Dark/Light Theme** - Theme toggle  
✅ **Responsive Design** - Mobile-first UI  
✅ **Smooth Animations** - Framer Motion-ready CSS  

### Backend (Node.js + Express)

✅ **JWT Authentication** - Secure user sessions  
✅ **MongoDB Integration** - Persistent data storage  
✅ **RESTful APIs** - Clean endpoint structure  
✅ **Password Hashing** - bcryptjs security  
✅ **CORS Enabled** - Frontend-backend communication  
✅ **Error Handling** - Robust error responses  
✅ **Database Seeding** - Sample lessons included  

### Database (MongoDB)

**Collections:**
- `users` - Learner profiles
- `lessons` - Course content (30 days each language)
- `progress` - Learning statistics
- `quiz` - Quiz results

## 🎨 Design & Technology

**Frontend Stack:**
- React 19
- Vite (build tool)
- React Router DOM
- Tailwind CSS
- Context API for state

**Backend Stack:**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs password hashing
- CORS middleware

**Design Principles:**
- Clean, modern UI (Duolingo-style)
- Responsive mobile-first design
- Smooth animations
- Accessibility-focused
- Fast performance

## 📚 Learning Flow

1. **User lands on homepage** → Sees value proposition
2. **Chooses language** → English or Arabic
3. **Views pricing** → Free or Premium
4. **Signs up/logs in** → Creates account
5. **Completes today's lesson** → Video, vocabulary, grammar
6. **Takes mini quiz** → Reinforces learning
7. **Earns XP & streaks** → Gamification motivation
8. **Views progress** → Heatmap, badges, achievements
9. **Comes back daily** → Habit formation

## 🔐 Security Features

- JWT token-based authentication
- Bcrypt password hashing (10 salt rounds)
- Protected API endpoints with middleware
- CORS configured for frontend domain
- Environment variables for secrets (.env)
- MongoDB ObjectId for user isolation

## 💡 Future Enhancements

- [ ] Email verification & password reset
- [ ] Payment integration (Stripe/BKash)
- [ ] Voice recording & speech recognition
- [ ] Social features (friend challenges, leaderboards)
- [ ] AI-powered personalization
- [ ] Mobile app (React Native)
- [ ] Admin dashboard for content management
- [ ] Certification system
- [ ] Content partnerships
- [ ] Analytics & learning insights

## 🚢 Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
# Upload dist/ folder to Vercel/Netlify
```

### Backend (Railway/Render)

```bash
# Push code to GitHub
# Connect repo to Railway/Render
# Set environment variables
# Deploy automatically
```

## 📖 Documentation

- **Backend Setup:** See [backend/README.md](backend/README.md)
- **Frontend Components:** Check [src/components/](src/components/)
- **API Examples:** See [backend/README.md](backend/README.md)

## 🤝 Contributing

To add new lessons:

1. Edit `backend/seed.js`
2. Add lesson object with day, language, vocabulary, etc.
3. Run `node seed.js` to update database
4. Frontend automatically picks up new lessons

## 📞 Support

For issues or questions:
- Check backend logs: `npm run dev` output
- Check frontend console: Browser DevTools
- Verify MongoDB connection in `.env`
- Ensure CORS is configured correctly

## 📄 License

MIT License - Feel free to use, modify, and distribute

---

**Built with ❤️ for language learners worldwide**

Start learning today: **http://localhost:4174**
