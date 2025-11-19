import React from 'react';
import { LoadingPlanResponse } from '../types';
import { AlertTriangle, CheckCircle, AlertOctagon, ArrowDown, Box } from 'lucide-react';

interface Props {
  plan: LoadingPlanResponse;
}

export const PlanResult: React.FC<Props> = ({ plan }) => {
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
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${getStatusColor(plan.weightStatus)}`}>
        <div className="mt-0.5">{getStatusIcon(plan.weightStatus)}</div>
        <div>
          <h3 className="font-bold text-lg">Status: {plan.weightStatus}</h3>
          <p className="text-sm mt-1">
            Total Berat: <span className="font-bold">{plan.totalWeightCalculated.toLocaleString()} kg</span>
          </p>
        </div>
      </div>

      {/* General Advice */}
      {plan.generalAdvice.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-2 text-sm uppercase tracking-wide">Saran Penting</h4>
          <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
            {plan.generalAdvice.map((advice, idx) => (
              <li key={idx}>{advice}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeline Steps */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Box className="w-5 h-5 text-slate-600" />
            Rencana Susunan Muat
          </h3>
          <p className="text-xs text-slate-500 mt-1">Urutan dari Depan (Kabin) mundur ke Belakang (Pintu)</p>
        </div>

        <div className="p-0">
          {plan.steps.map((step, index) => (
            <div key={index} className="relative flex group">
               {/* Timeline Connector */}
              <div className="w-12 flex-shrink-0 flex flex-col items-center">
                <div className="h-full w-px bg-slate-200 group-last:h-8 mt-8"></div>
                <div className="absolute top-6 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold z-10 shadow-sm border-2 border-white">
                  {step.stepNumber}
                </div>
              </div>

              <div className="flex-grow py-6 pr-6 pl-2 border-b border-slate-100 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800">{step.location}</h4>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mb-3">
                  <p className="text-sm text-slate-700 font-medium">{step.instruction}</p>
                </div>

                <div className="space-y-2">
                  {step.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">
                        <span className="font-semibold text-slate-800">{item.quantity}x</span> {item.itemName}
                      </span>
                      {item.note && <span className="text-xs text-amber-600 italic">{item.note}</span>}
                    </div>
                  ))}
                </div>

                {step.warnings && step.warnings.length > 0 && (
                   <div className="mt-3 space-y-1">
                     {step.warnings.map((w, i) => (
                       <p key={i} className="text-xs text-red-600 flex items-center gap-1">
                         <AlertTriangle className="w-3 h-3" /> {w}
                       </p>
                     ))}
                   </div>
                )}
              </div>
            </div>
          ))}
          
           {/* End Marker */}
           <div className="flex items-center gap-3 p-6 text-slate-400">
              <div className="w-6 flex justify-center">
                <ArrowDown className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Pintu Belakang Truk</span>
           </div>
        </div>
      </div>
    </div>
  );
};
