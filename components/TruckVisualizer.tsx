import React from 'react';
import { TierGroup } from '../types';
import { ITEMS } from '../constants';

interface Props {
  tierGroups: TierGroup[];
  truckName: string;
}

export const TruckVisualizer: React.FC<Props> = ({ tierGroups, truckName }) => {
  // Helper to get color for a description
  const getColorForGroup = (desc: string) => {
    const lowerDesc = desc.toLowerCase();
    const matchedItem = ITEMS.find(item => lowerDesc.includes(item.name.toLowerCase()) || 
                                           (item.id.includes('karung') && lowerDesc.includes('karung')) ||
                                           (item.category === 'Box' && lowerDesc.includes('dus')));
    return matchedItem ? matchedItem.color : '#cbd5e1'; // Default slate-300
  };

  // Calculate total depth to center the visual
  const totalDepth = tierGroups.reduce((acc, g) => acc + g.tierCount, 0);
  
  // Scale factors for visualization
  const SCALE_X = 14; // Width unit
  const SCALE_Y = 14; // Height unit
  const SCALE_Z = 25; // Depth unit (Tier thickness)

  return (
    <div className="w-full overflow-hidden bg-slate-900 rounded-xl p-6 relative min-h-[400px] flex flex-col items-center justify-center shadow-inner">
        
        {/* Legend / Info Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm p-3 rounded-lg border border-white/10 text-white text-xs">
            <h4 className="font-bold text-blue-300 mb-1 uppercase tracking-wider">3D View (Isometrik)</h4>
            <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-white/20 rounded-sm"></div>
                <span>Depan (Kabin)</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white/80 rounded-sm"></div>
                <span>Belakang (Pintu)</span>
            </div>
        </div>

        {/* 3D Scene Container */}
        <div 
          className="relative transition-transform duration-500 ease-out"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
            marginTop: '20px'
          }}
        >
            {/* Rotated World */}
            <div 
                className="relative"
                style={{
                    transform: 'rotateX(60deg) rotateZ(-45deg) rotateY(0deg)',
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Truck Floor/Bed */}
                <div 
                    className="absolute bg-slate-800 border-2 border-slate-700"
                    style={{
                        width: '220px', // Fixed visual width for truck bed
                        height: `${Math.max(totalDepth * SCALE_Z, 300)}px`, // Dynamic length based on tiers
                        transform: 'translate3d(-50%, -50%, 0)',
                        left: '50%',
                        top: '50%',
                        boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                    }}
                >
                    {/* Floor Grid Lines */}
                    <div className="w-full h-full opacity-20" 
                         style={{
                            backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                         }}
                    />
                    
                    {/* Front Marker (Kabin) - Far end in this rotation? 
                        In standard CSS X/Y plane rotated:
                        Top of div is "far", Bottom of div is "near".
                    */}
                    <div className="absolute top-0 left-0 w-full bg-slate-700 h-2 -mt-2 text-[8px] text-center text-white/50 uppercase tracking-widest">
                        Kabin Truk
                    </div>
                </div>

                {/* Render Groups */}
                {tierGroups.map((group, index) => {
                    // Calculate Z-position (visual Y in this plane)
                    // We stack from Top (Kabin) to Bottom (Pintu)
                    let previousDepth = 0;
                    for(let i=0; i<index; i++) {
                        previousDepth += tierGroups[i].tierCount;
                    }
                    
                    const groupDepthPx = group.tierCount * SCALE_Z;
                    const groupWidthPx = group.tierWidth * SCALE_X; 
                    const groupHeightPx = group.tierHeight * SCALE_Y;
                    
                    const color = getColorForGroup(group.itemDescription);
                    const startY = -((totalDepth * SCALE_Z) / 2) + (previousDepth * SCALE_Z); // Centering logic offset

                    // We create a 3D box for the group
                    return (
                        <div
                            key={index}
                            className="absolute group cursor-pointer"
                            style={{
                                width: `${groupWidthPx}px`,
                                height: `${groupDepthPx}px`,
                                left: '50%',
                                top: '50%',
                                transformStyle: 'preserve-3d',
                                // Translate logic:
                                // X: Center horizontally (-50% of width)
                                // Y: Position along truck length (startY)
                                // Z: Lift it up so it sits on floor (Z is height in this rotation context? No. 
                                //    Wait, in rotateX(60deg), visual Z is Up. CSS Z is perpendicular to plane.
                                //    So translateZ(height/2) puts it ON the floor if floor is Z=0.
                                transform: `
                                    translateX(-50%) 
                                    translateY(${startY}px) 
                                    translateZ(${groupHeightPx / 2}px)
                                `
                            }}
                        >
                            {/* TOOLTIP */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50"
                                 style={{ transform: 'rotateZ(45deg) rotateX(-60deg) translateY(-20px)' }} // Counter-rotate tooltip
                            >
                                <b>{group.itemDescription}</b><br/>
                                {group.tierCount} Tier x {group.quantityPerTier}
                            </div>

                            {/* CUBE FACES */}
                            {/* Top Face (Visual Top) */}
                            <div 
                                className="absolute w-full h-full flex items-center justify-center text-[10px] font-bold text-black/30 border border-black/10"
                                style={{
                                    backgroundColor: color,
                                    filter: 'brightness(1.1)',
                                    transform: `translateZ(${groupHeightPx / 2}px)`,
                                }}
                            >
                                {group.tierWidth}x{group.tierCount}
                            </div>

                            {/* Front Face (Visual Side facing viewer-ish) */}
                            <div 
                                className="absolute w-full border border-black/10"
                                style={{
                                    height: `${groupHeightPx}px`,
                                    backgroundColor: color,
                                    filter: 'brightness(0.9)',
                                    transform: `rotateX(-90deg) translateZ(${groupDepthPx / 2}px)`,
                                    bottom: 0,
                                }}
                            />
                             {/* Back Face (Visual Kabin Side) */}
                             <div 
                                className="absolute w-full border border-black/10"
                                style={{
                                    height: `${groupHeightPx}px`,
                                    backgroundColor: color,
                                    filter: 'brightness(0.7)',
                                    transform: `rotateX(-90deg) translateZ(-${groupDepthPx / 2}px)`,
                                    top: 0,
                                }}
                            />

                            {/* Right Face */}
                            <div 
                                className="absolute h-full border border-black/10 flex items-end justify-center pb-1 text-[8px] text-black/40"
                                style={{
                                    width: `${groupHeightPx}px`, // Swapped dimensions due to rotation
                                    backgroundColor: color,
                                    filter: 'brightness(0.8)',
                                    transform: `rotateY(90deg) translateZ(${groupWidthPx / 2}px)`,
                                    right: 0,
                                }}
                            >
                                {group.tierHeight} High
                            </div>
                            
                             {/* Left Face */}
                             <div 
                                className="absolute h-full border border-black/10"
                                style={{
                                    width: `${groupHeightPx}px`,
                                    backgroundColor: color,
                                    filter: 'brightness(0.8)',
                                    transform: `rotateY(-90deg) translateZ(${groupWidthPx / 2}px)`,
                                    left: 0,
                                }}
                            />

                            {/* Wireframe Grid on Top Face to simulate items */}
                            <div 
                                className="absolute w-full h-full pointer-events-none"
                                style={{
                                    transform: `translateZ(${groupHeightPx / 2}px)`,
                                    backgroundImage: `
                                        linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                                    `,
                                    backgroundSize: `${100/group.tierWidth}% ${100/group.tierCount}%`
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
        <div className="mt-4 text-slate-400 text-xs text-center max-w-md">
             Visualisasi ini adalah ilustrasi kasar. Posisi dan dimensi "Tier" (blok) direpresentasikan sesuai data hitungan. Warna berbeda menandakan jenis barang.
        </div>
    </div>
  );
};