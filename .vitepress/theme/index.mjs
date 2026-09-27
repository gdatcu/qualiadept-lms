import DefaultTheme from 'vitepress/theme'
import { inBrowser, useRoute } from 'vitepress'
import createKindeClient from '@kinde-oss/kinde-auth-pkce-js'
import { onMounted, watch, nextTick } from 'vue'
import mediumZoom from 'medium-zoom'
import { parseJwt, extractAllowedCourses, showToast, updateAuthUI, handleRouteGuard, updateTranslationLinks, getMappedArticleRoute, getCorrectLanguageSwitchRoute, normalizePath, ARTICLE_LOCALE_MAP } from './utils.mjs'
import ArticleInteractions from './components/ArticleInteractions.vue'
import ArticlesHub from './components/ArticlesHub.vue'
import './custom.css'

export { parseJwt, extractAllowedCourses, showToast, updateAuthUI, handleRouteGuard, updateTranslationLinks, getMappedArticleRoute, getCorrectLanguageSwitchRoute, normalizePath, ARTICLE_LOCALE_MAP }


export default {
    extends: DefaultTheme,

    setup() {
        const route = useRoute()
        const initZoom = () => {
            mediumZoom('.vp-doc img:not(.medium-zoom-image)', { background: 'var(--vp-c-bg)' })
        }
        onMounted(() => {
            initZoom()
            if (inBrowser) {
                const mapped = getMappedArticleRoute(window.location.pathname)
                if (mapped && normalizePath(window.location.pathname) !== normalizePath(mapped)) {
                    window.location.replace(mapped)
                }
                updateTranslationLinks({ pathname: window.location.pathname, doc: document })
            }
        })
        watch(
            () => route.path,
            () => nextTick(() => {
                initZoom()
                if (inBrowser) {
                    updateTranslationLinks({ pathname: window.location.pathname, doc: document })
                }
            })
        )
    },

    async enhanceApp({ app, router }) {
        app.component('ArticleInteractions', ArticleInteractions)
        app.component('ArticlesHub', ArticlesHub)

        if (inBrowser) {
            // Intercept clicks on translation switcher in capture phase for instant, smooth mapping
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a')
                if (!link) return
                const href = link.getAttribute('href')
                if (!href) return

                const mapped = getCorrectLanguageSwitchRoute(window.location.pathname, href)
                if (mapped) {
                    e.preventDefault()
                    e.stopPropagation()
                    if (router?.go) {
                        router.go(mapped)
                    } else {
                        window.location.href = mapped
                    }
                }
            }, true)

            try {
                const kinde = await createKindeClient({
                    client_id: 'c101f3ba9cc843a9b65b250e146b995e',
                    domain: 'https://qualiadeptlms.kinde.com',
                    redirect_uri: window.location.origin
                })

                const isAuth = await kinde.isAuthenticated()
                const user = isAuth ? await kinde.getUser() : null

                if (user) {
                    sessionStorage.setItem('qualiadept_user', JSON.stringify({
                        name: user.name || user.given_name || user.email,
                        email: user.email,
                        picture: user.picture
                    }))
                } else {
                    sessionStorage.removeItem('qualiadept_user')
                }

                let cursuriPermise = ''

                if (isAuth) {
                    try {
                        const rawIdToken = await kinde.getIdToken()
                        const decoded = parseJwt(rawIdToken)
                        cursuriPermise = extractAllowedCourses(decoded)
                    } catch (e) {
                        console.error("Eroare la citire proprietăți:", e)
                    }
                }

                const applyUI = () => {
                    updateAuthUI({
                        isAuth,
                        user,
                        cursuriPermise,
                        pathname: window.location.pathname,
                        doc: document
                    })
                    updateTranslationLinks({
                        pathname: window.location.pathname,
                        doc: document
                    })
                }

                setTimeout(applyUI, 100)
                router.onAfterRouteChanged = () => setTimeout(applyUI, 100)

                router.onBeforeRouteChange = async (to) => {
                    return await handleRouteGuard({
                        to,
                        isAuth,
                        cursuriPermise,
                        pathname: window.location.pathname,
                        kindeClient: kinde,
                        showToastFn: showToast,
                        router
                    })
                }
            } catch (error) {
                console.error("Eroare la paznicul Kinde:", error)
            }
        }
    }
}