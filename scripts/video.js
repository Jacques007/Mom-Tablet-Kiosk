const container = document.getElementById('videoButtons');
const STORAGE_KEY = 'lastVideo';

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

const todayStr = today.toISOString().split('T')[0];
const yesterdayStr = yesterday.toISOString().split('T')[0];

// Load click sound
const clickSound = new Audio('media/click.mp3');
clickSound.volume = 0.3; // adjust as needed

fetch('json/video.json')
  .then(res => {
    if (!res.ok) throw new Error('Network error');
    return res.json();
  })
  .then(data => {
    const videos = data.videos.sort((a,b) => a.date.localeCompare(b.date)); // oldest → newest
    let visibleVideos = videos.filter(v => v.date === todayStr || v.date === yesterdayStr);

    if (visibleVideos.length === 0) {
      visibleVideos = videos.filter(v => v.date < todayStr).slice(-3);
      if (visibleVideos.length > 0) {
        const note = document.createElement('p');
        note.className = 'note';
        note.innerText = 'Here are your recent messages';
        container.appendChild(note);
      }
    }

    if (visibleVideos.length === 0) {
      const cachedVideo = localStorage.getItem(STORAGE_KEY);
      if (cachedVideo) {
        createButton(JSON.parse(cachedVideo));
      } else {
        showOfflineMessage();
      }
      return;
    }

    const newestVideoIndex = visibleVideos.length - 1;

    visibleVideos.forEach((video, i) => {
      const isNewest = i === newestVideoIndex;
      const isToday = video.date === todayStr;
      createButton(video, i, isNewest, isToday);
    });
  })
  .catch(() => {
    const cachedVideo = localStorage.getItem(STORAGE_KEY);
    if (cachedVideo) {
      createButton(JSON.parse(cachedVideo));
    } else {
      showOfflineMessage();
    }
  });

function createButton(video, index=0, isNewest=false, isToday=false) {
  const btn = document.createElement('button');
  btn.className = 'video-button';
  if (isNewest) btn.classList.add('newest');

  btn.innerHTML = `
    <strong>${video.title}</strong>
    ${isToday ? '<span class="today-label">*</span>' : ''}
    <br>
    <span style="font-size:1.2rem; color:#555;">${video.description}</span>
  `;

  btn.onclick = () => {
    clickSound.currentTime = 0;
    clickSound.play();
    playVideo(video.videoId, video);
  };

  container.appendChild(btn);
  setTimeout(() => btn.classList.add('show'), index * 150);
}

function playVideo(videoId, video) {
  document.getElementById('player').innerHTML = `
    <iframe
      width="100%"
      height="360"
      src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&controls=1"
      frameborder="0"
      allow="encrypted-media; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;
  if (video) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(video));
  }
}

function showOfflineMessage() {
  container.innerHTML = `
    <p class="offline-message">
      The internet is not available right now.<br><br>
      Please try again later ❤️
    </p>
  `;
}

// Auto-refresh at midnight
const now = new Date();
const midnight = new Date();
midnight.setHours(24,0,0,0);
setTimeout(() => location.reload(), midnight - now);
