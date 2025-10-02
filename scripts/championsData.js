// Step 1: Get the container in HTML
const championsContainer = document.getElementById('champions-grid');

// Step 2: Load the JSON file
fetch('data/champions.json')
  .then(function(response) {
    return response.json(); // Convert JSON to JavaScript object
  })
  .then(function(championList) {
    // Step 3: Loop through each champion
    championList.forEach(function(champion) {
      // Create a card container
      const championCard = document.createElement('div');
      championCard.className = 'champion-card';

      // Create the image element
      const championImage = document.createElement('img');
      championImage.src = champion.render_source;
      championImage.alt = champion.champion_name;

      // Create the champion name element
      const championName = document.createElement('div');
      championName.textContent = champion.champion_name;

      // Create the last skin info element
      const lastSkinInfo = document.createElement('p');
      lastSkinInfo.textContent = champion.last_skin_days;

      // Add image, name, and last skin info to the card
      championCard.appendChild(championImage);
      championCard.appendChild(championName);
      championCard.appendChild(lastSkinInfo);

      // Add the card to the container
      championsContainer.appendChild(championCard);
    });
  })
  .catch(function(error) {
    console.log('Error loading JSON:', error);
  });
