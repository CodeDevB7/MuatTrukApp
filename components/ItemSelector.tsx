import React, { useState, useMemo } from 'react';
import { ITEMS } from '../constants';
import { CartItem, ItemDef } from '../types';
import { Plus, Minus, Search, Package } from 'lucide-react';

interface Props {
  onAddToCart: (item: ItemDef, qty: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  cart: CartItem[];
}

export const ItemSelector: React.FC<Props> = ({ onAddToCart, onRemoveFromCart, cart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const filteredItems = useMemo(() => {
    return ITEMS.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter]);

  const getCartQuantity = (itemId: string) => {
    return cart.find((c) => c.id === itemId)?.quantity || 0;
  };

  const categories = ['All', ...Array.from(new Set(ITEMS.map((i) => i.category)))];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-blue-600" />
        Pilih Barang
      </h3>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari nama barang..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'Semua' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredItems.map((item) => {
          const qty = getCartQuantity(item.id);
          return (
            <div
              key={item.id}
              className={`p-3 rounded-lg border transition-all ${
                qty > 0 ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-slate-900 text-sm leading-tight">{item.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.weightKg} kg</p>
                </div>
                {qty > 0 && (
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    {qty * item.weightKg} kg
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-2">
                 <div className="text-[10px] text-slate-400 italic truncate max-w-[50%]">
                    {item.category}
                 </div>
                <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm">
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="p-1.5 hover:bg-slate-100 text-slate-600 disabled:opacity-30"
                    disabled={qty === 0}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-slate-700">
                    {qty}
                  </span>
                  <button
                    onClick={() => onAddToCart(item, 1)}
                    className="p-1.5 hover:bg-slate-100 text-blue-600"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filteredItems.length === 0 && (
        <p className="text-center text-slate-500 py-8 text-sm">Barang tidak ditemukan.</p>
      )}
    </div>
  );
};
