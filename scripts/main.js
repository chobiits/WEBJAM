console.log("main.js est bien charge");

// Éléments du HTML
const curseur = document.getElementById("echelle-curseur");
const altitude = document.getElementById("echelle-altitude");
const scene = document.getElementById("scene");
const finExperience = document.getElementById("fin-experience");
const texteFond = document.getElementById("couche-texte");

let redirectionLancee = false;

// Réglages
const LARGEUR_IMAGE = 1920;
const HAUTEUR_IMAGE = 1080;
const RAYON_PLANETE = 150; // la moitié des 300px du css
const HORIZON_VILLE = 540; // où le sommet de la planète arrive dans ville.png (le milieu de 1080)
// Le centre de la fleur jaune dans la scène quand rien n'est grossi.
// Elle est dans l'image de la bâtisse : si on déplace la bâtisse dans jeu.css, il faut changer ces chiffres
const FLEUR_X = 805;
const FLEUR_Y = 389;
const ZOOM_MAX = 10;
const PAS_ZOOM = 0.1; // ce qu'on ajoute au zoom à chaque coup de molette
const PENTE_ALTITUDE = 0.7; // plus c'est gros, plus l'altitude monte vite

let zoom = 0; // 0 = au sol, 10 = on voit la planète au complet

// Les couches de la scène
// niveau = zoom où la couche est à sa taille normale
// depart = sa taille au zoom 0
// debut  = zoom où la couche commence à être affichée
// entree = sur combien de zoom elle apparaît en fondu à partir de debut (0 = elle est là d'un coup)
// fin    = zoom où la couche a disparu
// fondu  = sur combien de zoom elle s'efface avant fin
// fixe   = true si elle ne change pas de taille
const couches = [
  // La ville a trois profondeurs : la bâtisse (loin), le sol (milieu), le filler (proche).
  { id: "couche-sol", niveau: 3.3, depart: 6.5, debut: 0, entree: 0, fin: 7, fondu: 1.5, fixe: false },
  { id: "couche-planete", niveau: 10, depart: 100, debut: 0, entree: 0, fin: 11, fondu: 1, fixe: false },
  // le ciel disparaît avant la planète sinon on voit du ciel derrière la planète
  { id: "couche-ciel", niveau: 10, depart: 100, debut: 0, entree: 0, fin: 8, fondu: 4, fixe: false },
  // les étoiles sont trop loin pour changer de taille
  { id: "couche-etoiles", niveau: 10, depart: 1, debut: 3.5, entree: 0, fin: 11, fondu: 1, fixe: true },
  // la plus loin de la ville, donc la plus petite au début et la plus lente
  { id: "couche-batisse", niveau: 3, depart: 5, debut: 0, entree: 0, fin: 7, fondu: 1, fixe: false },
  // les bâtiments en avant du sol : les plus proches, donc les plus gros au début et les plus rapides
  { id: "couche-filler", niveau: 3.6, depart: 9, debut: 0, entree: 0, fin: 7, fondu: 1.5, fixe: false },
  // les nuages et les satellites (animés par animation.js), en avant de la ville pour cacher sa disparition
  { id: "couche-orbite", niveau: 10, depart: 100, debut: 4.8, entree: 0.7, fin: 11, fondu: 1, fixe: false },
];

// 1 m au zoom 0, 10 000 km au zoom 10
function calculerAltitude() {
  const metres = Math.pow(10, zoom * PENTE_ALTITUDE);

  if (metres < 1000) {
    return Math.round(metres) + " m";
  }
  return Math.round(metres / 1000) + " km";
}

// La couche part de sa taille "depart" au zoom 0 et arrive à x1 à son niveau
function calculerTaille(couche) {
  return Math.pow(couche.depart, 1 - zoom / couche.niveau);
}

// 1 = visible, 0 = invisible
function calculerOpacite(couche) {
  let opacite = (couche.fin - zoom) / couche.fondu;

  if (couche.entree > 0) {
    const opaciteEntree = (zoom - couche.debut) / couche.entree;
    if (opaciteEntree < opacite) {
      opacite = opaciteEntree;
    }
  }

  if (opacite > 1) {
    opacite = 1;
  }
  if (opacite < 0) {
    opacite = 0;
  }
  return opacite;
}


// Chaque couche rétrécit quand on monte et laisse voir celle d'en arrière
function mettreAJourCouches() {
  // Tout le monde glisse du même nombre de pixels pour que la fleur reste au milieu de l'écran.
  const tailleBatisse = calculerTaille(couches[4]);
  const glisseX = (LARGEUR_IMAGE / 2 - FLEUR_X) * tailleBatisse;
  const glisseY = (calculerHorizon() - FLEUR_Y) * tailleBatisse;

  for (const couche of couches) {
    const element = document.getElementById(couche.id);

    let taille = 1;
    if (couche.fixe === false) {
      taille = calculerTaille(couche);
    }

    const opacite = calculerOpacite(couche);

    if (couche.fixe === false) {
      // translate en premier : le glissement est en px de l'écran, il n'est pas grossi par scale
      element.style.transform = "translate(" + glisseX + "px, " + glisseY + "px) scale(" + taille + ")";
    }
    element.style.opacity = opacite;

    // couche-cachee est dans jeu.css
    if (opacite === 0 || zoom < couche.debut) {
      element.classList.add("couche-cachee");
    } else {
      element.classList.remove("couche-cachee");
    }
  }
}

// L'horizon est au milieu de l'écran au zoom 0, puis il monte
// pour que la planète soit centrée au zoom max
function calculerHorizon() {
  const progression = zoom / ZOOM_MAX;
  return HAUTEUR_IMAGE / 2 - RAYON_PLANETE * progression;
}

function mettreAJourHorizon() {
  const horizon = calculerHorizon();

  scene.style.setProperty("--horizon", horizon + "px");

  // L'horizon monte avec le zoom, mais le sommet de la planète doit rester
  // au milieu de l'image du sol, alors on redescend la planète de la différence.
  const sol = couches[0];
  const planete = couches[1];
  const ecart = (HORIZON_VILLE - horizon) * calculerTaille(sol);
  const decalage = ecart / calculerTaille(planete);

  scene.style.setProperty("--decalage", decalage + "px");
}

// À appeler chaque fois que le zoom change
function mettreAJour() {
  mettreAJourHorizon();
  // Quand on arrive à 10 000 km
  if (zoom >= ZOOM_MAX && redirectionLancee === false) {
    redirectionLancee = true;
    finExperience.classList.add("visible");
    setTimeout(() => {
      document.body.classList.add("fondu-sortie");
      setTimeout(() => {
        window.location.href = "retour.html";
      }, 700);
    }, 5000);
  }
  // le texte apparaît entre le zoom 3 et le zoom 5, puis s'efface entre le zoom 7 et le zoom 9,
  // avant le message de la fin (on prend le plus petit des deux fondus)
  texteFond.style.opacity = Math.min(1, Math.max(0, Math.min((zoom - 3) / 2, (9 - zoom) / 2)));
  altitude.textContent = calculerAltitude();
  curseur.style.bottom = (zoom / ZOOM_MAX) * 100 + "%"; // 0% en bas, 100% en haut
  mettreAJourCouches();
  if (zoom >= ZOOM_MAX) {
    finExperience.classList.add("visible");
  } else {
    finExperience.classList.remove("visible");
  }
}

// Agrandit la scène pour qu'elle remplisse l'écran
function ajusterScene() {
  const echelleLargeur = window.innerWidth / LARGEUR_IMAGE;
  const echelleHauteur = window.innerHeight / HAUTEUR_IMAGE;

  // on prend la plus grande des deux pour ne pas laisser de vide
  let echelle = echelleLargeur;
  if (echelleHauteur > echelleLargeur) {
    echelle = echelleHauteur;
  }

  scene.style.transform = "scale(" + echelle + ")";
}

// Dézoom à la molette
function quandMoletteTourne(evenement) {
  // (la fonction est dans notifications.js)
  if (notificationsAffichees()) {
    return;
  }

  // deltaY positif = molette vers le bas
  if (evenement.deltaY > 0) {
    zoom = zoom + PAS_ZOOM;
  }

  if (zoom > ZOOM_MAX) {
    zoom = ZOOM_MAX;
  }

  zoom = Math.round(zoom * 10) / 10;
  console.log("Zoom : " + zoom);

  mettreAJour();
  verifierNotifications(zoom);
}

window.addEventListener("wheel", quandMoletteTourne);
window.addEventListener("resize", ajusterScene);

// Au chargement de la page
ajusterScene();
mettreAJour();
