// Template d'animation : 3 images qui changent toutes les 2 secondes, en boucle.
//
// Pour ajouter une animation :
// 1. mettre les 3 images dans un dossier, nommées 1.png, 2.png et 3.png
//    (ex. images/animation-nuage/)
// 2. ajouter dans le html un élément avec la classe "animation" et le dossier dans data-dossier :
//    <div id="nuage" class="animation" data-dossier="./images/animation-nuage/"></div>
// 3. lui donner sa place et sa taille dans le css avec son id (voir .animation dans jeu.css)

const NOMBRE_FRAMES = 3;
const DUREE_FRAME = 2000; // en ms, le temps qu'une image reste affichée
// si l'utilisateur a demandé de réduire les animations (comme dans commun.css), on reste sur la première image
const animationsArretees = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Part l'animation d'un élément
function demarrerAnimation(element) {
  const dossier = element.dataset.dossier; // ce qui est écrit dans data-dossier
  let frame = 1; // l'image affichée en ce moment : 1, 2 ou 3

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
      frame = 1; // après la dernière image on recommence à la première
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
