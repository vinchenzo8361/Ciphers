import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

import Layout from './components/Layout';
import Home from './pages/Home';
import MethodSelection from './pages/MethodSelection';
import Workspace from './pages/Workspace';
import Playground from './pages/Playground';
import Library from './pages/Library';
import Codebreaker from './pages/Codebreaker';
import PasswordCreator from './pages/PasswordCreator';
import CodebreakingGuide from './pages/CodebreakingGuide';
import EnigmaCracker from './pages/EnigmaCracker';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            
            <Route path="encoder">
              <Route index element={<MethodSelection />} />
              <Route path=":methodId" element={<Workspace />} />
            </Route>

            <Route path="decoder">
              <Route index element={<MethodSelection />} />
              <Route path=":methodId" element={<Workspace />} />
            </Route>

            <Route path="codebreaker" element={<Codebreaker />} />
            <Route path="enigma-cracker" element={<EnigmaCracker />} />
            <Route path="password-creator" element={<PasswordCreator />} />
            <Route path="codebreaking-guide" element={<CodebreakingGuide />} />
            
            <Route path="playground" element={<Playground />} />
            
            <Route path="library" element={<Library />} />
            
            {/* Fallback for RSA "COMING SOON" */}
            <Route path="rsa" element={
              <div className="flex flex-col gap-6" style={{ maxWidth: '600px', margin: '4rem auto' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-1px', marginBottom: '0.5rem' }}>RSA CRYPTOGRAPHY</h1>
                  <span className="font-mono text-xs font-bold" style={{ color: 'var(--accent)', background: 'var(--accent-muted)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>STATUS: IN DEVELOPMENT</span>
                </div>
                <div className="panel">
                  <p className="text-muted" style={{ lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                    RSA is a public-key cryptosystem. Unlike the classical ciphers on this site which use the same key to encrypt and decrypt, RSA uses a public key to encrypt data, and a different, private key to decrypt it.
                  </p>
                  <a href="/library" className="btn btn-secondary text-xs">VIEW IN LIBRARY</a>
                </div>
              </div>
            } />

            {/* Fallback for Steganography "COMING SOON" */}
            <Route path="steganography" element={
              <div className="flex flex-col gap-6" style={{ maxWidth: '600px', margin: '4rem auto' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-1px', marginBottom: '0.5rem' }}>STEGANOGRAPHY</h1>
                  <span className="font-mono text-xs font-bold" style={{ color: 'var(--accent)', background: 'var(--accent-muted)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>STATUS: IN DEVELOPMENT</span>
                </div>
                <div className="panel">
                  <p className="text-muted" style={{ lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                    Steganography is the practice of concealing a message within another medium (like an image or an audio file) so that no one even knows a secret message exists.
                  </p>
                  <a href="/library" className="btn btn-secondary text-xs">VIEW IN LIBRARY</a>
                </div>
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
