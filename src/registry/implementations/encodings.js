export function binaryEncode(text) {
    return Array.from(text).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

export function binaryDecode(text) {
    const parts = text.trim().split(/\s+/);
    let result = "";
    for (let part of parts) {
        if (!part) continue;
        if (!/^[01]{1,8}$/.test(part)) throw new Error("Error: invalid binary input");
        result += String.fromCharCode(parseInt(part, 2));
    }
    return result;
}

export function hexEncode(text) {
    return Array.from(text).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
}

export function hexDecode(text) {
    const parts = text.trim().split(/\s+/);
    let result = "";
    for (let part of parts) {
        if (!part) continue;
        if (!/^[0-9a-fA-F]+$/.test(part)) throw new Error("Error: invalid hexadecimal input");
        result += String.fromCharCode(parseInt(part, 16));
    }
    return result;
}

export function base64Encode(text) {
    try {
        return btoa(unescape(encodeURIComponent(text)));
    } catch (e) {
        throw new Error("Error: failed to encode to Base64");
    }
}

export function base64Decode(text) {
    try {
        return decodeURIComponent(escape(atob(text.trim())));
    } catch (e) {
        throw new Error("Error: invalid Base64");
    }
}

export function asciiEncode(text) {
    return Array.from(text).map(c => c.charCodeAt(0)).join(' ');
}

export function asciiDecode(text) {
    const parts = text.trim().split(/\s+/);
    let result = "";
    for (let part of parts) {
        if (!part) continue;
        if (!/^\d+$/.test(part)) throw new Error("Error: invalid ASCII input");
        result += String.fromCharCode(parseInt(part, 10));
    }
    return result;
}

export function a1z26Encode(text) {
    let result = "";
    let inWord = false;
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char.match(/[a-z]/i)) {
            if (inWord) result += "-";
            let val = char.toUpperCase().charCodeAt(0) - 64;
            result += val;
            inWord = true;
        } else {
            result += char;
            inWord = false;
        }
    }
    return result;
}

export function a1z26Decode(text) {
    return text.replace(/\d+(-\d+)*/g, (match) => {
        return match.split('-').map(numStr => {
            let val = parseInt(numStr, 10);
            if (val >= 1 && val <= 26) {
                return String.fromCharCode(val + 64);
            } else {
                throw new Error("Error: invalid A1Z26 number (must be 1-26)");
            }
        }).join('');
    });
}

export function urlEncode(text) {
    return encodeURIComponent(text);
}

export function urlDecode(text) {
    try {
        return decodeURIComponent(text);
    } catch (e) {
        throw new Error("Error: invalid URL encoded string");
    }
}
