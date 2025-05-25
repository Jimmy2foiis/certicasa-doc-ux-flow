
// Climate zone coefficients mapping
export const climateZoneCoefficients: Record<string, number> = {
  "A3": 25,
  "A4": 26,
  "B3": 32,
  "B4": 33,
  "C1": 44,
  "C2": 45,
  "C3": 46,
  "C4": 46,
  "D1": 60,
  "D2": 60,
  "D3": 61,
  "E1": 74,
};

// Delegate multipliers
export const delegateMultipliers = {
  "Eiffage": 0.130,
  "GreenFlex": 0.115,
} as const;

export type DelegateType = keyof typeof delegateMultipliers;
