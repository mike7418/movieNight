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
});

function openMenu() {
    document.body.classList += " menu--open"
}

function closeMenu() {
    document.body.classList.remove('menu--open')
}
