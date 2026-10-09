// Fondu entre les pages : le fondu d'entrée est fait par le css (commun.css),
// ici on fait le fondu de sortie avant de suivre un lien.

const DUREE_FONDU = 500; // en ms, la même durée que l'animation fondu-sortie du css
const sansAnimation = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("a[href]").forEach((lien) => {
    // les liens qui commencent par # restent sur la même page, pas de fondu
    if (lien.getAttribute("href").startsWith("#")) {
        return;
    }

    lien.addEventListener("click", (event) => {
        if (sansAnimation) {
            return;
        }
        event.preventDefault(); // on attend la fin du fondu avant de changer de page
        document.body.classList.add("fondu-sortie");
        setTimeout(() => {
            window.location.href = lien.href;
        }, DUREE_FONDU);
    });
});

// Si on revient avec le bouton précédent, la page serait restée invisible
window.addEventListener("pageshow", () => {
    document.body.classList.remove("fondu-sortie");
});
