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
  color: string; // Hex color for visualization
}

export interface CartItem extends ItemDef {
  quantity: number;
}

export interface TierGroup {
  position: 'DEPAN (Kabin)' | 'TENGAH' | 'BELAKANG (Pintu)';
  tierCount: number; // How many rows/tiers deep
  configuration: string; // e.g. "5 ke samping x 11 ke atas"
  tierWidth: number; // Number of items sideways (X axis)
  tierHeight: number; // Number of items upwards (Y axis)
  quantityPerTier: number; // e.g. 55
  totalItemsInGroup: number; // e.g. 220
  itemDescription: string; // e.g. "Sagu 25kg"
  notes?: string;
}

export interface LoadingPlanResponse {
  planName: string;
  totalWeightCalculated: number;
  totalTiersUsed: number;
  weightStatus: 'SAFE' | 'WARNING' | 'OVERLOAD';
  tierGroups: TierGroup[]; // Simplified groups from Front to Back
  summary: string; // A one-sentence summary (e.g., "Muatan pas, rata bak")
}