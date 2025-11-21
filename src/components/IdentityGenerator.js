// src/components/IdentityGenerator.js
export class IdentityGenerator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }
    
    this.identity = {
      name: '',
      avatar: '',
      bio: '',
      interests: [],
      personalityTraits: []
    };
    
    this.init();
  }
  
  init() {
    this.setupStyles();
    this.render();
    this.attachEventListeners();
    this.generateAvatar();
  }
  
  setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .identity-generator {
        font-family: 'Tajawal', sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background: linear-gradient(135deg, #FEF9E7 0%, #F8F4E3 100%);
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        direction: rtl;
        text-align: right;
      }
      
      .identity-header {
        text-align: center;
        margin-bottom: 30px;
      }
      
      .identity-title {
        font-size: 2rem;
        color: #F7B801;
        margin-bottom: 10px;
        font-weight: bold;
      }
      
      .identity-subtitle {
        font-size: 1rem;
        color: #7E5109;
        opacity: 0.8;
      }
      
      .avatar-section {
        text-align: center;
        margin-bottom: 30px;
      }
      
      .avatar-preview {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        margin: 0 auto 15px;
        border: 4px solid #F7B801;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }
      
      .avatar-preview:hover {
        transform: scale(1.05);
      }
      
      .avatar-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .generate-avatar-btn {
        background: linear-gradient(135deg, #F7B801, #F8F4E3);
        color: #7E5109;
        border: none;
        padding: 10px 20px;
        border-radius: 25px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Tajawal', sans-serif;
      }
      
      .generate-avatar-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(247, 184, 1, 0.3);
      }
      
      .form-section {
        margin-bottom: 25px;
      }
      
      .form-group {
        margin-bottom: 20px;
      }
      
      .form-label {
        display: block;
        font-weight: bold;
        color: #7E5109;
        margin-bottom: 8px;
        font-size: 1.1rem;
      }
      
      .form-input, .form-textarea {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #F8F4E3;
        border-radius: 10px;
        font-size: 1rem;
        font-family: 'Tajawal', sans-serif;
        transition: border-color 0.3s ease;
        box-sizing: border-box;
      }
      
      .form-input:focus, .form-textarea:focus {
        outline: none;
        border-color: #F7B801;
      }
      
      .form-textarea {
        min-height: 100px;
        resize: vertical;
      }
      
      .interests-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 10px;
      }
      
      .interest-tag {
        padding: 8px 15px;
        background: #F8F4E3;
        color: #7E5109;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        border: 2px solid transparent;
      }
      
      .interest-tag:hover {
        background: #F7B801;
        color: white;
      }
      
      .interest-tag.selected {
        background: #F7B801;
        color: white;
        border-color: #7E5109;
      }
      
      .form-select {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #F8F4E3;
        border-radius: 10px;
        font-size: 1rem;
        font-family: 'Tajawal', sans-serif;
        background: white;
        cursor: pointer;
      }
      
      .form-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 30px;
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
      
      .identity-preview {
        margin-top: 30px;
        padding: 20px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
      
      .preview-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
      }
      
      .preview-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
      }
      
      .preview-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .preview-info h3 {
        margin: 0;
        color: #7E5109;
      }
      
      .preview-info p {
        margin: 5px 0 0;
        color: #7E5109;
        opacity: 0.7;
      }
      
      .preview-bio {
        margin-bottom: 15px;
        color: #7E5109;
        line-height: 1.6;
      }
      
      .preview-interests {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .preview-interest {
        padding: 5px 12px;
        background: #F8F4E3;
        color: #7E5109;
        border-radius: 15px;
        font-size: 0.8rem;
      }
      
      @media (max-width: 768px) {
        .identity-generator {
          padding: 15px;
        }
        
        .identity-title {
          font-size: 1.5rem;
        }
        
        .form-actions {
          flex-direction: column;
        }
        
        .btn {
          width: 100%;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  render() {
    this.container.innerHTML = `
      <div class="identity-generator">
        <div class="identity-header">
          <h1 class="identity-title">مولّد الهوية الجزائرية</h1>
          <p class="identity-subtitle">أنشئ هويتك الرقمية الفريدة في نبض الجزائر</p>
        </div>
        
        <div class="avatar-section">
          <div class="avatar-preview">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=algeria" alt="الصورة الرمزية">
          </div>
          <button class="generate-avatar-btn">توليد صورة رمزية جديدة</button>
        </div>
        
        <div class="form-section">
          <div class="form-group">
            <label class="form-label">الاسم الكامل</label>
            <input type="text" class="form-input" id="name-input" placeholder="أدخل اسمك الكامل">
          </div>
          
          <div class="form-group">
            <label class="form-label">نبذة شخصية</label>
            <textarea class="form-textarea" id="bio-input" placeholder="أخبرنا عن نفسك في بضع كلمات..."></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">الاهتمامات</label>
            <div class="interests-container">
              <div class="interest-tag" data-interest="technology">التكنولوجيا</div>
              <div class="interest-tag" data-interest="sports">الرياضة</div>
              <div class="interest-tag" data-interest="art">الفن</div>
              <div class="interest-tag" data-interest="music">الموسيقى</div>
              <div class="interest-tag" data-interest="travel">السفر</div>
              <div class="interest-tag" data-interest="food">الطعام</div>
              <div class="interest-tag" data-interest="reading">القراءة</div>
              <div class="interest-tag" data-interest="nature">الطبيعة</div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">السمة الشخصية</label>
            <select class="form-select" id="trait-select">
              <option value="">اختر سمة شخصية</option>
              <option value="creative">مبدع</option>
              <option value="analytical">تحليلي</option>
              <option value="adventurous">مغامر</option>
              <option value="social">اجتماعي</option>
              <option value="thoughtful">متأمل</option>
              <option value="energetic">نشيط</option>
            </select>
          </div>
        </div>
        
        <div class="form-actions">
          <button class="btn btn-secondary" id="clear-btn">مسح البيانات</button>
          <button class="btn btn-primary" id="save-btn">حفظ الهوية</button>
        </div>
        
        <div class="identity-preview" id="preview" style="display: none;">
          <div class="preview-header">
            <div class="preview-avatar">
              <img src="" alt="الصورة الرمزية">
            </div>
            <div class="preview-info">
              <h3></h3>
              <p></p>
            </div>
          </div>
          <div class="preview-bio"></div>
          <div class="preview-interests"></div>
        </div>
      </div>
    `;
    
    // إنشاء عنصر Toast
    this.toast = document.createElement('div');
    this.toast.className = 'toast';
    document.body.appendChild(this.toast);
  }
  
  attachEventListeners() {
    // زر توليد الصورة الرمزية
    const generateBtn = this.container.querySelector('.generate-avatar-btn');
    generateBtn.addEventListener('click', () => this.generateAvatar());
    
    // حقول الإدخال
    const nameInput = this.container.querySelector('#name-input');
    const bioInput = this.container.querySelector('#bio-input');
    const traitSelect = this.container.querySelector('#trait-select');
    
    nameInput.addEventListener('input', (e) => {
      this.identity.name = e.target.value;
      this.updatePreview();
    });
    
    bioInput.addEventListener('input', (e) => {
      this.identity.bio = e.target.value;
      this.updatePreview();
    });
    
    traitSelect.addEventListener('change', (e) => {
      this.identity.personalityTraits = e.target.value ? [e.target.value] : [];
      this.updatePreview();
    });
    
    // الاهتمامات
    const interestTags = this.container.querySelectorAll('.interest-tag');
    interestTags.forEach(tag => {
      tag.addEventListener('click', () => {
        const interest = tag.getAttribute('data-interest');
        this.toggleInterest(interest, tag);
      });
    });
    
    // الأزرار
    const clearBtn = this.container.querySelector('#clear-btn');
    const saveBtn = this.container.querySelector('#save-btn');
    
    clearBtn.addEventListener('click', () => this.clearForm());
    saveBtn.addEventListener('click', () => this.saveIdentity());
  }
  
  generateAvatar() {
    const seeds = ['algeria', 'oasis', 'sahara', 'casbah', 'kabyle', 'tuareg', 'oran', 'constantine'];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
    
    const avatarPreview = this.container.querySelector('.avatar-preview img');
    avatarPreview.src = avatarUrl;
    
    this.identity.avatar = avatarUrl;
    this.updatePreview();
    
    this.showToast('تم توليد صورة رمزية جديدة!');
  }
  
  toggleInterest(interest, element) {
    const index = this.identity.interests.indexOf(interest);
    
    if (index === -1) {
      this.identity.interests.push(interest);
      element.classList.add('selected');
    } else {
      this.identity.interests.splice(index, 1);
      element.classList.remove('selected');
    }
    
    this.updatePreview();
  }
  
  updatePreview() {
    const preview = this.container.querySelector('#preview');
    
    if (!this.identity.name && !this.identity.bio) {
      preview.style.display = 'none';
      return;
    }
    
    preview.style.display = 'block';
    
    // تحديث الصورة الرمزية
    const previewAvatar = preview.querySelector('.preview-avatar img');
    previewAvatar.src = this.identity.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=algeria';
    
    // تحديث المعلومات
    const previewName = preview.querySelector('.preview-info h3');
    const previewTrait = preview.querySelector('.preview-info p');
    const previewBio = preview.querySelector('.preview-bio');
    const previewInterests = preview.querySelector('.preview-interests');
    
    previewName.textContent = this.identity.name || 'اسم غير محدد';
    
    const traitLabels = {
      'creative': 'مبدع',
      'analytical': 'تحليلي',
      'adventurous': 'مغامر',
      'social': 'اجتماعي',
      'thoughtful': 'متأمل',
      'energetic': 'نشيط'
    };
    
    previewTrait.textContent = this.identity.personalityTraits.length > 0 
      ? traitLabels[this.identity.personalityTraits[0]] 
      : 'شخصية فريدة';
    
    previewBio.textContent = this.identity.bio || 'لا توجد نبذة شخصية';
    
    // تحديث الاهتمامات
    previewInterests.innerHTML = '';
    this.identity.interests.forEach(interest => {
      const interestElement = document.createElement('span');
      interestElement.className = 'preview-interest';
      interestElement.textContent = this.getInterestLabel(interest);
      previewInterests.appendChild(interestElement);
    });
  }
  
  getInterestLabel(interest) {
    const labels = {
      'technology': 'التكنولوجيا',
      'sports': 'الرياضة',
      'art': 'الفن',
      'music': 'الموسيقى',
      'travel': 'السفر',
      'food': 'الطعام',
      'reading': 'القراءة',
      'nature': 'الطبيعة'
    };
    
    return labels[interest] || interest;
  }
  
  clearForm() {
    this.identity = {
      name: '',
      avatar: '',
      bio: '',
      interests: [],
      personalityTraits: []
    };
    
    // مسح الحقول
    this.container.querySelector('#name-input').value = '';
    this.container.querySelector('#bio-input').value = '';
    this.container.querySelector('#trait-select').value = '';
    
    // إلغاء تحديد الاهتمامات
    const interestTags = this.container.querySelectorAll('.interest-tag');
    interestTags.forEach(tag => tag.classList.remove('selected'));
    
    // إعادة تعيين الصورة الرمزية
    this.generateAvatar();
    
    // إخفاء المعاينة
    this.container.querySelector('#preview').style.display = 'none';
    
    this.showToast('تم مسح جميع البيانات');
  }
  
  saveIdentity() {
    if (!this.identity.name) {
      this.showToast('يرجى إدخال الاسم على الأقل');
      return;
    }
    
    // حفظ في localStorage
    localStorage.setItem('nabd_identity', JSON.stringify(this.identity));
    
    // محاولة الحفظ في GitHub Gists (اختياري)
    this.saveToGist();
    
    this.showToast('تم حفظ الهوية بنجاح!');
    
    // إطلاق حدث الحفظ
    window.dispatchEvent(new CustomEvent('identitySaved', { detail: this.identity }));
  }
  
  async saveToGist() {
    const token = localStorage.getItem('github_token');
    if (!token) return;
    
    try {
      const response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: 'نبض الجزائر - هوية المستخدم',
          public: false,
          files: {
            'identity.json': {
              content: JSON.stringify(this.identity, null, 2)
            }
          }
        })
      });
      
      if (response.ok) {
        const gist = await response.json();
        localStorage.setItem('nabd_identity_gist_id', gist.id);
        this.showToast('تم الحفظ في GitHub Gists بنجاح!');
      }
    } catch (error) {
      console.error('Error saving to Gist:', error);
    }
  }
  
  showToast(message) {
    this.toast.textContent = message;
    this.toast.classList.add('show');
    
    setTimeout(() => {
      this.toast.classList.remove('show');
    }, 3000);
  }
}
