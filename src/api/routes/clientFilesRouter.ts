
import express from 'express';
import { getClientFiles } from './clientFiles';
import { fetchClientFiles } from '../mockClientData';

const router = express.Router();

// Real endpoint using Prisma
router.get('/clients/:beetoolToken/files', async (req, res) => {
  try {
    // For production, use the real implementation
    // await getClientFiles(req, res);
    
    // For development/demo, use mock data
    const { beetoolToken } = req.params;
    const files = await fetchClientFiles(beetoolToken);
    res.status(200).json(files);
  } catch (error) {
    console.error("Error in client files route:", error);
    res.status(500).json({ 
      error: "Failed to fetch client files",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
