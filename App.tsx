import React, { useState, useCallback, useMemo } from 'react';
import { TRUCKS } from './constants';
import { TruckSelector } from './components/TruckSelector';
import { ItemSelector } from './components/ItemSelector';
import { PlanResult } from './components/PlanResult';
import { TruckDef, CartItem, ItemDef, LoadingPlanResponse } from './types';
import { generateLoadingPlan } from './services/geminiService';
import { Loader2, RefreshCw, Trash2, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [selectedTruck, setSelectedTruck] = useState<TruckDef | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<LoadingPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalWeight = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity * item.weightKg, 0);
  }, [cart]);

  const handleSelectTruck = (truck: TruckDef) => {
    setSelectedTruck(truck);
    setPlan(null); // Reset plan if truck changes
  };

  const handleAddToCart = useCallback((item: ItemDef, qtyToAdd: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qtyToAdd } : i
        );
      }
      return [...prev, { ...item, quantity: qtyToAdd }];
    });
    setPlan(null);
  }, []);

  const handleRemoveFromCart = useCallback((itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing && existing.quantity > 1) {
         return prev.map((i) => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter((i) => i.id !== itemId);
    });
    setPlan(null);
  }, []);

  const handleReset = () => {
    setCart([]);
    setPlan(null);
    setError(null);
    // Keep truck selected
  };

  const handleGeneratePlan = async () => {
    if (!selectedTruck || cart.length === 0) return;
    
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const result = await generateLoadingPlan(selectedTruck, cart);
      setPlan(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat membuat rencana");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
               <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-none">MuatTruk</h1>
              <p className="text-xs text-slate-500">Asisten Logistik Cerdas</p>
            </div>
          </div>
          
          {cart.length > 0 && (
             <button 
               onClick={handleReset}
               className="text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm"
             >
               <Trash2 className="w-4 h-4" /> Reset
             </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-2 space-y-6">
            
            <TruckSelector selectedTruck={selectedTruck} onSelect={handleSelectTruck} />
            
            {selectedTruck && (
              <div className="animate-fade-in">
                 <ItemSelector 
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                    cart={cart}
                 />
              </div>
            )}

            {/* Sticky Footer for Action on Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg z-50">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-sm text-slate-500">Total Berat:</span>
                 <span className={`font-bold ${selectedTruck && totalWeight > selectedTruck.maxWeightKg ? 'text-red-600' : 'text-slate-800'}`}>
                    {totalWeight.toLocaleString()} kg
                 </span>
               </div>
               <button
                onClick={handleGeneratePlan}
                disabled={!selectedTruck || cart.length === 0 || loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
               >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Buat Rencana Muat"}
               </button>
            </div>
          </div>

          {/* Right Column: Summary & Result */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Summary Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Ringkasan Muatan</h2>
                
                <div className="space-y-3 mb-6">
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Truk</span>
                      <span className="font-medium">{selectedTruck?.name || '-'}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Batas Maks</span>
                      <span className="font-medium">{selectedTruck?.maxWeightKg.toLocaleString() || 0} kg</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Target Ideal</span>
                      <span className="font-medium text-blue-600">{selectedTruck?.targetWeightKg.toLocaleString() || 0} kg</span>
                   </div>
                   <div className="h-px bg-slate-100 my-2"></div>
                   <div className="flex justify-between items-center">
                      <span className="text-slate-800 font-semibold">Total Berat</span>
                      <span className={`text-lg font-bold ${selectedTruck && totalWeight > selectedTruck.maxWeightKg ? 'text-red-600' : 'text-slate-900'}`}>
                        {totalWeight.toLocaleString()} kg
                      </span>
                   </div>
                   {selectedTruck && totalWeight > selectedTruck.maxWeightKg && (
                     <div className="bg-red-50 text-red-600 text-xs p-2 rounded border border-red-100 text-center">
                        Overload! Kurangi muatan.
                     </div>
                   )}
                </div>

                {/* Desktop Generate Button */}
                <button
                  onClick={handleGeneratePlan}
                  disabled={!selectedTruck || cart.length === 0 || loading}
                  className="hidden lg:flex w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      <span>Menganalisa...</span>
                    </>
                  ) : (
                    <>
                      <span>Buat Rencana</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-red-700 text-sm animate-fade-in">
                  {error}
                </div>
              )}

              {/* Results */}
              {plan && <PlanResult plan={plan} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
