// prisma/seed.js
import prisma from "../src/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding Kasi Food Delivery App database...");

  // Password hashing
  const adminPass = await bcrypt.hash("admin123", 10);
  const userPass = await bcrypt.hash("user123", 10);
  const driverPass = await bcrypt.hash("driver123", 10);

  // -------------------------
  // USERS
  // -------------------------
  await prisma.user.upsert({
    where: { email: "admin@kasifood.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@kasifood.com",
      password: adminPass,
      role: "admin",
    },
  });

  const customerEmails = [
    "customer1@kasifood.com",
    "customer2@kasifood.com",
    "customer3@kasifood.com",
    "customer4@kasifood.com",
    "customer5@kasifood.com",
  ];

  for (const email of customerEmails) {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: email.split("@")[0],
        email,
        password: userPass,
        role: "customer",
      },
    });
  }

  const driverEmails = [
    "driver1@kasifood.com",
    "driver2@kasifood.com",
    "driver3@kasifood.com",
  ];

  for (const email of driverEmails) {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: email.split("@")[0],
        email,
        password: driverPass,
        role: "driver",
      },
    });
  }

  // -------------------------
  // RESTAURANTS (5 in Kagiso)
  // -------------------------
  const restaurants = await Promise.all([
    prisma.restaurant.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: "KFC Kagiso",
        description: "Famous fried chicken & meals",
        address: "Kagiso Drive, Kagiso Mall",
        location: "kagiso",
        commission: 0,
        imageUrl: "https://via.placeholder.com/300x200?text=KFC+Kagiso",
      },
    }),

    prisma.restaurant.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: "Kasi Takeaway Express",
        description: "Fast food & burgers",
        address: "456 Station Road, Kagiso",
        location: "kagiso",
        commission: 0,
        imageUrl: "https://via.placeholder.com/300x200?text=Kasi+Takeaway",
      },
    }),

    prisma.restaurant.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: "Mama's Kitchen",
        description: "Traditional home-cooked meals",
        address: "789 Township Ave, Kagiso",
        location: "kagiso",
        commission: 0,
        imageUrl: "https://via.placeholder.com/300x200?text=Mama's+Kitchen",
      },
    }),

    prisma.restaurant.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: "Street Food Spot",
        description: "Kasi street food: chips, Russians, kota",
        address: "12 Mphuthi St, Kagiso",
        location: "kagiso",
        commission: 0,
        imageUrl: "https://via.placeholder.com/300x200?text=Street+Food+Spot",
      },
    }),

    prisma.restaurant.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: "Shisa Nyama Corner",
        description: "Grilled meat, wors & pap",
        address: "Corner Masedi & Makhubo, Kagiso",
        location: "kagiso",
        commission: 0,
        imageUrl: "https://via.placeholder.com/300x200?text=Shisa+Nyama+Corner",
      },
    }),
  ]);

  // -------------------------
  // MENU ITEMS FOR EACH RESTAURANT
  // -------------------------
  await prisma.menuItem.createMany({
    data: [
      // KFC Kagiso (id 1)
      { restaurantId: 1, name: "Streetwise 2", price: 39.99 },
      { restaurantId: 1, name: "Streetwise 3", price: 49.99 },
      { restaurantId: 1, name: "Zinger Burger", price: 59.99 },
      { restaurantId: 1, name: "Family Feast", price: 189.99 },

      // Kasi Takeaway Express (id 2)
      { restaurantId: 2, name: "Cheese Burger", price: 30 },
      { restaurantId: 2, name: "Mega Chips", price: 25 },
      { restaurantId: 2, name: "Chicken Burger", price: 35 },
      { restaurantId: 2, name: "Chakalaka", price: 10 },

      // Mama's Kitchen (id 3)
      { restaurantId: 3, name: "Umleqwa (Sorghum Chicken)", price: 60 },
      { restaurantId: 3, name: "Mogodu (Tripe)", price: 55 },
      { restaurantId: 3, name: "Vetkoek & Mince", price: 25 },
      { restaurantId: 3, name: "Samp & Beans", price: 20 },

      // Street Food Spot (id 4)
      { restaurantId: 4, name: "Kota (Full House)", price: 35 },
      { restaurantId: 4, name: "Russian & Chips", price: 30 },
      { restaurantId: 4, name: "Half Chips", price: 15 },

      // Shisa Nyama Corner (id 5)
      { restaurantId: 5, name: "Wors & Pap", price: 40 },
      { restaurantId: 5, name: "Grilled Chicken Plate", price: 70 },
      { restaurantId: 5, name: "T-Bone & Pap", price: 90 },
    ],
  });

  console.log("✅ Seeding complete!");

  console.log("\n🔑 Test Credentials:");
  console.log("Admin: admin@kasifood.com / admin123");
  console.log("Customer: customer1@kasifood.com / user123");
  console.log("Driver: driver1@kasifood.com / driver123");

  console.log("\n🏪 Restaurants created:", restaurants.length);
}

main().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});
