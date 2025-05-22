
import express from "express";
import { prisma } from "@/lib/prisma";

const router = express.Router();

// GET all clients
router.get("/", async (_req, res) => {
  try {
    const prospects = await prisma.prospect.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        beetoolToken: true,
        prenom: true,
        nom: true,
        email: true,
        tel: true,
        ville: true,
        status: true,
        _count: { select: { File: true } },
      },
    });
    
    res.json(prospects);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

// GET a specific client by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // First try to find by UUID
    let client = await prisma.prospect.findUnique({
      where: { id },
      include: {
        File: true,
        GoogleDriveFolder: true,
      },
    });
    
    // If not found, try to find by beetoolToken
    if (!client) {
      client = await prisma.prospect.findUnique({
        where: { beetoolToken: id },
        include: {
          File: true,
          GoogleDriveFolder: true,
        },
      });
    }
    
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    
    res.json(client);
  } catch (error) {
    console.error("Error fetching client details:", error);
    res.status(500).json({ error: "Failed to fetch client details" });
  }
});

// DELETE a client
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.prospect.delete({
      where: { id },
    });
    
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Failed to delete client" });
  }
});

export default router;
