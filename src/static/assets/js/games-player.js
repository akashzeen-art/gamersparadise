(function () {
    'use strict';

    function isValidGameUrl(url) {
        if (!url || url === '' || url === '#') return false;
        return (
            url.includes('.html')
            || url.includes('/games/')
            || url.includes('/game/')
            || url.includes('cdn.timepass.games')
            || url.includes('simpleviralgames.com')
        );
    }

    function openGame(url) {
        if (!isValidGameUrl(url)) return;

        var gameFrame = document.getElementById('gameFrame');
        var gameContainer = document.getElementById('gameContainer');
        var gameLoader = document.getElementById('gameLoader');
        var closeBtn = document.getElementById('backToHome');
        var navbar = document.querySelector('.nk-navbar');
        var header = document.querySelector('.nk-header');

        if (!gameFrame || !gameContainer || !gameLoader || !closeBtn) return;

        gameFrame.classList.remove('loaded');
        gameLoader.classList.remove('hidden');

        var currentLang = localStorage.getItem('siteLang') || 'ar';
        var loaderText = gameLoader.querySelector('.loader-text');
        if (loaderText) {
            loaderText.textContent = currentLang === 'ar' ? 'جاري تحميل اللعبة...' : 'Loading game...';
        }

        gameFrame.src = url;
        gameContainer.classList.add('active');
        closeBtn.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (navbar) navbar.style.display = 'none';
        if (header) header.style.display = 'none';
    }

    function closeGame() {
        var gameFrame = document.getElementById('gameFrame');
        var gameContainer = document.getElementById('gameContainer');
        var gameLoader = document.getElementById('gameLoader');
        var closeBtn = document.getElementById('backToHome');
        var navbar = document.querySelector('.nk-navbar');
        var header = document.querySelector('.nk-header');

        if (!gameFrame || !gameContainer || !gameLoader || !closeBtn) return;

        gameFrame.src = '';
        gameFrame.classList.remove('loaded');
        gameLoader.classList.remove('hidden');
        gameContainer.classList.remove('active');
        closeBtn.classList.remove('active');
        document.body.style.overflow = '';

        if (navbar) navbar.style.display = '';
        if (header) header.style.display = '';
    }

    window.initGameCards = function (root) {
        var scope = root || document;

        scope.querySelectorAll('.nk-image-box-link').forEach(function (link) {
            if (link.dataset.gameBound === 'true') return;
            link.dataset.gameBound = 'true';
            link.addEventListener('click', function (e) {
                e.preventDefault();
                openGame(link.getAttribute('href'));
            });
        });

        scope.querySelectorAll('.nk-image-box-3').forEach(function (box) {
            var playButton = box.querySelector('.play-now-btn');
            if (!playButton || playButton.dataset.gameBound === 'true') return;
            playButton.dataset.gameBound = 'true';
            playButton.style.cursor = 'pointer';
            playButton.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var link = box.querySelector('.nk-image-box-link');
                if (link) {
                    openGame(link.getAttribute('href'));
                }
            });
        });
    };

    window.initHeroGameTiles = function (root) {
        var scope = root || document;

        scope.querySelectorAll('.hero-game-tile').forEach(function (tile) {
            if (tile.dataset.gameBound === 'true') return;
            tile.dataset.gameBound = 'true';
            tile.addEventListener('click', function (e) {
                e.preventDefault();
                openGame(tile.getAttribute('href'));
            });
        });
    };

    function initPlayer() {
        var gameFrame = document.getElementById('gameFrame');
        var closeBtn = document.getElementById('backToHome');

        if (gameFrame) {
            gameFrame.addEventListener('load', function () {
                var gameLoader = document.getElementById('gameLoader');
                if (gameFrame.src && gameFrame.src !== 'about:blank' && gameLoader) {
                    gameLoader.classList.add('hidden');
                    gameFrame.classList.add('loaded');
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeGame);
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && closeBtn && closeBtn.classList.contains('active')) {
                closeGame();
            }
        });

        window.initGameCards(document);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlayer);
    } else {
        initPlayer();
    }
})();
