# Deployment & CI/CD — FoodApp Backend (UPDATED with Release + Whitelist)

This backend includes a Release + Whitelist system for staged rollouts.

New endpoints:
- GET /version?platform=android&identifier=...&clientVersion=1.2.0
- Admin: /admin/releases (CRUD)
- Admin: /admin/releases/:releaseId/whitelist (manage whitelist)

Prisma:
npx prisma generate
npx prisma migrate dev --name add_release_whitelist
npx prisma db seed  # if needed

Start:
node src/server.js
