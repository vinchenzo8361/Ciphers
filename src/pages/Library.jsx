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
    <div className="flex gap-8" style={{ alignItems: 'flex-start' }}>
      
      {/* Sidebar Navigation */}
      <div style={{ width: '220px', position: 'sticky', top: '2rem', flexShrink: 0, paddingRight: '1rem', borderRight: '1px solid var(--border-subtle)' }}>
        <h2 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.5rem', letterSpacing: '1px' }}>
          INDEX
        </h2>
        {Object.entries(groupedMethods).map(([category, catMethods]) => (
          <div key={category} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {category}
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {catMethods.map(m => (
                <li key={m.id}>
                  <a 
                    href={`#${m.id}`} 
                    style={{ 
                      color: expandedMethod === m.id ? 'var(--accent)' : 'var(--text-primary)', 
                      fontSize: '0.85rem',
                      fontWeight: expandedMethod === m.id ? '600' : '400',
                      textDecoration: 'none',
                      transition: 'color 0.15s'
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
                    <p style={{ lineHeight: 1.6, marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      {method.learning.detailed}
                    </p>
                    
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
      </div>
    </div>
  );
}
