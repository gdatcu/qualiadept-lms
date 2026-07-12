import { defineConfig } from 'vitepress'

export default defineConfig({
  locales: {
    root: {
      label: 'Română',
      lang: 'ro',
      link: '/ro/',
      title: "QualiAdept LMS",
      description: "Platforma oficială de cursuri QA",
      themeConfig: {
        nav: [
          { text: 'Acasă', link: '/ro/' },
          { text: 'Curriculum', link: '/ro/sessions/syllabus' },
          { text: 'Suport', link: 'mailto:contact@qualiadept.ro' },
          { text: '🔐 Autentificare', link: '/ro/auth' }
        ],
        sidebar: [
          {
            text: '📖 Introducere',
            items: [{ text: 'Syllabus Curs', link: '/ro/sessions/syllabus' }]
          },
          {
            text: '🚀 Module de Studiu',
            items: [
              { text: 'Sesiunea 1: Fundamentele Calității', link: '/ro/sessions/session-1' },
              { text: '🔒 Curs TS (Premium)', link: '/ro/sessions/premium/curs-ts' }
            ]
          }
        ],
        footer: {
          message: 'Creat cu pasiune pentru excelență.',
          copyright: '© 2026 QualiAdept. Toate drepturile rezervate.'
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      title: "QualiAdept LMS",
      description: "Official QA training platform",
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Curriculum', link: '/en/sessions/syllabus' },
          { text: 'Support', link: 'mailto:contact@qualiadept.ro' },
          { text: '🔐 Login', link: '/en/auth' }
        ],
        sidebar: [
          {
            text: '📖 Introduction',
            items: [{ text: 'Syllabus', link: '/en/sessions/syllabus' }]
          },
          {
            text: '🚀 Study Modules',
            items: [
              { text: 'Session 1: QA Fundamentals', link: '/en/sessions/session-1' },
              { text: '🔒 TS Course (Premium)', link: '/en/sessions/premium/curs-ts' }
            ]
          }
        ],
        footer: {
          message: 'Created with passion for excellence.',
          copyright: '© 2026 QualiAdept. All rights reserved.'
        }
      }
    }
  },

  themeConfig: {
    logo: '/logo.png',
    search: { provider: 'local' }, // VitePress va gestiona automat traducerile căutării
    outline: { level: [2, 3], label: 'În această sesiune / In this session' },
    docFooter: { prev: 'Înapoi / Back', next: 'Înainte / Next' },
  }
})