import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, Navigate } from 'react-router-dom';
import { ArrowDownUp } from 'lucide-react';
import { methods, transform } from '../registry';

export default function Workspace() {
  const { methodId } = useParams();
  const location = useLocation();
  const mode = location.pathname.startsWith('/encoder') ? 'encode' : 'decode';
  
  const method = methods.find(m => m.id === methodId);
  if (!method) return <Navigate to={mode === 'encode' ? '/encoder' : '/decoder'} />;

  const [input, setInput] = useState('');
  const [settings, setSettings] = useState(method.defaultSettings || {});
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when method changes
    setInput('');
    setSettings(method.defaultSettings || {});
    setOutput('');
    setError(null);
  }, [methodId, method]);

  useEffect(() => {
    // Recalculate output whenever input or settings change
    if (!input) {
      setOutput('');
      setError(null);
      return;
    }

    const result = transform(method.id, input, settings, mode);
    if (result.success) {
      setOutput(result.output);
      setError(null);
    } else {
      setOutput('');
      setError(result.error);
    }
  }, [input, settings, method.id, mode]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSwap = () => {
    if (output) {
      setInput(output);
    }
  };

  const renderSettings = () => {
    if (Object.keys(settings).length === 0) return null;

    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
        {Object.keys(settings).map(key => {
          let label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: '150px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{label}</label>
              <input 
                className="input"
                type={typeof method.defaultSettings[key] === 'number' ? 'number' : 'text'}
                value={settings[key]}
                onChange={(e) => handleSettingChange(key, e.target.value)}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', textTransform: 'uppercase' }}>{method.name}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{method.learning?.short}</p>
        
        <div style={{ display: 'inline-block', background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', border: '1px solid var(--border)' }}>
          <span style={{ opacity: 0.7 }}>Difficulty:</span> {method.difficulty}/10
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <Link to={`/library#${method.id}`} style={{ fontSize: '0.9rem', textDecoration: 'underline' }}>
            Check the Learning Library for more details.
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 'bold' }}>INPUT</label>
          <textarea 
            className="input" 
            rows={5} 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Type your message here..."
          />
        </div>

        {Object.keys(settings).length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold' }}>METHOD SETTINGS</label>
            {renderSettings()}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleSwap} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
            disabled={!output}
          >
            <ArrowDownUp size={16} /> SWAP
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 'bold' }}>OUTPUT</label>
          <textarea 
            className="input" 
            rows={5} 
            value={error || output} 
            readOnly 
            style={{ 
              backgroundColor: error ? 'var(--error-bg)' : 'var(--bg-secondary)',
              color: error ? 'var(--error-text)' : 'inherit',
              borderColor: error ? 'var(--error-text)' : 'var(--input-border)'
            }}
            placeholder={error ? "" : "Result will appear here..."}
          />
        </div>
      </div>
    </div>
  );
}
