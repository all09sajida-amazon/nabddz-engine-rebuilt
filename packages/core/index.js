class Security {
  static sanitize(input) {
    if (typeof input !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }
  
  static encrypt(data) {
    try {
return btoa(unescape(encodeURIComponent(JSON.stringify(data)));    } catch { return null; }
  }
  
  static decrypt(encrypted) {
    try {
return JSON.parse(decodeURIComponent(escape(atob(encrypted)));    } catch { return null; }
  }
  
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
  static init() {
    Security.storage.set('initialized', true);
    document.dispatchEvent(new CustomEvent('nabdz:ready'));
  }
}

if (typeof module !== 'undefined') module.exports = { Security, NabdzCore };
if (typeof window !== 'undefined') {
  window.NabdzCore = NabdzCore;
  window.NabdzSecurity = Security;
}
