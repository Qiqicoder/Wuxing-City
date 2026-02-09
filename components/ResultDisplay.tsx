import React from 'react';
import RadarChart from './RadarChart';
import { determineArchetype, ElementScores, ARCHETYPE_ASSETS } from '../utils/elements';

interface PersonalityResult {
  opening: string;
  birthImagery: string;
  soulCity: string;
  complementarySouls: string;
  talismans: {
    color: string;
    item: string;
    mantra: string;
  };
  ps: string;
  element: string;
  color: string;
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
  const assets = archetype ? ARCHETYPE_ASSETS[archetype.name] : null;
  const characterSrc = assets?.front;

  // Error state
  if (error || !result) {
    return (
      <div className="text-center space-y-4 max-w-md mx-auto bg-[#1a1a2e]/60 backdrop-blur-md border-[3px] border-[#ff6b6b]/40 p-8 rounded-lg animate-elegant-fade font-['Inter']">
        <p className="text-[#ff6b6b] text-[12px] tracking-widest uppercase font-medium">
          {error || "The cosmic resonance was lost."}
        </p>
        <button
          onClick={onReset}
          className="w-full mt-4 h-[50px] border-2 border-[#4ecdc4] text-[#4ecdc4] text-[11px] tracking-widest hover:bg-[#4ecdc4]/10 transition-colors uppercase font-bold font-['Press_Start_2P']"
        >
          Return to Start
        </button>
      </div>
    );
  }

  // Unified Section Header Style
  const sectionHeaderClass = "text-[#8B9CFF] text-[13px] uppercase tracking-[0.25em] font-bold border-b border-white/10 pb-2 mb-3 inline-block";

  return (
    <div className="w-full min-h-screen py-6 px-4 flex flex-col items-center animate-elegant-fade font-['Inter'] text-[#E6EAF2]">

      {/* Custom Animations */}
      <style>{`
        @keyframes float-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-idle {
          animation: float-idle 4s ease-in-out infinite;
        }
      `}</style>

      {/* Background Glow */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${result.color} 0%, transparent 60%)`
        }}
      />

      {/* --- HEADER SECTION --- */}
      <div className="text-center mb-6 relative z-10 w-full max-w-3xl mx-auto space-y-2">
        <p className="text-[#AEB6C4] text-[11px] tracking-[0.3em] uppercase font-medium opacity-80">
          The cosmos has spoken.
        </p>

        <h1 className="text-[26px] md:text-[36px] text-white mb-1 font-['Press_Start_2P'] leading-tight tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          {archetype?.name || result.element}
        </h1>
      </div>


      {/* --- CENTERPIECE: Character & Essence --- */}
      <div className="relative z-10 mb-10 flex flex-col items-center w-full">
        {characterSrc && (
          <div className="relative group cursor-pointer mb-5">
            {/* Soft Gradient Glow Behind - Reduced size */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full opacity-30 filter blur-[60px]"
              style={{ backgroundColor: result.color }}
            />

            {/* Character Image - Further Reduced size */}
            <img
              src={characterSrc}
              alt={archetype?.name}
              className="relative z-10 w-48 h-48 md:w-[240px] md:h-[240px] object-contain 
                         animate-float-idle transition-transform duration-500 ease-out 
                         group-hover:scale-105"
            />
          </div>
        )}

        {/* Essence / Opening */}
        <div className="text-center max-w-lg px-4 space-y-2">
          <h2 className="text-[15px] md:text-[17px] uppercase tracking-[0.15em] font-medium text-[#E6EAF2]">
            {result.opening.split('.')[0]}. {result.opening.split('.')[1]}. You.
          </h2>
          <p className="text-[#AEB6C4] text-[13px] md:text-[14px] italic font-light leading-relaxed">
            "{result.opening.split('.').slice(2).join('.').replace(" You.", "").trim()}"
          </p>
        </div>
      </div>


      {/* --- SPLIT CONTENT GRID --- */}
      {/* Tightened Layout: max-w-5xl, gap reduced further */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 px-4 md:px-8 relative z-10 items-start mb-12">

        {/* LEFT COLUMN: Narrative */}
        <div className="space-y-8 text-left">

          {/* Birth Imagery */}
          <div className="space-y-2">
            <h3 className={sectionHeaderClass}>
              Origin Story
            </h3>
            <p className="text-[#E6EAF2] text-[14px] md:text-[15px] leading-[1.6] font-light">
              {result.birthImagery}
            </p>
          </div>

          {/* Soul City */}
          <div className="space-y-2">
            <h3 className={sectionHeaderClass}>
              Soul City
            </h3>
            <div className="flex flex-col gap-2">
              <span className="text-[20px] font-['Press_Start_2P'] text-white">
                {result.soulCity.split(/[-—,]/)[0]}
              </span>
              <p className="text-[#E6EAF2] text-[14px] md:text-[15px] leading-[1.6] font-light">
                {result.soulCity.substring(result.soulCity.indexOf(result.soulCity.split(/[-—,]/)[0]) + result.soulCity.split(/[-—,]/)[0].length).replace(/^[-—,]\s*/, '')}
              </p>
            </div>
          </div>

        </div>


        {/* RIGHT COLUMN: Data & Artifacts */}
        <div className="flex flex-col items-center md:items-end space-y-8">

          {/* Radar Chart */}
          <div className="w-full flex flex-col items-center md:items-end">
            <div className="w-full text-center md:text-right">
              <h3 className={sectionHeaderClass}>
                Archetype Field
              </h3>
            </div>

            {scores && (
              <div className="relative p-2 md:p-0">
                <RadarChart scores={scores} size={250} />
              </div>
            )}
          </div>

          {/* Talismans List */}
          <div className="w-full flex flex-col items-center md:items-end space-y-2">
            <div className="w-full text-center md:text-right">
              <h3 className={sectionHeaderClass}>
                Talismans
              </h3>
            </div>

            <ul className="space-y-3 w-full text-center md:text-right">

              {/* Color */}
              <li className="flex flex-col md:flex-row items-center md:justify-end gap-2 md:gap-4 group">
                <span className="text-[#AEB6C4] text-[12px] uppercase tracking-wider opacity-60 font-medium whitespace-nowrap">
                  Aura
                </span>
                <span className="text-[#E6EAF2] text-[14px] font-medium whitespace-nowrap" style={{ color: result.talismans.color === 'string' ? result.color : result.talismans.color }}>
                  {result.talismans.color}
                </span>
              </li>

              {/* Item */}
              <li className="flex flex-col md:flex-row items-center md:justify-end gap-2 md:gap-4 group">
                <span className="text-[#AEB6C4] text-[12px] uppercase tracking-wider opacity-60 font-medium whitespace-nowrap">
                  Artifact
                </span>
                <span className="text-[#E6EAF2] text-[14px] font-medium whitespace-nowrap">
                  {result.talismans.item}
                </span>
              </li>

              {/* Mantra */}
              <li className="flex flex-col md:flex-row items-center md:justify-end gap-2 md:gap-4 group">
                <span className="text-[#AEB6C4] text-[12px] uppercase tracking-wider opacity-60 font-medium whitespace-nowrap">
                  Mantra
                </span>
                <span className="text-[#E6EAF2] text-[14px]  font-medium whitespace-nowrap">
                  "{result.talismans.mantra}"
                </span>
              </li>

            </ul>
          </div>

        </div>
      </div>

      {/* --- FOOTER SECTION: Guidance & Reset --- */}
      <div className="w-full max-w-4xl mx-auto text-center space-y-8 relative z-10 pb-6">

        {/* P.S. (Artistic Guidance) */}
        <div className="relative px-8 py-2">
          <p className="text-[#8B9CFF] text-[16px] md:text-[20px] italic font-serif leading-relaxed opacity-90 drop-shadow-[0_0_8px_rgba(139,156,255,0.3)]">
            "{result.ps}"
          </p>
        </div>

        {/* Reset Button */}
        <div>
          <button
            onClick={onReset}
            className="px-8 py-3 bg-transparent border border-white/20 text-[#E6EAF2] text-[10px] 
                       hover:bg-white/5 hover:border-[#8B9CFF] hover:text-[#8B9CFF] hover:scale-105
                       transition-all duration-300 tracking-[0.3em] uppercase font-bold active:scale-95 font-['Press_Start_2P']"
          >
            Re-Calibrate
          </button>
        </div>
      </div>

    </div>
  );
};

export default ResultDisplay;
