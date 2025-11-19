/**
 * ===================================================================
 * Nabdz Engine - Mood Detector v2.0
 * ===================================================================
 * Enhanced version with better logic, performance, and security.
 * Author: The Golden Triad (Kimi, Chat.z.ai, Product Owner)
 */

const NabdzMoodDetector = {
  config: {
    // إعدادات قابلة للتكوين
    scrollCheckInterval: 5000, // كل 5 ثواني
    scrollVelocityThreshold: 1.5, // سرعة التمرير التي تعتبر "سريع"
    rageScrollThreshold: 80,    // مسافة التمرير الصغيرة في زمن قصير
    rageTimeThreshold: 80,    // مدة بين التمريرات
    positiveWordThreshold: 0.25, // نسبة الكلمات الإيجابية
    negativeWordThreshold: 0.25, // نسبة الكلمات السلبية
    debounceDelay: 100, // تأخير لتقليل عدد التحديثات
  },

  state: {
    scrollData: {
      events: [],
      lastY: 0,
      lastTime: Date.now(),
      directionChanges: 0,
      rageScrolls: 0
    },
    currentMood: 'neutral'
  },

  /**
   * Initializes the mood detector.
   */
  init() {
    console.log('🔍 Nabdz Mood Detector v2.0 Initializing...');
    document.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    
    // بدء الفحص الدوري
    setInterval(this.checkMood.bind(this), this.config.scrollCheckInterval);
    
    console.log('✅ Nabdz Mood Detector v2.0 Initialized successfully.');
  },

  /**
   * Handles scroll events to track user behavior.
   * @param {object} event - The scroll event object.
   */
  onScroll(event) {
    const currentY = event.scrollY;
    const currentTime = Date.now();
    const dy = Math.abs(currentY - this.state.scrollData.lastY);
    const dt = currentTime - this.state.scrollData.lastTime;
    
    // تجنب تشغيل الحسابات غير الضرورية
    if (dt < 1) return; // تجاهل الحسابات القصيرة جدًا

    const velocity = dy / (dt || 1);
    const scrollDirection = currentY > this.state.scrollData.lastY ? 'down' : 'up';

    // تسجيل البيانات
    this.state.scrollData.events.push({ type: 'scroll', velocity, direction, dy, dt, timestamp: currentTime });
    this.state.scrollData.lastY = currentY;
    this.state.scrollData.lastTime = currentTime;

    // تحليل الإتجاهات
    if (velocity > this.config.scrollVelocityThreshold) {
      this.state.scrollData.fastScrolls++;
    } else {
      this.state.scrollData.slowScrolls++;
    }

    if (scrollDirection === 'up' && this.state.scrollData.lastY - currentY > 50) {
      this.state.scrollData.directionChanges++;
    }

    if (dt < this.config.rageTimeThreshold && dy > this.config.rageScrollThreshold) {
      this.state.scrollData.rageScrolls++;
    }

    // console.log(`Scroll: ${velocity.toFixed(2)} (${scrollDirection})`);
  },

  /**
   * Analyzes the accumulated scroll data to determine the user's mood.
   */
  checkMood() {
    const { events, fastScrolls, slowScrolls, directionChanges, rageScrolls } = this.state.scrollData;
    const total = fastScrolls + slowScrolls + directionChanges + rageScrolls + 1; // +1 لمنع العد صفري

    // حساب "الإجهاد" (الإجهاد السريع والغضب)
    const stressScore = (fastScrolls + rageScrolls) / total;

    let newMood = 'neutral';
    if (stressScore > 0.6) {
      newMood = 'negative';
    } else if (stressScore < 0.25) {
      newMood = 'positive';
    }

    if (newMood !== this.state.currentMood) {
      this.state.currentMood = newMood;
      console.log(`🧠 Mood Changed: ${this.state.currentMood} -> ${newMood}`);
      
      // إطلاق الحدث
      const event = new CustomEvent('nabdz:moodChanged');
      event.detail = { oldMood: this.state.currentMood, newMood: newMood };
      document.dispatchEvent(event);
    }
  }
};

// التصدير للوصول العام
if (typeof module !== 'undefined') {
  module.exports = NabdzMoodDetector;
}

if (typeof window !== 'undefined') {
  window.NabdzMoodDetector = NabdzMoodDetector;
}
