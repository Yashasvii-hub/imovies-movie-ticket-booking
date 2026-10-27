# 🎬 IMovies — Movie Ticket Booking Made Simple

[![Node.js Version](https://img.shields.io/badge/Node.js-v24.22.1-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21.2-blue.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.11-646cff.svg)](https://vitejs.dev/)
[![Test Suite](https://img.shields.io/badge/Tests-17%20Passed%20(100%25)-success.svg)](docs/TEST_CASES.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, full-stack online movie ticketing platform engineered for high performance, zero-friction booking, and seamless demo reliability.

---

## 🌟 Key Features

- **Dynamic Movie Catalog**: Real-time browsing, search by actor/director/title, and category filtering (Action, Sci-Fi, Biography, Drama, etc.).
- **Interactive Auditorium Seat Selector**: Visual representation of theater layout with curved projection screen indicator, tiered seating (**Standard**, **Premium**, **VIP Recliners**), and dynamic price tallying.
- **Seat Locking & Anti-Collision Engine**: Temporary 8-minute locks to prevent double-booking collisions during checkout.
- **Simulated Payment Gateway**: PCI-DSS sandbox payment simulation supporting Credit/Debit Cards, UPI / VPA, Net Banking, and Digital Wallets.
- **Instant E-Ticket Issuance**: Digital ticket vouchers with scannable QR code visual, unique Booking Reference (`IM-XXXXXXXX`), and print support.
- **Customer Booking Management**: User dashboard displaying booking history with real-time cancellation and automatic seat release.
- **Cinema Administration Dashboard**: Real-time KPI analytics (Total Revenue, Confirmed Bookings, Active Movies, Total Users), movie catalog manager, and system-wide transaction ledger.
- **Evaluator 1-Click Demo Login**: Pre-configured Demo User and Demo Admin credentials for one-click testing without manual registration.
- **Dual Persistence Architecture**: Connects transparently to **MongoDB Atlas** while including a built-in zero-config in-memory persistence layer for instant offline evaluation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Lucide React, Modern CSS Glassmorphism |
| **Backend** | Node.js (v24), Express.js (v4.21.2), RESTful APIs |
| **Database** | MongoDB / MongoDB Atlas, Mongoose ODM (with Memory Mock fallback) |
| **Security** | JSON Web Tokens (JWT), Bcrypt password hashing, RBAC Middleware |
| **Testing** | Node.js Native Test Runner (`node --test`), assert module |
| **Deployment** | Vercel (`vercel.json`), Render (`render.yaml`), Netlify (`netlify.toml`) |

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher; v24 recommended)
- [Git](https://git-scm.com/)

### 2. Clone Repository
```bash
git clone https://github.com/Yashasvii-hub/imovies-movie-ticket-booking.git
cd imovies-movie-ticket-booking
```

### 3. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install client dependencies
npm --prefix client install
```

### 4. Configure Environment
Duplicate `.env.example` as `.env`:
```bash
cp .env.example .env
```
*(The application works immediately out-of-the-box with default settings, including in-memory database mode if MongoDB Atlas is not yet configured).*

### 5. Build Frontend
```bash
npm run build
```

### 6. Run the Application
```bash
npm start
```
The application will launch at:
👉 **`http://localhost:5000`**

---

## 🔑 Demo & Testing Credentials

For evaluator convenience, you can either click the **"Demo User"** and **"Demo Admin"** buttons in the navbar or use the credentials below:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Demo User** | `user@imovies.com` | `UserPass123!` | Movie browsing, seat selection, booking, booking history |
| **Demo Admin** | `admin@imovies.com` | `AdminPass123!` | Full admin dashboard, revenue KPIs, catalog & booking control |

---

## 🧪 Automated Test Suite

Run the genuine automated test suite covering all 17 end-to-end and integration cases:
```bash
npm test
```
See the full test execution log in [`docs/TEST_CASES.md`](docs/TEST_CASES.md).

---

## 📁 Repository Structure

```
imovies-movie-ticket-booking/
├── .env.example               # Template environment configuration (no secrets)
├── .gitignore                  # Comprehensive production git ignore
├── package.json               # Root scripts (start, dev, build, test, seed)
├── README.md                  # Complete project documentation
├── DEMO.md                    # 5-minute evaluator presentation script
├── vercel.json                # Vercel deployment configuration
├── render.yaml                # Render service definition
├── Procfile                   # Cloud process file
├── docs/
│   ├── PROJECT_REPORT.md      # Detailed academic/capstone report
│   ├── API_DOCUMENTATION.md   # Complete RESTful endpoint reference
│   ├── TEST_CASES.md          # 17 genuinely executed test cases
│   ├── SCREENSHOTS.md         # UI view checklist
│   └── IMovies_API_Postman_Collection.json # Postman collection v2.1
├── server/
│   ├── config/                # MongoDB & memory store persistence
│   ├── controllers/           # Auth, Movies, Showtimes, Bookings, Admin
│   ├── middleware/            # JWT verification & RBAC authorization
│   ├── models/                # User, Movie, Theater, Showtime, Booking
│   ├── routes/                # REST endpoints
│   ├── seed/                  # Database seeding script
│   ├── tests/                 # Automated test suite (TC01 - TC17)
│   └── server.js              # Express app entrypoint & static build server
└── client/
    ├── src/
    │   ├── components/        # Navbar, Footer, MovieCard, SeatMap, Modals
    │   ├── context/           # AuthContext & session management
    │   ├── pages/             # Home, Details, Booking, History, Admin
    │   ├── services/          # API client wrapper
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── vite.config.js
```

---

## 🌐 Deployment Guidelines

### Frontend Deployment (Vercel)
1. Import the repository in [Vercel](https://vercel.com).
2. Set Root Directory to `client`.
3. Set Build Command to `npm run build` and Output Directory to `dist`.
4. Configure Environment Variable:
   - `VITE_API_URL`: Your hosted backend URL.

### Backend Deployment (Render / Railway / Heroku)
1. Create a new **Web Service** on [Render](https://render.com) pointing to the root repository.
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Configure Environment Variables:
   - `NODE_ENV=production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Secure random string
   - `FRONTEND_URL`: Hosted frontend URL for CORS

---

## 📄 License
This project is licensed under the MIT License.
Built for the **Skill Wallet Major Capstone Project Evaluation**.
Developer: **Yashasvi Goswami** ([@Yashasvii-hub](https://github.com/Yashasvii-hub))
