import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { methods } from '../registry';

export default function Library() {
  const { hash } = useLocation();
  const [expandedMethod, setExpandedMethod] = useState(hash ? hash.replace('#', '') : null);

  const toggleExpand = (id) => {
    setExpandedMethod(prev => prev === id ? null : id);
  };

  const groupedMethods = methods.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {});

  return (
    <div className="flex gap-8" style={{ alignItems: 'flex-start', position: 'relative' }}>
      
      {/* Sidebar Navigation */}
      <div style={{ 
        width: '240px', 
        position: 'sticky', 
        top: '2rem', 
        flexShrink: 0, 
        padding: '1.5rem', 
        backgroundColor: 'var(--bg-surface)', 
        borderRadius: '8px', 
        border: '1px solid var(--border-subtle)',
        maxHeight: 'calc(100vh - 4rem)',
        overflowY: 'auto'
      }}>
        <h2 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.5rem', letterSpacing: '1px' }}>
          CONTENTS INDEX
        </h2>
        {Object.entries(groupedMethods).map(([category, catMethods]) => (
          <div key={category} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {category}
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {catMethods.map(m => (
                <li key={m.id}>
                  <a 
                    href={`#${m.id}`} 
                    style={{ 
                      display: 'block',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '4px',
                      backgroundColor: expandedMethod === m.id ? 'var(--accent-muted)' : 'transparent',
                      color: expandedMethod === m.id ? 'var(--accent)' : 'var(--text-primary)', 
                      fontSize: '0.85rem',
                      fontWeight: expandedMethod === m.id ? '600' : '400',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                    onClick={() => setExpandedMethod(m.id)}
                  >
                    {m.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem' }}>
        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-1px', marginBottom: '0.5rem' }}>LEARNING LIBRARY</h1>
          <p className="text-muted" style={{ fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '600px' }}>
            A reference manual for the history, mathematics, and concepts behind the transformations in Cipher Lab.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {methods.map(method => {
            const isExpanded = expandedMethod === method.id;

            return (
              <div key={method.id} id={method.id} style={{ scrollMarginTop: '2rem' }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', letterSpacing: '-0.5px', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{method.name}</h2>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {method.category}
                    </span>
                  </div>
                </div>

                <div className="text-muted" style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem', maxWidth: '700px' }}>
                  {method.learning.short}
                </div>

                {isExpanded && (
                  <div style={{ 
                    marginTop: '1.5rem', 
                    padding: '1.5rem',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px'
                  }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>How it Works</h3>
                    <p style={{ lineHeight: 1.6, marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      {method.learning.detailed}
                    </p>
                    
                    {method.learning.example && (
                      <div className="font-mono text-sm mb-6" style={{ 
                        backgroundColor: 'var(--bg-base)', 
                        padding: '1rem', 
                        borderRadius: '4px',
                        borderLeft: '2px solid var(--accent)',
                        whiteSpace: 'pre-wrap',
                        color: 'var(--text-primary)'
                      }}>
                        {method.learning.example}
                      </div>
                    )}
                    
                    <div className="flex gap-4">
                      {method.category !== 'Hashing' && (
                        <>
                          <Link to={`/encoder/${method.id}`} className="btn btn-secondary text-xs">
                            USE ENCODER
                          </Link>
                          <Link to={`/decoder/${method.id}`} className="btn btn-secondary text-xs">
                            USE DECODER
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {!isExpanded && (
                  <button 
                    onClick={() => toggleExpand(method.id)} 
                    className="text-xs font-bold"
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--accent)', 
                      padding: 0,
                      marginTop: '0.5rem'
                    }}
                  >
                    READ MORE ↓
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Advanced Concepts Section */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '2rem', color: 'var(--text-primary)' }}>
            ADVANCED CONCEPTS (COMING SOON)
          </h2>
          
          <div className="flex flex-col gap-8">
            
            {/* RSA Entry */}
            <div className="panel flex flex-col gap-4">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>RSA (Public-Key Cryptography)</h3>
              
              <div className="text-muted" style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>What is it?</strong><br/>
                RSA is the backbone of all modern internet security. When you see the little "padlock" icon in your browser (HTTPS), you are relying on systems like RSA. Unlike classical ciphers (like Caesar) where you use the <em>same</em> password to lock and unlock the message (Symmetric), RSA uses <em>two different mathematical keys</em> (Asymmetric).
              </div>

              <div className="text-muted" style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>The Layman's Explanation (The Open Padlock)</strong><br/>
                Imagine your <strong>Public Key</strong> is an open padlock, and your <strong>Private Key</strong> is the physical metal key that unlocks it. <br/><br/>
                You can make a million copies of your open padlock and give them to everyone in the world (make it public). If your friend Alice wants to send you a secret message, she puts it in a box and snaps your padlock shut. 
                <br/><br/>
                Here is the magic of RSA: Once the padlock is snapped shut, <em>even Alice cannot open the box anymore</em>. Only YOU can open it, because you are the only person who kept the physical Private Key.
              </div>

              <div className="text-muted" style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>The Math Behind It</strong><br/>
                RSA works because of "prime factorization." It is very easy for a computer to multiply two massive prime numbers together to get a gigantic result. However, if you only give a computer the gigantic result, it is virtually impossible for it to reverse-engineer what the two original prime numbers were. The Public Key is the giant number, and the Private Key contains the two original prime numbers.
              </div>

              <div className="font-mono text-sm" style={{ 
                backgroundColor: 'var(--bg-base)', 
                padding: '1rem', 
                borderRadius: '4px',
                borderLeft: '2px solid var(--accent)',
                whiteSpace: 'pre-wrap',
                color: 'var(--text-primary)',
                marginTop: '0.5rem'
              }}>
                EXAMPLE / APPLICATION:<br/>
                <span style={{ color: 'var(--text-secondary)' }}>
                1. Bob generates a Public Key (Padlock) and Private Key (Physical Key).<br/>
                2. Bob posts his Public Key on his Twitter profile.<br/>
                3. Alice copies the Public Key, encrypts her message "HELLO", and sends the gibberish to Bob.<br/>
                4. A hacker intercepts the gibberish, but cannot read it without the Private Key.<br/>
                5. Bob receives the gibberish, uses his Private Key, and reads "HELLO".
                </span>
              </div>
            </div>

            {/* Steganography Entry */}
            <div className="panel flex flex-col gap-4">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>Steganography</h3>
              
              <div className="text-muted" style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>What is it?</strong><br/>
                While standard cryptography focuses on turning a message into unreadable gibberish, <strong>Steganography</strong> focuses on keeping the very <em>existence</em> of the message a secret. 
              </div>

              <div className="text-muted" style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>The Layman's Explanation (Invisible Ink)</strong><br/>
                If a prison guard inspects a letter going to an inmate and sees a page full of random letters (a cipher), they will immediately confiscate it because they know it's a secret code. <br/><br/>
                But what if you write a totally normal, boring letter to the inmate about the weather, but you write a second secret message between the lines using invisible ink? The guard inspects the letter, thinks it's boring, and lets it through. That is Steganography: hiding a secret inside something completely innocent.
              </div>

              <div className="text-muted" style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>The Technical Application (LSB Image Hiding)</strong><br/>
                In the digital world, we hide text inside the pixels of images (like a normal photo of a cat). Every pixel is made of Red, Green, and Blue colors, measured on a scale from 0 to 255. <br/><br/>
                In binary, 255 is 11111111. If we change that value to 254 (11111110), the color of the pixel changes by 1/255th. The human eye physically cannot see the difference between pure red and 99.6% pure red. By slightly tweaking the very last digit (the Least Significant Bit) of thousands of pixels in the cat photo, we can secretly store thousands of 1s and 0s (binary text) inside the image without anyone ever knowing.
              </div>

              <div className="font-mono text-sm" style={{ 
                backgroundColor: 'var(--bg-base)', 
                padding: '1rem', 
                borderRadius: '4px',
                borderLeft: '2px solid var(--accent)',
                whiteSpace: 'pre-wrap',
                color: 'var(--text-primary)',
                marginTop: '0.5rem'
              }}>
                EXAMPLE / APPLICATION:<br/>
                <span style={{ color: 'var(--text-secondary)' }}>
                1. You have a photo of a landscape.<br/>
                2. You use Steganography to embed a secret document inside the image.<br/>
                3. You post the image on a public forum.<br/>
                4. Everyone else just sees a nice landscape.<br/>
                5. Your friend downloads the image, runs it through a Steganography decoder, and extracts the secret document.
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
