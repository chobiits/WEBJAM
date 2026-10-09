

const conteneurNotifications = document.getElementById("notifications"); // le conteneur du HTML
const animationsReduites = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


const notifications = [
  { zoom: 3, app: "Rappel",    icone: "⚠️", couleur: "#ff9f0a", titre: "ALERTE",
    texte: "Surplus de traffic, accident sur la route 616 Avenue Jacques-Cartier.",
    heure: "maintenant", dx: -150, dy: -90, delai: 0 },

  { zoom: 3, app: "Téléphone", icone: "📞", couleur: "#34c759", appel: true, titre: "Appel entrant",
    texte: "+4182323289",
    heure: "il y'a deux minutes", dx: 10, dy: 2, delai: 0.35 },

  { zoom: 3, app: "Messages",  icone: "💬", couleur: "#999", rond: true, photo: "./images/chantal.jpg", titre: "Doudou ❤️",
    texte: "Répond bébé stp",
    heure: "maintenant", dx: 150, dy: 80, delai: 0.7 },
];

let zoomPrecedent = 0; // le zoom d'avant, pour détecter qu'on vient de franchir un seuil

// Petit outil : crée un élément, lui donne une classe et un texte
function fabriquer(balise, classe, texte) {
  const el = document.createElement(balise);   // on crée l'élément (div, span...)
  el.className = classe;                        // on lui donne sa classe CSS
  if (texte) el.textContent = texte;            // si un texte est fourni, on l'écrit dedans
  return el;                                    // on renvoie l'élément fabriqué
}

// Fabrique une notification et l'affiche
function creerNotification(n) {                     // on reçoit tout l'objet n
  const notif = fabriquer("div", "notif");
  notif.style.setProperty("--dx", `${n.dx}px`);     // position décalée
  notif.style.setProperty("--dy", `${n.dy}px`);
  notif.style.setProperty("--delai", `${n.delai}s`); // retard avant d'apparaître

  const icone = fabriquer("div", n.rond ? "notif-icone rond" : "notif-icone", n.icone);
  icone.style.background = n.couleur;

  if (n.photo) {                                    // si une photo est fournie
    const img = new Image();                        // on la charge d'abord en coulisses
    img.onload = () => {                            // si elle existe bien...
      icone.textContent = "";                       // ...on enlève l'emoji
      icone.style.backgroundImage = `url("${n.photo}")`; // ...et la photo devient le fond
      icone.style.backgroundSize = "cover";
      icone.style.backgroundPosition = "center";
    };
    img.src = n.photo;                              // si la photo est introuvable, l'emoji reste
  }

  const entete = fabriquer("div", "notif-entete");  // ligne : nom de l'app + heure
  entete.append(fabriquer("span", "notif-app", n.app), fabriquer("span", "", n.heure));

  const contenu = fabriquer("div", "notif-contenu");
  contenu.append(entete, fabriquer("div", "notif-titre", n.titre), fabriquer("div", "notif-texte", n.texte));

  notif.append(icone, contenu);

  if (n.appel) {                                    // seulement pour la notif d'appel
    const boutons = fabriquer("div", "notif-boutons");
    boutons.append(
      fabriquer("div", "bouton refuser", "Refuser"),
      fabriquer("div", "bouton accepter", "Accepter")
    );
    notif.append(boutons);                          // dans la notif, sous l'icône et le texte
  }

  notif.addEventListener("click", () => {           // un clic ferme la notif
    if (animationsReduites) {                       // sans animation, "animationend" n'arriverait jamais
      notif.remove();
      return;
    }
    notif.classList.add("sortie");
    notif.addEventListener("animationend", (e) => {
      if (e.animationName === "notif-sortie") notif.remove(); // on supprime à la fin de l'animation de sortie
    });
  });

  conteneurNotifications.appendChild(notif);
}


function verifierNotifications(zoom) {
  for (const n of notifications) {
    if (zoomPrecedent < n.zoom && zoom >= n.zoom) { // avant on était en dessous, maintenant au-dessus
      creerNotification(n);
    }
  }
  zoomPrecedent = zoom; // on mémorise pour la prochaine fois
}

// vrai s'il reste au moins une notification à l'écran (main.js s'en sert pour bloquer le dézoom)
function notificationsAffichees() {
  return conteneurNotifications.children.length > 0;
}