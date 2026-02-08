
import React from 'react';
import RadarChart from './RadarChart';
import { determineArchetype, ElementScores } from '../utils/elements';

interface PersonalityResult {
  element: string;
  color: string;
  description: string;
  vibe: string;
}

interface ResultDisplayProps {
  name: string;
  birthdate: string;
  result: PersonalityResult | null;
  scores: ElementScores | null;
  error: string | null;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  name, 
  result, 
  scores, 
  error, 
  onReset 
}) => {
  // Get archetype if scores exist
  const archetype = scores ? determineArchetype(scores) : null;

  // Error state
  if (error || !result) {
    return (
      <div className="text-center space-y-4 max-w-md mx-auto bg-[#1a1a2e]/60 backdrop-blur-md border-[3px] border-[#ff6b6b]/40 p-8 rounded-lg animate-elegant-fade">
        <p className="text-[#ff6b6b] text-[12px] tracking-widest uppercase">
          {error || "The cosmic resonance was lost."}
        </p>
        <button 
          onClick={onReset}
          className="w-full mt-4 h-[50px] border-2 border-[#4ecdc4] text-[#4ecdc4] text-[11px] tracking-widest hover:bg-[#4ecdc4]/10 transition-colors uppercase font-bold"
        >
          Return to Start
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] w-full mx-auto bg-[#1a1a2e]/60 backdrop-blur-md border-[3px] border-white/20 rounded-lg p-6 md:p-10 animate-elegant-fade relative overflow-hidden">
      {/* Subtle background glow based on element color */}
      <div 
        className="absolute -top-32 -right-32 w-80 h-80 blur-[120px] opacity-10 rounded-full pointer-events-none" 
        style={{ backgroundColor: result.color }}
      />
      
      {/* Header Section */}
      <div className="text-center mb-8 relative z-10">
        <p className="text-[#ffd93d] text-[10px] tracking-[4px] uppercase mb-3 opacity-80">
          Subject: {name.toUpperCase()}
        </p>
        <h2 className="text-[28px] md:text-[40px] font-bold text-[#a78bfa] tracking-[3px] leading-tight">
          {archetype?.name || result.element.toUpperCase()}
        </h2>
      </div>

      {/* Elegant Divider */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10" />

      {/* Main Content: Side-by-Side Flex Layout */}
      <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-10 relative z-10">
        
        {/* Left column: Radar Chart (Fixed size on desktop) */}
        {scores && (
          <div className="flex-shrink-0 w-full md:w-[280px] flex justify-center">
            <RadarChart scores={scores} size={280} />
          </div>
        )}

        {/* Right column: Description Text (Flexible) */}
        <div className="flex-1 space-y-6 pt-2">
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#a78bfa]/60 to-transparent hidden md:block" />
            <p className="text-[#f7f7f7] text-[15px] md:text-[16px] leading-relaxed italic opacity-90 px-2">
              "{result.description}"
            </p>
          </div>
          
          <div className="pt-4 space-y-4">
             <div className="flex items-center gap-4">
                <div className="h-[1px] bg-white/10 flex-1" />
                <span className="text-white/30 text-[9px] tracking-[3px] uppercase">Celestial Reading</span>
                <div className="h-[1px] bg-white/10 flex-1" />
             </div>
             <p className="text-[#c0c0c0] text-[12px] tracking-[1px] leading-relaxed opacity-70">
               Your alignment with the {archetype?.primaryElement} and {archetype?.secondaryElement} 
               forces reveals a unique cosmic frequency.
             </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Vibe Status and Reset */}
      <div className="space-y-8 relative z-10">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-sm">
            <span className="text-white/40 text-[9px] tracking-[4px] uppercase whitespace-nowrap">
              Vibe Status
            </span>
            <span className="text-[#a78bfa] text-[16px] tracking-[4px] uppercase font-bold">
              {result.vibe || "RADIANT"}
            </span>
          </div>

          <button
            onClick={onReset}
            className="w-full h-[54px] mt-2 bg-white/5 border-[2px] border-white/20 text-white text-[12px] hover:bg-white/10 transition-all tracking-[4px] uppercase font-bold active:scale-[0.98]"
          >
            RE-CALIBRATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
