import React, { useState } from 'react';
import { transform } from '../registry';
import { Cpu, ChevronDown, ChevronUp } from 'lucide-react';

const englishFreq = {
    'e': 12.7, 't': 9.0, 'a': 8.1, 'o': 7.5, 'i': 6.9, 'n': 6.7,
    's': 6.3, 'h': 6.0, 'r': 5.9, 'd': 4.2, 'l': 4.0, 'c': 2.7,
    'u': 2.7, 'm': 2.4, 'w': 2.3, 'f': 2.2, 'g': 2.0, 'y': 1.9,
    'p': 1.9, 'b': 1.4, 'v': 0.9, 'k': 0.7, 'x': 0.1, 'j': 0.1,
    'q': 0.09, 'z': 0.07, ' ': 15.0 
};

const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 
    'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 
    'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him',
    'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use',
    'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
    // Common test words
    'hello', 'world', 'test', 'testing', 'secret', 'message', 'hi', 'hey', 'foo', 'bar', 'password'
]);

function scoreText(text) {
    let score = 0;
    let letterCount = 0;
    const lowerText = text.toLowerCase();
    
    // Frequency score
    for (let char of lowerText) {
        if (englishFreq[char]) {
            score += englishFreq[char];
        }
        if (char.match(/[a-z]/)) {
            letterCount++;
        }
    }
    
    let baseScore = letterCount > 0 ? score / text.length : 0;

    // Penalty for impossible/highly unlikely bigrams to prevent "axeeh" from beating "hello"
    const badBigrams = ['qx', 'jz', 'zx', 'xj', 'qj', 'vk', 'xq', 'xe', 'hx'];
    for (let bg of badBigrams) {
        if (lowerText.includes(bg)) {
            baseScore -= 2.0; 
        }
    }

    // Dictionary bonus
    let dictionaryBonus = 0;
    const words = lowerText.split(/[\s\W]+/);
    for (let word of words) {
        if (word.length > 0 && commonWords.has(word)) {
            dictionaryBonus += 10.0; // Massive boost for real English words
        }
    }

    return baseScore + dictionaryBonus;
}

export default function Codebreaker() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);
    const [showAllCaesar, setShowAllCaesar] = useState(false);
    const [allCaesarShifts, setAllCaesarShifts] = useState([]);

    const handleCrack = () => {
        if (!input.trim()) return;

        let potentialResults = [];
        let caesarShifts = [];

        const testMethod = (methodId, settings, name, methodology) => {
            const res = transform(methodId, input, settings, 'decode');
            if (res.success && res.output.trim().length > 0) {
                const score = scoreText(res.output);
                return { name, output: res.output, methodology, score, methodId, settings };
            }
            return null;
        };

        // 1. Check Encodings (Binary, Hex, Base64, A1Z26)
        if (/^[01\s]+$/.test(input.trim())) {
            const res = testMethod('binary', {}, 'Binary Decoding', "Detected 1s and 0s. Converted 8-bit chunks to ASCII.");
            if (res) potentialResults.push(res);
        }
        if (/^[0-9A-Fa-f\s]+$/.test(input.trim()) && !/^\d+$/.test(input.trim())) {
            const res = testMethod('hex', {}, 'Hexadecimal Decoding', "Detected valid base-16. Mapped to ASCII text.");
            if (res) potentialResults.push(res);
        }
        if (/^[\d\s-]+$/.test(input.trim())) {
            const res = testMethod('a1z26', {}, 'A1Z26 Cipher', "Pure numbers detected. Assumed A=1, B=2 substitution.");
            if (res) potentialResults.push(res);
        }
        if (/^[A-Za-z0-9+/=]+$/.test(input.trim())) {
            const res = testMethod('base64', {}, 'Base64 Decoding', "Decoded standard Base64 string.");
            if (res && res.score > 0.5) potentialResults.push(res);
        }

        // 2. Classical
        const atbashRes = testMethod('atbash', {}, 'Atbash Cipher', "Reversed the alphabet (A=Z, B=Y).");
        if (atbashRes && atbashRes.score > 1.5) potentialResults.push(atbashRes);
        
        let bestCaesar = null;
        for (let i = 1; i < 26; i++) {
            const res = testMethod('caesar', { shift: i }, `Caesar Shift (+${i})`, `Shifted letters back by ${i}. Scored highest on English frequency analysis.`);
            if (res) {
                caesarShifts.push(res);
                if (!bestCaesar || res.score > bestCaesar.score) {
                    bestCaesar = res;
                }
            }
        }
        
        if (bestCaesar && bestCaesar.score > 1.5) {
            potentialResults.push(bestCaesar);
        }

        setAllCaesarShifts(caesarShifts);

        // Sort results by score descending
        potentialResults.sort((a, b) => b.score - a.score);
        
        // Take top 3 unique methods (or all if very high score)
        const topResults = potentialResults.filter(r => r.score > 1.5 || r.name.includes('Decoding'));
        
        setResults(topResults.length > 0 ? topResults.slice(0, 3) : []);
        setShowAllCaesar(false);
    };

    return (
        <div className="flex flex-col gap-8" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-1px', marginBottom: '0.25rem' }}>CODEBREAKER</h1>
                <p className="text-muted">Auto-analyze and crack multiple types of ciphers and encodings.</p>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-muted">UNKNOWN CIPHERTEXT</label>
                <textarea 
                    className="input font-mono" 
                    rows={5} 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Paste encrypted text here..."
                    style={{ resize: 'vertical' }}
                />
                
                <div className="mt-2">
                    <button className="btn btn-primary" onClick={handleCrack} disabled={!input.trim()}>
                        <Cpu size={16} /> ANALYZE & CRACK
                    </button>
                </div>
            </div>

            {results && results.length > 0 && (
                <div className="flex flex-col gap-6 mt-4">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                        ANALYSIS COMPLETE
                    </h2>
                    
                    {results.map((res, idx) => (
                        <div key={idx} className="panel" style={{ borderLeft: '4px solid var(--accent)', padding: '1.25rem' }}>
                            <div className="flex justify-between items-center mb-2">
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                    Guess {idx + 1}: {res.name}
                                </h3>
                                <span className="text-xs font-mono font-bold text-muted" style={{ background: 'var(--bg-base)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                    CONFIDENCE SCORE: {(res.score * 10).toFixed(1)}
                                </span>
                            </div>
                            
                            <p className="text-sm text-muted mb-4" style={{ lineHeight: 1.6 }}>
                                <strong style={{ color: 'var(--text-primary)' }}>Methodology:</strong> {res.methodology}
                            </p>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold uppercase text-muted">OUTPUT</label>
                                <textarea 
                                    className="input font-mono" 
                                    rows={3} 
                                    value={res.output} 
                                    readOnly 
                                    style={{ backgroundColor: 'var(--bg-surface-raised)', fontSize: '1.1rem' }}
                                />
                            </div>

                            {/* Show All Shifts Button for Caesar */}
                            {res.methodId === 'caesar' && (
                                <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                    <button 
                                        className="btn btn-secondary text-sm w-full justify-between" 
                                        style={{ padding: '0.75rem 1rem' }}
                                        onClick={() => setShowAllCaesar(!showAllCaesar)}
                                    >
                                        <span className="font-bold">VIEW ALL 25 CAESAR SHIFT VARIATIONS</span>
                                        {showAllCaesar ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                    
                                    {showAllCaesar && (
                                        <div className="mt-4" style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                                            gap: '0.75rem',
                                            maxHeight: '400px', 
                                            overflowY: 'auto',
                                            padding: '0.5rem'
                                        }}>
                                            {allCaesarShifts.map((shiftRes, sIdx) => (
                                                <div 
                                                    key={sIdx} 
                                                    style={{ 
                                                        backgroundColor: 'var(--bg-base)', 
                                                        padding: '0.75rem', 
                                                        borderRadius: '6px',
                                                        border: shiftRes.settings.shift === res.settings.shift ? '2px solid var(--accent)' : '1px solid var(--border-subtle)'
                                                    }}
                                                >
                                                    <div className="text-xs font-bold mb-1" style={{ color: shiftRes.settings.shift === res.settings.shift ? 'var(--accent)' : 'var(--text-muted)' }}>
                                                        SHIFT +{shiftRes.settings.shift}
                                                    </div>
                                                    <div className="font-mono text-sm" style={{ color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                                                        {shiftRes.output}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {results && results.length === 0 && input.trim() !== '' && (
                 <div className="panel" style={{ borderLeft: '4px solid var(--error)', marginTop: '1rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        ANALYSIS FAILED
                    </h2>
                    <p className="text-sm text-muted">
                        The engine tried Caesar shifts, Atbash, Base64, Hex, Binary, and A1Z26, but none of the outputs mathematically resembled a known language or format.
                    </p>
                 </div>
            )}
        </div>
    );
}
