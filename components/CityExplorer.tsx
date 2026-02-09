import React, { useState, useEffect } from 'react';
import { CityData, Landmark } from '../utils/cityData';

interface CityExplorerProps {
    cityData: CityData;
    onBack: () => void;
    characterFront: string;
    characterSide: string;
}

const CityExplorer: React.FC<CityExplorerProps> = ({ cityData, onBack, characterFront, characterSide }) => {
    const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
    const [showFortune, setShowFortune] = useState(false);

    // Character Loop
    const [charPos, setCharPos] = useState(50); // percentage 0-100
    const [isMoving, setIsMoving] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right'>('right');

    useEffect(() => {
        let animationFrameId: number;
        let movingLeft = false;
        let movingRight = false;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') movingLeft = true;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') movingRight = true;
            updateMovement();
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') movingLeft = false;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') movingRight = false;
            updateMovement();
        };

        const updateMovement = () => {
            if (movingLeft && !movingRight) {
                setIsMoving(true);
                setDirection('left');
            } else if (movingRight && !movingLeft) {
                setIsMoving(true);
                setDirection('right');
            } else {
                setIsMoving(false);
            }
        };

        const loop = () => {
            if (movingLeft && !movingRight) {
                setCharPos(prev => (prev <= 0 ? 100 : prev - 0.15));
            } else if (movingRight && !movingLeft) {
                setCharPos(prev => (prev >= 100 ? 0 : prev + 0.15));
            }
            animationFrameId = requestAnimationFrame(loop);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        loop();

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    const [fortuneText, setFortuneText] = useState('');
    const [fortuneStep, setFortuneStep] = useState<'cookie' | 'cracking' | 'paper'>('cookie');

    // Fortune handling
    const handleFortuneClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const randomFortune = cityData.fortunes[Math.floor(Math.random() * cityData.fortunes.length)];
        setFortuneText(randomFortune);
        setShowFortune(true);
        setFortuneStep('cookie'); // Start with cookie

        // Animation sequence - open directly to paper after short delay, skip cracking
        setTimeout(() => setFortuneStep('paper'), 600);
    };

    const handleCloseFortune = () => {
        setShowFortune(false);
        setFortuneStep('cookie');
    };

    return (
        <div className="fixed inset-0 z-[60] w-full h-full overflow-hidden bg-gray-900 font-['Press_Start_2P']">

            {/* Background Map */}
            <div className="absolute inset-0">
                <img
                    src={cityData.background}
                    alt={cityData.name}
                    className="w-full h-full object-cover object-center image-pixelated"
                    style={{ imageRendering: 'pixelated' }}
                />
                {/* Overlay gradient to match site vibe if image fails or for mood */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-300/20 via-slate-500/20 to-slate-700/40 pointer-events-none mix-blend-overlay" />
            </div>

            {/* Header */}
            <header className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center z-40 bg-white/90 backdrop-blur-md px-8 py-4 rounded-full border-4 border-[#708090] shadow-xl">
                <h1 className="text-[#2c3e50] text-lg md:text-xl mb-1 drop-shadow-sm">{cityData.name}</h1>
                <p className="text-[#708090] text-sm md:text-base font-['VT323'] tracking-wider">{cityData.subtitle}</p>
            </header>

            {/* Back Button */}
            <button
                onClick={onBack}
                className="absolute top-6 left-6 z-50 bg-[#c41e3a] text-white p-3 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform hover:bg-[#a01830]"
                title="Return to Assessment"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            {/* Landmarks */}
            {cityData.landmarks.map((landmark) => (
                <div
                    key={landmark.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 transition-transform duration-300 hover:scale-125 hover:z-30"
                    style={{ top: landmark.top, left: landmark.left }}
                    onClick={(e) => { e.stopPropagation(); setSelectedLandmark(landmark); }}
                >
                    {/* Icon Container with Float Animation */}
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-[3px] shadow-lg animate-[bounce_3s_infinite]
            ${landmark.type === 'landmark' ? 'bg-gradient-to-br from-white to-blue-100 border-[#4a6fa5]' :
                            landmark.type === 'decoration' ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-[#ff8c00]' :
                                'bg-gradient-to-br from-gray-100 to-gray-300 border-[#2c3e50]'}`}
                    >
                        <span className="text-xl md:text-3xl filter drop-shadow-md">{landmark.icon}</span>
                    </div>

                    {/* Tooltip Label */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#2c3e50] text-[#f5f5f0] text-[10px] px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/20">
                        {landmark.name}
                    </div>
                </div>
            ))}

            {/* Character */}
            <div
                className="absolute z-50"
                style={{
                    left: `${charPos}%`,
                    bottom: '10%',
                    transform: `translateX(-50%) ${direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
                    height: '20vh', // Changed to viewport height for consistency
                    width: 'auto'
                }}
            >
                <img
                    src={isMoving ? characterSide : characterFront}
                    alt="Character"
                    className="h-full w-auto drop-shadow-lg"
                    style={{ imageRendering: 'pixelated' }}
                />
            </div>

            {/* Fortune Cookie Trigger (Bottom Area) */}
            <div
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer group z-20 hover:scale-110 transition-transform"
                onClick={handleFortuneClick}
            >
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center border-4 border-[#ff8c00] shadow-xl animate-pulse">
                    <span className="text-2xl">🥠</span>
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#ff8c00] text-white text-[10px] px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    Get Fortune
                </div>
            </div>


            {/* --- MODALS --- */}

            {/* Landmark Info Modal */}
            {selectedLandmark && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2c3e50]/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedLandmark(null)}>
                    <div
                        className="bg-gradient-to-b from-[#f5f5f0] to-white p-8 rounded-2xl max-w-sm w-[90%] text-center shadow-2xl border-4 border-[#4a6fa5] transform scale-100 animate-in zoom-in-95 duration-300 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedLandmark(null)}
                            className="absolute top-4 right-4 w-8 h-8 bg-[#c41e3a] text-white rounded-full hover:bg-[#2c3e50] transition-colors flex items-center justify-center"
                        >
                            &times;
                        </button>
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-gray-200 rounded-full flex items-center justify-center text-4xl border-2 border-[#4a6fa5]">
                            {selectedLandmark.icon}
                        </div>
                        <h2 className="text-[#2c3e50] text-sm mb-4 leading-relaxed font-bold border-b border-[#4a6fa5]/20 pb-2">
                            {selectedLandmark.name}
                        </h2>
                        <p className="text-[#2c3e50] font-['VT323'] text-xl leading-relaxed">
                            {selectedLandmark.description}
                        </p>
                    </div>
                </div>
            )}

            {/* Fortune Modal */}
            {showFortune && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2c3e50]/90 backdrop-blur-md animate-in fade-in duration-300" onClick={handleCloseFortune}>
                    <div
                        className="bg-[#fffef0] p-10 rounded-3xl max-w-sm w-[90%] text-center shadow-2xl border-[6px] border-[#ff8c00] relative overflow-hidden flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleCloseFortune}
                            className="absolute top-4 right-4 w-8 h-8 bg-[#ff8c00] text-white rounded-full hover:bg-[#e67700] transition-colors flex items-center justify-center z-10"
                        >
                            &times;
                        </button>

                        {/* Cookie Animation Stage - Use min-height instead of fixed height */}
                        <div className="min-h-[128px] w-full flex items-center justify-center mb-4 perspective-1000">
                            {fortuneStep === 'cookie' && (
                                <div className="text-[80px] animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]">🥠</div>
                            )}
                            {/* Removed cracking step */}
                            {fortuneStep === 'paper' && (
                                <div className="w-full bg-white p-6 border-2 border-dashed border-[#d4a300] shadow-md transform animate-[slideInUp_0.5s_ease-out]">
                                    <p className="text-[#2c3e50] font-['VT323'] text-2xl italic leading-relaxed">
                                        "{fortuneText}"
                                    </p>
                                </div>
                            )}
                        </div>

                        {fortuneStep === 'paper' && (
                            <p className="text-[#ff8c00] text-[10px] uppercase tracking-widest mt-4 font-bold shrink-0">
                                Wisdom from the City
                            </p>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default CityExplorer;
