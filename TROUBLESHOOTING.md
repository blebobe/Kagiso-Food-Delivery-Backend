# 🔧 Troubleshooting Guide - Kasi Food Delivery Backend

Solutions to common issues you might encounter.

---

## 🚨 Startup Issues

### Problem: "Cannot find module 'express'"

**Cause:** Dependencies not installed

**Solution:**
```bash
# Clear and reinstall
rm -r node_modules
npm cache clean --force
npm install

# Verify
npm list express
```

---

### Problem: "Error: connect ECONNREFUSED 127.0.0.1:5432"

**Cause:** PostgreSQL is not running

**Solution (Windows):**

1. **Check if PostgreSQL is running:**
   - Open Services (services.msc)
   - Look for "postgresql-x64" (version number varies)
   - If stopped, right-click → Start

2. **Start PostgreSQL manually:**
   ```bash
   # Find PostgreSQL installation
   cd "C:\Program Files\PostgreSQL\15\bin"
   
   # Connect to verify
   psql -U postgres
   ```

3. **If PostgreSQL won't start:**
   - Check Event Viewer for errors
   - Reinstall PostgreSQL
   - Check port 5432 is not blocked

**Solution (Verify connection):**
```bash
# Test connection
psql -U postgres -c "SELECT version();"

# Should output PostgreSQL version
```

---

### Problem: "error: role 'postgres' does not exist"

**Cause:** PostgreSQL user 'postgres' not found

**Solution:**
1. Reinstall PostgreSQL (ensure 'postgres' user is created)
2. Or create user manually:
   ```sql
   -- Connect as default user first
   -- Then create postgres role:
   CREATE ROLE postgres WITH LOGIN PASSWORD 'your_password';
   ALTER ROLE postgres WITH SUPERUSER;
   ```

---

### Problem: "database 'kasi_food_delivery' does not exist"

**Cause:** Database not created

**Solution:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE kasi_food_delivery;

# Verify
\l

# Exit
\q
```

---

### Problem: "Port 3000 already in use"

**Cause:** Another process is using port 3000

**Solution:**

1. **Find what's using port 3000:**
   ```bash
   netstat -ano | findstr :3000
   ```

2. **Kill the process:**
   ```bash
   taskkill /PID <PID> /F
   ```

3. **Or use different port:**
   ```bash
   PORT=3001 npm run dev
   ```

---

## 🔐 Authentication Issues

### Problem: "Invalid credentials" even with correct email/password

**Cause:** Wrong test data or database not seeded

**Solution:**
```bash
# 1. Re-seed database
npm run seed

# 2. Use correct test credentials:
# Email: admin@kasifood.com
# Password: admin123

# 3. Try creating new account:
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User",
    "role": "customer"
  }'
```

---

### Problem: "JWT malformed" or "Invalid token"

**Cause:** Token is invalid, expired, or improperly formatted

**Solution:**
1. **Login again** - tokens expire
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@kasifood.com",
       "password": "admin123"
     }'
   ```

2. **Copy full token** - don't cut off the end

3. **Use correct format:**
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   (notice space after "Bearer")
   ```

---

### Problem: "No authorization header"

**Cause:** Missing Authorization header in request

**Solution:**
```bash
# WRONG - missing header
curl http://localhost:3000/drivers/available

# CORRECT - includes Authorization header
curl http://localhost:3000/drivers/available \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 Database Issues

### Problem: "Prisma: The engine has crashed"

**Cause:** Database connection lost or corrupted

**Solution:**
```bash
# 1. Check database connection
psql -U postgres -d kasi_food_delivery -c "SELECT 1;"

# 2. Regenerate Prisma client
npm run prisma:generate

# 3. Restart server
npm run dev
```

---

### Problem: "Migration failed"

**Cause:** Database schema mismatch or migration error

**Solution:**
```bash
# 1. Check migration status
npm run prisma -- migrate status

# 2. Reset database (⚠️ deletes all data)
npm run prisma -- migrate reset

# 3. Re-seed
npm run seed
```

---

### Problem: "Table 'Orders' does not exist"

**Cause:** Migrations not applied

**Solution:**
```bash
# Apply pending migrations
npm run migrate

# Or with full reset
npm run prisma -- migrate deploy

# Verify
npm run prisma -- migrate status
```

---

## 🌍 API Request Issues

### Problem: "Delivery address must be in Kagiso"

**Cause:** Address doesn't include "Kagiso"

**Solution:**
```json
✅ CORRECT:
"deliveryAddress": "123 Main Street, Kagiso"
"deliveryAddress": "456 Township Ave, Kagiso"

❌ WRONG:
"deliveryAddress": "123 Main Street, Johannesburg"
"deliveryAddress": "123 Main Street"
```

---

### Problem: "Tip must be between 10% and 100%"

**Cause:** Invalid tip percentage

**Solution:**
```json
✅ CORRECT (15% tip):
{
  "tipPercentage": 15
}

✅ CORRECT (no tip - omit field):
{
  "restaurantId": 1,
  "items": [...],
  "subtotal": 100,
  "deliveryAddress": "..., Kagiso"
}

❌ WRONG (5% too low):
{
  "tipPercentage": 5
}

❌ WRONG (150% too high):
{
  "tipPercentage": 150
}
```

---

### Problem: "Order creation failed" / 500 error

**Cause:** Check server console for details

**Solution:**
1. **Check request format:**
   ```bash
   # Verify all required fields
   POST /orders body must have:
   - restaurantId (number)
   - items (array with menuItemId, quantity)
   - subtotal (number)
   - deliveryAddress (string with "Kagiso")
   - tipPercentage (optional, 10-100)
   ```

2. **Check restaurant exists:**
   ```bash
   # Get all restaurants
   curl http://localhost:3000/restaurants \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. **Check menu items exist:**
   ```bash
   # Get restaurant menu
   curl http://localhost:3000/restaurants/1/menu \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

4. **Check server logs** - look for error message on console

---

### Problem: "Restaurant not found" (404)

**Cause:** Restaurant doesn't exist or wrong ID

**Solution:**
```bash
# List all restaurants
curl http://localhost:3000/restaurants \
  -H "Authorization: Bearer YOUR_TOKEN"

# Use actual ID from list
# (usually starts at 1 after seeding)
```

---

## 🚗 Driver & Order Issues

### Problem: "No available drivers"

**Cause:** All drivers offline or no drivers registered

**Solution:**
```bash
# 1. Check drivers exist
curl http://localhost:3000/drivers/available \
  -H "Authorization: Bearer YOUR_TOKEN"

# 2. If empty, re-seed
npm run seed

# 3. Admin can register driver
curl -X POST http://localhost:3000/admin/drivers \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Driver",
    "phone": "0761234567",
    "vehicleType": "bicycle"
  }'
```

---

### Problem: "Driver earnings not updating"

**Cause:** Order not marked as delivered

**Solution:**
```bash
# Check driver's current earnings
curl http://localhost:3000/drivers/1/earnings \
  -H "Authorization: Bearer DRIVER_TOKEN"

# Mark order as delivered to trigger payment
curl -X POST http://localhost:3000/drivers/order/1/delivered \
  -H "Authorization: Bearer DRIVER_TOKEN"

# Check earnings again (should be +R15)
curl http://localhost:3000/drivers/1/earnings \
  -H "Authorization: Bearer DRIVER_TOKEN"
```

---

### Problem: "Cannot mark order as delivered"

**Cause:** Order doesn't exist or wrong format

**Solution:**
```bash
# 1. Check order exists
curl http://localhost:3000/orders/1 \
  -H "Authorization: Bearer YOUR_TOKEN"

# 2. Verify order status
# Must be "pending" or "confirmed" to mark delivered

# 3. Driver must be authenticated
# Check you're using DRIVER_TOKEN, not ADMIN_TOKEN
```

---

## 🌐 CORS & Network Issues

### Problem: "Access to XMLHttpRequest blocked by CORS policy"

**Cause:** Frontend and backend on different URLs/ports

**Solution:**
1. **Check CORS is enabled in server.js:**
   ```javascript
   const cors = require('cors');
   app.use(cors());
   ```

2. **Check frontend URL matches:**
   ```bash
   Frontend: http://localhost:3000
   Backend: http://localhost:3000
   
   OR
   
   Frontend: http://localhost:3001
   Backend: http://localhost:3000
   (CORS must allow this)
   ```

3. **For development, use proxy:**
   - In frontend's package.json:
   ```json
   "proxy": "http://localhost:3000"
   ```

---

### Problem: "Connection refused" from frontend

**Cause:** Backend not running

**Solution:**
1. **Check backend is running:**
   ```bash
   npm run dev
   ```

2. **Check correct port:**
   ```bash
   # Backend should show:
   Server running on http://localhost:3000
   ```

3. **Check firewall** - port 3000 might be blocked

---

## 📝 Environment Variable Issues

### Problem: "process.env.DATABASE_URL is undefined"

**Cause:** .env file not loaded

**Solution:**
```bash
# 1. Check .env exists
ls -la .env

# 2. Check content
cat .env

# 3. Should have:
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/kasi_food_delivery"
JWT_SECRET="your_secret_key"
NODE_ENV="development"

# 4. Restart server after changes
npm run dev
```

---

### Problem: "Invalid DATABASE_URL format"

**Cause:** Wrong connection string format

**Solution:**
```
✅ CORRECT format:
postgresql://username:password@host:port/database

✅ Example:
postgresql://postgres:MayDog@2025@localhost:5432/kasi_food_delivery

⚠️ Special characters in password:
If password has special chars (@, !, etc.), URL-encode them:
@ = %40
: = %3A
! = %21

Example if password is "my@pass":
postgresql://postgres:my%40pass@localhost:5432/kasi_food_delivery
```

---

## 🔄 Real-Time / Socket.IO Issues

### Problem: "WebSocket connection failed"

**Cause:** Socket.IO not properly configured

**Solution:**
1. **Check server has Socket.IO:**
   ```javascript
   // In src/server.js
   const io = require('socket.io')(server, {
     cors: { origin: "*" }
   });
   ```

2. **Check frontend connects correctly:**
   ```javascript
   const io = require('socket.io-client')('http://localhost:3000');
   io.on('connect', () => console.log('Connected!'));
   ```

3. **Restart server**

---

### Problem: "Real-time updates not working"

**Cause:** Events not being emitted

**Solution:**
```bash
# Check server console for errors
npm run dev

# Should show connection messages:
# "New client connected: socket_id"
# "Client disconnected: socket_id"

# Check client is listening to events:
io.on('order:new', (data) => console.log(data));
io.on('driver:location', (data) => console.log(data));
```

---

## 🎯 Performance Issues

### Problem: "Server is slow / requests taking long"

**Cause:** Slow database queries

**Solution:**
```bash
# 1. Check server logs for slow queries
npm run dev

# 2. Monitor with Prisma Studio
npm run prisma:studio
# Opens http://localhost:5555

# 3. Optimize queries - check:
# - Are you using .include() for relations?
# - Are queries returning unnecessary data?
# - Consider pagination for large result sets
```

---

### Problem: "Memory leak - server crashes"

**Cause:** Unclosed connections or memory issues

**Solution:**
1. **Check for unclosed connections:**
   ```bash
   npm run dev
   # Watch for "address already in use" errors
   ```

2. **Restart fresh:**
   ```bash
   # Kill existing processes
   Get-Process node | Stop-Process -Force
   
   # Start fresh
   npm run dev
   ```

3. **Monitor memory usage:**
   ```bash
   # Watch memory/CPU
   Get-Process node | select ProcessName, CPU, Memory
   ```

---

## ✅ Verification Checklist

Run these checks in order:

```bash
# 1. Check Node.js
node --version

# 2. Check npm
npm --version

# 3. Check PostgreSQL running
psql -U postgres -c "SELECT version();"

# 4. Check database exists
psql -U postgres -l | grep kasi_food_delivery

# 5. Check dependencies
npm list express

# 6. Start server
npm run dev

# 7. Test API
curl http://localhost:3000/health

# 8. Test login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kasifood.com","password":"admin123"}'
```

---

## 📞 When All Else Fails

1. **Complete fresh start:**
   ```bash
   # Clean everything
   rm -r node_modules
   npm cache clean --force
   
   # Reset database
   npm run prisma -- migrate reset
   
   # Reinstall
   npm install
   npm run seed
   npm run dev
   ```

2. **Check logs in detail:**
   - Look at console output line by line
   - Copy-paste entire error message
   - Google the error message

3. **Verify prerequisites:**
   - PostgreSQL running and accessible
   - Node.js v14+
   - All dependencies installed
   - Correct environment variables

4. **Review README files:**
   - `README.md` - Overall architecture
   - `QUICK_START.md` - Setup guide
   - `API_TESTING_GUIDE.md` - Testing help

---

## 🎓 Learning Resources

- **Express.js:** https://expressjs.com/
- **Prisma ORM:** https://www.prisma.io/docs/
- **PostgreSQL:** https://www.postgresql.org/docs/
- **Socket.IO:** https://socket.io/docs/
- **JWT Auth:** https://jwt.io/

---

Good luck! You've got this! 🚀

If you find a new issue, document it here for future reference. Share your solutions with the team!
