import React, { useState, useEffect } from 'react';
import { Cpu, RotateCcw, ShieldAlert, ArrowRight, Cable } from 'lucide-react';
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
const KEYBOARD_ROWS = [
    ['Q','W','E','R','T','Z','U','I','O'],
    ['A','S','D','F','G','H','J','K'],
    ['P','Y','X','C','V','B','N','M','L']
];

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#64748b', '#78716c'];

export default function EnigmaMachine() {
    const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'bombe'

    // Simulator State
    const [rotor1, setRotor1] = useState('I');
    const [rotor2, setRotor2] = useState('II');
    const [rotor3, setRotor3] = useState('III');
    const [start1, setStart1] = useState('A');
    const [start2, setStart2] = useState('A');
    const [start3, setStart3] = useState('A');
    const [simInput, setSimInput] = useState('');
    const [simOutput, setSimOutput] = useState('');

    // Plugboard UI State
    const [plugPairs, setPlugPairs] = useState([]); // Array of strings like 'AB'
    const [activePlug, setActivePlug] = useState(null);

    // Bombe State
    const [bombeInput, setBombeInput] = useState('');
    const [bombeResults, setBombeResults] = useState([]);
    const [isCracking, setIsCracking] = useState(false);
    const [crackProgress, setCrackProgress] = useState(0); // 0 to 60 (Rotor perms)

    // Build the plugboard string for the engine
    const plugboardString = plugPairs.join(' ');

    // Live Simulator Update
    useEffect(() => {
        if (activeTab === 'simulator') {
            const settings = { rotor1, rotor2, rotor3, start1, start2, start3, plugboard: plugboardString };
            setSimOutput(enigmaEncode(simInput, settings));
        }
    }, [simInput, rotor1, rotor2, rotor3, start1, start2, start3, plugboardString, activeTab]);

    const handlePlugClick = (letter) => {
        // Is it already part of a pair?
        const existingPairIndex = plugPairs.findIndex(p => p.includes(letter));
        
        if (existingPairIndex !== -1) {
            // Unplug it
            const newPairs = [...plugPairs];
            newPairs.splice(existingPairIndex, 1);
            setPlugPairs(newPairs);
            setActivePlug(null);
            return;
        }

        if (!activePlug) {
            // First click
            setActivePlug(letter);
        } else {
            // Second click - create pair
            if (activePlug !== letter) {
                setPlugPairs([...plugPairs, activePlug + letter]);
            }
            setActivePlug(null);
        }
    };

    const handleCrack = async () => {
        if (!bombeInput.trim()) return;
        setIsCracking(true);
        setBombeResults([]);
        setCrackProgress(0);

        await new Promise(r => setTimeout(r, 50));

        let bestResults = [];
        const rotors = ['I', 'II', 'III', 'IV', 'V'];
        const perms = [];
        for(let a of rotors) {
            for(let b of rotors) {
                if(a===b) continue;
                for(let c of rotors) {
                    if(a===c || b===c) continue;
                    perms.push([a,b,c]);
                }
            }
        } // 60 permutations

        // Brute force 60 rotor combinations * 17576 starting positions = 1,054,560 attempts
        for (let pIdx = 0; pIdx < perms.length; pIdx++) {
            const [r1, r2, r3] = perms[pIdx];
            
            for (let i = 0; i < 26; i++) {
                for (let j = 0; j < 26; j++) {
                    for (let k = 0; k < 26; k++) {
                        const s1 = ALPHABET[i];
                        const s2 = ALPHABET[j];
                        const s3 = ALPHABET[k];

                        const settings = {
                            rotor1: r1, rotor2: r2, rotor3: r3,
                            start1: s1, start2: s2, start3: s3,
                            plugboard: '' // Assume no plugboard for bombe brute force
                        };

                        const decoded = enigmaEncode(bombeInput, settings);
                        const score = scoreText(decoded);

                        if (score > 0) {
                            bestResults.push({
                                rotors: `${r1}-${r2}-${r3}`,
                                starts: `${s1}-${s2}-${s3}`,
                                output: decoded,
                                score
                            });
                        }
                    }
                }
            }
            
            setCrackProgress(pIdx + 1);
            // Yield to browser to update progress bar
            await new Promise(resolve => setTimeout(resolve, 0));
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
                
                <div className="flex" style={{ backgroundColor: 'var(--bg-surface-raised)', padding: '0.25rem', borderRadius: '0px' }}>
                    <button 
                        className="btn text-sm" 
                        style={{ 
                            backgroundColor: activeTab === 'simulator' ? 'var(--bg-surface)' : 'transparent',
                            color: activeTab === 'simulator' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            boxShadow: activeTab === 'simulator' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            border: 'none',
                            borderRadius: '0px'
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
                            border: 'none',
                            borderRadius: '0px'
                        }}
                        onClick={() => setActiveTab('bombe')}
                    >
                        BOMBE CRACKER
                    </button>
                </div>
            </div>

            {activeTab === 'simulator' && (
                <div className="flex flex-col gap-6 animate-fade-in">
                    
                    <div className="panel flex flex-col gap-4" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                        <h3 className="text-sm font-bold uppercase" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <RotateCcw size={16} /> 1. Configure Hardware Rotors
                        </h3>
                        <div className="flex gap-8 flex-wrap">
                            {renderRotorSelect(rotor1, setRotor1, 'Rotor 1 (Slow)')}
                            {renderRotorSelect(rotor2, setRotor2, 'Rotor 2 (Mid)')}
                            {renderRotorSelect(rotor3, setRotor3, 'Rotor 3 (Fast)')}
                        </div>
                        
                        <h3 className="text-sm font-bold uppercase mt-4" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShieldAlert size={16} /> 2. Set Starting Positions
                        </h3>
                        <div className="flex gap-4 p-4 rounded" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', width: 'fit-content' }}>
                            {renderStartSelect(start1, setStart1, 'Pos 1')}
                            {renderStartSelect(start2, setStart2, 'Pos 2')}
                            {renderStartSelect(start3, setStart3, 'Pos 3')}
                        </div>
                    </div>

                    <div className="panel flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Cable size={16} /> 3. Steckerbrett (Plugboard)
                        </h3>
                        <p className="text-xs text-muted">Click a letter, then click another to connect them with a cable. Click an active cable to unplug it.</p>
                        
                        <div className="flex flex-col items-center gap-2 mt-2 p-4" style={{ backgroundColor: 'var(--bg-base)', borderRadius: '0px', border: '1px solid var(--border-subtle)' }}>
                            {KEYBOARD_ROWS.map((row, rIdx) => (
                                <div key={rIdx} className="flex gap-2">
                                    {row.map(letter => {
                                        const pairIndex = plugPairs.findIndex(p => p.includes(letter));
                                        const isPaired = pairIndex !== -1;
                                        const isActive = activePlug === letter;
                                        
                                        let btnColor = 'var(--bg-surface-raised)';
                                        let txtColor = 'var(--text-primary)';
                                        let border = '1px solid var(--border-subtle)';
                                        
                                        if (isActive) {
                                            btnColor = 'var(--text-primary)';
                                            txtColor = 'var(--bg-base)';
                                            border = '1px solid var(--text-primary)';
                                        } else if (isPaired) {
                                            const color = COLORS[pairIndex % COLORS.length];
                                            border = `2px solid ${color}`;
                                            txtColor = color;
                                        }

                                        return (
                                            <button 
                                                key={letter}
                                                className="font-mono text-sm font-bold"
                                                style={{ 
                                                    width: '40px', height: '40px', 
                                                    borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    backgroundColor: btnColor,
                                                    color: txtColor,
                                                    border: border,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.1s'
                                                }}
                                                onClick={() => handlePlugClick(letter)}
                                            >
                                                {letter}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
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
                    <div className="panel" style={{ backgroundColor: 'var(--bg-base)' }}>
                        <h3 className="text-sm font-bold uppercase mb-2" style={{ color: 'var(--accent)' }}>Turing's Bombe Simulator</h3>
                        <p className="text-muted text-sm">
                            The Bombe bypasses the need to know the specific rotors or starting positions. 
                            It will instantly simulate all <strong>60</strong> historical rotor combinations and all <strong>17,576</strong> starting positions (1,054,560 total hardware configurations) to find English plaintext.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-muted">INTERCEPTED CIPHERTEXT (Plugboard assumed empty)</label>
                        <textarea 
                            className="input font-mono" 
                            rows={5} 
                            value={bombeInput} 
                            onChange={(e) => setBombeInput(e.target.value)} 
                            placeholder="Paste intercepted Enigma text here... (Longer text yields better dictionary matches)"
                            style={{ resize: 'vertical' }}
                        />
                        
                        <div className="mt-2 flex flex-col gap-2">
                            <button className="btn btn-primary" style={{ width: 'fit-content' }} onClick={handleCrack} disabled={!bombeInput.trim() || isCracking}>
                                <Cpu size={16} /> {isCracking ? 'RUNNING BOMBE...' : 'START BRUTE FORCE (1,054,560 ATTEMPTS)'}
                            </button>
                            
                            {isCracking && (
                                <div className="flex flex-col gap-1 mt-2">
                                    <div className="flex justify-between text-xs font-mono text-muted">
                                        <span>Testing Rotor Permutation {crackProgress}/60</span>
                                        <span>{Math.round((crackProgress / 60) * 100)}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-surface)', borderRadius: '0px', overflow: 'hidden' }}>
                                        <div style={{ width: `${(crackProgress / 60) * 100}%`, height: '100%', backgroundColor: 'var(--accent)', transition: 'width 0.1s linear' }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {bombeResults.length > 0 && (
                        <div className="flex flex-col gap-4 mt-4">
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                                TOP DECRYPTIONS
                            </h2>
                            
                            {bombeResults.map((res, idx) => (
                                <div key={idx} className="panel" style={{ borderLeft: idx === 0 ? '4px solid var(--success)' : '4px solid var(--accent)' }}>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex flex-col">
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                                Rotors: <span className="font-mono text-lg">{res.rotors}</span>
                                            </h3>
                                            <span className="text-muted text-sm font-mono">Starts: {res.starts}</span>
                                        </div>
                                        <span className="text-xs font-mono font-bold text-muted" style={{ background: 'var(--bg-base)', padding: '0.2rem 0.5rem', borderRadius: '0px' }}>
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
