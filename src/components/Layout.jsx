import React, { useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Lock } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

export default function Layout() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Encoder', path: '/encoder' },
    { name: 'Decoder', path: '/decoder' },
    { name: 'Playground', path: '/playground' },
    { name: 'Learning Library', path: '/library' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ 
        borderBottom: '1px solid var(--border)', 
        backgroundColor: 'var(--bg-secondary)',
        padding: '1rem 2rem'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.25rem' }}>
            <Lock size={24} color="var(--accent)" />
            CIPHER LAB
          </Link>
          
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.path}
                style={{ 
                  color: location.pathname === link.path || (location.pathname.startsWith(link.path) && link.path !== '/') ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }}
              >
                {link.name}
              </Link>
            ))}
            <button 
              onClick={toggleTheme} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                borderRadius: '50%'
              }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>
        </div>
      </header>
      
      <main className="container" style={{ flex: 1, width: '100%' }}>
        <Outlet />
      </main>
      
      <footer style={{ 
        borderTop: '1px solid var(--border)', 
        padding: '2rem', 
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem'
      }}>
        Cipher Lab Sandbox &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
