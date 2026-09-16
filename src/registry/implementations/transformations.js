const MORSE_CODE = {
    "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.", 
    "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..", 
    "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.", 
    "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-", 
    "Y": "-.--", "Z": "--..", "1": ".----", "2": "..---", "3": "...--", 
    "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", 
    "9": "----.", "0": "-----"
};
const MORSE_DECODE = Object.fromEntries(Object.entries(MORSE_CODE).map(([k, v]) => [v, k]));

export function morseEncode(text) {
    let result = [];
    let words = text.toUpperCase().split(' ');
    
    for (let word of words) {
        let morseWord = [];
        for (let char of word) {
            if (MORSE_CODE[char]) {
                morseWord.push(MORSE_CODE[char]);
            }
        }
        if (morseWord.length > 0) {
            result.push(morseWord.join(' '));
        }
    }
    return result.join(' / ');
}

export function morseDecode(text) {
    if (!text.trim()) return "";
    let words = text.split('/');
    let result = [];
    
    for (let word of words) {
        let chars = word.trim().split(/\s+/);
        let decodedWord = "";
        for (let char of chars) {
            if (!char) continue;
            if (MORSE_DECODE[char]) {
                decodedWord += MORSE_DECODE[char];
            } else {
                throw new Error(`Error: invalid Morse code sequence '${char}'`);
            }
        }
        result.push(decodedWord);
    }
    return result.join(' ');
}

export function reverseText(text) {
    return text.split('').reverse().join('');
}

const NATO_CODE = {
    "A": "Alpha", "B": "Bravo", "C": "Charlie", "D": "Delta", "E": "Echo", 
    "F": "Foxtrot", "G": "Golf", "H": "Hotel", "I": "India", "J": "Juliett", 
    "K": "Kilo", "L": "Lima", "M": "Mike", "N": "November", "O": "Oscar", 
    "P": "Papa", "Q": "Quebec", "R": "Romeo", "S": "Sierra", "T": "Tango", 
    "U": "Uniform", "V": "Victor", "W": "Whiskey", "X": "X-ray", "Y": "Yankee", 
    "Z": "Zulu",
    "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four", 
    "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine"
};
const NATO_DECODE = Object.fromEntries(Object.entries(NATO_CODE).map(([k, v]) => [v.toUpperCase(), k]));

export function natoEncode(text) {
    let result = [];
    for (let char of text.toUpperCase()) {
        if (NATO_CODE[char]) {
            result.push(NATO_CODE[char]);
        } else if (char.match(/[A-Z0-9]/)) {
            // Should be covered
        } else {
            result.push(char); 
        }
    }
    return result.join(' ');
}

export function natoDecode(text) {
    const parts = text.split(/\s+/);
    let result = "";
    for (let part of parts) {
        if (!part) continue;
        let p = part.toUpperCase();
        if (NATO_DECODE[p]) {
            result += NATO_DECODE[p];
        } else if (p.length === 1 && !p.match(/[A-Z0-9]/)) {
            result += p; 
        } else {
            throw new Error(`Error: invalid NATO word '${part}'`);
        }
    }
    return result;
}

const LEET_DICT = {
    'A': '4', 'B': '8', 'E': '3', 'G': '6', 'I': '1', 'O': '0', 'S': '5', 'T': '7', 'Z': '2'
};
const LEET_DECODE = Object.fromEntries(Object.entries(LEET_DICT).map(([k, v]) => [v, k]));

export function leetEncode(text) {
    let result = "";
    for (let char of text) {
        let upper = char.toUpperCase();
        if (LEET_DICT[upper]) {
            result += LEET_DICT[upper];
        } else {
            result += char;
        }
    }
    return result;
}

export function leetDecode(text) {
    let result = "";
    for (let char of text) {
        if (LEET_DECODE[char]) {
            result += LEET_DECODE[char].toLowerCase();
        } else {
            result += char;
        }
    }
    return result;
}
