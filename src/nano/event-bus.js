// src/nano/event-bus.js
// High-precision lightweight Event Bus

class EventBus {
  constructor(opts = {}) {
    this.queue = [];
    this.maxBatch = opts.maxBatch || 50;
    this.processing = false;
    this.listeners = {};
    this.jitter = opts.jitter || 13;
  }

  subscribe(topic, fn) {
    if (!this.listeners[topic]) this.listeners[topic] = new Set();
    this.listeners[topic].add(fn);
    return () => this.listeners[topic].delete(fn);
  }

  publish(topic, payload = {}) {
    const envelope = { id: `${topic}:${Date.now().toString(36)}:${Math.random().toString(36).slice(2,6)}`, topic, payload, ts: Date.now() };
    this.queue.push(envelope);
    if (this.queue.length > this.maxBatch) this._flushAsync();
    else if (!this.processing) setTimeout(()=>this._flushAsync(), this.jitter);
    return envelope.id;
  }

  async _flushAsync() {
    if (this.processing) return;
    this.processing = true;
    while (this.queue.length) {
      const batch = this.queue.splice(0, this.maxBatch);
      for (const env of batch) {
        const subs = this.listeners[env.topic] || [];
        for (const fn of subs) {
          try { fn(env.payload, env); } catch(e) { /* swallow */ }
        }
      }
      await new Promise(r=>setTimeout(r, 0));
    }
    this.processing = false;
  }
}

module.exports = EventBus;
