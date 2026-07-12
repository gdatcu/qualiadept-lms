import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import createKindeClient from '@kinde-oss/kinde-auth-pkce-js'

// Funcție utilitară care "sparge" codificarea de securitate
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

                // ==========================================
                // 🕵️‍♂️ MODUL DE DEBUG (ACTIV) + EXTRAGERE CORECTĂ
                // ==========================================
                if (isAuth) {
                    console.log("==== 🟢 START INVESTIGAȚIE KINDE ====")

                    try {
                        // 1. Luăm Ecusonul crud
                        const rawIdToken = await kinde.getIdToken()

                        // 2. Îl decodăm manual
                        const decoded = parseJwt(rawIdToken)
                        console.log("1. ADEVĂRUL GOL-GOLUȚ (Token Brut):", decoded)

                        // 3. Extragem proprietatea țintind cheia "v" descoperită în log-uri!
                        if (decoded?.user_properties?.cursuri_accesibile?.v) {
                            cursuriPermise = String(decoded.user_properties.cursuri_accesibile.v).toLowerCase()
                        } else if (typeof decoded?.user_properties?.cursuri_accesibile === 'string') {
                            cursuriPermise = String(decoded.user_properties.cursuri_accesibile).toLowerCase()
                        }

                        console.log("2. Cursuri extrase direct din Ecuson:", `"${cursuriPermise}"`)
                        console.log("3. Regula: Acces permis la TS?:", cursuriPermise.includes('ts'))

                    } catch (e) {
                        console.error("Eroare la decodare sau citire proprietăți:", e)
                    }

                    console.log("==== 🔴 END INVESTIGAȚIE ====")
                }
                // ==========================================

                // --- SISTEM TOAST ---
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

                const lastState = localStorage.getItem('auth_status')
                if (isAuth && lastState !== 'logged_in') {
                    showToast('✅ Te-ai autentificat cu succes!')
                    localStorage.setItem('auth_status', 'logged_in')
                } else if (!isAuth && lastState === 'logged_in') {
                    showToast('👋 Te-ai deconectat. Pe curând!', 'info')
                    localStorage.setItem('auth_status', 'logged_out')
                }

                // --- UI MENIU ---
                const updateUI = () => {
                    const authLinks = document.querySelectorAll('a[href="/auth"], a[href="/auth.html"]')
                    authLinks.forEach(link => {
                        link.innerText = isAuth ? '🚪 Deconectare' : '🔐 Autentificare'
                    })

                    const desktopNav = document.querySelector('.VPNavBarMenu')
                    if (desktopNav && isAuth && !document.getElementById('user-badge')) {
                        const badge = document.createElement('span')
                        badge.id = 'user-badge'
                        badge.innerText = `👤 ${user?.email || 'Student'}`
                        badge.style.cssText = "margin-right: 15px; font-size: 14px; font-weight: 500; color: var(--vp-c-text-2); display: flex; align-items: center;"
                        desktopNav.insertBefore(badge, desktopNav.firstChild)
                    } else if (!isAuth) {
                        const badge = document.getElementById('user-badge')
                        if (badge) badge.remove()
                    }

                    const premiumLinks = document.querySelectorAll('.VPSidebar a[href*="/premium/"]')
                    premiumLinks.forEach(link => {
                        const href = link.getAttribute('href')
                        let hasAccess = false

                        // Regula de colorare
                        if (href.includes('curs-ts') && cursuriPermise.includes('ts')) hasAccess = true

                        if (hasAccess) {
                            link.style.opacity = '1'
                            link.style.color = 'var(--vp-c-brand-1)'
                            link.style.fontWeight = 'bold'
                            if (link.innerHTML.includes('🔒')) {
                                link.innerHTML = link.innerHTML.replace('🔒', '✅')
                            }
                        } else {
                            link.style.opacity = '0.5'
                        }
                    })
                }

                setTimeout(updateUI, 100)
                router.onAfterRouteChanged = () => setTimeout(updateUI, 100)

                // --- BARIERA DE SECURITATE ---
                if (window.location.pathname.includes('/premium/')) {
                    if (!isAuth) await kinde.login()
                }

                router.onBeforeRouteChange = async (to) => {
                    if (to.includes('/auth')) {
                        if (isAuth) await kinde.logout()
                        else await kinde.login()
                        return false
                    }

                    if (to.includes('/premium/')) {
                        if (!isAuth) {
                            await kinde.login()
                            return false
                        }

                        // Examenul de acces la navigare
                        if (to.includes('curs-ts')) {
                            if (!cursuriPermise.includes('ts')) {
                                showToast('⛔ Acces Interzis! Nu ai achiziționat acest modul.', 'error')
                                return false
                            }
                        }
                    }
                }

            } catch (error) {
                console.error("Eroare la paznicul Kinde:", error)
            }
        }
    }
}