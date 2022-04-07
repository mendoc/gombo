let Utils = {
    select: (selector) => {
        let el = document.querySelector(selector);
        el.contenu = (html, cb) => {
            el.innerHTML = html;
            if (cb) cb();
        };
        el.clic = (cb) => {
            Utils.clic(selector, cb)
        };
        el.afficher = () => {
            Utils.afficher(selector)
        };
        el.cacher = () => {
            Utils.cacher(selector)
        };
        el.visible = () => {
            Utils.visible(selector)
        };
        el.invisible = () => {
            Utils.invisible(selector)
        };
        el.activer = () => {
            Utils.select(selector).removeAttribute("disabled");
        };
        el.desactiver = () => {
            Utils.select(selector).setAttribute("disabled", "");
        };
        el.classe = (classe, ajouter) => {
            if (ajouter) {
                el.classList.add(classe);
            } else {
                el.classList.remove(classe);
            }
            Utils.select(selector).setAttribute("disabled", "");
        };
        return el;
    },
    tout: (selector) => {
        return document.querySelectorAll(selector);
    },
    clic: (selector, cb) => {
        Utils.select(selector).addEventListener("click", cb);
    },
    submit: (form, cb) => {
        Utils.select(form).addEventListener("submit", cb);
    },
    submitOff: (form) => {
        Utils.select(form).addEventListener("submit", e => {
            e.preventDefault()
        });
    },
    all: (selector, cb) => {
        document.querySelectorAll(selector).forEach(element => {
            element.addEventListener("click", cb);
        });
    },
    afficher: (selector) => {
        Utils.select(selector).style.display = "block";
    },
    cacher: (selector) => {
        Utils.select(selector).style.display = "none";
    },
    visible: (selector) => {
        Utils.select(selector).style.visibility = "visible";
    },
    invisible: (selector) => {
        if (Utils.select(selector)) Utils.select(selector).style.visibility = "hidden";
    },
    validerEmail: (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email),
    requete: (url, data, cb) => {
        let httpRequest = new XMLHttpRequest();

        if (!httpRequest) {
            cb(false);
        }
        httpRequest.onreadystatechange = cb;
        httpRequest.open('POST', url);
        httpRequest.send(data);
    }
};

export let Routeur = {
    go: (route) => {
        if (!/#/.test(route)) route = "#" + route;
        if (Routeur.routes[route] !== undefined) {
            location.href = route;
            Routeur.routes[route].go()
        }
    },
    add: (route, cb) => {
        Routeur.routes["#" + route] = {go: cb};
    },
    routes: []
};

export let Donnees = {
        utilisateur: async (jeton) => {
            if (Donnees.db === undefined) return false;
            let q = await Donnees.db.collection("utilisateurs").where("jeton", "==", jeton).limit(1).get();
            return q.empty ? false : q.docs[0];
        },
        profils: (cb) => {
            if (Donnees.db === undefined) return cb(1, true);
            Donnees.db.collection("utilisateurs").get().then(qs => {
                cb(qs.docs, false);
            }).catch((e) => {
                console.log(e)
                cb(2, true);
            });
        },
        verification: (email, cb) => {
            if (Donnees.db === undefined) {
                cb(false, true);
            } else {
                Donnees.db.collection("utilisateurs").where("email", "==", email)
                    .get()
                    .then(function (querySnapshot) {
                        if (querySnapshot.empty) {
                            cb(false, false);
                        } else {
                            querySnapshot.forEach(function (doc) {
                                let u = doc.data();
                                cb(u, false);
                                return;
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log("Error getting documents: ", error);
                        cb(false, true);
                    });
            }
        },
        nouveau: (collection, obj, cb) => {
            if (Donnees.db === undefined) {
                cb(false, true);
            } else {
                Donnees.db.collection(collection).add(obj).then(function (doc) {
                    cb(doc, false);
                }).catch(function (error) {
                    cb(false, true);
                });
            }
        },
        init:
            () => {
                const firebaseConfig = {
                    apiKey: "AIzaSyBodBJulGkc_L-HXH1JWf9P5qglJHhZWoc",
                    authDomain: "gombo-ga.firebaseapp.com",
                    databaseURL: "https://gombo-ga.firebaseio.com",
                    projectId: "gombo-ga",
                    storageBucket: "gombo-ga.appspot.com",
                    messagingSenderId: "199323626262",
                    appId: "1:199323626262:web:0db39bf19a425e6bba3e37",
                    measurementId: "G-6Q22B664F9"
                };

                if (typeof firebase !== 'undefined') {
                    firebase.initializeApp(firebaseConfig);
                    Donnees.fs = firebase.firestore;
                    Donnees.db = firebase.firestore();
                }
            }
    }
;

export default Utils;