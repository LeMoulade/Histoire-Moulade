---
title: Accueil
---

# 🏛️ Histoire-Moulade

Encyclopédie historique et culturelle par Moulade.  


---



<button id="random-page-btn">
  🎲 Tirer un article au hasard
</button>



## 🗺️ Pays

- [[Angleterre/]]
- [[Christianisme/]]
- [[Egypte/]]
- [[Etats-Unis/]]
- [[Grèce/]]
- [[Iran/]]
- [[Japon/]]
- [[Liban/]]
- [[Macédoine/]]
- [[Palestine/]]
- [[Russie/]]
- [[Turquie/]]




## ✈️ Aviation

- [[Aviation/]]






<script>
  // ⤵️ Liste des préfixes/dossiers à exclure du tirage
  const EXCLUDED_PREFIXES = [
    "static/",      // fichiers techniques
    "tags/",        // pages de tag
    "_Templates",     // ton dossier template
    "_Medias",        // ton dossier media
    "_MediaUsed",        // ton dossier media
  ]

  // ⤵️ Slugs exacts à exclure si tu veux (home, page techniques, etc.)
  const EXCLUDED_SLUGS = new Set([
    "index",               // page d'accueil elle-même
  ])

  function isAllowedSlug(slug, details) {
    if (!slug) return false
    if (EXCLUDED_SLUGS.has(slug)) return false

    // Exclure certains dossiers/prefixes
    for (const prefix of EXCLUDED_PREFIXES) {
      if (slug === prefix || slug.startsWith(prefix) || slug.includes("/" + prefix)) {
        return false
      }
    }

    // Tu peux ajouter ici d'autres règles selon tes tags, par ex. :
    // if (details.tags && details.tags.includes("meta")) return false

    return true
  }

  async function pickRandomSlug() {
    try {
      // fetchData est défini par Quartz dans renderPage.tsx
      // il fait: fetch("<base>/static/contentIndex.json").then(res => res.json())
      const contentIndex = await window.fetchData

      const allEntries = Object.entries(contentIndex)
        .filter(([slug, details]) => isAllowedSlug(slug, details))

      if (allEntries.length === 0) {
        console.warn("Aucune page éligible trouvée dans contentIndex.json.")
        return null
      }

      const randomIndex = Math.floor(Math.random() * allEntries.length)
      const [slug] = allEntries[randomIndex]

      return slug
    } catch (e) {
      console.error("Erreur lors du chargement de contentIndex.json :", e)
      return null
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("random-page-btn")
    if (!btn || typeof window.fetchData === "undefined") {
      console.warn("Bouton aléatoire ou fetchData indisponible.")
      return
    }

    btn.addEventListener("click", async () => {
      const slug = await pickRandomSlug()
      if (!slug) return

      // Construire l'URL en respectant le sous-dossier (GitHub Pages, etc.)
      const targetUrl = new URL(slug, window.location.href)

      if (typeof window.spaNavigate === "function") {
        // Navigation SPA (comportement Quartz normal)
        window.spaNavigate(targetUrl)
      } else {
        // Fallback : navigation classique
        window.location.href = targetUrl.toString()
      }
    })
  })
</script>