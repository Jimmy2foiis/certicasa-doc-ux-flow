
import { prisma } from "@/lib/prisma";
import { Request, Response } from "express";

// Get files for a specific client by beetoolToken
export const getClientFiles = async (req: Request, res: Response) => {
  try {
    const { beetoolToken } = req.params;
    
    if (!beetoolToken) {
      return res.status(400).json({ error: "beetoolToken is required" });
    }
    
    // Fetch files from Prisma
    const files = await prisma.file.findMany({
      where: { beetoolToken },
      include: {
        SubFolder: {
          select: {
            id: true,
            folderType: true,
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    
    // Transform files for frontend
    const transformedFiles = files.map(file => ({
      id: file.id,
      name: file.name,
      fileId: file.fileId,
      fileUrl: file.fileUrl,
      folderType: file.folderType,
      fileType: file.fileType,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      subFolderName: file.SubFolder?.folderType,
    }));
    
    return res.status(200).json(transformedFiles);
    
  } catch (error) {
    console.error("Error fetching client files:", error);
    return res.status(500).json({ 
      error: "Failed to fetch client files",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
