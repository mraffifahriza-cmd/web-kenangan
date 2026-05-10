// ============================================
// KENANGAN KITA - SCRIPT LENGKAP
// ============================================

const STORAGE_KEYS = {
  GALLERY: 'kita_gallery',
  TIMELINE: 'kita_timeline',
  START_DATE: 'kita_startDate',
  LETTER: 'kita_letter'
};

let galleryItems = [];
let timelineItems = [];

// LOAD DATA
function loadData() {
  const savedGallery = localStorage.getItem(STORAGE_KEYS.GALLERY);
  galleryItems = savedGallery ? JSON.parse(savedGallery) : [];
  
  const savedTimeline = localStorage.getItem(STORAGE_KEYS.TIMELINE);
  timelineItems = savedTimeline ? JSON.parse(savedTimeline) : [];

  renderGallery();
  renderTimeline();
  updateCounter();
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// RENDER GALLERY
function renderGallery() {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid) return;

  if (galleryItems.length === 0) {
    galleryGrid.innerHTML = '<p style="text-align:center; color:#b8919c; grid-column:1/-1;">✨ Belum ada kenangan. Yuk tambah! ✨</p>';
    return;
  }

  galleryGrid.innerHTML = galleryItems.map(item => `
    <div class="gallery-card" data-id="${item.id}">
      ${item.img ? `<img src="${item.img}" alt="${escapeHtml(item.caption)}">` : `
        <div style="height:220px; background:linear-gradient(135deg,#f5dde3,#f7efe6); display:flex; align-items:center; justify-content:center;">
          <span style="font-size:3rem;">📷💕</span>
        </div>
      `}
      <div class="card-body">
        <p class="card-caption">✨ ${escapeHtml(item.caption)}</p>
        <p class="card-date">📅 ${escapeHtml(item.date) || 'Tanpa tanggal'}</p>
        <button class="card-delete" onclick="deleteGalleryItem(${item.id})">🗑️ Hapus</button>
      </div>
    </div>
  `).join('');
}

// RENDER TIMELINE
function renderTimeline() {
  const timelineContainer = document.getElementById('timelineContainer');
  if (!timelineContainer) return;

  if (timelineItems.length === 0) {
    timelineContainer.innerHTML = '<p style="text-align:center; color:#b8919c;">✨ Belum ada momen. Yuk tambah! ✨</p>';
    return;
  }

  timelineContainer.innerHTML = timelineItems.map(item => `
    <div class="timeline-item" data-id="${item.id}">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-date">📅 ${escapeHtml(item.date)}</div>
        <div class="timeline-title">💖 ${escapeHtml(item.title)}</div>
        <div class="timeline-desc">${escapeHtml(item.desc || '')}</div>
      </div>
      <div class="timeline-actions">
        <button class="tl-btn tl-edit" onclick="editTimelineItem(${item.id})">✏️</button>
        <button class="tl-btn tl-del" onclick="deleteTimelineItem(${item.id})">🗑️</button>
      </div>
    </div>
  `).join('');
}

// CRUD GALLERY
function addGalleryItem(item) {
  galleryItems.unshift(item);
  saveData(STORAGE_KEYS.GALLERY, galleryItems);
  renderGallery();
  showNotification('✨ Kenangan berhasil ditambahkan! ✨');
}

function deleteGalleryItem(id) {
  if (confirm('💔 Hapus kenangan ini?')) {
    galleryItems = galleryItems.filter(item => item.id !== id);
    saveData(STORAGE_KEYS.GALLERY, galleryItems);
    renderGallery();
    showNotification('🗑️ Kenangan dihapus');
  }
}

// CRUD TIMELINE
function addTimelineItem(item) {
  timelineItems.push(item);
  saveData(STORAGE_KEYS.TIMELINE, timelineItems);
  renderTimeline();
  showNotification('📅 Momen berhasil ditambahkan! ✨');
}

function deleteTimelineItem(id) {
  if (confirm('💔 Hapus momen ini?')) {
    timelineItems = timelineItems.filter(item => item.id !== id);
    saveData(STORAGE_KEYS.TIMELINE, timelineItems);
    renderTimeline();
    showNotification('🗑️ Momen dihapus');
  }
}

function editTimelineItem(id) {
  const item = timelineItems.find(i => i.id === id);
  if (!item) return;
  
  const newTitle = prompt('✏️ Edit judul momen:', item.title);
  if (newTitle && newTitle.trim()) item.title = newTitle.trim();
  
  const newDesc = prompt('✏️ Edit cerita:', item.desc);
  if (newDesc !== null) item.desc = newDesc;
  
  saveData(STORAGE_KEYS.TIMELINE, timelineItems);
  renderTimeline();
  showNotification('✏️ Momen diupdate!');
}

// LOVE COUNTER
function updateCounter() {
  const startDateStr = localStorage.getItem(STORAGE_KEYS.START_DATE) || '2023-02-14';
  const startDate = new Date(startDateStr);
  const now = new Date();
  
  const diffTime = Math.abs(now - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = diffDays % 30;
  
  const counterBoxes = document.getElementById('counterBoxes');
  if (counterBoxes) {
    counterBoxes.innerHTML = `
      <div class="counter-box"><div class="num">${years}</div><div class="lbl">Tahun</div></div>
      <div class="counter-box"><div class="num">${months}</div><div class="lbl">Bulan</div></div>
      <div class="counter-box"><div class="num">${days}</div><div class="lbl">Hari</div></div>
    `;
  }
  
  const heroDuration = document.getElementById('heroDuration');
  if (heroDuration) {
    heroDuration.innerHTML = `💕 ${diffDays} hari penuh kebahagiaan 💕`;
  }
}

// NOTIFICATION
function showNotification(message) {
  let toast = document.getElementById('customToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'customToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #e8a4b0, #c4707f);
      color: white;
      padding: 12px 24px;
      border-radius: 40px;
      font-size: 0.9rem;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
      white-space: nowrap;
      font-family: 'Lato', sans-serif;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.style.opacity = '1';
  
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 2000);
}

// ESCAPE HTML
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// PETALS & STARS
function createPetals() {
  const container = document.getElementById('petalsContainer');
  if (!container) return;
  
  for (let i = 0; i < 40; i++) {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDuration = 6 + Math.random() * 12 + 's';
    petal.style.animationDelay = Math.random() * 20 + 's';
    petal.style.width = 6 + Math.random() * 14 + 'px';
    petal.style.height = 10 + Math.random() * 18 + 'px';
    container.appendChild(petal);
  }
}

function createStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  
  for (let i = 0; i < 120; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDuration = 2 + Math.random() * 5 + 's';
    star.style.animationDelay = Math.random() * 6 + 's';
    container.appendChild(star);
  }
}

// MODAL
function openModal() {
  const modal = document.getElementById('modalOverlay');
  if (modal) modal.classList.add('open');
}

function closeModal() {
  const modal = document.getElementById('modalOverlay');
  if (modal) modal.classList.remove('open');
}

// ============================================
// MUSIC PLAYER - 6 LAGU
// ============================================
(function initMusicPlayer() {
  const PLAYLIST = [
    { file: 'musik/lagu1.mp3', title: 'Perfect', artist: 'Ed Sheeran', emoji: '💫' },
    { file: 'musik/lagu2.mp3', title: 'All of Me', artist: 'John Legend', emoji: '🎹' },
    { file: 'musik/lagu3.mp3', title: 'A Thousand Years', artist: 'Christina Perri', emoji: '⏳' },
    { file: 'musik/lagu4.mp3', title: 'Mati-Matian', artist: 'Mahalini', emoji: '🌸' },
    { file: 'musik/lagu5.mp3', title: 'Penjaga Hati', artist: 'Nadhif Basalamah', emoji: '💖' },
    { file: 'musik/lagu6.mp3', title: 'Komang', artist: 'Raim Laode', emoji: '🌊' }
  ];

  let currentIndex = 0;
  let isPlaying = false;
  
  const audio = new Audio();
  const titleEl = document.getElementById('musicTitle');
  const artistEl = document.getElementById('musicArtist');
  const disc = document.getElementById('musicDisc');
  const playBtn = document.getElementById('playBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const playlistBtn = document.getElementById('playlistBtn');
  const volumeBar = document.getElementById('volumeBar');
  const seekBar = document.getElementById('seekBar');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');

  function loadTrack(index, autoPlay = true) {
    if (index < 0) index = PLAYLIST.length - 1;
    if (index >= PLAYLIST.length) index = 0;
    
    currentIndex = index;
    const track = PLAYLIST[currentIndex];
    
    if (titleEl) titleEl.innerHTML = `${track.emoji} ${track.title}`;
    if (artistEl) artistEl.textContent = track.artist;
    
    audio.src = track.file;
    audio.load();
    
    if (autoPlay) {
      audio.play().catch(() => console.log('Auto-play blocked'));
    }
  }

  function togglePlay() {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  function nextTrack() {
    loadTrack(currentIndex + 1, true);
  }

  function prevTrack() {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      loadTrack(currentIndex - 1, true);
    }
  }

  function updateProgress() {
    if (seekBar && audio.duration) {
      seekBar.value = (audio.currentTime / audio.duration) * 100;
    }
    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  }

  function updateDuration() {
    if (durationEl && audio.duration) {
      durationEl.textContent = formatTime(audio.duration);
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Event listeners
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('durationchange', updateDuration);
  audio.addEventListener('ended', nextTrack);
  audio.addEventListener('play', () => {
    isPlaying = true;
    if (playBtn) playBtn.innerHTML = '⏸';
    if (disc) disc.classList.add('spinning');
  });
  audio.addEventListener('pause', () => {
    isPlaying = false;
    if (playBtn) playBtn.innerHTML = '▶';
    if (disc) disc.classList.remove('spinning');
  });

  // Button events
  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (prevBtn) prevBtn.addEventListener('click', prevTrack);
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);
  
  if (volumeBar) {
    volumeBar.addEventListener('input', (e) => {
      audio.volume = e.target.value / 100;
    });
    audio.volume = 0.5;
  }
  
  if (seekBar) {
    seekBar.addEventListener('input', (e) => {
      if (audio.duration) {
        audio.currentTime = (e.target.value / 100) * audio.duration;
      }
    });
  }

  if (playlistBtn) {
    playlistBtn.addEventListener('click', () => {
      let msg = '📋 DAFTAR LAGU ROMANTIS 📋\n\n';
      PLAYLIST.forEach((track, i) => {
        msg += `${i+1}. ${track.title} - ${track.artist} ${track.emoji}\n`;
      });
      msg += '\n💕 Pilih lagu dari folder musik! 💕';
      alert(msg);
    });
  }

  loadTrack(0, false);
})();

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  createPetals();
  createStars();
  
  const savedLetter = localStorage.getItem(STORAGE_KEYS.LETTER);
  const letterBody = document.getElementById('letterBody');
  if (savedLetter && letterBody) {
    letterBody.innerHTML = savedLetter.replace(/\n/g, '<br>');
  }
  
  const openBtn = document.getElementById('openFormBtn');
  const closeBtn = document.getElementById('closeModal');
  const modal = document.getElementById('modalOverlay');
  
  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
});

// EXPORT KE GLOBAL
window.addGalleryItem = addGalleryItem;
window.addTimelineItem = addTimelineItem;
window.deleteGalleryItem = deleteGalleryItem;
window.deleteTimelineItem = deleteTimelineItem;
window.editTimelineItem = editTimelineItem;
window.updateCounter = updateCounter;
window.loadData = loadData;