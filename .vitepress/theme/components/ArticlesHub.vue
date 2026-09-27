<template>
  <div class="articles-hub">
    <!-- Controls Toolbar: Search, Filters & Sorting -->
    <div class="hub-controls">
      <!-- Search Input & Sort Selector Row -->
      <div class="hub-top-row">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t.searchPlaceholder"
            class="hub-search-input"
            aria-label="Search articles"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="clear-search-btn"
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        </div>

        <div class="sort-box">
          <label for="article-sort" class="sort-label">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="6" y1="12" x2="18" y2="12"></line>
              <line x1="10" y1="18" x2="14" y2="18"></line>
            </svg>
            <span>{{ t.sortLabel }}:</span>
          </label>
          <div class="select-wrapper">
            <select
              id="article-sort"
              v-model="selectedSort"
              class="sort-select"
            >
              <option value="newest">{{ t.sortNewest }}</option>
              <option value="oldest">{{ t.sortOldest }}</option>
              <option value="readTime">{{ t.sortReadTime }}</option>
              <option value="title">{{ t.sortTitle }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tag Filter Chips -->
      <div class="tag-filters">
        <button
          type="button"
          class="tag-chip"
          :class="{ active: selectedTag === 'all' }"
          @click="selectedTag = 'all'"
        >
          {{ t.allTags }}
          <span class="chip-count">{{ currentArticles.length }}</span>
        </button>

        <button
          v-for="tag in availableTags"
          :key="tag.name"
          type="button"
          class="tag-chip"
          :class="{ active: selectedTag === tag.name }"
          @click="selectedTag = tag.name"
        >
          {{ tag.name }}
          <span class="chip-count">{{ tag.count }}</span>
        </button>
      </div>

      <!-- Active Filters Status Bar -->
      <div v-if="selectedTag !== 'all' || searchQuery.trim()" class="filter-status-bar">
        <span>
          {{ t.showing }} <strong>{{ filteredArticles.length }}</strong> {{ t.of }} <strong>{{ currentArticles.length }}</strong> {{ t.articles }}
        </span>
        <button @click="resetFilters" class="reset-filters-btn" type="button">
          {{ t.resetFilters }}
        </button>
      </div>
    </div>

    <!-- Articles Grid -->
    <div v-if="filteredArticles.length > 0" class="articles-grid">
      <a
        v-for="article in filteredArticles"
        :key="article.link"
        :href="article.link"
        class="article-card"
      >
        <div class="card-tags">
          <span v-for="tag in article.tags" :key="tag" class="card-tag">
            {{ tag }}
          </span>
        </div>
        <h2 class="card-title">{{ article.title }}</h2>
        <p class="card-excerpt">{{ article.excerpt }}</p>
        <div class="card-footer">
          <span>⏱️ {{ article.readTime }}</span>
          <span>📅 {{ article.displayDate }}</span>
        </div>
      </a>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-articles">
      <div class="empty-icon">🔍</div>
      <p class="empty-text">{{ t.noArticles }}</p>
      <button @click="resetFilters" class="reset-filters-btn large" type="button">
        {{ t.resetFilters }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticlesHub',
  props: {
    lang: {
      type: String,
      default: 'ro'
    }
  },
  data() {
    return {
      searchQuery: '',
      selectedTag: 'all',
      selectedSort: 'newest', // Default sort: latest articles first
      articlesRo: [
        {
          title: 'Ghidul Complet și Extins pentru Testarea QA a Modelelor LLM și AI',
          excerpt: 'Descoperă tranziția de la testarea deterministă la cea probabilistică: dimensiuni de evaluare, cadrul în 6 etape, metrici ROUGE/BLEU/Semantic Match, LLM-as-a-Judge și Red Teaming.',
          link: '/ro/articles/ghid-testare-qa-llm-ai',
          tags: ['AI & LLM', 'QA Strategy'],
          date: '2026-09-27',
          displayDate: '27 Septembrie 2026',
          readTime: '8 min lectură',
          readMinutes: 8
        },
        {
          title: 'CNP-ul din Perspectiva unui Software QA: Tot Ce Trebuie Să Știi',
          excerpt: 'Cum testăm exhaustiv un câmp de CNP: de la structura S AA LL ZZ JJ NNN C și calculul cifrei de control, la clase de echivalență, valori limită și conformitate GDPR.',
          link: '/ro/articles/cnp-din-perspectiva-qa',
          tags: ['Test Design', 'QA Fundamentals'],
          date: '2026-09-12',
          displayDate: '12 Septembrie 2026',
          readTime: '7 min lectură',
          readMinutes: 7
        },
        {
          title: 'Ghid Complet: Cum să alegi cele mai robuste selectoare în Playwright',
          excerpt: 'Descoperă filosofia locatoarelor moderne în Playwright: de ce XPath-urile lungi sunt fragile, cum să folosești getByRole, getByTestId și cum să scrii teste care rezistă la refactorizări.',
          link: '/ro/articles/ghid-selectoare-playwright',
          tags: ['Playwright', 'Bune Practici'],
          date: '2026-09-12',
          displayDate: '12 Septembrie 2026',
          readTime: '6 min lectură',
          readMinutes: 6
        }
      ],
      articlesEn: [
        {
          title: 'The Complete Guide to QA Testing for LLMs and AI',
          excerpt: 'Master the shift from deterministic to probabilistic testing: core evaluation dimensions, 6-stage testing framework, key metrics (ROUGE, BLEU, semantic match), LLM-as-a-Judge, and Red Teaming.',
          link: '/en/articles/qa-testing-for-llms-and-ai',
          tags: ['AI & LLM', 'QA Strategy'],
          date: '2026-09-27',
          displayDate: 'September 27, 2026',
          readTime: '8 min read',
          readMinutes: 8
        },
        {
          title: 'Romanian National ID (CNP) from a QA Perspective: Everything You Need to Know',
          excerpt: 'Exhaustive testing strategies for national ID fields: S YY MM DD CC NNN K structure, checksum verification, equivalence partitioning, boundary value analysis, and GDPR compliance.',
          link: '/en/articles/romanian-cnp-qa-perspective',
          tags: ['Test Design', 'QA Fundamentals'],
          date: '2026-09-12',
          displayDate: 'September 12, 2026',
          readTime: '7 min read',
          readMinutes: 7
        },
        {
          title: 'Complete Guide: Writing Resilient Selectors in Playwright',
          excerpt: 'Discover the modern locator philosophy in Playwright: why long XPaths are fragile, how to leverage getByRole, getByTestId, and how to write tests that survive UI refactoring.',
          link: '/en/articles/playwright-selector-guide',
          tags: ['Playwright', 'Best Practices'],
          date: '2026-09-12',
          displayDate: 'September 12, 2026',
          readTime: '6 min read',
          readMinutes: 6
        }
      ],
      translations: {
        ro: {
          searchPlaceholder: 'Caută articole după titlu, tag sau cuvinte cheie...',
          sortLabel: 'Sortează',
          sortNewest: 'Cele mai noi (Implicit)',
          sortOldest: 'Cele mai vechi',
          sortReadTime: 'Timp de lectură',
          sortTitle: 'Titlu (A-Z)',
          allTags: 'Toate',
          showing: 'Afișare',
          of: 'din',
          articles: 'articole',
          resetFilters: 'Resetează filtrele',
          noArticles: 'Niciun articol nu corespunde căutării sau filtrelor selectate.'
        },
        en: {
          searchPlaceholder: 'Search articles by title, tags, or keywords...',
          sortLabel: 'Sort by',
          sortNewest: 'Newest first (Default)',
          sortOldest: 'Oldest first',
          sortReadTime: 'Reading time',
          sortTitle: 'Title (A-Z)',
          allTags: 'All',
          showing: 'Showing',
          of: 'of',
          articles: 'articles',
          resetFilters: 'Reset filters',
          noArticles: 'No articles match your search or selected filter.'
        }
      }
    }
  },
  computed: {
    isEn() {
      return this.lang === 'en'
    },
    t() {
      return this.translations[this.isEn ? 'en' : 'ro']
    },
    currentArticles() {
      return this.isEn ? this.articlesEn : this.articlesRo
    },
    availableTags() {
      const tagCounts = {}
      this.currentArticles.forEach(article => {
        article.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      })
      return Object.entries(tagCounts).map(([name, count]) => ({ name, count }))
    },
    filteredArticles() {
      let list = [...this.currentArticles]

      // Filter by Search Query
      const query = this.searchQuery.trim().toLowerCase()
      if (query) {
        list = list.filter(article => {
          const matchTitle = article.title.toLowerCase().includes(query)
          const matchExcerpt = article.excerpt.toLowerCase().includes(query)
          const matchTags = article.tags.some(t => t.toLowerCase().includes(query))
          return matchTitle || matchExcerpt || matchTags
        })
      }

      // Filter by Selected Tag
      if (this.selectedTag !== 'all') {
        list = list.filter(article => article.tags.includes(this.selectedTag))
      }

      // Sort Articles
      list.sort((a, b) => {
        if (this.selectedSort === 'newest') {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        }
        if (this.selectedSort === 'oldest') {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        }
        if (this.selectedSort === 'readTime') {
          return a.readMinutes - b.readMinutes
        }
        if (this.selectedSort === 'title') {
          return a.title.localeCompare(b.title)
        }
        return 0
      })

      return list
    }
  },
  methods: {
    resetFilters() {
      this.searchQuery = ''
      this.selectedTag = 'all'
      this.selectedSort = 'newest'
    }
  }
}
</script>

<style scoped>
.articles-hub {
  margin: 1.5rem 0 3rem 0;
}

.hub-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  background: var(--vp-c-bg-soft);
  padding: 1.25rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
}

.hub-top-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1 1 280px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.hub-search-input {
  width: 100%;
  padding: 10px 36px 10px 38px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

.hub-search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.clear-search-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.clear-search-btn:hover {
  color: var(--vp-c-text-1);
}

.sort-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.sort-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.select-wrapper {
  position: relative;
}

.sort-select {
  appearance: none;
  -webkit-appearance: none;
  padding: 8px 32px 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: all 0.2s ease;
}

.sort-select:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.tag-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.tag-chip:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.tag-chip.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
}

.chip-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 6px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  font-size: 0.72rem;
  color: inherit;
}

.tag-chip.active .chip-count {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

.filter-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  padding-top: 0.5rem;
  border-top: 1px dashed var(--vp-c-divider);
}

.reset-filters-btn {
  background: none;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-brand-1);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-filters-btn:hover {
  background: rgba(79, 70, 229, 0.1);
  border-color: var(--vp-c-brand-1);
}

.reset-filters-btn.large {
  padding: 8px 16px;
  font-size: 0.9rem;
  margin-top: 0.75rem;
}

.empty-articles {
  text-align: center;
  padding: 3.5rem 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px dashed var(--vp-c-divider);
  border-radius: 14px;
  margin: 2rem 0;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.empty-text {
  color: var(--vp-c-text-2);
  font-size: 1rem;
}
</style>
