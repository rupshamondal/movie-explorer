// ---- Configuration ----
const TMDB_API_KEY = 'a49969ccaa885fd82b50c7cf927efc04'; 
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_POSTER =
  'https://via.placeholder.com/500x750?text=No+Image';

// ---- DOM Elements ----
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const moviesContainer = document.getElementById('movies-container');
const cardTemplate = document.getElementById('movie-card-template');

// ---- Event Listeners ----
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  moviesContainer.innerHTML = '';
  try {
    const movies = await fetchMovies(query);
    renderMovies(movies);
  } catch (err) {
    moviesContainer.innerHTML =
      '<p style="padding:1rem">Something went wrong. Try again.</p>';
    console.error(err);
  }
});

// ---- API Fetch ----
async function fetchMovies(query) {
  const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
    query
  )}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  return data.results;
}

// ---- Render ----
function renderMovies(movies) {
  if (!movies.length) {
    moviesContainer.innerHTML =
      '<p style="padding:1rem">No movies found. Try another search.</p>';
    return;
  }
  const fragment = document.createDocumentFragment();
  movies.forEach((movie) => {
    const card = cardTemplate.content.cloneNode(true);
    const poster = card.querySelector('.movie-poster');
    const title = card.querySelector('.movie-title');
    const info = card.querySelector('.movie-info');

    poster.src = movie.poster_path
      ? `${IMAGE_BASE}${movie.poster_path}`
      : FALLBACK_POSTER;
    poster.alt = movie.title || 'Movie Poster';

    title.textContent = movie.title;
    info.textContent = `⭐ ${movie.vote_average} · 📅 ${
      movie.release_date || 'N/A'
    }`;
    fragment.appendChild(card);
  });
  moviesContainer.appendChild(fragment);
}
