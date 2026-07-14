// Profile avatar morph effect (portfolio/index.html only, SPEC.md 5.1.1).
// State machine, not a plain hover: once a video starts it always plays
// to completion, even if the mouse leaves before it ends. All three
// layers (photo, geometric image, video) are stacked and crossfaded via
// opacity, never swapped in the document flow, so there is no flicker.
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.profile-morph');
  if (!container) return;

  const photoImg = container.querySelector('.profile-static--photo');
  const geometricImg = container.querySelector('.profile-static--geometric');
  const video = container.querySelector('.profile-video');

  const FORWARD_SRC = 'vid/javier-carranza/profile-forward.mp4';
  const REVERSE_SRC = 'vid/javier-carranza/profile-reverse.mp4';

  let state = 'photo'; // 'photo' | 'geometric'
  let playState = 'idle'; // 'idle' | 'playing'

  function showLayer(target) {
    [photoImg, geometricImg, video].forEach((el) => {
      el.classList.toggle('is-visible', el === target);
    });
  }

  function startVideo() {
    video.currentTime = 0;
    video.play().catch(() => {});
    showLayer(video);
  }

  container.addEventListener('mouseenter', () => {
    if (playState !== 'idle') return;
    playState = 'playing';
    video.src = state === 'photo' ? FORWARD_SRC : REVERSE_SRC;
    video.load();

    // Never crossfade into a half-loaded frame: wait for real data.
    if (video.readyState >= 2) {
      startVideo();
    } else {
      video.addEventListener('loadeddata', startVideo, { once: true });
    }
  });

  video.addEventListener('ended', () => {
    video.pause();
    state = state === 'photo' ? 'geometric' : 'photo';
    // Target image is already in the DOM at opacity 0, no src swap here.
    showLayer(state === 'photo' ? photoImg : geometricImg);
    playState = 'idle';
  });
});
