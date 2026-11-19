/* Edit this file */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// Play / Pause
function togglePlay() {
  if (video.paused) {
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => showError());
    }
  } else {
    video.pause();
  }
}

// Button icon update
function updateButton() {
  toggle.textContent = video.paused ? '►' : '❚ ❚';
}

// « 10s aur 25s »
function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

// Volume aur playback speed
function handleRangeUpdate() {
  video[this.name] = parseFloat(this.value);
}

// Progress bar update
function handleProgress() {
  const percent = video.duration ? (video.currentTime / video.duration) * 100 : 0;
  progressBar.style.flexBasis = percent + '%';
  progressBar.style.width = percent + '%';
}

// Progress bar par click/drag karke jump
function scrub(e) {
  if (!video.duration) return;
  video.currentTime = (e.offsetX / progress.offsetWidth) * video.duration;
}

// Video load fail hone par error message
function showError() {
  if (player.querySelector('.player__error')) return;
  const msg = document.createElement('p');
  msg.className = 'player__error';
  msg.textContent = 'Sorry, the video failed to load.';
  msg.style.color = 'white';
  msg.style.fontSize = '16px';
  msg.style.textAlign = 'center';
  msg.style.padding = '10px';
  player.appendChild(msg);
}

// Events
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
video.addEventListener('error', showError);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('input', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', e => mousedown && scrub(e));
progress.addEventListener('mousedown', () => (mousedown = true));
progress.addEventListener('mouseup', () => (mousedown = false));

// Shuru mein progress bar 0% par
handleProgress();