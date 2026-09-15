import { useState } from 'react'
import './App.css'

function caesarCipher(text, shift, encode = true) {
  let result = "";
  if (!encode) shift = -shift;
  
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    if (char.match(/[a-z]/i)) {
      let isLower = (char === char.toLowerCase());
      let start = isLower ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
      // JS modulo bug fix: ((n % 26) + 26) % 26
      let newChar = String.fromCharCode(((char.charCodeAt(0) - start + shift) % 26 + 26) % 26 + start);
      result += newChar;
    } else {
      result += char;
    }
  }
  return result;
}

function vigenereCipher(text, key, encode = true) {
  let result = "";
  key = key.toUpperCase();
  let keyIndex = 0;
  
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    if (char.match(/[a-z]/i)) {
      let shift = key.charCodeAt(keyIndex % key.length) - 'A'.charCodeAt(0);
      if (!encode) shift = -shift;
      
      let isLower = (char === char.toLowerCase());
      let start = isLower ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
      let newChar = String.fromCharCode(((char.charCodeAt(0) - start + shift) % 26 + 26) % 26 + start);
      result += newChar;
      keyIndex++;
    } else {
      result += char;
    }
  }
  return result;
}

function App() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("caesar");
  const [action, setAction] = useState("encode");
  const [shift, setShift] = useState(3);
  const [vigenereKey, setVigenereKey] = useState("KEY");

  let result = "";
  if (text) {
    if (mode === "caesar") {
      result = caesarCipher(text, parseInt(shift) || 0, action === "encode");
    } else if (mode === "vigenere" && vigenereKey) {
      result = vigenereCipher(text, vigenereKey, action === "encode");
    }
  }

  return (
    <div className="container">
      <h1>Cipher Explorer</h1>
      
      <div className="form-row">
        <div className="form-group">
          <label>Cipher Mode:</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="caesar">Caesar Cipher</option>
            <option value="vigenere">Vigenère Cipher</option>
          </select>
        </div>

        <div className="form-group">
          <label>Action:</label>
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="encode">Encode</option>
            <option value="decode">Decode</option>
          </select>
        </div>
      </div>

      {mode === "caesar" ? (
        <div className="form-group">
          <label>Shift (Number):</label>
          <input 
            type="number" 
            value={shift} 
            onChange={(e) => setShift(e.target.value)} 
          />
        </div>
      ) : (
        <div className="form-group">
          <label>Key (Letters only):</label>
          <input 
            type="text" 
            value={vigenereKey} 
            onChange={(e) => setVigenereKey(e.target.value.replace(/[^a-zA-Z]/g, ''))} 
          />
        </div>
      )}

      <div className="form-group">
        <label>Input Text:</label>
        <textarea 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Type your message here..."
          rows={4}
        />
      </div>

      <div className="result-group">
        <label>Result:</label>
        <textarea 
          value={result} 
          readOnly 
          rows={4}
          placeholder="Output will appear here..."
        />
      </div>
    </div>
  )
}

export default App
