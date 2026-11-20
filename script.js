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
    if (playPromise !== undefined) {
      playPromise.catch(handleError); // play fail hua to error dikhao
    }
  } else {
    video.pause();
  }
}

// Button icon update
function updateButton() {
  const icon = video.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

// « 10s aur 25s »
function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

// Volume aur playback speed
function handleRangeUpdate() {
  video[this.name] = this.value;
}

// Progress bar: video ke current time ke hisaab se update
function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100 || 0;
  progressBar.style.flexBasis = `${percent}%`;
}

// Progress bar par click/drag karke video aage-peeche
function scrub(e) {
  if (!video.duration || isNaN(video.duration)) return;
  const rect = progress.getBoundingClientRect();
  let ratio = (e.clientX - rect.left) / rect.width;
  ratio = Math.min(Math.max(ratio, 0), 1); // 0 se 1 ke beech
  video.currentTime = ratio * video.duration;
  handleProgress(); // bar turant update
}

// Video load fail hone par error message
function handleError() {
  if (player.querySelector('.player__error')) return; // message do baar na bane
  const msg = document.createElement('p');
  msg.className = 'player__error';
  msg.textContent = 'Sorry, the video failed to load.';
  msg.style.color = 'white';
  msg.style.fontSize = '16px';
  msg.style.textAlign = 'center';
  msg.style.padding = '10px';
  player.appendChild(msg);
  toggle.textContent = '►';
}

// Event listeners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
video.addEventListener('error', handleError);

// Agar script chalne se pehle hi video fail ho chuki ho
if (video.error) {
  handleError();
}

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('input', handleRangeUpdate));

// Scrubbing
let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', (e) => {
  mousedown = true;
  scrub(e);
});
document.addEventListener('mouseup', () => (mousedown = false));
progress.addEventListener('mouseleave', () => (mousedown = false));