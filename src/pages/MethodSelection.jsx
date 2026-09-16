import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { methods } from '../registry';

export default function MethodSelection() {
  const location = useLocation();
  const isEncoder = location.pathname.startsWith('/encoder');
  const basePath = isEncoder ? '/encoder' : '/decoder';
  const title = isEncoder ? 'Select Encoder Method' : 'Select Decoder Method';

  // Group methods by category
  const groupedMethods = methods.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {});

  const renderDifficulty = (score) => {
    const max = 10;
    const filled = Math.min(max, Math.max(1, score));
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'monospace' }}>
        <span style={{ letterSpacing: '-2px' }}>
          {'█'.repeat(filled)}
          <span style={{ opacity: 0.3 }}>{'█'.repeat(max - filled)}</span>
        </span>
        <span>{filled}/10</span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{title}</h1>
        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', display: 'inline-block' }}>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>CHARACTER SUPPORT</h3>
          <p style={{ fontSize: '0.85rem' }}>✓ = transforms this type | ✕ = ignores/passes through</p>
        </div>
      </div>

      {Object.entries(groupedMethods).map(([category, catMethods]) => (
        <div key={category} style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            {category}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem'
          }}>
            {catMethods.map(method => (
              <Link 
                key={method.id} 
                to={`${basePath}/${method.id}`} 
                className="card"
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'inherit' }}
              >
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{method.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{method.description}</p>
                </div>
                
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    <strong>Difficulty to crack:</strong>
                    {renderDifficulty(method.difficulty)}
                  </div>
                  
                  <div style={{ fontSize: '0.8rem' }}>
                    <strong>Support:</strong>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      <span>Letters {method.support.letters ? '✓' : '✕'}</span>
                      <span>Numbers {method.support.numbers ? '✓' : '✕'}</span>
                      <span>Symbols {method.support.symbols ? '✓' : '✕'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
