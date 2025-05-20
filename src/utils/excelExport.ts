
import * as XLSX from 'xlsx';
import { Material } from '@/data/materials';
import { VentilationType } from '@/utils/calculationUtils';

interface ExcelExportProps {
  projectType: string;
  surfaceArea: string;
  roofArea: string;
  ventilationBefore: VentilationType;
  ventilationAfter: VentilationType;
  ratioBefore: number;
  ratioAfter: number;
  rsiBefore: string;
  rseBefore: string;
  rsiAfter: string;
  rseAfter: string;
  beforeLayers: Material[];
  afterLayers: Material[];
  totalRBefore: number;
  upValueBefore: number;
  uValueBefore: number;
  totalRAfter: number;
  upValueAfter: number;
  uValueAfter: number;
  improvementPercent: number;
  climateZone: string;
  bCoefficientBefore: number;
  bCoefficientAfter: number;
  clientName?: string;
  clientAddress?: string;
  projectName?: string;
  date?: string;
}

const formatDate = (date?: string): string => {
  if (date) return date;
  return new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Instead of modifying WorkBook.Styles, we'll apply the styles to individual cells
interface CellStyle {
  font?: {
    bold?: boolean;
    italic?: boolean;
    color?: { rgb: string };
  };
  fill?: {
    fgColor?: { rgb: string };
  };
  alignment?: {
    horizontal?: string;
    vertical?: string;
  };
  border?: {
    top?: { style: string };
    bottom?: { style: string };
    left?: { style: string };
    right?: { style: string };
  };
}

interface ExcelStyles {
  [key: string]: CellStyle;
}

const createExcelStyles = (): ExcelStyles => {
  return {
    header: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4472C4" } },
      alignment: { horizontal: "center", vertical: "center" }
    },
    subheader: {
      font: { bold: true },
      fill: { fgColor: { rgb: "D9E1F2" } },
      alignment: { horizontal: "center" }
    },
    highlight: {
      font: { bold: true },
      fill: { fgColor: { rgb: "FFEB9C" } }
    },
    result: {
      font: { bold: true, color: { rgb: "006100" } },
      fill: { fgColor: { rgb: "C6E0B4" } }
    },
    reference: {
      font: { italic: true, color: { rgb: "7F7F7F" } },
      fill: { fgColor: { rgb: "F2F2F2" } }
    },
    normal: {},
    materialHeader: {
      font: { bold: true },
      fill: { fgColor: { rgb: "BDD7EE" } },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      }
    },
    materialCell: {
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      }
    },
    resultTable: {
      font: { bold: true },
      fill: { fgColor: { rgb: "E2EFDA" } },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      }
    }
  };
};

// Helper function to apply styles to cells
const applyCellStyle = (ws: XLSX.WorkSheet, cellRef: string, style: CellStyle) => {
  if (!ws['!styles']) ws['!styles'] = {};
  ws['!styles'][cellRef] = style;
};

const addHeaderSection = (ws: XLSX.WorkSheet, data: ExcelExportProps) => {
  // Titre principal
  ws['A1'] = { t: 's', v: 'Documento de Apoyo al Documento Básico' };
  ws['A2'] = { t: 's', v: 'DB-HE Ahorro de energía' };
  ws['A3'] = { t: 's', v: 'DA DB-HE / 1' };
  
  // En-tête du projet
  ws['A5'] = { t: 's', v: 'Proyecto:' };
  ws['B5'] = { t: 's', v: data.projectName || `Rehabilitación Energética ${data.projectType}` };
  
  ws['A6'] = { t: 's', v: 'Cliente:' };
  ws['B6'] = { t: 's', v: data.clientName || 'Cliente' };
  
  ws['A7'] = { t: 's', v: 'Dirección:' };
  ws['B7'] = { t: 's', v: data.clientAddress || 'Dirección' };
  
  ws['A8'] = { t: 's', v: 'Fecha:' };
  ws['B8'] = { t: 's', v: formatDate(data.date) };
  
  ws['A9'] = { t: 's', v: 'Superficie:' };
  ws['B9'] = { t: 's', v: `${data.surfaceArea} m²` };
  
  ws['A10'] = { t: 's', v: 'Zona Climática:' };
  ws['B10'] = { t: 's', v: data.climateZone };
  
  // Fusion des cellules pour l'en-tête
  ws['!merges'] = ws['!merges'] || [];
  ws['!merges'].push(
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },  // A1:F1
    { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },  // A2:F2
    { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } }   // A3:F3
  );
  
  // Formule de base
  ws['A12'] = { t: 's', v: 'Particiones interiores' };
  ws['A13'] = { t: 's', v: 'Fórmula básica: U = Up * b' };
  
  // Paramètres
  ws['F5'] = { t: 's', v: 'Ratio combles/toiture:' };
  ws['G5'] = { t: 's', v: `${data.ratioBefore.toFixed(2)}` };
  
  ws['F6'] = { t: 's', v: 'Ventilation avant:' };
  ws['G6'] = { t: 's', v: data.ventilationBefore === 'caso1' ? 'Légèrement ventilé' : 'Très ventilé' };
  
  ws['F7'] = { t: 's', v: 'Ventilation après:' };
  ws['G7'] = { t: 's', v: data.ventilationAfter === 'caso1' ? 'Légèrement ventilé' : 'Très ventilé' };
};

const addBeforeWorkSection = (ws: XLSX.WorkSheet, data: ExcelExportProps, startRow: number) => {
  // Titre de la section
  ws[`A${startRow}`] = { t: 's', v: 'SITUATION INITIALE - AVANT TRAVAUX' };
  startRow += 2;
  
  // En-têtes du tableau des matériaux
  ws[`A${startRow}`] = { t: 's', v: 'Material' };
  ws[`B${startRow}`] = { t: 's', v: 'Espesor (m)' };
  ws[`C${startRow}`] = { t: 's', v: 'λ (W/mK)' };
  ws[`D${startRow}`] = { t: 's', v: 'R (m²K/W)' };
  
  startRow++;
  
  // Données des matériaux
  data.beforeLayers.forEach((layer, index) => {
    ws[`A${startRow + index}`] = { t: 's', v: layer.name };
    ws[`B${startRow + index}`] = { t: 'n', v: layer.thickness / 1000 }; // Convert mm to m
    ws[`C${startRow + index}`] = { t: 's', v: layer.lambda.toString() };
    ws[`D${startRow + index}`] = { t: 'n', v: layer.r };
  });
  
  startRow += data.beforeLayers.length + 1;
  
  // Résistances superficielles
  ws[`A${startRow}`] = { t: 's', v: 'RSI' };
  ws[`D${startRow}`] = { t: 'n', v: parseFloat(data.rsiBefore) };
  
  startRow++;
  
  ws[`A${startRow}`] = { t: 's', v: 'RSE' };
  ws[`D${startRow}`] = { t: 'n', v: parseFloat(data.rseBefore) };
  
  startRow += 2;
  
  // Résultats des calculs
  ws[`A${startRow}`] = { t: 's', v: 'Résistance thermique totale (Rt):' };
  ws[`D${startRow}`] = { t: 'n', v: data.totalRBefore };
  
  startRow++;
  
  ws[`A${startRow}`] = { t: 's', v: 'Up = 1/Rt:' };
  ws[`D${startRow}`] = { t: 'n', v: data.upValueBefore };
  
  startRow++;
  
  ws[`A${startRow}`] = { t: 's', v: 'Coefficient b:' };
  ws[`D${startRow}`] = { t: 'n', v: data.bCoefficientBefore };
  
  startRow++;
  
  ws[`A${startRow}`] = { t: 's', v: 'Ui = Up * b:' };
  ws[`D${startRow}`] = { t: 'n', v: data.uValueBefore };
  
  // Ajouter fusion pour le titre
  ws['!merges'] = ws['!merges'] || [];
  ws['!merges'].push({ s: { r: startRow - data.beforeLayers.length - 8, c: 0 }, e: { r: startRow - data.beforeLayers.length - 8, c: 5 } });
  
  return startRow + 2;
};

const addAfterWorkSection = (ws: XLSX.WorkSheet, data: ExcelExportProps, startRow: number) => {
  // Titre de la section
  ws[`A${startRow}`] = { t: 's', v: 'SOLUTION PROPOSÉE - APRÈS TRAVAUX' };
  startRow += 2;
  
  // En-têtes du tableau des matériaux
  ws[`A${startRow}`] = { t: 's', v: 'Material' };
  ws[`B${startRow}`] = { t: 's', v: 'Espesor (m)' };
  ws[`C${startRow}`] = { t: 's', v: 'λ (W/mK)' };
  ws[`D${startRow}`] = { t: 's', v: 'R (m²K/W)' };
  
  startRow++;
  
  // Données des matériaux
  data.afterLayers.forEach((layer, index) => {
    ws[`A${startRow + index}`] = { t: 's', v: layer.name };
    ws[`B${startRow + index}`] = { t: 'n', v: layer.thickness / 1000 }; // Convert mm to m
    ws[`C${startRow + index}`] = { t: 's', v: layer.lambda.toString() };
    ws[`D${startRow + index}`] = { t: 'n', v: layer.r };
  });
  
  startRow += data.afterLayers.length + 1;
  
  // Résistances superficielles
  ws[`A${startRow}`] = { t: 's', v: 'RSI' };
  ws[`D${startRow}`] = { t: 'n', v: parseFloat(data.rsiAfter) };
  
  startRow++;
  
  ws[`A${startRow}`] = { t: 's', v: 'RSE' };
  ws[`D${startRow}`] = { t: 'n', v: parseFloat(data.rseAfter) };
  
  startRow += 2;
  
  // Résultats des calculs
  ws[`A${startRow}`] = { t: 's', v: 'Résistance thermique totale (Rt):' };
  ws[`D${startRow}`] = { t: 'n', v: data.totalRAfter };
  
  startRow++;
  
  ws[`A${startRow}`] = { t: 's', v: 'Up = 1/Rt:' };
  ws[`D${startRow}`] = { t: 'n', v: data.upValueAfter };
  
  startRow++;
  
  ws[`A${startRow}`] = { t: 's', v: 'Coefficient b:' };
  ws[`D${startRow}`] = { t: 'n', v: data.bCoefficientAfter };
  
  startRow++;
  
  ws[`A${startRow}`] = { t: 's', v: 'Uf = Up * b:' };
  ws[`D${startRow}`] = { t: 'n', v: data.uValueAfter };
  
  // Ajouter fusion pour le titre
  ws['!merges'] = ws['!merges'] || [];
  ws['!merges'].push({ s: { r: startRow - data.afterLayers.length - 8, c: 0 }, e: { r: startRow - data.afterLayers.length - 8, c: 5 } });
  
  return startRow + 2;
};

const addResultsSection = (ws: XLSX.WorkSheet, data: ExcelExportProps, startRow: number) => {
  // Titre de la section
  ws[`A${startRow}`] = { t: 's', v: 'RÉSULTATS ET AMÉLIORATION' };
  startRow += 2;
  
  // Tableau récapitulatif
  ws[`A${startRow}`] = { t: 's', v: 'Élément' };
  ws[`B${startRow}`] = { t: 's', v: 'Avant travaux' };
  ws[`C${startRow}`] = { t: 's', v: 'Après travaux' };
  ws[`D${startRow}`] = { t: 's', v: 'Amélioration' };
  
  startRow++;
  
  ws[`A${startRow}`] = { t: 's', v: 'Résistance thermique (m²K/W)' };
  ws[`B${startRow}`] = { t: 'n', v: data.totalRBefore };
  ws[`C${startRow}`] = { t: 'n', v: data.totalRAfter };
  ws[`D${startRow}`] = { t: 'n', v: data.totalRAfter - data.totalRBefore };
  
  startRow++;
  
  ws[`A${startRow}`] = { t: 's', v: 'Coefficient U (W/m²K)' };
  ws[`B${startRow}`] = { t: 'n', v: data.uValueBefore };
  ws[`C${startRow}`] = { t: 'n', v: data.uValueAfter };
  ws[`D${startRow}`] = { t: 'n', v: data.uValueBefore - data.uValueAfter };
  
  startRow += 2;
  
  // Pourcentage d'amélioration
  ws[`A${startRow}`] = { t: 's', v: 'Pourcentage d\'amélioration:' };
  ws[`B${startRow}`] = { t: 'n', v: data.improvementPercent };
  ws[`C${startRow}`] = { t: 's', v: '%' };
  
  startRow++;
  
  // Conclusion
  ws[`A${startRow}`] = { t: 's', v: 'Exigences satisfaites:' };
  ws[`B${startRow}`] = { t: 's', v: data.improvementPercent >= 30 ? 'OUI' : 'NON' };
  
  // Ajouter fusion pour le titre
  ws['!merges'] = ws['!merges'] || [];
  ws['!merges'].push({ s: { r: startRow - 7, c: 0 }, e: { r: startRow - 7, c: 5 } });
  
  return startRow + 2;
};

const addReferenceTablesSection = (ws: XLSX.WorkSheet, startRow: number) => {
  // Titre de la section
  ws[`A${startRow}`] = { t: 's', v: 'TABLEAUX DE RÉFÉRENCE' };
  startRow += 2;
  
  // Tableau des résistances thermiques superficielles
  ws[`A${startRow}`] = { t: 's', v: 'Résistances superficielles (m²K/W)' };
  startRow++;
  
  ws[`A${startRow}`] = { t: 's', v: 'Position' };
  ws[`B${startRow}`] = { t: 's', v: 'Direction du flux de chaleur' };
  ws[`C${startRow}`] = { t: 's', v: 'RSI' };
  ws[`D${startRow}`] = { t: 's', v: 'RSE' };
  
  startRow++;
  
  const rsiRseValues = [
    { position: 'Cloison verticale', direction: 'Horizontal', rsi: 0.13, rse: 0.13 },
    { position: 'Plancher', direction: 'Ascendant', rsi: 0.10, rse: 0.10 },
    { position: 'Plafond', direction: 'Descendant', rsi: 0.17, rse: 0.17 }
  ];
  
  rsiRseValues.forEach((value, index) => {
    ws[`A${startRow + index}`] = { t: 's', v: value.position };
    ws[`B${startRow + index}`] = { t: 's', v: value.direction };
    ws[`C${startRow + index}`] = { t: 'n', v: value.rsi };
    ws[`D${startRow + index}`] = { t: 'n', v: value.rse };
  });
  
  // Ajouter fusion pour le titre principal
  ws['!merges'] = ws['!merges'] || [];
  ws['!merges'].push(
    { s: { r: startRow - 4, c: 0 }, e: { r: startRow - 4, c: 5 } },
    { s: { r: startRow - 2, c: 0 }, e: { r: startRow - 2, c: 5 } }
  );
  
  return startRow + rsiRseValues.length + 2;
};

export const exportToExcel = (data: ExcelExportProps) => {
  // Créer un nouveau classeur Excel
  const wb = XLSX.utils.book_new();
  
  // Créer une feuille de calcul
  const ws = XLSX.utils.aoa_to_sheet([]);
  
  // Créer les styles (mais ne pas les appliquer directement au classeur)
  const styles = createExcelStyles();
  
  // Ajouter les différentes sections
  addHeaderSection(ws, data);
  let nextRow = addBeforeWorkSection(ws, data, 15);
  nextRow = addAfterWorkSection(ws, data, nextRow);
  nextRow = addResultsSection(ws, data, nextRow);
  nextRow = addReferenceTablesSection(ws, nextRow);
  
  // Définir la largeur des colonnes
  ws['!cols'] = [
    { width: 30 },  // A
    { width: 15 },  // B
    { width: 15 },  // C
    { width: 15 },  // D
    { width: 15 },  // E
    { width: 20 },  // F
    { width: 15 }   // G
  ];
  
  // Ajouter la feuille au classeur
  XLSX.utils.book_append_sheet(wb, ws, 'Calcul Thermique');
  
  // Générer le fichier Excel
  const fileName = `Calcul_Thermique_${data.projectType}_${formatDate(data.date).replace(/\//g, '-')}.xlsx`;
  XLSX.writeFile(wb, fileName);
  
  return fileName;
};
