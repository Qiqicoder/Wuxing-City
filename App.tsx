
import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import Starfield from './components/Starfield';
import LoadingScreen from './components/LoadingScreen';
import { GoogleGenAI, Type } from "@google/genai";
import { calculateElements, getBirthSeason, determineArchetype, ElementScores, Archetype } from './utils/elements';

interface PersonalityResult {
  element: string;
  color: string;
  description: string;
  vibe: string;
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
    
    // Pass the calculated results to Gemini to ensure description matches hardcoded logic
    const prompt = `
      User Name: ${name}
      Birthdate: ${birthdate}
      Calculated Archetype: ${arch.name} (Primary: ${arch.primaryElement}, Secondary: ${arch.secondaryElement})
      Elemental Scores: Fire=${scores.fire}, Water=${scores.water}, Wood=${scores.wood}, Earth=${scores.earth}, Metal=${scores.metal}

      Based on these parameters, generate a cosmic elemental personality. 
      The 'element' field should be the archetype name.
      Provide a short, mysterious description (2 sentences) in a retro-game tone.
      Return a fun, one-word 'vibe' and a hex color matching the primary element.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            element: { type: Type.STRING },
            color: { type: Type.STRING, description: "A hex color code that fits the element" },
            description: { type: Type.STRING },
            vibe: { type: Type.STRING, description: "A single word summarizing the vibe" }
          },
          required: ["element", "color", "description", "vibe"]
        }
      }
    });

    return JSON.parse(response.text);
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
        <LoadingScreen onComplete={() => {}} /> 
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
