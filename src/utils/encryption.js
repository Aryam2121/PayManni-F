// src/utils/encryption.js

export async function generateKey() {
    return await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }
  
  export async function encryptData(data, key) {
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const cipher = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoded
    );
  
    return {
      cipher: btoa(String.fromCharCode(...new Uint8Array(cipher))),
      iv: Array.from(iv), // Convert Uint8Array to normal array for JSON
    };
  }
  
  export async function decryptData(cipher, iv, key) {
    const binary = Uint8Array.from(atob(cipher), (c) => c.charCodeAt(0));
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      key,
      binary
    );
    return JSON.parse(new TextDecoder().decode(decrypted));
  }
  