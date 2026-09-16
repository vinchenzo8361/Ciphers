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
            detailed: "Caesar cipher is one of the oldest encryption methods, named after Julius Caesar. It simply slides the alphabet. It is very easy to crack because there are only 25 possible shifts (keys)."
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
            detailed: "This makes it a 'polyalphabetic substitution cipher'. If the letter key is 'SECRET', the first letter shifts by 'S', the second by 'E', etc. Our version also supports an isolated Number Key for shifting digits."
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
            detailed: "ROT13 is often used in online forums as a simple means of hiding spoilers, punchlines, puzzle solutions, and offensive materials from the casual glance."
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
            detailed: "Originally developed for the Hebrew alphabet. It is a specific type of monoalphabetic substitution cipher where the key is just the alphabet in reverse."
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
            detailed: "The 'a' key must be a number that shares no common factors with 26 (coprime). It multiplies the letter's position, then adds the 'b' key. It is harder than Caesar but still vulnerable to frequency analysis."
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
            detailed: "Instead of replacing letters (substitution), it moves them around (transposition). You write the message diagonally downwards, then upwards across 'rails', and then read each rail row by row."
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
            detailed: "Binary is the fundamental language of computers. It uses only two states (0 and 1). This is an encoding, NOT encryption. Anyone who knows it is binary can easily translate it back."
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
            detailed: "Often used in computing to represent binary data in a more human-readable format. Like binary, hexadecimal is an encoding, not encryption."
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
            detailed: "Base64 is encoding, not encryption. It is often used for email attachments or embedding images in HTML. It usually ends with one or two '=' padding characters."
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
            detailed: "For example, 'A' is 65, 'a' is 97. It is the most common character encoding standard in early computing."
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
            detailed: "A very common substitution code found in basic puzzles. Numbers are usually separated by hyphens so '12' isn't confused with '1' and '2' (A and B or L?)."
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
            detailed: "In Morse output, '/' represents a space between words. It was designed so that the most common letters (like E) have the shortest codes."
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
            detailed: "This is a basic string manipulation, not encryption. It can be chained with other ciphers to add a small layer of obscurity."
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
            detailed: "This is primarily a way of spelling letters clearly over radio/speech, not encryption. It ensures similar-sounding letters (M and N, B and D) are not confused in noisy environments."
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
            detailed: "Also known as Percent-encoding. A space becomes %20, and an exclamation mark becomes %21. Used heavily in web development."
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
            detailed: "Originating in the 1980s on bulletin board systems, leetspeak uses numerical representations like '1337' for 'leet' (elite). It destroys casing."
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
            detailed: "Hashing is NOT encryption. You cannot decode a hash back into the original text. It is used to verify data integrity or securely store passwords."
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
            detailed: "Used by Bitcoin and SSL certificates. Even a tiny change to the input completely changes the output hash. Like MD5, it cannot be reversed."
        }
    }
];
