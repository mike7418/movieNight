// JavaScript source code
// https://www.omdbapi.com/?apikey=fbd4261d


const API_KEY = "fbd4261d";
    const BASE_URL = "https://www.omdbapi.com/";

    const resultsContainer = document.getElementById("results");
    const paginationContainer = document.getElementById("pagination");

    // Fetch movies
    async function fetchMovies(title, year = "", page = 1) {
        try {
            const url = `${BASE_URL}?apikey=${API_KEY}&s=${title}&y=${year}&page=${page}&type!=game`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.Response === "False") {
                resultsContainer.innerHTML = `<p>No results found</p>`;
                paginationContainer.innerHTML = "";
                return;
            }

            renderMovies(data.Search);
            setupPagination(data.totalResults, title, year, page);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Render movie cards
    function renderMovies(movies) {
        resultsContainer.innerHTML = "";

        movies.forEach(movie => {

            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
            <img src="${movie.Poster}" onerror="this.src='assets/images/000000H1.jpg'" />
      <h3>${movie.Title}</h3>
      <h5>${movie.Type}</h5>
      <p>${movie.Year}</p>
    `;

            resultsContainer.appendChild(card);
        });
    }

    // Pagination
    function setupPagination(totalResults, title, year, currentPage) {
        paginationContainer.innerHTML = "";

        const totalPages = Math.ceil(totalResults / 10);

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;

            if (i === currentPage) {
                btn.disabled = true;
            }

            btn.addEventListener("click", () => {
                fetchMovies(title, year, i);
            });

            paginationContainer.appendChild(btn);
        }
    }

    // Handle form submit
    document.getElementById("searchForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value.trim();
        const year = document.getElementById("year").value.trim();

        if (!title) return;

        fetchMovies(title, year);
    });
    