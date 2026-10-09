console.log("main.js est bien charge");

// Éléments du HTML
const info = document.getElementById("zoom-info");
const curseur = document.getElementById("echelle-curseur");
const altitude = document.getElementById("echelle-altitude");
const carteCourbure = document.getElementById("courbure-carte");
const forceCourbure = document.getElementById("courbure-force");
const scene = document.getElementById("scene");

// Réglages
const RAYON_PLANETE = 150; // la moitié des 300px du css
const LARGEUR_IMAGE = 1920;
const HAUTEUR_IMAGE = 1080;
const ZOOM_COURBURE = 2; // zoom où le sol est aussi courbé que la planète
const DOSSIER_IMAGES = "./images/"; // une image par couche, nommée comme son id (ex. couche-sol.png)
const ZOOM_MAX = 10;
let zoom = 0;

// Dézoom à la molette : vers le haut on monte, on ne peut pas redescendre
window.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) {
        zoom = zoom + 0.1;
    }
    zoom = Math.min(ZOOM_MAX, zoom);
    zoom = parseFloat(zoom.toFixed(1)); // évite les 0.30000000000000004
    console.log(`Zoom : ${zoom}`);
    mettreAJour();
});

// niveau = zoom où la couche est à sa taille normale
// fin    = zoom où la couche a disparu (elle s'efface pendant le dernier 1 de zoom)
const couches = [
  { id: "couche-sol",      niveau: 1,   fin: 9 }, // niveau 1 = zoom x2 sur le sol au départ
  { id: "couche-planete",  niveau: 10,  fin: 11 },
  { id: "couche-etoiles",  niveau: 10,  fin: 11, fixe: true }, // fixe = ne change pas de taille, les étoiles sont trop loin
];

// 1 m au zoom 0, 10 000 km au zoom 10
function calculerAltitude() {
  const metres = Math.pow(10, zoom * 0.7);
  if (metres < 1000) {
    return `${Math.round(metres)} m`;
  }
  return `${Math.round(metres / 1000)} km`;
}

// La taille double ou diminue de moitié à chaque 1 de zoom
function calculerTaille(couche) {
  const taille = Math.pow(2, couche.niveau - zoom);
  return Math.min(20, taille); // à 20 la couche dépasse déjà de l'écran
}

// Crée l'image que le filtre utilise pour courber le sol.
// Le vert dit de combien descendre chaque colonne : rien au centre, le plus sur les bords.
function fabriquerCarte() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 1; // une ligne suffit, la courbe est la même sur toute la hauteur
  const ctx = canvas.getContext("2d");
  for (let x = 0; x < 256; x++) {
    const t = (x / 255) * 2 - 1; // -1 à gauche, 0 au centre, 1 à droite
    const vert = Math.round(128 * (1 - t * t)); // 128 = ne bouge pas, 0 = descend au max
    ctx.fillStyle = `rgb(128, ${vert}, 0)`; // rouge à 128 = pas de déplacement horizontal
    ctx.fillRect(x, 0, 1, 1);
  }
  carteCourbure.setAttribute("href", canvas.toDataURL());
}

// Le sol est plat au zoom 0, puis se courbe jusqu'à suivre la planète
function mettreAJourCourbure() {
  const tailleSol = calculerTaille(couches.find((c) => c.id === "couche-sol"));
  const rayon = RAYON_PLANETE * calculerTaille(couches.find((c) => c.id === "couche-planete"));
  const demiLargeur = LARGEUR_IMAGE / 2;
  const descente = (demiLargeur * demiLargeur * tailleSol) / (2 * rayon); // de combien le bord du sol doit descendre
  const progression = Math.min(1, zoom / ZOOM_COURBURE);
  forceCourbure.setAttribute("scale", descente * 2 * progression); // x2 parce que le vert va seulement de 0 à 128
}

// Met l'image de chaque couche si le fichier existe, sinon la couleur du css reste
function chargerImages() {
  for (const couche of couches) {
    const element = document.getElementById(couche.id);
    const chemin = `${DOSSIER_IMAGES}${couche.id}.png`;
    const image = new Image();
    image.onload = () => {
      element.style.backgroundImage = `url("${chemin}")`;
      element.style.backgroundColor = "transparent"; // sinon la couleur se voit à travers le png
      element.style.borderRadius = "0"; // c'est le png qui donne la forme de la planète
    };
    image.src = chemin;
  }
}

// Chaque couche rétrécit quand on monte et laisse voir celle d'en arrière
function mettreAJourCouches() {
  for (const couche of couches) {
    const element = document.getElementById(couche.id);
    const taille = couche.fixe ? 1 : calculerTaille(couche);
    const opacite = Math.min(1, Math.max(0, couche.fin - zoom));
    element.style.transform = `scale(${taille})`;
    element.style.opacity = opacite;
    element.classList.toggle("couche-cachee", opacite === 0);
  }
}

// L'horizon est au milieu de l'écran au zoom 0, puis il monte
// pour que la planète soit centrée au zoom max
function mettreAJourHorizon() {
  const progression = zoom / ZOOM_MAX;
  const horizon = HAUTEUR_IMAGE / 2 - RAYON_PLANETE * progression;
  scene.style.setProperty("--horizon", `${horizon}px`);
}

function mettreAJour() {
  mettreAJourHorizon(); // avant les couches, elles se placent par rapport à l'horizon
  info.textContent = `Zoom : ${zoom}`;
  curseur.style.bottom = `${(zoom / ZOOM_MAX) * 100}%`;
  altitude.textContent = calculerAltitude();
  mettreAJourCouches();
  mettreAJourCourbure();
}

// Agrandit la scène pour qu'elle remplisse l'écran
function ajusterScene() {
  const echelle = Math.max(window.innerWidth / LARGEUR_IMAGE, window.innerHeight / HAUTEUR_IMAGE); // le plus grand des deux pour ne pas laisser de vide
  scene.style.transform = `scale(${echelle})`;
}

window.addEventListener("resize", ajusterScene);
ajusterScene();
chargerImages();
fabriquerCarte();
mettreAJour();
