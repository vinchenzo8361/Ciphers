// --- Helper Functions ---
function applyCaesar(text, shift) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    if (char.match(/[a-z]/i)) {
      let isLower = (char === char.toLowerCase());
      let start = isLower ? 97 : 65;
      let newChar = String.fromCharCode(((char.charCodeAt(0) - start + shift) % 26 + 26) % 26 + start);
      result += newChar;
    } else {
      result += char;
    }
  }
  return result;
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function modInverse(a, m) {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }
    return 1;
}

// --- Cipher Implementations ---

export function caesarEncode(text, settings) {
  const shift = parseInt(settings.shift) || 0;
  return applyCaesar(text, shift);
}

export function caesarDecode(text, settings) {
  const shift = parseInt(settings.shift) || 0;
  return applyCaesar(text, -shift);
}

export function vigenereEncode(text, settings) {
  return applyVigenere(text, settings.letterKey, settings.numberKey, true);
}

export function vigenereDecode(text, settings) {
  return applyVigenere(text, settings.letterKey, settings.numberKey, false);
}

function applyVigenere(text, letterKey, numberKey, encode) {
  let result = "";
  let lKey = (letterKey || "").toUpperCase().replace(/[^A-Z]/g, '');
  let nKey = (numberKey || "").replace(/[^0-9]/g, '');
  
  if (!lKey && !nKey) {
     throw new Error("You must provide at least a Letter Key or a Number Key.");
  }
  if (letterKey && !lKey) throw new Error("Error: incorrect letter key (must contain letters)");
  if (numberKey && !nKey) throw new Error("Error: incorrect number key (must contain numbers)");

  let lIndex = 0;
  let nIndex = 0;
  
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    
    if (char.match(/[a-z]/i) && lKey) {
      let shift = lKey.charCodeAt(lIndex % lKey.length) - 65; // 'A'
      if (!encode) shift = -shift;
      
      let isLower = (char === char.toLowerCase());
      let start = isLower ? 97 : 65; // 'a' or 'A'
      let newChar = String.fromCharCode(((char.charCodeAt(0) - start + shift) % 26 + 26) % 26 + start);
      result += newChar;
      lIndex++;
    } else if (char.match(/[0-9]/) && nKey) {
      let shift = parseInt(nKey[nIndex % nKey.length]);
      if (!encode) shift = -shift;
      
      let val = parseInt(char);
      let newVal = ((val + shift) % 10 + 10) % 10;
      result += newVal.toString();
      nIndex++;
    } else {
      result += char;
    }
  }
  return result;
}

export function rot13(text) {
    return applyCaesar(text, 13);
}

export function atbash(text) {
    let result = "";
    for (let char of text) {
        if (char.match(/[a-z]/i)) {
            let isLower = (char === char.toLowerCase());
            let start = isLower ? 97 : 65;
            let offset = char.charCodeAt(0) - start;
            let newChar = String.fromCharCode(start + (25 - offset));
            result += newChar;
        } else {
            result += char;
        }
    }
    return result;
}

export function affineEncode(text, settings) {
    let a = parseInt(settings.a);
    let b = parseInt(settings.b);
    if (isNaN(a) || isNaN(b)) throw new Error("Error: invalid Affine key (must be numbers)");
    if (gcd(a, 26) !== 1) throw new Error("Error: invalid Affine key ('a' must be coprime with 26)");

    let result = "";
    for (let char of text) {
        if (char.match(/[a-z]/i)) {
            let isLower = (char === char.toLowerCase());
            let start = isLower ? 97 : 65;
            let x = char.charCodeAt(0) - start;
            let newChar = String.fromCharCode(((a * x + b) % 26 + 26) % 26 + start);
            result += newChar;
        } else {
            result += char;
        }
    }
    return result;
}

export function affineDecode(text, settings) {
    let a = parseInt(settings.a);
    let b = parseInt(settings.b);
    if (isNaN(a) || isNaN(b)) throw new Error("Error: invalid Affine key (must be numbers)");
    if (gcd(a, 26) !== 1) throw new Error("Error: invalid Affine key ('a' must be coprime with 26)");

    let aInv = modInverse(a, 26);
    let result = "";
    for (let char of text) {
        if (char.match(/[a-z]/i)) {
            let isLower = (char === char.toLowerCase());
            let start = isLower ? 97 : 65;
            let y = char.charCodeAt(0) - start;
            let newChar = String.fromCharCode(((aInv * (y - b)) % 26 + 26) % 26 + start);
            result += newChar;
        } else {
            result += char;
        }
    }
    return result;
}

export function railFenceEncode(text, settings) {
    const rails = parseInt(settings.rails);
    if (isNaN(rails) || rails < 2) throw new Error("Error: invalid rail count (must be at least 2)");
    if (rails >= text.length) return text;

    let fence = Array.from({ length: rails }, () => []);
    let rail = 0;
    let direction = 1;

    for (let char of text) {
        fence[rail].push(char);
        rail += direction;
        if (rail === 0 || rail === rails - 1) direction *= -1;
    }

    return fence.map(r => r.join('')).join('');
}

export function railFenceDecode(text, settings) {
    const rails = parseInt(settings.rails);
    if (isNaN(rails) || rails < 2) throw new Error("Error: invalid rail count (must be at least 2)");
    if (rails >= text.length) return text;

    let fence = Array.from({ length: rails }, () => new Array(text.length).fill(null));
    let rail = 0;
    let direction = 1;

    for (let i = 0; i < text.length; i++) {
        fence[rail][i] = '*';
        rail += direction;
        if (rail === 0 || rail === rails - 1) direction *= -1;
    }

    let index = 0;
    for (let r = 0; r < rails; r++) {
        for (let c = 0; c < text.length; c++) {
            if (fence[r][c] === '*' && index < text.length) {
                fence[r][c] = text[index++];
            }
        }
    }

    let result = "";
    rail = 0;
    direction = 1;
    for (let i = 0; i < text.length; i++) {
        result += fence[rail][i];
        rail += direction;
        if (rail === 0 || rail === rails - 1) direction *= -1;
    }
    return result;
}
