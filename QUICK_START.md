# ⚡ Quick Start Guide - Kasi Food Delivery Backend

Get the app running in 5 minutes!

## 🎯 Prerequisites

Make sure you have installed:
- ✅ Node.js (v14+) - [Download](https://nodejs.org/)
- ✅ PostgreSQL (v12+) - [Download](https://www.postgresql.org/download/)
- ✅ Git - [Download](https://git-scm.com/)

Check installations:
```bash
node --version
npm --version
psql --version
```

---

## 📦 Installation (5 Steps)

### Step 1: Clone/Download the Project
```bash
cd c:\Users\LatitudeE5570\Desktop\My_Projects2025
# Project is already here: Kagiso-Food-Delivery-backend
```

### Step 2: Install Dependencies
```bash
cd Kagiso-Food-Delivery-backend
npm install
```

**Expected output:**
```
added 150+ packages in X seconds
```

### Step 3: Configure Database

Create PostgreSQL database:
```bash
# Open PowerShell and connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE kasi_food_delivery;

# Exit
\q
```

Or use pgAdmin (GUI):
1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name: `kasi_food_delivery`
4. Click Save

### Step 4: Setup Environment Variables
```bash
# Copy the example file
cp env.example .env

# Edit .env with your database credentials
# Database URL should look like:
DATABASE_URL="postgresql://postgres:MayDog@2025@localhost:5432/kasi_food_delivery"
JWT_SECRET="your_secret_key_here"
```

### Step 5: Run Migrations & Seed
```bash
# Run Prisma migrations
npm run migrate

# Seed sample data
npm run seed
```

**Success indicators:**
- ✅ "Database schema is up to date!"
- ✅ "✅ Seeding complete!"
- ✅ Test credentials displayed

---

## 🚀 Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Expected output:**
```
Server running on http://localhost:3000
📚 API Docs: http://localhost:3000/api-docs
```

---

## ✅ Verify Installation

### Check 1: API is Running
```bash
curl http://localhost:3000/health
# Should return: OK
```

### Check 2: Documentation is Available
Open in browser: `http://localhost:3000/api-docs`

### Check 3: Database is Connected
Look for message: "Connected to PostgreSQL"

---

## 🧪 Quick Test

### Test 1: Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kasifood.com",
    "password": "admin123"
  }'
```

**Expected:** JWT token returned

### Test 2: Get Restaurants
```bash
curl http://localhost:3000/restaurants
```

**Expected:** 3 Kagiso restaurants listed

### Test 3: Create Order
```bash
# First login to get token
# Then use token in this request
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "restaurantId": 1,
    "items": [{"menuItemId": 1, "quantity": 2}],
    "subtotal": 170,
    "deliveryAddress": "123 Main, Kagiso",
    "tipPercentage": 15
  }'
```

**Expected:** Order created with all fees calculated

---

## 📝 Test Credentials

After seeding, you have 3 accounts ready:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kasifood.com | admin123 |
| Customer | customer@kasifood.com | user123 |
| Driver | driver@kasifood.com | driver123 |

---

## 🐛 Common Issues & Quick Fixes

### Issue: "Cannot connect to database"
```bash
# Check PostgreSQL is running
# Windows: Services app → PostgreSQL → Start

# Verify connection string in .env
# Should be: postgresql://postgres:PASSWORD@localhost:5432/kasi_food_delivery

# Test connection
psql -U postgres -d kasi_food_delivery
```

### Issue: "Port 3000 already in use"
```bash
# Use a different port
PORT=3001 npm run dev

# Or kill process on port 3000
# Find process: netstat -ano | findstr :3000
# Kill it: taskkill /PID <PID> /F
```

### Issue: "Cannot find module"
```bash
# Reinstall dependencies
rm -r node_modules
npm install
```

### Issue: "Missing environment variables"
```bash
# Check .env file exists
ls -la .env

# Make sure these are set:
# DATABASE_URL=postgresql://...
# JWT_SECRET=your_secret

# Restart server after changing .env
npm run dev
```

---

## 📚 Next Steps

### For Testing
1. Use Postman collection: `Kasi_Food_Delivery_API.postman_collection.json`
2. Read: `API_TESTING_GUIDE.md`
3. Test all scenarios step-by-step

### For Development
1. Review API docs at `http://localhost:3000/api-docs`
2. Check `README.md` for feature overview
3. Explore code in `src/` folder
4. Run tests: `npm test`

### For Deployment
1. Read: `README_DEPLOY.md`
2. Choose hosting: Railway, Render, or DigitalOcean
3. Follow deployment guide

---

## 🔧 Useful Commands

```bash
# Development
npm run dev          # Start with auto-reload
npm start            # Start production mode
npm run seed         # Populate database with sample data

# Database
npm run migrate      # Apply Prisma migrations
npm run migrate:dev  # Migration with --dev flag

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode

# Linting
npm run lint         # Check code style
npm run lint:fix     # Auto-fix code style

# Database Management
npm run prisma:studio    # Open Prisma Studio (GUI for database)
npm run prisma:generate  # Generate Prisma client
```

---

## 📱 Real-Time Features

The app uses Socket.IO for real-time updates:

```javascript
// Connect from frontend
const io = require('socket.io-client')('http://localhost:3000');

// Listen to events
io.on('order:new', (order) => console.log(order));
io.on('driver:location', (data) => console.log(data));
io.on('order:delivered', (data) => console.log(data));
```

---

## 💰 Business Model Recap

- **Delivery Fee:** R25 fixed
  - Driver gets: R15
  - Platform keeps: R10
- **Commission:** 0% (no restaurant commission)
- **Tips:** Optional 10-100% of subtotal
- **Service Area:** Kagiso only
- **Drivers:** Youth on bicycles

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              Frontend Applications               │
│  (React, React Native, Flutter - To be built)  │
└──────────────────────┬──────────────────────────┘
                       │
                       │ HTTP + WebSocket
                       │
┌──────────────────────▼──────────────────────────┐
│         Express.js Backend (Running)             │
│  http://localhost:3000                          │
│  ├─ Auth Routes                                 │
│  ├─ Restaurant Routes                           │
│  ├─ Order Routes                                │
│  ├─ Driver Routes                               │
│  └─ Admin Routes                                │
└──────────────────────┬──────────────────────────┘
                       │
                       │ Prisma ORM
                       │
┌──────────────────────▼──────────────────────────┐
│      PostgreSQL Database (localhost:5432)        │
│  Database: kasi_food_delivery                   │
│  ├─ Users (customers, drivers, admins)         │
│  ├─ Restaurants                                 │
│  ├─ MenuItems                                   │
│  ├─ Orders (with pricing breakdown)            │
│  ├─ Drivers (with earnings tracking)           │
│  └─ OrderItems                                  │
└──────────────────────────────────────────────────┘
```

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Complete feature overview and documentation |
| `API_TESTING_GUIDE.md` | Comprehensive testing scenarios |
| `README_DEPLOY.md` | Deployment instructions |
| `IMPLEMENTATION_SUMMARY.md` | Technical implementation details |
| `Kasi_Food_Delivery_API.postman_collection.json` | Postman collection for API testing |

---

## 🆘 Need Help?

### Check These First
1. ✅ PostgreSQL is running
2. ✅ `.env` file exists with correct credentials
3. ✅ `npm install` completed successfully
4. ✅ Port 3000 is not in use
5. ✅ Database migrations ran without errors

### Common Resources
- **API Documentation:** http://localhost:3000/api-docs (when server running)
- **Prisma Documentation:** https://www.prisma.io/docs/
- **Express.js Guide:** https://expressjs.com/
- **Socket.IO Docs:** https://socket.io/docs/

### Test Database Connection
```bash
# In terminal/PowerShell
psql -U postgres -d kasi_food_delivery -c "SELECT version();"
```

---

## 🎉 Success Checklist

- [ ] Node.js and PostgreSQL installed
- [ ] Project cloned/downloaded
- [ ] Dependencies installed (`npm install`)
- [ ] Database created
- [ ] `.env` configured with database URL
- [ ] Migrations ran successfully
- [ ] Seed ran successfully
- [ ] Server starts without errors
- [ ] API docs accessible at `/api-docs`
- [ ] Test login works

**Once all ✅, your backend is ready for frontend development!**

---

Happy coding! 🚀 🍕
