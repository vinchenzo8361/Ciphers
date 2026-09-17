import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { X, GripVertical, ArrowDownUp, Download, Upload, Copy, Check } from 'lucide-react';
import { methods, transform } from '../registry';

export default function Playground() {
  const [mode, setMode] = useState('encode');
  const [rootInput, setRootInput] = useState('');
  const [chain, setChain] = useState([]); 
  const [copiedIndex, setCopiedIndex] = useState(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addMethod = (methodId) => {
    if (chain.length >= 10) return;
    const method = methods.find(m => m.id === methodId);
    if (!method) return;
    setChain([...chain, { id: generateId(), methodId, settings: { ...method.defaultSettings } }]);
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

  const computedSteps = useMemo(() => {
    let currentInput = rootInput;
    const steps = [];

    for (let i = 0; i < chain.length; i++) {
      const stepConfig = chain[i];
      const method = methods.find(m => m.id === stepConfig.methodId);
      
      let stepResult = { method, config: stepConfig, input: currentInput, output: '', error: null };

      if (!currentInput) {
        steps.push(stepResult);
        continue; 
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
          currentInput = ""; 
        }
      }
      steps.push(stepResult);
    }
    return { steps, finalOutput: currentInput };
  }, [rootInput, chain, mode]);

  const handleReverseChain = () => {
    if (chain.length === 0) return;
    
    // Set root input to the final output of the current chain
    if (computedSteps.finalOutput) {
      setRootInput(computedSteps.finalOutput);
    }
    
    // Reverse the methods and toggle mode
    setChain([...chain].reverse());
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const handleCopy = (text, index) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // ... (handleSave and handleLoad omitted for brevity, keeping them short below)
  const handleSave = () => {
    const data = { version: 1, mode, rootInput, chain: chain.map(c => ({ methodId: c.methodId, settings: c.settings })) };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `playground.cipherlab`; a.click(); URL.revokeObjectURL(url);
  };
  const handleLoad = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.mode) setMode(data.mode);
        if (data.rootInput !== undefined) setRootInput(data.rootInput);
        if (data.chain) setChain(data.chain.map(c => ({ id: generateId(), methodId: c.methodId, settings: c.settings })));
      } catch (err) { alert("Failed to parse file"); }
    };
    reader.readAsText(file); e.target.value = ''; 
  };

  return (
    <div className="flex flex-col gap-8" style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-1px' }}>PLAYGROUND</h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Chain {chain.length}/10 methods. Currently <strong style={{color: 'var(--text-primary)'}}>{mode.toUpperCase()}ING</strong>.
          </p>
        </div>
        
        <div className="flex gap-2 items-center">
          {chain.length > 0 && (
            <button className="btn btn-primary" onClick={handleReverseChain} title="Reverse chain and decode">
              <ArrowDownUp size={16} /> {mode === 'encode' ? 'REVERSE & DECODE' : 'REVERSE & ENCODE'}
            </button>
          )}
          <button className="btn btn-secondary" onClick={handleSave} aria-label="Save">
            <Download size={16} />
          </button>
          <label className="btn btn-secondary" style={{ cursor: 'pointer', margin: 0 }} aria-label="Load">
            <Upload size={16} />
            <input type="file" accept=".cipherlab,.json" onChange={handleLoad} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase text-muted">ROOT INPUT</label>
        <textarea 
          className="input font-mono" 
          rows={3} 
          value={rootInput}
          onChange={(e) => setRootInput(e.target.value)}
          placeholder="Start your chain here..."
        />
      </div>

      {/* Chain Container */}
      <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
        {chain.length > 0 && (
          <div style={{ 
            position: 'absolute', 
            left: '8px', 
            top: '0', 
            bottom: '0', 
            width: '2px', 
            backgroundColor: 'var(--border-strong)',
            zIndex: 0
          }} />
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="chain">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-6">
                {computedSteps.steps.map((step, index) => (
                  <Draggable key={step.config.id} draggableId={step.config.id} index={index}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{ 
                          ...provided.draggableProps.style,
                          position: 'relative',
                          zIndex: 1,
                          opacity: snapshot.isDragging ? 0.9 : 1
                        }}
                      >
                        {/* Node Connector */}
                        <div style={{ 
                          position: 'absolute', 
                          left: '-1.5rem', 
                          top: '1.25rem',
                          width: '18px', 
                          height: '18px', 
                          borderRadius: '50%', 
                          backgroundColor: 'var(--bg-base)', 
                          border: '2px solid var(--accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                          color: 'var(--accent)',
                          transform: 'translateX(-4px)'
                        }}>
                          {index + 1}
                        </div>

                        <div className="panel" style={{ padding: '1.25rem' }}>
                          
                          {/* Step Header */}
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                              <div {...provided.dragHandleProps} className="text-muted" style={{ cursor: 'grab' }}>
                                <GripVertical size={16} />
                              </div>
                              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{step.method.name.toUpperCase()}</h3>
                            </div>
                            <button onClick={() => removeMethod(index)} className="btn-tertiary">
                              <X size={16} />
                            </button>
                          </div>

                          {/* Step I/O */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold text-muted">INPUT</label>
                              <div className="input font-mono text-xs" style={{ minHeight: '60px', overflowY: 'auto', backgroundColor: 'var(--bg-surface-raised)', wordBreak: 'break-all' }}>
                                {step.input || <span style={{opacity: 0.3}}>Empty...</span>}
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-muted">OUTPUT</label>
                                {step.output && !step.error && (
                                  <button onClick={() => handleCopy(step.output, index)} className="btn-tertiary text-xs flex items-center gap-1" style={{ padding: 0 }}>
                                    {copiedIndex === index ? <><Check size={12}/> COPIED</> : <><Copy size={12}/> COPY</>}
                                  </button>
                                )}
                              </div>
                              <div className={`input font-mono text-xs ${step.error ? 'input-error' : ''}`} style={{ minHeight: '60px', overflowY: 'auto', wordBreak: 'break-all' }}>
                                {step.error || step.output || <span style={{opacity: 0.3}}>Empty...</span>}
                              </div>
                            </div>
                          </div>

                          {/* Step Settings */}
                          {Object.keys(step.config.settings).length > 0 && (
                            <div className="flex gap-4 items-center mt-4 pt-4" style={{ borderTop: '1px dashed var(--border-subtle)' }}>
                              {Object.keys(step.config.settings).map(key => (
                                <div key={key} className="flex items-center gap-2">
                                  <label className="text-xs font-bold text-muted uppercase">{key}</label>
                                  <input 
                                    className="input"
                                    type={typeof step.method.defaultSettings[key] === 'number' ? 'number' : 'text'}
                                    value={step.config.settings[key]}
                                    onChange={(e) => updateSettings(index, key, e.target.value)}
                                    style={{ width: '80px', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Add Method Tool */}
      {chain.length < 10 && (
        <div style={{ marginLeft: chain.length > 0 ? '1.5rem' : '0' }}>
          <select 
            className="input font-bold" 
            style={{ maxWidth: '300px', cursor: 'pointer', backgroundColor: 'var(--bg-surface)' }}
            onChange={(e) => {
              if (e.target.value) {
                addMethod(e.target.value);
                e.target.value = ""; 
              }
            }}
          >
            <option value="">+ ADD TRANSFORMATION</option>
            {methods.map(m => (
              <option key={m.id} value={m.id} disabled={chain.some(c => c.methodId === m.id)}>
                {m.name} {chain.some(c => c.methodId === m.id) ? '(In use)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {chain.length === 0 && (
        <div className="text-muted text-sm mt-4">
          Your workspace is empty. Choose a method above to start experimenting.
        </div>
      )}

    </div>
  );
}
