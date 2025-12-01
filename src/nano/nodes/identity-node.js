// src/nano/nodes/identity-node.js
module.exports = function IdentityNode(meta = {}) {
  return {
    id: meta.id || 'identity',
    meta,
    onSignal(signal, ctx) {
      if (!signal) return;
      if (signal.type === 'event:visit') {
        const h = this._shortHash(signal.userAgent || 'anonymous', signal.ts || Date.now());
        if (!signal.tags) signal.tags = {};
        signal.tags.identity = `id-${h}`;
      }
    },
    _shortHash(a,b) {
      let s = String(a) + '::' + String(b);
      let h = 2166136261 >>> 0;
      for (let i=0;i<s.length;i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
      return (h >>> 0).toString(36).slice(0,8);
    }
  };
};
