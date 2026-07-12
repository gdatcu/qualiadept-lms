import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "QualiAdept LMS",
  description: "Platforma oficială de cursuri QA",
  lang: 'ro-RO', // Setează limba site-ului pentru SEO și accesibilitate

  themeConfig: {
    logo: '/logo.png', // Logo-ul care va apărea sus în stânga

    // 🔍 Activează bara de căutare (Super utilă pentru studenți!)
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Caută în curs...',
                buttonAriaLabel: 'Caută în curs'
              },
              modal: {
                noResultsText: 'Nu am găsit rezultate pentru',
                resetButtonTitle: 'Șterge criteriile de căutare',
                footer: {
                  selectText: 'pentru a selecta',
                  navigateText: 'pentru a naviga',
                  closeText: 'pentru a închide'
                }
              }
            }
          }
        }
      }
    },

    // 🧭 Meniul de sus
    nav: [
      { text: 'Acasă', link: '/' },
      { text: 'Curriculum', link: '/sessions/syllabus' },
      { text: 'Suport', link: 'mailto:contact@qualiadept.ro' } // Link direct către email-ul tău
    ],

    // 📚 Meniul din stânga (Sidebar) organizat pe categorii
    sidebar: [
      {
        text: '📖 Introducere',
        collapsed: false, // Poți face categoriile să se restrângă (true/false)
        items: [
          { text: 'Syllabus Curs', link: '/sessions/syllabus' }
        ]
      },
      {
        text: '🚀 Module de Studiu',
        collapsed: false,
        items: [
          { text: 'Sesiunea 1: Fundamentele Calității', link: '/sessions/session-1' }
          // Aici vei adăuga Sesiunea 2, 3 etc. pe măsură ce avansezi
        ]
      }
    ],

    // 🏷️ Setări pentru cuprinsul generat automat (în dreapta)
    outline: {
      level: [2, 3], // Preia titlurile ## și ###
      label: 'În această sesiune'
    },

    // ➡️ Navigarea de la finalul paginii
    docFooter: {
      prev: 'Sesiunea anterioară',
      next: 'Sesiunea următoare'
    },

    // 👣 Subsolul paginii (Apare pe prima pagină)
    footer: {
      message: 'Creat cu pasiune pentru excelență în Software Testing.',
      copyright: '© 2026 QualiAdept. Toate drepturile rezervate.'
    }
  }
})