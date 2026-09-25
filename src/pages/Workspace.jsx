import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { ArrowDownUp, Unlock } from 'lucide-react';
import { methods, transform } from '../registry';

export default function Workspace() {
  const { methodId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.pathname.startsWith('/encoder') ? 'encode' : 'decode';
  
  const method = methods.find(m => m.id === methodId);
  if (!method) return <Navigate to={mode === 'encode' ? '/encoder' : '/decoder'} />;

  const [input, setInput] = useState(location.state?.initialInput || '');
  const [settings, setSettings] = useState(method.defaultSettings || {});
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only reset if we didn't come in with initial input from a cross-navigation
    if (!location.state?.initialInput) {
      setInput('');
    }
    setSettings(method.defaultSettings || {});
    setOutput('');
    setError(null);
  }, [methodId, method, location.state]);

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
      <div className="flex gap-4 items-center flex-wrap" style={{ padding: '0.75rem 0' }}>
        {Object.keys(settings).map(key => {
          let label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
          
          if (key.startsWith('rotor')) {
            return (
              <div key={key} className="flex items-center gap-2">
                <label className="text-xs font-bold text-muted uppercase">{key}</label>
                <select 
                  className="input font-mono"
                  value={settings[key]}
                  onChange={(e) => handleSettingChange(key, e.target.value)}
                  style={{ width: '70px', padding: '0.4rem 0.5rem', fontSize: '0.85rem' }}
                >
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                  <option value="V">V</option>
                </select>
              </div>
            );
          }

          if (key.startsWith('start')) {
            return (
              <div key={key} className="flex items-center gap-2">
                <label className="text-xs font-bold text-muted uppercase">{key.replace('start', 'Pos ')}</label>
                <select 
                  className="input font-mono"
                  value={settings[key]}
                  onChange={(e) => handleSettingChange(key, e.target.value)}
                  style={{ width: '60px', padding: '0.4rem 0.5rem', fontSize: '0.85rem' }}
                >
                  {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            );
          }

          return (
            <div key={key} className="flex items-center gap-2">
              <label className="text-xs font-bold text-muted uppercase">{label}</label>
              <input 
                className="input font-mono"
                type={typeof method.defaultSettings[key] === 'number' ? 'number' : 'text'}
                value={settings[key]}
                onChange={(e) => handleSettingChange(key, e.target.value)}
                style={{ width: '120px', padding: '0.4rem 0.5rem', fontSize: '0.85rem' }}
                placeholder={key === 'plugboard' ? 'AB CD EF' : ''}
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
        
        <div className="flex gap-2">
          {mode === 'encode' && output && !error && method.isSelfInverse === false && (
            <button 
              className="btn btn-secondary font-mono text-xs"
              onClick={() => navigate(`/decoder/${method.id}`, { state: { initialInput: output } })}
              title="Take this output and go to Decoder mode"
            >
              <Unlock size={14} /> DECODE
            </button>
          )}
          <button 
            className="btn btn-tertiary font-mono text-xs"
            onClick={handleSwap} 
            disabled={!output || error}
            title="Swap output to input"
          >
            <ArrowDownUp size={14} /> SWAP
          </button>
        </div>
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
