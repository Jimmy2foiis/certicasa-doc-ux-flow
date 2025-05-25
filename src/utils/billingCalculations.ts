
// Climate coefficients according to ANEXO II (in thousands of hours·K/año) - Certicasa values
export const CLIMATE_COEFFICIENTS = {
  // Zone A
  'A3': 25,
  'A4': 26,
  
  // Zone B
  'B3': 32,
  'B4': 33,
  
  // Zone C
  'C1': 44,
  'C2': 45,
  'C3': 46,
  'C4': 46,
  
  // Zone D
  'D1': 60,
  'D2': 60,
  'D3': 61,
  
  // Zone E
  'E1': 74
} as const;

export type ClimateZone = keyof typeof CLIMATE_COEFFICIENTS;

export interface ThermalCalculationData {
  ui: number; // Initial transmittance (after coefficient b)
  uf: number; // Final transmittance (after coefficient b)
  surface: number; // Insulated surface in m²
  climateZone: ClimateZone;
  clientInfo: {
    fullName: string;
    nif: string;
    address: string;
    postalCode: string;
    city: string;
    phone: string;
    email: string;
  };
}

export interface BillingCalculationResult {
  cae: number; // CAE in kWh/año
  caeValue: number; // CAE monetary value in euros
  materialCost: number; // Material cost (7€/m²)
  laborCost: number; // Labor cost (calculated)
  subtotalHT: number; // Subtotal without VAT
  vat: number; // VAT amount (10%)
  totalTTC: number; // Total with VAT
  climateCoefficient: number; // G coefficient used
}

// Validate if climate zone is valid
export const isValidClimateZone = (zone: string): zone is ClimateZone => {
  return zone in CLIMATE_COEFFICIENTS;
};

// Get available climate zones
export const getAvailableClimateZones = (): ClimateZone[] => {
  return Object.keys(CLIMATE_COEFFICIENTS) as ClimateZone[];
};

// Calculate CAE (Certificate of Energy Savings)
export const calculateCAE = (
  ui: number,
  uf: number,
  surface: number,
  climateZone: ClimateZone
): number => {
  const FP = 1; // Always equals 1
  const G = CLIMATE_COEFFICIENTS[climateZone];
  
  // CAE = FP × (Ui - Uf) × S × G
  return FP * (ui - uf) * surface * G;
};

// Calculate complete billing information
export const calculateBilling = (data: ThermalCalculationData): BillingCalculationResult => {
  // Validate climate zone
  if (!isValidClimateZone(data.climateZone)) {
    throw new Error(`Zone climatique invalide: ${data.climateZone}. Zones valides: ${getAvailableClimateZones().join(', ')}`);
  }

  // Calculate CAE
  const cae = calculateCAE(data.ui, data.uf, data.surface, data.climateZone);
  
  // Calculate monetary value (0.10€ per kWh/año)
  const caeValue = cae * 0.10;
  
  // Calculate billing breakdown
  const materialCost = data.surface * 7; // Always 7€/m²
  const subtotalHT = caeValue / 1.1; // Get HT from TTC
  const laborCost = subtotalHT - materialCost;
  const vat = subtotalHT * 0.1; // 10% VAT
  const totalTTC = subtotalHT + vat;
  
  return {
    cae,
    caeValue,
    materialCost,
    laborCost,
    subtotalHT,
    vat,
    totalTTC,
    climateCoefficient: CLIMATE_COEFFICIENTS[data.climateZone]
  };
};

// Format numbers for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatNumber = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};
