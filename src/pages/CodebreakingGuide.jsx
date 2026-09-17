import React from 'react';
import { ShieldCheck, Target, Eye, KeyRound } from 'lucide-react';

export default function CodebreakingGuide() {
  const sections = [
    {
      title: "Frequency Analysis",
      icon: <Eye size={24} className="text-accent" />,
      content: "In any language, some letters are used more often than others. In English, 'E', 'T', and 'A' are the most common letters. If you are analyzing a substitution cipher (like Caesar) and you see that the letter 'X' appears 15% of the time, there is a very high probability that 'X' represents 'E'.",
      example: "CIPHERTEXT: KHOOR ZRUOG\nMost common letter: O (appears 3 times).\nAssume O = E, then the shift is -10. (Doesn't work for H=R)\nAssume O = L, shift is -3. (Works! H = E, R = O, etc.)"
    },
    {
      title: "Brute Force Attack",
      icon: <Target size={24} className="text-accent" />,
      content: "When a cipher has a small number of possible keys, the easiest way to break it is simply to try every single one. A Caesar cipher only has 25 possible shifts, making it trivial to brute-force.",
      example: "You can see this in action in our Codebreaker tool. It instantly calculates all 25 shifts and mathematically scores which one looks the most like English."
    },
    {
      title: "Known Plaintext Attack",
      icon: <ShieldCheck size={24} className="text-accent" />,
      content: "If you know (or can guess) part of the hidden message, you can work backwards to find the key. For example, if you know an encrypted email ends with 'Sincerely', you can align those letters with the ciphertext at the end to figure out the substitution rule.",
      example: "CIPHERTEXT: ... UIJT JT UIF FOE\nGUESS: ... THIS IS THE END\nRESULT: T shifted to U (+1). The shift is +1."
    },
    {
      title: "Index of Coincidence",
      icon: <KeyRound size={24} className="text-accent" />,
      content: "A slightly more advanced mathematical technique used to determine if a cipher uses one alphabet (like Caesar) or multiple alphabets (like Vigenère). It measures how 'random' the text looks. Standard English has an I.C. of about 1.73. Random garbage has an I.C. of 1.0. If the I.C. is high, it's likely a simple substitution.",
      example: "Used extensively during WWII to break complex polyalphabetic ciphers."
    }
  ];

  return (
    <div className="flex flex-col gap-8" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-1px', marginBottom: '0.25rem' }}>CODEBREAKING GUIDE</h1>
        <p className="text-muted">Learn the foundational techniques used to crack classical ciphers.</p>
      </div>

      <div className="flex flex-col gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="panel flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div style={{ color: 'var(--accent)' }}>{section.icon}</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{section.title}</h2>
            </div>
            <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              {section.content}
            </p>
            <div 
              className="font-mono text-sm" 
              style={{ 
                backgroundColor: 'var(--bg-base)', 
                padding: '1rem', 
                borderRadius: '4px',
                borderLeft: '2px solid var(--accent-muted)',
                whiteSpace: 'pre-wrap',
                color: 'var(--text-primary)'
              }}
            >
              <strong style={{ color: 'var(--text-secondary)' }}>EXAMPLE / APPLICATION:</strong><br/>
              {section.example}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
