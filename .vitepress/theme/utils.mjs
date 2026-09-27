/**
 * JWT Token Parser
 * Decodes base64 payload from JWT string safely.
 */
export function parseJwt(token) {
    if (!token || typeof token !== 'string') return null;
    try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

/**
 * Extract allowed courses string from decoded JWT
 */
export function extractAllowedCourses(decoded) {
    if (!decoded || !decoded.user_properties) return '';
    const prop = decoded.user_properties.cursuri_accesibile;
    if (prop?.v) return String(prop.v).toLowerCase();
    if (typeof prop === 'string') return String(prop).toLowerCase();
    return '';
}

/**
 * Toast Notification Utility
 */
export function showToast(message, type = 'success', timeout = 3000, targetDocument = typeof document !== 'undefined' ? document : null) {
    if (!targetDocument) return null;
    const toast = targetDocument.createElement('div');
    toast.className = 'custom-lms-toast';
    toast.innerText = message;
    const bgColor = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#6b7280');
    toast.style.cssText = `position:fixed; bottom:30px; right:30px; background-color:${bgColor}; color:white; padding:12px 24px; border-radius:8px; font-weight:600; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1); z-index:9999; transition: opacity 0.5s ease;`;
    targetDocument.body.appendChild(toast);
    
    if (timeout > 0) {
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, timeout);
    }
    return toast;
}

/**
 * Update UI Auth Elements, Navigation Badges, and Premium Link Styling
 */
export function updateAuthUI({ isAuth, user, cursuriPermise = '', pathname = '/', doc = typeof document !== 'undefined' ? document : null }) {
    if (!doc) return;
    const isEn = pathname.startsWith('/en/');

    // Bilingual Auth Links
    const authLinks = doc.querySelectorAll('a[href*="/auth"]');
    authLinks.forEach((link) => {
        link.innerText = isAuth ?
            (isEn ? 'Logout' : 'Deconectare') :
            (isEn ? 'Login' : 'Autentificare');
    });

    // Desktop Nav User Badge
    const desktopNav = doc.querySelector('.VPNavBarMenu');
    if (desktopNav && isAuth && !doc.getElementById('user-badge')) {
        const badge = doc.createElement('span');
        badge.id = 'user-badge';
        badge.innerText = `${user?.email || 'Student'}`;
        badge.style.cssText = "margin-right: 15px; font-size: 14px; font-weight: 500; color: var(--vp-c-text-2); display: flex; align-items: center;";
        desktopNav.insertBefore(badge, desktopNav.firstChild);
    }

    // Premium Links Access Styling
    const premiumLinks = doc.querySelectorAll('a[href*="/premium/"]');
    premiumLinks.forEach((link) => {
        if (cursuriPermise.includes('ts')) {
            link.style.opacity = '1';
            link.style.color = 'var(--vp-c-brand-1)';
            link.style.fontWeight = 'bold';
        } else {
            link.style.opacity = '0.5';
        }
    });
}

/**
 * Article Cross-Language Route Mapping
 */
export const ARTICLE_LOCALE_MAP = {
    // Romanian -> English
    '/ro/articles/ghid-testare-qa-llm-ai': '/en/articles/qa-testing-for-llms-and-ai',
    '/ro/articles/cnp-din-perspectiva-qa': '/en/articles/romanian-cnp-qa-perspective',
    '/ro/articles/ghid-selectoare-playwright': '/en/articles/playwright-selector-guide',

    // English -> Romanian
    '/en/articles/qa-testing-for-llms-and-ai': '/ro/articles/ghid-testare-qa-llm-ai',
    '/en/articles/romanian-cnp-qa-perspective': '/ro/articles/cnp-din-perspectiva-qa',
    '/en/articles/playwright-selector-guide': '/ro/articles/ghid-selectoare-playwright'
};

export const NAIVE_SWITCH_MAP = {
    '/en/articles/ghid-testare-qa-llm-ai': '/en/articles/qa-testing-for-llms-and-ai',
    '/en/articles/cnp-din-perspectiva-qa': '/en/articles/romanian-cnp-qa-perspective',
    '/en/articles/ghid-selectoare-playwright': '/en/articles/playwright-selector-guide',
    '/ro/articles/qa-testing-for-llms-and-ai': '/ro/articles/ghid-testare-qa-llm-ai',
    '/ro/articles/romanian-cnp-qa-perspective': '/ro/articles/cnp-din-perspectiva-qa',
    '/ro/articles/playwright-selector-guide': '/ro/articles/ghid-selectoare-playwright'
};

/**
 * Normalizes a URL path by removing search, hash, trailing slashes, and .html extension.
 */
export function normalizePath(path) {
    if (!path || typeof path !== 'string') return '';
    return path.split('?')[0].split('#')[0].replace(/\.html$/, '').replace(/\/$/, '');
}

/**
 * Determines the correct destination URL when switching languages or following naive article links.
 */
export function getCorrectLanguageSwitchRoute(currentPath, targetPath) {
    const cleanTarget = normalizePath(targetPath);
    const cleanCurrent = normalizePath(currentPath);

    if (NAIVE_SWITCH_MAP[cleanTarget]) {
        return NAIVE_SWITCH_MAP[cleanTarget];
    }

    const isLangSwitch = (cleanCurrent.startsWith('/ro/') && cleanTarget.startsWith('/en/')) ||
                         (cleanCurrent.startsWith('/en/') && cleanTarget.startsWith('/ro/'));

    if (isLangSwitch && ARTICLE_LOCALE_MAP[cleanCurrent]) {
        return ARTICLE_LOCALE_MAP[cleanCurrent];
    }

    return null;
}

/**
 * Returns the mapped target route if an article URL is a broken naive translation link.
 */
export function getMappedArticleRoute(path) {
    const clean = normalizePath(path);
    return NAIVE_SWITCH_MAP[clean] || null;
}


/**
 * Updates DOM translation switcher links to point to the exact mapped translated article.
 */
export function updateTranslationLinks({ pathname = '/', doc = typeof document !== 'undefined' ? document : null }) {
    if (!doc) return;
    const cleanPath = normalizePath(pathname);
    const targetPath = ARTICLE_LOCALE_MAP[cleanPath];
    if (!targetPath) return;

    const links = doc.querySelectorAll('a');
    links.forEach((link) => {
        const href = link.getAttribute('href');
        if (!href) return;
        const normalizedHref = normalizePath(href);

        if (cleanPath.startsWith('/ro/') && (href.startsWith('/en/') || href.includes('/en/articles/'))) {
            link.setAttribute('href', targetPath);
        } else if (cleanPath.startsWith('/en/') && (href.startsWith('/ro/') || href.includes('/ro/articles/'))) {
            link.setAttribute('href', targetPath);
        }
    });
}

/**
 * Handle Route Guard Logic
 */
export async function handleRouteGuard({ to, isAuth, cursuriPermise = '', pathname = '/', kindeClient, showToastFn = showToast, router }) {
    // Check if `to` is a language switch or mismatched article route
    const mappedRoute = getCorrectLanguageSwitchRoute(pathname, to);

    if (mappedRoute) {
        if (router?.go) {
            router.go(mappedRoute);
        } else if (typeof window !== 'undefined') {
            window.location.href = mappedRoute;
        }
        return false;
    }

    if (to.includes('/auth')) {
        if (isAuth && kindeClient?.logout) await kindeClient.logout();
        else if (!isAuth && kindeClient?.login) await kindeClient.login();
        return false;
    }

    if (to.includes('/premium/')) {
        if (!isAuth) {
            if (kindeClient?.login) await kindeClient.login();
            return false;
        }

        if (!cursuriPermise.includes('ts')) {
            const isEn = pathname.startsWith('/en/');
            showToastFn(isEn ? 'Access Denied! Module not purchased.' : 'Acces Interzis! Nu ai achiziționat acest modul.', 'error');
            return false;
        }
    }

    return true;
}

