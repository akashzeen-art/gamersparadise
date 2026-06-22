import { $ } from './_utility';

/*------------------------------------------------------------------

  Init Header Title

-------------------------------------------------------------------*/
function initHeaderTitle() {
    const self = this;
    const $navbarHeader = $('.nk-header');
    const isNavbarOpaque = $navbarHeader.hasClass('nk-header-opaque');
    const isNavbarTransparent = $('.nk-navbar-top').hasClass('nk-header-transparent');
    const $headerTitle = $('.nk-header-title > .nk-header-table');
    const $heroHeaderTable = $('.hero-animated-header > .nk-header-table');
    const $fullHeaderTitle = $('.nk-header-title-full > .nk-header-table');

    function applyHeaderPadding() {
        const navH = $navbarHeader.outerHeight() || 0;

        // Animated hero always clears the fixed navbar
        if ($heroHeaderTable.length) {
            $heroHeaderTable.css('padding-top', navH);
        }

        // remove header title padding if navbar opaque (non-animated headers)
        if (isNavbarOpaque) {
            $headerTitle.not($heroHeaderTable).css('padding-top', 0);
        } else if (!isNavbarTransparent && !isNavbarOpaque) {
            $headerTitle.not($heroHeaderTable).css('padding-top', navH);
        }

        // fix header title height
        if ($fullHeaderTitle.length) {
            let headerH = '100vh';

            if (isNavbarOpaque) {
                headerH = `calc(100vh - ${navH}px)`;
            }

            $fullHeaderTitle.css('min-height', headerH);
        }
    }

    applyHeaderPadding();
    self.debounceResize(applyHeaderPadding);
}

export { initHeaderTitle };
