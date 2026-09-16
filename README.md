# Cipher Lab

Cipher Lab is a modular text transformation sandbox and learning tool. It allows users to encode and decode messages using classical ciphers, encodings, and other text transformations, while also providing an educational library to learn how they work.

## Features

- **Encoder & Decoder:** Dedicated workspaces for applying specific transformations to text with live, real-time output.
- **Playground:** A powerful chaining engine where you can combine up to 10 methods sequentially. Reorder steps with drag-and-drop, view intermediate inputs/outputs, reverse the entire chain with a single click, and save/load your pipeline configurations as `.cipherlab` files.
- **Codebreaker Mode:** Auto-analyze and brute-force unknown ciphers using mathematical techniques like frequency analysis.
- **Learning Library:** Educational content written for complete beginners explaining the history, math, and concepts behind each cipher.
- **Method Registry Architecture:** A highly scalable internal structure that makes adding new ciphers as simple as dropping in a new definition.
- **Dark & Light Mode:** A clean, modern interface with a togglable theme.

## Supported Methods

**Classical Ciphers**
- Caesar Shift
- Vigenère Cipher (features dual-key support for letters and numbers)
- ROT13
- Atbash
- Affine Cipher
- Rail Fence

**Encodings**
- Binary
- Hexadecimal
- Base64
- ASCII Codes
- A1Z26
- URL Encoding

**Other Transformations**
- Morse Code
- Reverse Text
- NATO Phonetic Alphabet
- Leetspeak

**Hashing (One-Way)**
- MD5
- SHA-256

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd Ciphers
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

## Extending the Lab

Cipher Lab is designed to be easily extensible. All transformations are managed through a central registry. 

To add a new method:
1. Write the encode/decode logic in the appropriate file in `src/registry/implementations/`.
2. Add a new configuration object to the `methods` array in `src/registry/methods.js`, defining its ID, metadata, character support, and learning content.
3. The UI (Encoder, Decoder, Playground, and Library) will automatically populate the new method.

## Technologies Used
- React (Vite)
- React Router DOM (Routing)
- Lucide React (Icons)
- @hello-pangea/dnd (Drag and drop functionality for the Playground)
