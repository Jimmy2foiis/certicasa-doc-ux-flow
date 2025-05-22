
import { FilesType, FoldersKey } from "@prisma/client";

// Generate mock files based on a beetoolToken
export const generateMockFiles = (beetoolToken: string) => {
  const folderTypes = Object.values(FoldersKey);
  const fileTypes = Object.values(FilesType);
  
  const files = [];
  
  // Generate a random number of files (5-15)
  const fileCount = Math.floor(Math.random() * 10) + 5;
  
  for (let i = 0; i < fileCount; i++) {
    const folderType = folderTypes[Math.floor(Math.random() * folderTypes.length)];
    const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    
    const updatedDate = new Date(createdDate);
    updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 10));
    
    files.push({
      id: `file-${beetoolToken}-${i}`,
      fileId: `drive-file-${i}`,
      fileUrl: `https://drive.google.com/file/d/mock-file-id-${i}/view`,
      folderType: folderType,
      fileType: fileType,
      createdAt: createdDate,
      updatedAt: updatedDate,
      name: getDocumentTypeName(folderType, fileType, i),
      beetoolToken,
      driveFolderId: `folder-${beetoolToken}`,
      subFolderId: folderType === 'PHOTOS' ? `subfolder-photos-${beetoolToken}` : null,
      // Add additional subFolder data for joined queries
      SubFolder: folderType === 'PHOTOS' ? {
        id: `subfolder-photos-${beetoolToken}`,
        folderType
      } : null
    });
  }
  
  return files;
};

// Generate document names based on type
const getDocumentTypeName = (folderType: FoldersKey, fileType: FilesType, index: number): string => {
  switch(folderType) {
    case 'FICHA':
      return `Fiche d'information client #${index+1}`;
    case 'DR_AYUDA':
      return `Demande d'aide financière #${index+1}`;
    case 'FACTURAS':
      return `Facture #${(index+1).toString().padStart(3, '0')}`;
    case 'INFORMES_FOTOGRAFICOS':
      return `Rapport photo ${index+1}`;
    case 'CERTIFICADO_INSTALADOR':
      return `Certificat d'installation ${index+1}`;
    case 'CEEE':
      return `CEEE Document #${index+1}`;
    case 'ACUERDO_CESION_DE_AHORROS':
      return `Accord d'économie d'énergie #${index+1}`;
    case 'DNI_CLIENT':
      return fileType === 'NIF' ? `NIF Client` : `DNI Client`;
    case 'SIGNATURE':
      return `Signature ${fileType === 'FIRMA' ? 'électronique' : 'manuscrite'}`;
    case 'PHOTOS':
      return `Photo #${index+1}`;
    default:
      return `Document #${index+1}`;
  }
};

// Function to simulate API fetch
export const fetchClientFiles = async (beetoolToken: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return generateMockFiles(beetoolToken);
};
