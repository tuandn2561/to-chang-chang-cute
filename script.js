// Script for "Gửi Thu Trang Mau Khỏe" - Cute Healing Experience & Gentle Piano Player

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. GENTLE PIANO SYNTHESIZER & MULTI-TRACK PLAYER
  // Single-bus audio engine, Auto-advance, No overlap
  // ==========================================

  let audioCtx = null;
  let musicMasterGain = null;
  let activePianoOscillators = [];
  let isSoundEnabled = true;
  let isPianoPlaying = false;
  let currentTrackIndex = 0;
  let trackTimer = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
        musicMasterGain = audioCtx.createGain();
        musicMasterGain.gain.setValueAtTime(1.0, audioCtx.currentTime);
        musicMasterGain.connect(audioCtx.destination);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Frequency lookup for note names (e.g. 'C4', 'F#5')
  const noteFrequencies = {};
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  for (let octave = 1; octave <= 7; octave++) {
    for (let i = 0; i < 12; i++) {
      const midi = (octave + 1) * 12 + i;
      const freq = 440 * Math.pow(2, (midi - 69) / 12);
      noteFrequencies[`${noteNames[i]}${octave}`] = freq;
      const flats = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };
      if (flats[noteNames[i]]) {
        noteFrequencies[`${flats[noteNames[i]]}${octave}`] = freq;
      }
    }
  }

  // Play an acoustic grand piano note with felt hammer resonance & warmth
  function playPianoNote(noteStr, duration = 2.4, velocity = 0.65, delayTime = 0) {
    const ctx = getAudioContext();
    if (!ctx) return;

    const freq = noteFrequencies[noteStr];
    if (!freq) return;

    const startTime = ctx.currentTime + delayTime;

    try {
      // Primary string oscillator (Triangle for rich acoustic body)
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, startTime);
      osc1.detune.setValueAtTime((Math.random() - 0.5) * 2.5, startTime);

      // Secondary overtone string (Sine for bell-like clarity)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, startTime);
      osc2.detune.setValueAtTime((Math.random() - 0.5) * 3, startTime);

      // Lowpass felt hammer filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const initialCutoff = Math.min(freq * 5.2, 4200);
      filter.frequency.setValueAtTime(initialCutoff, startTime);
      filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.5, 300), startTime + duration);
      filter.Q.setValueAtTime(1.1, startTime);

      // Amplitude Envelope (quick attack, piano natural decay)
      const gainNode = ctx.createGain();
      const peakVol = Math.max(velocity * 0.22, 0.02);
      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.linearRampToValueAtTime(peakVol, startTime + 0.008);
      gainNode.gain.exponentialRampToValueAtTime(peakVol * 0.45, startTime + 0.25);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      // Connections: route through musicMasterGain
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);

      if (musicMasterGain) {
        gainNode.connect(musicMasterGain);
      } else {
        gainNode.connect(ctx.destination);
      }

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration);
      osc2.stop(startTime + duration);

      activePianoOscillators.push(osc1, osc2);
    } catch (e) {
      console.warn(e);
    }
  }

  // Stop all currently playing and queued piano notes completely
  function stopAllPiano() {
    if (trackTimer) {
      clearTimeout(trackTimer);
      trackTimer = null;
    }
    const ctx = getAudioContext();
    if (musicMasterGain && ctx) {
      try {
        musicMasterGain.gain.cancelScheduledValues(ctx.currentTime);
        musicMasterGain.gain.setValueAtTime(0, ctx.currentTime);
        musicMasterGain.gain.setValueAtTime(1.0, ctx.currentTime + 0.04);
      } catch (e) {}
    }
    activePianoOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    activePianoOscillators = [];
  }

  // ==========================================
  // 5 GENTLE PIANO TRACK COMPOSITIONS
  // ==========================================
  const pianoPlaylists = [
    {
      id: 'river-flows',
      title: 'River Flows In You',
      artist: 'Yiruma',
      desc: 'Giai điệu piano ngọt ngào, dịu êm vỗ về',
      tempo: 800,
      notes: [
        // Measure 1 (A)
        { note: 'A2', beat: 0, dur: 3.5, vel: 0.7 },
        { note: 'E3', beat: 0.5, dur: 3.0, vel: 0.5 },
        { note: 'A3', beat: 1.0, dur: 2.8, vel: 0.5 },
        { note: 'C#4', beat: 1.5, dur: 2.5, vel: 0.5 },
        { note: 'G#4', beat: 0, dur: 1.2, vel: 0.75 },
        { note: 'A4', beat: 0.5, dur: 1.2, vel: 0.75 },
        { note: 'G#4', beat: 1.0, dur: 1.2, vel: 0.7 },
        { note: 'A4', beat: 1.5, dur: 1.8, vel: 0.8 },
        { note: 'E4', beat: 2.2, dur: 2.0, vel: 0.65 },

        // Measure 2 (E / G#)
        { note: 'G#2', beat: 3.0, dur: 3.5, vel: 0.7 },
        { note: 'E3', beat: 3.5, dur: 3.0, vel: 0.5 },
        { note: 'G#3', beat: 4.0, dur: 2.8, vel: 0.5 },
        { note: 'B3', beat: 4.5, dur: 2.5, vel: 0.5 },
        { note: 'G#4', beat: 3.0, dur: 1.2, vel: 0.75 },
        { note: 'A4', beat: 3.5, dur: 1.2, vel: 0.75 },
        { note: 'C#5', beat: 4.0, dur: 1.5, vel: 0.85 },
        { note: 'B4', beat: 4.8, dur: 1.4, vel: 0.75 },
        { note: 'A4', beat: 5.4, dur: 1.8, vel: 0.7 },

        // Measure 3 (F#m)
        { note: 'F#2', beat: 6.0, dur: 3.5, vel: 0.7 },
        { note: 'C#3', beat: 6.5, dur: 3.0, vel: 0.5 },
        { note: 'F#3', beat: 7.0, dur: 2.8, vel: 0.5 },
        { note: 'A3', beat: 7.5, dur: 2.5, vel: 0.5 },
        { note: 'C#5', beat: 6.0, dur: 1.4, vel: 0.8 },
        { note: 'D5', beat: 6.6, dur: 1.2, vel: 0.85 },
        { note: 'C#5', beat: 7.2, dur: 1.4, vel: 0.75 },
        { note: 'B4', beat: 7.8, dur: 1.4, vel: 0.7 },
        { note: 'A4', beat: 8.4, dur: 2.0, vel: 0.75 },

        // Measure 4 (D)
        { note: 'D2', beat: 9.0, dur: 3.5, vel: 0.7 },
        { note: 'A2', beat: 9.5, dur: 3.0, vel: 0.5 },
        { note: 'D3', beat: 10.0, dur: 2.8, vel: 0.5 },
        { note: 'F#3', beat: 10.5, dur: 2.5, vel: 0.5 },
        { note: 'F#4', beat: 9.0, dur: 1.4, vel: 0.7 },
        { note: 'G#4', beat: 9.6, dur: 1.2, vel: 0.75 },
        { note: 'A4', beat: 10.2, dur: 1.8, vel: 0.8 },
        { note: 'E4', beat: 11.0, dur: 2.5, vel: 0.7 }
      ]
    },
    {
      id: 'gymnopedie',
      title: 'Gymnopédie No. 1',
      artist: 'Erik Satie',
      desc: 'Bản waltz thanh thản, xoa dịu tâm trí',
      tempo: 950,
      notes: [
        // Bar 1 (Gmaj7)
        { note: 'G2', beat: 0, dur: 3.8, vel: 0.75 },
        { note: 'B3', beat: 0.8, dur: 2.5, vel: 0.45 },
        { note: 'D4', beat: 0.8, dur: 2.5, vel: 0.45 },
        { note: 'F#4', beat: 0.8, dur: 2.5, vel: 0.5 },
        { note: 'B3', beat: 1.8, dur: 2.5, vel: 0.45 },
        { note: 'D4', beat: 1.8, dur: 2.5, vel: 0.45 },
        { note: 'F#4', beat: 1.8, dur: 2.5, vel: 0.5 },

        // Bar 2 (Dmaj7)
        { note: 'D2', beat: 2.8, dur: 3.8, vel: 0.75 },
        { note: 'F#3', beat: 3.6, dur: 2.5, vel: 0.45 },
        { note: 'A3', beat: 3.6, dur: 2.5, vel: 0.45 },
        { note: 'C#4', beat: 3.6, dur: 2.5, vel: 0.5 },
        { note: 'F#3', beat: 4.6, dur: 2.5, vel: 0.45 },
        { note: 'A3', beat: 4.6, dur: 2.5, vel: 0.45 },
        { note: 'C#4', beat: 4.6, dur: 2.5, vel: 0.5 },
        { note: 'F#5', beat: 3.6, dur: 3.5, vel: 0.8 },

        // Bar 3 (Gmaj7)
        { note: 'G2', beat: 5.6, dur: 3.8, vel: 0.75 },
        { note: 'B3', beat: 6.4, dur: 2.5, vel: 0.45 },
        { note: 'D4', beat: 6.4, dur: 2.5, vel: 0.45 },
        { note: 'F#4', beat: 6.4, dur: 2.5, vel: 0.5 },
        { note: 'B3', beat: 7.4, dur: 2.5, vel: 0.45 },
        { note: 'D4', beat: 7.4, dur: 2.5, vel: 0.45 },
        { note: 'F#4', beat: 7.4, dur: 2.5, vel: 0.5 },
        { note: 'E5', beat: 6.4, dur: 2.8, vel: 0.75 },

        // Bar 4 (Dmaj7)
        { note: 'D2', beat: 8.4, dur: 3.8, vel: 0.75 },
        { note: 'F#3', beat: 9.2, dur: 2.5, vel: 0.45 },
        { note: 'A3', beat: 9.2, dur: 2.5, vel: 0.45 },
        { note: 'C#4', beat: 9.2, dur: 2.5, vel: 0.5 },
        { note: 'D5', beat: 9.2, dur: 3.2, vel: 0.8 },
        { note: 'C#5', beat: 10.4, dur: 2.2, vel: 0.75 }
      ]
    },
    {
      id: 'canon-in-d',
      title: 'Canon in D (Piano Solo)',
      artist: 'Johann Pachelbel',
      desc: 'Khúc nhạc hồi sinh sức khỏe, an yên ấm áp',
      tempo: 750,
      notes: [
        // D
        { note: 'D3', beat: 0, dur: 3.0, vel: 0.7 },
        { note: 'A3', beat: 0.4, dur: 2.5, vel: 0.5 },
        { note: 'F#4', beat: 0.8, dur: 2.2, vel: 0.55 },
        { note: 'F#5', beat: 0, dur: 1.4, vel: 0.8 },
        { note: 'E5', beat: 0.8, dur: 1.4, vel: 0.75 },

        // A
        { note: 'A2', beat: 1.6, dur: 3.0, vel: 0.7 },
        { note: 'E3', beat: 2.0, dur: 2.5, vel: 0.5 },
        { note: 'C#4', beat: 2.4, dur: 2.2, vel: 0.55 },
        { note: 'D5', beat: 1.6, dur: 1.4, vel: 0.8 },
        { note: 'C#5', beat: 2.4, dur: 1.4, vel: 0.75 },

        // Bm
        { note: 'B2', beat: 3.2, dur: 3.0, vel: 0.7 },
        { note: 'F#3', beat: 3.6, dur: 2.5, vel: 0.5 },
        { note: 'D4', beat: 4.0, dur: 2.2, vel: 0.55 },
        { note: 'B4', beat: 3.2, dur: 1.4, vel: 0.8 },
        { note: 'A4', beat: 4.0, dur: 1.4, vel: 0.75 },

        // F#m
        { note: 'F#2', beat: 4.8, dur: 3.0, vel: 0.7 },
        { note: 'C#3', beat: 5.2, dur: 2.5, vel: 0.5 },
        { note: 'A3', beat: 5.6, dur: 2.2, vel: 0.55 },
        { note: 'G4', beat: 4.8, dur: 1.4, vel: 0.75 },
        { note: 'F#4', beat: 5.6, dur: 1.4, vel: 0.7 },

        // G
        { note: 'G2', beat: 6.4, dur: 3.0, vel: 0.7 },
        { note: 'D3', beat: 6.8, dur: 2.5, vel: 0.5 },
        { note: 'B3', beat: 7.2, dur: 2.2, vel: 0.55 },
        { note: 'E4', beat: 6.4, dur: 1.4, vel: 0.75 },
        { note: 'D4', beat: 7.2, dur: 1.4, vel: 0.7 },

        // A
        { note: 'A2', beat: 8.0, dur: 3.0, vel: 0.7 },
        { note: 'E3', beat: 8.4, dur: 2.5, vel: 0.5 },
        { note: 'C#4', beat: 8.8, dur: 2.2, vel: 0.55 },
        { note: 'C#5', beat: 8.0, dur: 1.6, vel: 0.8 },
        { note: 'D5', beat: 8.8, dur: 2.2, vel: 0.85 }
      ]
    },
    {
      id: 'kiss-the-rain',
      title: 'Kiss The Rain',
      artist: 'Yiruma',
      desc: 'Từng giọt mưa rơi êm đềm như lời vỗ về',
      tempo: 820,
      notes: [
        // Bar 1 (C)
        { note: 'C3', beat: 0, dur: 3.5, vel: 0.7 },
        { note: 'G3', beat: 0.5, dur: 2.8, vel: 0.5 },
        { note: 'E4', beat: 1.0, dur: 2.5, vel: 0.55 },
        { note: 'E5', beat: 0, dur: 1.5, vel: 0.8 },
        { note: 'D5', beat: 0.8, dur: 1.2, vel: 0.75 },
        { note: 'C5', beat: 1.4, dur: 1.6, vel: 0.75 },

        // Bar 2 (Am)
        { note: 'A2', beat: 2.4, dur: 3.5, vel: 0.7 },
        { note: 'E3', beat: 2.9, dur: 2.8, vel: 0.5 },
        { note: 'C4', beat: 3.4, dur: 2.5, vel: 0.55 },
        { note: 'C5', beat: 2.4, dur: 1.5, vel: 0.8 },
        { note: 'B4', beat: 3.2, dur: 1.2, vel: 0.75 },
        { note: 'A4', beat: 3.8, dur: 1.6, vel: 0.75 },

        // Bar 3 (F)
        { note: 'F2', beat: 4.8, dur: 3.5, vel: 0.7 },
        { note: 'C3', beat: 5.3, dur: 2.8, vel: 0.5 },
        { note: 'A3', beat: 5.8, dur: 2.5, vel: 0.55 },
        { note: 'A4', beat: 4.8, dur: 1.4, vel: 0.75 },
        { note: 'G4', beat: 5.5, dur: 1.2, vel: 0.7 },
        { note: 'F4', beat: 6.1, dur: 1.6, vel: 0.75 },

        // Bar 4 (G)
        { note: 'G2', beat: 7.2, dur: 3.5, vel: 0.7 },
        { note: 'D3', beat: 7.7, dur: 2.8, vel: 0.5 },
        { note: 'B3', beat: 8.2, dur: 2.5, vel: 0.55 },
        { note: 'G4', beat: 7.2, dur: 1.5, vel: 0.75 },
        { note: 'A4', beat: 8.0, dur: 1.5, vel: 0.8 },
        { note: 'B4', beat: 8.8, dur: 2.0, vel: 0.85 }
      ]
    },
    {
      id: 'lullaby-trang',
      title: 'Khúc Hát Ru Bé Thu Trang',
      artist: 'Dành Riêng Cho Em',
      desc: 'Giấc ngủ ngon lành, sáng mai tỉnh dậy khỏe re',
      tempo: 900,
      notes: [
        // Cmaj7
        { note: 'C3', beat: 0, dur: 4.0, vel: 0.7 },
        { note: 'G3', beat: 0.6, dur: 3.0, vel: 0.5 },
        { note: 'B3', beat: 1.2, dur: 2.8, vel: 0.5 },
        { note: 'E4', beat: 1.8, dur: 2.5, vel: 0.55 },
        { note: 'G4', beat: 0, dur: 2.0, vel: 0.75 },
        { note: 'E5', beat: 1.2, dur: 2.2, vel: 0.8 },

        // Am7
        { note: 'A2', beat: 2.8, dur: 4.0, vel: 0.7 },
        { note: 'E3', beat: 3.4, dur: 3.0, vel: 0.5 },
        { note: 'G3', beat: 4.0, dur: 2.8, vel: 0.5 },
        { note: 'C4', beat: 4.6, dur: 2.5, vel: 0.55 },
        { note: 'C5', beat: 2.8, dur: 1.8, vel: 0.75 },
        { note: 'B4', beat: 3.8, dur: 1.8, vel: 0.75 },
        { note: 'A4', beat: 4.6, dur: 2.2, vel: 0.7 },

        // Fmaj7
        { note: 'F2', beat: 5.6, dur: 4.0, vel: 0.7 },
        { note: 'C3', beat: 6.2, dur: 3.0, vel: 0.5 },
        { note: 'E3', beat: 6.8, dur: 2.8, vel: 0.5 },
        { note: 'A3', beat: 7.4, dur: 2.5, vel: 0.55 },
        { note: 'A4', beat: 5.6, dur: 1.8, vel: 0.75 },
        { note: 'C5', beat: 6.6, dur: 2.0, vel: 0.8 },

        // G7sus4 -> G
        { note: 'G2', beat: 8.4, dur: 4.0, vel: 0.7 },
        { note: 'D3', beat: 9.0, dur: 3.0, vel: 0.5 },
        { note: 'F3', beat: 9.6, dur: 2.8, vel: 0.5 },
        { note: 'B3', beat: 10.2, dur: 2.5, vel: 0.55 },
        { note: 'D5', beat: 8.4, dur: 2.0, vel: 0.8 },
        { note: 'C5', beat: 9.6, dur: 2.6, vel: 0.85 }
      ]
    }
  ];

  // Schedule notes for a track, and auto-advance to next song when finished
  function scheduleTrack(track) {
    if (!isPianoPlaying) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const tempoSec = track.tempo / 1000;

    track.notes.forEach(item => {
      const delay = item.beat * tempoSec;
      playPianoNote(item.note, item.dur, item.vel, delay);
    });

    // Determine loop length
    let maxBeat = 0;
    track.notes.forEach(n => {
      if (n.beat + n.dur > maxBeat) maxBeat = n.beat + n.dur;
    });

    const totalDurationMs = (maxBeat * tempoSec + 1.2) * 1000;

    // Auto-advance to the next track when finished!
    trackTimer = setTimeout(() => {
      if (isPianoPlaying) {
        stopAllPiano();
        currentTrackIndex = (currentTrackIndex + 1) % pianoPlaylists.length;
        playCurrentTrack();
      }
    }, totalDurationMs);
  }

  // ==========================================
  // PIANO PLAYER CONTROLS & STATE
  // ==========================================
  const vinylDisc = document.getElementById('vinyl-disc');
  const playerTrackName = document.getElementById('player-track-name');
  const playerStatusText = document.getElementById('player-status-text');
  const eqContainer = document.getElementById('eq-container');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playPauseIcon = document.getElementById('play-pause-icon');
  const prevTrackBtn = document.getElementById('prev-track-btn');
  const nextTrackBtn = document.getElementById('next-track-btn');
  const autoplayBanner = document.getElementById('autoplay-banner');
  const playlistBtn = document.getElementById('playlist-btn');
  const playlistModal = document.getElementById('playlist-modal');
  const closePlaylistBtn = document.getElementById('close-playlist-btn');
  const playlistItemsContainer = document.getElementById('playlist-items-container');
  const nightModeToggle = document.getElementById('night-mode-toggle');
  const nightIcon = document.getElementById('night-icon');

  function updatePlayerUI() {
    const track = pianoPlaylists[currentTrackIndex];
    if (playerTrackName) playerTrackName.textContent = `${track.title} - ${track.artist}`;

    if (isPianoPlaying) {
      if (playPauseIcon) playPauseIcon.textContent = '⏸️';
      if (vinylDisc) vinylDisc.classList.add('animate-spin-slow');
      if (eqContainer) eqContainer.classList.remove('opacity-30');
      if (playerStatusText) playerStatusText.textContent = 'Tự động chuyển bài khi hết...';
    } else {
      if (playPauseIcon) playPauseIcon.textContent = '▶️';
      if (vinylDisc) vinylDisc.classList.remove('animate-spin-slow');
      if (eqContainer) eqContainer.classList.add('opacity-30');
      if (playerStatusText) playerStatusText.textContent = 'Tạm dừng (Bấm để nghe tiếp)';
    }

    renderPlaylistItems();
  }

  // Play a track with clean stop of any previous notes
  function playCurrentTrack() {
    stopAllPiano();
    isPianoPlaying = true;
    updatePlayerUI();
    scheduleTrack(pianoPlaylists[currentTrackIndex]);

    // Hide autoplay banner once playing
    if (autoplayBanner) {
      autoplayBanner.style.opacity = '0';
      setTimeout(() => {
        autoplayBanner.style.display = 'none';
      }, 500);
    }
  }

  function startPiano() {
    const ctx = getAudioContext();
    if (isPianoPlaying) {
      if (ctx && ctx.state === 'suspended') ctx.resume();
      return;
    }
    playCurrentTrack();
  }

  function pausePiano() {
    isPianoPlaying = false;
    stopAllPiano();
    updatePlayerUI();
  }

  function togglePiano() {
    if (isPianoPlaying) {
      pausePiano();
    } else {
      startPiano();
    }
  }

  function changeTrack(direction) {
    stopAllPiano();
    currentTrackIndex = (currentTrackIndex + direction + pianoPlaylists.length) % pianoPlaylists.length;
    playCurrentTrack();
  }

  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePiano);
  if (prevTrackBtn) prevTrackBtn.addEventListener('click', () => changeTrack(-1));
  if (nextTrackBtn) nextTrackBtn.addEventListener('click', () => changeTrack(1));

  // Night Mode Toggle
  if (nightModeToggle) {
    nightModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('night-mode');
      const isNight = document.body.classList.contains('night-mode');
      if (nightIcon) nightIcon.textContent = isNight ? '☀️' : '🌙';
      playPop(480);
    });
  }

  // ==========================================
  // PLAYLIST MODAL
  // ==========================================
  function renderPlaylistItems() {
    if (!playlistItemsContainer) return;
    playlistItemsContainer.innerHTML = '';

    pianoPlaylists.forEach((track, idx) => {
      const isCurrent = idx === currentTrackIndex;
      const item = document.createElement('button');
      item.className = `w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
        isCurrent
          ? 'bg-pink-100/80 border-pink-300 text-pink-700 shadow-sm'
          : 'bg-gray-50 hover:bg-pink-50 border-gray-100 text-gray-700'
      }`;
      item.innerHTML = `
        <div class="min-w-0 flex-1">
          <div class="font-cute font-bold text-sm truncate flex items-center gap-1.5">
            <span>${isCurrent ? '🎶' : '🎹'}</span>
            <span>${track.title}</span>
          </div>
          <p class="text-[11px] text-gray-500 truncate mt-0.5">${track.desc}</p>
        </div>
        <span class="text-xs font-cute font-semibold ${isCurrent ? 'text-pink-600' : 'text-gray-400'}">
          ${isCurrent ? (isPianoPlaying ? 'Đang phát' : 'Đã chọn') : 'Chọn'}
        </span>
      `;
      item.addEventListener('click', () => {
        currentTrackIndex = idx;
        closePlaylist();
        playCurrentTrack();
      });
      playlistItemsContainer.appendChild(item);
    });
  }

  function openPlaylist() {
    renderPlaylistItems();
    if (playlistModal) {
      playlistModal.classList.remove('opacity-0', 'pointer-events-none');
      playlistModal.querySelector('.modal-card').classList.remove('scale-90');
      playlistModal.querySelector('.modal-card').classList.add('scale-100');
    }
  }

  function closePlaylist() {
    if (playlistModal) {
      playlistModal.classList.add('opacity-0', 'pointer-events-none');
      playlistModal.querySelector('.modal-card').classList.remove('scale-100');
      playlistModal.querySelector('.modal-card').classList.add('scale-90');
    }
  }

  if (playlistBtn) playlistBtn.addEventListener('click', openPlaylist);
  if (closePlaylistBtn) closePlaylistBtn.addEventListener('click', closePlaylist);
  if (playlistModal) {
    playlistModal.addEventListener('click', (e) => {
      if (e.target === playlistModal) closePlaylist();
    });
  }

  const trackInfoBtn = document.getElementById('track-info-btn');
  if (trackInfoBtn) trackInfoBtn.addEventListener('click', openPlaylist);

  // ==========================================
  // AUTOPLAY ON PAGE LOAD & GESTURE UNLOCK
  // Seamless, single-instance audio starter
  // ==========================================
  function tryAutoplay() {
    if (isPianoPlaying) return;
    getAudioContext();
    startPiano();

    // Check if browser blocked it
    if (audioCtx && audioCtx.state === 'suspended') {
      if (autoplayBanner) {
        autoplayBanner.style.display = 'block';
        autoplayBanner.style.opacity = '1';
      }
    }
  }

  // Attempt autoplay once on load
  tryAutoplay();

  // Unlock and play on FIRST user interaction anywhere on the screen
  const unlockEvents = ['click', 'touchstart', 'touchend', 'scroll', 'pointerdown', 'keydown'];
  function unlockAudioOnFirstGesture() {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    if (!isPianoPlaying) {
      startPiano();
    }
    unlockEvents.forEach(evt => window.removeEventListener(evt, unlockAudioOnFirstGesture));
  }
  unlockEvents.forEach(evt => window.addEventListener(evt, unlockAudioOnFirstGesture, { passive: true }));

  if (autoplayBanner) {
    autoplayBanner.addEventListener('click', () => {
      startPiano();
    });
  }

  // ==========================================
  // SFX: POP & CHIME SOUNDS
  // ==========================================
  function playPop(frequency = 440) {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn(e);
    }
  }

  function playChime(noteIndex = 0) {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
      const freq = scale[noteIndex % scale.length];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn(e);
    }
  }

  const soundToggleBtn = document.getElementById('sound-toggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      const soundIcon = document.getElementById('sound-icon');
      if (soundIcon) soundIcon.textContent = isSoundEnabled ? '🔊' : '🔇';
      soundToggleBtn.classList.toggle('opacity-50', !isSoundEnabled);
      if (isSoundEnabled) playPop(520);
    });
  }

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

    const driftX = (Math.random() - 0.5) * 80;
    el.style.setProperty('--drift-x', `${driftX}px`);

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    document.body.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 1400);
  }

  let lastSparkleTime = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkleTime < 80) return;
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

      if (mascotSvg) {
        mascotSvg.style.transform = 'scale(1.15) rotate(-5deg)';
        setTimeout(() => {
          mascotSvg.style.transform = '';
        }, 300);
      }

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
    if (energyBar) energyBar.style.width = `${energy}%`;
    if (energyPercentage) energyPercentage.textContent = `${energy}%`;

    if (energyStatusText) {
      if (energy < 50) {
        energyStatusText.textContent = '"Đang truyền năng lượng ấm áp từ xa cho bé Trang..."';
      } else if (energy < 80) {
        energyStatusText.textContent = '"Sức khỏe đang hồi phục rất tốt nè, sắc mặt hồng hào hơn rồi!" 🌸';
      } else if (energy < 100) {
        energyStatusText.textContent = '"Sắp đầy 100% rồi! Sắp thành cô bé khỏe re tung tăng rồi nha!" ✨';
      } else {
        energyStatusText.textContent = '🎉 100% SỨC KHỎE & TÌNH YÊU! Bé Thu Trang đã sẵn sàng khỏe khoắn rực rỡ!';
      }
    }

    localStorage.setItem('thu_trang_energy', energy.toString());
  }

  updateEnergyUI();

  if (chargeBtn) {
    chargeBtn.addEventListener('click', () => {
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
          triggerCelebration();
        }
      } else {
        triggerHeartShower();
      }
    });
  }

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

      if (modalIcon) modalIcon.textContent = data.icon;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalDose) modalDose.textContent = data.dose;
      if (modalDesc) modalDesc.textContent = data.desc;

      if (pillModal) {
        pillModal.classList.remove('opacity-0', 'pointer-events-none');
        pillModal.querySelector('.modal-card').classList.remove('scale-90');
        pillModal.querySelector('.modal-card').classList.add('scale-100');
      }
    });
  });

  function closeModal() {
    if (pillModal) {
      pillModal.classList.add('opacity-0', 'pointer-events-none');
      pillModal.querySelector('.modal-card').classList.remove('scale-100');
      pillModal.querySelector('.modal-card').classList.add('scale-90');
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (pillModal) {
    pillModal.addEventListener('click', (e) => {
      if (e.target === pillModal) closeModal();
    });
  }

  if (modalTakeBtn) {
    modalTakeBtn.addEventListener('click', () => {
      playChime(4);
      closeModal();
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
  }

  // ==========================================
  // 7. FEATURE 3: DẶN DÒ CHECKLIST
  // ==========================================
  const checkboxes = document.querySelectorAll('.todo-checkbox');
  const checkCounter = document.getElementById('check-counter');
  const checklistReward = document.getElementById('checklist-reward');

  const savedChecks = JSON.parse(localStorage.getItem('thu_trang_checklist') || '[]');

  checkboxes.forEach((cb, idx) => {
    if (savedChecks.includes(idx)) {
      cb.checked = true;
    }

    cb.addEventListener('change', () => {
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
    if (checkCounter) checkCounter.textContent = `${checkedIndices.length}/6 việc`;

    if (checkedIndices.length === 6) {
      if (checklistReward) checklistReward.classList.remove('hidden');
      triggerCelebration();
    } else {
      if (checklistReward) checklistReward.classList.add('hidden');
    }
  }

  saveAndCountChecklist();

  // ==========================================
  // 8. MOOD CHECK & QUICK MESSAGE COPY
  // ==========================================
  const moodResponses = {
    sick: {
      reply: 'Thương em quá! Giờ Trang nằm ngoan nghỉ ngơi, trùm chăn ấm và nhắm mắt lại đi nhé. Mọi chuyện cứ để anh lo hết! 💕',
      msg: 'Anh ơi, em vẫn còn hơi mệt một chút... Anh dỗ dành em đi! 🥺'
    },
    throat: {
      reply: 'Họng rát khó chịu lắm đúng không? Bé Trang uống một ngụm nước ấm nhỏ xíu xiu, giữ ấm cổ họng đừng để gió lùa nha! 🍵',
      msg: 'Anh ơi, cổ họng em còn hơi rát, em đang uống nước ấm như anh dặn rồi nè! 🍵'
    },
    better: {
      reply: 'Hoan hô! Em bé của anh giỏi quá đi thôi! Đỡ mệt rồi nhưng vẫn phải nghỉ ngơi đầy đủ, không được chủ quan đâu đấy! 🌸',
      msg: 'Anh ơi, em thấy người nhẹ nhõm và đỡ mệt nhiều rồi nè! Yêu anh nhiều lắm! 🥰'
    },
    happy: {
      reply: 'Tuyệt vời ông mặt trời! Bé Trang đã hồi phục thần kỳ! Chuẩn bị tinh thần lên đồ anh dẫn đi ăn món em thích nhất nha! 🥳✨',
      msg: 'Anh ơi, em khỏe khoắn tung tăng trở lại rồi! Khi nào anh dẫn em đi ăn đây ta? 🧋🎉'
    }
  };

  const moodBox = document.getElementById('mood-response-box');
  const moodText = document.getElementById('mood-response-text');
  const copyMsgBtn = document.getElementById('copy-msg-btn');
  let currentCopyMsg = '';

  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playPop(550);
      const mood = btn.getAttribute('data-mood');
      const data = moodResponses[mood];
      if (!data) return;

      currentCopyMsg = data.msg;
      if (moodText) moodText.textContent = data.reply;
      if (moodBox) moodBox.classList.remove('hidden');

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 20,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#ff8fab', '#fb6f92']
        });
      }
    });
  });

  if (copyMsgBtn) {
    copyMsgBtn.addEventListener('click', () => {
      playChime(3);
      if (navigator.clipboard && currentCopyMsg) {
        navigator.clipboard.writeText(currentCopyMsg).then(() => {
          copyMsgBtn.innerHTML = '<span>✅ Đã sao chép! Dán vào Zalo/Messenger nha</span>';
          setTimeout(() => {
            copyMsgBtn.innerHTML = '<span>📋 Sao chép tin nhắn báo cho anh</span>';
          }, 2500);
        });
      }
    });
  }

  // ==========================================
  // 9. VÒNG QUAY MÓN NGON BỒI BỔ
  // ==========================================
  const recoveryFoods = [
    {
      icon: '🍲',
      name: 'Cháo Gà Hạt Sen Nóng Hổi',
      desc: '"Thơm lừng, giải cảm siêu tốc, ăn từng thìa nhỏ ấm bụng nha bé Trang!"'
    },
    {
      icon: '🥣',
      name: 'Súp Bắp Non Thịt Cua',
      desc: '"Nhiều dinh dưỡng, sánh mịn dễ nuốt, trôi đến đâu êm họng đến đấy!"'
    },
    {
      icon: '🍊',
      name: 'Cốc Nước Cam Mật Ong Ấm',
      desc: '"Bổ sung vitamin C tức thì, ngọt dịu cổ họng xua tan mệt mỏi!"'
    },
    {
      icon: '🍜',
      name: 'Bát Phở Bò Tái Lăn Nghi Ngút',
      desc: '"Nước dùng thanh ngọt, ăn toát một chút mồ hôi là người nhẹ bẫng!"'
    },
    {
      icon: '🥛',
      name: 'Sữa Hạnh Nhân Ấm Ngọt Lịm',
      desc: '"Uống một ngụm trước khi ngủ, ru em vào giấc mơ toàn kẹo ngọt!"'
    },
    {
      icon: '🍎',
      name: 'Đĩa Táo & Lê Cắt Lựu Mát Lành',
      desc: '"Mọng nước, giòn ngọt tự nhiên, vừa ăn vừa xem phim thư giãn nha em!"'
    }
  ];

  let foodIndex = 0;
  const foodIcon = document.getElementById('food-icon');
  const foodName = document.getElementById('food-name');
  const foodDesc = document.getElementById('food-desc');
  const spinFoodBtn = document.getElementById('spin-food-btn');

  if (spinFoodBtn) {
    spinFoodBtn.addEventListener('click', () => {
      playPop(600);
      foodIndex = (foodIndex + 1) % recoveryFoods.length;
      const nextFood = recoveryFoods[foodIndex];

      if (foodIcon) {
        foodIcon.style.transform = 'scale(0.5) rotate(180deg)';
        setTimeout(() => {
          foodIcon.textContent = nextFood.icon;
          foodIcon.style.transform = 'scale(1) rotate(0deg)';
        }, 150);
      }

      if (foodName) foodName.textContent = nextFood.name;
      if (foodDesc) foodDesc.textContent = nextFood.desc;

      spawnFloatingReaction(window.innerWidth / 2, spinFoodBtn.getBoundingClientRect().top, 'Món ngon cho em nè! 🍲');
    });
  }

  // ==========================================
  // 10. FEATURE 4: HUG CLICKER
  // ==========================================
  let hugCount = parseInt(localStorage.getItem('thu_trang_hug_count') || '0', 10);
  const hugBtn = document.getElementById('hug-btn');
  const hugCountEl = document.getElementById('hug-count');
  const hugMessageEl = document.getElementById('hug-message');
  const hugRipple = document.getElementById('hug-ripple');

  if (hugCountEl) hugCountEl.textContent = hugCount;

  const hugEmojis = ['💖', '💕', '🧸', '🌸', '✨', '🍓', '☁️', '🥰', '💌', '🍯'];
  const hugCheers = [
    'Ôm Trang một cái thật chặt nè! 🤗',
    'Thương cô gái của anh nhiều lắm! ❤️',
    'Thêm 1 nụ hôn má cho em đỡ mệt! 💋',
    'Có anh ở bên, Trang yên tâm nhé! 🌸',
    'Bé Trang là cô gái kiên cường nhất! ✨',
    'Khỏe lại mau để anh dẫn đi chơi! 🧋'
  ];

  if (hugBtn) {
    hugBtn.addEventListener('click', (e) => {
      playPop(600 + Math.random() * 200);

      hugCount++;
      if (hugCountEl) hugCountEl.textContent = hugCount;
      localStorage.setItem('thu_trang_hug_count', hugCount.toString());

      if (hugRipple) {
        hugRipple.classList.remove('ripple-active');
        void hugRipple.offsetWidth;
        hugRipple.classList.add('ripple-active');
      }

      const rect = hugBtn.getBoundingClientRect();
      const x = e.clientX || (rect.left + rect.width / 2);
      const y = e.clientY || (rect.top + rect.height / 2);

      const emoji = hugEmojis[Math.floor(Math.random() * hugEmojis.length)];
      spawnFloatingReaction(x, y, emoji);

      if (hugMessageEl) {
        hugMessageEl.textContent = hugCheers[Math.floor(Math.random() * hugCheers.length)];
      }

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
  }

  // ==========================================
  // 11. FEATURE 5: LOVE ENVELOPE
  // ==========================================
  const envelopeClosed = document.getElementById('envelope-closed');
  const envelopeLetter = document.getElementById('envelope-letter');
  const closeLetterBtn = document.getElementById('close-letter-btn');

  if (envelopeClosed) {
    envelopeClosed.addEventListener('click', () => {
      playChime(2);
      envelopeClosed.classList.add('hidden');
      if (envelopeLetter) envelopeLetter.classList.remove('hidden');

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 35,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#ffb3c6', '#ff8fab', '#fff0f3']
        });
      }
    });
  }

  if (closeLetterBtn) {
    closeLetterBtn.addEventListener('click', () => {
      playPop(400);
      if (envelopeLetter) envelopeLetter.classList.add('hidden');
      if (envelopeClosed) envelopeClosed.classList.remove('hidden');
    });
  }

  // ==========================================
  // 12. DOCTOR TOM & PATIENT JERRY CHASE CONTROLLER
  // ==========================================
  const chaseActors = document.getElementById('chase-actors');
  const jerryWrapper = document.getElementById('jerry-wrapper');
  const tomWrapper = document.getElementById('tom-wrapper');
  const jerrySpeech = document.getElementById('jerry-speech');
  const tomSpeech = document.getElementById('tom-speech');

  if (chaseActors && jerryWrapper && tomWrapper) {
    let chaseX = -180;
    let direction = 1; // 1: moving right, -1: moving left
    const baseSpeed = 2.4;
    let speed = baseSpeed;
    let isBoosting = false;

    const jerryLines = [
      'Sợ tiêm lắm! 🐭💨',
      'Không uống thuốc đắng đâuuu!',
      'Trang ơi cứu Jerry với! 🧀',
      'Chạy trốn bác sĩ Tom thôiii!',
      'Jerry muốn ăn phô mai cơ! 🧀',
      'Bác sĩ Tom tha cho em đi! 🥺'
    ];

    const tomLines = [
      'Đứng lại uống thuốc ngoan nào Jerry! 🐱💉',
      'Chỉ một thìa siro dâu ngọt thôi mà! 🍓',
      'Uống thuốc mới mau khỏi như bé Trang chứ! 🩺',
      'Bác sĩ chỉ đo nhiệt độ thôi! 🌡️',
      'Ngoan ngoãn nằm nghỉ ngơi đi Jerry! 🏃‍♂️',
      'Đừng chạy nữa, anh mệt lắm rồi! 😹'
    ];

    // Animation frame movement
    function stepChase() {
      chaseX += speed * direction;
      const screenWidth = window.innerWidth;

      // Reached right edge -> turn left
      if (direction === 1 && chaseX > screenWidth + 80) {
        direction = -1;
        chaseX = screenWidth + 70;
        chaseActors.classList.add('flip-left');
      }
      // Reached left edge -> turn right
      else if (direction === -1 && chaseX < -220) {
        direction = 1;
        chaseX = -200;
        chaseActors.classList.remove('flip-left');
      }

      chaseActors.style.transform = `translateX(${chaseX}px) scaleX(${direction})`;
      requestAnimationFrame(stepChase);
    }
    requestAnimationFrame(stepChase);

    // Periodic comic speech bubble triggers
    let speechTimer = 0;
    setInterval(() => {
      speechTimer++;
      if (speechTimer % 2 === 1) {
        const line = jerryLines[Math.floor(Math.random() * jerryLines.length)];
        if (jerrySpeech) {
          jerrySpeech.textContent = line;
          jerrySpeech.classList.remove('opacity-0');
          setTimeout(() => {
            jerrySpeech.classList.add('opacity-0');
          }, 2600);
        }
      } else {
        const line = tomLines[Math.floor(Math.random() * tomLines.length)];
        if (tomSpeech) {
          tomSpeech.textContent = line;
          tomSpeech.classList.remove('opacity-0');
          setTimeout(() => {
            tomSpeech.classList.add('opacity-0');
          }, 2600);
        }
      }
    }, 4200);

    // Clicking Jerry: Jerry does a 360 flip, pops hearts, and speeds up!
    jerryWrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      playPop(750);

      jerryWrapper.style.transform = 'translateY(-22px) rotate(360deg)';
      jerryWrapper.style.transition = 'transform 0.45s ease-out';
      setTimeout(() => {
        jerryWrapper.style.transform = '';
        jerryWrapper.style.transition = '';
      }, 450);

      const rect = jerryWrapper.getBoundingClientRect();
      spawnFloatingReaction(rect.left + 20, rect.top - 10, '🧀 +100 Tốc độ!');

      if (jerrySpeech) {
        jerrySpeech.textContent = 'Á á chạy nhanh hơn nữa nè! 🏃‍♂️💨';
        jerrySpeech.classList.remove('opacity-0');
        setTimeout(() => jerrySpeech.classList.add('opacity-0'), 2000);
      }

      if (!isBoosting) {
        isBoosting = true;
        speed = baseSpeed * 2.2;
        setTimeout(() => {
          speed = baseSpeed;
          isBoosting = false;
        }, 1800);
      }
    });

    // Clicking Tom: Tom stumbles, squirts pink strawberry droplets from syringe!
    tomWrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      playChime(4);

      tomWrapper.style.transform = 'scale(0.85) rotate(-15deg)';
      tomWrapper.style.transition = 'transform 0.25s';
      setTimeout(() => {
        tomWrapper.style.transform = '';
        tomWrapper.style.transition = '';
      }, 350);

      const rect = tomWrapper.getBoundingClientRect();
      spawnFloatingReaction(rect.left + 30, rect.top - 15, '🐱 Chờ bác sĩ với Jerry!');

      if (tomSpeech) {
        tomSpeech.textContent = 'Jerry đứng lại cho bác sĩ! 😹💉';
        tomSpeech.classList.remove('opacity-0');
        setTimeout(() => tomSpeech.classList.add('opacity-0'), 2000);
      }

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 18,
          spread: 60,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight
          },
          colors: ['#ff4d6d', '#ff8fab', '#ffffff']
        });
      }
    });
  }

});
