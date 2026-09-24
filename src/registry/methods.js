import { 
    caesarEncode, caesarDecode, 
    vigenereEncode, vigenereDecode, 
    rot13, atbash, 
    affineEncode, affineDecode, 
    railFenceEncode, railFenceDecode 
} from './implementations/classical';

import {
    binaryEncode, binaryDecode,
    hexEncode, hexDecode,
    base64Encode, base64Decode,
    asciiEncode, asciiDecode,
    a1z26Encode, a1z26Decode,
    urlEncode, urlDecode
} from './implementations/encodings';

import {
    morseEncode, morseDecode,
    reverseText,
    natoEncode, natoDecode,
    leetEncode, leetDecode
} from './implementations/transformations';

import {
    md5Hash, sha256Hash, hashingDecode
} from './implementations/hashing';

import { enigmaEncode } from './implementations/enigma';

export const methods = [
    // Classical
    {
        id: 'caesar',
        name: 'Caesar Shift',
        category: 'Classical Ciphers',
        description: 'A substitution cipher that shifts letters by a fixed amount.',
        difficulty: 4,
        support: { letters: true, numbers: false, symbols: true },
        isSelfInverse: false,
        defaultSettings: { shift: 3 },
        encode: caesarEncode,
        decode: caesarDecode,
        learning: {
            short: "Shifts each letter by a certain number of spaces down the alphabet.",
            detailed: "The Caesar Cipher is one of the oldest known encryption techniques. It is a substitution cipher where each letter in the plaintext is shifted a certain number of places down the alphabet. For example, with a shift of 1, A would be replaced by B, B would become C, and so on. The method is named after Julius Caesar, who used it in his private correspondence.",
            example: `EXAMPLE:
Input: HELLO (Shift +3)
Output: KHOOR`
        }
    },
    {
        id: 'vigenere',
        name: 'Vigenère Cipher',
        category: 'Classical Ciphers',
        description: 'Uses a keyword to determine how far different letters should move.',
        difficulty: 7,
        support: { letters: true, numbers: true, symbols: true },
        isSelfInverse: false,
        defaultSettings: { letterKey: 'KEY', numberKey: '' },
        encode: vigenereEncode,
        decode: vigenereDecode,
        learning: {
            short: "Vigenère works somewhat like Caesar Cipher, but instead of moving every letter by the same amount, it uses a keyword to determine how far different letters should move.",
            detailed: "The Vigenère Cipher is a method of encrypting alphabetic text by using a series of interwoven Caesar ciphers, based on the letters of a keyword. It is a form of polyalphabetic substitution. For centuries, it was known as 'le chiffre indéchiffrable' (the indecipherable cipher) until Friedrich Kasiski published a method to break it in 1863.",
            example: `EXAMPLE:
Input: HELLO (Letter Key: KEY)
Output: RIJVS`
        }
    },

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
            example: "Input: HELLO (Rotors I-II-III, Starts A-A-A)\nOutput: ILBDA"
        }
    },
    {
        id: 'rot13',
        name: 'ROT13',
        category: 'Classical Ciphers',
        description: 'Replaces a letter with the 13th letter after it.',
        difficulty: 2,
        support: { letters: true, numbers: false, symbols: true },
        isSelfInverse: true,
        defaultSettings: {},
        encode: rot13,
        decode: rot13,
        learning: {
            short: "Shifts letters by exactly 13 places. Because the alphabet has 26 letters, doing it twice gets you back to the start.",
            detailed: "ROT13 (Rotate by 13 places) is a simple letter substitution cipher that replaces a letter with the 13th letter after it in the alphabet. Because there are 26 letters (2x13) in the basic Latin alphabet, ROT13 is its own inverse; that is, to undo ROT13, the same algorithm is applied, so the same action can be used for encoding and decoding.",
            example: `EXAMPLE:
Input: HELLO
Output: URYYB`
        }
    },
    {
        id: 'atbash',
        name: 'Atbash',
        category: 'Classical Ciphers',
        description: 'Reverses the alphabet (A becomes Z, B becomes Y).',
        difficulty: 2,
        support: { letters: true, numbers: false, symbols: true },
        isSelfInverse: true,
        defaultSettings: {},
        encode: atbash,
        decode: atbash,
        learning: {
            short: "Reverses the alphabet so A=Z, B=Y, C=X, etc.",
            detailed: "Atbash is a monoalphabetic substitution cipher originally used to encrypt the Hebrew alphabet. It works by substituting the first letter of an alphabet for the last letter, the second letter for the second to last letter, and so on (A becomes Z, B becomes Y). It is trivially easy to break.",
            example: `EXAMPLE:
Input: HELLO
Output: SVOOL`
        }
    },
    {
        id: 'affine',
        name: 'Affine Cipher',
        category: 'Classical Ciphers',
        description: 'A mathematical cipher combining multiplication and addition.',
        difficulty: 6,
        support: { letters: true, numbers: false, symbols: true },
        isSelfInverse: false,
        defaultSettings: { a: 5, b: 8 },
        encode: affineEncode,
        decode: affineDecode,
        learning: {
            short: "Uses a mathematical function (ax + b) to mix up the letters.",
            detailed: "The 'a' key must be a number that shares no common factors with 26 (coprime). It multiplies the letter's position, then adds the 'b' key. It is harder than Caesar but still vulnerable to frequency analysis.",
            example: `EXAMPLE:
Input: HELLO (Multiplier: 5, Shift: 8)
Output: RCLLA`
        }
    },
    {
        id: 'railfence',
        name: 'Rail Fence',
        category: 'Classical Ciphers',
        description: 'Writes text in a zigzag pattern across multiple lines (rails).',
        difficulty: 5,
        support: { letters: true, numbers: true, symbols: true },
        isSelfInverse: false,
        defaultSettings: { rails: 3 },
        encode: railFenceEncode,
        decode: railFenceDecode,
        learning: {
            short: "A transposition cipher that jumbles the order of characters by writing them in a zigzag pattern.",
            detailed: "Instead of replacing letters (substitution), it moves them around (transposition). You write the message diagonally downwards, then upwards across 'rails', and then read each rail row by row.",
            example: `EXAMPLE:
Input: HELLOWORLD (Rails: 3)
Output: HOLELWRDLO`
        }
    },
    // Encodings
    {
        id: 'binary',
        name: 'Binary',
        category: 'Encodings',
        description: 'Represents text using 1s and 0s.',
        difficulty: 1,
        support: { letters: true, numbers: true, symbols: true },
        isSelfInverse: false,
        defaultSettings: {},
        encode: binaryEncode,
        decode: binaryDecode,
        learning: {
            short: "Translates characters into standard 8-bit binary.",
            detailed: "Binary is the fundamental language of computers. It uses only two states (0 and 1). This is an encoding, NOT encryption. Anyone who knows it is binary can easily translate it back.",
            example: `EXAMPLE:
Input: A
Output: 01000001`
        }
    },
    {
        id: 'hex',
        name: 'Hexadecimal',
        category: 'Encodings',
        description: 'Represents text using base-16 math (0-9 and a-f).',
        difficulty: 1,
        support: { letters: true, numbers: true, symbols: true },
        isSelfInverse: false,
        defaultSettings: {},
        encode: hexEncode,
        decode: hexDecode,
        learning: {
            short: "Translates characters into Base-16 values.",
            detailed: "Often used in computing to represent binary data in a more human-readable format. Like binary, hexadecimal is an encoding, not encryption.",
            example: `EXAMPLE:
Input: Hello
Output: 48 65 6c 6c 6f`
        }
    },
    {
        id: 'base64',
        name: 'Base64',
        category: 'Encodings',
        description: 'Encodes binary/text data into 64 ASCII characters.',
        difficulty: 1,
        support: { letters: true, numbers: true, symbols: true },
        isSelfInverse: false,
        defaultSettings: {},
        encode: base64Encode,
        decode: base64Decode,
        learning: {
            short: "Base64 is a way to encode data so it safely travels across networks.",
            detailed: "Base64 is a binary-to-text encoding scheme that represents binary data (such as images, files, or encrypted text) in an ASCII string format by translating it into a radix-64 representation. It is heavily used to safely transport data across the internet (like in email attachments or JSON Web Tokens) without special characters breaking the protocol.",
            example: `EXAMPLE:
Input: Hello
Output: SGVsbG8=`
        }
    },
    {
        id: 'ascii',
        name: 'ASCII Codes',
        category: 'Encodings',
        description: 'Converts text into standard ASCII numerical codes.',
        difficulty: 1,
        support: { letters: true, numbers: true, symbols: true },
        isSelfInverse: false,
        defaultSettings: {},
        encode: asciiEncode,
        decode: asciiDecode,
        learning: {
            short: "Turns each character into its corresponding ASCII decimal number.",
            detailed: "For example, 'A' is 65, 'a' is 97. It is the most common character encoding standard in early computing.",
            example: `EXAMPLE:
Input: Hello
Output: 72 101 108 108 111`
        }
    },
    {
        id: 'a1z26',
        name: 'A1Z26',
        category: 'Encodings',
        description: 'Simply maps A to 1, B to 2, up to Z to 26.',
        difficulty: 1,
        support: { letters: true, numbers: false, symbols: true },
        isSelfInverse: false,
        defaultSettings: {},
        encode: a1z26Encode,
        decode: a1z26Decode,
        learning: {
            short: "A straightforward substitution where A=1, B=2, C=3...",
            detailed: "A very common substitution code found in basic puzzles. Numbers are usually separated by hyphens so '12' isn't confused with '1' and '2' (A and B or L?).",
            example: `EXAMPLE:
Input: CAB
Output: 3-1-2`
        }
    },
    // Transformations
    {
        id: 'morse',
        name: 'Morse Code',
        category: 'Other Transformations',
        description: 'Translates text into dots and dashes.',
        difficulty: 1,
        support: { letters: true, numbers: true, symbols: false },
        isSelfInverse: false,
        defaultSettings: {},
        encode: morseEncode,
        decode: morseDecode,
        learning: {
            short: "An old telecommunication method using short dots (.) and long dashes (-).",
            detailed: "In Morse output, '/' represents a space between words. It was designed so that the most common letters (like E) have the shortest codes.",
            example: `EXAMPLE:
Input: SOS
Output: ... --- ...`
        }
    },
    {
        id: 'reverse',
        name: 'Reverse',
        category: 'Other Transformations',
        description: 'Simply flips the text backwards.',
        difficulty: 1,
        support: { letters: true, numbers: true, symbols: true },
        isSelfInverse: true,
        defaultSettings: {},
        encode: reverseText,
        decode: reverseText,
        learning: {
            short: "Turns 'Hello' into 'olleH'.",
            detailed: "This is a basic string manipulation, not encryption. It can be chained with other ciphers to add a small layer of obscurity.",
            example: `EXAMPLE:
Input: Hello
Output: olleH`
        }
    },
    {
        id: 'nato',
        name: 'NATO Phonetic',
        category: 'Other Transformations',
        description: 'Spells out letters using phonetic words (e.g., Alpha Bravo).',
        difficulty: 1,
        support: { letters: true, numbers: true, symbols: false },
        isSelfInverse: false,
        defaultSettings: {},
        encode: natoEncode,
        decode: natoDecode,
        learning: {
            short: "A=Alpha, B=Bravo, C=Charlie.",
            detailed: "This is primarily a way of spelling letters clearly over radio/speech, not encryption. It ensures similar-sounding letters (M and N, B and D) are not confused in noisy environments.",
            example: `EXAMPLE:
Input: CAT
Output: Charlie Alpha Tango`
        }
    },
    {
        id: 'url',
        name: 'URL Encoding',
        category: 'Encodings',
        description: 'Converts special characters to % format for web links.',
        difficulty: 1,
        support: { letters: true, numbers: true, symbols: true },
        isSelfInverse: false,
        defaultSettings: {},
        encode: urlEncode,
        decode: urlDecode,
        learning: {
            short: "Encodes spaces and special characters for web addresses.",
            detailed: "Also known as Percent-encoding. A space becomes %20, and an exclamation mark becomes %21. Used heavily in web development.",
            example: `EXAMPLE:
Input: Hello World!
Output: Hello%20World%21`
        }
    },
    {
        id: 'leetspeak',
        name: 'Leetspeak',
        category: 'Other Transformations',
        description: 'Replaces letters with similar-looking numbers (E = 3).',
        difficulty: 1,
        support: { letters: true, numbers: false, symbols: false },
        isSelfInverse: false,
        defaultSettings: {},
        encode: leetEncode,
        decode: leetDecode,
        learning: {
            short: "Internet slang where letters are replaced by numbers that resemble them.",
            detailed: "Originating in the 1980s on bulletin board systems, leetspeak uses numerical representations like '1337' for 'leet' (elite). It destroys casing.",
            example: `EXAMPLE:
Input: LEET
Output: L337`
        }
    },
    {
        id: 'md5',
        name: 'MD5 Hash',
        category: 'Hashing',
        description: 'Generates a 128-bit one-way hash fingerprint.',
        difficulty: 10,
        support: { letters: true, numbers: true, symbols: true },
        isSelfInverse: false,
        defaultSettings: {},
        encode: md5Hash,
        decode: hashingDecode,
        learning: {
            short: "A one-way mathematical function that creates a unique fingerprint of the data.",
            detailed: "MD5 (Message-Digest Algorithm 5) is a widely used cryptographic hash function that produces a 128-bit (16-byte) hash value. Although MD5 was initially designed to be used as a cryptographic hash function, it has been found to suffer from extensive vulnerabilities. It is no longer considered secure for passwords, but is still used for basic checksums to verify file integrity.",
            example: `EXAMPLE:
Input: Hello
Output: 8b1a9953c4611296a827abf8c47804d7`
        }
    },
    {
        id: 'sha256',
        name: 'SHA-256 Hash',
        category: 'Hashing',
        description: 'Generates a highly secure 256-bit one-way hash.',
        difficulty: 10,
        support: { letters: true, numbers: true, symbols: true },
        isSelfInverse: false,
        defaultSettings: {},
        encode: sha256Hash,
        decode: hashingDecode,
        learning: {
            short: "A modern, highly secure one-way hashing algorithm.",
            detailed: "SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that produces a 256-bit signature for a text. It belongs to the SHA-2 family, designed by the NSA. It is highly secure and is used in major protocols including TLS, SSL, SSH, and Bitcoin cryptocurrency. Any slight change to the original text results in a completely different, unpredictable hash.",
            example: `EXAMPLE:
Input: Hello
Output: 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969`
        }
    }
];
