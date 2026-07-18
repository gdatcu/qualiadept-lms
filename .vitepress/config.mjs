import { defineConfig } from 'vitepress'

export default defineConfig({
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }]
  ],
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
          {
            text: 'Cursuri',
            items: [
              { text: 'Masterclass QA Manual', link: '/ro/sessions/masterclass-qa-manual/syllabus' },
              { text: 'AI Automation (n8n & RAG)', link: '/ro/sessions/n8n-openai-rag/syllabus' },
              { text: 'TS Premium 🔒', link: '/ro/sessions/premium/curs-ts' }
            ]
          },
          { text: 'Suport', link: 'mailto:george@qualiadept.ro' },
          { text: 'Autentificare', link: '/ro/auth' }
        ],
        sidebar: {
          '/ro/sessions/n8n-openai-rag/': [
            {
              text: 'AI Automation',
              items: [{ text: 'Syllabus Curs', link: '/ro/sessions/n8n-openai-rag/syllabus' }]
            },
            {
              text: 'Module de Studiu',
              items: [
                { text: 'Sesiunea 1: Introducere în n8n', link: '/ro/sessions/n8n-openai-rag/session-1' },
                { text: 'Sesiunea 2: Integrarea API-urilor OpenAI în n8n', link: '/ro/sessions/n8n-openai-rag/session-2' },
                { text: 'Sesiunea 3: Bazele Vectoriale și Embeddings', link: '/ro/sessions/n8n-openai-rag/session-3' },
                { text: 'Sesiunea 4: Construirea Agentului AI Autonom (Arhitectura RAG)', link: '/ro/sessions/n8n-openai-rag/session-4' },
                { text: 'Sesiunea 5: Notificări, Alerte și Proiectul Capstone', link: '/ro/sessions/n8n-openai-rag/session-5' },
                { text: 'Sesiunea 6: Prezentări, Code Review și Scalare', link: '/ro/sessions/n8n-openai-rag/session-6' }
              ]
            }
          ],
          '/ro/sessions/masterclass-qa-manual/': [
            {
              text: 'Introducere',
              items: [{ text: 'Syllabus Curs', link: '/ro/sessions/masterclass-qa-manual/syllabus' }]
            },
            {
              text: 'Module de Studiu',
              items: [
                { text: 'Sesiunea 1: Fundamentele Calității', link: '/ro/sessions/masterclass-qa-manual/session-1' }
              ]
            }
          ],
          '/ro/sessions/premium/': [
            {
              text: 'Cursuri Premium',
              items: [
                { text: 'Curs TS', link: '/ro/sessions/premium/curs-ts' }
              ]
            }
          ]
        },
        footer: {
          message: 'Educație creată cu pasiune pentru excelență.',
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
          {
            text: 'Courses',
            items: [
              { text: 'Masterclass QA Manual', link: '/en/sessions/masterclass-qa-manual/syllabus' },
              { text: 'AI Automation (n8n & RAG)', link: '/en/sessions/n8n-openai-rag/syllabus' },
              { text: 'TS Premium 🔒', link: '/en/sessions/premium/curs-ts' }
            ]
          },
          { text: 'Support', link: 'mailto:[EMAIL_ADDRESS]' },
          { text: 'Login', link: '/en/auth' }
        ],
        sidebar: {
          '/en/sessions/n8n-openai-rag/': [
            {
              text: 'AI Automation',
              items: [{ text: 'Syllabus', link: '/en/sessions/n8n-openai-rag/syllabus' }]
            },
            {
              text: 'Study Modules',
              items: [
                { text: 'Session 1: Introduction to n8n', link: '/en/sessions/n8n-openai-rag/session-1' },
                { text: 'Session 2: Integrating OpenAI APIs into n8n', link: '/en/sessions/n8n-openai-rag/session-2' },
                { text: 'Session 3: Vector Basis and Embeddings', link: '/en/sessions/n8n-openai-rag/session-3' },
                { text: 'Session 4: Building the Autonomous AI Agent (RAG Architecture)', link: '/en/sessions/n8n-openai-rag/session-4' },
                { text: 'Session 5: Notifications, Alerts, and the Capstone Project', link: '/en/sessions/n8n-openai-rag/session-5' },
                { text: 'Session 6: Presentations, Code Review and Scaling', link: '/en/sessions/n8n-openai-rag/session-6' }
              ]
            }
          ],
          '/en/sessions/masterclass-qa-manual/': [
            {
              text: 'Introduction',
              items: [{ text: 'Syllabus', link: '/en/sessions/masterclass-qa-manual/syllabus' }]
            },
            {
              text: 'Study Modules',
              items: [
                { text: 'Session 1: QA Fundamentals', link: '/en/sessions/masterclass-qa-manual/session-1' }
              ]
            }
          ],
          '/en/sessions/premium/': [
            {
              text: 'Premium Courses',
              items: [
                { text: 'TS Course', link: '/en/sessions/premium/curs-ts' }
              ]
            }
          ]
        },
        footer: {
          message: 'Education created with passion for excellence.',
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