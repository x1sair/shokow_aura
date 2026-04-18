// настройка слайдера
const totalCards = 2;
let currentCard  = 0;
let isDragging   = false;
let dragStartX   = 0;
let dragDelta    = 0;

const track = document.getElementById('slider-track');
const cards = document.querySelectorAll('.card');

// точки в нижних частях карточек
function buildAllDots() {
  for (let c = 0; c < totalCards; c++) {
    const wrap = document.getElementById('pageDots' + (c === 0 ? '' : c));
    if (!wrap) continue;
    wrap.innerHTML = '';
    for (let i = 0; i < totalCards; i++) {
      const btn = document.createElement('button');
      btn.className = 'pdot' + (i === c ? ' active' : '');
      btn.dataset.target = i;
      btn.addEventListener('click', e => {
        e.stopPropagation();
        goToCard(parseInt(btn.dataset.target));
      });
      wrap.appendChild(btn);
    }
  }
}

// переход к карточке
function goToCard(idx) {
  idx = Math.max(0, Math.min(totalCards - 1, idx));

  // прячет текущую карточку
  cards[currentCard].classList.remove('visible');

  currentCard = idx;

  track.style.transition = 'transform .4s cubic-bezier(.4,0,.2,1)';
  track.style.transform  = `translateX(calc(-${idx} * (420px + 24px)))`;

  // показывает новую карточку с небольшой задержкой
  setTimeout(() => {
    cards[currentCard].classList.add('visible');
  }, 80);

  // обновление точек
  document.querySelectorAll('.pdot').forEach(dot => {
    dot.classList.toggle('active', parseInt(dot.dataset.target) === idx);
  });
}

// перетаскивание
track.addEventListener('mousedown', e => {
  if (e.target.closest('a, button')) return;
  isDragging = true;
  dragStartX = e.clientX;
  dragDelta  = 0;
  track.style.transition = 'none';
});

window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  dragDelta = e.clientX - dragStartX;
  const base = currentCard * (420 + 24);
  track.style.transform = `translateX(${-base + dragDelta}px)`;
});

window.addEventListener('mouseup', e => {
  if (!isDragging) return;
  isDragging = false;

  if (dragDelta < -60) {
    goToCard(currentCard + 1);
  } else if (dragDelta > 60) {
    goToCard(currentCard - 1);
  } else {
    goToCard(currentCard);
  }
});

// свайп на мобилке
let touchStartX = 0;
track.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  track.style.transition = 'none';
}, { passive: true });

track.addEventListener('touchmove', e => {
  const delta = e.touches[0].clientX - touchStartX;
  const base  = currentCard * (420 + 24);
  track.style.transform = `translateX(${-base + delta}px)`;
}, { passive: true });

track.addEventListener('touchend', e => {
  const delta = e.changedTouches[0].clientX - touchStartX;
  if (delta < -60)      goToCard(currentCard + 1);
  else if (delta > 60)  goToCard(currentCard - 1);
  else                  goToCard(currentCard);
});

buildAllDots();
cards[0].classList.add('visible');
goToCard(0);

// вход на сайт
function enterSite() {
  document.getElementById('entry').classList.add('hidden');

  const music = document.getElementById('bg-music');
  const vid   = document.getElementById('bg-video');
  const vol   = parseFloat(document.getElementById('vol-slider').value);

  music.volume = vol;
  vid.volume   = vol;
  music.muted  = false;
  vid.muted    = false;

  music.play().catch(() => {});
  vid.play().catch(() => {});

  updateVolIcon(vol);
  document.getElementById('vol-label').textContent = Math.round(vol * 100) + '%';
}

// иконка громкости
function updateVolIcon(val) {
  const wave1 = document.getElementById('vol-wave-1');
  const wave2 = document.getElementById('vol-wave-2');
  const icon  = document.getElementById('vol-icon');
  if (!wave1 || !wave2) return;

  if (val == 0) {
    wave1.setAttribute('d', 'M23 9 17 15');
    wave2.setAttribute('d', 'M17 9 23 15');
    icon.style.stroke = 'var(--text-muted)';
  } else if (val < 0.5) {
    wave1.setAttribute('d', 'M15.54 8.46a5 5 0 0 1 0 7.07');
    wave2.setAttribute('d', '');
    icon.style.stroke = 'var(--accent)';
  } else {
    wave1.setAttribute('d', 'M15.54 8.46a5 5 0 0 1 0 7.07');
    wave2.setAttribute('d', 'M19.07 4.93a10 10 0 0 1 0 14.14');
    icon.style.stroke = 'var(--accent)';
  }
}

// сама громкость
function setVolume(val) {
  const vid   = document.getElementById('bg-video');
  const music = document.getElementById('bg-music');
  val = parseFloat(val);
  vid.volume   = val;
  music.volume = val;
  vid.muted    = (val === 0);
  music.muted  = (val === 0);
  document.getElementById('vol-label').textContent = Math.round(val * 100) + '%';
  updateVolIcon(val);
}

function toggleMute() {
  const slider = document.getElementById('vol-slider');
  const music  = document.getElementById('bg-music');
  const vid    = document.getElementById('bg-video');
  if (vid.muted || vid.volume === 0) {
    slider.value = 0.25;
    setVolume(0.25);
    music.play().catch(() => {});
  } else {
    slider.value = 0;
    setVolume(0);
  }
}

// кнопка смены цветовой темы
const themes = ['default', 'rose', 'mint', 'gold'];
let themeIdx = 0;

function cycleTheme() {
  themeIdx = (themeIdx + 1) % themes.length;
  document.body.dataset.theme = themes[themeIdx];
}

// переключение фона на видео или фото (которое я убрал)
let bgMode = 'video';

function toggleBg() {
  const vid = document.getElementById('bg-video');
  const img = document.getElementById('bg-image');
  const btn = document.getElementById('bg-toggle');
  if (bgMode === 'image') {
    bgMode = 'video';
    img.style.display = 'none';
    vid.style.display = 'block';
    btn.textContent = 'фон: видео';
  } else {
    bgMode = 'image';
    vid.style.display = 'none';
    img.style.display = 'block';
    btn.textContent = 'фон: фото';
  }
}
