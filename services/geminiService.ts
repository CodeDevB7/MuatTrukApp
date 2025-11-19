import { GoogleGenAI, Type } from "@google/genai";
import { CartItem, LoadingPlanResponse, TruckDef } from "../types";
import { USER_CONTEXT_RULES } from "../constants";

// Initialize Gemini Client
// Note: apiKey is assumed to be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLoadingPlan = async (
  truck: TruckDef,
  items: CartItem[]
): Promise<LoadingPlanResponse> => {
  const model = "gemini-2.5-flash";

  const cartDescription = items
    .map((item) => `- ${item.name}: ${item.quantity} unit (@ ${item.weightKg} kg)`)
    .join("\n");

  const totalWeight = items.reduce((acc, item) => acc + item.quantity * item.weightKg, 0);

  const prompt = `
    Anda adalah ahli logistik muat truk. Saya butuh output yang SANGAT SEDERHANA dan PRAKTIS untuk sopir/kuli muat.
    Jangan berikan instruksi bertele-tele. Fokus pada HITUNGAN MATEMATIKA SUSUNAN BARANG (TIER).

    ${USER_CONTEXT_RULES}

    CONTOH OUTPUT YANG DIINGINKAN (LOGIKA):
    "Ada 370 karung sagu di Truk Double.
    Maka dibagi menjadi:
    1. Depan: 4 Tier. Susunan 5 samping x 11 atas (55/tier). Total 220.
    2. Belakang: 3 Tier. Susunan 5 samping x 10 atas (50/tier). Total 150.
    Total 370. Pas."

    TUGAS ANDA:
    Hitung kombinasi "Tier" (baris ke belakang) agar semua barang muat dengan seimbang dari Depan (Kabin) ke Belakang (Pintu).
    Pastikan berat terdistribusi baik.
    
    PENTING:
    Untuk keperluan visualisasi 3D, Anda WAJIB memberikan estimasi angka "tierWidth" (jumlah ke samping) dan "tierHeight" (jumlah ke atas) untuk setiap grup.
    
    DATA INPUT:
    Truk: ${truck.name} (Target Ideal: ${truck.targetWeightKg}kg).
    Total Berat: ${totalWeight} kg.
    Barang:
    ${cartDescription}

    Responlah HANYA dengan format JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planName: { type: Type.STRING, description: "Judul singkat" },
            totalWeightCalculated: { type: Type.NUMBER },
            weightStatus: { type: Type.STRING, enum: ["SAFE", "WARNING", "OVERLOAD"] },
            totalTiersUsed: { type: Type.NUMBER, description: "Total estimasi baris ke belakang yang terpakai" },
            summary: { type: Type.STRING, description: "Kesimpulan singkat satu kalimat" },
            tierGroups: {
              type: Type.ARRAY,
              description: "Urutan muat dari Depan (Kabin) ke Belakang",
              items: {
                type: Type.OBJECT,
                properties: {
                  position: { type: Type.STRING, enum: ["DEPAN (Kabin)", "TENGAH", "BELAKANG (Pintu)"] },
                  tierCount: { type: Type.NUMBER, description: "Jumlah baris/tier untuk konfigurasi ini (kedalaman)" },
                  configuration: { type: Type.STRING, description: "Format text: 'X samping, Y atas'" },
                  tierWidth: { type: Type.NUMBER, description: "Jumlah barang ke samping (X axis)" },
                  tierHeight: { type: Type.NUMBER, description: "Jumlah barang ke atas (Y axis)" },
                  quantityPerTier: { type: Type.NUMBER, description: "Jumlah barang dalam satu tier/baris" },
                  totalItemsInGroup: { type: Type.NUMBER, description: "tierCount * quantityPerTier" },
                  itemDescription: { type: Type.STRING, description: "Nama barang di tumpukan ini" },
                  notes: { type: Type.STRING, description: "Catatan singkat (opsional)" }
                },
                required: ["position", "tierCount", "configuration", "quantityPerTier", "totalItemsInGroup", "itemDescription", "tierWidth", "tierHeight"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as LoadingPlanResponse;

  } catch (error) {
    console.error("Error generating plan:", error);
    throw new Error("Gagal menghitung susunan tier. Coba lagi.");
  }
};