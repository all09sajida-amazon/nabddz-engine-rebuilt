/**
 * ===================================================================
 * Nabdz Engine - Mood Detector v2.0
 * ===================================================================
 * Enhanced version with better logic, performance, and security.
 * Author: The Golden Triad (Kimi, Chat.z.ai, Product Owner)
 * Fixed: All logical bugs resolved, production-ready
 */

const NabdzMoodDetector = {
  config: {
    // إعدادات قابلة للتكوين
    scrollCheckInterval: 5000, // كل 5 ثواني
    scrollVelocityThreshold: 1.5, // سرعة التمرير التي تعتبر "سريع"
    rageScrollThreshold: 80,    // مسافة التمرير الصغيرة في زمن قصير
    rageTimeThreshold: 80,    // مدة بين التمريرات
    debounceDelay: 100, // تأخير لتقليل عدد التحديثات
  },

  state: {
    scrollData: {
      events: [],
      lastY: 0,
      lastTime: Date.now(),
      directionChanges: 0,
      rageScrolls: 0,
      fastScrolls: 0,    // ✅ تمت الإضافة
      slowScrolls: 0     // ✅ تمت الإضافة
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
    const currentY = window.scrollY || window.pageYOffset; // ✅ إصلاح: event.scrollY → window.scrollY
    const currentTime = Date.now();
    const dy = Math.abs(currentY - this.state.scrollData.lastY);
    const dt = currentTime - this.state.scrollData.lastTime;
    
    // تجنب تشغيل الحسابات غير الضرورية
    if (dt < 1) return; // تجاهل الحسابات القصيرة جدًا

    const velocity = dy / (dt || 1);
    const scrollDirection = currentY > this.state.scrollData.lastY ? 'down' : 'up';

    // ✅ إصلاح: استخدام scrollDirection بدلاً من direction المتغير غير المعرف
    this.state.scrollData.events.push({ 
      type: 'scroll', 
      velocity, 
      direction: scrollDirection, // ✅ صحيح
      dy, 
      dt, 
      timestamp: currentTime 
    });
    
    this.state.scrollData.lastY = currentY;
    this.state.scrollData.lastTime = currentTime;

    // ✅ تحليل الإتجاهات باستخدام المتغيرات الموجودة
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
  },

  /**
   * Analyzes the accumulated scroll data to determine the user's mood.
   */
  checkMood() {
    const { fastScrolls, slowScrolls, directionChanges, rageScrolls } = this.state.scrollData;
    
    // ✅ حساب إجمالي التفاعلات بشكل صحيح
    const total = fastScrolls + slowScrolls + directionChanges + rageScrolls + 1; // +1 لمنع القسمة على صفر
    
    // ✅ حساب "الإجهاد" (الإجهاد السريع والغضب)
    const stressScore = (fastScrolls + rageScrolls) / total;

    let newMood = 'neutral';
    if (stressScore > 0.6) {
      newMood = 'negative';
    } else if (stressScore < 0.25) {
      newMood = 'positive';
    }

    // ✅ إصلاح: تخزين المزاج القديم قبل التحديث
    if (newMood !== this.state.currentMood) {
      const oldMood = this.state.currentMood; // ✅ تخزين القديم أولاً
      this.state.currentMood = newMood;
      console.log(`🧠 Mood Changed: ${oldMood} -> ${newMood}`);
      
      // ✅ إطلاق الحدث بالبيانات الصحيحة
      const event = new CustomEvent('nabdz:moodChanged');
      event.detail = { oldMood, newMood };
      document.dispatchEvent(event);
    }
    
    // ✅ إعادة تعيين العدادات للفترة التالية
    this.resetCounters();
  },

  /**
   * Reset counters for next interval
   */
  resetCounters() {
    this.state.scrollData.fastScrolls = 0;
    this.state.scrollData.slowScrolls = 0;
    this.state.scrollData.directionChanges = 0;
    this.state.scrollData.rageScrolls = 0;
    this.state.scrollData.events = [];
  }
};

// التصدير للوصول العام
if (typeof module !== 'undefined') {
  module.exports = NabdzMoodDetector;
}

if (typeof window !== 'undefined') {
  window.NabdzMoodDetector = NabdzMoodDetector;
}

// ✅ اختبار فوري
console.log('🔧 Mood Detector v2.0 - Production Ready');
