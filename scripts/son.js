console.log("son.js est bien chargé");


/* Création des sons */

const musiqueFond = new Audio("./sons/musique_fond.mp3");
const sonVille = new Audio("./sons/son_ville.mp3");
const sonFeu = new Audio("./sons/feu.mp3");
const sonEspace = new Audio("./sons/son_espace.mp3");
const sonDezoom = new Audio("./sons/son_vent_dezoom.mp3");


// Tous ces sons doivent pouvoir tourner en boucle
musiqueFond.loop = true;
sonVille.loop = true;
sonFeu.loop = true;
sonEspace.loop = true;
sonDezoom.loop = true;


// Tous les volumes commencent à 0
musiqueFond.volume = 0;
sonVille.volume = 0;
sonFeu.volume = 0;
sonEspace.volume = 0;
sonDezoom.volume = 0;


let audioLance = false;


/* Démarrage de l'audio */

function lancerAudio() {

    // évite de lancer les sons plusieurs fois
    if (audioLance) {
        return;
    }

    audioLance = true;

    musiqueFond.play().catch(() => {});
    sonVille.play().catch(() => {});
    sonFeu.play().catch(() => {});
    sonEspace.play().catch(() => {});
    sonDezoom.play().catch(() => {});

    console.log("Audio lancé");
}


// Les navigateurs demandent généralement
// une interaction avant d'autoriser du son
window.addEventListener("pointerdown", lancerAudio, { once: true });
window.addEventListener("keydown", lancerAudio, { once: true });
window.addEventListener("wheel", lancerAudio, { once: true });


/* Fonction pour calculer une progression entre deux niveaux de zoom */

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


/* Fonction pour changer doucement un volume */

function volumeDoux(audio, volumeCible) {

    // rapproche progressivement le volume actuel
    // du volume demandé
    audio.volume += (volumeCible - audio.volume) * 0.10;

    // évite les très petites valeurs inutiles
    if (audio.volume < 0.001) {
        audio.volume = 0;
    }
}


/* Détection du mouvement de dézoom */

let zoomPrecedentSon = 0;
let dernierMouvement = 0;


/*Boucle principale du son */

function mettreAJourSons() {

    if (audioLance) {

        /* Musique de fond */

        volumeDoux(musiqueFond, 0.10);



        /* Ambiance de ville, entre 3 et 5 disparaît progressivement */

        let volumeVille = 0;

        if (zoom <= 3) {

            volumeVille = 0.45;

        } else if (zoom < 5) {

            const p = progression(3, 5);

            volumeVille = 0.45 * (1 - p);
        }

        volumeDoux(sonVille, volumeVille);



        /* Feu */

        let volumeFeu = 0;

        if (zoom <= 1.2) {

            // proche du feu : il est bien audible
            volumeFeu = 0.40;

        } else if (zoom < 3) {

            // entre 1.2 et 3, le feu disparaît progressivement
            const p = progression(1.2, 3);

            volumeFeu = 0.40 * (1 - p);
        }

        volumeDoux(sonFeu, volumeFeu);



        /* Espace */

        let volumeEspace = 0;

        if (zoom >= 7 && zoom < 9) {

            const p = progression(7, 9);

            volumeEspace = 0.45 * p;

        } else if (zoom >= 9) {

            volumeEspace = 0.45;
        }

        volumeDoux(sonEspace, volumeEspace);



        /* Son de dézoom */

        if (zoom > zoomPrecedentSon) {

            dernierMouvement = performance.now();

            console.log("Zoom lu par son.js :", zoom);
        }


        // Si le zoom a changé il y a moins de 250 ms,
        // le son de mouvement est audible.
        let volumeDezoom = 0;

        if (performance.now() - dernierMouvement < 250) {
            volumeDezoom = 0.20;
        }

        volumeDoux(sonDezoom, volumeDezoom);


        // mémorise le zoom actuel pour la prochaine frame
        zoomPrecedentSon = zoom;
    }


    // recommence à la prochaine image
    requestAnimationFrame(mettreAJourSons);
}


// Lance la boucle
mettreAJourSons();