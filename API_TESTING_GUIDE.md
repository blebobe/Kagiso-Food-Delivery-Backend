# 🧪 Kasi Food Delivery - API Testing Guide

Complete guide to testing all endpoints of the Kasi Food Delivery App backend.

## 🚀 Quick Start

1. **Start the server:**
   ```bash
   npm run dev
   ```
   Server runs on: `http://localhost:3000`
   API Docs: `http://localhost:3000/api-docs`

2. **Seed sample data:**
   ```bash
   npm run seed
   ```

3. **Test with cURL, Postman, or Thunder Client**

---

## 🔑 Test Credentials

After seeding, use these credentials:

```
Admin User:
  Email: admin@kasifood.com
  Password: admin123
  Role: admin

Customer User:
  Email: customer@kasifood.com
  Password: user123
  Role: customer

Driver User:
  Email: driver@kasifood.com
  Password: driver123
  Role: driver
```

---

## 📋 Test Scenarios

### Scenario 1: Customer Places Order with Tip

#### Step 1: Register/Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@kasifood.com",
    "password": "user123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 2,
    "email": "customer@kasifood.com",
    "name": "John Customer",
    "role": "customer"
  }
}
```

**Save the token** - use it in Authorization header for next requests:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Step 2: Get Restaurants
```bash
curl http://localhost:3000/restaurants \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Kagiso Grill & Chill",
    "description": "Best grilled meats in Kagiso",
    "location": "Kagiso",
    "commission": 0,
    ...
  },
  ...
]
```

#### Step 3: Get Restaurant Menu
```bash
curl http://localhost:3000/restaurants/1/menu \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "name": "Kagiso Grill & Chill",
  "items": [
    {
      "id": 1,
      "name": "Grilled Chicken Half",
      "price": 85,
      "description": "Flame-grilled half chicken with sauce"
    },
    ...
  ]
}
```

#### Step 4: Create Order with Tip (15%)
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "restaurantId": 1,
    "items": [
      {
        "menuItemId": 1,
        "quantity": 2
      },
      {
        "menuItemId": 3,
        "quantity": 1
      }
    ],
    "subtotal": 235,
    "deliveryAddress": "123 Main Street, Kagiso",
    "tipPercentage": 15
  }'
```

**Response:**
```json
{
  "id": 1,
  "userId": 2,
  "restaurantId": 1,
  "subtotal": 235,
  "tip": 35.25,
  "tipPercentage": 15,
  "deliveryFee": 25,
  "driverPay": 15,
  "platformProfit": 10,
  "total": 295.25,
  "status": "pending",
  "deliveryAddress": "123 Main Street, Kagiso",
  "items": [...],
  "createdAt": "2025-12-02T10:30:00Z"
}
```

#### Step 5: View My Orders
```bash
curl http://localhost:3000/orders/my \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Scenario 2: Driver Accepts & Completes Delivery

#### Step 1: Driver Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "driver@kasifood.com",
    "password": "driver123"
  }'
```

**Save driver token**

#### Step 2: Get Available Orders
```bash
curl http://localhost:3000/drivers/available \
  -H "Authorization: Bearer DRIVER_TOKEN"
```

#### Step 3: Update Location (Real-time tracking)
```bash
curl -X PATCH http://localhost:3000/drivers/1/location \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DRIVER_TOKEN" \
  -d '{
    "lat": -26.2041,
    "lng": 27.8479
  }'
```

#### Step 4: Mark Order as Delivered
```bash
curl -X POST http://localhost:3000/drivers/order/1/delivered \
  -H "Authorization: Bearer DRIVER_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "status": "delivered",
  "updatedAt": "2025-12-02T10:45:00Z"
}
```

#### Step 5: Check Driver Earnings
```bash
curl http://localhost:3000/drivers/1/earnings \
  -H "Authorization: Bearer DRIVER_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "name": "Thabo Mthembu",
  "totalDeliveries": 9,
  "totalEarnings": 135,
  "perDelivery": 15,
  "orders": [...]
}
```

**Earnings Calculation:**
- Previous: R120 (8 deliveries × R15)
- New delivery: +R15
- Total: R135 (9 deliveries)

---

### Scenario 3: Admin Tasks

#### Admin Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kasifood.com",
    "password": "admin123"
  }'
```

#### Create New Restaurant
```bash
curl -X POST http://localhost:3000/admin/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "name": "Kasi Pizza Palace",
    "description": "Fresh pizza made daily",
    "address": "321 Township Ave, Kagiso",
    "location": "Kagiso",
    "imageUrl": "https://via.placeholder.com/300x200"
  }'
```

#### Register New Driver
```bash
curl -X POST http://localhost:3000/admin/drivers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "name": "Amahle Khumalo",
    "phone": "0761234567",
    "vehicleType": "bicycle"
  }'
```

#### Add Menu Item
```bash
curl -X POST http://localhost:3000/admin/menu/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "restaurantId": 1,
    "name": "Spicy Wings",
    "description": "10 pieces of hot & spicy wings",
    "price": 55
  }'
```

---

## ✅ Testing Checklist

### Authentication
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login fails with invalid password
- [ ] Access protected route with token
- [ ] Access denied without token

### Restaurants (Customer)
- [ ] List all restaurants (Kagiso only)
- [ ] Get specific restaurant
- [ ] View restaurant menu

### Orders
- [ ] Create order with valid data
- [ ] Create order fails without Kagiso address
- [ ] Create order with tip (15%)
- [ ] Create order with tip (50%)
- [ ] Create order with tip (100%)
- [ ] Create order without tip (optional)
- [ ] Get user's orders
- [ ] Get specific order details

### Drivers
- [ ] Get available drivers
- [ ] Update driver location
- [ ] Mark order as delivered
- [ ] Check driver earnings
- [ ] Verify R15 payment added correctly

### Admin
- [ ] Create restaurant
- [ ] Update restaurant
- [ ] Delete restaurant
- [ ] Register driver
- [ ] Update driver status
- [ ] Add menu item
- [ ] Update menu item
- [ ] Delete menu item

---

## 🐛 Common Test Issues & Fixes

### Issue: "Delivery address must be in Kagiso"
**Solution:** Make sure address includes "Kagiso"
```json
✅ Correct:
"deliveryAddress": "123 Main Street, Kagiso"

❌ Wrong:
"deliveryAddress": "123 Main Street, Johannesburg"
```

### Issue: "Tip must be between 10% and 100%"
**Solution:** Only allow 10-100% or omit tipPercentage entirely
```json
✅ Correct:
"tipPercentage": 15

✅ Also correct (no tip):
(omit tipPercentage field)

❌ Wrong:
"tipPercentage": 5      (less than 10%)
"tipPercentage": 150    (more than 100%)
```

### Issue: Invalid JWT Token
**Solution:** 
1. Make sure you're copying entire token
2. Token format: `Bearer eyJhbGciOi...`
3. Tokens expire - login again if expired

### Issue: "Can only order from Kagiso restaurants"
**Solution:** Check restaurant location is "Kagiso"

---

## 📊 Sample Test Data

### Restaurants (Pre-seeded)
1. **Kagiso Grill & Chill** - ID: 1
2. **Kasi Takeaway Express** - ID: 2
3. **Mama's Kitchen** - ID: 3

### Drivers (Pre-seeded)
1. **Thabo Mthembu** - ID: 1
2. **Mandla Dlamini** - ID: 2
3. **Sipho Nkosi** - ID: 3
4. **Lucky Mthiyane** - ID: 4

### Menu Items (Sample Prices)
- Grilled Chicken Half: R85
- Cheese Burger: R45
- Vetkoek with Jam: R25

---

## 🔌 Real-Time Socket.IO Events

### Listen to Events (Client-side)
```javascript
// Connect to Socket.IO
const io = require('socket.io-client')('http://localhost:3000');

// Listen for new orders
io.on('order:new', (order) => {
  console.log('New order placed:', order);
});

// Listen for order status changes
io.on('order:status_changed', (data) => {
  console.log('Order status updated:', data);
});

// Listen for driver location
io.on('driver:location', (data) => {
  console.log('Driver location:', data.lat, data.lng);
});

// Listen for deliveries
io.on('order:delivered', (data) => {
  console.log('Order delivered:', data.orderId);
});
```

### Emit Events (From Client)
```javascript
// Join driver room
io.emit('driver:join', { driverId: 1 });

// Join order room
io.emit('order:join', { orderId: 1 });

// Broadcast location
io.emit('driver:location', {
  driverId: 1,
  lat: -26.2041,
  lng: 27.8479
});
```

---

## 📈 Performance Metrics to Monitor

- **Order creation time:** Should be < 500ms
- **Delivery fee calculation:** Instant
- **Driver earnings update:** Instant on delivery mark
- **Real-time location sync:** < 1s latency
- **Database queries:** < 100ms for most operations

---

## 🚀 Next Steps After Testing

1. **Frontend Development**
   - Customer app (React/React Native)
   - Driver app (React Native/Flutter)
   - Admin dashboard (React)

2. **Payment Integration**
   - Test Stripe payments
   - Test PayFast payments
   - Setup webhooks

3. **Deployment**
   - Choose hosting (Railway, Render, DigitalOcean)
   - Setup CI/CD pipeline
   - Configure monitoring

4. **Production Checklist**
   - Enable HTTPS
   - Setup logging
   - Configure backups
   - Monitor performance
   - Setup alerts

---

## 📞 Need Help?

- Check `/api-docs` for interactive API documentation
- Review error messages - they're descriptive
- Check console logs on server
- Verify all prerequisites are installed
- Ensure PostgreSQL is running

Happy testing! 🚴‍♂️🍕
