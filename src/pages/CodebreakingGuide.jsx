import React from 'react';
import { ShieldCheck, Target, Eye, KeyRound, Search, BarChart3, LayoutGrid } from 'lucide-react';

export default function CodebreakingGuide() {
  const sections = [
    {
      title: "Frequency Analysis (Single Alphabet)",
      icon: <BarChart3 size={24} className="text-accent" />,
      content: "In standard English text, letters do not appear uniformly. The letter 'E' is the most common, accounting for about 12.7% of all letters. Following 'E' are 'T' (9%), 'A' (8%), 'O' (7.5%), 'I' (7%), 'N' (6.7%), and 'S' (6.3%). Conversely, 'Z', 'Q', 'J', and 'X' are exceedingly rare. If a ciphertext uses a simple substitution (one letter replaces another consistently), you can simply count the frequency of the letters in the ciphertext. If 'X' appears 13% of the time, 'X' is almost certainly 'E'. By mapping the most frequent ciphertext letters to ETAOIN SHRDLU, the hidden message quickly unravels.",
      example: "CIPHERTEXT: KHOOR ZRUOG\n'O' appears 3 times. If we guess O = E, the shift is -10. But then H (-10) = X (not likely). \nIf we guess O = L, the shift is -3. Then H (-3) = E. K (-3) = H. (Works!)"
    },
    {
      title: "Word Pattern & Structure Analysis",
      icon: <Search size={24} className="text-accent" />,
      content: "If spaces and punctuation are preserved in the ciphertext, short words are the ultimate vulnerability. In English, there are only two common 1-letter words: 'A' and 'I'. If you see a single-letter ciphertext word, you immediately have two strong guesses. Furthermore, the most common 3-letter word is 'THE'. If you see a repeating 3-letter word (e.g., 'XYZ'), guessing 'XYZ' = 'THE' gives you three letters instantly. This rapidly cascades into cracking the rest of the text.",
      example: "CIPHERTEXT: AB CDE FGBH\nIf 'AB' is a 2-letter word, it could be 'IT', 'IS', 'TO', 'OF'.\nIf 'CDE' repeats frequently, it might be 'THE'. If C=T, D=H, E=E, we can substitute them back into the rest of the puzzle."
    },
    {
      title: "Brute Force Attack",
      icon: <Target size={24} className="text-accent" />,
      content: "When the mathematical 'keyspace' (the number of possible keys) is small, the most effective attack is simply trying every single possibility until the output makes sense. A Caesar cipher only has 25 possible keys. A computer can test all 25 shifts in less than a millisecond, scoring each output against an English dictionary or frequency table to automatically select the correct one.",
      example: "Our built-in Codebreaker tool uses Brute Force on Caesar ciphers. It tests 1 through 25, runs Frequency Analysis on the output, and returns the highest scoring shift."
    },
    {
      title: "Known Plaintext Attack (Crib Dragging)",
      icon: <ShieldCheck size={24} className="text-accent" />,
      content: "Often, an attacker knows or can guess a portion of the original message. In cryptography, this guessed word is called a 'crib'. For example, if you know a military dispatch always ends with 'END OF MESSAGE', or an email begins with 'DEAR', you can slide (or 'drag') that known word across the ciphertext until the mathematical relationship between the letters matches a known cipher structure. This was crucial in cracking the Enigma machine during WWII.",
      example: "CIPHERTEXT: UIJT JT UIF FOE\nCRIB GUESS: THE END\nSlide it to the end: 'UIF FOE'. U->T (-1), I->H (-1), F->E (-1). The cipher is a Caesar -1 shift."
    },
    {
      title: "Kasiski Examination (Polyalphabetic)",
      icon: <LayoutGrid size={24} className="text-accent" />,
      content: "Simple frequency analysis fails against the Vigenère cipher because the same letter shifts differently depending on the key. However, in 1863, Friedrich Kasiski published a method to break it. He noticed that repeated words in the plaintext, when encrypted with the same parts of the repeating key, produce repeated sequences in the ciphertext. By measuring the distance (number of letters) between these repeating ciphertext blocks, you can find the length of the secret key by calculating the greatest common divisor of those distances.",
      example: "If 'XYZ' repeats in the ciphertext at distances of 20, 30, and 45 letters apart, the greatest common divisor is 5. The secret key is almost certainly 5 letters long. You can then break it down into 5 interleaved Caesar ciphers!"
    },
    {
      title: "Index of Coincidence (I.C.)",
      icon: <KeyRound size={24} className="text-accent" />,
      content: "The Index of Coincidence is a statistical measure of how 'random' a text is. It calculates the probability that two randomly selected letters from the text are identical. Standard English has an I.C. of about 1.73 (or 0.066 depending on normalization). Completely random gibberish has an I.C. of 1.0 (or 0.038). By calculating the I.C. of a ciphertext, a codebreaker can instantly mathematically prove whether the cipher uses a single alphabet (like Caesar) or multiple alphabets (like Vigenère) without even looking at the letters.",
      example: "High I.C. (≈1.7) -> It's a simple substitution. Proceed with Frequency Analysis.\nLow I.C. (≈1.0) -> It's polyalphabetic. Proceed with Kasiski Examination to find the key length."
    }
  ];

  return (
    <div className="flex flex-col gap-8" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-1px', marginBottom: '0.5rem' }}>CODEBREAKING GUIDE</h1>
        <p className="text-muted" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
          Learn the foundational techniques, statistical models, and historical methods used by cryptanalysts to crack ciphers.
        </p>
      </div>

      <div className="flex flex-col gap-8 pb-8">
        {sections.map((section, idx) => (
          <div key={idx} className="panel flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-muted)', padding: '0.5rem', borderRadius: '8px' }}>
                {section.icon}
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{section.title}</h2>
            </div>
            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {section.content}
            </p>
            <div 
              className="font-mono text-sm" 
              style={{ 
                backgroundColor: 'var(--bg-base)', 
                padding: '1.25rem', 
                borderRadius: '6px',
                borderLeft: '3px solid var(--accent)',
                whiteSpace: 'pre-wrap',
                color: 'var(--text-primary)',
                lineHeight: 1.6
              }}
            >
              <strong style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>EXAMPLE / APPLICATION:</strong><br/>
              <span style={{ color: 'var(--text-secondary)' }}>{section.example}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
