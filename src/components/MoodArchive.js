// src/components/MoodArchive.js
export class MoodArchive {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }
    
    this.chart = null;
    this.moodData = [];
    
    this.init();
  }
  
  init() {
    this.setupStyles();
    this.render();
    this.loadMoodData();
    this.initializeChart();
    this.attachEventListeners();
  }
  
  setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .mood-archive {
        font-family: 'Tajawal', sans-serif;
        max-width: 900px;
        margin: 0 auto;
        padding: 20px;
        background: linear-gradient(135deg, #FEF9E7 0%, #F8F4E3 100%);
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        direction: rtl;
        text-align: right;
      }
      
      .archive-header {
        text-align: center;
        margin-bottom: 30px;
      }
      
      .archive-title {
        font-size: 2rem;
        color: #F7B801;
        margin-bottom: 10px;
        font-weight: bold;
      }
      
      .archive-subtitle {
        font-size: 1rem;
        color: #7E5109;
        opacity: 0.8;
      }
      
      .chart-container {
        background: white;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        margin-bottom: 30px;
        position: relative;
        height: 400px;
      }
      
      .controls-section {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 30px;
        flex-wrap: wrap;
      }
      
      .btn {
        padding: 12px 25px;
        border: none;
        border-radius: 25px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Tajawal', sans-serif;
      }
      
      .btn-primary {
        background: linear-gradient(135deg, #F7B801, #F8F4E3);
        color: #7E5109;
      }
      
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(247, 184, 1, 0.3);
      }
      
      .btn-secondary {
        background: transparent;
        color: #7E5109;
        border: 2px solid #7E5109;
      }
      
      .btn-secondary:hover {
        background: #7E5109;
        color: white;
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .stat-card {
        background: white;
        padding: 20px;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      }
      
      .stat-value {
        font-size: 2rem;
        font-weight: bold;
        color: #F7B801;
        margin-bottom: 5px;
      }
      
      .stat-label {
        font-size: 1rem;
        color: #7E5109;
        opacity: 0.8;
      }
      
      .mood-table {
        background: white;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      }
      
      .table-header {
        background: linear-gradient(135deg, #F7B801, #F8F4E3);
        color: #7E5109;
        padding: 15px;
        font-weight: bold;
        text-align: center;
      }
      
      .table-content {
        max-height: 300px;
        overflow-y: auto;
      }
      
      .table-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        padding: 12px 15px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        text-align: center;
      }
      
      .table-row:last-child {
        border-bottom: none;
      }
      
      .mood-badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: bold;
        color: white;
      }
      
      .mood-very-negative { background-color: #4A235A; }
      .mood-negative { background-color: #5D6D7E; }
      .mood-neutral { background-color: #F7B801; color: #7E5109; }
      .mood-positive { background-color: #00A5CF; }
      .mood-very-positive { background-color: #FF6B6B; }
      
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
      
      .loading-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-top: 4px solid #F7B801;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      
      @media (max-width: 768px) {
        .mood-archive {
          padding: 15px;
        }
        
        .archive-title {
          font-size: 1.5rem;
        }
        
        .controls-section {
          flex-direction: column;
        }
        
        .btn {
          width: 100%;
        }
        
        .table-row {
          grid-template-columns: 1fr;
          gap: 5px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  render() {
    this.container.innerHTML = `
      <div class="mood-archive">
        <div class="archive-header">
          <h1 class="archive-title">أرشيف نبض المشاعر</h1>
          <p class="archive-subtitle">تتبع وتحليل مزاجك على مر الزمن</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value" id="total-days">0</div>
            <div class="stat-label">إجمالي الأيام</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value" id="avg-score">0</div>
            <div class="stat-label">متوسط النقاط</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value" id="dominant-mood">-</div>
            <div class="stat-label">المزاج السائد</div>
          </div>
        </div>
        
        <div class="chart-container">
          <div class="loading-spinner" id="chart-loader"></div>
          <canvas id="moodChart"></canvas>
        </div>
        
        <div class="controls-section">
          <button class="btn btn-primary" id="refresh-btn">تحديث البيانات</button>
          <button class="btn btn-secondary" id="export-pdf-btn">تصدير PDF</button>
          <button class="btn btn-secondary" id="export-json-btn">تصدير JSON</button>
        </div>
        
        <div class="mood-table">
          <div class="table-header">سجل المشاعر</div>
          <div class="table-content" id="mood-table-body">
            <!-- سيتم ملؤه ديناميكياً -->
          </div>
        </div>
      </div>
    `;
    
    // إنشاء عنصر Toast
    this.toast = document.createElement('div');
    this.toast.className = 'toast';
    document.body.appendChild(this.toast);
  }
  
  loadMoodData() {
    // تحميل البيانات من localStorage
    const savedData = localStorage.getItem('nabd_mood_history');
    
    if (savedData) {
      this.moodData = JSON.parse(savedData);
    } else {
      // إذا لم تكن هناك بيانات، إنشاء بيانات وهمية للاختبار
      this.generateMockData();
    }
    
    this.updateStats();
    this.updateTable();
  }
  
  generateMockData() {
    const today = new Date();
    const moods = ['very_negative', 'negative', 'neutral', 'positive', 'very_positive'];
    const moodLabels = {
      'very_negative': 'حزين جداً',
      'negative': 'حزين',
      'neutral': 'محايد',
      'positive': 'سعيد',
      'very_positive': 'سعيد جداً'
    };
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const mood = moods[Math.floor(Math.random() * moods.length)];
      const score = Math.floor(Math.random() * 100);
      
      this.moodData.push({
        date: date.toISOString().split('T')[0],
        mood: mood,
        moodLabel: moodLabels[mood],
        score: score
      });
    }
    
    localStorage.setItem('nabd_mood_history', JSON.stringify(this.moodData));
  }
  
  async initializeChart() {
    // إخفاء الـ loader بعد تحميل Chart.js
    const loader = document.getElementById('chart-loader');
    if (loader) loader.style.display = 'none';
    
    const ctx = document.getElementById('moodChart');
    if (!ctx) return;
    
    // التحقق من وجود Chart.js
    if (typeof Chart === 'undefined') {
      this.showToast('مكتبة Chart.js غير محملة. يرجى التحقق من الـ HTML.');
      return;
    }
    
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.moodData.map(entry => entry.date),
        datasets: [{
          label: 'نبض المزاج',
          data: this.moodData.map(entry => entry.score),
          borderColor: '#00D084',
          backgroundColor: 'rgba(0, 208, 132, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: '#00D084',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                family: 'Tajawal',
                size: 14
              },
              color: '#7E5109'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
              family: 'Tajawal',
              size: 14
            },
            bodyFont: {
              family: 'Tajawal',
              size: 12
            },
            callbacks: {
              label: function(context) {
                const index = context.dataIndex;
                const moodEntry = this.moodData[index];
                return `المزاج: ${moodEntry.moodLabel} (${context.parsed.y} نقطة)`;
              }.bind(this)
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              font: {
                family: 'Tajawal'
              },
              color: '#7E5109'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            ticks: {
              font: {
                family: 'Tajawal'
              },
              color: '#7E5109',
              maxRotation: 45,
              minRotation: 45
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        }
      }
    });
  }
  
  updateStats() {
    const totalDays = this.moodData.length;
    const avgScore = Math.round(this.moodData.reduce((sum, entry) => sum + entry.score, 0) / totalDays);
    
    const moodCounts = {};
    this.moodData.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );
    
    const moodLabels = {
      'very_negative': 'حزين',
      'negative': 'حزين',
      'neutral': 'محايد',
      'positive': 'سعيد',
      'very_positive': 'سعيد'
    };
    
    document.getElementById('total-days').textContent = totalDays;
    document.getElementById('avg-score').textContent = avgScore;
    document.getElementById('dominant-mood').textContent = moodLabels[dominantMood] || '-';
  }
  
  updateTable() {
    const tableBody = document.getElementById('mood-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // عرض آخر 10 سجلات فقط
    const recentData = this.moodData.slice(-10).reverse();
    
    recentData.forEach(entry => {
      const row = document.createElement('div');
      row.className = 'table-row';
      
      row.innerHTML = `
        <div>${entry.date}</div>
        <div><span class="mood-badge mood-${entry.mood}">${entry.moodLabel}</span></div>
        <div>${entry.score} نقطة</div>
      `;
      
      tableBody.appendChild(row);
    });
  }
  
  attachEventListeners() {
    const refreshBtn = document.getElementById('refresh-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const exportJsonBtn = document.getElementById('export-json-btn');
    
    refreshBtn.addEventListener('click', () => this.refreshData());
    exportPdfBtn.addEventListener('click', () => this.exportPDF());
    exportJsonBtn.addEventListener('click', () => this.exportJSON());
  }
  
  refreshData() {
    this.moodData = [];
    this.generateMockData();
    
    // تحديث الرسم البياني
    if (this.chart) {
      this.chart.data.labels = this.moodData.map(entry => entry.date);
      this.chart.data.datasets[0].data = this.moodData.map(entry => entry.score);
      this.chart.update();
    }
    
    this.updateStats();
    this.updateTable();
    
    this.showToast('تم تحديث البيانات بنجاح!');
  }
  
  exportPDF() {
    // التحقق من وجود jsPDF
    if (typeof window.jspdf === 'undefined') {
      this.showToast('مكتبة jsPDF غير محملة. لا يمكن تصدير PDF.');
      return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // إضافة الخط العربي (باستخدام خط بديل)
    doc.setFont('helvetica');
    
    // العنوان
    doc.setFontSize(20);
    doc.text('Nabd Algeria - Mood Archive', 105, 20, { align: 'center' });
    
    // إضافة الرسم البياني كصورة
    const canvas = document.getElementById('moodChart');
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 15, 30, 180, 100);
    
    // إضافة جدول البيانات
    doc.setFontSize(12);
    let yPosition = 140;
    
    doc.text('Date', 20, yPosition);
    doc.text('Mood', 80, yPosition);
    doc.text('Score', 140, yPosition);
    
    yPosition += 10;
    
    this.moodData.slice(-10).forEach(entry => {
      doc.text(entry.date, 20, yPosition);
      doc.text(entry.moodLabel, 80, yPosition);
      doc.text(entry.score.toString(), 140, yPosition);
      yPosition += 8;
    });
    
    doc.save('nabd-algeria-mood-archive.pdf');
    
    this.showToast('تم تصدير الملف بنجاح!');
  }
  
  exportJSON() {
    const dataStr = JSON.stringify(this.moodData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'nabd-algeria-mood-archive.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    this.showToast('تم تصدير JSON بنجاح!');
  }
  
  showToast(message) {
    this.toast.textContent = message;
    this.toast.classList.add('show');
    
    setTimeout(() => {
      this.toast.classList.remove('show');
    }, 3000);
  }
}
