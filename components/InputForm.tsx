
import React, { useState, useEffect } from 'react';

interface InputFormProps {
  onSubmit: (birthdate: string, name: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [birthdate, setBirthdate] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<{ birthdate?: string; name?: string }>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const validate = () => {
    const newErrors: { birthdate?: string; name?: string } = {};
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    
    if (!birthdate) {
      newErrors.birthdate = "REQUIRED";
    } else if (!dateRegex.test(birthdate)) {
      newErrors.birthdate = "USE MM/DD/YYYY";
    }

    if (!name) {
      newErrors.name = "REQUIRED";
    } else if (name.trim().length < 2) {
      newErrors.name = "MIN 2 CHARACTERS";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(birthdate, name);
    }
  };

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    if (val.length >= 5) {
      val = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
    } else if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setBirthdate(val);
    if (errors.birthdate) setErrors(prev => ({ ...prev, birthdate: undefined }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center w-full min-h-screen py-20 select-none"
    >
      {/* Title Section: Max-width 800px, Perfectly Centered */}
      <div className={`max-w-[800px] w-full flex flex-col items-center justify-center text-center transition-all duration-1000 ${isLoaded ? 'animate-elegant-fade' : 'opacity-0'}`}>
        <h1 className="text-[#ffffff] text-[24px] sm:text-[36px] md:text-[52px] tracking-[6px] leading-none pixel-text-glow whitespace-nowrap animate-pulse-gentle">
          ELEMENTAL VIBE
        </h1>
        <p className="text-[#c0c0c0] text-[10px] md:text-[14px] mt-6 tracking-[3px] uppercase opacity-60">
          Discover Your Cosmic Nature
        </p>
      </div>

      {/* Form Section: Spacing refined to 80px from title */}
      <div className={`flex flex-col items-center w-full max-w-[400px] mt-[80px] transition-all duration-1000 delay-300 ${isLoaded ? 'animate-elegant-fade' : 'opacity-0'}`}>
        
        {/* Birthday Field */}
        <div className="w-full mb-8">
          <label className="block text-[#c0c0c0] text-[10px] mb-4 tracking-widest uppercase opacity-80">
            Birthdate
          </label>
          <input
            type="text"
            value={birthdate}
            onChange={handleBirthdateChange}
            placeholder="MM/DD/YYYY"
            className={`w-full h-[48px] px-6 bg-white/5 border-2 ${errors.birthdate ? 'border-[#ff6b6b]' : 'border-white/10'} rounded-[6px] text-[#f7f7f7] text-[12px] placeholder:text-[#f7f7f7]/40 focus:outline-none transition-all input-elegant`}
          />
          {errors.birthdate && (
            <p className="text-[#ff6b6b] text-[8px] mt-2 tracking-widest">{errors.birthdate}</p>
          )}
        </div>

        {/* Name Field: 32px spacing between inputs */}
        <div className="w-full mb-12">
          <label className="block text-[#c0c0c0] text-[10px] mb-4 tracking-widest uppercase opacity-80">
            Your name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter your name"
            className={`w-full h-[48px] px-6 bg-white/5 border-2 ${errors.name ? 'border-[#ff6b6b]' : 'border-white/10'} rounded-[6px] text-[#f7f7f7] text-[12px] placeholder:text-[#f7f7f7]/40 focus:outline-none transition-all input-elegant`}
          />
          {errors.name && (
            <p className="text-[#ff6b6b] text-[8px] mt-2 tracking-widest">{errors.name}</p>
          )}
        </div>

        {/* Submit Button: 48px spacing from inputs, WCAG compliant contrast */}
        <button
          type="submit"
          className="w-full h-[56px] bg-gradient-to-r from-[#4ecdc4] to-[#95e1d3] border-[3px] border-white text-[#0f1729] text-[14px] font-bold btn-refined-hover flex items-center justify-center tracking-widest"
        >
          BEGIN JOURNEY
        </button>
      </div>
    </form>
  );
};

export default InputForm;
