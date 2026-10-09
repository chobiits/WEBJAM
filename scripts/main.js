console.log("main.js est bien charge");

// Éléments du HTML
const info = document.getElementById("zoom-info");
const curseur = document.getElementById("echelle-curseur");
const altitude = document.getElementById("echelle-altitude");
const scene = document.getElementById("scene");

// Réglages
const LARGEUR_IMAGE = 1920;
const HAUTEUR_IMAGE = 1080;
const RAYON_PLANETE = 150; // la moitié des 300px du css
const DOSSIER_IMAGES = "./images/"; // une image par couche, nommée comme son id (ex. couche-sol.png)
const ZOOM_MAX = 10;
const PAS_ZOOM = 0.1; // ce qu'on ajoute au zoom à chaque coup de molette
const TAILLE_MAX = 20; // à 20 la couche dépasse déjà de l'écran
const PENTE_ALTITUDE = 0.7; // plus c'est gros, plus l'altitude monte vite

let zoom = 0; // 0 = au sol, 10 = on voit la planète au complet

// Les couches de la scène
// niveau = zoom où la couche est à sa taille normale
// fin    = zoom où la couche a disparu
// fondu  = sur combien de zoom elle s'efface avant fin
// fixe   = true si elle ne change pas de taille
const couches = [
  { id: "couche-sol", niveau: 1, fin: 6, fondu: 1, fixe: false }, // niveau 1 = zoom x2 sur le sol au départ
  { id: "couche-planete", niveau: 10, fin: 11, fondu: 1, fixe: false },
  // le ciel disparaît avant la planète sinon on voit du ciel derrière la planète
  // il s'efface du zoom 4 au zoom 8
  { id: "couche-ciel", niveau: 10, fin: 8, fondu: 4, fixe: false },
  { id: "couche-etoiles", niveau: 10, fin: 11, fondu: 1, fixe: true }, // les étoiles sont trop loin pour changer de taille
];

// 1 m au zoom 0, 10 000 km au zoom 10
function calculerAltitude() {
  const metres = Math.pow(10, zoom * PENTE_ALTITUDE);

  if (metres < 1000) {
    return Math.round(metres) + " m";
  }
  return Math.round(metres / 1000) + " km";
}

// La taille diminue de moitié à chaque 1 de zoom
// ex. le sol (niveau 1) : zoom 0 = x2, zoom 1 = x1, zoom 2 = x0.5
function calculerTaille(couche) {
  let taille = Math.pow(2, couche.niveau - zoom);

  if (taille > TAILLE_MAX) {
    taille = TAILLE_MAX;
  }
  return taille;
}

// 1 = visible, 0 = invisible
// ex. le ciel (fin 8, fondu 4) au zoom 6 : (8 - 6) / 4 = 0.5
function calculerOpacite(couche) {
  let opacite = (couche.fin - zoom) / couche.fondu;

  // il faut rester entre 0 et 1
  if (opacite > 1) {
    opacite = 1;
  }
  if (opacite < 0) {
    opacite = 0;
  }
  return opacite;
}

// Met l'image de chaque couche si le fichier existe, sinon la couleur du css reste
function chargerImages() {
  for (const couche of couches) {
    const element = document.getElementById(couche.id);
    const chemin = DOSSIER_IMAGES + couche.id + ".png";
    const image = new Image(); // image pas affichée, juste pour tester si le fichier existe

    // ça roule seulement si l'image a réussi à charger
    image.onload = function () {
      element.style.backgroundImage = 'url("' + chemin + '")';
      element.style.backgroundColor = "transparent"; // sinon la couleur se voit à travers le png
      element.style.borderRadius = "0"; // c'est le png qui donne la forme de la planète
    };

    image.src = chemin; // c'est ça qui lance le chargement
  }
}

// Chaque couche rétrécit quand on monte et laisse voir celle d'en arrière
function mettreAJourCouches() {
  for (const couche of couches) {
    const element = document.getElementById(couche.id);

    let taille = 1;
    if (couche.fixe === false) {
      taille = calculerTaille(couche);
    }

    const opacite = calculerOpacite(couche);

    element.style.transform = "scale(" + taille + ")";
    element.style.opacity = opacite;

    // couche-cachee est dans jeu.css
    if (opacite === 0) {
      element.classList.add("couche-cachee");
    } else {
      element.classList.remove("couche-cachee");
    }
  }
}

// L'horizon est au milieu de l'écran au zoom 0, puis il monte
// pour que la planète soit centrée au zoom max
function mettreAJourHorizon() {
  const progression = zoom / ZOOM_MAX; // de 0 à 1
  const horizon = HAUTEUR_IMAGE / 2 - RAYON_PLANETE * progression;

  // --horizon est la variable css dans jeu.css, le sol et la planète se placent avec
  scene.style.setProperty("--horizon", horizon + "px");
}

// À appeler chaque fois que le zoom change
function mettreAJour() {
  mettreAJourHorizon(); // avant les couches, elles se placent par rapport à l'horizon
  info.textContent = "Zoom : " + zoom;
  altitude.textContent = calculerAltitude();
  curseur.style.bottom = (zoom / ZOOM_MAX) * 100 + "%"; // 0% en bas, 100% en haut
  mettreAJourCouches();
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

// Dézoom à la molette, on peut juste monter, pas redescendre
function quandMoletteTourne(evenement) {
  // il faut fermer les notifications avant de continuer à monter
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

  zoom = Math.round(zoom * 10) / 10; // garde 1 décimale, évite les 0.30000000000000004
  console.log("Zoom : " + zoom);

  mettreAJour();
  verifierNotifications(zoom); // dans notifications.js, affiche les notifications rendu à leur seuil
}

window.addEventListener("wheel", quandMoletteTourne);
window.addEventListener("resize", ajusterScene);

// Au chargement de la page
ajusterScene();
chargerImages();
mettreAJour();
