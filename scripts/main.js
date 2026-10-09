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
const HORIZON_VILLE = 540; // où le sommet de la planète arrive dans ville.png (le milieu de 1080)
const DOSSIER_IMAGES = "./images/"; // une image par couche, nommée comme son id (ex. couche-sol.png)
const ZOOM_MAX = 10;
const PAS_ZOOM = 0.1; // ce qu'on ajoute au zoom à chaque coup de molette
const PENTE_ALTITUDE = 0.7; // plus c'est gros, plus l'altitude monte vite

let zoom = 0; // 0 = au sol, 10 = on voit la planète au complet

// Les couches de la scène
// niveau = zoom où la couche est à sa taille normale
// depart = sa taille au zoom 0
// debut  = zoom où la couche commence à être affichée
// fin    = zoom où la couche a disparu
// fondu  = sur combien de zoom elle s'efface avant fin
// fixe   = true si elle ne change pas de taille
// flouDepart = son flou (en px à l'écran) jusqu'au zoom flouDebut
// flouDebut  = zoom où le flou commence à changer
// flouFin    = son flou quand elle a disparu (ou au zoom max)
const couches = [
  // le sol devient de plus en plus flou à mesure qu'il s'éloigne
  // zoom x2 sur le sol au départ
  { id: "couche-sol", niveau: 1, depart: 2, debut: 0, fin: 6, fondu: 1, fixe: false, flouDepart: 0, flouDebut: 0, flouFin: 8 },
  // depart 100 = entre 20 (le sol rapetisse beaucoup plus vite que la planète)
  // et 1024 (la planète rapetisse aussi vite que le sol)
  // un peu floue au début parce qu'elle est très grossie, nette à la fin
  { id: "couche-planete", niveau: 10, depart: 100, debut: 0, fin: 11, fondu: 1, fixe: false, flouDepart: 6, flouDebut: 0, flouFin: 0 },
  // le ciel disparaît avant la planète sinon on voit du ciel derrière la planète
  // il s'efface du zoom 4 au zoom 8
  // même niveau et même depart que la planète, sinon les deux se décalent
  // pas de flou ici, le ciel a déjà le sien dans jeu.css
  { id: "couche-ciel", niveau: 10, depart: 100, debut: 0, fin: 8, fondu: 4, fixe: false, flouDepart: 0, flouDebut: 0, flouFin: 0 },
  // les étoiles sont trop loin pour changer de taille
  // debut 3.5 : avant, le ciel les cache au complet, pas besoin de les animer pour rien
  { id: "couche-etoiles", niveau: 10, depart: 1, debut: 3.5, fin: 11, fondu: 1, fixe: true, flouDepart: 0, flouDebut: 0, flouFin: 0 },
  // même niveau et même depart que le sol pour rester collée dessus,
  // mais elle reste nette jusqu'au zoom 3 et disparaît un peu après lui
  { id: "couche-batisse", niveau: 1, depart: 2, debut: 0, fin: 7, fondu: 1, fixe: false, flouDepart: 0, flouDebut: 3, flouFin: 8 },
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
// ex. le sol (depart 2, niveau 1) : zoom 0 = x2, zoom 1 = x1, zoom 2 = x0.5
// ex. la planète (depart 100, niveau 10) : zoom 0 = x100, zoom 5 = x10, zoom 10 = x1
function calculerTaille(couche) {
  return Math.pow(couche.depart, 1 - zoom / couche.niveau);
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

// Le flou passe de flouDepart (au zoom flouDebut) à flouFin (quand la couche a disparu)
// ex. le sol (flouFin 8, fin 6) au zoom 3 : 8 * 3 / 6 = 4px
function calculerFlou(couche) {
  // la planète finit au zoom 11, mais on ne peut pas dépasser le zoom max
  let dernierZoom = couche.fin;
  if (dernierZoom > ZOOM_MAX) {
    dernierZoom = ZOOM_MAX;
  }

  // de 0 (au zoom flouDebut) à 1 (au dernier zoom)
  let progression = (zoom - couche.flouDebut) / (dernierZoom - couche.flouDebut);
  if (progression < 0) {
    progression = 0;
  }
  if (progression > 1) {
    progression = 1;
  }

  return couche.flouDepart + (couche.flouFin - couche.flouDepart) * progression;
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

    // le css applique le flou avant de grossir la couche, donc il serait grossi lui aussi
    // on le divise par la taille pour qu'il garde la même épaisseur à l'écran
    if (couche.flouDepart !== 0 || couche.flouFin !== 0) {
      const flou = calculerFlou(couche) / taille;
      element.style.filter = "blur(" + flou + "px)";
    }

    // couche-cachee est dans jeu.css
    // une couche cachée ne coûte rien au navigateur, ça aide contre le lag
    if (opacite === 0 || zoom < couche.debut) {
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

  // L'horizon monte avec le zoom, mais le sommet de la planète doit rester
  // au milieu de l'image du sol, alors on redescend la planète de la différence.
  // L'écart à l'écran dépend de la taille du sol, et il faut le diviser par
  // la taille de la planète parce que le css le grossit avec elle
  const sol = couches[0];
  const planete = couches[1];
  const ecart = (HORIZON_VILLE - horizon) * calculerTaille(sol);
  const decalage = ecart / calculerTaille(planete);

  scene.style.setProperty("--decalage", decalage + "px");
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
