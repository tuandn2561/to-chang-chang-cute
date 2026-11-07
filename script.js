// Script for "Gửi Thu Trang Mau Khỏe" - Cute Healing Experience

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. WEB AUDIO SYNTHESIZER (MUSIC & SFX)
  // No external mp3 files required - 100% reliable!
  // ==========================================
  let audioCtx = null;
  let isSoundEnabled = true;
  let isMusicPlaying = false;
  let musicTimer = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a soft cute pop sound
  function playPop(frequency = 440) {
    if (!isSoundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn(e);
    }
  }

  // Play a gentle chime chord (pentatonic)
  function playChime(noteIndex = 0) {
    if (!isSoundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5, D5, E5, G5, A5, C6
      const freq = scale[noteIndex % scale.length];

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.warn(e);
    }
  }

  // Gentle lullaby music generator (celesta / music box simulation)
  const lullabyNotes = [
    523.25, 659.25, 783.99, 659.25, 880.00, 783.99, 659.25, 587.33,
    523.25, 587.33, 659.25, 523.25, 783.99, 659.25, 587.33, 523.25
  ];
  let noteCursor = 0;

  function playNextLullabyNote() {
    if (!isMusicPlaying) return;
    initAudio();
    if (!audioCtx) return;

    const freq = lullabyNotes[noteCursor % lullabyNotes.length];
    noteCursor++;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Sweet bell-like envelope
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.9);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.9);
    } catch (e) {}

    // Randomize timing slightly for human music-box charm (600ms - 800ms)
    const delay = 680 + (Math.random() * 80);
    musicTimer = setTimeout(playNextLullabyNote, delay);
  }

  function startMusic() {
    initAudio();
    isMusicPlaying = true;
    document.getElementById('music-text').textContent = 'Đang phát nhạc 🎵';
    document.getElementById('music-toggle').classList.add('bg-pink-100', 'border-pink-300');
    playNextLullabyNote();
  }

  function stopMusic() {
    isMusicPlaying = false;
    if (musicTimer) clearTimeout(musicTimer);
    document.getElementById('music-text').textContent = 'Giai điệu êm dịu';
    document.getElementById('music-toggle').classList.remove('bg-pink-100', 'border-pink-300');
  }

  // Toggle Controls
  const musicToggleBtn = document.getElementById('music-toggle');
  musicToggleBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });

  const soundToggleBtn = document.getElementById('sound-toggle');
  soundToggleBtn.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    document.getElementById('sound-icon').textContent = isSoundEnabled ? '🔊' : '🔇';
    soundToggleBtn.classList.toggle('opacity-50', !isSoundEnabled);
    if (isSoundEnabled) playPop(500);
  });

  // ==========================================
  // 2. CANVAS FLOATING BACKGROUND PARTICLES
  // ==========================================
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const particleTypes = ['heart', 'circle', 'star', 'sparkle'];
  const colors = ['#ffccd5', '#ffb3c6', '#ff8fab', '#ffe5ec', '#fff0f3', '#ffd1dc'];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.size = Math.random() * 12 + 8;
      this.speedY = Math.random() * 0.7 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      if (this.type === 'heart') {
        const s = this.size * 0.6;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s, -s * 0.5, -s * 0.8, s * 0.8, 0, s * 1.2);
        ctx.bezierCurveTo(s * 0.8, s * 0.8, s, -s * 0.5, 0, s * 0.3);
        ctx.fill();
      } else if (this.type === 'star') {
        const s = this.size * 0.4;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(Math.cos((18 + i * 72) * 0.01745) * s, -Math.sin((18 + i * 72) * 0.01745) * s);
          ctx.lineTo(Math.cos((54 + i * 72) * 0.01745) * (s * 0.5), -Math.sin((54 + i * 72) * 0.01745) * (s * 0.5));
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Spawn initial particles based on screen size
  const particleCount = Math.min(Math.floor(window.innerWidth / 30), 40);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function renderParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(renderParticles);
  }
  renderParticles();

  // ==========================================
  // 3. FLOATING TEXT & REACTION SPARKLES
  // ==========================================
  function spawnFloatingReaction(x, y, text) {
    const el = document.createElement('div');
    el.className = 'floating-reaction text-pink-600';
    el.textContent = text;

    // slight random horizontal drift
    const driftX = (Math.random() - 0.5) * 80;
    el.style.setProperty('--drift-x', `${driftX}px`);

    // Position at click/touch point
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    document.body.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 1400);
  }

  // Desktop mouse sparkle trail
  let lastSparkleTime = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkleTime < 80) return; // throttle
    lastSparkleTime = now;

    if (Math.random() > 0.4) return;
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-trail';
    const sparkles = ['✨', '🌸', '💖', '⭐', '💫'];
    sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    sparkle.style.left = `${e.clientX - 6}px`;
    sparkle.style.top = `${e.clientY - 6}px`;
    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 700);
  });

  // Touch sparkle for mobile
  window.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-trail';
    sparkle.textContent = '✨';
    sparkle.style.left = `${touch.clientX - 6}px`;
    sparkle.style.top = `${touch.clientY - 6}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 700);
  }, { passive: true });

  // ==========================================
  // 4. MASCOT EASTER EGG (Doctor Bunny)
  // ==========================================
  const mascotWrapper = document.getElementById('mascot-wrapper');
  const mascotSvg = document.getElementById('mascot-svg');
  const bunnyQuotes = [
    'Thương Trang nhất trần đời! 💖',
    'Ngoan uống thuốc nha bé iu! 🐰',
    'Tặng Trang 100 nụ hôn nè! 💋',
    'Khỏe lại mau để đi chơi nhé! 🌸',
    'Có anh ở đây bảo vệ em rùi! ✨'
  ];

  if (mascotWrapper) {
    mascotWrapper.addEventListener('click', (e) => {
      playPop(650);
      playChime(3);

      const rect = mascotWrapper.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 3;

      const randomQuote = bunnyQuotes[Math.floor(Math.random() * bunnyQuotes.length)];
      spawnFloatingReaction(x, y, randomQuote);

      // Bounce mascot extra
      mascotSvg.style.transform = 'scale(1.15) rotate(-5deg)';
      setTimeout(() => {
        mascotSvg.style.transform = '';
      }, 300);

      // Trigger mini confetti burst
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 15,
          spread: 60,
          origin: { x: (e.clientX || x) / window.innerWidth, y: (e.clientY || y) / window.innerHeight },
          colors: ['#ff8fab', '#ffc2d1', '#ffe5ec']
        });
      }
    });
  }

  // ==========================================
  // 5. FEATURE 1: HEALING BATTERY (NĂNG LƯỢNG)
  // ==========================================
  let energy = parseInt(localStorage.getItem('thu_trang_energy') || '45', 10);
  const energyBar = document.getElementById('energy-bar');
  const energyPercentage = document.getElementById('energy-percentage');
  const energyStatusText = document.getElementById('energy-status-text');
  const chargeBtn = document.getElementById('charge-btn');

  const energyAffirmations = [
    '+15% Năng Lượng Yêu Thương! ⚡',
    '+1 Cốc Nước Ấm Ngọt Lịm! 🍵',
    '+1 Nụ Hôn Trán Dịu Dàng! 💋',
    '+1 Lời Động Viên Ấm Lòng! 🌸',
    '+1 Chiếc Ôm Thật Chặt! 🧸',
    '+1 Phép Màu Xua Cảm Cúm! ✨'
  ];

  function updateEnergyUI() {
    if (energy > 100) energy = 100;
    energyBar.style.width = `${energy}%`;
    energyPercentage.textContent = `${energy}%`;

    if (energy < 50) {
      energyStatusText.textContent = '"Đang truyền năng lượng ấm áp từ xa cho bé Trang..."';
    } else if (energy < 80) {
      energyStatusText.textContent = '"Sức khỏe đang hồi phục rất tốt nè, sắc mặt hồng hào hơn rồi!" 🌸';
    } else if (energy < 100) {
      energyStatusText.textContent = '"Sắp đầy 100% rồi! Sắp thành cô bé khỏe re tung tăng rồi nha!" ✨';
    } else {
      energyStatusText.textContent = '🎉 100% SỨC KHỎE & TÌNH YÊU! Bé Thu Trang đã sẵn sàng khỏe khoắn rực rỡ!';
    }

    localStorage.setItem('thu_trang_energy', energy.toString());
  }

  updateEnergyUI();

  chargeBtn.addEventListener('click', (e) => {
    initAudio();
    playPop(520);
    playChime(Math.floor(energy / 20));

    const rect = chargeBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    const aff = energyAffirmations[Math.floor(Math.random() * energyAffirmations.length)];
    spawnFloatingReaction(x, y, aff);

    if (energy < 100) {
      energy += 15;
      if (energy > 100) energy = 100;
      updateEnergyUI();

      if (energy === 100) {
        // Big Confetti explosion
        triggerCelebration();
      }
    } else {
      // Already 100%, keep shooting hearts & celebration
      triggerHeartShower();
    }
  });

  function triggerCelebration() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ff758f', '#ff8fab', '#ffe5ec', '#ffb703', '#a7c957']
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff8fab', '#fb6f92']
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff8fab', '#fb6f92']
        });
      }, 250);
    }
  }

  function triggerHeartShower() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.5 },
        shapes: ['circle'],
        colors: ['#ff4d6d', '#ff8fab', '#ffb3c6']
      });
    }
  }

  // ==========================================
  // 6. FEATURE 2: MEDICINE MODAL
  // ==========================================
  const medicineData = {
    painkiller: {
      title: 'Viên Xua Tan Mệt Mỏi Siêu Cấp',
      dose: 'Liều dùng: Mỗi khi thấy người ê ẩm, nhức đầu',
      icon: '💊',
      desc: 'Thành phần gồm 99% tình thương của anh và 1% phép thuật kỳ diệu. Tác dụng phụ duy nhất: khiến Thu Trang cảm thấy an tâm và được yêu chiều hết mực.'
    },
    soup: {
      title: 'Bát Cháo Gà Nóng & Trà Gừng',
      dose: 'Liều dùng: Ăn khi còn bốc khói nghi ngút',
      icon: '🍲',
      desc: 'Từng thìa cháo thơm lừng hạt sen, thịt gà xé nhỏ và hành hoa giúp giải cảm siêu nhanh. Nhớ thổi phù phù rồi ăn ngoan từng thìa cho ấm bụng nha em.'
    },
    orange: {
      title: 'Cốc Nước Cam Tươi Vitamin C',
      dose: 'Liều dùng: 1 cốc đầy ngọt mát mỗi ngày',
      icon: '🍊',
      desc: 'Cam sành tươi mọng nước, nhiều vitamin C giúp cổ họng dịu lại, tăng cường đề kháng để đánh bại con vi-rút đáng ghét trong người bé Trang.'
    },
    hug: {
      title: 'Liều Ôm Ấm Áp 24/7 (Unlimited)',
      dose: 'Liều dùng: Bất cứ lúc nào em cần hoặc nhớ anh',
      icon: '🧸',
      desc: 'Vòng tay của anh luôn sẵn sàng ôm chặt lấy em, xoa lưng, xoa đầu, sưởi ấm cho em bé bất kể ngày hay đêm. Không bao giờ hết hạn!'
    },
    sleep: {
      title: 'Chiếc Gối Mây Ru Ngủ Say',
      dose: 'Liều dùng: Đắp chăn ấm và nhắm mắt trước 11h đêm',
      icon: '🌙',
      desc: 'Chúc bé Trang ngủ một giấc thật sâu, không mộng mị, chỉ mơ thấy những điều ngọt ngào. Sáng mai thức dậy cơ thể nhẹ bẫng và khỏe re!'
    },
    voucher: {
      title: 'Vé Chiều Chuộng & Ăn Ngon Khi Khỏe',
      dose: 'Liều dùng: Có giá trị ngay khi Trang khỏi ốm',
      icon: '🎟️',
      desc: 'Được đổi lấy: 1 buổi hẹn hò ăn món Trang thích nhất (buffet, nướng, lẩu, trà sữa full topping) + anh chở đi hóng gió và chiều chuộng không cãi 1 câu!'
    }
  };

  const pillModal = document.getElementById('pill-modal');
  const modalIcon = document.getElementById('modal-icon');
  const modalTitle = document.getElementById('modal-title');
  const modalDose = document.getElementById('modal-dose');
  const modalDesc = document.getElementById('modal-desc');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTakeBtn = document.getElementById('modal-take-btn');

  document.querySelectorAll('.pill-card').forEach(card => {
    card.addEventListener('click', () => {
      playPop(480);
      const pillKey = card.getAttribute('data-pill');
      const data = medicineData[pillKey];
      if (!data) return;

      modalIcon.textContent = data.icon;
      modalTitle.textContent = data.title;
      modalDose.textContent = data.dose;
      modalDesc.textContent = data.desc;

      pillModal.classList.remove('opacity-0', 'pointer-events-none');
      pillModal.querySelector('.modal-card').classList.remove('scale-90');
      pillModal.querySelector('.modal-card').classList.add('scale-100');
    });
  });

  function closeModal() {
    pillModal.classList.add('opacity-0', 'pointer-events-none');
    pillModal.querySelector('.modal-card').classList.remove('scale-100');
    pillModal.querySelector('.modal-card').classList.add('scale-90');
  }

  modalCloseBtn.addEventListener('click', closeModal);
  pillModal.addEventListener('click', (e) => {
    if (e.target === pillModal) closeModal();
  });

  modalTakeBtn.addEventListener('click', (e) => {
    playChime(4);
    closeModal();
    const rect = modalTakeBtn.getBoundingClientRect();
    spawnFloatingReaction(window.innerWidth / 2, window.innerHeight / 2, 'Đã nạp thuốc ngọt ngào! Mau khỏe nha bé 💖');

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff8fab', '#ffc2d1', '#ffe5ec']
      });
    }
  });

  // ==========================================
  // 7. FEATURE 3: DẶN DÒ CHECKLIST
  // ==========================================
  const checkboxes = document.querySelectorAll('.todo-checkbox');
  const checkCounter = document.getElementById('check-counter');
  const checklistReward = document.getElementById('checklist-reward');

  // Load state from localStorage
  const savedChecks = JSON.parse(localStorage.getItem('thu_trang_checklist') || '[]');

  checkboxes.forEach((cb, idx) => {
    if (savedChecks.includes(idx)) {
      cb.checked = true;
    }

    cb.addEventListener('change', () => {
      initAudio();
      if (cb.checked) {
        playChime(idx);
        const rect = cb.closest('label').getBoundingClientRect();
        spawnFloatingReaction(rect.left + 50, rect.top, 'Bé Trang giỏi quá! ⭐');
      } else {
        playPop(300);
      }
      saveAndCountChecklist();
    });
  });

  function saveAndCountChecklist() {
    const checkedIndices = [];
    checkboxes.forEach((cb, idx) => {
      if (cb.checked) checkedIndices.push(idx);
    });

    localStorage.setItem('thu_trang_checklist', JSON.stringify(checkedIndices));
    checkCounter.textContent = `${checkedIndices.length}/6 việc`;

    if (checkedIndices.length === 6) {
      checklistReward.classList.remove('hidden');
      triggerCelebration();
    } else {
      checklistReward.classList.add('hidden');
    }
  }

  saveAndCountChecklist();

  // ==========================================
  // 8. FEATURE 4: HUG CLICKER
  // ==========================================
  let hugCount = parseInt(localStorage.getItem('thu_trang_hug_count') || '0', 10);
  const hugBtn = document.getElementById('hug-btn');
  const hugCountEl = document.getElementById('hug-count');
  const hugMessageEl = document.getElementById('hug-message');
  const hugRipple = document.getElementById('hug-ripple');

  hugCountEl.textContent = hugCount;

  const hugEmojis = ['💖', '💕', '🧸', '🌸', '✨', '🍓', '☁️', '🥰', '💌', '🍯'];
  const hugCheers = [
    'Ôm Trang một cái thật chặt nè! 🤗',
    'Thương cô gái của anh nhiều lắm! ❤️',
    'Thêm 1 nụ hôn má cho em đỡ mệt! 💋',
    'Có anh ở bên, Trang yên tâm nhé! 🌸',
    'Bé Trang là cô gái kiên cường nhất! ✨',
    'Khỏe lại mau để anh dẫn đi chơi! 🧋'
  ];

  hugBtn.addEventListener('click', (e) => {
    initAudio();
    playPop(600 + Math.random() * 200);

    hugCount++;
    hugCountEl.textContent = hugCount;
    localStorage.setItem('thu_trang_hug_count', hugCount.toString());

    // Ripple
    hugRipple.classList.remove('ripple-active');
    void hugRipple.offsetWidth; // trigger reflow
    hugRipple.classList.add('ripple-active');

    // Spawn floating emoji reaction
    const rect = hugBtn.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);

    const emoji = hugEmojis[Math.floor(Math.random() * hugEmojis.length)];
    spawnFloatingReaction(x, y, emoji);

    // Update cheer message
    hugMessageEl.textContent = hugCheers[Math.floor(Math.random() * hugCheers.length)];

    // Milestone confetti
    if (hugCount % 10 === 0) {
      playChime(5);
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { x: x / window.innerWidth, y: y / window.innerHeight },
          colors: ['#ff8fab', '#fb6f92']
        });
      }
    }
  });

  // ==========================================
  // 9. FEATURE 5: LOVE ENVELOPE
  // ==========================================
  const envelopeClosed = document.getElementById('envelope-closed');
  const envelopeLetter = document.getElementById('envelope-letter');
  const closeLetterBtn = document.getElementById('close-letter-btn');

  envelopeClosed.addEventListener('click', () => {
    playChime(2);
    envelopeClosed.classList.add('hidden');
    envelopeLetter.classList.remove('hidden');

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ffb3c6', '#ff8fab', '#fff0f3']
      });
    }
  });

  closeLetterBtn.addEventListener('click', () => {
    playPop(400);
    envelopeLetter.classList.add('hidden');
    envelopeClosed.classList.remove('hidden');
  });

});
