import React, { useState } from 'react';
import { Cpu, ChevronDown, ChevronUp } from 'lucide-react';
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

export default function EnigmaCracker() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);
    const [isCracking, setIsCracking] = useState(false);

    const [rotor1, setRotor1] = useState('I');
    const [rotor2, setRotor2] = useState('II');
    const [rotor3, setRotor3] = useState('III');

    const handleCrack = async () => {
        if (!input.trim()) return;
        setIsCracking(true);
        setResults([]);

        // Yield to render
        await new Promise(r => setTimeout(r, 50));

        const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let bestResults = [];

        // Brute force 26x26x26 starting positions = 17576 attempts
        for (let i = 0; i < 26; i++) {
            for (let j = 0; j < 26; j++) {
                for (let k = 0; j < 26; k++) {
                    if (k >= 26) break;
                    
                    const start1 = ALPHABET[i];
                    const start2 = ALPHABET[j];
                    const start3 = ALPHABET[k];

                    const settings = {
                        rotor1, rotor2, rotor3,
                        start1, start2, start3,
                        plugboard: '' // Assume no plugboard for basic cracking
                    };

                    const decoded = enigmaEncode(input, settings);
                    const score = scoreText(decoded);

                    if (score > 0) {
                        bestResults.push({
                            starts: `${start1}-${start2}-${start3}`,
                            output: decoded,
                            score
                        });
                    }
                }
            }
        }

        bestResults.sort((a, b) => b.score - a.score);
        setResults(bestResults.slice(0, 5));
        setIsCracking(false);
    };

    return (
        <div className="flex flex-col gap-8" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-1px', marginBottom: '0.25rem' }}>ENIGMA CRACKER (BOMBE SIMULATOR)</h1>
                <p className="text-muted">Brute-force the 17,576 possible starting rotor positions for a given rotor layout (assuming no plugboard).</p>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-muted">KNOWN ROTOR CONFIGURATION</label>
                <div className="flex gap-4 mb-4">
                    <select className="input font-mono" value={rotor1} onChange={(e) => setRotor1(e.target.value)}>
                        <option value="I">Rotor I</option><option value="II">Rotor II</option><option value="III">Rotor III</option>
                    </select>
                    <select className="input font-mono" value={rotor2} onChange={(e) => setRotor2(e.target.value)}>
                        <option value="I">Rotor I</option><option value="II">Rotor II</option><option value="III">Rotor III</option>
                    </select>
                    <select className="input font-mono" value={rotor3} onChange={(e) => setRotor3(e.target.value)}>
                        <option value="I">Rotor I</option><option value="II">Rotor II</option><option value="III">Rotor III</option>
                    </select>
                </div>

                <label className="text-xs font-bold uppercase text-muted">UNKNOWN CIPHERTEXT</label>
                <textarea 
                    className="input font-mono" 
                    rows={5} 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Paste Enigma-encrypted text here..."
                    style={{ resize: 'vertical' }}
                />
                
                <div className="mt-2 flex gap-4 items-center">
                    <button className="btn btn-primary" onClick={handleCrack} disabled={!input.trim() || isCracking}>
                        <Cpu size={16} /> {isCracking ? 'CRACKING (17,576 ATTEMPTS)...' : 'START BRUTE FORCE'}
                    </button>
                    {isCracking && <span className="text-xs text-muted font-mono animate-pulse">Running Alan Turing's Bombe...</span>}
                </div>
            </div>

            {results && results.length > 0 && (
                <div className="flex flex-col gap-6 mt-4">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                        TOP RESULTS
                    </h2>
                    
                    {results.map((res, idx) => (
                        <div key={idx} className="panel" style={{ borderLeft: idx === 0 ? '4px solid var(--success)' : '4px solid var(--accent)', padding: '1.25rem' }}>
                            <div className="flex justify-between items-center mb-2">
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                    Starting Positions: {res.starts}
                                </h3>
                                <span className="text-xs font-mono font-bold text-muted" style={{ background: 'var(--bg-base)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                    CONFIDENCE: {(res.score * 10).toFixed(1)}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 mt-4">
                                <label className="text-xs font-bold uppercase text-muted">DECODED OUTPUT</label>
                                <textarea 
                                    className="input font-mono" 
                                    rows={3} 
                                    value={res.output} 
                                    readOnly 
                                    style={{ backgroundColor: 'var(--bg-surface-raised)' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {results && results.length === 0 && !isCracking && input.trim() && (
                <p className="text-muted text-sm mt-4">No English words detected in any of the 17,576 combinations. Try a different rotor configuration or ensure the ciphertext is long enough to contain dictionary words.</p>
            )}
        </div>
    );
}
