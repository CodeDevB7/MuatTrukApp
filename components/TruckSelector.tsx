import React from 'react';
import { TRUCKS } from '../constants';
import { TruckDef } from '../types';
import { Truck } from 'lucide-react';

interface Props {
  selectedTruck: TruckDef | null;
  onSelect: (truck: TruckDef) => void;
}

export const TruckSelector: React.FC<Props> = ({ selectedTruck, onSelect }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5 text-blue-600" />
        Pilih Tipe Truk
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TRUCKS.map((truck) => (
          <button
            key={truck.id}
            onClick={() => onSelect(truck)}
            className={`relative p-4 rounded-xl border-2 text-left transition-all ${
              selectedTruck?.id === truck.id
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800">{truck.name}</span>
              {selectedTruck?.id === truck.id && (
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
              )}
            </div>
            <div className="text-sm text-slate-600 mb-1">Max: {truck.maxWeightKg.toLocaleString()} kg</div>
            <div className="text-xs text-slate-500 italic">{truck.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
