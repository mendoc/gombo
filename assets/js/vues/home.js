import Gombo, {Donnees} from "../fonctions.js";

let html = `
        <h2 class="v-10">Profils des développeurs</h2>

        <p>Ils conçoivent et administrent des sites internet, créent des applications web, des applications mobiles, des boutiques en ligne, etc.
        </p>
        <div class="chargement"></div>
        <section class="ligne cacher">
            <div class="profils"></div>
        </section>`;

const generer = (profil) => {
    if (!profil.nom) return;
    profil.tags = profil.tags.trim().split(",");
    if (profil.tags.length > 3) {
        profil.tags = profil.tags.slice(0, 3).join(", ");
    }
    Gombo.select("main .profils").innerHTML += `<div class="profil">
                    <div class="image"><img src="assets/img/profils/${Math.floor(Math.random() * 10) + 1}.png" class="gris" alt="${profil.prenom} ${profil.nom}"></div>
                    <span class="prenom">${profil.prenom} </span><span class="txt-vert txt-gras">${profil.nom}</span>
                    <span class="skills txt-gras">${profil.profil}</span>
                    ${profil.tags ? '<span class="skills txt-italique">' + profil.tags + '</span>' : ''}
                    <div class="contacts">
                        <ul>
                            ${profil.fb ? '<li><a href="' + profil.fb + '" target="_blank"><i class="fa fa-facebook"></i></a></li>' : ''}
                            ${profil.tw ? '<li><a href="' + profil.tw + '" target="_blank"><i class="fa fa-twitter"></i></a></li>' : ''}
                            ${profil.in ? '<li><a href="' + profil.in + '" target="_blank"><i class="fa fa-linkedin"></i></a></li>' : ''}
                            ${profil.gh ? '<li><a href="' + profil.gh + '" target="_blank"><i class="fa fa-github"></i></a></li>' : ''}
                        </ul>
                    </div>
                    ${profil.cv ? '<a href="' + profil.cv + '" target="_blank" class="g-btn clic">Plus de détails</a>' : ''}
                </div>`;

};

export default {
    charger: async () => {
        Gombo.select(".banner h1").contenu("Trouvez rapidement un développeur");
        Gombo.select(".banner p").contenu("Gombo est une plateforme permettant de trouver facilement un développeur. Que ce soit pour un projet ponctuel ou pour une offre d'emploi, vous êtes au bon endroit. Tout cela gratuitement.");
        Gombo.select("main").contenu(html);
        Gombo.select("main .profils").innerHTML = '';

        Donnees.profils((profils, erreur) => {
            if (!erreur) {
                profils.forEach(profil => {
                    generer(profil.data());
                });
            }
            Gombo.select("main section").afficher();
            Gombo.select(".chargement").cacher();
        })
    }
};