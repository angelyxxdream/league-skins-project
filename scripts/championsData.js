// Variable to hold ALL champions data globally so the search function can access it
let ALL_CHAMPIONS = []; 

// Step 1: Get the container and the search bar
const championsContainer = document.getElementById('champions-grid');
const searchField = document.getElementById('search-field'); // <-- NEW: Get the search input

// Function to create and append the champion cards
function renderChampions(championList, container) {
    // Clear the current content of the grid
    container.innerHTML = ''; 

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
      container.appendChild(championCard);
    });
    
    // If no champions are found, display a message
    if (championList.length === 0) {
        const noResults = document.createElement('p');
        // Use the current search value for the message
        noResults.textContent = `No champion found matching "${searchField.value}"`; 
        container.appendChild(noResults);
    }
}


// Step 2: Load the JSON file
fetch('data/champions.json')
  .then(function(response) {
    return response.json(); 
  })
  .then(function(championList) {
    // 3. Store the data globally
    ALL_CHAMPIONS = championList; 

    // 4. Initial render of all champions
    renderChampions(ALL_CHAMPIONS, championsContainer); 

    // 5. Attach the event listener to the search bar
    searchField.addEventListener('input', handleSearch);

  })
  .catch(function(error) {
    console.log('Error loading JSON:', error);
    championsContainer.innerHTML = "<p>Could not load champion data.</p>";
  });


// Function to handle the search/filtering logic
function handleSearch(event) {
    // 1. Get the input value and normalize it (lowercase, trim whitespace)
    const searchTerm = event.target.value.trim().toLowerCase(); 

    // 2. Filter the global ALL_CHAMPIONS array
    const filteredChampions = ALL_CHAMPIONS.filter(champion => {
        // Normalize the champion name from the data
        const championName = champion.champion_name.toLowerCase();
        
        // Return true if the champion's name includes the search term (partial match)
        return championName.includes(searchTerm);
    });

    // 3. Render the filtered results
    renderChampions(filteredChampions, championsContainer);
}