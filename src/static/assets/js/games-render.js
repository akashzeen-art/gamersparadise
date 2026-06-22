(function () {
    'use strict';

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getCurrentLang() {
        return localStorage.getItem('siteLang') || 'ar';
    }

    function getDisplayName(game, lang) {
        if (lang === 'ar') return game.name_ar || game.name;
        return game.name;
    }

    function buildHeroGameTile(game, lang) {
        var displayName = getDisplayName(game, lang);
        var safeName   = escapeHtml(displayName);
        var safeNameEn = escapeHtml(game.name);
        var safeNameAr = escapeHtml(game.name_ar || game.name);
        var safeUrl    = escapeHtml(game.game_url);
        var safeThumb  = escapeHtml(game.thumbnail_url);

        return (
            '<a href="' + safeUrl + '" class="hero-game-tile" role="listitem">' +
                '<span class="hero-game-tile-media">' +
                    '<img src="' + safeThumb + '" alt="' + safeName + '" loading="lazy">' +
                    '<span class="hero-game-tile-play" aria-hidden="true">&#9654;</span>' +
                '</span>' +
                '<span class="hero-game-tile-name game-title" data-name-ar="' + safeNameAr + '" data-name-en="' + safeNameEn + '">' + safeName + '</span>' +
            '</a>'
        );
    }

    function renderHeroGames(container) {
        if (!container) return;

        var games = window.gamesData;
        if (!Array.isArray(games)) return;

        var category = container.getAttribute('data-category') || 'Top 10 Games';
        var filtered = filterGames(games, category);
        if (!filtered.length) filtered = games.slice();
        var limit = resolveLimit(container, null) || 12;
        filtered = filtered.slice(0, limit);

        var lang = getCurrentLang();
        container.innerHTML = filtered.map(function (g) {
            return buildHeroGameTile(g, lang);
        }).join('');

        if (typeof window.initHeroGameTiles === 'function') {
            window.initHeroGameTiles(container);
        }
    }

    function buildGameCard(game, overlayClass, lang) {
        var displayName = getDisplayName(game, lang);
        var safeName   = escapeHtml(displayName);
        var safeNameEn = escapeHtml(game.name);
        var safeNameAr = escapeHtml(game.name_ar || game.name);
        var safeUrl    = escapeHtml(game.game_url);
        var safeThumb  = escapeHtml(game.thumbnail_url);

        return (
            '<div class="col-6 col-md-4 col-lg-3">' +
                '<div class="nk-image-box-3">' +
                    '<a href="' + safeUrl + '" class="nk-image-box-link"></a>' +
                    '<img src="' + safeThumb + '" alt="' + safeName + '" loading="lazy">' +
                    '<div class="' + escapeHtml(overlayClass) + '">' +
                        '<div class="nk-image-meta">' +
                            '<h3 class="mb-20 nk-image-box-title h4">' +
                                '<span class="game-title" data-name-ar="' + safeNameAr + '" data-name-en="' + safeNameEn + '">' + safeName + '</span>' +
                            '</h3>' +
                            '<div class="nk-btn play-now-btn"><span data-i18n="\u0627\u0644\u0639\u0628 \u0627\u0644\u0622\u0646">\u0627\u0644\u0639\u0628 \u0627\u0644\u0622\u0646</span></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }

    function filterGames(games, category) {
        if (!category) return games;
        return games.filter(function (g) {
            return g.categories && g.categories.indexOf(category) !== -1;
        });
    }

    function resolveLimit(container, options) {
        if (options && options.limit != null) return parseInt(options.limit, 10);
        var attr = container.getAttribute('data-limit');
        if (attr) { var p = parseInt(attr, 10); if (!isNaN(p) && p > 0) return p; }
        return null;
    }

    function resolveOverlay(container, options) {
        if (options && options.overlay) return options.overlay;
        return container.getAttribute('data-overlay') || 'nk-image-box-overlay nk-image-box-center';
    }

    /* Public: render a single container */
    window.renderGamesGrid = function (container, options) {
        options = options || {};
        if (!container) return;

        var games = window.gamesData;
        if (!Array.isArray(games)) {
            console.warn('games-render: window.gamesData is not available');
            return;
        }

        var category    = options.category || container.getAttribute('data-category') || null;
        var filtered    = filterGames(games, category);
        var limit       = resolveLimit(container, options);
        if (limit != null) filtered = filtered.slice(0, limit);

        var overlayClass = resolveOverlay(container, options);
        var lang         = options.lang || getCurrentLang();
        container.innerHTML = filtered.map(function (g) {
            return buildGameCard(g, overlayClass, lang);
        }).join('');

        if (typeof window.initGameCards === 'function') window.initGameCards(container);
        if (typeof window.applyLanguage === 'function') window.applyLanguage(getCurrentLang());
    };

    window.updateGameTitles = function (lang) {
        var resolvedLang = lang || getCurrentLang();
        document.querySelectorAll('.game-title').forEach(function (el) {
            var nameAr = el.getAttribute('data-name-ar');
            var nameEn = el.getAttribute('data-name-en');
            el.textContent = (resolvedLang === 'ar') ? (nameAr || nameEn || '') : (nameEn || nameAr || '');
        });
    };

    /* Render all grids on the page: .games-grid and legacy #gamesGrid */
    function initAllGrids() {
        document.querySelectorAll('.hero-games-scroll').forEach(function (strip) {
            renderHeroGames(strip);
        });

        /* New category sections */
        document.querySelectorAll('.games-grid').forEach(function (grid) {
            window.renderGamesGrid(grid);
        });
        /* Legacy single grid */
        document.querySelectorAll('#gamesGrid').forEach(function (grid) {
            window.renderGamesGrid(grid);
        });
    }

    function onLanguageChanged(event) {
        var lang = (event && event.detail && event.detail.lang) || getCurrentLang();
        window.updateGameTitles(lang);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllGrids);
    } else {
        initAllGrids();
    }

    window.addEventListener('languageChanged', onLanguageChanged);
    if (window.jQuery) {
        window.jQuery(window).on('languageChanged', onLanguageChanged);
    }
})();
