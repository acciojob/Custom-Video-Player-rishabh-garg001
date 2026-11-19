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
  const method = video.paused ? 'play' : 'pause';
  video[method]();
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
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

// Progress bar par click/drag karke video aage-peeche
function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

// Video load fail hone par error message
function handleError() {
  const msg = document.createElement('p');
  msg.textContent = 'Sorry, the video failed to load.';
  msg.style.color = 'white';
  msg.style.fontSize = '16px';
  msg.style.textAlign = 'center';
  player.appendChild(msg);
}

// Event listeners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress); // video chalte waqt progress bar update
video.addEventListener('error', handleError);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => (mousedown = true));
progress.addEventListener('mouseup', () => (mousedown = false));