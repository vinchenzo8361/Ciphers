import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { methods } from '../registry';
import { BookOpen } from 'lucide-react';

export default function Library() {
  const { hash } = useLocation();
  const [expandedMethod, setExpandedMethod] = useState(hash ? hash.replace('#', '') : null);

  const toggleExpand = (id) => {
    setExpandedMethod(prev => prev === id ? null : id);
  };

  // Group methods for the navigation sidebar
  const groupedMethods = methods.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      {/* Sidebar Navigation */}
      <div style={{ width: '250px', position: 'sticky', top: '2rem', flexShrink: 0 }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.25rem' }}>
          <BookOpen size={20} /> Index
        </h2>
        {Object.entries(groupedMethods).map(([category, catMethods]) => (
          <div key={category} style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{category}</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {catMethods.map(m => (
                <li key={m.id}>
                  <a 
                    href={`#${m.id}`} 
                    style={{ 
                      color: 'var(--text-primary)', 
                      fontSize: '0.95rem',
                      fontWeight: expandedMethod === m.id ? 'bold' : 'normal',
                      textDecoration: 'none'
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>LEARNING LIBRARY</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Explore the history, math, and concepts behind the transformations in Cipher Lab.
          </p>
        </div>

        {methods.map(method => {
          const isExpanded = expandedMethod === method.id;

          return (
            <div key={method.id} id={method.id} className="card" style={{ scrollMarginTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{method.name}</h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {method.category}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}><strong>Difficulty:</strong> {method.difficulty}/10</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Support: {method.support.letters ? 'L ' : ''}{method.support.numbers ? 'N ' : ''}{method.support.symbols ? 'S' : ''}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                {method.learning.short}
              </p>

              {isExpanded && (
                <div style={{ 
                  marginTop: '1.5rem', 
                  paddingTop: '1.5rem', 
                  borderTop: '1px solid var(--border)',
                  animation: 'fadeIn 0.3s ease-in-out'
                }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>How it Works</h3>
                  <p style={{ lineHeight: 1.6, marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    {method.learning.detailed}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to={`/encoder/${method.id}`} className="btn" style={{ fontSize: '0.9rem' }}>
                      USE IN ENCODER
                    </Link>
                    <Link to={`/decoder/${method.id}`} className="btn btn-secondary" style={{ fontSize: '0.9rem' }}>
                      USE IN DECODER
                    </Link>
                  </div>
                </div>
              )}

              {!isExpanded && (
                <button 
                  onClick={() => toggleExpand(method.id)} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--accent)', 
                    fontWeight: 'bold', 
                    fontSize: '0.9rem',
                    textDecoration: 'underline'
                  }}
                >
                  MORE DETAILS
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
