# Deployment & CI/CD — Kasi Food Delivery App Backend

Set env vars in your host:
- DATABASE_URL
- JWT_SECRET
- STRIPE_SECRET_KEY
- PAYFAST_MERCHANT_ID
- PAYFAST_MERCHANT_KEY
- PAYFAST_PASSPHRASE
- PAYFAST_BASE_URL
- NODE_ENV=production

Prisma:
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

Start:
node src/server.js
