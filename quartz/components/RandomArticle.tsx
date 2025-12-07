import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  function RandomArticle(_props: QuartzComponentProps) {
    // Ce composant n'affiche rien, il sert juste à injecter du JS
    return <></>
  }

  RandomArticle.afterDOMLoaded = `
    // Code exécuté après chaque navigation/chargement par Quartz
    const btn = document.getElementById("random-page-btn");
    if (!btn) {
      // Pas de bouton sur cette page, on ne fait rien
      return;
    }

    // Éviter d'attacher plusieurs fois le même listener si la page est revisitée
    if (btn.dataset.randomAttached === "true") {
      return;
    }
    btn.dataset.randomAttached = "true";

    const EXCLUDED_PREFIXES = ["tags/", "static/", "template", "media"];
    const EXCLUDED_SLUGS = new Set(["index"]);

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
      return true;
    }

    async function getRandomSlug() {
      try {
        // fetchData est une Promise<contentIndex> fournie par Quartz
        const contentIndex = await fetchData;
        const entries = Object.entries(contentIndex).filter(
          ([slug, details]) => isAllowedSlug(slug, details)
        );

        if (entries.length === 0) {
          console.warn("Aucune page éligible pour le bouton aléatoire.");
          return null;
        }

        const randomIndex = Math.floor(Math.random() * entries.length);
        const [slug] = entries[randomIndex];
        return slug;
      } catch (e) {
        console.error("Erreur lors du chargement de contentIndex :", e);
        return null;
      }
    }

    btn.addEventListener("click", async () => {
      const slug = await getRandomSlug();
      if (!slug) return;

      const targetUrl = new URL(slug, window.location.href);
      window.location.href = targetUrl.toString();
    });
  `

  return RandomArticle
}) satisfies QuartzComponentConstructor
