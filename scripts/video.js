// La texture vidéo du jeu fige toute seule après quelques secondes
// (le navigateur n'arrive pas à suivre avec toutes les couches de la scène).
// si elle n'a pas avancé depuis la dernière vérification, on la relance.

const videoTexture = document.querySelector(".overlay video");
const DELAI_SURVEILLANCE = 500; // en ms
const FIN_VIDEO = 9.5; // en secondes, juste avant la fin de la vidéo (10 s)

let tempsPrecedent = -1; // où la vidéo était rendue à la dernière vérification

function surveillerVideo() {
  // même temps que la dernière fois = elle est figée
  if (videoTexture.currentTime === tempsPrecedent) {
    // on la pousse un peu plus loin, ça force le navigateur à la repartir
    // le % ramène au début si on dépasse la fin
    videoTexture.currentTime = (videoTexture.currentTime + 0.1) % FIN_VIDEO;
    videoTexture.play();
  }

  tempsPrecedent = videoTexture.currentTime;
}

setInterval(surveillerVideo, DELAI_SURVEILLANCE);
