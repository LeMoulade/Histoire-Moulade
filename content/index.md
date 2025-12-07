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
  // Préfixes / dossiers à exclure du tirage
  const EXCLUDED_PREFIXES = [
    "tags/",       // pages de tag
    "static/",     // ressources techniques
    "template",    // ton dossier template
    "media",       // ton dossier media
  ];

  // Slugs exacts à exclure (home, etc.)
  const EXCLUDED_SLUGS = new Set([
    "index",       // page d'accueil elle-même
  ]);

  function isAllowedSlug(slug, details) {
    if (!slug) return false;
    if (EXCLUDED_SLUGS.has(slug)) return false;

    for (const prefix of EXCLUDED_PREFIXES) {
      if (
        slug === prefix ||
        slug.startsWith(prefix) ||
        slug.includes("/" + prefix)
      ) {
        return false;
      }
    }

    // Exemple : exclure les pages marquées comme "meta" dans les tags
    // if (details.tags && details.tags.includes("meta")) return false;

    return true;
  }

  async function pickRandomSlug() {
    try {
      // ⚠️ Dans Quartz v4, fetchData est un Promise<ContentIndex>,
      // pas une fonction, donc on fait simplement :
      const contentIndex = await fetchData;

      const allEntries = Object.entries(contentIndex).filter(
        ([slug, details]) => isAllowedSlug(slug, details)
      );

      if (allEntries.length === 0) {
        console.warn("Aucune page éligible trouvée dans contentIndex.");
        return null;
      }

      const randomIndex = Math.floor(Math.random() * allEntries.length);
      const [slug] = allEntries[randomIndex];

      return slug;
    } catch (e) {
      console.error("Erreur lors du chargement de contentIndex :", e);
      return null;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("random-page-btn");
    if (!btn) {
      console.warn("Bouton aléatoire introuvable.");
      return;
    }

    btn.addEventListener("click", async () => {
      const slug = await pickRandomSlug();
      if (!slug) return;

      // Construire l’URL relative en respectant le chemin actuel (GitHub Pages, sous-dossier, etc.)
      const targetUrl = new URL(slug, window.location.href);

      // Navigation classique : on charge la page tirée au hasard
      window.location.href = targetUrl.toString();
    });
  });
</script>
