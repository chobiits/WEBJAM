console.log("son.js est bien chargé");


/* CRÉATION DES SONS */

const musiqueFond = new Audio("./sons/musique_fond.mp3");
const sonVille = new Audio("./sons/son_ville.mp3");
const sonFeu = new Audio("./sons/feu.mp3");
const sonEspace = new Audio("./sons/son_espace.mp3");
const sonDezoom = new Audio("./sons/son_vent_dezoom.mp3");

const sonNotification = new Audio("./sons/notification.mp3");
const sonAppel = new Audio("./sons/appel.mp3");


/* RÉGLAGES DES SONS */

// Les ambiances tournent en boucle
musiqueFond.loop = true;
sonVille.loop = true;
sonFeu.loop = true;
sonEspace.loop = true;
sonDezoom.loop = true;


// Les notifications sont des sons ponctuels
sonNotification.loop = false;
sonAppel.loop = false;


// Tous les sons d'ambiance commencent silencieux
musiqueFond.volume = 0;
sonVille.volume = 0;
sonFeu.volume = 0;
sonEspace.volume = 0;
sonDezoom.volume = 0;


// Sert à savoir si le navigateur a autorisé l'audio
let audioLance = false;


/* DÉMARRAGE DE L'AUDIO */

function lancerAudio() {

    // évite de relancer les sons plusieurs fois
    if (audioLance) {
        return;
    }

    audioLance = true;

    // Lance les sons en boucle.
    // Ils sont à volume 0 au départ.
    musiqueFond.play().catch(() => {});
    sonVille.play().catch(() => {});
    sonFeu.play().catch(() => {});
    sonEspace.play().catch(() => {});
    sonDezoom.play().catch(() => {});

    console.log("Audio lancé");
}



// normalement il faut une interaction avant d'autoriser le son
window.addEventListener("pointerdown", lancerAudio, { once: true });
window.addEventListener("keydown", lancerAudio, { once: true });
window.addEventListener("wheel", lancerAudio, { once: true });


/* ^progression */

// Retourne une valeur entre 0 et 1
// exemple :
// progression(3, 5)
// zoom 3 = 0
// zoom 4 = 0.5
// zoom 5 = 1
function progression(debut, fin) {

    let valeur = (zoom - debut) / (fin - debut);

    if (valeur < 0) {
        valeur = 0;
    }

    if (valeur > 1) {
        valeur = 1;
    }

    return valeur;
}


/* changement progressif du volume */

function volumeDoux(audio, volumeCible) {

    // Le volume se rapproche progressivement
    // du volume demandé
    audio.volume += (volumeCible - audio.volume) * 0.10;

    // évite de garder des valeurs minuscules
    if (audio.volume < 0.001) {
        audio.volume = 0;
    }
}


/* détection du dézoom */

let zoomPrecedentSon = 0;
let dernierMouvement = 0;


/* boucle principale */

function mettreAJourSons() {

    if (audioLance) {


        /* musique fond */

        volumeDoux(musiqueFond, 0.10);



        /* ville */

        let volumeVille = 0;

        if (zoom <= 3) {

            volumeVille = 0.45;

        } else if (zoom < 5) {

            const p = progression(3, 5);

            volumeVille = 0.45 * (1 - p);
        }

        volumeDoux(sonVille, volumeVille);



        /* feu*/

        let volumeFeu = 0;

        if (zoom <= 1.2) {

            volumeFeu = 0.40;

        } else if (zoom < 3) {

            const p = progression(1.2, 3);

            volumeFeu = 0.40 * (1 - p);
        }

        volumeDoux(sonFeu, volumeFeu);



        /* espace */

        let volumeEspace = 0;

        if (zoom >= 7 && zoom < 9) {

            const p = progression(7, 9);

            volumeEspace = 0.45 * p;

        } else if (zoom >= 9) {

            volumeEspace = 0.45;
        }

        volumeDoux(sonEspace, volumeEspace);



        /* son du dézoom */

        // Si le zoom vient réellement d'augmenter,
        // on mémorise le moment du mouvement
        if (zoom > zoomPrecedentSon) {

            dernierMouvement = performance.now();

            console.log("Zoom lu par son.js :", zoom);
        }


        let volumeDezoom = 0;

        // Le souffle reste audible pendant 250 ms
        // après le dernier changement de zoom
        if (performance.now() - dernierMouvement < 250) {
            volumeDezoom = 0.20;
        }

        volumeDoux(sonDezoom, volumeDezoom);


        // mémorise le zoom pour la prochaine image
        zoomPrecedentSon = zoom;
    }


    // Relance cette fonction à la prochaine image
    requestAnimationFrame(mettreAJourSons);
}


/* sons des notifications*/

// Joue un son ponctuel.
// On clone le fichier audio pour permettre à plusieurs notifications rapprochées de jouer sans se couper entre elles.
function jouerEffet(audioOriginal, volume, dureeMax = 1500) {

    const son = audioOriginal.cloneNode();

    son.loop = false;
    son.volume = volume;
    son.currentTime = 0;

    son.play().catch(() => {});


    // Sécurité : on arrête le son après un certain temps
    setTimeout(() => {

        son.pause();
        son.currentTime = 0;

    }, dureeMax);
}


/* reception notif*/

window.addEventListener("notification-affichee", (event) => {

    const notification = event.detail;

    // Attend le même délai que l'apparition
    // visuelle de la notification
    setTimeout(() => {

        if (!audioLance) {
            return;
        }


        // Si c'est un appel entrant
        if (notification.appel) {

            jouerEffet(
                sonAppel,
                0.30,
                2000
            );

        }

        // Sinon notification classique
        else {

            jouerEffet(
                sonNotification,
                0.20,
                1000
            );
        }

    }, notification.delai * 1000);

});


/* Lancement de la boucle principale */

mettreAJourSons();