import React, { useState } from 'react';
import { transform } from '../registry';

// Simple english letter frequencies for scoring
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

        // Brute force all 25 possible Caesar shifts
        for (let i = 1; i < 26; i++) {
            // Decoding a caesar cipher with shift `i`
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
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem' }}>CODEBREAKER</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Auto-crack simple ciphers using frequency analysis.</p>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ fontWeight: 'bold' }}>CIPHERTEXT INPUT</label>
                    <textarea 
                        className="input" 
                        rows={5} 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        placeholder="Paste encrypted text here..."
                    />
                </div>
                
                <button className="btn" onClick={handleCrack}>
                    ANALYZE & CRACK
                </button>
            </div>

            {result && (
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid var(--accent)' }}>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)' }}>Crack Successful!</h2>
                    
                    <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        <strong>How we broke it:</strong><br />
                        The website analyzed the text assuming it was a Caesar cipher. It automatically tested all 25 possible shifts. For each test, it counted the letters and compared them to standard English letter frequencies (where E, T, and A are the most common). <br/><br/>
                        Shift <strong>+{result.shift}</strong> produced text that mathematically looked the most like English!
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold' }}>DECODED RESULT (Shift: +{result.shift})</label>
                        <textarea 
                            className="input" 
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
