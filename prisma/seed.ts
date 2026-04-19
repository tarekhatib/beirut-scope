import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "General", slug: "general" },
  { name: "Politics", slug: "politics" },
  { name: "Exclusive", slug: "exclusive" },
  { name: "Economy", slug: "economy" },
  { name: "Security", slug: "security" },
  { name: "World", slug: "world" },
  { name: "Sport", slug: "sport" },
  { name: "Weather", slug: "weather" },
  { name: "History", slug: "history" },
];

async function main() {
  console.log("Seeding categories...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    console.log(`  ✓ ${category.name}`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
