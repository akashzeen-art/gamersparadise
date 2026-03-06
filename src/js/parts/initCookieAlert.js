import {
    $, $wnd, $body, tween,
} from './_utility';

/*------------------------------------------------------------------

  Init Cookie Alert

-------------------------------------------------------------------*/
function initCookieAlert() {
    const self = this;
    const confirmedCookieName = 'nk_cookie_alert_dismissed';
    const expiration = 365;
    const showTimeout = 2000;

    // stop if already dismissed
    if (!self.options.enableCookieAlert || document.cookie.indexOf(confirmedCookieName) > -1 || window.navigator && window.navigator.CookiesOK) {
        return;
    }

    // Get current language
    function getCurrentLang() {
        try {
            return localStorage.getItem('siteLang') || 'ar';
        } catch(e) {
            return 'ar';
        }
    }

    // Get cookie alert template based on language
    function getCookieAlertTemplate() {
        const lang = getCurrentLang();
        if (lang === 'en') {
            return self.options.templates.cookieAlertEn || self.options.templates.cookieAlert;
        } else {
            return self.options.templates.cookieAlertAr || self.options.templates.cookieAlert;
        }
    }

    // create alert
    const $alert = $('<div class="nk-cookie-alert">').hide().append(getCookieAlertTemplate()).appendTo($body);

    // hide alert
    function hideAlert() {
        tween.to($alert, {
            opacity: 0,
            duration: 0.5,
            display: 'none',
        });
    }

    // show alert
    function showAlert() {
        tween.set($alert, {
            opacity: 0,
            display: 'none',
            y: 20,
        });
        tween.to($alert, {
            opacity: 1,
            duration: 0.5,
            display: 'block',
            y: 0,
            force3D: true,
        });
    }

    // set cookie after confirmation
    function setConfirmed() {
        let exdate = new Date();
        exdate.setDate(exdate.getDate() + expiration);
        exdate = exdate.toUTCString();
        document.cookie = `${confirmedCookieName}=yes;expires=${exdate};path=/`;
    }

    // Update cookie alert language
    function updateCookieAlertLanguage() {
        const $text = $alert.find('.nk-cookie-alert-text');
        const $confirmBtn = $alert.find('.nk-cookie-alert-confirm');
        const lang = getCurrentLang();
        
        if (lang === 'en') {
            $text.html('Cookie alert are ready to use. You can simply change content inside this alert or disable it in javascript theme options. <a href="#">Cookies policy</a>.');
            $confirmBtn.text('Confirm');
        } else {
            $text.html('تنبيه ملفات تعريف الارتباط جاهز للاستخدام. يمكنك ببساطة تغيير المحتوى داخل هذا التنبيه أو تعطيله في خيارات المظهر. <a href="#">سياسة ملفات تعريف الارتباط</a>.');
            $confirmBtn.text('تأكيد');
        }
    }

    // Listen for language changes (both jQuery and native events)
    $wnd.on('languageChanged', () => {
        updateCookieAlertLanguage();
    });
    
    // Also listen for native window event
    window.addEventListener('languageChanged', () => {
        updateCookieAlertLanguage();
    });

    $wnd.on('load', () => {
        setTimeout(showAlert, showTimeout);
    });
    $alert.on('click', '.nk-cookie-alert-confirm', () => {
        hideAlert();
        setConfirmed();
    });
    $alert.on('click', '.nk-cookie-alert-close', hideAlert);
}

export { initCookieAlert };
