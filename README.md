# 🚴 Kasi Food Delivery App - Backend API

A modern food delivery platform built specifically for Kagiso with youth bicycle drivers. Fast, affordable, and community-focused delivery service.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Business Model](#business-model)
- [Database Schema](#database-schema)
- [Configuration](#configuration)
- [Deployment](#deployment)

---

## ✨ Features

### Core Features
- ✅ **Kagiso-Only Operation** - Restaurants and deliveries restricted to Kagiso area
- ✅ **R25 Delivery Fee** - Fixed flat rate (R15 to drivers, R10 platform profit)
- ✅ **0% Commission** - Restaurants keep 100% of food sales
- ✅ **Youth Bicycle Drivers** - Sustainable delivery with local employment
- ✅ **Optional Tips** - 10%-100% tip range at checkout
- ✅ **Real-Time Tracking** - Socket.IO for live order updates
- ✅ **Driver Earnings** - Transparent payment tracking
- ✅ **Admin Dashboard** - Restaurant and driver management

### Payment Methods
- Stripe integration (cards)
- PayFast integration (local SA payments)
- Wallet system ready

### Authentication
- JWT-based authentication
- Role-based access (Customer, Driver, Admin, Restaurant)
- Secure password hashing with bcryptjs

---

## 🛠 Tech Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL (relational database)
- Prisma ORM
- Socket.IO (real-time updates)
- JWT Authentication
- Stripe & PayFast SDKs

**Tools:**
- Docker (optional)
- Swagger/OpenAPI documentation
- Nodemon (development)
- Postman ready

---

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

### Step 1: Clone & Install Dependencies
```bash
git clone https://github.com/blebobe/Kagiso-Food-Delivery-Backend.git
cd Kagiso-Food-Delivery-Backend
npm install
```

### Step 2: Setup Environment Variables
Copy `.env.example` to `.env` and update:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:MayDog@2025@localhost:5432/kasi_food_delivery"
JWT_SECRET="your_super_secret_jwt_key_change_this"
NODE_ENV=development

# Payment Providers
STRIPE_SECRET_KEY=sk_test_...
PAYFAST_MERCHANT_ID=10000010
PAYFAST_MERCHANT_KEY=46f0cd6945
PAYFAST_PASSPHRASE=your_passphrase
PAYFAST_MODE=sandbox
PAYFAST_BASE_URL=https://sandbox.payfast.co.za/eng/process
```

### Step 3: Setup Database
```bash
# Run migrations
npx prisma migrate deploy

# Seed with sample data
npm run seed
```

---

## 🚀 Running the App

### Development Mode
```bash
npm run dev
# Runs with nodemon - auto-restarts on file changes
# Server: http://localhost:3000
# API Docs: http://localhost:3000/api-docs
```

### Production Mode
```bash
npm start
```

### Run Seeding (Add Sample Data)
```bash
npm run seed
```

---

## 📡 API Endpoints

### 🔐 Authentication
```
POST   /auth/register          - Register new user
POST   /auth/login             - Login user
```

**Register Request:**
```json
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Login Request:**
```json
POST /auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### 🍕 Restaurants (Customer View)
```
GET    /restaurants            - List all Kagiso restaurants
GET    /restaurants/:id        - Get restaurant details
GET    /restaurants/:id/menu   - Get restaurant menu
```

### 🛒 Orders (Customer)
```
POST   /orders                 - Create new order
GET    /orders/my              - Get my orders
GET    /orders/:id             - Get order details
PATCH  /orders/:id/status      - Update order status
```

**Create Order (with tip):**
```json
POST /orders
{
  "restaurantId": 1,
  "items": [
    { "menuItemId": 1, "quantity": 2 },
    { "menuItemId": 3, "quantity": 1 }
  ],
  "subtotal": 150,
  "deliveryAddress": "123 Main Street, Kagiso",
  "tipPercentage": 15
}
```

**Response:**
```json
{
  "id": 1,
  "subtotal": 150,
  "deliveryFee": 25,
  "driverPay": 15,
  "platformProfit": 10,
  "tip": 22.50,
  "tipPercentage": 15,
  "total": 197.50,
  "status": "pending",
  ...
}
```

### 🚴 Drivers
```
GET    /drivers/available      - List available drivers
GET    /drivers/:id/earnings   - Get driver earnings
PATCH  /drivers/:id/location   - Update driver location
POST   /drivers/order/:id/delivered - Mark order as delivered
```

**Driver Earnings Response:**
```json
GET /drivers/1/earnings
{
  "id": 1,
  "name": "Thabo Mthembu",
  "totalDeliveries": 8,
  "totalEarnings": 120,
  "perDelivery": 15,
  "orders": [...]
}
```

### 💳 Payments
```
POST   /payments/stripe        - Process Stripe payment
POST   /payfast/redirect       - PayFast payment redirect
POST   /payfast/webhook        - PayFast webhook (auto)
```

### 👨‍💼 Admin Routes

**Restaurants:**
```
POST   /admin/restaurants      - Create restaurant
GET    /admin/restaurants      - List all restaurants
PUT    /admin/restaurants/:id  - Update restaurant
DELETE /admin/restaurants/:id  - Delete restaurant
```

**Drivers:**
```
POST   /admin/drivers          - Register new driver
GET    /admin/drivers          - List all drivers
PUT    /admin/drivers/:id      - Update driver
DELETE /admin/drivers/:id      - Delete driver
```

**Orders:**
```
GET    /admin/orders           - List all orders
GET    /admin/orders/analytics - Order analytics
```

**Menus:**
```
POST   /admin/menu/items       - Add menu item
PUT    /admin/menu/items/:id   - Update menu item
DELETE /admin/menu/items/:id   - Delete menu item
```

---

## 💰 Business Model

### Order Breakdown (Example: R100 food + 15% tip)

| Item | Amount | Notes |
|------|--------|-------|
| Food Subtotal | R100 | Restaurant gets 100% |
| Tip (15%) | R15 | Customer optional, goes to driver |
| Delivery Fee | R25 | Fixed rate |
| **Total** | **R140** | Customer pays |

### Delivery Fee Distribution
- **R15** → Driver (payment for delivery)
- **R10** → Platform profit (operations, maintenance)

### Driver Economics
- **Per Delivery**: R15
- **Example**: 8 deliveries/day = R120/day
- **Monthly**: 200 deliveries = R3,000/month

---

## 🗄️ Database Schema

### Users
- Customers
- Drivers (youth with bicycles)
- Admins
- Restaurants

### Orders
```
Order {
  id, userId, restaurantId, driverId
  subtotal, deliveryFee, tip, total
  tipPercentage, driverPay, platformProfit
  status, deliveryAddress
}
```

### Drivers
```
Driver {
  id, name, phone, vehicleType
  lat, lng, isAvailable
  totalEarnings, totalDeliveries
}
```

### Restaurants
```
Restaurant {
  id, name, address, location
  commission (0% default)
  menuItems[]
}
```

---

## ⚙️ Configuration

### Environment Variables

```env
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# JWT
JWT_SECRET=your_secret_key_min_32_chars

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayFast (South Africa)
PAYFAST_MERCHANT_ID=10000010
PAYFAST_MERCHANT_KEY=46f0cd6945
PAYFAST_PASSPHRASE=your_phrase
PAYFAST_MODE=live
PAYFAST_BASE_URL=https://www.payfast.co.za/eng/process
```

---

## 📊 Key Metrics & Limits

| Metric | Value |
|--------|-------|
| Delivery Area | Kagiso Only |
| Delivery Fee | R25 (Fixed) |
| Driver Payment | R15/delivery |
| Platform Profit | R10/delivery |
| Commission | 0% |
| Tip Range | 10% - 100% (Optional) |
| Tip Minimum | No minimum (with permission) |
| Driver Vehicle | Bicycle |

---

## 🧪 Testing

### Test Credentials (After Seeding)
```
Admin:    admin@kasifood.com / admin123
Customer: customer@kasifood.com / user123
Driver:   driver@kasifood.com / driver123
```

### Sample Data Included
- 3 Restaurants in Kagiso
- 12 Menu Items
- 4 Youth Drivers (Bicycles)

### Test with Postman
1. Import `postman-collection.json` (if available)
2. Set base URL: `http://localhost:3000`
3. Login and get JWT token
4. Use token in Authorization header

---

## 🚀 Deployment

### Quick Deployment Options

#### Option 1: Railway (Recommended for SA)
```bash
# 1. Create Railway account
# 2. Connect GitHub repo
# 3. Add PostgreSQL service
# 4. Set environment variables
# 5. Deploy automatically
```

#### Option 2: Render
```bash
# 1. Push to GitHub
# 2. Connect to Render
# 3. Add PostgreSQL
# 4. Deploy
```

#### Option 3: DigitalOcean
```bash
# 1. Create Droplet (Ubuntu 20.04)
# 2. Install Node, PostgreSQL
# 3. Clone repo & setup
# 4. Use PM2 for process management
# 5. Setup Nginx reverse proxy
```

### Pre-Deployment Checklist
- [ ] Update `.env` with production values
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Setup database backups
- [ ] Configure payment keys (Stripe, PayFast)
- [ ] Setup monitoring/logging
- [ ] Enable CORS for frontend domain
- [ ] Test all endpoints

---

## 📱 Frontend Requirements

Your frontend apps should communicate with these endpoints:

### Customer App
- Login/Register
- Browse restaurants
- Place orders with tips
- Track deliveries real-time
- Rate drivers/restaurants

### Driver App
- Accept orders (from queue)
- Navigate to pickup
- Navigate to delivery
- Mark as delivered (earns R15)
- View daily earnings

### Admin Dashboard
- Manage restaurants
- Manage drivers
- View analytics
- Monitor orders
- Set delivery zones

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U postgres -d kasi_food_delivery

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Socket.IO Not Connecting
- Check CORS settings in `server.js`
- Ensure frontend connects to correct URL
- Check Socket.IO version compatibility

---

## 📧 Support & Contact

- **Email**: support@kasifood.com
- **Issues**: GitHub Issues
- **Documentation**: [Full API Docs](http://localhost:3000/api-docs)

---

## 📄 License

MIT License - See LICENSE file

---

## 🎯 Roadmap

- [ ] SMS notifications (Twilio)
- [ ] Mobile apps (React Native)
- [ ] Admin dashboard (React)
- [ ] Promotions/Vouchers system
- [ ] Loyalty rewards
- [ ] Multi-language support
- [ ] Expand to other areas
- [ ] Partner restaurants dashboard

---

**Built with ❤️ for Kagiso Community**

Happy delivering! 🚴‍♂️🍕
