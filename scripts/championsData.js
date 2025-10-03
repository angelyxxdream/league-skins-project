// Variable to hold ALL champions data globally so the search function can access it
let ALL_CHAMPIONS = []; 

// Step 1: Get the container and the search bar
const championsContainer = document.querySelector('.js-champions-grid');
const searchField = document.querySelector('.js-search-field'); 

// --- DATE CALCULATION FUNCTION ---
function calculateDaysPassed(dateString) {
    const pastDate = new Date(dateString); 
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const differenceInTime = today.getTime() - pastDate.getTime();
    const millisecondsInDay = 1000 * 60 * 60 * 24;
    const days = Math.floor(differenceInTime / millisecondsInDay);
    
    return Math.max(0, days); 
}

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

// NEW FUNCTION: Handles the Enter key press to hide the mobile keyboard
function handleKeydown(event) {
    // Check if the pressed key is the 'Enter' key
    if (event.key === 'Enter') {
        // Prevents the default action
        event.preventDefault(); 
        
        // Remove focus from the input, which closes the mobile keyboard
        event.target.blur(); 
    }
}


// Step 2: Load the JSON file and process the date math
fetch('scripts/champions.json')
  .then(function(response) {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json(); 
  })
  .then(function(championList) {
    
    // 🔥 DATE MATH AND MESSAGE GENERATION HAPPENS HERE 🔥
    const finalList = championList.map(c => {
        
        // Assumes you manually added the 'latest_skin_date' field to your JSON
        const releaseDate = c.latest_skin_date; 
        
        let days = undefined;
        let displayMessage;

        if (releaseDate) {
            days = calculateDaysPassed(releaseDate); // Perform the math
        }

        // Conditional Logic for dynamic messaging
        if (days === undefined) {
            displayMessage = 'Date not found (Missing data)';
        } else if (days <= 0) { 
            displayMessage = '✨ NEW SKIN AVAILABLE NOW! ✨'; 
        } else if (days === 1) {
            displayMessage = `${days} day`;
        }
        else {
            displayMessage = `${days} days`;
        }

        return {
            ...c,
            last_skin_days: displayMessage // Attach the final message string
        };
    });
    // 🔥 END DATE MATH BLOCK 🔥
    
    // 3. Store the processed data globally
    ALL_CHAMPIONS = finalList; 

    // 4. Initial render of all champions
    renderChampions(ALL_CHAMPIONS, championsContainer); 

    // 5. Attach the event listener for live filtering
    searchField.addEventListener('input', handleSearch);
    
    // 6. Attach the keydown listener for mobile keyboard hiding
    searchField.addEventListener('keydown', handleKeydown);

  })
  .catch(function(error) {
    console.log('Error loading JSON:', error);
    championsContainer.innerHTML = "<p>Could not load champion data.</p>";
  });
