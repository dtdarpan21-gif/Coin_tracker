const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
const tableBody = document.getElementById("coinTableBody");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const marketCapBtn = document.getElementById("marketCapBtn");
const changeBtn = document.getElementById("changeBtn");
const asyncBtn = document.getElementById("asyncBtn");
const status = document.getElementById("status");

let coins = [];
let filteredCoins = [];
let marketCapDescending = true;
let changeDescending = true;

function fetchCoinsThen() {
    status.textContent = "Loading data using.then()...";

    fetch(API_URL)
    .then((response) => {
        if (!response.ok){
            throw new Error("Failed to fetch cryptocurrency data.");
        }
        return response.json();
    })
    .then((data) => {
        coins = data;
        filteredCoins = [...coins];
        renderCoins(filteredCoins);
        status.textContent = `Showing ${filteredCoins.length} crptocurrencies.`;
    })
    .catch((error) => {
        status.textContent = error.message;
        console.error("Fetch error:", error);
    });
}
async function fetchCoinsAsync(){
    status.textContent = "Loading data using async/await...";
    try {
        const response =  await fetch(API_URL);
        if(!response.ok){
            throw new Error("Failed to fetch crptocurrency data.");
        }
        const data = await response.json();
        coins = data;
        filteredCoins = [...coins];
        renderCoins(filteredCoins);
        status.textContent = `Showing ${filteredCoins.length} crptocurrencies.`;
    } catch (error) {
        status.textContent = error.message;
        console.error("Fetch error:", error);
    }
}

function renderCoins(data) {
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="8">No cryptocurrencies found.</td></tr>';
    status.textContent = "No matching cryptocurrencies found.";
    return;
  }

 data.forEach((coin) => {
    const row = document.createElement("tr");

    const price = Number(coin.current_price);
    const volume = Number(coin.total_volume);
    const marketCap = Number(coin.market_cap);
    const change = Number(coin.price_change_percentage_24h);

    const changeClass = change >= 0 ? "positive" : "negative";

    row.innerHTML = `
      <td>${coin.name}</td>
      <td>${coin.id}</td>
      <td>
        <img
          class="coin-image"
          src="${coin.image}"
          alt="${coin.name}"
        >
      </td>
      <td>${coin.symbol.toUpperCase()}</td>
      <td>$${price.toLocaleString("en-US", {
        maximumFractionDigits: 8
      })}</td>
      <td>$${volume.toLocaleString("en-US")}</td>
      <td>$${marketCap.toLocaleString("en-US")}</td>
      <td class="${changeClass}">
        ${Number.isFinite(change) ? change.toFixed(2) + "%" : "N/A"}
      </td>
    `;

    tableBody.appendChild(row);
  });

  status.textContent = `Showing ${data.length} cryptocurrencies.`;
}

// Search by coin name, ID, or symbol
function searchCoins() {
  const query = searchInput.value.trim().toLowerCase();

  filteredCoins = coins.filter((coin) => {
    return (
      coin.name.toLowerCase().includes(query) ||
      coin.id.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query)
    );
  });

  renderCoins(filteredCoins);
}

// Sort by market capitalization
function sortByMarketCap() {
  marketCapDescending = !marketCapDescending;

  filteredCoins.sort((a, b) => {
    return marketCapDescending
      ? b.market_cap - a.market_cap
      : a.market_cap - b.market_cap;
  });

  marketCapBtn.textContent = marketCapDescending
    ? "Sort by Market Cap ↓"
    : "Sort by Market Cap ↑";

  renderCoins(filteredCoins);
}

// Sort by 24-hour percentage change
function sortByChange() {
  changeDescending = !changeDescending;

  filteredCoins.sort((a, b) => {
    const changeA = a.price_change_percentage_24h ?? -Infinity;
    const changeB = b.price_change_percentage_24h ?? -Infinity;

    return changeDescending
      ? changeB - changeA
      : changeA - changeB;
  });

  changeBtn.textContent = changeDescending
    ? "Sort by Change % ↓"
    : "Sort by Change % ↑";

  renderCoins(filteredCoins);
}

// Event listeners
searchBtn.addEventListener("click", searchCoins);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchCoins();
  }
});

marketCapBtn.addEventListener("click", sortByMarketCap);
changeBtn.addEventListener("click", sortByChange);
asyncBtn.addEventListener("click", fetchCoinsAsync);

// Initial API call uses .then()
fetchCoinsThen();