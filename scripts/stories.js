  fetch('media/Stories.txt')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load content.txt');
        return r.text();
      })
      .then(text => {
        document.getElementById('content').textContent = text;
      })
      .catch(err => {
        document.getElementById('content').textContent = 'Could not load content.';
        console.error(err);
      });
