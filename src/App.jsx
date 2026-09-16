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
            
            <Route path="playground" element={<Playground />} />
            
            <Route path="library" element={<Library />} />
            
            {/* Fallback for RSA "COMING SOON" */}
            <Route path="rsa" element={
              <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>RSA</h1>
                <h2 style={{ color: 'var(--accent)', marginBottom: '2rem' }}>COMING SOON</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  RSA is a public-key cryptosystem. Unlike the classical ciphers on this site which use the same key to encrypt and decrypt, RSA uses a public key to encrypt data, and a different, private key to decrypt it.
                </p>
                <div style={{ marginTop: '2rem' }}>
                  <a href="/library" style={{ textDecoration: 'underline' }}>For more details, visit the Learning Library.</a>
                </div>
              </div>
            } />

            {/* Fallback for Steganography "COMING SOON" */}
            <Route path="steganography" element={
              <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>STEGANOGRAPHY</h1>
                <h2 style={{ color: 'var(--accent)', marginBottom: '2rem' }}>COMING SOON</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  Steganography is the practice of concealing a message within another medium (like an image or an audio file) so that no one even knows a secret message exists.
                </p>
                <div style={{ marginTop: '2rem' }}>
                  <a href="/library" style={{ textDecoration: 'underline' }}>For more details, visit the Learning Library.</a>
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
