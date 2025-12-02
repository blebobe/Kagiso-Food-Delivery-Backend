# 👨‍💻 Development Guide - Kasi Food Delivery Backend

Complete reference for developing, extending, and maintaining the backend.

---

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [Code Conventions](#code-conventions)
3. [Adding Features](#adding-features)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication](#authentication)
7. [Error Handling](#error-handling)
8. [Testing](#testing)
9. [Performance Tips](#performance-tips)
10. [Deployment Checklist](#deployment-checklist)

---

## 📁 Project Structure

```
Kagiso-Food-Delivery-backend/
├── src/
│   ├── controllers/           # Business logic for routes
│   │   ├── authController.js
│   │   ├── driverController.js
│   │   ├── orderController.js
│   │   ├── restaurantController.js
│   │   ├── menuController.js
│   │   ├── menuAdminController.js
│   │   ├── orderAdminController.js
│   │   ├── driverAdminController.js
│   │   └── restaurantAdminController.js
│   │
│   ├── routes/                # API endpoint definitions
│   │   ├── authRoutes.js
│   │   ├── driverRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── driverAdminRoutes.js
│   │   ├── orderAdminRoutes.js
│   │   ├── restaurantAdminRoutes.js
│   │   ├── menuAdminRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── payfastRoutes.js
│   │   └── payfastWebhook.js
│   │
│   ├── middleware/            # Request interceptors
│   │   ├── auth.js           # JWT verification
│   │   ├── admin.js          # Admin role check
│   │   ├── errorHandler.js   # Error catching
│   │   └── locationRestriction.js  # Kagiso-only delivery
│   │
│   ├── server.js              # Express app setup
│   ├── socket.js              # Socket.IO real-time setup
│   ├── swagger.js             # API documentation
│   ├── prisma.js              # Prisma client
│   └── openapi.yaml           # OpenAPI specification
│
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.js                # Sample data
│   └── migrations/            # Database version control
│
├── package.json               # Dependencies & scripts
├── .env                       # Environment variables (local)
├── env.example                # Template for .env
│
├── README.md                  # Project overview
├── QUICK_START.md            # Setup guide
├── API_TESTING_GUIDE.md      # Testing documentation
├── TROUBLESHOOTING.md        # Common issues & fixes
└── IMPLEMENTATION_SUMMARY.md # Technical details
```

---

## 🎯 Code Conventions

### Naming Conventions

**Files:**
```
controllers/   → camelCase: authController.js
routes/        → camelCase: driverRoutes.js
middleware/    → camelCase: errorHandler.js
```

**Variables & Functions:**
```javascript
// Constants - UPPER_SNAKE_CASE
const DELIVERY_FEE = 25;
const DRIVER_PAY = 15;

// Variables - camelCase
let totalPrice = 100;
const userData = {};

// Functions - camelCase, verb-first
async function getUserById(id) { }
function calculateTotal(subtotal) { }
```

**Database:**
```javascript
// Model names - PascalCase
User, Restaurant, MenuItem, Order, Driver

// Fields - camelCase
userId, restaurantId, deliveryAddress
```

---

### Code Style

```javascript
// ✅ GOOD - Clear and readable
async function createOrder(req, res) {
  try {
    const { restaurantId, items, subtotal, deliveryAddress, tipPercentage } = req.body;
    
    // Validate input
    if (!restaurantId || !items || !subtotal || !deliveryAddress) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Business logic
    const deliveryFee = 25;
    const total = parseFloat(subtotal) + deliveryFee;
    
    // Database operation
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        restaurantId,
        subtotal: parseFloat(subtotal),
        deliveryFee,
        total,
        deliveryAddress,
        items: { create: items }
      },
      include: { items: true }
    });
    
    return res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({ message: "Error creating order" });
  }
}

// ❌ BAD - Hard to read and maintain
app.post('/orders', (req, res) => {
  try {
    let r = req.body;
    let p = 25; let d = 15; let c = 10;
    let t = r.s + p;
    if (r.tip) t += (r.s * r.tip / 100);
    res.json({ total: t });
  } catch (e) {
    res.json({ error: 'err' });
  }
});
```

---

### Comments

```javascript
// ✅ GOOD - Explains WHY, not WHAT
// Delivery restricted to Kagiso to optimize logistics
function validateDeliveryAddress(address) {
  if (!address.includes('Kagiso')) {
    throw new Error('Outside service area');
  }
}

// ✅ GOOD - Complex logic explanation
// Calculate driver payment: R15 per delivery
// Driver gets paid when order is marked delivered
const DRIVER_PAYMENT_PER_DELIVERY = 15;

// ❌ BAD - Obvious from code
// Check if address includes Kagiso
if (address.includes('Kagiso')) { }

// ❌ BAD - Out of date
// TODO: Make tip percentage dynamic (it's not dynamic, it is fixed 10-100%)
```

---

## ➕ Adding Features

### Example: Adding a Discount Feature

#### Step 1: Update Database Schema

```prisma
// prisma/schema.prisma

model Order {
  id              Int       @id @default(autoincrement())
  userId          Int
  user            User      @relation(fields: [userId], references: [id])
  
  subtotal        Float
  deliveryFee     Float     @default(25)
  discount        Float     @default(0)      // NEW
  discountCode    String?                    // NEW
  tip             Float     @default(0)
  total           Float
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Discount {                             // NEW
  id              Int       @id @default(autoincrement())
  code            String    @unique
  percentage      Float     // 0-100
  maxUses         Int
  usedCount       Int       @default(0)
  expiresAt       DateTime
  active          Boolean   @default(true)
  createdAt       DateTime  @default(now())
}
```

#### Step 2: Create Migration

```bash
npm run prisma -- migrate dev --name add_discount_feature
```

#### Step 3: Create Controller Function

```javascript
// src/controllers/orderController.js

async function validateAndApplyDiscount(discountCode) {
  const discount = await prisma.discount.findUnique({
    where: { code: discountCode }
  });
  
  if (!discount) {
    throw new Error('Invalid discount code');
  }
  
  if (!discount.active) {
    throw new Error('Discount is no longer valid');
  }
  
  if (discount.usedCount >= discount.maxUses) {
    throw new Error('Discount has reached maximum uses');
  }
  
  if (new Date() > discount.expiresAt) {
    throw new Error('Discount has expired');
  }
  
  return discount;
}

async function createOrderWithDiscount(req, res) {
  try {
    const { discountCode, ...orderData } = req.body;
    
    // Validate and apply discount
    let discount = null;
    if (discountCode) {
      discount = await validateAndApplyDiscount(discountCode);
    }
    
    // Calculate totals
    const subtotal = parseFloat(orderData.subtotal);
    const deliveryFee = 25;
    const discountAmount = discount ? (subtotal * discount.percentage) / 100 : 0;
    const tip = orderData.tipPercentage ? (subtotal * orderData.tipPercentage) / 100 : 0;
    const total = subtotal + deliveryFee + tip - discountAmount;
    
    // Create order with discount
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        ...orderData,
        subtotal,
        deliveryFee,
        discount: discountAmount,
        discountCode: discount?.code,
        tip,
        total
      }
    });
    
    // Increment discount usage
    if (discount) {
      await prisma.discount.update({
        where: { id: discount.id },
        data: { usedCount: { increment: 1 } }
      });
    }
    
    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
```

#### Step 4: Add Route

```javascript
// src/routes/orderRoutes.js

router.post('/', authenticateToken, createOrderWithDiscount);
```

#### Step 5: Add Admin Endpoints

```javascript
// src/routes/orderAdminRoutes.js

router.post('/discounts', admin, async (req, res) => {
  try {
    const discount = await prisma.discount.create({
      data: req.body
    });
    res.status(201).json(discount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/discounts', admin, async (req, res) => {
  const discounts = await prisma.discount.findMany();
  res.json(discounts);
});
```

---

## 💾 Database Schema

### Current Schema Overview

```
┌─────────────────────────────────────────────────┐
│                      User                        │
├─────────────────────────────────────────────────┤
│ id, email, password, name, role                 │
│ role: "admin" | "customer" | "driver"           │
└─────────────────────────────────────────────────┘
           ↓                  ↓
      (customer)          (driver)
           ↓                  ↓
       ┌───────────────────────────┐
       │      Relationships         │
       │                           │
  ┌─────────────────┐    ┌───────────────────┐
  │   Restaurant    │    │      Driver       │
  ├─────────────────┤    ├───────────────────┤
  │ id, name        │    │ id, name          │
  │ location        │    │ totalEarnings     │
  │ commission      │    │ totalDeliveries   │
  │                 │    │ vehicleType       │
  └────────┬────────┘    └────────┬──────────┘
           │                      │
           │                      │
      ┌────▼──────────────────────▼───┐
      │          Order                 │
      ├────────────────────────────────┤
      │ id, userId, restaurantId       │
      │ driverId (assigned)            │
      │ subtotal, deliveryFee          │
      │ driverPay (R15)                │
      │ platformProfit (R10)           │
      │ tip, tipPercentage             │
      │ total, status                  │
      └───────┬────────────────────────┘
              │
         ┌────▼──────────────┐
         │  OrderItem        │
         ├───────────────────┤
         │ orderId           │
         │ menuItemId        │
         │ quantity, price   │
         └───────────────────┘
              ↑
              │
         ┌────┴──────────────┐
         │   MenuItem        │
         ├───────────────────┤
         │ restaurantId      │
         │ name, price       │
         │ description       │
         └───────────────────┘
```

### Key Models

**Order Pricing Breakdown:**
```javascript
{
  subtotal: 100,        // Items total
  deliveryFee: 25,      // Fixed flat fee
  driverPay: 15,        // What driver gets (included in fee)
  platformProfit: 10,   // What platform keeps (included in fee)
  tip: 15,              // Customer tip (10-100% of subtotal, optional)
  tipPercentage: 15,    // Tip percentage (stored for reference)
  total: 140            // subtotal + deliveryFee + tip
}
```

**Driver Earnings:**
```javascript
{
  id: 1,
  name: "Driver Name",
  totalDeliveries: 9,   // Cumulative count
  totalEarnings: 135,   // 9 × R15
  vehicleType: "bicycle",
  location: "Kagiso"
}
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /auth/register              # Create account
POST   /auth/login                 # Get JWT token
```

### Customers
```
GET    /restaurants                # List all Kagiso restaurants
GET    /restaurants/:id            # Get specific restaurant
GET    /restaurants/:id/menu       # Get restaurant menu

POST   /orders                     # Create order with tip
GET    /orders/my                  # Get user's orders
GET    /orders/:id                 # Get specific order
PATCH  /orders/:id                 # Update order status
```

### Drivers
```
GET    /drivers/available          # List available drivers
GET    /drivers/:id/earnings       # Get driver earnings
PATCH  /drivers/:id/location       # Update location
POST   /drivers/order/:id/delivered # Mark order delivered (+R15)
```

### Admin
```
POST   /admin/restaurants          # Create restaurant
PUT    /admin/restaurants/:id      # Update restaurant
DELETE /admin/restaurants/:id      # Delete restaurant

POST   /admin/menu/items           # Add menu item
PUT    /admin/menu/items/:id       # Update menu item
DELETE /admin/menu/items/:id       # Delete menu item

POST   /admin/drivers              # Register driver
PATCH  /admin/drivers/:id          # Update driver
GET    /admin/drivers              # List all drivers

GET    /admin/orders               # List all orders
POST   /admin/orders/:id/assign    # Assign driver to order
```

### Documentation
```
GET    /api-docs                   # Swagger UI
GET    /health                     # Server status
```

---

## 🔐 Authentication

### JWT Token Flow

```
1. User registers/logins
   ↓
2. Server creates JWT token with user data
   Token contains: { id, email, role, iat, exp }
   ↓
3. Client stores token (localStorage/cookies)
   ↓
4. Client sends token in Authorization header
   Authorization: Bearer eyJhbGciOi...
   ↓
5. Server middleware (auth.js) verifies token
   ↓
6. Request processed with user info attached (req.user)
```

### Implementing Auth

**In a Route:**
```javascript
router.get('/protected', authenticateToken, (req, res) => {
  // req.user contains: { id, email, role }
  const userId = req.user.id;
  res.json({ message: `Hello ${req.user.email}` });
});

// For admin-only routes
router.post('/admin-action', authenticateToken, admin, (req, res) => {
  // Only admins can access
});
```

**Creating a Token:**
```javascript
const jwt = require('jsonwebtoken');

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}
```

---

## ❌ Error Handling

### Standard Error Response Format

```javascript
// ✅ GOOD - Consistent error responses
const errorResponse = (res, statusCode, message, error = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: error ? error.message : undefined
  });
};

// Usage
res.status(400).json({
  success: false,
  message: "Invalid delivery address",
  error: "Address must include Kagiso"
});
```

### Common HTTP Status Codes

```javascript
200 OK             // Request successful
201 Created        // Resource created
400 Bad Request    // Invalid input
401 Unauthorized   // Missing/invalid token
403 Forbidden      // User doesn't have permission
404 Not Found      // Resource doesn't exist
409 Conflict       // Resource already exists
500 Server Error   // Unexpected server error
```

### Try-Catch Pattern

```javascript
async function safeOperation(req, res) {
  try {
    // Business logic
    const result = await someAsyncOperation();
    return res.json(result);
  } catch (error) {
    // Log for debugging
    console.error('Operation error:', error);
    
    // Send appropriate response
    if (error.message.includes('validation')) {
      return res.status(400).json({ message: error.message });
    }
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    
    // Generic error
    return res.status(500).json({ message: "Operation failed" });
  }
}
```

---

## 🧪 Testing

### Manual Testing (cURL)

```bash
# Test endpoint
curl -X GET http://localhost:3000/restaurants \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test with body
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"restaurantId":1,"items":[],"subtotal":100}'
```

### Automated Testing

```bash
# Run tests
npm test

# Run with watch mode
npm run test:watch

# Run specific test file
npm test -- orderController.test.js
```

### Test Example

```javascript
// tests/orderController.test.js
const request = require('supertest');
const app = require('../src/server');

describe('Order Controller', () => {
  let token;
  
  beforeAll(async () => {
    // Login and get token
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password'
      });
    token = res.body.token;
  });
  
  describe('POST /orders', () => {
    it('should create order with tip', async () => {
      const res = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          restaurantId: 1,
          items: [{ menuItemId: 1, quantity: 1 }],
          subtotal: 100,
          deliveryAddress: '123 Main, Kagiso',
          tipPercentage: 15
        });
      
      expect(res.status).toBe(201);
      expect(res.body.total).toBe(140); // 100 + 25 + 15
    });
    
    it('should reject address without Kagiso', async () => {
      const res = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          restaurantId: 1,
          subtotal: 100,
          deliveryAddress: '123 Main, Johannesburg'
        });
      
      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Kagiso');
    });
  });
});
```

---

## 🚀 Performance Tips

### 1. Database Optimization

```javascript
// ❌ BAD - N+1 query problem
const orders = await prisma.order.findMany();
for (const order of orders) {
  order.user = await prisma.user.findUnique({
    where: { id: order.userId }
  });
  // Queries N times
}

// ✅ GOOD - Use include to fetch relations
const orders = await prisma.order.findMany({
  include: {
    user: true,
    items: true,
    restaurant: true
  }
});
// Single efficient query
```

### 2. Caching

```javascript
// Simple in-memory cache for restaurants
let restaurantCache = null;
let cacheExpiry = null;

async function getRestaurantsWithCache() {
  const now = Date.now();
  
  if (restaurantCache && cacheExpiry > now) {
    return restaurantCache;
  }
  
  // Fetch fresh data
  const restaurants = await prisma.restaurant.findMany();
  
  // Cache for 5 minutes
  restaurantCache = restaurants;
  cacheExpiry = now + (5 * 60 * 1000);
  
  return restaurants;
}
```

### 3. Pagination

```javascript
async function getPaginatedOrders(req, res) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 20;
  const skip = (page - 1) * pageSize;
  
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.order.count()
  ]);
  
  res.json({
    orders,
    pagination: {
      page,
      pageSize,
      total,
      pages: Math.ceil(total / pageSize)
    }
  });
}
```

### 4. Connection Pooling

```javascript
// Already configured in Prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Prisma automatically manages connection pool
}
```

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backups setup
- [ ] HTTPS/SSL enabled
- [ ] CORS configured for frontend domain
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Performance monitoring setup
- [ ] Security headers added
- [ ] API documentation up to date
- [ ] Database migrations tested
- [ ] Backup/recovery plan documented

### Pre-Deployment Security

```javascript
// Add security headers
const helmet = require('helmet');
app.use(helmet());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Validate inputs
const { body, validationResult } = require('express-validator');

router.post('/orders', [
  body('subtotal').isFloat({ min: 0 }),
  body('deliveryAddress').notEmpty().trim(),
  body('tipPercentage').optional().isInt({ min: 10, max: 100 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
```

---

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/discount-system

# Make changes and commit
git add .
git commit -m "feat: add discount code functionality"

# Push to repository
git push origin feature/discount-system

# Create Pull Request on GitHub
# After review, merge to main
git checkout main
git pull
git merge feature/discount-system
```

---

## 📚 Additional Resources

- **Express.js:** https://expressjs.com/
- **Prisma:** https://www.prisma.io/docs/
- **PostgreSQL:** https://www.postgresql.org/docs/
- **JWT:** https://jwt.io/
- **Node.js Best Practices:** https://nodejs.org/en/docs/guides/

---

Happy coding! 🚀
