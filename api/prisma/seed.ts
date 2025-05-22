import { PrismaClient } from "@prisma/client";
import { clientsData } from "../../src/data/mock";

const prisma = new PrismaClient();

async function main() {
  console.log(`🚀 Seeding ${clientsData.length} clients...`);

  for (const c of clientsData) {
    try {
      await prisma.client.upsert({
        where: { id: c.id },
        update: {},
        create: {
          id: c.id, // conserver l'ID mock pour cohérence
          beetoolToken: "", // champ vide (non fourni dans les mocks)
          prenom: c.name.split(" ")[0] || "",
          nom: c.name.split(" ").slice(1).join(" ") || "",
          sexe: "Autre",
          adresse: "",
          codePostal: "",
          ville: "",
          pays: "Espagne",
          tel: c.phone || "",
          email: c.email || "",
          cadastralReference: "",
          utm30: null,
          safetyCultureAuditId: "",
          geoPosition: "",
          status: c.status || "Actif",
        },
      });
    } catch (err) {
      console.error(`❌ Failed to insert client ${c.id}`, err);
    }
  }

  console.log("🌱 Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 