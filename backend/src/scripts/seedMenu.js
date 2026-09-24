require("dotenv").config();
const { connectDatabase, disconnectDatabase } = require("../config/database");
const MenuItem = require("../models/MenuItem");

const menuItems = [
  {
    name: "Margherita Pizza",
    description: "Stone-baked pizza with tomato, mozzarella, and fresh basil.",
    price: 349,
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80",
    category: "Pizza",
  },
  {
    name: "Classic Veg Burger",
    description: "Crispy vegetable patty, cheddar, lettuce, tomato, and house sauce.",
    price: 229,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    category: "Burgers",
  },
  {
    name: "Creamy Alfredo Pasta",
    description: "Penne pasta tossed in a rich parmesan and herb cream sauce.",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80",
    category: "Pasta",
  },
  {
    name: "Paneer Tikka Wrap",
    description: "Char-grilled paneer, peppers, onions, and mint chutney in a warm wrap.",
    price: 249,
    imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80",
    category: "Wraps",
  },
  {
    name: "Chocolate Brownie Sundae",
    description: "Warm chocolate brownie with vanilla ice cream and chocolate sauce.",
    price: 179,
    imageUrl: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=900&q=80",
    category: "Desserts",
  },
];

async function seedMenu() {
  await connectDatabase();
  console.log("MongoDB connected");
  await MenuItem.deleteMany({
    $and: [
      { name: { $ne: "Classic Veg Burger" } },
      { $or: [{ category: "Burgers" }, { name: /burger/i }] },
    ],
  });
  const operations = menuItems.map((item) => ({
    updateOne: { filter: { name: item.name }, update: { $setOnInsert: item }, upsert: true },
  }));
  const result = await MenuItem.bulkWrite(operations);
  console.log(`Menu ready: ${result.upsertedCount} item(s) added, ${menuItems.length - result.upsertedCount} already existed.`);
}

seedMenu()
  .catch((error) => {
    console.error("Unable to seed menu:", error.message || error);
    process.exitCode = 1;
  })
  .finally(() => disconnectDatabase());
