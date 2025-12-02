# Kagiso Food Delivery - Implementation Summary

## Changes Implemented (December 2, 2025)

### 1. **Database Schema Updates** (`prisma/schema.prisma`)

#### Restaurant Model
- Added `commission` field (Float, default: 0)
  - Reflects 0% commission policy for all restaurants
  - Ready for future commission adjustments if needed

#### Order Model
- Added `subtotal` field (Float) - food items cost
- Added `deliveryFee` field (Float, default: 25) - R25 fixed delivery fee
- Modified `total` field - now calculated as `subtotal + deliveryFee`
- Delivery fee is fixed at R25 regardless of order value or distance

#### Driver Model
- Added `vehicleType` field (String, default: "bicycle")
- Kept `vehicle` field for backward compatibility (also defaults to "bicycle")
- All new drivers are youth with bicycles

### 2. **Order Controller Updates** (`src/controllers/orderController.js`)

#### `createOrder` Function
- Now expects `subtotal` in request body (food items total)
- Automatically calculates `deliveryFee` as R25
- Computes `total = subtotal + deliveryFee` (no commission deducted)
- Validates both restaurant location (Kagiso only) and delivery address (Kagiso only)

**Request Body Format:**
```json
{
  "restaurantId": 1,
  "items": [
    { "menuItemId": 1, "quantity": 2 },
    { "menuItemId": 2, "quantity": 1 }
  ],
  "subtotal": 150,
  "deliveryAddress": "123 Main Street, Kagiso"
}
```

**Response Includes:**
```json
{
  "id": 1,
  "subtotal": 150,
  "deliveryFee": 25,
  "total": 175,
  "status": "pending",
  ...
}
```

### 3. **Business Logic**

| Item | Value |
|------|-------|
| **Delivery Fee** | R25 (flat rate, fixed) |
| **Commission** | 0% (restaurants keep 100%) |
| **Driver Vehicle** | Bicycle |
| **Delivery Area** | Kagiso only |
| **Restaurant Location** | Kagiso only |

## Next Steps

### 1. Run Database Migration
```bash
npm install  # if needed
npx prisma migrate dev --name add_delivery_fee_commission_bicycle
```

### 2. Update Frontend/API Consumers
- Change order creation to send `subtotal` instead of `total`
- Update order display to show `subtotal`, `deliveryFee`, and `total` separately
- Display "R25 delivery fee" information to customers

### 3. Test the Changes
```bash
# Create a test order with location validation
POST /api/orders
{
  "restaurantId": 1,
  "items": [{ "menuItemId": 1, "quantity": 1 }],
  "subtotal": 100,
  "deliveryAddress": "Some Address, Kagiso"
}
```

### 4. Driver Management
- When registering new drivers, set `vehicleType` to "bicycle"
- All drivers default to bicycles (youth program)
- Update driver registration form if needed

## Files Modified

1. `prisma/schema.prisma` - Schema updates
2. `src/controllers/orderController.js` - Order calculation logic
3. `src/middleware/locationRestriction.js` - Already enforces Kagiso delivery only

## Database Migration File
A migration file will be created when you run `npx prisma migrate dev`. This ensures all environments (dev, staging, production) have consistent schema changes.

## Verification Checklist

- [ ] Database migration runs successfully
- [ ] Orders created with R25 fee
- [ ] No commission deducted from restaurants
- [ ] Drivers default to bicycle vehicle type
- [ ] Kagiso location restriction enforced
- [ ] Frontend updated to reflect pricing changes
- [ ] API documentation updated

## Future Enhancements

- Driver rating/review system
- Promotion/discount codes
- Peak hour delivery fee adjustments
- Driver earnings dashboard
- Commission adjustments if business model changes
