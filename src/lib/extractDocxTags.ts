
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
// Note: Adding .js extension for ESM/Vite compatibility
import InspectModule from 'docxtemplater/js/inspect-module.js';

/**
 * Extracts template tags from a DOCX document
 * @param content - Base64 encoded DOCX content or ArrayBuffer
 * @returns Array of tag names without {{ }} wrappers
 */
export const extractDocxTags = (content: string | ArrayBuffer): string[] => {
  try {
    // Handle base64 content (from data URL)
    let arrayBuffer: ArrayBuffer;
    if (typeof content === 'string' && content.startsWith('data:')) {
      const base64 = content.split(',')[1];
      const binaryString = atob(base64);
      arrayBuffer = new Uint8Array(Array.from(binaryString).map(char => char.charCodeAt(0))).buffer;
    } else if (typeof content === 'string') {
      // Handle raw base64 string
      const binaryString = atob(content);
      arrayBuffer = new Uint8Array(Array.from(binaryString).map(char => char.charCodeAt(0))).buffer;
    } else {
      // Already an ArrayBuffer
      arrayBuffer = content;
    }

    // Create a new Zip instance from the array buffer
    const zip = new PizZip(arrayBuffer);
    
    // Setup inspector module to detect tags
    const inspector = new InspectModule();
    
    // Create docxtemplater instance with the inspector module
    new Docxtemplater(zip, { modules: [inspector] });
    
    // Get all tags detected by the inspector
    // This returns { tagName: number_of_occurrences }
    const tags = inspector.getAllTags();
    
    return Object.keys(tags);
  } catch (error) {
    console.error("Error extracting DOCX tags:", error);
    return [];
  }
};
