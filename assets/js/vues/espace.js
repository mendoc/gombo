import Gombo, {Routeur, Donnees} from "../fonctions.js";
import Cookie from "../cookies.js";

let html = `
    <div class="mon-espace">
        <h2 class="v-10">Mon profil</h2>
        <p>Complétez votre profil afin de rendre visible</p>
        <section class="informations">
                <div class="chargement"></div>
                <form name="infos" class="cacher">
                     <div class="alerte m-t-30 m-h-0 vert cacher">Votre compte a bien été créé. <br>Maintenant, veuillez compléter votre profil afin de le rendre visible</div>
                     <div class="cols">
                        <div class="col d-block">
                            <label for="nom">Votre nom</label>
                            <input class="champ" type="text" name="nom" id="nom">
                        </div>
                        <div class="col">
                            <label for="prenom">Votre prénom</label>
                            <input class="champ" type="text" name="prenom" id="prenom">
                        </div>
                    </div>
                    <div class="cols">
                        <div class="col w-100">
                            <label for="email">Votre adresse e-mail</label>
                            <input class="champ" type="email" disabled id="email">
                        </div>
                    </div>
                    <div class="cols">
                        <div class="col w-100">
                            <label for="profil">Votre profil</label>
                            <select name="profil" id="profil" class="champ">
                                <optgroup label="Web">
                                    <option>Développeur Front-End</option>
                                    <option>Développeur Back-End</option>
                                    <option>Développeur Fullstack</option>
                                    <option>Spécialiste CMS</option>
                                </optgroup>
                                <optgroup label="Mobile">
                                    <option>Développeur mobile</option>
                                </optgroup>
                                <optgroup label="Ordinateur">
                                    <option>Développeur d'application de bureau</option>
                                </optgroup>
                                <option>Autre</option>
                            </select>
                        </div>
                    </div>
                    <div class="cols">
                        <div class="col w-100">
                            <label for="tags">Outils, technologies, compétences</label>
                            <span class="description">Séparez les éléments par des virgules</span>
                            <input class="champ" type="text" name="tags" id="tags" autocomplete="off" placeholder="Exemple : JavasSript, Wordpress, DigitalOcean, AWS, Firebase, Cloud Computing">
                        </div>
                    </div>
                    <div class="cols">
                        <div class="col w-100">
                            <label for="cv">Lien de votre CV ou votre site personnel</label>
                            <span class="description">Si vous n'en avez pas, vous pouvez créer votre profil sur <a href="https://about.me" target="_blank">about.me</a></span>
                            <input class="champ" type="url" name="cv" id="cv" placeholder="Renseignez un lien vers votre CV ou site personnel">
                        </div>
                    </div>
                    <div class="cols">
                        <div class="col w-100">
                            <label for="fb">Réseaux sociaux</label>
                            <span class="description">Liens de vos réseaux sociaux. Laissez vide si vous n'en avez pas.</span>
                            <input class="champ" type="url" name="fb" id="fb" placeholder="Lien de votre profil Facebook">
                            <input class="champ" type="url" name="tw" placeholder="Lien de votre profil Twitter">
                            <input class="champ" type="url" name="in" placeholder="Lien de votre profil LinkedIn">
                            <input class="champ" type="url" name="gh" placeholder="Lien de votre profil Github">
                        </div>
                    </div>
                    <div class="cols">
                        <div class="col">
                            <button class="g-btn clic">Enregistrer les modifications</button>
                            <button class="g-btn-blanc clic" type="button" data-lien="#/home">Retour à l'accueil</button>
                        </div>
                    </div>
                    <div class="alerte alerte-message m-t-30 m-h-0 vert invisible"> Coucou</div>
                </form>
            </section>
    </div>`;

export default {
    charger: async () => {

        let session = Cookie.session();
        let jeton = Cookie.recup("gombo_jeton");

        // On vérifie si l'utilisateur est connecté
        if (session === "" || jeton === "") {
            document.removeEventListener("click", null);
            Routeur.go("/connexion");
            return;
        }

        Gombo.cacher(".banner");
        Gombo.select("main").contenu(html);

        let champs = Gombo.tout(".mon-espace form [name]");
        let message = Gombo.select(".mon-espace .alerte-message");

        let u = await Donnees.utilisateur(jeton);
        if (u) {
            let data = u.data();
            champs.forEach(champ => {
                if (data.hasOwnProperty(champ.name)) {
                    champ.value = data[champ.name]
                }
            });
            Gombo.select('[type="email"').value = data.email;
            Gombo.cacher(".chargement");
            Gombo.afficher("main form");

            if (Cookie.recup("creation") !== '') {
               Gombo.select(".mon-espace .alerte").afficher();
            }
        }

        Gombo.submit(".mon-espace form", async (e) => {
            e.preventDefault();
            Gombo.select("button.g-btn").desactiver();
            message.invisible();
            let infos = {};
            Gombo.tout(".mon-espace form [name]").forEach(champ => {
                infos[champ.name] = champ.value;
            });
            if (session !== "" && jeton !== "") {
                let u = await Donnees.utilisateur(jeton);
                if (u) {
                    u.ref.update(infos);
                    message.contenu("Bien ! <br> Modifications enregistrées.");
                    message.classe("vert", true);
                    message.classe("rouge", false);
                } else {
                    message.contenu("Une erreur s'est produite pendant l'enregistrement de vos informations.");
                    message.classe("rouge", true);
                    message.classe("vert", false);
                }
                message.visible();
                Gombo.select("button.g-btn").activer();
            } else {
                Routeur.go("/connexion");
            }
        });

        Gombo.clic(".mon-espace [data-lien]", (e) => {
            let lien = e.target.dataset.lien;
            Routeur.go(lien)
        });

        Gombo.all(".mon-espace [name]", (e) => {
            Gombo.invisible(".mon-espace .alerte-message");
        });

        document.addEventListener("click", () => {
            Cookie.nouvSession();
        })
    }
};