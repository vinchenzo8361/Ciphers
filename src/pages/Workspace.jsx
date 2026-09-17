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
    setInput('');
    setSettings(method.defaultSettings || {});
    setOutput('');
    setError(null);
  }, [methodId, method]);

  useEffect(() => {
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
    if (output && !error) {
      setInput(output);
    }
  };

  const renderSettings = () => {
    if (Object.keys(settings).length === 0) return null;

    return (
      <div className="flex gap-4 items-center" style={{ padding: '0.75rem 0' }}>
        {Object.keys(settings).map(key => {
          let label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
          return (
            <div key={key} className="flex items-center gap-2">
              <label className="text-xs font-bold text-muted uppercase">{label}</label>
              <input 
                className="input"
                type={typeof method.defaultSettings[key] === 'number' ? 'number' : 'text'}
                value={settings[key]}
                onChange={(e) => handleSettingChange(key, e.target.value)}
                style={{ width: '120px', padding: '0.4rem 0.5rem', fontSize: '0.85rem' }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-1px', marginBottom: '0.5rem' }}>
          {method.name.toUpperCase()}
        </h1>
        <p className="text-muted" style={{ fontSize: '0.95rem' }}>{method.learning?.short}</p>
        
        <div className="flex items-center gap-4 mt-4">
          <div className="font-mono text-xs text-muted" style={{ background: 'var(--bg-surface-raised)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
            DIFFICULTY: {method.difficulty}/10
          </div>
          <Link to={`/library#${method.id}`} className="text-xs font-bold" style={{ textDecoration: 'underline' }}>
            LIBRARY REFERENCE
          </Link>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase text-muted">INPUT</label>
        <textarea 
          className={`input ${mode === 'decode' ? 'font-mono' : ''}`}
          rows={6} 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type or paste text here..."
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Settings Bar between Input and Output */}
      <div className="flex items-center justify-between" style={{ borderTop: '1px dashed var(--border-subtle)', borderBottom: '1px dashed var(--border-subtle)' }}>
        <div style={{ flex: 1 }}>
          {renderSettings()}
        </div>
        
        <button 
          className="btn btn-tertiary font-mono text-xs"
          onClick={handleSwap} 
          disabled={!output || error}
          title="Swap output to input"
        >
          <ArrowDownUp size={14} /> SWAP
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase text-muted">OUTPUT</label>
        <textarea 
          className={`input ${error ? 'input-error' : ''} ${mode === 'encode' ? 'font-mono' : ''}`}
          rows={6} 
          value={error || output} 
          readOnly 
          placeholder={error ? "" : "Result will appear here..."}
          style={{ resize: 'vertical' }}
        />
      </div>

    </div>
  );
}
