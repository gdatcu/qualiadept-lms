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
              { text: 'IT-ul pe Înțelesul Tuturor', link: '/ro/sessions/it-made-easy/syllabus' },
              { text: 'Masterclass QA Manual', link: '/ro/sessions/masterclass-qa-manual/syllabus' },
              { text: 'AI Automation (n8n & RAG)', link: '/ro/sessions/n8n-openai-rag/syllabus' },
              { text: 'TS Premium 🔒', link: '/ro/sessions/premium/curs-ts' },
              { text: 'Seminar Selenide vs Selenium', link: '/ro/sessions/seminar-selenium-webdriver-vs-selenide/seminar' }
            ]
          },
          { text: 'Suport', link: 'mailto:george@qualiadept.ro' },
          { text: 'Autentificare', link: '/ro/auth' }
        ],
        sidebar: {
          '/ro/sessions/it-made-easy/': [
            {
              text: 'Introducere',
              items: [{ text: 'Syllabus Curs', link: '/ro/sessions/it-made-easy/syllabus' }]
            },
            {
              text: 'Modulul 1: Hardware',
              items: [
                { text: 'Sesiunea 1: Procesorul (CPU) - Arhitectură și Execuție', link: '/ro/sessions/it-made-easy/session-1' },
                { text: 'Sesiunea 2: Ierarhia Memoriei și Magistralele', link: '/ro/sessions/it-made-easy/session-2' }
              ]
            },
            {
              text: 'Modulul 2: Logică Digitală și Software de Bază',
              items: [
                { text: 'Sesiunea 3: Universul Binar și Porțile Logice', link: '/ro/sessions/it-made-easy/session-3' },
                { text: 'Sesiunea 4: Sistemul de Operare - Managementul Caosului', link: '/ro/sessions/it-made-easy/session-4' }
              ]
            },
            {
              text: 'Modulul 3: De la Cod la Imagine',
              items: [
                { text: 'Sesiunea 5: Limbaje de Programare, Compilare și Execuție', link: '/ro/sessions/it-made-easy/session-5' },
                { text: 'Sesiunea 6: Grafică, Periferice și Interfață', link: '/ro/sessions/it-made-easy/session-6' }
              ]
            },
            {
              text: 'Modulul 4: Lumea Interconectată & Tehnologii Moderne',
              items: [
                { text: 'Sesiunea 7: Rețele, Internet și Protocoale', link: '/ro/sessions/it-made-easy/session-7' },
                { text: 'Sesiunea 8: Cloud, Criptografie și Inteligență Artificială', link: '/ro/sessions/it-made-easy/session-8' }
              ]
            }
          ],
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
                { text: 'Sesiunea 1: Fundamentele Calității', link: '/ro/sessions/masterclass-qa-manual/session-1' },
                { text: 'Sesiunea 1.2: Cele 7 Principii (Studiu Individual)', link: '/ro/sessions/masterclass-qa-manual/session-1-2' },
                { text: 'Sesiunea 2: Planificarea Testării', link: '/ro/sessions/masterclass-qa-manual/session-2' },
                { text: 'Sesiunea 3: Testarea Statică', link: '/ro/sessions/masterclass-qa-manual/session-3' },
                { text: 'Sesiunea 4: Introducere în Jira & Test Management', link: '/ro/sessions/masterclass-qa-manual/session-4' },
                { text: 'Sesiunea 5: Tehnici Blackbox (Design-ul Testelor)', link: '/ro/sessions/masterclass-qa-manual/session-5' },
                { text: 'Sesiunea 6: Practică Jira & Zephyr (Partea 1)', link: '/ro/sessions/masterclass-qa-manual/session-6' },
                { text: 'Sesiunea 7: Introducere în Whitebox Testing', link: '/ro/sessions/masterclass-qa-manual/session-7' },
                { text: 'Sesiunea 8: Practică Jira & Zephyr (Partea 2)', link: '/ro/sessions/masterclass-qa-manual/session-8' },
                { text: 'Sesiunea 9: GUI Testing (Interfața Grafică)', link: '/ro/sessions/masterclass-qa-manual/session-9' },
                { text: 'Sesiunea 10: Bazele API Testing & Postman', link: '/ro/sessions/masterclass-qa-manual/session-10' },
                { text: 'Sesiunea 11: Testare Avansată în Postman (Partea 1)', link: '/ro/sessions/masterclass-qa-manual/session-11' },
                { text: 'Sesiunea 12: Testare Avansată în Postman (Partea 2)', link: '/ro/sessions/masterclass-qa-manual/session-12' },
                { text: 'Sesiunea 13: Rulare Colecții cu Newman', link: '/ro/sessions/masterclass-qa-manual/session-13' },
                { text: 'Sesiunea 14: Teoria Bazelor de Date Relaționale', link: '/ro/sessions/masterclass-qa-manual/session-14' },
                { text: 'Sesiunea 15: Practică DDL (Data Definition Language)', link: '/ro/sessions/masterclass-qa-manual/session-15' },
                { text: 'Sesiunea 16: Practică DML (Data Manipulation Language)', link: '/ro/sessions/masterclass-qa-manual/session-16' },
                { text: 'Sesiunea 17: Practică DQL (Data Query Language)', link: '/ro/sessions/masterclass-qa-manual/session-17' },
                { text: 'Sesiunea 18: Pregătire ISTQB Foundation Level (Partea 1)', link: '/ro/sessions/masterclass-qa-manual/session-18' },
                { text: 'Sesiunea 19: Pregătire ISTQB Foundation Level (Partea 2)', link: '/ro/sessions/masterclass-qa-manual/session-19' },
                { text: 'Sesiunea 20: Proiect Final (Partea 1)', link: '/ro/sessions/masterclass-qa-manual/session-20' },
                { text: 'Sesiunea 21: Proiect Final (Partea 2)', link: '/ro/sessions/masterclass-qa-manual/session-21' },
                { text: 'Sesiunea 22: Prezentare Proiect Final & Absolvire', link: '/ro/sessions/masterclass-qa-manual/session-22' }
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
          ],
          '/ro/sessions/seminar-selenium-webdriver-vs-selenide/': [
            {
              text: 'Ghid Seminar',
              items: [
                { text: 'Selenide vs. Selenium WebDriver', link: '/ro/sessions/seminar-selenium-webdriver-vs-selenide/seminar' }
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
              { text: 'IT Made Easy for Everyone', link: '/en/sessions/it-made-easy/syllabus' },
              { text: 'Masterclass QA Manual', link: '/en/sessions/masterclass-qa-manual/syllabus' },
              { text: 'AI Automation (n8n & RAG)', link: '/en/sessions/n8n-openai-rag/syllabus' },
              { text: 'TS Premium 🔒', link: '/en/sessions/premium/curs-ts' },
              { text: 'Seminar Selenide vs Selenium', link: '/en/sessions/seminar-selenium-webdriver-vs-selenide/seminar' }
            ]
          },
          { text: 'Support', link: 'mailto:[EMAIL_ADDRESS]' },
          { text: 'Login', link: '/en/auth' }
        ],
        sidebar: {
          '/en/sessions/it-made-easy/': [
            {
              text: 'Introduction',
              items: [{ text: 'Syllabus', link: '/en/sessions/it-made-easy/syllabus' }]
            },
            {
              text: 'Module 1: Hardware',
              items: [
                { text: 'Session 1: The Processor (CPU) - Architecture and Execution', link: '/en/sessions/it-made-easy/session-1' },
                { text: 'Session 2: Memory Hierarchy and Buses', link: '/en/sessions/it-made-easy/session-2' }
              ]
            },
            {
              text: 'Module 2: Digital Logic and Basic Software',
              items: [
                { text: 'Session 3: The Binary Universe and Logic Gates', link: '/en/sessions/it-made-easy/session-3' },
                { text: 'Session 4: The Operating System - Chaos Management', link: '/en/sessions/it-made-easy/session-4' }
              ]
            },
            {
              text: 'Module 3: From Code to Image',
              items: [
                { text: 'Session 5: Programming Languages, Compilation and Execution', link: '/en/sessions/it-made-easy/session-5' },
                { text: 'Session 6: Graphics, Peripherals and Interface', link: '/en/sessions/it-made-easy/session-6' }
              ]
            },
            {
              text: 'Module 4: Interconnected World & Modern Tech',
              items: [
                { text: 'Session 7: Networks, Internet and Protocols', link: '/en/sessions/it-made-easy/session-7' },
                { text: 'Session 8: Cloud, Cryptography and Artificial Intelligence', link: '/en/sessions/it-made-easy/session-8' }
              ]
            }
          ],
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
                { text: 'Session 1: QA Fundamentals', link: '/en/sessions/masterclass-qa-manual/session-1' },
                { text: 'Session 1.2: The 7 Principles (Individual Study)', link: '/en/sessions/masterclass-qa-manual/session-1-2' },
                { text: 'Session 2: Test Planning', link: '/en/sessions/masterclass-qa-manual/session-2' },
                { text: 'Session 3: Static Testing', link: '/en/sessions/masterclass-qa-manual/session-3' },
                { text: 'Session 4: Introduction to Jira & Test Management', link: '/en/sessions/masterclass-qa-manual/session-4' },
                { text: 'Session 5: Blackbox Techniques (Test Design)', link: '/en/sessions/masterclass-qa-manual/session-5' },
                { text: 'Session 6: Jira & Zephyr Practice (Part 1)', link: '/en/sessions/masterclass-qa-manual/session-6' },
                { text: 'Session 7: Introduction to Whitebox Testing', link: '/en/sessions/masterclass-qa-manual/session-7' },
                { text: 'Session 8: Jira & Zephyr Practice (Part 2)', link: '/en/sessions/masterclass-qa-manual/session-8' },
                { text: 'Session 9: GUI Testing (Graphical Interface)', link: '/en/sessions/masterclass-qa-manual/session-9' },
                { text: 'Session 10: API Testing & Postman Basics', link: '/en/sessions/masterclass-qa-manual/session-10' },
                { text: 'Session 11: Advanced Testing in Postman (Part 1)', link: '/en/sessions/masterclass-qa-manual/session-11' },
                { text: 'Session 12: Advanced Testing in Postman (Part 2)', link: '/en/sessions/masterclass-qa-manual/session-12' },
                { text: 'Session 13: Running Collections with Newman', link: '/en/sessions/masterclass-qa-manual/session-13' },
                { text: 'Session 14: Relational Database Theory', link: '/en/sessions/masterclass-qa-manual/session-14' },
                { text: 'Session 15: DDL (Data Definition Language) Practice', link: '/en/sessions/masterclass-qa-manual/session-15' },
                { text: 'Session 16: DML (Data Manipulation Language) Practice', link: '/en/sessions/masterclass-qa-manual/session-16' },
                { text: 'Session 17: DQL (Data Query Language) Practice', link: '/en/sessions/masterclass-qa-manual/session-17' },
                { text: 'Session 18: ISTQB Foundation Level Prep (Part 1)', link: '/en/sessions/masterclass-qa-manual/session-18' },
                { text: 'Session 19: ISTQB Foundation Level Prep (Part 2)', link: '/en/sessions/masterclass-qa-manual/session-19' },
                { text: 'Session 20: Final Project (Part 1)', link: '/en/sessions/masterclass-qa-manual/session-20' },
                { text: 'Session 21: Final Project (Part 2)', link: '/en/sessions/masterclass-qa-manual/session-21' },
                { text: 'Session 22: Final Project Presentation & Q&A', link: '/en/sessions/masterclass-qa-manual/session-22' }
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
          ],
          '/en/sessions/seminar-selenium-webdriver-vs-selenide/': [
            {
              text: 'Seminar Guide',
              items: [
                { text: 'Selenide vs. Selenium WebDriver', link: '/en/sessions/seminar-selenium-webdriver-vs-selenide/seminar' }
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