// src/components/MoodSimulator.js
export class MoodSimulator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }
    
    // حالة المحاكي
    this.state = {
      currentMood: 'neutral',
      moodHistory: [],
      isProcessing: false,
      lastClickTime: 0
    };
    
    // إعدادات debounce (بالمللي ثانية)
    this.debounceDelay = 500;
    
    // مستويات الطاقة
    this.energyLevels = {
      'very_negative': { min: 0, max: 20, color: '#4A235A', label: 'حزين جداً' },
      'negative': { min: 21, max: 40, color: '#5D6D7E', label: 'حزين' },
      'neutral': { min: 41, max: 60, color: '#F7B801', label: 'محايد' },
      'positive': { min: 61, max: 80, color: '#00A5CF', label: 'سعيد' },
      'very_positive': { min: 81, max: 100, color: '#FF6B6B', label: 'سعيد جداً' }
    };
    
    this.init();
  }
  
  init() {
    this.setupStyles();
    this.render();
    this.attachEventListeners();
    this.loadState();
  }
  
  setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .mood-simulator {
        font-family: 'Tajawal', sans-serif;
        max-width: 700px;
        margin: 0 auto;
        padding: 25px;
        background: linear-gradient(135deg, #FEF9E7 0%, #F8F4E3 100%);
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        direction: rtl;
        text-align: center;
      }
      
      .simulator-header {
        margin-bottom: 30px;
      }
      
      .simulator-title {
        font-size: 2rem;
        color: #F7B801;
        margin-bottom: 10px;
        font-weight: bold;
      }
      
      .simulator-subtitle {
        font-size: 1rem;
        color: #7E5109;
        opacity: 0.8;
      }
      
      .mood-display {
        background: white;
        border-radius: 15px;
        padding: 25px;
        margin-bottom: 30px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        position: relative;
        overflow: hidden;
      }
      
      .mood-icon {
        font-size: 4rem;
        margin-bottom: 15px;
        transition: all 0.5s ease;
      }
      
      .mood-label {
        font-size: 1.5rem;
        font-weight: bold;
        color: #7E5109;
        margin-bottom: 10px;
      }
      
      .mood-score {
        font-size: 1.2rem;
        color: #7E5109;
        opacity: 0.8;
      }
      
      .mood-bar {
        width: 100%;
        height: 10px;
        background: #f0f0f0;
        border-radius: 5px;
        margin-top: 15px;
        overflow: hidden;
      }
      
      .mood-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #F7B801, #00D084);
        border-radius: 5px;
        transition: width 0.5s ease, background 0.5s ease;
      }
      
      .controls-section {
        margin-bottom: 30px;
      }
      
      .mood-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
      }
      
      .mood-btn {
        padding: 15px 10px;
        border: none;
        border-radius: 10px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Tajawal', sans-serif;
        color: white;
        position: relative;
        overflow: hidden;
      }
      
      .mood-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }
      
      .mood-btn:active {
        transform: translateY(-1px);
      }
      
      .mood-btn.processing {
        opacity: 0.7;
        cursor: not-allowed;
      }
      
      .mood-btn.processing::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        animation: processing-shine 1s infinite;
      }
      
      @keyframes processing-shine {
        0% { left: -100%; }
        100% { left: 100%; }
      }
      
      .mood-very-negative { background: linear-gradient(135deg, #4A235A, #5B2C6F); }
      .mood-negative { background: linear-gradient(135deg, #5D6D7E, #566573); }
      .mood-neutral { background: linear-gradient(135deg, #F7B801, #F8F4E3); color: #7E5109; }
      .mood-positive { background: linear-gradient(135deg, #00A5CF, #00D084); }
      .mood-very-positive { background: linear-gradient(135deg, #FF6B6B, #4ECDC4); }
      
      .random-section {
        margin-top: 20px;
      }
      
      .random-btn {
        background: linear-gradient(135deg, #7E5109, #5D4037);
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 25px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Tajawal', sans-serif;
      }
      
      .random-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(126, 81, 9, 0.3);
      }
      
      .history-section {
        background: white;
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      }
      
      .history-title {
        font-size: 1.2rem;
        font-weight: bold;
        color: #7E5109;
        margin-bottom: 15px;
      }
      
      .history-list {
        max-height: 200px;
        overflow-y: auto;
        text-align: right;
      }
      
      .history-item {
        padding: 8px 12px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
      }
      
      .history-item:last-child {
        border-bottom: none;
      }
      
      .history-mood {
        font-weight: bold;
      }
      
      .history-time {
        color: #999;
        font-size: 0.8rem;
      }
      
      .clear-history-btn {
        background: transparent;
        color: #999;
        border: 1px solid #ddd;
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 0.8rem;
        cursor: pointer;
        margin-top: 10px;
        transition: all 0.3s ease;
      }
      
      .clear-history-btn:hover {
        background: #f5f5f5;
        border-color: #ccc;
      }
      
      .toast {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #00D084;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: bold;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
      }
      
      .toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
      
      @media (max-width: 768px) {
        .mood-simulator {
          padding: 15px;
        }
        
        .simulator-title {
          font-size: 1.5rem;
        }
        
        .mood-buttons {
          grid-template-columns: repeat(2, 1fr);
        }
        
        .mood-btn {
          padding: 12px 8px;
          font-size: 0.9rem;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  render() {
    this.container.innerHTML = `
      <div class="mood-simulator">
        <div class="simulator-header">
          <h1 class="simulator-title">محاكي المزاج</h1>
          <p class="simulator-subtitle">اختبر كيفية تفاعل المحرك مع مشاعرك</p>
        </div>
        
        <div class="mood-display">
          <div class="mood-icon">😐</div>
          <div class="mood-label">محايد</div>
          <div class="mood-score">50 نقطة</div>
          <div class="mood-bar">
            <div class="mood-bar-fill" style="width: 50%; background: linear-gradient(90deg, #F7B801, #00D084);"></div>
          </div>
        </div>
        
        <div class="controls-section">
          <div class="mood-buttons">
            <button class="mood-btn mood-very-negative" data-mood="very_negative">حزين جداً</button>
            <button class="mood-btn mood-negative" data-mood="negative">حزين</button>
            <button class="mood-btn mood-neutral" data-mood="neutral">محايد</button>
            <button class="mood-btn mood-positive" data-mood="positive">سعيد</button>
            <button class="mood-btn mood-very-positive" data-mood="very_positive">سعيد جداً</button>
          </div>
          
          <div class="random-section">
            <button class="random-btn" id="random-mood-btn">مزاج عشوائي</button>
          </div>
        </div>
        
        <div class="history-section">
          <h3 class="history-title">سجل التغييرات</h3>
          <div class="history-list" id="history-list">
            <!-- سيتم ملؤه ديناميكياً -->
          </div>
          <button class="clear-history-btn" id="clear-history-btn">مسح السجل</button>
        </div>
      </div>
    `;
    
    // إنشاء عنصر Toast
    this.toast = document.createElement('div');
    this.toast.className = 'toast';
    document.body.appendChild(this.toast);
  }
  
  attachEventListeners() {
    // أزرار المزاج
    const moodButtons = this.container.querySelectorAll('.mood-btn');
    moodButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const mood = e.target.getAttribute('data-mood');
        this.handleMoodChange(mood);
      });
    });
    
    // زر المزاج العشوائي
    const randomBtn = this.container.querySelector('#random-mood-btn');
    randomBtn.addEventListener('click', () => {
      this.handleRandomMood();
    });
    
    // زر مسح السجل
    const clearBtn = this.container.querySelector('#clear-history-btn');
    clearBtn.addEventListener('click', () => {
      this.clearHistory();
    });
  }
  
  // دالة debounce الأساسية
  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      // مسح المؤقت السابق
      clearTimeout(timeoutId);
      
      // تعيين مؤقت جديد
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  
  // معالج تغيير المزاج مع debounce
  handleMoodChange(mood) {
    if (this.state.isProcessing) {
      return;
    }
    
    // استخدام debounce لمعالجة تغيير المزاج
    const debouncedMoodChange = this.debounce((newMood) => {
      this.setMood(newMood);
    }, this.debounceDelay);
    
    // إضافة حالة المعالجة
    this.setProcessingState(true);
    
    // استدعاء الدالة debounced
    debouncedMoodChange(mood);
  }
  
  // تعيين المزاج الفعلي
  setMood(mood) {
    const previousMood = this.state.currentMood;
    this.state.currentMood = mood;
    
    // تحديث الواجهة
    this.updateMoodDisplay(mood);
    
    // إضافة إلى السجل
    this.addToHistory(mood);
    
    // حفظ الحالة
    this.saveState();
    
    // إطلاق حدث تغيير المزاج
    this.dispatchMoodChangeEvent(mood, previousMood);
    
    // إزالة حالة المعالجة
    this.setProcessingState(false);
    
    // إظهار إشعار
    this.showToast(`تم تغيير المزاج إلى: ${this.energyLevels[mood].label}`);
  }
  
  // معالجة المزاج العشوائي
  handleRandomMood() {
    if (this.state.isProcessing) {
      return;
    }
    
    const moods = Object.keys(this.energyLevels);
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    
    this.handleMoodChange(randomMood);
  }
  
  // تحديث عرض المزاج
  updateMoodDisplay(mood) {
    const moodData = this.energyLevels[mood];
    const score = Math.floor(Math.random() * (moodData.max - moodData.min + 1)) + moodData.min;
    
    // تحديث الأيقونة
    const moodIcons = {
      'very_negative': '😭',
      'negative': '😔',
      'neutral': '😐',
      'positive': '😊',
      'very_positive': '😄'
    };
    
    this.container.querySelector('.mood-icon').textContent = moodIcons[mood];
    this.container.querySelector('.mood-label').textContent = moodData.label;
    this.container.querySelector('.mood-score').textContent = `${score} نقطة`;
    
    // تحديث شريط التقدم
    const barFill = this.container.querySelector('.mood-bar-fill');
    barFill.style.width = `${score}%`;
    barFill.style.background = `linear-gradient(90deg, ${moodData.color}, #00D084)`;
  }
  
  // إضافة إلى السجل
  addToHistory(mood) {
    const now = new Date();
    const historyItem = {
      mood: mood,
      label: this.energyLevels[mood].label,
      time: now.toLocaleTimeString('ar-DZ'),
      timestamp: now.getTime()
    };
    
    this.state.moodHistory.unshift(historyItem);
    
    // الاحتفاظ بآخر 20 عنصر فقط
    if (this.state.moodHistory.length > 20) {
      this.state.moodHistory = this.state.moodHistory.slice(0, 20);
    }
    
    this.updateHistoryDisplay();
  }
  
  // تحديث عرض السجل
  updateHistoryDisplay() {
    const historyList = this.container.querySelector('#history-list');
    historyList.innerHTML = '';
    
    this.state.moodHistory.forEach(item => {
      const historyElement = document.createElement('div');
      historyElement.className = 'history-item';
      historyElement.innerHTML = `
        <span class="history-mood">${item.label}</span>
        <span class="history-time">${item.time}</span>
      `;
      historyList.appendChild(historyElement);
    });
  }
  
  // مسح السجل
  clearHistory() {
    this.state.moodHistory = [];
    this.updateHistoryDisplay();
    this.saveState();
    this.showToast('تم مسح السجل');
  }
  
  // تعيين حالة المعالجة
  setProcessingState(isProcessing) {
    this.state.isProcessing = isProcessing;
    
    const buttons = this.container.querySelectorAll('.mood-btn');
    buttons.forEach(button => {
      if (isProcessing) {
        button.classList.add('processing');
        button.disabled = true;
      } else {
        button.classList.remove('processing');
        button.disabled = false;
      }
    });
  }
  
  // حفظ الحالة
  saveState() {
    const stateToSave = {
      currentMood: this.state.currentMood,
      moodHistory: this.state.moodHistory
    };
    
    localStorage.setItem('nabd_mood_simulator_state', JSON.stringify(stateToSave));
  }
  
  // تحميل الحالة
  loadState() {
    const savedState = localStorage.getItem('nabd_mood_simulator_state');
    
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        this.state.currentMood = parsedState.currentMood || 'neutral';
        this.state.moodHistory = parsedState.moodHistory || [];
        
        // تحديث الواجهة بالحالة المحملة
        this.updateMoodDisplay(this.state.currentMood);
        this.updateHistoryDisplay();
      } catch (error) {
        console.error('Error loading mood simulator state:', error);
      }
    }
  }
  
  // إطلاق حدث تغيير المزاج
  dispatchMoodChangeEvent(newMood, previousMood) {
    const event = new CustomEvent('moodChanged', {
      detail: {
        newMood: newMood,
        previousMood: previousMood,
        moodData: this.energyLevels[newMood]
      }
    });
    
    window.dispatchEvent(event);
  }
  
  // إظهار إشعار
  showToast(message) {
    this.toast.textContent = message;
    this.toast.classList.add('show');
    
    setTimeout(() => {
      this.toast.classList.remove('show');
    }, 3000);
  }
}
