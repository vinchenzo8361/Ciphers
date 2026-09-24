const fs = require('fs');
let code = fs.readFileSync('src/registry/methods.js', 'utf8');

// Inject the import
code = code.replace(
  "import { md5Hash, sha256Hash, hashingDecode } from './implementations/hashing';",
  "import { md5Hash, sha256Hash, hashingDecode } from './implementations/hashing';\nimport { enigmaEncode } from './implementations/enigma';"
);

const enigmaDef = `
    {
        id: 'enigma',
        name: 'Enigma Machine',
        category: 'Classical Ciphers',
        description: 'WWII electromechanical rotor cipher.',
        difficulty: 10,
        support: { letters: true, numbers: false, symbols: false },
        isSelfInverse: true,
        defaultSettings: { rotor1: 'I', rotor2: 'II', rotor3: 'III', start1: 'A', start2: 'A', start3: 'A', plugboard: '' },
        encode: enigmaEncode,
        decode: enigmaEncode,
        learning: {
            short: "The infamous WWII German encryption machine.",
            detailed: "Uses a series of rotating wheels to scramble text. Because the wheels step after every single letter, pressing 'A' five times will give you five completely different output letters.",
            example: "Input: HELLO (Rotors I-II-III, Starts A-A-A)\\nOutput: ILBDA"
        }
    },`;

// Insert after Vigenere
code = code.replace(/(id:\s*'vigenere'[\s\S]*?\n    },)/, '$1\n' + enigmaDef);

fs.writeFileSync('src/registry/methods.js', code);
console.log('Enigma injected!');
