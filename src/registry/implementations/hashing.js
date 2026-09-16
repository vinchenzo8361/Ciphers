import CryptoJS from 'crypto-js';

export function md5Hash(text) {
    return CryptoJS.MD5(text).toString();
}

export function sha256Hash(text) {
    return CryptoJS.SHA256(text).toString();
}

export function hashingDecode(text) {
    throw new Error("Hashes are mathematical one-way functions. They cannot be reversed or 'decrypted'.");
}
