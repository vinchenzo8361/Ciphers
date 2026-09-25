import React, { useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Lock } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

export default function Layout() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const navLinks = [
    { name: 'Encoder', path: '/encoder' },
    { name: 'Decoder', path: '/decoder' },
    { name: 'Playground', path: '/playground' },
    { name: 'Library', path: '/library' },
    { name: 'Codebreaker', path: '/codebreaker' },
    { name: 'Enigma Machine', path: '/enigma-machine' },
    { name: 'Password Creator', path: '/password-creator' }
  ];

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <header style={{ 
        borderBottom: '1px solid var(--border-subtle)', 
        backgroundColor: 'var(--bg-surface)',
        padding: '0.75rem 2rem'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontWeight: '600', letterSpacing: '-0.5px' }}>
            <Lock size={18} color="var(--accent)" />
            <span>CIPHER LAB</span>
          </Link>
          
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.path}
                style={{ 
                  color: location.pathname.startsWith(link.path) ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  transition: 'color 0.15s'
                }}
              >
                {link.name}
              </Link>
            ))}
            <button 
              onClick={toggleTheme} 
              className="btn-tertiary"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </nav>
        </div>
      </header>
      
      <main className="container" style={{ flex: 1, width: '100%' }}>
        <Outlet />
      </main>
      
      <footer style={{ 
        borderTop: '1px solid var(--border-subtle)', 
        padding: '1.5rem', 
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-mono)'
      }}>
        cipher-lab // {new Date().getFullYear()}
      </footer>
    </div>
  );
}
