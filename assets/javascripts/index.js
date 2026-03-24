// JavaScript source code
// https://www.omdbapi.com/?i=tt3896198&apikey=fbd4261d

let lastSearch = null; // { s, y, page, totalResults }

document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggle-search');
    const searchBox = document.querySelector('.movies__search--box');

    if (!toggleBtn || !searchBox) return;

    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        searchBox.classList.toggle('visible');
    });

    // hide when reset clicked
    const resetBtn = document.getElementById('search-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            searchBox.classList.remove('visible');
        });
    }

// UI helper: spinner
function showSpinner(show) {
    const spinner = document.getElementById('movies-spinner');
    if (!spinner) return;
    spinner.hidden = !show;
}

// Render the grid of search results
function renderSearchResults(items = []) {
    const container = document.getElementById('search-results');
    const detail = document.getElementById('detail-view');
    if (!container) return;
    container.innerHTML = '';
    if (detail) detail.hidden = true;

    if (!items.length) {
        container.innerHTML = '<p>No results found.</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'result-card';
        const img = document.createElement('img');
        img.src = (item.Poster && item.Poster !== 'N/A') ? item.Poster : 'assets/images/no-poster.png';
        img.alt = item.Title;

        const h3 = document.createElement('h3');
        h3.textContent = `${item.Title} (${item.Year})`;

        const btn = document.createElement('button');
        btn.textContent = 'View';
        btn.addEventListener('click', async function () {
            try {
                showSpinner(true);
                const detail = await fetchOmdb({ i: item.imdbID, plot: 'full' });
                renderDetail(detail);
            } catch (e) {
                console.error(e);
                alert('Failed to load details');
            } finally {
                showSpinner(false);
            }
        });

        card.appendChild(img);
        card.appendChild(h3);
        card.appendChild(btn);
        container.appendChild(card);
    });
}

// Render pagination controls
function renderPagination(totalResults = 0, currentPage = 1) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    pagination.innerHTML = '';

    const total = Math.ceil(totalResults / 10); // OMDb returns 10 per page
    if (total <= 1) return;

    const createButton = (label, page, disabled = false) => {
        const b = document.createElement('button');
        b.textContent = label;
        b.disabled = disabled;
        b.addEventListener('click', async () => {
            if (!lastSearch) return;
            lastSearch.page = page;
            try {
                showSpinner(true);
                const res = await fetchOmdb({ s: lastSearch.s, y: lastSearch.y, page });
                renderSearchResults(res.Search || []);
                renderPagination(parseInt(res.totalResults || 0), page);
            } catch (e) {
                console.error(e);
                alert('Failed to load page');
            } finally {
                showSpinner(false);
            }
        });
        return b;
    };

    // prev
    pagination.appendChild(createButton('Prev', Math.max(1, currentPage - 1), currentPage === 1));

    // show a few page numbers around current
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(total, currentPage + 2);
    for (let p = start; p <= end; p++) {
        const btn = createButton(String(p), p, false);
        if (p === currentPage) btn.disabled = true;
        pagination.appendChild(btn);
    }

    // next
    pagination.appendChild(createButton('Next', Math.min(total, currentPage + 1), currentPage === total));
}

// Render a detailed view for a single movie
function renderDetail(movie) {
    const detail = document.getElementById('detail-view');
    if (!detail) return;
    detail.hidden = false;
    detail.innerHTML = '';

    const top = document.createElement('div');
    top.className = 'detail-top';

    const img = document.createElement('img');
    img.src = (movie.Poster && movie.Poster !== 'N/A') ? movie.Poster : 'assets/images/no-poster.png';
    img.alt = movie.Title;

    const meta = document.createElement('div');
    meta.innerHTML = `
        <h2>${movie.Title} (${movie.Year})</h2>
        <p><strong>Rated:</strong> ${movie.Rated || 'N/A'}</p>
        <p><strong>Runtime:</strong> ${movie.Runtime || 'N/A'}</p>
        <p><strong>Genre:</strong> ${movie.Genre || 'N/A'}</p>
        <p><strong>Director:</strong> ${movie.Director || 'N/A'}</p>
        <p><strong>Actors:</strong> ${movie.Actors || 'N/A'}</p>
    `;

    top.appendChild(img);
    top.appendChild(meta);

    const plot = document.createElement('div');
    plot.innerHTML = `<h3>Plot</h3><p>${movie.Plot || 'N/A'}</p>`;

    const back = document.createElement('button');
    back.textContent = 'Back to results';
    back.addEventListener('click', function () {
        detail.hidden = true;
    });

    detail.appendChild(top);
    detail.appendChild(plot);
    detail.appendChild(back);
}

    // close button inside the search box
    const closeBtn = document.querySelector('.search-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            searchBox.classList.remove('visible');
        });
    }

    // close on ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && searchBox.classList.contains('visible')) {
            searchBox.classList.remove('visible');
        }
    });

    // wire search button to the OMDb fetch helper
    const searchBtn = document.getElementById('search-button');
    if (searchBtn) {
        searchBtn.addEventListener('click', async function () {
            // read form values
            const title = document.getElementById('s')?.value?.trim();
            const year = document.getElementById('y')?.value?.trim();
            const imdbId = document.getElementById('i')?.value?.trim();
            const plot = document.querySelector('select[name="plot"]')?.value || 'short';

            try {
                searchBtn.disabled = true;
                let result;
                if (imdbId) {
                    // fetch by IMDb ID for full details
                    result = await fetchOmdb({ i: imdbId, plot });
                } else if (title) {
                    // search by string (returns search results)
                    result = await fetchOmdb({ s: title, y: year, page: 1 });
                } else {
                    console.warn('Please provide a title or IMDb ID to search.');
                    return;
                }

                console.log('OMDb result:', result);
                // TODO: render results into the page instead of console.log
            } catch (err) {
                console.error('OMDb error:', err);
                alert(err.message || 'Search failed');
            } finally {
                searchBtn.disabled = false;
            }
        });
    }
});

function openMenu() {
    document.body.classList += " menu--open"
}

function closeMenu() {
    document.body.classList.remove('menu--open')
}

/**
 * Query the OMDb API.
 * Accepts an object with keys: s, t, y, i, plot, type, page
 * - If `i` is provided an exact-id lookup is performed.
 * - If `s` is provided a search (list) is performed.
 * Returns parsed JSON or throws an Error on failure.
 */
async function fetchOmdb(params = {}) {
    const API_KEY = 'fbd4261d';
    const base = 'https://www.omdbapi.com/';
    const searchParams = new URLSearchParams({ apikey: API_KEY });

    // prefer exact id lookup
    if (params.i) {
        searchParams.set('i', params.i);
        if (params.plot) searchParams.set('plot', params.plot);
    } else if (params.t) {
        searchParams.set('t', params.t);
        if (params.plot) searchParams.set('plot', params.plot);
        if (params.y) searchParams.set('y', params.y);
    } else if (params.s) {
        // search endpoint
        searchParams.set('s', params.s);
        if (params.y) searchParams.set('y', params.y);
        if (params.page) searchParams.set('page', String(params.page));
    } else {
        throw new Error('No valid query parameter provided (use i, t or s)');
    }

    if (params.type) searchParams.set('type', params.type);

    const url = base + '?' + searchParams.toString();

    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');

    const data = await res.json();
    if (data.Response === 'False') {
        // OMDb returns Response: "False" and Error message
        throw new Error(data.Error || 'OMDb returned an error');
    }

    return data;
}
