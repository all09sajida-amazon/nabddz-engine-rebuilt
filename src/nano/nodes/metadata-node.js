// src/nano/nodes/metadata-node.js
module.exports = function MetadataNode(meta = {}) {
  return {
    id: meta.id || 'metadata',
    meta,
    onSignal(signal, ctx) {
      if (!signal) return;
      if (!signal.meta) signal.meta = {};
      signal.meta.lang = (signal.lang || (typeof navigator !== 'undefined' && navigator.language) || 'unknown');
      if (signal.url) {
        try {
          const u = new URL(signal.url);
          signal.meta.path = u.pathname;
        } catch(e) { signal.meta.path = '/'; }
      }
    }
  };
};
