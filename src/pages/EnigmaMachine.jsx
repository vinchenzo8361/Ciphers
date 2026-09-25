import React, { useState, useEffect } from 'react';
import { Cpu, RotateCcw, ShieldAlert, ArrowRight } from 'lucide-react';
import { enigmaEncode } from '../registry/implementations/enigma';

const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 
    'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 
    'hello', 'world', 'test', 'secret', 'message'
]);

function scoreText(text) {
    let dictionaryBonus = 0;
    const words = text.toLowerCase().split(/[\s\W]+/);
    for (let word of words) {
        if (word.length > 0 && commonWords.has(word)) {
            dictionaryBonus += 10.0;
        }
    }
    return dictionaryBonus;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function EnigmaMachine() {
    const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'bombe'

    // Shared State
    const [rotor1, setRotor1] = useState('I');
    const [rotor2, setRotor2] = useState('II');
    const [rotor3, setRotor3] = useState('III');

    // Simulator State
    const [start1, setStart1] = useState('A');
    const [start2, setStart2] = useState('A');
    const [start3, setStart3] = useState('A');
    const [plugboard, setPlugboard] = useState('');
    const [simInput, setSimInput] = useState('');
    const [simOutput, setSimOutput] = useState('');

    // Bombe State
    const [bombeInput, setBombeInput] = useState('');
    const [bombeResults, setBombeResults] = useState([]);
    const [isCracking, setIsCracking] = useState(false);

    // Live Simulator Update
    useEffect(() => {
        if (activeTab === 'simulator') {
            const settings = { rotor1, rotor2, rotor3, start1, start2, start3, plugboard };
            setSimOutput(enigmaEncode(simInput, settings));
        }
    }, [simInput, rotor1, rotor2, rotor3, start1, start2, start3, plugboard, activeTab]);

    const handleCrack = async () => {
        if (!bombeInput.trim()) return;
        setIsCracking(true);
        setBombeResults([]);

        // Yield to render
        await new Promise(r => setTimeout(r, 50));

        let bestResults = [];

        // Brute force 26x26x26 starting positions = 17576 attempts
        for (let i = 0; i < 26; i++) {
            for (let j = 0; j < 26; j++) {
                for (let k = 0; j < 26; k++) {
                    const s1 = ALPHABET[i];
                    const s2 = ALPHABET[j];
                    const s3 = ALPHABET[k];

                    const settings = {
                        rotor1, rotor2, rotor3,
                        start1: s1, start2: s2, start3: s3,
                        plugboard: '' // Assume no plugboard for basic cracking
                    };

                    const decoded = enigmaEncode(bombeInput, settings);
                    const score = scoreText(decoded);

                    if (score > 0) {
                        bestResults.push({
                            starts: `${s1}-${s2}-${s3}`,
                            output: decoded,
                            score
                        });
                    }
                }
            }
        }

        bestResults.sort((a, b) => b.score - a.score);
        setBombeResults(bestResults.slice(0, 5));
        setIsCracking(false);
    };

    const renderRotorSelect = (val, setter, label) => (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-muted uppercase">{label}</label>
            <select className="input font-mono" style={{ padding: '0.4rem', width: '80px', textAlign: 'center' }} value={val} onChange={(e) => setter(e.target.value)}>
                <option value="I">I</option><option value="II">II</option><option value="III">III</option><option value="IV">IV</option><option value="V">V</option>
            </select>
        </div>
    );

    const renderStartSelect = (val, setter, label) => (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-muted uppercase">{label}</label>
            <select className="input font-mono" style={{ padding: '0.4rem', width: '60px', textAlign: 'center', backgroundColor: 'var(--bg-base)' }} value={val} onChange={(e) => setter(e.target.value)}>
                {ALPHABET.split('').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
    );

    return (
        <div className="flex flex-col gap-6" style={{ maxWidth: '900px', margin: '0 auto' }}>
            
            <div className="flex justify-between items-end">
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-1px', marginBottom: '0.25rem' }}>ENIGMA MACHINE</h1>
                    <p className="text-muted">Simulate the WWII cipher machine or use the Bombe to crack messages.</p>
                </div>
                
                <div className="flex" style={{ backgroundColor: 'var(--bg-surface-raised)', padding: '0.25rem', borderRadius: '8px' }}>
                    <button 
                        className="btn text-sm" 
                        style={{ 
                            backgroundColor: activeTab === 'simulator' ? 'var(--bg-surface)' : 'transparent',
                            color: activeTab === 'simulator' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            boxShadow: activeTab === 'simulator' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            border: 'none'
                        }}
                        onClick={() => setActiveTab('simulator')}
                    >
                        SIMULATOR
                    </button>
                    <button 
                        className="btn text-sm"
                        style={{ 
                            backgroundColor: activeTab === 'bombe' ? 'var(--bg-surface)' : 'transparent',
                            color: activeTab === 'bombe' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            boxShadow: activeTab === 'bombe' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            border: 'none'
                        }}
                        onClick={() => setActiveTab('bombe')}
                    >
                        BOMBE CRACKER
                    </button>
                </div>
            </div>

            {/* Global Rotor Selection (Shared across both modes) */}
            <div className="panel flex flex-col gap-4" style={{ border: '1px solid var(--accent)', background: 'linear-gradient(to bottom right, var(--bg-surface), var(--bg-base))' }}>
                <h3 className="text-sm font-bold uppercase" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <RotateCcw size={16} /> 1. Configure Hardware Rotors (Left to Right)
                </h3>
                <div className="flex gap-8">
                    {renderRotorSelect(rotor1, setRotor1, 'Rotor 1 (Slow)')}
                    {renderRotorSelect(rotor2, setRotor2, 'Rotor 2 (Mid)')}
                    {renderRotorSelect(rotor3, setRotor3, 'Rotor 3 (Fast)')}
                </div>
            </div>

            {activeTab === 'simulator' && (
                <div className="flex flex-col gap-6 animate-fade-in">
                    <div className="panel flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase text-muted">2. Set Initial Positions & Plugboard</h3>
                        <div className="flex gap-8 flex-wrap">
                            <div className="flex gap-4 p-4 rounded" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}>
                                {renderStartSelect(start1, setStart1, 'Pos 1')}
                                {renderStartSelect(start2, setStart2, 'Pos 2')}
                                {renderStartSelect(start3, setStart3, 'Pos 3')}
                            </div>
                            
                            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
                                <label className="text-xs font-bold text-muted uppercase">Plugboard Pairs (e.g. AB CD)</label>
                                <input 
                                    type="text" 
                                    className="input font-mono uppercase" 
                                    value={plugboard} 
                                    onChange={(e) => setPlugboard(e.target.value.toUpperCase())}
                                    placeholder="Empty (No swaps)"
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase text-muted">PLAINTEXT / CIPHERTEXT</label>
                            <textarea 
                                className="input font-mono" 
                                rows={8} 
                                value={simInput} 
                                onChange={(e) => setSimInput(e.target.value)} 
                                placeholder="Type message here. Enigma encrypts and decrypts symmetrically!"
                                style={{ resize: 'vertical', fontSize: '1.1rem' }}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase text-muted" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                LIVE OUTPUT
                                <span style={{ color: 'var(--accent)' }}>REFLECTOR ACTIVE</span>
                            </label>
                            <textarea 
                                className="input font-mono" 
                                rows={8} 
                                value={simOutput} 
                                readOnly
                                placeholder="Output appears instantly..."
                                style={{ resize: 'vertical', backgroundColor: 'var(--bg-surface-raised)', fontSize: '1.1rem', color: 'var(--accent)' }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'bombe' && (
                <div className="flex flex-col gap-6 animate-fade-in">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-muted">INTERCEPTED CIPHERTEXT</label>
                        <textarea 
                            className="input font-mono" 
                            rows={5} 
                            value={bombeInput} 
                            onChange={(e) => setBombeInput(e.target.value)} 
                            placeholder="Paste intercepted Enigma text here..."
                            style={{ resize: 'vertical' }}
                        />
                        
                        <div className="mt-2 flex gap-4 items-center">
                            <button className="btn btn-primary" onClick={handleCrack} disabled={!bombeInput.trim() || isCracking}>
                                <Cpu size={16} /> {isCracking ? 'RUNNING BOMBE (17,576 ATTEMPTS)...' : 'START BRUTE FORCE'}
                            </button>
                            {isCracking && <span className="text-xs text-muted font-mono animate-pulse">Simulating Turing's Bombe...</span>}
                        </div>
                    </div>

                    {bombeResults.length > 0 && (
                        <div className="flex flex-col gap-4 mt-2">
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                                ALAN TURING'S TOP RESULTS
                            </h2>
                            
                            {bombeResults.map((res, idx) => (
                                <div key={idx} className="panel" style={{ borderLeft: idx === 0 ? '4px solid var(--success)' : '4px solid var(--accent)' }}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            Starting Positions: <span className="font-mono text-xl tracking-widest">{res.starts}</span>
                                        </h3>
                                        <span className="text-xs font-mono font-bold text-muted" style={{ background: 'var(--bg-base)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                            SCORE: {(res.score * 10).toFixed(1)}
                                        </span>
                                    </div>

                                    <textarea 
                                        className="input font-mono" 
                                        rows={3} 
                                        value={res.output} 
                                        readOnly 
                                        style={{ backgroundColor: 'var(--bg-surface-raised)', width: '100%' }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
