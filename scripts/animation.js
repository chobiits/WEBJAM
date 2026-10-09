// 3 images qui changent toutes les 500 ms en boucle


const NOMBRE_FRAMES = 3;
const DUREE_FRAME = 500; // en ms, le temps qu'une image reste affichée
// si l'utilisateur a demandé de réduire les animations (comme dans commun.css), on reste sur la première image
const animationsArretees = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Part l'animation d'un élément
function demarrerAnimation(element) {
  const dossier = element.dataset.dossier;
  let frame = 1;

  // On charge les 3 images tout de suite, sinon il y aurait un trou
  // la première fois que chaque image s'affiche
  for (let numero = 1; numero <= NOMBRE_FRAMES; numero++) {
    const image = new Image();
    image.src = dossier + numero + ".png";
  }

  function afficherFrame() {
    element.style.backgroundImage = 'url("' + dossier + frame + '.png")';
  }

  function prochaineFrame() {
    frame = frame + 1;
    if (frame > NOMBRE_FRAMES) {
      frame = 1;
    }
    afficherFrame();
  }

  afficherFrame();
  if (animationsArretees === false) {
    setInterval(prochaineFrame, DUREE_FRAME);
  }
}

// Au chargement de la page : toutes les animations partent en même temps
const animations = document.querySelectorAll(".animation");
for (const element of animations) {
  demarrerAnimation(element);
}
