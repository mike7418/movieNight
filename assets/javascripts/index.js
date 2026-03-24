// JavaScript source code
// https://www.omdbapi.com/?i=tt3896198&apikey=fbd4261d

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
