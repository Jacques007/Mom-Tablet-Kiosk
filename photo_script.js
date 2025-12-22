fetch('json/photo_descriptions.json')  // Path to your JSON file
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load data');
    }
    return response.json();
  })
  .then(data => {
    const gallery = document.getElementById('gallery');

    data.forEach(item => {
      // Create container for each item
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('gallery-item');

      // Create image
      const img = document.createElement('img');
      img.src = 'images/' + item.image;  // Adjust path if needed
      img.alt = item.heading;  // Good for accessibility

      // Create heading
      const heading = document.createElement('h2');
      heading.textContent = item.heading;

      // Append to item container (heading above or below image?)
      itemDiv.appendChild(heading);  // Heading first
      itemDiv.appendChild(img);      // Then image (swap if you want image first)

      // Append to gallery
      gallery.appendChild(itemDiv);
    });
  })
  .catch(error => {
    console.error('Error loading gallery:', error);
    document.getElementById('gallery').innerHTML = '<p>Sorry, could not load the gallery.</p>';

  });
