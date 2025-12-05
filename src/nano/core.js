// src/nano/core.js
// NabdZ — Nano Kernel (Injected Core)

class NanoCore {
  constructor(opts = {}) {
    this.id = opts.id || `nano-${Date.now().toString(36)}`;
    this.seed = opts.seed || (Math.random().toString(36).slice(2,10) + Date.now().toString(36));
    this.nodes = {};
    this.bus = opts.bus || null;
    this.weave = opts.weave || {};
    this.signChain = [];
    this.policy = opts.policy || { retentionDays: 30, minimization: true };
  }

  register(node) {
    if (!node || !node.id || typeof node.onSignal !== 'function') {
      throw new Error('Invalid node contract: { id, onSignal } required');
    }
    this.nodes[node.id] = node;
    node.core = this;
    this._note(`register:${node.id}`);
    return node;
  }

  createNode(id, implFactory, meta = {}) {
    const node = Object.assign({ id, meta }, implFactory(meta));
    return this.register(node);
  }

  emit(targetId, signal) {
    this._note(`emit:${targetId}:${signal && signal.type ? signal.type : 'generic'}`);
    if (targetId === '*' || targetId === 'weave') {
      return this.broadcast(signal);
    }
    const node = this.nodes[targetId];
    if (!node) return null;
    try {
      const res = node.onSignal(signal, { core: this, node });
      return res;
    } catch (err) {
      this._note(`err:${targetId}:${String(err).slice(0,120)}`);
      return null;
    }
  }

  broadcast(signal) {
    const order = this._weaveOrder();
    for (const id of order) {
      const node = this.nodes[id];
      if (!node) continue;
      try { node.onSignal(signal, { core: this, node }); }
      catch(e) { this._note(`err:${id}:${String(e).slice(0,120)}`); }
    }
  }

  _weaveOrder() {
    if (!this.weave || !this.weave.nodes) return Object.keys(this.nodes);
    const w = this.weave.nodes;
    return Object.keys(this.nodes).sort((a,b) => {
      const wa = (w[a] && w[a].priority) || 0;
      const wb = (w[b] && w[b].priority) || 0;
      if (wa === wb) return a.localeCompare(b);
      return wb - wa;
    });
  }

  _note(s) {
    const stamp = { t: Date.now(), tag: s, seed: this.seed.slice(0,8) };
    this.signChain.push(stamp);
    if (this.signChain.length > 1024) this.signChain.shift();
  }

  snapshot() {
    return {
      id: this.id,
      seed: this.seed.slice(0,8),
      nodes: Object.keys(this.nodes),
      weaveSummary: Object.keys(this.weave.nodes || {}),
      chainLength: this.signChain.length,
      policy: this.policy
    };
  }

  shutdown() {
    this._note('shutdown');
    for (const id in this.nodes) {
      if (typeof this.nodes[id].onShutdown === 'function') {
        try { this.nodes[id].onShutdown({ core: this }); } catch(e){}
      }
    }
  }
}

module.exports = NanoCore;
