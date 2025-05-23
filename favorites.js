let coins = []; // Global variable to store favorite coins
let currentPage = 1; // Assuming pagination is handled with a current page variable

const options = {
    method: 'GET',
    headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-mDVVqLm5xBDjvcVq523LnAmB' },
};

const getFavorites = () => {
    return JSON.parse(localStorage.getItem('favorites')) || [];
};

const fetchFavoriteCoins = async (ids) => {
    try {
        showShimmer(); // Show shimmer effect before fetching data
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(',')}`, options);

        const fetchedCoins = await response.json();
        hideShimmer(); // Hide shimmer effect after data is fetched
    
        return fetchedCoins;
    } catch (err) {
        console.error(err);
        hideShimmer(); // Ensure shimmer is hidden in case of an error
    }
};

const renderFavorites = (coins) => {
    const tableBody = document.querySelector('#favorite-table tbody');
    const noFavoritesMessage = document.querySelector('#no-favorites');
    tableBody.innerHTML = '';

    if (coins.length === 0) {
        noFavoritesMessage.style.display = 'block';
        return;
    } else {
        noFavoritesMessage.style.display = 'none';
    }

    coins.forEach((coin, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24" /></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>$${coin.total_volume.toLocaleString()}</td>
            <td>$${coin.market_cap.toLocaleString()}</td>
        `;
        row.addEventListener('click', () => {
            window.location.href = `coin.html?id=${coin.id}`;
        });
        tableBody.appendChild(row);
    });
};

// Function to show shimmer effect
const showShimmer = () => {
    const shimmerContainer = document.querySelector('.shimmer-container');
    shimmerContainer.style.display = 'flex';
};

// Function to hide shimmer effect
const hideShimmer = () => {
    const shimmerContainer = document.querySelector('.shimmer-container');
    shimmerContainer.style.display = 'none';
};
let debounceTimeout;
const debounce = (func, delay) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(func, delay);
};

// Function to filter favorite coins based on search query
const searchFavorites = (query, coins) => {
    const filteredCoins = coins.filter(coin => 
        coin.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredCoins.length === 0) {
        document.getElementById('no-favorites').textContent = "No matching coins found. Explore and add them to your favorites.";
        document.getElementById('no-favorites').style.display = 'block';
    } else {
        document.getElementById('no-favorites').style.display = 'none';
    }

    renderFavorites(filteredCoins);
};

document.addEventListener('DOMContentLoaded', async () => {
    const favorites = getFavorites();
    if (favorites.length === 0) {
        renderFavorites([]);
    } else {
        coins = await fetchFavoriteCoins(favorites);
        renderFavorites(coins);

        // Set up search functionality
        const searchBox = document.getElementById('search-box');
        searchBox.addEventListener('input', () => {
            const query = searchBox.value;
            searchFavorites(query, coins);
        });
    }
});

document.querySelector('#sort-price-asc').addEventListener('click', () => sortCoinsByPrice('asc')); // Sort by price ascending
document.querySelector('#sort-price-desc').addEventListener('click', () => sortCoinsByPrice('desc')); // Sort by price descending
document.querySelector('#sort-volume-asc').addEventListener('click', () => sortCoinsByVolume('asc')); // Sort by volume ascending
document.querySelector('#sort-volume-desc').addEventListener('click', () => sortCoinsByVolume('desc'));
document.querySelector('#sort-market-asc').addEventListener('click', () => sortCoinsByMarketCap('asc')); // Sort by volume ascending
document.querySelector('#sort-market-desc').addEventListener('click', () => sortCoinsByMarketCap('desc')); // Sort by volume descending

const sortCoinsByPrice = (order) => {
    if (order === 'asc') {
        coins.sort((a, b) => a.current_price - b.current_price);
    } else if (order === 'desc') {
        coins.sort((a, b) => b.current_price - a.current_price);
    }

    renderFavorites(coins); // Render sorted coins
};

const sortCoinsByVolume = (order) => {
 
    if (order === 'asc') {
        coins.sort((a, b) => a.total_volume - b.total_volume);
    } else if (order === 'desc') {
        coins.sort((a, b) => b.total_volume - a.total_volume);
    }

    renderFavorites(coins); // Render sorted coins
};
const sortCoinsByMarketCap = (order) => {
   
    if (order === 'asc') {
        coins.sort((a, b) => a.market_cap - b.market_cap);
    } else if (order === 'desc') {
        coins.sort((a, b) => b.market_cap - a.market_cap);
    }

    renderFavorites(coins); // Render sorted coins
};

