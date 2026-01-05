(function () {
  const canvas = document.getElementById('clock-canvas');
  const digital = document.getElementById('digital-time');
  const ctx = canvas.getContext('2d');

  function drawFace(radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#121212' : '#fff';
    ctx.fill();
    ctx.lineWidth = radius * 0.02;
    ctx.strokeStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#333' : '#ccc';
    ctx.stroke();

    // Hour marks
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -radius * 0.88);
      ctx.lineTo(0, -radius * 0.80);
      ctx.lineWidth = radius * 0.02;
      ctx.strokeStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#ddd' : '#333';
      ctx.stroke();
      ctx.rotate(-angle);
    }
  }

  function drawHand(angle, length, width, color) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.rotate(angle);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-angle);
  }

  function drawCenter(radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.03, 0, 2 * Math.PI);
    ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#ddd' : '#333';
    ctx.fill();
  }

  function update() {
    const now = new Date();
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    // High DPI support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientWidth * dpr); // square
    const radius = canvas.width / 2;
    ctx.setTransform(dpr, 0, 0, dpr, canvas.width / 2, canvas.height / 2); // center
    ctx.clearRect(-radius, -radius, canvas.width, canvas.height);

    drawFace(radius);

    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const hourColor = dark ? '#eee' : '#222';
    const minColor  = dark ? '#ddd' : '#333';
    const secColor  = dark ? '#ff6b6b' : '#e53935';

    // Convert to radians
    const secAngle = (seconds * Math.PI) / 30;
    const minAngle = (minutes * Math.PI) / 30;
    const hourAngle = (hours * Math.PI) / 6;

    drawHand(hourAngle, radius * 0.55, radius * 0.06, hourColor);
    drawHand(minAngle,  radius * 0.70, radius * 0.04, minColor);
    drawHand(secAngle,  radius * 0.75, radius * 0.02, secColor);
    drawCenter(radius);

    // Accessible digital time
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    digital.textContent = `${hh}:${mm}:${ss}`;
  }

  function tick() {
    update();
    requestAnimationFrame(tick);
  }
  tick();
})();
