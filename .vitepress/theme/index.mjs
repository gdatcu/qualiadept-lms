import DefaultTheme from 'vitepress/theme'
import { inBrowser, useRoute } from 'vitepress'
import createKindeClient from '@kinde-oss/kinde-auth-pkce-js'
import { onMounted, watch, nextTick } from 'vue'
import mediumZoom from 'medium-zoom'
import { parseJwt, extractAllowedCourses, showToast, updateAuthUI, handleRouteGuard } from './utils.mjs'
import './custom.css'

export { parseJwt, extractAllowedCourses, showToast, updateAuthUI, handleRouteGuard }

export default {
    extends: DefaultTheme,

    setup() {
        const route = useRoute()
        const initZoom = () => {
            mediumZoom('.vp-doc img:not(.medium-zoom-image)', { background: 'var(--vp-c-bg)' })
        }
        onMounted(() => {
            initZoom()
        })
        watch(
            () => route.path,
            () => nextTick(() => initZoom())
        )
    },

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
                        showToastFn: showToast
                    })
                }
            } catch (error) {
                console.error("Eroare la paznicul Kinde:", error)
            }
        }
    }
}