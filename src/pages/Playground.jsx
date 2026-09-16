import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { X, GripVertical, Plus, ArrowDownUp, Download, Upload, Copy } from 'lucide-react';
import { methods, transform } from '../registry';

export default function Playground() {
  const [mode, setMode] = useState('encode');
  const [rootInput, setRootInput] = useState('');
  const [chain, setChain] = useState([]); // [{ id: 'unique_id', methodId: 'caesar', settings: {} }]

  // Generate unique IDs for DND
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addMethod = (methodId) => {
    if (chain.length >= 10) return;
    const method = methods.find(m => m.id === methodId);
    if (!method) return;

    setChain([...chain, { 
      id: generateId(), 
      methodId, 
      settings: { ...method.defaultSettings } 
    }]);
  };

  const removeMethod = (index) => {
    const newChain = [...chain];
    newChain.splice(index, 1);
    setChain(newChain);
  };

  const updateSettings = (index, key, value) => {
    const newChain = [...chain];
    newChain[index].settings[key] = value;
    setChain(newChain);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newChain = Array.from(chain);
    const [reorderedItem] = newChain.splice(result.source.index, 1);
    newChain.splice(result.destination.index, 0, reorderedItem);
    setChain(newChain);
  };

  // Compute the outputs progressively
  const computedSteps = useMemo(() => {
    let currentInput = rootInput;
    const steps = [];

    for (let i = 0; i < chain.length; i++) {
      const stepConfig = chain[i];
      const method = methods.find(m => m.id === stepConfig.methodId);
      
      let stepResult = { 
        method, 
        config: stepConfig, 
        input: currentInput, 
        output: '', 
        error: null 
      };

      if (!currentInput) {
        steps.push(stepResult);
        continue; // Pass empty string down the chain
      }

      if (!method) {
        stepResult.error = "Method not found";
      } else {
        const res = transform(method.id, currentInput, stepConfig.settings, mode);
        if (res.success) {
          stepResult.output = res.output;
          currentInput = res.output;
        } else {
          stepResult.error = res.error;
          currentInput = ""; // Break the chain with empty input
        }
      }
      steps.push(stepResult);
    }

    return { steps, finalOutput: currentInput };
  }, [rootInput, chain, mode]);

  const handleSwap = () => {
    if (computedSteps.finalOutput) {
      setRootInput(computedSteps.finalOutput);
    }
  };

  const handleReverseChain = () => {
    const newChain = [...chain].reverse();
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setChain(newChain);
  };

  const handleSave = () => {
    const data = {
      version: 1,
      mode,
      rootInput,
      chain: chain.map(c => ({ methodId: c.methodId, settings: c.settings }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playground.cipherlab`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.mode) setMode(data.mode);
        if (data.rootInput !== undefined) setRootInput(data.rootInput);
        if (data.chain) {
          setChain(data.chain.map(c => ({
            id: generateId(),
            methodId: c.methodId,
            settings: c.settings
          })));
        }
      } catch (err) {
        alert("Failed to parse .cipherlab file");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset input
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>PLAYGROUND</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Build custom transformation pipelines. {chain.length} / 10 methods selected.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <button 
              onClick={() => setMode('encode')}
              style={{ padding: '0.5rem 1rem', border: 'none', background: mode === 'encode' ? 'var(--accent)' : 'transparent', color: mode === 'encode' ? 'white' : 'var(--text-primary)', fontWeight: 'bold' }}
            >
              ENCODE
            </button>
            <button 
              onClick={() => setMode('decode')}
              style={{ padding: '0.5rem 1rem', border: 'none', background: mode === 'decode' ? 'var(--accent)' : 'transparent', color: mode === 'decode' ? 'white' : 'var(--text-primary)', fontWeight: 'bold' }}
            >
              DECODE
            </button>
          </div>
          
          <button className="btn btn-secondary" onClick={handleSave} aria-label="Save Configuration" title="Save Configuration">
            <Download size={18} />
          </button>
          
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }} aria-label="Load Configuration" title="Load Configuration">
            <Upload size={18} />
            <input type="file" accept=".cipherlab,.json" onChange={handleLoad} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Main Input */}
      <div className="card">
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>MAIN INPUT</label>
        <textarea 
          className="input" 
          rows={3} 
          value={rootInput}
          onChange={(e) => setRootInput(e.target.value)}
          placeholder="Start your chain here..."
        />
      </div>

      {/* Swap / Reverse Tools */}
      {chain.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={handleSwap} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowDownUp size={16} /> SWAP MAIN INPUT/OUTPUT
          </button>
          {chain.length > 1 && (
            <button className="btn btn-secondary" onClick={handleReverseChain} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowDownUp size={16} /> REVERSE CHAIN
            </button>
          )}
        </div>
      )}

      {/* Chain Steps */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="chain">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {computedSteps.steps.map((step, index) => (
                <Draggable key={step.config.id} draggableId={step.config.id} index={index}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="card"
                      style={{ 
                        ...provided.draggableProps.style,
                        position: 'relative',
                        borderLeft: '4px solid var(--accent)',
                        opacity: snapshot.isDragging ? 0.8 : 1
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div {...provided.dragHandleProps} style={{ cursor: 'grab', color: 'var(--text-secondary)' }}>
                            <GripVertical size={20} />
                          </div>
                          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                            <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>STEP {index + 1}</span> 
                            {step.method.name}
                          </h2>
                        </div>
                        <button 
                          onClick={() => removeMethod(index)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {/* Intermediate Input */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>INPUT (FROM STEP {index})</label>
                          <textarea 
                            className="input" 
                            rows={2} 
                            value={step.input} 
                            readOnly 
                            style={{ backgroundColor: 'var(--bg-primary)' }}
                          />
                        </div>
                        
                        {/* Intermediate Output */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>OUTPUT</label>
                            {step.output && (
                              <button onClick={() => handleCopy(step.output)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                                <Copy size={12} /> COPY
                              </button>
                            )}
                          </div>
                          <textarea 
                            className="input" 
                            rows={2} 
                            value={step.error || step.output} 
                            readOnly 
                            style={{ 
                              backgroundColor: step.error ? 'var(--error-bg)' : 'var(--bg-primary)',
                              color: step.error ? 'var(--error-text)' : 'inherit',
                              borderColor: step.error ? 'var(--error-text)' : 'var(--border)'
                            }}
                          />
                        </div>
                      </div>

                      {/* Settings */}
                      {Object.keys(step.config.settings).length > 0 && (
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          {Object.keys(step.config.settings).map(key => (
                            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: '120px' }}>
                              <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{key}</label>
                              <input 
                                className="input"
                                type={typeof step.method.defaultSettings[key] === 'number' ? 'number' : 'text'}
                                value={step.config.settings[key]}
                                onChange={(e) => updateSettings(index, key, e.target.value)}
                                style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Method Area */}
      {chain.length < 10 && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', borderStyle: 'dashed' }}>
          <h3 style={{ marginBottom: '1rem' }}>Add a Transformation</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select 
              className="input" 
              style={{ maxWidth: '300px' }}
              onChange={(e) => {
                if (e.target.value) {
                  addMethod(e.target.value);
                  e.target.value = ""; // Reset
                }
              }}
            >
              <option value="">Select a method...</option>
              {methods.map(m => (
                <option key={m.id} value={m.id} disabled={chain.some(c => c.methodId === m.id)}>
                  {m.name} {chain.some(c => c.methodId === m.id) ? '(Already selected)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

    </div>
  );
}
