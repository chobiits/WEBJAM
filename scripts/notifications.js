

const conteneurNotifications = document.getElementById("notifications"); // le conteneur du HTML
const animationsReduites = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


const notifications = [
   {
    app: "Messages", icone: "M", couleur: "linear-gradient(#a5acb8, #858a96)", rond: true, titre: "Maxime",
    texte: "t'as vu le match hier ?? 😂",
    heure: "maintenant", dx: -700, dy: -420
  },
  {
    app: "Alerte météo", icone: "🌪️", couleur: "#ff3b30", titre: "TORNADE EN COURS",
    texte: "Plusieurs tornades touchent votre région. Mettez-vous à l'abri immédiatement.",
    heure: "maintenant", dx: 520, dy: -415
  },
  {
    app: "Climat", icone: "🌡️", couleur: "#ff9f0a", titre: "Nouveau record",
    texte: "Température mondiale la plus élevée jamais mesurée. C'est le 4e record battu cette année.",
    heure: "il y a 1 min", dx: -130, dy: -325
  },
  {
    app: "Instagram", icone: "📸", couleur: "#e1306c", titre: "Nouveau j'aime",
    texte: "marie_88 a aimé votre photo.",
    heure: "il y a 5 min", dx: 700, dy: -320
  },
  {
    app: "Alerte", icone: "🌊", couleur: "#0a84ff", titre: "TSUNAMI",
    texte: "Vague de 12 mètres attendue sur la côte. Évacuez les zones basses.",
    heure: "maintenant", dx: -390, dy: -220
  },
  {
    app: "Messages", icone: "L", couleur: "linear-gradient(#a5acb8, #858a96)", rond: true, titre: "Léa",
    texte: "677777777",
    heure: "il y a 2 min", dx: 240, dy: -115
  },
  {
    app: "Actualités", icone: "🔥", couleur: "#ff453a", titre: "Feux de forêt",
    texte: "Les incendies ont ravagé une surface grande comme un pays. Aucun n'est maîtrisé.",
    heure: "il y a 2 min", dx: -750, dy: -5
  },
  {
    app: "Santé", icone: "😷", couleur: "#bf5af2", titre: "Qualité de l'air",
    texte: "Air irrespirable dans 40 grandes villes. Ne sortez pas sans masque.",
    heure: "maintenant", dx: 400, dy: -5
  },
  {
    app: "Téléphone", icone: "M", couleur: "linear-gradient(#a5acb8, #858a96)", rond: true, appel: true, titre: "Maman",
    texte: "Appel entrant",
    heure: "maintenant", dx: -190, dy: 105
  },
  {
    app: "IA", icone: "🤖", couleur: "#5e5ce6", titre: "Centres de données",
    texte: "Les serveurs de l'IA boivent plus d'eau que des régions entières. Des villages n'ont plus d'eau potable.",
    heure: "il y a 4 min", dx: 660, dy: 100
  },
  {
    app: "Uber Eats", icone: "🍔", couleur: "#06c167", titre: "Commande en route",
    texte: "Votre livreur arrive dans 8 minutes.",
    heure: "il y a 1 min", dx: -540, dy: -320
  },
  {
    app: "Climat", icone: "🧊", couleur: "#64d2ff", titre: "Fonte des glaces",
    texte: "La calotte glaciaire a perdu 30 % de sa masse en un an. Les mers montent plus vite que prévu.",
    heure: "maintenant", dx: 150, dy: -425
  },
  {
    app: "Messages", icone: "F", couleur: "linear-gradient(#a5acb8, #858a96)", rond: true, titre: "Groupe Famille",
    texte: "Qui apporte le dessert dimanche ?",
    heure: "il y a 12 min", dx: 50, dy: -210
  },
  {
    app: "Alerte", icone: "🌋", couleur: "#ff3b30", titre: "ÉRUPTION MAJEURE",
    texte: "Un nuage de cendres cache le ciel. Tous les vols sont annulés.",
    heure: "il y a 1 min", dx: -610, dy: -110
  },
  {
    app: "Alerte météo", icone: "🌀", couleur: "#ff3b30", titre: "OURAGAN CATÉGORIE 6",
    texte: "Un ouragan sans précédent touche la côte. Vents au-delà de 350 km/h.",
    heure: "maintenant", dx: -420, dy: 0
  },
  {
    app: "IA", icone: "⚡", couleur: "#5e5ce6", titre: "Réseau électrique",
    texte: "L'IA consomme trop d'électricité : coupures de courant prévues toute la semaine.",
    heure: "il y a 3 min", dx: 480, dy: 205
  },
  {
    app: "Messages", icone: "P", couleur: "linear-gradient(#a5acb8, #858a96)", rond: true, titre: "Papa",
    texte: "N'oublie pas d'acheter du lait 🥛",
    heure: "il y a 20 min", dx: -720, dy: 205
  },
  {
    app: "Actualités", icone: "🐟", couleur: "#30b0c7", titre: "Océans",
    texte: "Les océans sont devenus trop acides : la vie marine s'effondre. Les pêcheries ferment.",
    heure: "il y a 6 min", dx: 330, dy: -315
  },
  {
    app: "Spotify", icone: "🎵", couleur: "#1db954", titre: "Votre récap est prêt",
    texte: "Découvrez vos artistes les plus écoutés cette semaine.",
    heure: "il y a 1 h", dx: -280, dy: -410
  },
  {
    app: "Climat", icone: "🏜️", couleur: "#ff9f0a", titre: "Sécheresse historique",
    texte: "Les récoltes sont perdues. Les réserves de nourriture s'épuisent.",
    heure: "il y a 10 min", dx: 740, dy: -10
  },
  {
    app: "Téléphone", icone: "?", couleur: "linear-gradient(#a5acb8, #858a96)", rond: true, appel: true, titre: "Numéro masqué",
    texte: "Appel entrant",
    heure: "maintenant", dx: 80, dy: 215
  },
  {
    app: "IA", icone: "🗑️", couleur: "#5e5ce6", titre: "Déchets électroniques",
    texte: "Les serveurs de l'IA s'entassent : des montagnes de déchets polluent les sols et les rivières.",
    heure: "il y a 8 min", dx: -340, dy: 210
  },
  {
    app: "Messages", icone: "T", couleur: "linear-gradient(#a5acb8, #858a96)", rond: true, titre: "Théo",
    texte: "mdr regarde cette vidéo de chat",
    heure: "il y a 3 min", dx: 610, dy: -105
  },
  {
    app: "Alerte", icone: "🏚️", couleur: "#0a84ff", titre: "INONDATIONS",
    texte: "Crues soudaines : des quartiers entiers sont sous l'eau. Des milliers de personnes évacuées.",
    heure: "maintenant", dx: -510, dy: 310
  },
  {
    app: "Colis", icone: "📦", couleur: "#ff9500", titre: "Colis en livraison",
    texte: "Votre colis sera livré demain entre 9 h et 17 h.",
    heure: "il y a 30 min", dx: 450, dy: -215
  },
  {
    app: "Santé", icone: "☣️", couleur: "#bf5af2", titre: "EAU CONTAMINÉE",
    texte: "L'eau du robinet est impropre à la consommation. Ne la buvez pas.",
    heure: "maintenant", dx: -110, dy: 315
  },
  {
    app: "Alerte", icone: "🌍", couleur: "#ff3b30", titre: "SÉISME MAJEUR",
    texte: "Magnitude 8,9 ressentie à des centaines de kilomètres. Des répliques sont attendues.",
    heure: "maintenant", dx: 270, dy: 95
  },
  {
    app: "Messages", icone: "S", couleur: "linear-gradient(#a5acb8, #858a96)", rond: true, titre: "Sarah",
    texte: "ok 👍",
    heure: "il y a 7 min", dx: -750, dy: -215
  },
  {
    app: "IA", icone: "🧠", couleur: "#5e5ce6", titre: "Vidéos truquées",
    texte: "Impossible de distinguer le vrai du faux : l'IA inonde Internet de fausses vidéos.",
    heure: "il y a 9 min", dx: 350, dy: 305
  },
  {
    app: "Calendrier", icone: "📅", couleur: "#ff3b30", titre: "Rappel",
    texte: "Dentiste demain à 14 h.",
    heure: "il y a 2 h", dx: -210, dy: -105
  },
  {
    app: "Climat", icone: "🐻‍❄️", couleur: "#ff9f0a", titre: "Extinction",
    texte: "Une espèce animale disparaît toutes les dix minutes. Le rythme s'accélère.",
    heure: "il y a 15 min", dx: 700, dy: 310
  },
  {
    app: "Téléphone", icone: "🔧", couleur: "#34c759", appel: true, titre: "Garage Dupont",
    texte: "Appel entrant",
    heure: "maintenant", dx: -580, dy: 100
  },
  {
    app: "Jeux", icone: "🎮", couleur: "#5856d6", titre: "Vies rechargées !",
    texte: "Tes 5 vies sont de retour. Reviens jouer !",
    heure: "il y a 3 h", dx: -680, dy: 415
  },
  {
    app: "Actualités", icone: "🐝", couleur: "#ffcc00", titre: "Abeilles disparues",
    texte: "Les pollinisateurs ont presque tous disparu. Les cultures ne produisent plus.",
    heure: "il y a 20 min", dx: -290, dy: 420
  },
  {
    app: "Téléphone", icone: "M", couleur: "linear-gradient(#a5acb8, #858a96)", rond: true, appel: true, titre: "Mamie ❤️",
    texte: "Appel entrant",
    heure: "maintenant", dx: 140, dy: 415
  },
  {
    app: "Téléphone", icone: "📞", couleur: "#34c759", appel: true, titre: "Appel entrant",
    texte: "+4182323289",
    heure: "il y'a deux minutes", dx: 10, dy: 2
  },
  {
    app: "Téléphone", icone: "📞", couleur: "#34c759", appel: true, titre: "Appel entrant",
    texte: "+4182323289",
    heure: "il y'a deux minutes", dx: 10, dy: 2
  },
  {
    app: "Téléphone", icone: "📞", couleur: "#34c759", appel: true, titre: "Appel entrant",
    texte: "+4182323289",
    heure: "il y'a deux minutes", dx: 10, dy: 2
  },

  {
    app: "Messages", icone: "💬", couleur: "#999", rond: true, photo: "./images/chantal.jpg", titre: "Doudou ❤️",
    texte: "Répond bébé stp",
    heure: "maintenant", dx: 150, dy: 80
  },
];

// Les notifications sortent par petits groupes pendant la montée, dans l'ordre de la liste.
// Les groupes sont répartis également entre ces deux zooms
const ZOOM_NOTIF_DEBUT = 3;
const ZOOM_NOTIF_FIN = 9;
const NOTIFS_PAR_GROUPE = 4; // combien de notifications sortent en même temps
const DELAI_DANS_GROUPE = 0.15; // en secondes, le petit retard entre deux notifications du même groupe

// Donne à chaque notification le zoom où elle sort et son retard dans son groupe
// ex. avec 39 notifications : 10 groupes (le dernier en a juste 3),
// donc (9 - 3) / 9 = un groupe à tous les 0.67 de zoom environ
const nombreGroupes = Math.ceil(notifications.length / NOTIFS_PAR_GROUPE);
const ecartGroupes = (ZOOM_NOTIF_FIN - ZOOM_NOTIF_DEBUT) / (nombreGroupes - 1);
for (let i = 0; i < notifications.length; i++) {
  const groupe = Math.floor(i / NOTIFS_PAR_GROUPE); // 0 pour les 4 premières, 1 pour les 4 suivantes...
  const placeDansGroupe = i % NOTIFS_PAR_GROUPE; // 0, 1, 2 ou 3

  notifications[i].zoom = ZOOM_NOTIF_DEBUT + ecartGroupes * groupe;
  notifications[i].delai = DELAI_DANS_GROUPE * placeDansGroupe;
}

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

  // Informe son.js qu'une notification vient d'être créée
  window.dispatchEvent(new CustomEvent("notification-affichee", {
    detail: n
  }));
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