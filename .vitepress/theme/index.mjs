import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import createKindeClient from '@kinde-oss/kinde-auth-pkce-js'

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

export default {
    extends: DefaultTheme,

    async enhanceApp({ router }) {
        if (inBrowser) {
            try {
                const kinde = await createKindeClient({
                    client_id: 'c101f3ba9cc843a9b65b250e146b995e',
                    domain: 'https://qualiadeptlms.kinde.com',
                    redirect_uri: window.location.origin
                })

                const isAuth = await kinde.isAuthenticated()
                const user = isAuth ? await kinde.getUser() : null

                let cursuriPermise = ''

                if (isAuth) {
                    try {
                        const rawIdToken = await kinde.getIdToken()
                        const decoded = parseJwt(rawIdToken)

                        if (decoded?.user_properties?.cursuri_accesibile?.v) {
                            cursuriPermise = String(decoded.user_properties.cursuri_accesibile.v).toLowerCase()
                        } else if (typeof decoded?.user_properties?.cursuri_accesibile === 'string') {
                            cursuriPermise = String(decoded.user_properties.cursuri_accesibile).toLowerCase()
                        }
                    } catch (e) {
                        console.error("Eroare la citire proprietăți:", e)
                    }
                }

                const showToast = (message, type = 'success') => {
                    const toast = document.createElement('div')
                    toast.innerText = message
                    const bgColor = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#6b7280')
                    toast.style.cssText = `position:fixed; bottom:30px; right:30px; background-color:${bgColor}; color:white; padding:12px 24px; border-radius:8px; font-weight:600; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1); z-index:9999; transition: opacity 0.5s ease;`
                    document.body.appendChild(toast)
                    setTimeout(() => {
                        toast.style.opacity = '0'
                        setTimeout(() => toast.remove(), 500)
                    }, 3000)
                }

                const updateUI = () => {
                    const isEn = window.location.pathname.startsWith('/en/');

                    // Butoane Auth bilingve
                    const authLinks = document.querySelectorAll('a[href*="/auth"]');
                    authLinks.forEach(link => {
                        link.innerText = isAuth ?
                            (isEn ? '🚪 Logout' : '🚪 Deconectare') :
                            (isEn ? '🔐 Login' : '🔐 Autentificare');
                    });

                    const desktopNav = document.querySelector('.VPNavBarMenu')
                    if (desktopNav && isAuth && !document.getElementById('user-badge')) {
                        const badge = document.createElement('span')
                        badge.id = 'user-badge'
                        badge.innerText = `👤 ${user?.email || 'Student'}`
                        badge.style.cssText = "margin-right: 15px; font-size: 14px; font-weight: 500; color: var(--vp-c-text-2); display: flex; align-items: center;"
                        desktopNav.insertBefore(badge, desktopNav.firstChild)
                    }

                    const premiumLinks = document.querySelectorAll('.VPSidebar a[href*="/premium/"]')
                    premiumLinks.forEach(link => {
                        const href = link.getAttribute('href')
                        if (href.includes('curs-ts') && cursuriPermise.includes('ts')) {
                            link.style.opacity = '1'
                            link.style.color = 'var(--vp-c-brand-1)'
                            link.style.fontWeight = 'bold'
                            if (link.innerHTML.includes('🔒')) link.innerHTML = link.innerHTML.replace('🔒', '✅')
                        } else {
                            link.style.opacity = '0.5'
                        }
                    })
                }

                setTimeout(updateUI, 100)
                router.onAfterRouteChanged = () => setTimeout(updateUI, 100)

                router.onBeforeRouteChange = async (to) => {
                    if (to.includes('/auth')) {
                        if (isAuth) await kinde.logout()
                        else await kinde.login()
                        return false
                    }

                    if (to.includes('/premium/')) {
                        if (!isAuth) { await kinde.login(); return false }

                        if (to.includes('curs-ts') && !cursuriPermise.includes('ts')) {
                            const isEn = window.location.pathname.startsWith('/en/');
                            showToast(isEn ? '⛔ Access Denied! Module not purchased.' : '⛔ Acces Interzis! Nu ai achiziționat acest modul.', 'error')
                            return false
                        }
                    }
                }
            } catch (error) {
                console.error("Eroare la paznicul Kinde:", error)
            }
        }
    }
}