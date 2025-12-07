// quartz/static/postscript.js

// Slugs / chemins à exclure du tirage
const EXCLUDED_PREFIXES = [
  "tags/",
  "static/",
  "template",
  "media",
];

const EXCLUDED_SLUGS = new Set([
  "index", // page d'accueil
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

  // Exemple : exclure des pages selon leurs tags :
  // if (details.tags && details.tags.includes("meta")) return false;

  return true;
}

async function setupRandomButton() {
  const btn = document.getElementById("random-page-btn");
  if (!btn) return; // on n'est pas sur la page d'accueil

  // fetchData est défini globalement par Quartz (voir renderPage.tsx)
  // et contient le contentIndex complet du site.
  let contentIndex;
  try {
    contentIndex = await fetchData;
  } catch (e) {
    console.error("Impossible de charger contentIndex via fetchData :", e);
    return;
  }

  const entries = Object.entries(contentIndex).filter(([slug, details]) =>
    isAllowedSlug(slug, details)
  );

  if (entries.length === 0) {
    console.warn("Aucune page éligible pour le bouton aléatoire.");
    return;
  }

  btn.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * entries.length);
    const [slug] = entries[randomIndex];

    // Construire l'URL en respectant le sous-dossier (GitHub Pages, etc.)
    const targetUrl = new URL(slug, window.location.href);
    window.location.href = targetUrl.toString();
  });
}


