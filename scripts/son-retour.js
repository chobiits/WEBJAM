console.log("son-retour.js est bien chargé");


/* CRÉATION DES SONS */

const musiqueFondRetour = new Audio("./sons/musique_fond.mp3");
const sonVilleRetour = new Audio("./sons/son_ville.mp3");
const sonFeuRetour = new Audio("./sons/feu.mp3");
const sonEspaceRetour = new Audio("./sons/son_espace.mp3");
const sonMouvementRetour = new Audio("./sons/son_vent_dezoom.mp3");
const sonUtopique = new Audio("./sons/son_utopique.mp3");


/* RÉGLAGES */

musiqueFondRetour.loop = true;
sonVilleRetour.loop = true;
sonFeuRetour.loop = true;
sonEspaceRetour.loop = true;
sonMouvementRetour.loop = true;


sonUtopique.loop = false;


musiqueFondRetour.volume = 0;
sonVilleRetour.volume = 0;
sonFeuRetour.volume = 0;
sonEspaceRetour.volume = 0;
sonMouvementRetour.volume = 0;
sonUtopique.volume = 0;


let audioRetourLance = false;


/* DÉMARRAGE AUDIO */

function lancerAudioRetour() {

    if (audioRetourLance) {
        return;
    }

    audioRetourLance = true;

    musiqueFondRetour.play().catch(() => {});
    sonVilleRetour.play().catch(() => {});
    sonFeuRetour.play().catch(() => {});
    sonEspaceRetour.play().catch(() => {});
    sonMouvementRetour.play().catch(() => {});
    sonUtopique.play().catch(() => {});

    console.log("Audio retour lancé");
}


// La molette sera normalement la première interaction sur cette page
window.addEventListener("wheel", lancerAudioRetour, { once: true });
window.addEventListener("pointerdown", lancerAudioRetour, { once: true });
window.addEventListener("keydown", lancerAudioRetour, { once: true });


/* PROGRESSION ENTRE DEUX VALEURS */

function progressionRetour(debut, fin) {

    let valeur = (zoom - debut) / (fin - debut);

    if (valeur < 0) {
        valeur = 0;
    }

    if (valeur > 1) {
        valeur = 1;
    }

    return valeur;
}


/* CHANGEMENT DOUX DU VOLUME */

function volumeDouxRetour(audio, volumeCible) {

    audio.volume += (volumeCible - audio.volume) * 0.10;

    if (audio.volume < 0.001) {
        audio.volume = 0;
    }
}


/* DÉTECTION DU REZOOM */

let zoomPrecedentRetour = 10;
let dernierMouvementRetour = 0;


/* BOUCLE AUDIO */

function mettreAJourSonsRetour() {

    if (audioRetourLance) {


        /* MUSIQUE DE FOND */

        volumeDouxRetour(musiqueFondRetour, 0.08);



        /* ESPACE
           Fort au départ à zoom 10,
           puis disparaît entre 9 et 7 */

        let volumeEspace = 0;

        if (zoom >= 9) {

            volumeEspace = 0.45;

        } else if (zoom > 7) {

            const p = progressionRetour(7, 9);

            volumeEspace = 0.45 * p;
        }

        volumeDouxRetour(sonEspaceRetour, volumeEspace);



      /* SON UTOPIQUE */

        let volumeUtopique = 0;

        // Entre zoom 9 et 7, le son apparaît progressivement
        if (zoom <= 9 && zoom > 7) {

            const p = progressionRetour(7, 9);

            volumeUtopique = 0.40 * (1 - p);
        }

        // À partir de zoom 7, il reste jusqu'à la fin
        else if (zoom <= 7) {

            volumeUtopique = 0.40;
        }

        volumeDouxRetour(sonUtopique, volumeUtopique);





        /* SON DE MOUVEMENT

           Cette fois le zoom DIMINUE,
           donc on détecte zoom < zoomPrecedentRetour. */

        if (zoom < zoomPrecedentRetour) {

            dernierMouvementRetour = performance.now();
        }


        let volumeMouvement = 0;

        if (performance.now() - dernierMouvementRetour < 250) {
            volumeMouvement = 0.20;
        }

        volumeDouxRetour(
            sonMouvementRetour,
            volumeMouvement
        );


        // mémorise le zoom actuel
        zoomPrecedentRetour = zoom;
    }


    requestAnimationFrame(mettreAJourSonsRetour);
}


/* LANCEMENT */

mettreAJourSonsRetour();