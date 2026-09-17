const fs = require('fs');

const path = 'src/registry/methods.js';
let content = fs.readFileSync(path, 'utf8');

const extendedDetails = {
  caesar: "The Caesar Cipher is one of the oldest known encryption techniques. It is a substitution cipher where each letter in the plaintext is shifted a certain number of places down the alphabet. For example, with a shift of 1, A would be replaced by B, B would become C, and so on. The method is named after Julius Caesar, who used it in his private correspondence.",
  vigenere: "The Vigenère Cipher is a method of encrypting alphabetic text by using a series of interwoven Caesar ciphers, based on the letters of a keyword. It is a form of polyalphabetic substitution. For centuries, it was known as 'le chiffre indéchiffrable' (the indecipherable cipher) until Friedrich Kasiski published a method to break it in 1863.",
  rot13: "ROT13 (Rotate by 13 places) is a simple letter substitution cipher that replaces a letter with the 13th letter after it in the alphabet. Because there are 26 letters (2x13) in the basic Latin alphabet, ROT13 is its own inverse; that is, to undo ROT13, the same algorithm is applied, so the same action can be used for encoding and decoding.",
  atbash: "Atbash is a monoalphabetic substitution cipher originally used to encrypt the Hebrew alphabet. It works by substituting the first letter of an alphabet for the last letter, the second letter for the second to last letter, and so on (A becomes Z, B becomes Y). It is trivially easy to break.",
  base64: "Base64 is a binary-to-text encoding scheme that represents binary data (such as images, files, or encrypted text) in an ASCII string format by translating it into a radix-64 representation. It is heavily used to safely transport data across the internet (like in email attachments or JSON Web Tokens) without special characters breaking the protocol.",
  md5: "MD5 (Message-Digest Algorithm 5) is a widely used cryptographic hash function that produces a 128-bit (16-byte) hash value. Although MD5 was initially designed to be used as a cryptographic hash function, it has been found to suffer from extensive vulnerabilities. It is no longer considered secure for passwords, but is still used for basic checksums to verify file integrity.",
  sha256: "SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that produces a 256-bit signature for a text. It belongs to the SHA-2 family, designed by the NSA. It is highly secure and is used in major protocols including TLS, SSL, SSH, and Bitcoin cryptocurrency. Any slight change to the original text results in a completely different, unpredictable hash."
};

for (const [id, details] of Object.entries(extendedDetails)) {
  const regex = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?detailed:\\s*").*?(")(,?\\s*example)`);
  content = content.replace(regex, `$1${details}$2$3`);
}

fs.writeFileSync(path, content, 'utf8');
console.log("Updated advanced details!");
