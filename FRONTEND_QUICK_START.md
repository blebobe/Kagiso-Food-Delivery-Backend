# 🚀 Frontend Quick Start - Kasi Food Delivery

Your backend is ready! Here's how to quickly set up all three frontend apps.

---

## ⚡ 5-Minute Setup

### Step 1: Create All Three Apps

Open PowerShell in `My_Projects2025` folder and run:

```bash
# Create Customer App
npm create vite@latest Kagiso-Customer-App -- --template react-ts

# Create Driver App
npm create vite@latest Kagiso-Driver-App -- --template react-ts

# Create Admin Dashboard
npm create vite@latest Kagiso-Admin-Dashboard -- --template react-ts
```

### Step 2: Install Dependencies for Each App

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

### Step 3: Create Environment Files

In each app's root folder, create `.env`:

**Kagiso-Customer-App/.env**
```env
VITE_API_URL=http://localhost:3000
```

**Kagiso-Driver-App/.env**
```env
VITE_API_URL=http://localhost:3000
```

**Kagiso-Admin-Dashboard/.env**
```env
VITE_API_URL=http://localhost:3000
```

### Step 4: Start Development

```bash
# Terminal 1: Backend (in Kagiso-Food-Delivery-backend)
npm run dev

# Terminal 2: Customer App (in Kagiso-Customer-App)
npm run dev

# Terminal 3: Driver App (in Kagiso-Driver-App)
npm run dev

# Terminal 4: Admin Dashboard (in Kagiso-Admin-Dashboard)
npm run dev
```

**URLs:**
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api-docs
- Customer App: http://localhost:5173
- Driver App: http://localhost:5174
- Admin Dashboard: http://localhost:5175

---

## 📋 Test Credentials

After backend starts, use these to test:

```
Admin:     admin@kasifood.com / admin123
Customer:  customer@kasifood.com / user123
Driver:    driver@kasifood.com / driver123
```

---

## 📁 Project Structure Template

Each app should have this structure:

```
src/
├── api/
│   └── client.ts              # Axios configuration
├── components/
│   ├── auth/
│   ├── common/
│   └── [feature]/
├── pages/
├── stores/
│   └── authStore.ts           # Zustand
├── types/
│   └── api.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🎯 What to Build First

### Priority 1: Customer App (Most Important)

**Features to Build:**
1. **Authentication**
   - Login page
   - Register page
   - Protected routes

2. **Restaurant Browsing**
   - List all restaurants
   - Restaurant details
   - Menu display

3. **Ordering**
   - Add to cart
   - Review cart
   - Calculate total (R25 fee + tip)
   - Place order

4. **Order Tracking**
   - View order status (real-time)
   - See driver location
   - Delivery confirmation

5. **User Profile**
   - Order history
   - Settings
   - Logout

### Priority 2: Driver App

**Features to Build:**
1. Authentication
2. Available orders list
3. Accept order & navigate to restaurant
4. Confirm pickup
5. Navigate to delivery
6. Complete delivery (earn R15)
7. View earnings dashboard

### Priority 3: Admin Dashboard

**Features to Build:**
1. Dashboard overview (metrics)
2. Restaurant management (CRUD)
3. Driver management
4. Order management
5. Analytics and charts

---

## 💻 Start Coding

### 1. Create API Client (`src/api/client.ts`)

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 2. Create Auth Store (`src/stores/authStore.ts`)

```typescript
import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('token') || null,

  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  isAuthenticated: () => get().token !== null,
}));
```

### 3. Create Login Component (`src/components/auth/Login.tsx`)

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import api from '../../api/client';

export function Login() {
  const [email, setEmail] = useState('customer@kasifood.com');
  const [password, setPassword] = useState('user123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      navigate('/browse');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h1>Kasi Food Delivery</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px', cursor: 'pointer' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

### 4. Setup React Router (`src/App.tsx`)

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { Login } from './components/auth/Login';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <div>Dashboard (Coming Soon)</div>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/browse" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## 🔄 API Integration Checklist

- [ ] **Login/Register** - POST /auth/login
- [ ] **Get Restaurants** - GET /restaurants
- [ ] **Get Menu** - GET /restaurants/:id/menu
- [ ] **Create Order** - POST /orders
- [ ] **Get Orders** - GET /orders/my
- [ ] **Real-time Updates** - Socket.IO events

---

## ✅ Success Milestones

**Day 1:**
- [ ] All 3 apps created and running
- [ ] Login page working
- [ ] Can authenticate with backend

**Day 2-3:**
- [ ] Restaurant list displaying
- [ ] Menu items showing
- [ ] Basic shopping cart

**Day 4-5:**
- [ ] Order creation working
- [ ] Tips calculating correctly (10-100%)
- [ ] Order total displaying (subtotal + R25 fee + tip)

**Week 1:**
- [ ] Customer app: Full ordering flow
- [ ] Driver app: View available orders
- [ ] Admin: Dashboard basics

**Week 2:**
- [ ] Real-time order tracking
- [ ] Driver earnings
- [ ] Order history

**Week 3-4:**
- [ ] Polish and optimization
- [ ] Bug fixes
- [ ] Performance tuning

---

## 🆘 Common Issues

### "Port 3000 is already in use"
Backend running on wrong port. Check that it's running on 3000.

### "Can't connect to backend"
- Make sure backend is running: `npm run dev` in Kagiso-Food-Delivery-backend
- Check VITE_API_URL in .env is `http://localhost:3000`
- Check for CORS errors in browser console

### "Login not working"
- Make sure test data is seeded: `npm run seed` in backend
- Try test credentials: customer@kasifood.com / user123
- Check API_DOCS for login endpoint format

### "Real-time updates not working"
- Socket.IO client must be initialized
- Check browser console for WebSocket connection status
- Verify backend has Socket.IO enabled

---

## 📚 References

- **Backend API Docs:** http://localhost:3000/api-docs
- **Backend README:** Read Kagiso-Food-Delivery-backend/README.md
- **Postman Collection:** Kasi_Food_Delivery_API.postman_collection.json
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev

---

## 🎯 Recommended Development Order

1. **Customer App First** (MVP)
   - This is the revenue-generating app
   - Users need to order food
   - Most important for launch

2. **Driver App Second**
   - Needed to actually deliver orders
   - Can test with admin assigning drivers initially

3. **Admin Dashboard Third**
   - Nice to have for management
   - Can be improved over time

---

## 🚀 Let's Build!

You now have:
- ✅ Backend API ready
- ✅ All endpoints documented
- ✅ Test data seeded
- ✅ Postman collection for testing
- ✅ Frontend setup guide

**Next:** Create the three apps and start coding!

Questions? Check FRONTEND_SETUP_GUIDE.md for more detailed instructions.
