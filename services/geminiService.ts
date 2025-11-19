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
    .map((item) => `- ${item.name}: ${item.quantity} unit (Total: ${item.quantity * item.weightKg} kg)`)
    .join("\n");

  const totalWeight = items.reduce((acc, item) => acc + item.quantity * item.weightKg, 0);

  const prompt = `
    Anda adalah ahli logistik muat truk profesional di Indonesia. 
    Tugas anda adalah membuat rencana muat barang (Loading Plan) yang sangat spesifik berdasarkan aturan-aturan berikut.

    ${USER_CONTEXT_RULES}

    DATA INPUT:
    Truk yang dipilih: ${truck.name} (Maks: ${truck.maxWeightKg}kg, Target Ideal: ${truck.targetWeightKg}kg).
    Total Berat Barang Saat Ini: ${totalWeight} kg.

    Barang yang akan dimuat:
    ${cartDescription}

    INSTRUKSI OUTPUT:
    1. Tentukan apakah muatan ini Aman, Perlu Hati-hati (Mendekati batas), atau Overload.
    2. Buat langkah-langkah memuat barang dari BAGIAN DEPAN (dekat supir) mundur ke BAGIAN BELAKANG (pintu).
    3. Kelompokkan barang berdasarkan jenis dan kestabilan sesuai aturan (contoh: Sagu di bawah, Garam di atas/belakang).
    4. Berikan estimasi "Tier" (baris) yang terpakai di truk untuk setiap kelompok barang.
    5. Ingat aturan khusus: Gula jangan terlalu tinggi, Kardus jangan diinjak beban berat.

    Responlah HANYA dengan format JSON berikut.
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
            planName: { type: Type.STRING, description: "Judul rencana singkat" },
            totalWeightCalculated: { type: Type.NUMBER },
            weightStatus: { type: Type.STRING, enum: ["SAFE", "WARNING", "OVERLOAD"] },
            generalAdvice: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Saran umum penting (misal: Gula ditaruh merata di lantai)" 
            },
            steps: {
              type: Type.ARRAY,
              description: "Langkah muat dari Depan (Kabin) ke Belakang",
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  location: { type: Type.STRING, description: "Posisi dalam truk (Depan Bawah, Depan Atas, Tengah, Belakang)" },
                  instruction: { type: Type.STRING, description: "Instruksi detail (misal: Susun 5 ke samping, 8 ke atas)" },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        itemName: { type: Type.STRING },
                        quantity: { type: Type.INTEGER },
                        note: { type: Type.STRING, description: "Catatan khusus item ini jika ada" }
                      }
                    }
                  },
                  warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
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
    throw new Error("Gagal membuat rencana muat. Coba lagi.");
  }
};
