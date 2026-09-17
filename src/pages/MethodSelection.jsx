import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { methods } from '../registry';

export default function MethodSelection() {
  const location = useLocation();
  const isEncoder = location.pathname.startsWith('/encoder');
  const basePath = isEncoder ? '/encoder' : '/decoder';
  const title = isEncoder ? 'ENCODER' : 'DECODER';
  const subtitle = isEncoder ? 'Choose a method to transform your text.' : 'Turn encoded text back into readable text.';

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
      <div className="flex items-center gap-1 font-mono text-xs">
        <span style={{ letterSpacing: '-1px', color: 'var(--text-primary)' }}>
          {'█'.repeat(filled)}
          <span style={{ color: 'var(--border-strong)' }}>{'█'.repeat(max - filled)}</span>
        </span>
        <span style={{ marginLeft: '4px', color: 'var(--text-secondary)' }}>{filled}/10</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-4">
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-1px', marginBottom: '0.25rem' }}>{title}</h1>
        <p className="text-muted mb-4">{subtitle}</p>
        
        <div style={{ display: 'inline-flex', background: 'var(--bg-surface-raised)', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
          <span className="font-mono text-xs text-muted">
            <strong style={{ color: 'var(--text-primary)' }}>SUPPORT:</strong> ✓ = transforms this type | ✕ = ignores/passes through
          </span>
        </div>
      </div>

      {Object.entries(groupedMethods).map(([category, catMethods]) => (
        <div key={category}>
          <h2 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            {category}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {catMethods.map(method => (
              <Link 
                key={method.id} 
                to={`${basePath}/${method.id}`} 
                className="panel panel-interactive flex flex-col gap-4"
                style={{ color: 'inherit', textDecoration: 'none', padding: '1rem' }}
              >
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.25rem', letterSpacing: '-0.25px' }}>{method.name.toUpperCase()}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{method.description}</p>
                </div>
                
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.15rem' }}>CRACK DIFFICULTY</div>
                    {renderDifficulty(method.difficulty)}
                  </div>
                  
                  <div style={{ fontSize: '0.7rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    <span>L {method.support.letters ? '✓' : '✕'}</span>
                    <span>N {method.support.numbers ? '✓' : '✕'}</span>
                    <span>S {method.support.symbols ? '✓' : '✕'}</span>
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
