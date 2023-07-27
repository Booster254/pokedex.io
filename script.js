const pokemonInfo = document.getElementById("pokemonInfo");
const searchInput = document.getElementById("searchInput");
let allPokemonList = [];
let currentPage = 1;
const itemsPerPage = 10;

// Fetch all Pokémon data on page load
async function fetchAllPokemonData() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=898");
    const data = await response.json();
    allPokemonList = data.results;
    await fetchPokemonDetails();
    displayPokemonList(currentPage);
  } catch (error) {
    console.log("Error:", error);
  }
}

// Fetch Pokémon details for each Pokémon
async function fetchPokemonDetails() {
  for (const pokemon of allPokemonList) {
    try {
      const response = await fetch(pokemon.url);
      const data = await response.json();
      pokemon.classification = data.species.name;
      pokemon.types = data.types.map(typeData => typeData.type.name);
    } catch (error) {
      console.log(`Error fetching details for ${pokemon.name}:`, error);
    }
  }
}

// Display the list of Pokémon
function displayPokemonList(page, pokemonList) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPokemonList = pokemonList.slice(startIndex, endIndex);

  pokemonInfo.innerHTML = "";

  displayedPokemonList.forEach(pokemon => {
    const pokemonCard = createPokemonCard(pokemon);
    pokemonInfo.appendChild(pokemonCard);
  });
}

// Create a Pokémon card
function createPokemonCard(pokemon) {
  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");

  const pokemonImage = document.createElement("img");
  pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon.url)}.png`;
  pokemonImage.alt = pokemon.name;
  pokemonCard.appendChild(pokemonImage);

  const pokemonName = document.createElement("h3");
  pokemonName.textContent = capitalizeFirstLetter(pokemon.name);
  pokemonCard.appendChild(pokemonName);

  const pokemonNumber = document.createElement("span");
  pokemonNumber.textContent = `#${getPokemonId(pokemon.url)}`;
  pokemonCard.appendChild(pokemonNumber);

  // Add the Pokémon classification
  if (pokemon.classification) {
    const pokemonClassification = document.createElement("p");
    pokemonClassification.textContent = capitalizeFirstLetter(pokemon.classification);
    pokemonCard.appendChild(pokemonClassification);
  }

  // Add the Pokémon types
  if (pokemon.types && pokemon.types.length > 0) {
    const typesContainer = document.createElement("div");
    typesContainer.classList.add("pokemon-type");
    pokemon.types.forEach(type => {
      const typeElement = document.createElement("span");
      typeElement.textContent = capitalizeFirstLetter(type);
      typesContainer.appendChild(typeElement);
    });
    pokemonCard.appendChild(typesContainer);
  }

  return pokemonCard;
}

// Helper function to get Pokémon ID from its URL
function getPokemonId(url) {
  const regex = /\/(\d+)\//;
  const match = url.match(regex);
  if (match) {
    return match[1];
  }
  return "";
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to handle search input
function handleSearch() {
  const searchValue = searchInput.value.toLowerCase();
  const filteredPokemonList = allPokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(searchValue));
  displayPokemonList(currentPage, filteredPokemonList);
}

// Function to handle next page
function handleNextPage() {
  const maxPage = Math.ceil(allPokemonList.length / itemsPerPage);
  if (currentPage < maxPage) {
    currentPage++;
    displayPokemonList(currentPage, allPokemonList);
  }
}

// Function to handle previous page
function handlePrevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayPokemonList(currentPage, allPokemonList);
  }
}

// Add event listeners
searchInput.addEventListener("input", handleSearch);
document.getElementById("nextPageBtn").addEventListener("click", handleNextPage);
document.getElementById("prevPageBtn").addEventListener("click", handlePrevPage);

// Fetch all Pokémon data on page load
fetchAllPokemonData();
