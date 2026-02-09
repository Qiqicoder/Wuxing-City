
import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import Starfield from './components/Starfield';
import LoadingScreen from './components/LoadingScreen';
import CityExplorer from './components/CityExplorer';
import { CityData } from './utils/cityData';
import { GoogleGenAI, Type } from "@google/genai";
import { calculateElements, getBirthSeason, determineArchetype, ElementScores, Archetype, ARCHETYPE_ASSETS } from './utils/elements';


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
  element: string; // Keep for backward compatibility with display logic if needed, but mainly derive from archetype
  color: string;   // Keep for background glow
}

const App: React.FC = () => {
  const [userData, setUserData] = useState<{ birthdate: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [apiResult, setApiResult] = useState<PersonalityResult | null>(null);
  const [elementScores, setElementScores] = useState<ElementScores | null>(null);
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [exploringCity, setExploringCity] = useState<CityData | null>(null);

  const fetchElementalProfile = async (name: string, birthdate: string, scores: ElementScores, arch: Archetype): Promise<PersonalityResult> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const month = parseInt(birthdate.split('/')[0]);
    const season = getBirthSeason(month);

    const prompt = `You are a Five Elements personality analyst. Generate a poetic character profile in JSON format.

    INPUT:
    - Name: ${name}
    - Primary: ${arch.primaryElement} (${scores[arch.primaryElement as keyof ElementScores]}pts)
    - Secondary: ${arch.secondaryElement} (${scores[arch.secondaryElement as keyof ElementScores]}pts)
    - Archetype: ${arch.name}
    - Season: ${season}

    ELEMENT MEANINGS:
    Fire=Passion, Water=Intuition, Wood=Growth, Earth=Stability, Metal=Precision

    OUTPUT STRUCTURE (120-150 words total):

    1. opening (15-20w): "[Element]. [Element]. You." + poetic metaphor
      Ex: "You're moonlight on a silver lake—fluid, sharp, impossible to hold."

    2. birthImagery (20-25w): Connect ${season} to primary element poetically

    3. soulCity (30-35w): Pick ONE city: London/NYC/SF/Tokyo. 2-3 sentences why it matches user's energy.
      Ex: "Tokyo—where neon meets ancient temples. A city that rebuilt itself a thousand times..."

    4. complementarySouls (25-30w): "You're drawn to [Element] souls who [trait]..."
      Focus on weaker elements: ${Object.entries(scores).sort((a, b) => a[1] - b[1]).slice(0, 2).map(e => e[0]).join(', ')}

    5. talismans:
      - color: Poetic name for ${arch.primaryElement}
      - item: 3-5 words
      - mantra: 5-7 words

    6. ps (15-20w): "Feeling [emotion]? [Action]. Your [metaphor]."

    RULES:
    - Use nature metaphors, punchy sentences
    - Be descriptive, not judgmental
    - Mysterious but approachable tone

    Return ONLY this JSON:
    {
      "opening": "",
      "birthImagery": "",
      "soulCity": "",
      "complementarySouls": "",
      "talismans": {"color": "", "item": "", "mantra": ""},
      "ps": "",
      "element": "${arch.name}",
      "color": "hex code for ${arch.primaryElement}"
    }`;

    /* 
       Retry logic for API calls to handle 429 Rate Limits 
       Exponential backoff: 1s, 2s, 4s
    */
    const makeApiCall = async (retryCount = 0): Promise<any> => {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                opening: { type: Type.STRING },
                birthImagery: { type: Type.STRING },
                soulCity: { type: Type.STRING },
                complementarySouls: { type: Type.STRING },
                talismans: {
                  type: Type.OBJECT,
                  properties: {
                    color: { type: Type.STRING },
                    item: { type: Type.STRING },
                    mantra: { type: Type.STRING }
                  },
                  required: ["color", "item", "mantra"]
                },
                ps: { type: Type.STRING },
                element: { type: Type.STRING },
                color: { type: Type.STRING, description: "Hex color code" }
              },
              required: ["opening", "birthImagery", "soulCity", "complementarySouls", "talismans", "ps", "element", "color"]
            }
          }
        });
        return JSON.parse(response.text);
      } catch (error: any) {
        // Check for 429 (Rate Limit) or 503 (Overloaded)
        if ((error.status === 429 || error.status === 503 || error.message?.includes('429')) && retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000; // 1000, 2000, 4000
          console.log(`⚠️ API Rate limit hit. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/3)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return makeApiCall(retryCount + 1);
        }
        throw error;
      }
    };

    return await makeApiCall();
  };

  const handleFormSubmit = async (birthdate: string, name: string) => {
    // Store user data
    setUserData({ birthdate, name });
    setIsLoading(true);
    setApiError(null);
    setApiResult(null);

    // === NEW: Calculate element scores BEFORE starting async operations ===
    const scores = calculateElements(birthdate, name);
    const arch = determineArchetype(scores);
    const month = parseInt(birthdate.split('/')[0]);
    const season = getBirthSeason(month);

    // Store scores in state
    setElementScores(scores);
    setArchetype(arch);

    // Log for debugging
    console.log('📊 Calculated Element Scores:', scores);
    console.log('🌸 Birth Season:', season);
    // === END NEW CODE ===

    // 2. Start BOTH actions in parallel
    const loadingTimer = new Promise(resolve => setTimeout(resolve, 4000));
    const apiCall = fetchElementalProfile(name, birthdate, scores, arch);

    try {
      // 3. Wait for BOTH to complete
      const [_, result] = await Promise.all([loadingTimer, apiCall]);
      setApiResult(result);
    } catch (err) {
      console.error("API Error:", err);
      setApiError("The stars are cloudy. Try again later.");
    } finally {
      // 4. Transition to Result Step
      setIsLoading(false);
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setUserData(null);
    setIsLoading(false);
    setShowResult(false);
    setApiResult(null);
    setApiError(null);
    setElementScores(null); // Reset scores
    setArchetype(null);
    setExploringCity(null);
    setResetKey(prev => prev + 1);
  };

  // Audio ref
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Try to autoplay on mount, and if failed, wait for first user interaction
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;

    const attemptPlay = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          // Remove listener once successful
          document.removeEventListener('click', attemptPlay);
        })
        .catch(error => {
          console.log("Autoplay prevented:", error);
          setIsPlaying(false);
        });
    };

    // Try immediately
    attemptPlay();

    // Add listener for first interaction if immediate play fails
    document.addEventListener('click', attemptPlay);

    return () => {
      document.removeEventListener('click', attemptPlay);
    };
  }, []);

  // Calculate assets for rendering
  const assets = archetype ? ARCHETYPE_ASSETS[archetype.name] : null;

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Audio */}
      <audio ref={audioRef} src="/audio/bgm.mp3" loop />

      {/* Audio Control Button */}
      <button
        onClick={toggleAudio}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all duration-300 border border-white/10"
        title={isPlaying ? "Mute Music" : "Play Music"}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        )}
      </button>

      {/* Background Starfield */}
      {!isLoading && <Starfield />}

      {/* Journey Stages */}
      {isLoading ? (
        <LoadingScreen onComplete={() => { }} />
      ) : (
        <div className="z-10 w-full h-full flex items-center justify-center">
          {!showResult ? (
            <InputForm key={resetKey} onSubmit={handleFormSubmit} />
          ) : (
            userData && (
              <>
                {exploringCity ? (
                  <CityExplorer
                    cityData={exploringCity}
                    onBack={() => setExploringCity(null)}
                    characterFront={assets?.front || '/characters/cosmic-wanderer-front.svg'}
                    characterSide={assets?.side || '/characters/cosmic-wanderer-side.svg'}
                  />
                ) : (
                  <div className="max-w-4xl w-full p-4 animate-elegant-fade">
                    <ResultDisplay
                      name={userData.name}
                      birthdate={userData.birthdate}
                      result={apiResult}
                      scores={elementScores} // Pass scores prop
                      error={apiError}
                      onReset={handleReset}
                      onExplore={setExploringCity}
                    />
                  </div>
                )}
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default App;
