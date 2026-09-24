const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const ROTORS = {
    'I': { wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", notch: 'Q' },
    'II': { wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE", notch: 'E' },
    'III': { wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO", notch: 'V' }
};

const REFLECTOR_B = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

// Helper to get index
const indexOf = (char) => ALPHABET.indexOf(char);

export function enigmaEncode(text, settings) {
    let output = "";
    
    // settings: { rotor1: 'I', rotor2: 'II', rotor3: 'III', start1: 'A', start2: 'A', start3: 'A', plugboard: 'AB CD EF' }
    let r1 = ROTORS[settings.rotor1 || 'I'];
    let r2 = ROTORS[settings.rotor2 || 'II'];
    let r3 = ROTORS[settings.rotor3 || 'III'];
    
    let pos1 = indexOf(settings.start1 || 'A');
    let pos2 = indexOf(settings.start2 || 'A');
    let pos3 = indexOf(settings.start3 || 'A');

    // Parse plugboard
    const pbMap = {};
    for (let char of ALPHABET) pbMap[char] = char;
    
    if (settings.plugboard) {
        const pairs = settings.plugboard.toUpperCase().split(' ');
        for (let pair of pairs) {
            if (pair.length === 2 && ALPHABET.includes(pair[0]) && ALPHABET.includes(pair[1])) {
                pbMap[pair[0]] = pair[1];
                pbMap[pair[1]] = pair[0];
            }
        }
    }

    const forward = (char, rotor, offset) => {
        const pin = (indexOf(char) + offset) % 26;
        const out = rotor.wiring[pin];
        let res = (indexOf(out) - offset) % 26;
        if (res < 0) res += 26;
        return ALPHABET[res];
    };

    const backward = (char, rotor, offset) => {
        const pin = (indexOf(char) + offset) % 26;
        const target = ALPHABET[pin];
        const outIdx = rotor.wiring.indexOf(target);
        let res = (outIdx - offset) % 26;
        if (res < 0) res += 26;
        return ALPHABET[res];
    };

    for (let i = 0; i < text.length; i++) {
        let char = text[i].toUpperCase();
        if (!ALPHABET.includes(char)) {
            output += text[i]; // Keep non-letters
            continue;
        }

        // 1. Step rotors
        // Rotor 3 (fast) steps every time
        let step2 = false;
        let step1 = false;

        if (ALPHABET[pos3] === r3.notch) step2 = true;
        
        // Double stepping anomaly (if rotor 2 is at its notch, it steps itself and rotor 1)
        if (ALPHABET[pos2] === r2.notch) {
            step2 = true;
            step1 = true;
        }

        pos3 = (pos3 + 1) % 26;
        if (step2) pos2 = (pos2 + 1) % 26;
        if (step1) pos1 = (pos1 + 1) % 26;

        // 2. Plugboard
        char = pbMap[char];

        // 3. Forward through rotors (3 -> 2 -> 1)
        char = forward(char, r3, pos3);
        char = forward(char, r2, pos2);
        char = forward(char, r1, pos1);

        // 4. Reflector
        char = REFLECTOR_B[indexOf(char)];

        // 5. Backward through rotors (1 -> 2 -> 3)
        char = backward(char, r1, pos1);
        char = backward(char, r2, pos2);
        char = backward(char, r3, pos3);

        // 6. Plugboard again
        char = pbMap[char];

        // Preserve case
        if (text[i] === text[i].toLowerCase()) {
            output += char.toLowerCase();
        } else {
            output += char;
        }
    }

    return output;
}
