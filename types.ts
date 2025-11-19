export enum TruckType {
  L300 = 'L300',
  ENGKEL = 'ENGKEL',
  DOUBLE = 'DOUBLE',
}

export interface TruckDef {
  id: TruckType;
  name: string;
  maxWeightKg: number;
  targetWeightKg: number; // The "ideal" weight mentioned in notes (e.g. 7.8 tons for Double)
  description: string;
}

export interface ItemDef {
  id: string;
  name: string;
  category: 'Sack' | 'Box' | 'Bale' | 'Pack';
  weightKg: number;
  description?: string; // Dimensions hints from user data
}

export interface CartItem extends ItemDef {
  quantity: number;
}

export interface LoadingPlanStep {
  stepNumber: number;
  location: string; // e.g., "Depan (Dekat Kabin)", "Tengah", "Belakang"
  instruction: string;
  items: { itemName: string; quantity: number; note?: string }[];
  warnings?: string[];
}

export interface LoadingPlanResponse {
  planName: string;
  totalWeightCalculated: number;
  weightStatus: 'SAFE' | 'WARNING' | 'OVERLOAD';
  generalAdvice: string[];
  steps: LoadingPlanStep[];
}
