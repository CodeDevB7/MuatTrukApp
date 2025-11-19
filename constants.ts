import { ItemDef, TruckDef, TruckType } from './types';

export const TRUCKS: TruckDef[] = [
  {
    id: TruckType.L300,
    name: 'L300',
    maxWeightKg: 3000,
    targetWeightKg: 2500,
    description: 'Maks 3 Ton. Kecil dan lincah.',
  },
  {
    id: TruckType.ENGKEL,
    name: 'Truk Engkel',
    maxWeightKg: 5000,
    targetWeightKg: 4300, // Based on user note: "4,3 ton => muat barang sampai setinggi di atas bak dikit"
    description: 'Maks 5 Ton. 4 roda.',
  },
  {
    id: TruckType.DOUBLE,
    name: 'Truk Double',
    maxWeightKg: 10000,
    targetWeightKg: 7800, // Based on user note: "7,8 ton => muat barang sampai setinggi rata bak"
    description: 'Maks 10 Ton. 6 roda.',
  },
];

export const ITEMS: ItemDef[] = [
  // SACKS (Karung)
  {
    id: 'karung_50kg',
    name: 'Karung Besar 50kg (Umum/Gula/Kedelai)',
    weightKg: 50,
    category: 'Sack',
    description: 'Satu palet 40 karung (5 samping x 8 atas).',
    color: '#d4a373', // Brown sack
  },
  {
    id: 'karung_25kg',
    name: 'Karung 25kg (Umum)',
    weightKg: 25,
    category: 'Sack',
    description: 'Satu palet ~70 karung (7 samping x 10 atas).',
    color: '#e9edc9', // Pale yellowish
  },
  {
    id: 'sagu_aks',
    name: 'Sagu AKS (Karung 25kg)',
    weightKg: 25,
    category: 'Sack',
    description: 'Tinggi dan berat. 80/palet (8 samping x 10 atas).',
    color: '#fefae0', // Whiteish
  },
  {
    id: 'karung_sioci',
    name: 'Karung Sioci DW',
    weightKg: 25,
    category: 'Sack',
    description: '80/palet (8 samping x 10 atas).',
    color: '#faedcd',
  },
  
  // BALES (Bal)
  {
    id: 'bawang_bal',
    name: 'Bawang Putih Bal',
    weightKg: 20,
    category: 'Bale',
    description: '48/palet (6 samping x 8 atas).',
    color: '#e0e1dd', // Off-white
  },
  
  // BOXES (Dus)
  {
    id: 'tepung_beras_ketan_dus',
    name: 'Dus Tepung Beras/Ketan (10kg)',
    weightKg: 10,
    category: 'Box',
    description: 'Ringan tapi tinggi. 150/palet (15 samping x 10 atas).',
    color: '#8ecae6', // Light blue box
  },
  {
    id: 'kacang_kupas_dus',
    name: 'Kacang Kupas (Dus 25kg)',
    weightKg: 25,
    category: 'Box',
    description: '65/palet (13 samping x 5 atas).',
    color: '#ffb703', // Orange/Yellow
  },
  {
    id: 'minyak_dus',
    name: 'Minyak (Dus 17kg)',
    weightKg: 17,
    category: 'Box',
    description: 'Muatan tinggi (bisa 10-14 tier).',
    color: '#fb8500', // Dark Orange
  },
  {
    id: 'gula_vit_dus',
    name: 'Gula Vit (Dus 25kg)',
    weightKg: 25,
    category: 'Box',
    description: 'Berat.',
    color: '#f1c0e8', // Pinkish
  },
  {
    id: 'terigu_dus_1kg',
    name: 'Terigu Dus isi 1kg (Total 12kg)',
    weightKg: 12,
    category: 'Box',
    description: 'Segitiga/Cakra/Lencana 1kg. 140/palet.',
    color: '#a2d2ff',
  },
  {
    id: 'terigu_dus_halfkg',
    name: 'Terigu Dus isi 1/2kg (Total 10kg)',
    weightKg: 10,
    category: 'Box',
    description: 'Segitiga/Cakra/Lencana 1/2kg. 90/palet.',
    color: '#bde0fe',
  },
  {
    id: 'terigu_tulip',
    name: 'Terigu Tulip (Dus 10kg)',
    weightKg: 10,
    category: 'Box',
    description: 'Berat 10kg.',
    color: '#cdb4db',
  },

  // PACKS
  {
    id: 'garam_pak',
    name: 'Garam (Pak 8kg)',
    weightKg: 8,
    category: 'Pack',
    description: 'Tidak stabil. Taruh paling atas/akhir. 220/palet.',
    color: '#ffffff', // Pure white
  },
  
  // OTHERS FROM WEIGHT LIST
  {
    id: 'kacang_tanah_super',
    name: 'Kacang Tanah Super (50kg)',
    weightKg: 50,
    category: 'Sack',
    description: 'Harus di atas sagu jika dicampur.',
    color: '#bc6c25', // Dark brown
  },
  {
    id: 'kacang_ijo_yulex',
    name: 'Kacang Ijo Yulex (25kg)',
    weightKg: 25,
    category: 'Sack',
    description: '25kg.',
    color: '#606c38', // Green
  },
  {
    id: 'kacang_merah',
    name: 'Kacang Merah (25kg)',
    weightKg: 25,
    category: 'Sack',
    description: '25kg.',
    color: '#9e2a2b', // Red
  },
];

export const USER_CONTEXT_RULES = `
ATURAN MUAT BARANG (PENTING):
1. Sifat Barang:
   - Gula: Berat tapi pendek. Jangan susun terlalu tinggi karena muatan jadi tidak seimbang.
   - Kacang, Tepung, Sagu: Tinggi dan Berat.
   - Dus-dusan (selain kacang/gula): Ringan namun Tinggi.
   - Garam: Tidak stabil. Letakkan di bagian akhir atau paling atas (top loading) agar tidak ditindih beban berat.
   - Kardus: Tidak boleh ditimpah barang berat (penyok).

2. Aturan Tumpukan (Stacking Rules):
   - Kacang tanah harus di atas Sagu (jika ada keduanya).
   - Tepung di atas sagu boleh.

3. Kapasitas & Susunan Truk:
   A. ENGKEL (Max 5 Ton, Target ~4.3 Ton):
      - Kacang kupas dus: 6 samping x 5 atas.
      - Garam: 8 samping x 15 atas.
      - Karung 25kg: 4 tier ke belakang, 4 samping.
      - Karung 50kg: 4 tier ke belakang, 4 samping.
      - Dus Minyak: 10 tier ke belakang (11 jika box), 6 samping.
      - Target visual: Barang setinggi di atas bak sedikit.

   B. DOUBLE (Max 10 Ton, Target ~7.8 Ton):
      - Karung 25kg: 7 tier ke belakang, 5 samping, 11 atas.
      - Karung 50kg: 5.5 tier ke belakang, 11-12 atas.
      - Dus Minyak: 14-18 tier ke belakang, 7 samping.
      - Target visual: Rata bak truk.

   C. L300 (Max 3 Ton):
      - Karung 25kg: 3.5 tier ke belakang, 5 samping.
      - Karung 50kg: 3 tier ke belakang, 4 samping.
      - Kacang 25kg (bungkus kecil): 4 tier ke belakang, 5 samping.
      - Minyak: 8 tier ke belakang, 6 samping.

4. Terminologi:
   - "Tier ke belakang": Baris dari depan (dekat kabin) menuju pintu belakang.
   - "Ke samping": Jumlah kolom menyamping (lebar truk).
   - "Ke atas": Jumlah tumpukan vertikal.
`;