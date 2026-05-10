// ============================================
// FORM HANDLER - KENANGAN KITA
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('formContainer');
  if (!container) return;

  const STORAGE_KEYS = {
    GALLERY: 'kita_gallery',
    TIMELINE: 'kita_timeline',
    START_DATE: 'kita_startDate',
    LETTER: 'kita_letter'
  };

  container.innerHTML = `
    <style>
      .form-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
      .tab-btn { flex: 1; padding: 0.6rem 0.8rem; background: #f7efe6; border: 1.5px solid #e8d9ca; border-radius: 12px; font-family: 'Lato', sans-serif; font-size: 0.85rem; color: #7a5c65; cursor: pointer; transition: all 0.2s; }
      .tab-btn:hover { background: #f5dde3; border-color: #e8a4b0; }
      .tab-btn.active { background: #f5dde3; border-color: #e8a4b0; color: #c4707f; font-weight: 600; }
      .tab-panel { display: none; }
      .tab-panel.active { display: block; animation: fadeUp 0.3s ease; }
      .form-toast { text-align: center; font-size: 0.85rem; min-height: 1.2em; transition: opacity 0.5s; font-style: italic; margin-top: 0.5rem; color: #7a5c65; }
      .mem-form { display: flex; flex-direction: column; gap: 1rem; }
      .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
      .form-group label { font-size: 0.85rem; font-weight: 500; letter-spacing: 0.05em; color: #7a5c65; }
      .form-group input, .form-group textarea, .form-group select { background: #f7efe6; border: 1.5px solid #e8d9ca; border-radius: 12px; padding: 0.75rem 1rem; font-family: 'Lato', sans-serif; font-size: 0.95rem; color: #4a3840; outline: none; transition: border-color 0.2s; }
      .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: #e8a4b0; }
      .form-group textarea { resize: vertical; min-height: 90px; }
      .form-img-preview { width: 100%; height: 180px; object-fit: cover; border-radius: 12px; display: none; margin-top: 0.5rem; border: 2px solid #e8d9ca; }
      .btn-submit { background: linear-gradient(135deg, #e8a4b0, #c4707f); color: white; border: none; border-radius: 12px; padding: 0.85rem; font-size: 1rem; font-weight: 600; cursor: pointer; letter-spacing: 0.04em; box-shadow: 0 4px 14px rgba(196, 112, 127, 0.35); transition: all 0.2s; margin-top: 0.5rem; }
      .btn-submit:hover { opacity: 0.9; transform: translateY(-2px); }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    </style>

    <div class="form-tabs">
      <button class="tab-btn active" data-tab="foto">📸 Tambah Foto</button>
      <button class="tab-btn" data-tab="momen">📅 Tambah Momen</button>
      <button class="tab-btn" data-tab="pengaturan">⚙️ Pengaturan</button>
    </div>

    <div class="tab-panel active" id="tab-foto">
      <form class="mem-form" id="galleryForm" novalidate>
        <div class="form-group">
          <label for="g_caption">💬 Captung Foto</label>
          <input type="text" id="g_caption" placeholder="Contoh: Momen indah kita..." required/>
        </div>
        <div class="form-group">
          <label for="g_date">📅 Tanggal</label>
          <input type="text" id="g_date" placeholder="contoh: 14 Februari 2025"/>
        </div>
        <div class="form-group">
          <label for="g_img">🖼️ Upload Foto</label>
          <input type="file" id="g_img" accept="image/*"/>
          <img id="g_preview" class="form-img-preview" alt="preview"/>
        </div>
        <button type="submit" class="btn-submit">💾 Simpan Kenangan</button>
      </form>
    </div>

    <div class="tab-panel" id="tab-momen">
      <form class="mem-form" id="timelineForm" novalidate>
        <div class="form-group">
          <label for="t_date">📅 Tanggal Momen</label>
          <input type="text" id="t_date" placeholder="contoh: 1 April 2025" required/>
        </div>
        <div class="form-group">
          <label for="t_title">💭 Judul Momen</label>
          <input type="text" id="t_title" placeholder="Contoh: Kencan pertama 💑" required/>
        </div>
        <div class="form-group">
          <label for="t_desc">✨ Cerita Singkat</label>
          <textarea id="t_desc" placeholder="Tulis kenangan indahmu di sini..."></textarea>
        </div>
        <button type="submit" class="btn-submit">📝 Tambah ke Timeline</button>
      </form>
    </div>

    <div class="tab-panel" id="tab-pengaturan">
      <form class="mem-form" id="settingsForm" novalidate>
        <div class="form-group">
          <label for="s_startDate">💕 Tanggal Mulai Bersama</label>
          <input type="date" id="s_startDate"/>
        </div>
        <div class="form-group">
          <label for="s_letter">💌 Isi Surat Cinta</label>
          <textarea id="s_letter" rows="6" placeholder="Tulis pesan cintamu di sini..."></textarea>
        </div>
        <button type="submit" class="btn-submit">💖 Simpan Pengaturan</button>
      </form>
    </div>

    <p class="form-toast" id="formToast"></p>
  `;

  // Load saved data
  const savedStart = localStorage.getItem(STORAGE_KEYS.START_DATE) || '2023-02-14';
  const startDateInput = document.getElementById('s_startDate');
  if (startDateInput) startDateInput.value = savedStart;

  const savedLetter = localStorage.getItem(STORAGE_KEYS.LETTER);
  const letterInput = document.getElementById('s_letter');
  if (savedLetter && letterInput) letterInput.value = savedLetter;

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const tabId = document.getElementById(`tab-${btn.dataset.tab}`);
      if (tabId) tabId.classList.add('active');
    });
  });

  // Image preview
  const imgInput = document.getElementById('g_img');
  if (imgInput) {
    imgInput.addEventListener('change', function() {
      const file = this.files[0];
      const preview = document.getElementById('g_preview');
      if (file && preview) {
        const reader = new FileReader();
        reader.onload = e => {
          preview.src = e.target.result;
          preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else if (preview) {
        preview.style.display = 'none';
      }
    });
  }

  // Gallery form submit
  const galleryForm = document.getElementById('galleryForm');
  if (galleryForm) {
    galleryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const caption = document.getElementById('g_caption')?.value.trim();
      const date = document.getElementById('g_date')?.value.trim();
      const imgFile = document.getElementById('g_img')?.files[0];

      if (!caption) {
        showToast('🌸 Tuliskan caption foto dulu ya!');
        return;
      }

      const doAdd = (imgData) => {
        const item = { id: Date.now(), caption, date: date || formatToday(), img: imgData || '' };
        if (typeof window.addGalleryItem === 'function') {
          window.addGalleryItem(item);
          showToast('💖 Foto kenangan berhasil ditambahkan!');
        } else {
          showToast('⚠️ Error: Fungsi tidak ditemukan, refresh halaman!');
        }
        this.reset();
        const preview = document.getElementById('g_preview');
        if (preview) preview.style.display = 'none';
        setTimeout(() => {
          const modal = document.getElementById('modalOverlay');
          if (modal) modal.classList.remove('open');
        }, 1000);
      };

      if (imgFile) {
        const reader = new FileReader();
        reader.onload = e => doAdd(e.target.result);
        reader.readAsDataURL(imgFile);
      } else {
        doAdd('');
      }
    });
  }

  // Timeline form submit
  const timelineForm = document.getElementById('timelineForm');
  if (timelineForm) {
    timelineForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const date = document.getElementById('t_date')?.value.trim();
      const title = document.getElementById('t_title')?.value.trim();
      const desc = document.getElementById('t_desc')?.value.trim();

      if (!date || !title) {
        showToast('🌸 Isi tanggal dan judul momen ya!');
        return;
      }

      const item = { id: Date.now(), date, title, desc: desc || '' };
      if (typeof window.addTimelineItem === 'function') {
        window.addTimelineItem(item);
        showToast('✨ Momen berhasil ditambahkan!');
      } else {
        showToast('⚠️ Error: Fungsi tidak ditemukan, refresh halaman!');
      }
      this.reset();
      setTimeout(() => {
        const modal = document.getElementById('modalOverlay');
        if (modal) modal.classList.remove('open');
      }, 1000);
    });
  }

  // Settings form submit
  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const startDate = document.getElementById('s_startDate')?.value;
      const letter = document.getElementById('s_letter')?.value.trim();

      if (startDate) {
        localStorage.setItem(STORAGE_KEYS.START_DATE, startDate);
        if (typeof window.updateCounter === 'function') window.updateCounter();
      }
      if (letter) {
        localStorage.setItem(STORAGE_KEYS.LETTER, letter);
        const letterEl = document.getElementById('letterBody');
        if (letterEl) letterEl.innerHTML = letter.replace(/\n/g, '<br>');
      }
      showToast('💌 Pengaturan disimpan dengan cinta!');
      setTimeout(() => {
        const modal = document.getElementById('modalOverlay');
        if (modal) modal.classList.remove('open');
      }, 1000);
    });
  }

  function showToast(msg) {
    const toast = document.getElementById('formToast');
    if (toast) {
      toast.textContent = msg;
      toast.style.opacity = '1';
      setTimeout(() => { toast.style.opacity = '0'; }, 2500);
    }
  }

  function formatToday() {
    const now = new Date();
    return now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }
});