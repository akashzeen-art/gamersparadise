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
        if (lang === 'ar') {
            return game.name_ar || game.name;
        }
        return game.name;
    }

    function buildGameCard(game, overlayClass, lang) {
        var displayName = getDisplayName(game, lang);
        var safeName = escapeHtml(displayName);
        var safeNameEn = escapeHtml(game.name);
        var safeNameAr = escapeHtml(game.name_ar || game.name);
        var safeUrl = escapeHtml(game.game_url);
        var safeThumb = escapeHtml(game.thumbnail_url);

        return (
            '<div class="col-md-6 col-lg-4">' +
                '<div class="nk-image-box-3">' +
                    '<a href="' + safeUrl + '" class="nk-image-box-link"></a>' +
                    '<img src="' + safeThumb + '" alt="' + safeName + '" loading="lazy" style="width:100%;height:220px;object-fit:cover;">' +
                    '<div class="' + escapeHtml(overlayClass) + '">' +
                        '<div class="nk-image-meta">' +
                            '<h3 class="mb-20 nk-image-box-title h4">' +
                                '<span class="game-title" data-name-ar="' + safeNameAr + '" data-name-en="' + safeNameEn + '">' + safeName + '</span>' +
                            '</h3>' +
                            '<div class="nk-btn play-now-btn"><span data-i18n="العب الآن">العب الآن</span></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }

    function filterGames(games, options) {
        var list = games || [];
        if (options && options.category) {
            list = list.filter(function (game) {
                return game.categories && game.categories.indexOf(options.category) !== -1;
            });
        }
        if (options && options.filter) {
            list = list.filter(options.filter);
        }
        return list;
    }

    function resolveLimit(container, options) {
        if (options && options.limit != null) {
            return parseInt(options.limit, 10);
        }
        var attr = container.getAttribute('data-limit');
        if (attr != null && attr !== '') {
            var parsed = parseInt(attr, 10);
            if (!isNaN(parsed) && parsed > 0) {
                return parsed;
            }
        }
        return null;
    }

    function resolveOverlay(container, options) {
        if (options && options.overlay) {
            return options.overlay;
        }
        return container.getAttribute('data-overlay') || 'nk-image-box-overlay nk-image-box-center';
    }

    window.renderGamesGrid = function (container, options) {
        options = options || {};
        if (!container) return;

        var games = window.gamesData;
        if (!Array.isArray(games)) {
            console.warn('games-render: window.gamesData is not available');
            return;
        }

        var filtered = filterGames(games, options);
        var limit = resolveLimit(container, options);
        if (limit != null) {
            filtered = filtered.slice(0, limit);
        }

        var overlayClass = resolveOverlay(container, options);
        var lang = options.lang || getCurrentLang();
        var html = filtered.map(function (game) {
            return buildGameCard(game, overlayClass, lang);
        }).join('');

        container.innerHTML = html;

        if (typeof window.initGameCards === 'function') {
            window.initGameCards(container);
        }

        if (typeof window.applyLanguage === 'function') {
            window.applyLanguage(getCurrentLang());
        }
    };

    window.updateGameTitles = function (lang) {
        var resolvedLang = lang || getCurrentLang();
        document.querySelectorAll('.game-title').forEach(function (el) {
            var nameAr = el.getAttribute('data-name-ar');
            var nameEn = el.getAttribute('data-name-en');
            if (resolvedLang === 'ar') {
                el.textContent = nameAr || nameEn || '';
            } else {
                el.textContent = nameEn || nameAr || '';
            }
        });
    };

    function initAllGrids() {
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
