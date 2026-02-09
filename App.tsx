
import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import Starfield from './components/Starfield';
import LoadingScreen from './components/LoadingScreen';
import { GoogleGenAI, Type } from "@google/genai";
import { calculateElements, getBirthSeason, determineArchetype, ElementScores, Archetype } from './utils/elements';


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
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
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
              <div className="max-w-4xl w-full p-4 animate-elegant-fade">
                <ResultDisplay
                  name={userData.name}
                  birthdate={userData.birthdate}
                  result={apiResult}
                  scores={elementScores} // Pass scores prop
                  error={apiError}
                  onReset={handleReset}
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default App;
