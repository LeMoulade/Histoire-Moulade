import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  function RandomArticle(_props: QuartzComponentProps) {
    // Ce composant n'affiche rien, il sert juste à injecter le script
    return <></>
  }

  RandomArticle.afterDOMLoaded = `
document.addEventListener("nav", async () => {
  const btn = document.getElementById("random-page-btn");
  if (!btn) return;

  // Évite de rattacher plusieurs fois les mêmes listeners
  // si Quartz recharge la page en SPA
  if ((btn as any)._randomAttached) return;
  (btn as any)._randomAttached = true;

  const EXCLUDED_PREFIXES = ["tags/", "static/", "template", "media"];
  const EXCLUDED_SLUGS = new Set(["index"]);

  function isAllowedSlug(slug, details) {
    if (!slug) return false;
    if (EXCLUDED_SLUGS.has(slug)) return false;

    for (const prefix of EXCLUDED_PREFIXES) {
      if (slug === prefix || slug.startsWith(prefix) || slug.includes("/" + prefix)) {
        return false;
      }
    }
    return true;
  }

  let contentIndex;
  try {
    // fetchData est fourni par Quartz (Promise<contentIndex>)
    contentIndex = await fetchData;
  } catch (e) {
    console.error("Erreur lors du chargement de contentIndex :", e);
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

    const targetUrl = new URL(slug, window.location.href);
    window.location.href = targetUrl.toString();
  });
});
  `

  return RandomArticle
}) satisfies QuartzComponentConstructor
