
import express from "express";
import fetch from "node-fetch";

const router = express.Router();
const API_BASE_URL = "https://certicasa.mitain.com/api/prospects";

// GET all clients
router.get("/", async (_req, res) => {
  try {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const prospects = await response.json();
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
    
    const response = await fetch(`${API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: "Client not found" });
      }
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const client = await response.json();
    res.json(client);
  } catch (error) {
    console.error("Error fetching client details:", error);
    res.status(500).json({ error: "Failed to fetch client details" });
  }
});

// DELETE a client (this will be a proxy to the external API)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Failed to delete client" });
  }
});

export default router;
