fetch('json/tasks.json')
  .then(r => r.json())
  .then(tasks => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const format = d => d.toISOString().split('T')[0];

    const todayStr = format(today);
    const tomorrowStr = format(tomorrow);

    const todayList = document.getElementById('today');
    const tomorrowList = document.getElementById('tomorrow');

    tasks.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t.task;

      if (t.date === todayStr) todayList.appendChild(li);
      if (t.date === tomorrowStr) tomorrowList.appendChild(li);
    });
  });
