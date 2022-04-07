import Gombo, { Routeur, Donnees } from "../fonctions.js";
import Crypto from "../crypto.js";
import Cookie from "../cookies.js";

let html = `
    <div class="identification">
        <h2 class="v-10">Identification</h2>

        <p>Accédez à votre espace pour personnaliser votre profil et visualiser le trafic généré par votre compte.
        </p>

        <section class="cols">
            <div class="col">
                <i class="fa fa-info fa-3x"></i>
                <p>Ne vous en faites pas. Si vous n'avez pas de compte, il sera créé automatiquement.</p>
            </div>
            <div class="v-ligne"></div>
            <div class="col">
                <form id="form-identification">
                    <div class="etape-email">
                        <label for="g-modal-email">Votre adresse e-mail</label>
                        <span class="description">Si vous n'avez pas de compte, il sera créé</span>
                        <input class="champ" type="email" name="email" placeholder="Renseignez une adresse e-mail valide"
                            spellcheck="false">
                        <div class="form-actions flex-end">
                            <button id="g-btn-next" class="g-btn clic">Continuer</button>
                        </div>
                    </div>
                    <div class="etape-pass cacher">
                        <label for="g-modal-email">Votre mot de passe</label>
                        <span class="description">Saisissez votre mot de passe</span>
                        <input class="champ" type="password" name="pass" placeholder="Renseignez votre mot de passe">
                        <div class="form-actions space-between">
                            <button id="g-btn-back" class="g-btn-blanc clic btn-back">Retour</button>
                            <button class="g-btn clic btn-acces">Accéder à mon espace</button>
                        </div>
                    </div>
                    <span class="message-erreur"></span>
                </form>
            </div>
        </section>
    </div>`;

export default {
    charger: () => {
        Gombo.select("main").contenu(html);
        Gombo.select(".banner h1").contenu("Espace personnel");
        Gombo.select(".banner p").contenu("Depuis vore espace personnel vous pouvez éditer votre compte afin de le rendre plus attrayant aux yeux des internautes.");

        let utilisateur = {};

        let message = Gombo.select("span.message-erreur");
        message.cacher();

        Gombo.afficher(".banner");

        Gombo.submit(".identification form", e => {
            e.preventDefault();
        });

        Gombo.all(".identification input", () => {
            message.cacher();
        });

        Gombo.clic("#g-btn-next", () => {
            message.cacher();
            Gombo.select("#g-btn-next").desactiver();
            let email = Gombo.select('#form-identification input[name="email"]').value;
            if (email) {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email)) {
                    utilisateur.email = email;
                    Donnees.verification(email, (u, erreur) => {
                        if (erreur) {
                            message.contenu("Erreur lors de la tentative de connexion");
                            message.afficher();
                        } else {
                            if (u.pass) {
                                utilisateur.pass = u.pass;
                                utilisateur.jeton = u.jeton;
                                Gombo.select(".etape-pass label").contenu("Votre mot de passe");
                                Gombo.select(".etape-pass .description").contenu("Saisissez votre mot de passe");
                                Gombo.select(".etape-pass input").setAttribute("placeholder", "Renseignez votre mot de passe");
                                Gombo.select(".etape-pass .g-btn").contenu("Accéder à mon espace");
                                Gombo.select(".etape-pass").dataset.creation = false;
                            } else {
                                Gombo.select(".etape-pass label").contenu("Créez un mot de passe");
                                Gombo.select(".etape-pass .description").contenu("Au moins 8 caractères");
                                Gombo.select(".etape-pass input").setAttribute("placeholder", "Renseignez un mot de passe");
                                Gombo.select(".etape-pass .g-btn").contenu("Créer mon compte");
                                Gombo.select(".etape-pass").dataset.creation = true;
                            }
                            Gombo.cacher(".etape-email");
                            Gombo.afficher(".etape-pass");
                            Gombo.select("#g-btn-next").activer();
                        }
                        Gombo.select(".etape-pass input").focus();
                    });
                } else {
                    Gombo.select("#g-btn-next").activer();
                    message.contenu("L'adresse e-mail saisie n'est pas valide");
                    message.afficher();
                }
            } else {
                Gombo.select("#g-btn-next").activer();
                message.contenu("Veuillez renseigner votre adresse e-mail");
                message.afficher();
            }
        });

        Gombo.clic("#g-btn-back", () => {
            message.cacher();
            Gombo.afficher(".etape-email");
            Gombo.cacher(".etape-pass");
        });

        Gombo.clic(".btn-acces", () => {
            message.cacher();
            Gombo.select(".btn-acces").desactiver();
            let creation = Gombo.select(".etape-pass").dataset.creation;
            let pass = Gombo.select('#form-identification input[name="pass"]').value;
            if (pass) {
                if (creation === "true") {
                    if (/.{8,}$/.test(pass)) {
                        utilisateur.pass = Crypto.md5(pass);
                        utilisateur.jeton = Crypto.md5(utilisateur.email + utilisateur.pass);
                        Donnees.nouveau("utilisateurs", utilisateur, (succes, erreur) => {
                            if (erreur) {
                                message.contenu("Une erreur s'est produite lors de la création de votre compte");
                                message.afficher();
                                Gombo.select(".btn-acces").activer();
                            } else {
                                Cookie.nouvSession();
                                Cookie.enreg("gombo_jeton", utilisateur.jeton, 60 * 24 * 365);
                                Cookie.enreg("creation", 1, 1);
                                Routeur.go("/mon-espace");
                            }
                        });
                    } else {
                        message.contenu("Votre mot de passe doit avoir au moins 8 caractères");
                        message.afficher();
                        Gombo.select(".btn-acces").activer();
                    }
                } else {
                    if (utilisateur.pass === Crypto.md5(pass)) {
                        Cookie.nouvSession();
                        Cookie.enreg("gombo_jeton", utilisateur.jeton, 60 * 24 * 365);
                        Routeur.go("/mon-espace");
                    } else {
                        message.contenu("Votre mot de passe est incorrect");
                        message.afficher();
                        Gombo.select(".btn-acces").activer();
                    }
                }
            } else {
                if (creation === "true")
                    message.contenu("Veuillez renseigner un mot de passe");
                else
                    message.contenu("Veuillez renseigner votre mot de passe");
                message.afficher();
                Gombo.select(".btn-acces").activer();
            }
        })
    }
};