/**
 * ===================================================================
 * Nabdz Engine - Core Module
 * ===================================================================
 * This module contains the foundational classes for the engine.
 * Author: The Golden Triad (Kimi, Chat.z.ai, Product Owner)
 * Version: 2.2.0
 */

class Security {
  /**
   * Sanitizes a string to prevent XSS attacks.
   * @param {string} input - The string to sanitize.
   * @returns {string} The sanitized string.
   */
  static sanitize(input) {
    if (typeof input !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  /**
   * Encrypts data for storage.
   * @param {any} data - The data to encrypt.
   * @returns {string|null} The encrypted string or null on failure.
   */
  static encrypt(data) {
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(data)));
    } catch { return null; }
  }

  /**
   * Decrypts data from storage.
   * @param {string} encrypted - The encrypted string.
   * @returns {any|null} The decrypted data or null on failure.
   */
  static decrypt(encrypted) {
    try {
      return JSON.parse(decodeURIComponent(escape(atob(encrypted)));
    } catch { return null; }
  }

  /**
   * A secure storage interface.
   */
  static storage = {
    set: (key, value, encrypt = false) => {
      const data = encrypt ? Security.encrypt(value) : JSON.stringify(value);
      localStorage.setItem(`nabdz_${key}`, data);
    },
    get: (key, decrypt = false) => {
      const data = localStorage.getItem(`nabdz_${key}`);
      if (!data) return null;
      return decrypt ? Security.decrypt(data) : JSON.parse(data);
    }
  };
}

class NabdzCore {
  /**
   * Initializes the Nabd Dz Engine.
   * Dispatches a 'nabdz:ready' event to signal that the engine is live.
   */
  static init() {
    console.log('🚀 Nabdz Core Initializing...');
    Security.storage.set('initialized', true);
    document.dispatchEvent(new CustomEvent('nabdz:ready'));
    console.log('✅ Nabdz Core is ready.');
  }
}

// Export for different environments
if (typeof module !== 'undefined') {
  module.exports = { Security, NabdzCore };
}

if (typeof window !== 'undefined') {
  window.NabdzCore = NabdzCore;
  window.NabdzSecurity = Security;
}
