import React, { useState, useEffect } from 'react';
import { KeyRound, RefreshCw, Copy, Check } from 'lucide-react';

export default function PasswordCreator() {
  const [lengthInput, setLengthInput] = useState('16');
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [complexity, setComplexity] = useState(3); // 1 to 5
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let length = parseInt(lengthInput, 10);
    if (isNaN(length) || length < 1) length = 4;
    if (length > 100) length = 100;

    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    let chars = "";
    if (useUpper) chars += upper;
    if (useLower) chars += lower;
    
    // Increase weight of numbers/symbols based on complexity slider
    const extraWeight = complexity > 3 ? complexity - 2 : 1; 
    
    if (useNumbers) chars += numbers.repeat(complexity > 2 ? extraWeight : 1);
    if (useSymbols) chars += symbols.repeat(complexity > 2 ? extraWeight : 1);
    
    if (chars === "") {
        setPassword("");
        return;
    }

    let result = "";
    let mandatoryChars = [];
    if (useUpper) mandatoryChars.push(upper[Math.floor(Math.random() * upper.length)]);
    if (useLower) mandatoryChars.push(lower[Math.floor(Math.random() * lower.length)]);
    if (useNumbers) mandatoryChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
    if (useSymbols) mandatoryChars.push(symbols[Math.floor(Math.random() * symbols.length)]);

    for (let i = 0; i < mandatoryChars.length && i < length; i++) {
        result += mandatoryChars[i];
    }

    for (let i = result.length; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    
    result = result.split('').sort(() => 0.5 - Math.random()).join('');
    setPassword(result);
  };

  useEffect(() => {
    generate();
  }, [lengthInput, useUpper, useLower, useNumbers, useSymbols, complexity]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleLengthBlur = () => {
      let val = parseInt(lengthInput, 10);
      if (isNaN(val) || val < 4) setLengthInput('4');
      else if (val > 100) setLengthInput('100');
  };

  return (
    <div className="flex flex-col gap-8" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-1px', marginBottom: '0.25rem' }}>PASSWORD CREATOR</h1>
        <p className="text-muted">Generate highly secure, randomized passwords.</p>
      </div>

      <div className="panel flex flex-col gap-6">
        
        {/* Output Area */}
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
                <label className="text-xs font-bold uppercase text-muted">GENERATED PASSWORD</label>
                <div className="flex gap-2">
                    <button className="btn btn-tertiary text-xs" onClick={generate}>
                        <RefreshCw size={14} /> REGENERATE
                    </button>
                    <button className="btn btn-secondary text-xs" onClick={handleCopy}>
                        {copied ? <><Check size={14} /> COPIED</> : <><Copy size={14} /> COPY</>}
                    </button>
                </div>
            </div>
            <div 
                className="input font-mono" 
                style={{ 
                    fontSize: '1.5rem', 
                    padding: '1rem', 
                    textAlign: 'center', 
                    letterSpacing: '2px', 
                    minHeight: '80px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    wordBreak: 'break-all'
                }}
            >
                {password || "Select options below"}
            </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '0 -1.5rem' }} />

        {/* Controls */}
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">Password Length (Max 100)</label>
                <input 
                    type="number" 
                    className="input font-mono"
                    value={lengthInput} 
                    onChange={(e) => setLengthInput(e.target.value)}
                    onBlur={handleLengthBlur}
                    style={{ width: '100px' }}
                    placeholder="16"
                />
            </div>

            <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between">
                    <label className="text-sm font-bold">Symbol/Number Variety</label>
                    <span className="text-xs text-muted font-mono">LEVEL: {complexity}</span>
                </div>
                <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={complexity} 
                    onChange={(e) => setComplexity(parseInt(e.target.value, 10))}
                    style={{ width: '100%', cursor: 'pointer' }}
                />
                <p className="text-xs text-muted">Higher variety injects a higher ratio of symbols and numbers relative to letters.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                <label className="flex items-center gap-3" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                    <span className="text-sm font-bold">Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-3" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                    <span className="text-sm font-bold">Lowercase (a-z)</span>
                </label>
                <label className="flex items-center gap-3" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                    <span className="text-sm font-bold">Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-3" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                    <span className="text-sm font-bold">Symbols (!@#$)</span>
                </label>
            </div>
        </div>

      </div>
    </div>
  );
}
