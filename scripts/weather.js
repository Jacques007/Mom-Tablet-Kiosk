// Replace with your coordinates - get weather
      const lat = -33.81754, lon = 18.71517;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max&timezone=auto`;

      fetch(url)
        .then(r => r.json())
        .then(data => {
          // Take the first day's max temp in °C
          const maxC = data.daily.temperature_2m_max[0];
          const date = data.daily.time[0];
          document.getElementById('highC').textContent = `Vandag is : ${maxC.toFixed(0)} °C`;
        })
        .catch(err => console.error(err));
