# 🎨 Frontend Development - Complete Setup Guide

Your backend is ready! Here's everything you need to build the three frontend applications.

---

## 📚 Documentation in Backend Folder

You have two guides to reference:

1. **FRONTEND_QUICK_START.md** - Quick 5-minute setup (START HERE)
2. **FRONTEND_SETUP_GUIDE.md** - Detailed comprehensive guide

Plus these template files to copy into your apps:
- **TEMPLATE_api_client.ts** - Copy to `src/api/client.ts`
- **TEMPLATE_authStore.ts** - Copy to `src/stores/authStore.ts`
- **TEMPLATE_Login.tsx** - Copy to `src/components/auth/Login.tsx`
- **TEMPLATE_App.tsx** - Copy to `src/App.tsx`

---

## 🚀 Quick Start (Right Now)

### Step 1: Create the Three Apps

```bash
cd c:\Users\LatitudeE5570\Desktop\My_Projects2025

# Create Customer App
npm create vite@latest Kagiso-Customer-App -- --template react-ts

# Create Driver App
npm create vite@latest Kagiso-Driver-App -- --template react-ts

# Create Admin Dashboard
npm create vite@latest Kagiso-Admin-Dashboard -- --template react-ts
```

### Step 2: Install Dependencies

**Customer App:**
```bash
cd Kagiso-Customer-App
npm install
npm install axios react-router-dom zustand socket.io-client
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

**Driver App:**
```bash
cd ../Kagiso-Driver-App
npm install
npm install axios react-router-dom zustand socket.io-client
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

**Admin Dashboard:**
```bash
cd ../Kagiso-Admin-Dashboard
npm install
npm install axios react-router-dom zustand
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install recharts
```

### Step 3: Add Environment Files

Create `.env` in each app root:

```env
VITE_API_URL=http://localhost:3000
```

### Step 4: Copy Template Files

For each app:
1. Create `src/api/` folder
2. Copy **TEMPLATE_api_client.ts** → `src/api/client.ts`
3. Create `src/stores/` folder
4. Copy **TEMPLATE_authStore.ts** → `src/stores/authStore.ts`
5. Create `src/components/auth/` folder
6. Copy **TEMPLATE_Login.tsx** → `src/components/auth/Login.tsx`
7. Copy **TEMPLATE_App.tsx** → `src/App.tsx`

### Step 5: Update main.tsx

In each app, update `src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Step 6: Run All Apps

**Terminal 1: Backend**
```bash
cd Kagiso-Food-Delivery-backend
npm run dev
# http://localhost:3000
```

**Terminal 2: Customer App**
```bash
cd Kagiso-Customer-App
npm run dev
# http://localhost:5173
```

**Terminal 3: Driver App**
```bash
cd Kagiso-Driver-App
npm run dev
# http://localhost:5174
```

**Terminal 4: Admin Dashboard**
```bash
cd Kagiso-Admin-Dashboard
npm run dev
# http://localhost:5175
```

### Step 7: Test Login

1. Go to http://localhost:5173
2. Enter credentials: `customer@kasifood.com` / `user123`
3. Click Login
4. Should see dashboard with user info

**Success!** ✅ You have working frontend authentication!

---

## 📋 Test Credentials

```
CUSTOMER:
  Email: customer@kasifood.com
  Password: user123

DRIVER:
  Email: driver@kasifood.com
  Password: driver123

ADMIN:
  Email: admin@kasifood.com
  Password: admin123
```

---

## 🎯 What to Build Next

### Phase 1: Customer App (Week 1-2)

**Priority: HIGHEST**

```
✓ Authentication (done with templates)
✓ Restaurant Listing
✓ Menu Display
✓ Shopping Cart
✓ Order Creation (with tip)
✓ Order Tracking (real-time)
```

**Key API Endpoints:**
```
GET /restaurants
GET /restaurants/:id/menu
POST /orders
GET /orders/my
```

### Phase 2: Driver App (Week 3)

**Priority: HIGH**

```
✓ Authentication (done with templates)
✓ Available Orders List
✓ Accept Order
✓ Delivery Navigation
✓ Complete Delivery
✓ Earnings Dashboard
```

**Key API Endpoints:**
```
GET /drivers/available
GET /drivers/:id/earnings
PATCH /drivers/:id/location
POST /drivers/order/:id/delivered
```

### Phase 3: Admin Dashboard (Week 4)

**Priority: MEDIUM**

```
✓ Authentication (done with templates)
✓ Dashboard Overview
✓ Restaurant Management
✓ Driver Management
✓ Order Management
✓ Analytics & Reports
```

**Key API Endpoints:**
```
POST /admin/restaurants
GET /admin/drivers
GET /admin/orders
```

---

## 💡 Important: Pricing Calculation

When creating an order, calculate total as:

```typescript
const subtotal = parseFloat(itemTotal);
const deliveryFee = 25;  // Fixed!
const tipPercentage = 15;  // User selects 10-100%
const tip = (subtotal * tipPercentage) / 100;
const total = subtotal + deliveryFee + tip;

// Example:
// Items: R100
// Delivery: R25 (always)
// Tip (15%): R15
// Total: R140

// API Request:
const orderData = {
  restaurantId: 1,
  items: [{ menuItemId: 1, quantity: 2 }],
  subtotal: 100,
  deliveryAddress: "123 Main, Kagiso",
  tipPercentage: 15
};
```

---

## 🌐 Real-Time Features (Socket.IO)

### For Customer App - Track Order in Real-Time

```typescript
import { socket } from './utils/socket';

// Join order updates
socket.emit('order:join', { orderId: 1 });

// Listen for status changes
socket.on('order:status_changed', (data) => {
  console.log('Order status:', data.status);
});

// Listen for driver location
socket.on('driver:location', (data) => {
  console.log('Driver location:', data.lat, data.lng);
});

// Listen for delivery
socket.on('order:delivered', (data) => {
  console.log('Order delivered!');
});
```

### For Driver App - Broadcast Location

```typescript
// Update location every 10 seconds
setInterval(() => {
  socket.emit('driver:location', {
    driverId: driverId,
    lat: -26.2041,
    lng: 27.8479
  });
}, 10000);
```

---

## 🔍 Testing Workflow

### Test 1: Customer Order Flow

1. **Login as Customer**
   - Email: customer@kasifood.com
   - Password: user123

2. **Browse Restaurants**
   - Call `GET /restaurants`
   - Should show 3 Kagiso restaurants

3. **View Menu**
   - Click restaurant
   - Call `GET /restaurants/:id/menu`
   - Should show 12 menu items

4. **Create Order**
   - Add items to cart
   - Select tip (10-100%)
   - Click checkout
   - POST `/orders` with:
     ```json
     {
       "restaurantId": 1,
       "items": [{"menuItemId": 1, "quantity": 2}],
       "subtotal": 170,
       "deliveryAddress": "123 Main, Kagiso",
       "tipPercentage": 15
     }
     ```
   - Verify total = 235 (170 + 25 + 40)

5. **View Order**
   - GET `/orders/my`
   - GET `/orders/:id`

### Test 2: Driver Order Acceptance

1. **Login as Driver**
   - Email: driver@kasifood.com
   - Password: driver123

2. **View Available Orders**
   - GET `/drivers/available`

3. **Complete Delivery**
   - POST `/drivers/order/:id/delivered`
   - Earn R15

4. **View Earnings**
   - GET `/drivers/:id/earnings`
   - Total should be previous + R15

---

## 📁 File Structure (After Setup)

```
Kagiso-Customer-App/
├── src/
│   ├── api/
│   │   └── client.ts              ← Copy TEMPLATE_api_client.ts
│   ├── components/
│   │   ├── auth/
│   │   │   └── Login.tsx          ← Copy TEMPLATE_Login.tsx
│   │   ├── restaurant/
│   │   ├── cart/
│   │   ├── order/
│   │   └── common/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Browse.tsx
│   │   ├── Checkout.tsx
│   │   └── Tracking.tsx
│   ├── stores/
│   │   ├── authStore.ts           ← Copy TEMPLATE_authStore.ts
│   │   ├── cartStore.ts
│   │   └── orderStore.ts
│   ├── App.tsx                    ← Copy TEMPLATE_App.tsx
│   ├── main.tsx
│   └── index.css
├── .env                            ← Create with VITE_API_URL
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🛠️ Development Tips

### Use Zustand for State Management

```typescript
// Create a cart store
import { create } from 'zustand';

interface CartStore {
  items: any[];
  total: number;
  addItem: (item: any) => void;
  removeItem: (id: number) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  total: 0,
  addItem: (item) => set((state) => ({
    items: [...state.items, item],
    total: state.total + item.price
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
}));
```

### Use Material-UI for Components

```typescript
import { Box, Button, Card, TextField } from '@mui/material';

<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
  <TextField label="Email" />
  <Button variant="contained">Submit</Button>
</Box>
```

### Handle Errors Gracefully

```typescript
try {
  const response = await api.post('/orders', orderData);
  // Success
} catch (error: any) {
  const message = error.response?.data?.message || 'Operation failed';
  // Show error to user
}
```

---

## 📞 Common Issues

### "Cannot connect to API"
- Backend must be running: `npm run dev` in Kagiso-Food-Delivery-backend
- Check VITE_API_URL = http://localhost:3000
- Check browser Network tab for failed requests

### "Login always fails"
- Verify credentials are correct (check test credentials above)
- Check backend is seeded: `npm run seed`
- Check backend API docs: http://localhost:3000/api-docs

### "Real-time not working"
- Socket.IO client connects to same API URL
- Check browser console for WebSocket messages
- Make sure Socket.IO is enabled in backend

### "Tip percentage validation fails"
- Must be between 10-100%
- Omit tipPercentage field for no tip
- Send as number, not string

---

## ✅ Success Checklist

- [ ] All 3 apps created
- [ ] Dependencies installed
- [ ] .env files created
- [ ] Template files copied
- [ ] Backend running on localhost:3000
- [ ] Customer app running on localhost:5173
- [ ] Can login with test credentials
- [ ] Backend API docs accessible
- [ ] Can create order via API
- [ ] Real-time Socket.IO connecting
- [ ] Order total calculates correctly (subtotal + R25 + tip)

---

## 🚀 Next Steps

1. **Create all 3 apps** (Today)
2. **Get login working** (Day 1)
3. **Build customer ordering flow** (Week 1)
4. **Implement real-time tracking** (Week 2)
5. **Build driver app** (Week 3)
6. **Build admin dashboard** (Week 4)
7. **Polish and optimize** (Week 5)
8. **Launch MVP!** 🎉

---

## 📖 Reference Docs

In the backend folder:
- **README.md** - Full API documentation
- **API_TESTING_GUIDE.md** - How to test all endpoints
- **FRONTEND_QUICK_START.md** - 5-minute setup
- **FRONTEND_SETUP_GUIDE.md** - Detailed instructions

URLs:
- API Docs: http://localhost:3000/api-docs
- Postman Collection: Kasi_Food_Delivery_API.postman_collection.json

---

**You're all set! Start building! 🚀🍕**

Any questions? Check FRONTEND_SETUP_GUIDE.md for more detailed information.
