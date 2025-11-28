// prisma/seed.js
import prisma from "../src/prisma.js";
import bcrypt from "bcrypt";

async function main() {
    console.log("🌱 Seeding database...");

    const adminPass = await bcrypt.hash("admin123", 10);
    const userPass = await bcrypt.hash("user123", 10);

    await prisma.user.upsert({
        where: { email: "admin@foodapp.com" },
        update: {},
        create: {
            name: "Admin",
            email: "admin@foodapp.com",
            password: adminPass,
            role: "admin"
        }
    });

    await prisma.user.upsert({
        where: { email: "customer@foodapp.com" },
        update: {},
        create: {
            name: "Customer",
            email: "customer@foodapp.com",
            password: userPass,
            role: "customer"
        }
    });

    const r1 = await prisma.restaurant.create({
        data: { name: "Krugersdorp Grill House", description: "Local grills", address: "Krugersdorp CBD" }
    });
    const r2 = await prisma.restaurant.create({
        data: { name: "Vaal Takeaway", description: "Burgers and chips", address: "Vaal Street" }
    });

    await prisma.menuItem.createMany({
        data: [
            { restaurantId: r1.id, name: "Grilled Chicken Half", price: 75, description: "Flame-grilled" },
            { restaurantId: r1.id, name: "Beef Stew & Pap", price: 60 },
            { restaurantId: r2.id, name: "Cheese Burger", price: 40 },
            { restaurantId: r2.id, name: "Mega Chips", price: 28 }
        ]
    });

    await prisma.driver.createMany({
        data: [
            { name: "Thabo", phone: "0785551212", vehicle: "Bike", isAvailable: true },
            { name: "Mandla", phone: "0724449898", vehicle: "Scooter", isAvailable: true }
        ]
    });

    console.log("🌱 Seeding complete");
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
