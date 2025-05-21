
import { AdministrativeDocument } from "@/types/documents";

// Helper function to create a blob from document content
const createDocumentBlob = (content: string, type: string) => {
  const mimeType = type.toLowerCase() === "pdf"
    ? "application/pdf"
    : type.toLowerCase() === "docx"
      ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      : "application/octet-stream";
  
  // Handle base64 content
  if (content.startsWith('data:')) {
    const base64Content = content.split(',')[1];
    const binaryString = window.atob(base64Content);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: mimeType });
  }
  
  // Handle regular content
  return new Blob([content], { type: mimeType });
};

// Download a document
export const downloadDocument = async (
  content: string, 
  fileName: string, 
  fileType: string
): Promise<boolean> => {
  try {
    const blob = createDocumentBlob(content, fileType);
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${fileType.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
    return true;
  } catch (error) {
    console.error("Error downloading document:", error);
    return false;
  }
};

// Download all documents as a zip
export const exportAllDocuments = async (documents: AdministrativeDocument[]): Promise<boolean> => {
  try {
    // Currently just downloads the first document as proof of concept
    // In a real implementation, this would create a zip file with all documents
    if (documents.length === 0) return false;
    
    const doc = documents[0];
    if (doc.content) {
      return await downloadDocument(doc.content, doc.name, doc.type);
    }
    
    return false;
  } catch (error) {
    console.error("Error exporting all documents:", error);
    return false;
  }
};

// Get document content by ID (simulate API call)
export const getDocumentContent = async (documentId: string): Promise<AdministrativeDocument | null> => {
  try {
    // This would typically be an API call to get the document content
    // For now just returning dummy content
    return {
      id: documentId,
      name: "Document Sample",
      type: "pdf",
      content: "Sample content that would be binary data",
      status: "generated",
      description: "",
      order: 0
    };
  } catch (error) {
    console.error("Error getting document content:", error);
    return null;
  }
};

// Create a document preview URL
export const createDocumentPreviewUrl = (content: string, type: string): string => {
  try {
    if (content.startsWith('data:')) {
      // Already a data URL
      return content;
    }
    
    const blob = createDocumentBlob(content, type);
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error creating document preview URL:", error);
    return "";
  }
};

export const documentService = {
  downloadDocument,
  exportAllDocuments,
  getDocumentContent,
  createDocumentPreviewUrl
};
