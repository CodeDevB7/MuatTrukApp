import React, { useState } from 'react';
import { LoadingPlanResponse } from '../types';
import { CheckCircle, AlertTriangle, AlertOctagon, ArrowDown, Layers, Box, Cuboid } from 'lucide-react';
import { TruckVisualizer } from './TruckVisualizer';

interface Props {
  plan: LoadingPlanResponse;
}

export const PlanResult: React.FC<Props> = ({ plan }) => {
  const [activeTab, setActiveTab] = useState<'list' | '3d'>('list');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SAFE': return 'bg-green-100 text-green-800 border-green-200';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'OVERLOAD': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SAFE': return <CheckCircle className="w-5 h-5" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5" />;
      case 'OVERLOAD': return <AlertOctagon className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Status */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${getStatusColor(plan.weightStatus)}`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{getStatusIcon(plan.weightStatus)}</div>
          <div>
            <h3 className="font-bold text-lg">Status: {plan.weightStatus}</h3>
            <p className="text-sm mt-1 font-medium opacity-90">
              {plan.summary}
            </p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs uppercase tracking-wide opacity-70">Total Berat</div>
          <div className="font-bold text-lg">{plan.totalWeightCalculated.toLocaleString()} kg</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('list')}
          className={`pb-2 px-4 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'list' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          Detail Susunan
        </button>
        <button
          onClick={() => setActiveTab('3d')}
          className={`pb-2 px-4 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === '3d' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Cuboid className="w-4 h-4" />
          Visualisasi 3D
        </button>
      </div>

      {/* Content */}
      {activeTab === '3d' ? (
        <TruckVisualizer tierGroups={plan.tierGroups} truckName={plan.planName} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                Susunan Tier
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Total estimasi panjang muatan: <span className="font-bold text-slate-700">{plan.totalTiersUsed} Tier</span>
              </p>
            </div>
            <div className="text-xs font-mono bg-slate-200 text-slate-600 px-2 py-1 rounded">
              DEPAN (Kabin)
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {plan.tierGroups.map((group, index) => (
              <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  
                  {/* Left: Tier Info */}
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 flex-shrink-0">
                      <span className="text-2xl font-bold leading-none">{group.tierCount}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Tier</span>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{group.itemDescription}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                        <Box className="w-4 h-4" />
                        <span className="font-mono font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                          {group.configuration}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1 border-l pl-2">
                           {group.tierWidth} Lebar x {group.tierHeight} Tinggi
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        ({group.tierCount} tier x {group.quantityPerTier} unit)
                      </div>
                    </div>
                  </div>

                  {/* Right: Totals & Notes */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 mt-2 sm:mt-0 pl-20 sm:pl-0">
                     <div className="text-right">
                        <span className="block text-xs text-slate-400 uppercase">Total Group</span>
                        <span className="font-bold text-xl text-slate-800">{group.totalItemsInGroup} <span className="text-sm font-normal text-slate-500">unit</span></span>
                     </div>
                     {group.notes && (
                       <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100 mt-1">
                         {group.notes}
                       </span>
                     )}
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Footer Marker */}
          <div className="bg-slate-50 p-3 border-t border-slate-200 flex justify-center items-center gap-2 text-slate-400 text-sm font-medium">
            <ArrowDown className="w-4 h-4" />
            <span>BELAKANG (Pintu Truk)</span>
          </div>
        </div>
      )}
    </div>
  );
};