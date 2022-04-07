import Gombo, {Routeur, Donnees} from './fonctions.js';
import PageIdentification from './vues/identification.js';
import PageMonEspace from './vues/espace.js';
import PageAccueil from './vues/home.js';

/* Définition des routes */

Routeur.add("/home", () => {
    PageAccueil.charger();
});

Routeur.add("/connexion", () => {
    PageIdentification.charger();
});

Routeur.add("/mon-espace", () => {
    PageMonEspace.charger();
});

/* Gestion des clics */

Gombo.clic("#g-btn-contact", () => {
    Gombo.afficher("#modal-contacter-equipe");
    Gombo.select("body").classe("overflow-hidden", true);
    Gombo.select("#g-btn-envoyer").activer();
});

Gombo.clic(".close", () => {
    fermerModale();
});

Gombo.clic("#g-btn-envoyer", () => {

    let form = document.forms.contact;
    let email = form["email"];
    let message = form["message"];

    if (email.value && message.value) {
        Gombo.select("#g-btn-envoyer").desactiver();
        let alerte = Gombo.select("#modal-contacter-equipe .alerte");
        alerte.classe("vert", false);
        alerte.classe("rouge", false);

        if (Gombo.validerEmail(email.value)) {
            let data = {
                email: email.value,
                message: message.value,
                timestamp: Donnees.fs.FieldValue.serverTimestamp()
            };
            Donnees.nouveau("retours", data, (doc, erreur) => {
                if (erreur) {
                    alerte.contenu("Une erreur s'est produite lors de l'envoi du message. Veuillez vérifier votre connexion internet et réessayer.");
                    alerte.classe("rouge", true);
                } else {
                    alerte.contenu("Le message a été envoyé. Merci pour votre intérêt. Nous vous répondrons rapidement si cela est nécessaire.");
                    alerte.classe("vert", true);
                }
                alerte.afficher();
                Gombo.select("#g-btn-envoyer").activer();
                setTimeout(fermerModale, 5000);
            });
        } else {
            Gombo.select("#g-btn-envoyer").activer();
            alerte.contenu("L'adresse e-mail saisie n'est pas valide.");
            alerte.classe("rouge", true);
            alerte.afficher();
        }
    }
});

Gombo.all("[data-lien]", (e) => {
    let lien = e.target.dataset.lien;
    Routeur.go(lien);
});

Gombo.all("#modal-contacter-equipe [name]", (e) => {
    Gombo.cacher("#modal-contacter-equipe .alerte");
});

function fermerModale() {
    Gombo.select("#modal-contacter-equipe input").value = "";
    Gombo.select("#modal-contacter-equipe textarea").value = "";
    Gombo.cacher("#modal-contacter-equipe .alerte");
    Gombo.cacher("#modal-contacter-equipe");
    Gombo.select("body").classe("overflow-hidden", false);
}

(function () {
    Donnees.init();
    document.addEventListener("DOMContentLoaded", () => {
        let url = location.href;
        let idx = url.indexOf("#");
        if (idx !== -1) {
            let route = url.split("#")[1];
            Routeur.go(route);
        } else {
            Routeur.go("/home");
        }
    });

})();