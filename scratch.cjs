const fs = require('fs');

const path = 'src/registry/methods.js';
let content = fs.readFileSync(path, 'utf8');

const examples = {
  caesar: "EXAMPLE:\nInput: HELLO (Shift +3)\nOutput: KHOOR",
  vigenere: "EXAMPLE:\nInput: HELLO (Letter Key: KEY)\nOutput: RIJVS",
  rot13: "EXAMPLE:\nInput: HELLO\nOutput: URYYB",
  atbash: "EXAMPLE:\nInput: HELLO\nOutput: SVOOL",
  affine: "EXAMPLE:\nInput: HELLO (Multiplier: 5, Shift: 8)\nOutput: RCLLA",
  railfence: "EXAMPLE:\nInput: HELLOWORLD (Rails: 3)\nOutput: HOLELWRDLO",
  binary: "EXAMPLE:\nInput: A\nOutput: 01000001",
  hex: "EXAMPLE:\nInput: Hello\nOutput: 48 65 6c 6c 6f",
  base64: "EXAMPLE:\nInput: Hello\nOutput: SGVsbG8=",
  ascii: "EXAMPLE:\nInput: Hello\nOutput: 72 101 108 108 111",
  a1z26: "EXAMPLE:\nInput: CAB\nOutput: 3-1-2",
  morse: "EXAMPLE:\nInput: SOS\nOutput: ... --- ...",
  reverse: "EXAMPLE:\nInput: Hello\nOutput: olleH",
  nato: "EXAMPLE:\nInput: CAT\nOutput: Charlie Alpha Tango",
  url: "EXAMPLE:\nInput: Hello World!\nOutput: Hello%20World%21",
  leetspeak: "EXAMPLE:\nInput: LEET\nOutput: L337",
  md5: "EXAMPLE:\nInput: Hello\nOutput: 8b1a9953c4611296a827abf8c47804d7",
  sha256: "EXAMPLE:\nInput: Hello\nOutput: 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969"
};

for (const [id, example] of Object.entries(examples)) {
  // Regex to find learning: { ... detailed: "..." } and insert example
  const regex = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?detailed:\\s*".*?")(\\s*})`);
  content = content.replace(regex, `$1,\n            example: \`${example}\`$2`);
}

fs.writeFileSync(path, content, 'utf8');
console.log("Updated examples!");
