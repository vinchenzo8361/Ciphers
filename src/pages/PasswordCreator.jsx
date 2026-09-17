import React, { useState, useEffect } from 'react';
import { KeyRound, RefreshCw, Copy, Check } from 'lucide-react';

export default function PasswordCreator() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    let chars = "";
    if (useUpper) chars += upper;
    if (useLower) chars += lower;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;
    
    if (chars === "") {
        setPassword("");
        return;
    }

    let result = "";
    // Ensure at least one of each selected type if length allows
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
    
    // Shuffle the result
    result = result.split('').sort(() => 0.5 - Math.random()).join('');
    setPassword(result);
  };

  useEffect(() => {
    generate();
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
                <div className="flex justify-between">
                    <label className="text-sm font-bold">Password Length</label>
                    <span className="font-mono text-sm text-muted">{length}</span>
                </div>
                <input 
                    type="range" 
                    min="4" 
                    max="64" 
                    value={length} 
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
