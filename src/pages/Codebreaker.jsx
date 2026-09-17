import React, { useState } from 'react';
import { transform } from '../registry';
import { Cpu } from 'lucide-react';

const englishFreq = {
    'e': 12.7, 't': 9.0, 'a': 8.1, 'o': 7.5, 'i': 6.9, 'n': 6.7,
    's': 6.3, 'h': 6.0, 'r': 5.9, 'd': 4.2, 'l': 4.0, 'c': 2.7,
    'u': 2.7, 'm': 2.4, 'w': 2.3, 'f': 2.2, 'g': 2.0, 'y': 1.9,
    'p': 1.9, 'b': 1.4, 'v': 0.9, 'k': 0.7, 'x': 0.1, 'j': 0.1,
    'q': 0.09, 'z': 0.07
};

function scoreText(text) {
    let score = 0;
    for (let char of text.toLowerCase()) {
        if (englishFreq[char]) {
            score += englishFreq[char];
        }
    }
    return score;
}

export default function Codebreaker() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const handleCrack = () => {
        if (!input.trim()) return;

        let bestScore = 0;
        let bestShift = 0;
        let bestText = '';

        for (let i = 1; i < 26; i++) {
            // Assume the original text was ENCODED with shift i.
            // Therefore, we DECODE it with shift i.
            const res = transform('caesar', input, { shift: i }, 'decode');
            if (res.success) {
                const score = scoreText(res.output);
                if (score > bestScore) {
                    bestScore = score;
                    bestShift = i;
                    bestText = res.output;
                }
            }
        }

        setResult({
            shift: bestShift,
            text: bestText
        });
    };

    return (
        <div className="flex flex-col gap-8" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-1px', marginBottom: '0.25rem' }}>CODEBREAKER</h1>
                <p className="text-muted">Auto-analyze and crack simple substitution ciphers using frequency analysis.</p>
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

            {result && (
                <div className="panel" style={{ borderLeft: '4px solid var(--accent)', marginTop: '1rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                        ANALYSIS COMPLETE
                    </h2>
                    
                    <div className="text-sm text-muted mb-6" style={{ lineHeight: 1.6 }}>
                        <strong style={{ color: 'var(--text-primary)' }}>Methodology:</strong><br />
                        The engine assumed the text was encrypted using a Caesar Shift. It tested all 25 possible shifts and compared the resulting letter distributions to standard English letter frequencies (where E, T, and A appear most often). 
                        <br/><br/>
                        Shift <strong style={{ color: 'var(--accent)' }}>+{result.shift}</strong> produced the highest mathematical correlation to English.
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-muted">DECODED RESULT (SHIFT: +{result.shift})</label>
                        <textarea 
                            className="input font-mono" 
                            rows={4} 
                            value={result.text} 
                            readOnly 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
