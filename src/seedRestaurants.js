// src/seedRestaurants.js
import prisma from "./prisma.js";

async function main() {
  console.log("🌍 Seeding Kagiso Restaurants...");

  const restaurants = [
    {
      name: "KFC Kagiso Mall",
      description: "Famous fried chicken meals",
      address: "Kagiso Mall, Kagiso",
      location: "Kagiso",
      commission: 0,
      imageUrl: "https://images.kasiapp/kfc.png"

    },
    {
      name: "Kasi Chef",
      description: "Local favourite African and fast meals",
      address: "Corner Moshoeshoe & Masedi Street, Kagiso",
      location: "Kagiso",
      commission: 0,
      imageUrl: "https://images.kasiapp/kasichef.png"
    },
    {
      name: "Kasi Grill House",
      description: "Grilled meat, chips & pub meals",
      address: "1359 Kgabo Drive, Kagiso",
      location: "Kagiso",
      commission: 0,
      imageUrl: "https://images.kasiapp/grillhouse.png"
    },
    {
      name: "Mama B’s Kitchen",
      description: "Traditional home-cooked meals",
      address: "Ext 6, Kagiso, Krugersdorp",
      location: "Kagiso",
      commission: 0,
      imageUrl: "https://images.kasiapp/mamab.png"
    },
    {
      name: "Street Bites Takeaway",
      description: "Street food, snacks & fast meals",
      address: "Kagiso Central",
      location: "Kagiso",
      commission: 0,
      imageUrl: "https://images.kasiapp/streetbites.png"
    }
  ];

  for (const r of restaurants) {
    await prisma.restaurant.create({ data: r });
  }

  console.log("✅ Done! 5 Restaurants Added.");
}

main().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});
