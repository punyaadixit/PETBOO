const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Clearing old pet-store products...");

  // Remove any existing non-fresh-food products to avoid duplicates
  await prisma.product.deleteMany({
    where: {
      category: { in: ["Packaged Food", "Toys", "Accessories"] },
    },
  });

  console.log("Seeding 12 pet store products...");

  const products = [
    // ── Packaged Food (4) ──────────────────────────────────────
    {
      name: "Pedigree Adult Dry Dog Food",
      description:
        "Complete and balanced nutrition for adult dogs with real chicken and vegetables.",
      price: 1500,
      category: "Packaged Food",
      imageUrl:
        "https://images.unsplash.com/photo-1589924691995-400dc9ce8264?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Whiskas Tuna Cat Food",
      description:
        "Delicious tuna-flavoured wet food packed with essential vitamins for cats.",
      price: 120,
      category: "Packaged Food",
      imageUrl:
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Royal Canin Puppy Starter",
      description:
        "Scientifically formulated nutrition for puppies up to 2 months old.",
      price: 2200,
      category: "Packaged Food",
      imageUrl:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Drools Chicken & Egg Adult Food",
      description:
        "High-protein dry food with real chicken and egg for active adult dogs.",
      price: 950,
      category: "Packaged Food",
      imageUrl:
        "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80",
    },

    // ── Toys (4) ───────────────────────────────────────────────
    {
      name: "Rope Chew Toy",
      description:
        "Durable braided rope toy for dogs of all sizes — great for dental health.",
      price: 250,
      category: "Toys",
      imageUrl:
        "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Catnip Mouse",
      description:
        "Plush mouse toy infused with premium organic catnip. Irresistible to cats!",
      price: 150,
      category: "Toys",
      imageUrl:
        "https://images.unsplash.com/photo-1615266895738-11f1371cd7e5?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Squeaky Rubber Ball",
      description:
        "Bright, bouncy rubber ball with built-in squeaker for hours of fun.",
      price: 180,
      category: "Toys",
      imageUrl:
        "https://images.unsplash.com/photo-1535930749574-1399327ce78f?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Interactive Puzzle Feeder",
      description:
        "Slow-feeder puzzle toy that stimulates your pet's brain during mealtime.",
      price: 450,
      category: "Toys",
      imageUrl:
        "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=800&q=80",
    },

    // ── Accessories (4) ────────────────────────────────────────
    {
      name: "Deshedding Brush",
      description:
        "Professional deshedding tool for dogs and cats — reduces shedding by up to 90%.",
      price: 600,
      category: "Accessories",
      imageUrl:
        "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Adjustable Nylon Collar",
      description:
        "Comfortable, durable nylon collar with quick-release buckle. Available in all sizes.",
      price: 300,
      category: "Accessories",
      imageUrl:
        "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Retractable Dog Leash",
      description:
        "5-metre retractable leash with ergonomic grip and one-button lock system.",
      price: 750,
      category: "Accessories",
      imageUrl:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Stainless Steel Pet Bowl",
      description:
        "Non-slip, rust-proof stainless steel food and water bowl for dogs and cats.",
      price: 350,
      category: "Accessories",
      imageUrl:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`Successfully seeded ${products.length} products!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
