
interface BCoefficient {
  min: number;
  max: number | null;
  caso1: number;
  caso2: number;
  caso1AfterWork: number;
  caso2AfterWork: number;
}

const bCoefficientTable: BCoefficient[] = [
  { min: 0, max: 0.25, caso1: 0.94, caso2: 0.97, caso1AfterWork: 0.99, caso2AfterWork: 1.00 },
  { min: 0.25, max: 0.50, caso1: 0.85, caso2: 0.92, caso1AfterWork: 0.97, caso2AfterWork: 0.99 },
  { min: 0.50, max: 0.75, caso1: 0.77, caso2: 0.87, caso1AfterWork: 0.96, caso2AfterWork: 0.98 },
  { min: 0.75, max: 1.00, caso1: 0.70, caso2: 0.83, caso1AfterWork: 0.94, caso2AfterWork: 0.97 },
  { min: 1.00, max: 1.25, caso1: 0.65, caso2: 0.79, caso1AfterWork: 0.92, caso2AfterWork: 0.96 },
  { min: 1.25, max: 2.00, caso1: 0.56, caso2: 0.73, caso1AfterWork: 0.89, caso2AfterWork: 0.95 },
  { min: 2.00, max: 2.50, caso1: 0.48, caso2: 0.66, caso1AfterWork: 0.86, caso2AfterWork: 0.93 },
  { min: 2.50, max: 3.00, caso1: 0.43, caso2: 0.61, caso1AfterWork: 0.83, caso2AfterWork: 0.91 },
  { min: 3.00, max: null, caso1: 0.39, caso2: 0.57, caso1AfterWork: 0.81, caso2AfterWork: 0.90 }
];

export type VentilationType = "caso1" | "caso2";

export interface BCoefficientParams {
  ratio: number;
  ventilationType: VentilationType;
  isAfterWork?: boolean;
}

export const calculateBCoefficient = ({ ratio, ventilationType, isAfterWork = false }: BCoefficientParams): number => {
  const range = bCoefficientTable.find(item => 
    ratio >= item.min && (item.max === null || ratio < item.max)
  );
  
  if (!range) return 0.95; // Valeur par défaut si aucune correspondance

  if (ventilationType === "caso1") {
    return isAfterWork ? range.caso1AfterWork : range.caso1;
  } else {
    return isAfterWork ? range.caso2AfterWork : range.caso2;
  }
};

export const calculateThermalResistance = (layers: any[], rsiRse: number = 0.17): number => {
  return layers.reduce((sum, layer) => sum + layer.r, rsiRse);
};

export const calculateUValue = (thermalResistance: number, bCoefficient: number): number => {
  return (1 / thermalResistance) * bCoefficient;
};

export const getBCoefficientTableData = () => {
  return bCoefficientTable.map(item => ({
    range: item.max === null ? `> ${item.min.toFixed(2)}` : `${item.min.toFixed(2)} - ${item.max.toFixed(2)}`,
    caso1: item.caso1.toFixed(2),
    caso2: item.caso2.toFixed(2),
    caso1AfterWork: item.caso1AfterWork.toFixed(2),
    caso2AfterWork: item.caso2AfterWork.toFixed(2)
  }));
};
