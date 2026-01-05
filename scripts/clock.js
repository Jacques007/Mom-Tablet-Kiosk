  (function () {
    const clock = document.getElementById('analog-clock');
    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');
    const marksGroup = clock.querySelector('.marks');
    const digital = document.getElementById('digital-time');

    // Create 12 hour marks around the face
    for (let i = 0; i < 12; i++) {
      const mark = marksGroup.querySelector('.mark').cloneNode(true);
      mark.setAttribute('transform', `rotate(${i * 30} 50 50)`);
      marksGroup.appendChild(mark);
    }
    // Remove the original template mark
    marksGroup.removeChild(marksGroup.querySelector('.mark'));

    function updateClock() {
      const now = new Date(); // local device time (tablet)
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = (now.getHours() % 12) + minutes / 60;

      const secDeg = seconds * 6;         // 360/60
      const minDeg = minutes * 6;         // 360/60
      const hourDeg = hours * 30;         // 360/12

      secondHand.style.transform = `rotate(${secDeg}deg)`;
      minuteHand.style.transform = `rotate(${minDeg}deg)`;
      hourHand.style.transform   = `rotate(${hourDeg}deg)`;

      // Accessible digital time (HH:MM:SS)
      const pad = n => String(Math.floor(n)).padStart(2, '0');
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = pad(minutes % 60);
      const ss = pad(seconds % 60);
      digital.textContent = `${hh}:${mm}:${ss}`;
    }

    // Update 60 times per second for smooth movement
    const tick = () => { updateClock(); requestAnimationFrame(tick); };
    tick();

    // Pause updates if tab not visible to save battery (optional)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) return;
      updateClock();
    });
  })();
