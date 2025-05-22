
import { ClientFile } from "@/hooks/useClientFiles";
import { Prisma } from '@prisma/client';

// Use Prisma namespace to access the enums
type FilesType = Prisma.FilesType;
type FoldersKey = Prisma.FoldersKey;

// Filter files by folder type
export const filterFilesByFolder = (
  files: ClientFile[],
  folderType: FoldersKey
): ClientFile[] => {
  return files.filter(file => file.folderType === folderType);
};

// Filter files by file type
export const filterFilesByType = (
  files: ClientFile[],
  fileType: FilesType
): ClientFile[] => {
  return files.filter(file => file.fileType === fileType);
};

// Get a human-readable name for folder types
export const getFolderTypeName = (folderType: FoldersKey): string => {
  const folderNames: Record<FoldersKey, string> = {
    FICHA: "Fiches client",
    DR_AYUDA: "Demandes d'aide",
    FACTURAS: "Factures",
    INFORMES_FOTOGRAFICOS: "Rapports photographiques",
    CERTIFICADO_INSTALADOR: "Certificats d'installation",
    CEEE: "Certificats d'économie d'énergie",
    ACUERDO_CESION_DE_AHORROS: "Accords de cession",
    DNI_CLIENT: "Documents d'identité",
    SIGNATURE: "Signatures",
    PHOTOS: "Photos"
  };
  
  return folderNames[folderType] || folderType;
};

// Get a human-readable name for file types
export const getFileTypeName = (fileType: FilesType): string => {
  const fileNames: Record<FilesType, string> = {
    SIGNATURE_NOMBRE_APELLIDO: "Signature nom/prénom",
    FIRMA: "Signature électronique",
    NIF: "NIF",
    NIE: "NIE",
    UNKNOWN: "Inconnu"
  };
  
  return fileNames[fileType] || fileType;
};
