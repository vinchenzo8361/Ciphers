import React, { useState } from 'react';
import { transform } from '../registry';
import { Cpu } from 'lucide-react';

const englishFreq = {
    'e': 12.7, 't': 9.0, 'a': 8.1, 'o': 7.5, 'i': 6.9, 'n': 6.7,
    's': 6.3, 'h': 6.0, 'r': 5.9, 'd': 4.2, 'l': 4.0, 'c': 2.7,
    'u': 2.7, 'm': 2.4, 'w': 2.3, 'f': 2.2, 'g': 2.0, 'y': 1.9,
    'p': 1.9, 'b': 1.4, 'v': 0.9, 'k': 0.7, 'x': 0.1, 'j': 0.1,
    'q': 0.09, 'z': 0.07, ' ': 15.0 // spaces are very common
};

function scoreText(text) {
    let score = 0;
    let letterCount = 0;
    for (let char of text.toLowerCase()) {
        if (englishFreq[char]) {
            score += englishFreq[char];
        }
        if (char.match(/[a-z]/)) {
            letterCount++;
        }
    }
    // Normalize score based on text length to prevent longer garbage from winning
    return letterCount > 0 ? score / text.length : 0;
}

export default function Codebreaker() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const handleCrack = () => {
        if (!input.trim()) return;

        let bestScore = 0;
        let bestMethod = '';
        let bestText = '';
        let methodologyText = '';

        // Helper to test a specific method
        const testMethod = (methodId, settings, name, methodology) => {
            const res = transform(methodId, input, settings, 'decode');
            if (res.success && res.output.trim().length > 0) {
                const score = scoreText(res.output);
                if (score > bestScore) {
                    bestScore = score;
                    bestMethod = name;
                    bestText = res.output;
                    methodologyText = methodology;
                }
            }
        };

        // 1. Try Encodings First (Base64, Hex, Binary, A1Z26)
        if (/^[01\s]+$/.test(input.trim())) {
            testMethod('binary', {}, 'Binary Decoding', "The engine detected a pattern of 1s and 0s. It converted each 8-bit binary segment into its corresponding ASCII character.");
        }
        if (/^[0-9A-Fa-f\s]+$/.test(input.trim()) && !/^\d+$/.test(input.trim())) {
            testMethod('hex', {}, 'Hexadecimal Decoding', "The engine detected valid base-16 (hexadecimal) characters and mapped them back to standard ASCII text.");
        }
        if (/^[\d\s-]+$/.test(input.trim())) {
            testMethod('a1z26', {}, 'A1Z26 Cipher', "The text consisted purely of numbers. We assumed it was an A1Z26 substitution where 1=A, 2=B, 3=C, and converted them back to letters.");
        }
        if (/^[A-Za-z0-9+/=]+$/.test(input.trim())) {
            testMethod('base64', {}, 'Base64 Decoding', "The engine identified the text as a Base64 string (commonly used to encode data over the internet) and decoded it.");
        }

        // 2. Try Classical Substitutions
        // Atbash
        testMethod('atbash', {}, 'Atbash Cipher', "The engine assumed a mirrored alphabet (A=Z, B=Y, C=X) and flipped every letter.");
        
        // Caesar (Brute force 1-25)
        for (let i = 1; i < 26; i++) {
            testMethod('caesar', { shift: i }, `Caesar Shift (+${i})`, `The engine tested all 25 possible shifts. Shift +${i} produced a letter distribution matching standard English frequencies.`);
        }

        if (bestScore > 1.5) { // Threshold to prevent accepting pure garbage
            setResult({
                method: bestMethod,
                text: bestText,
                methodology: methodologyText
            });
        } else {
            setResult({
                method: "Unknown",
                text: "Failed to crack.",
                methodology: "The engine tried Caesar shifts, Atbash, Base64, Hex, Binary, and A1Z26, but none of the outputs mathematically resembled the English language."
            });
        }
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

            {result && (
                <div className="panel" style={{ borderLeft: result.method === "Unknown" ? '4px solid var(--error)' : '4px solid var(--accent)', marginTop: '1rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                        {result.method === "Unknown" ? "ANALYSIS FAILED" : "ANALYSIS COMPLETE"}
                    </h2>
                    
                    <div className="text-sm text-muted mb-6" style={{ lineHeight: 1.6 }}>
                        <strong style={{ color: 'var(--text-primary)' }}>Methodology:</strong><br />
                        {result.methodology}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-muted">
                            {result.method === "Unknown" ? "OUTPUT" : `DECODED RESULT (${result.method})`}
                        </label>
                        <textarea 
                            className={`input font-mono ${result.method === "Unknown" ? 'input-error' : ''}`}
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
