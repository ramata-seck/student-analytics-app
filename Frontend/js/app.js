/* =========================================================
   VARIABLES GLOBALES
========================================================= */

let page_actuelle = 1;
const limite = 5;

let recherche = "";
let ongletactif = "actifs";


/* =========================================================
   ELEMENTS DU DOM
========================================================= */

const ajout = document.getElementById("btnaj");

const modstd = document.getElementById("studentModal");

const bouton1 = document.getElementById("btn1");
const bouton2 = document.getElementById("btn2");

const closeStudentModal =
    document.getElementById("closeStudentModal");


/* =========================================================
   MODAL AJOUT ÉTUDIANT
========================================================= */

ajout.addEventListener("click", () => {

    viderFormulaire();

    document.getElementById("ajoutetud").textContent =
        "Ajouter un étudiant";

    modstd.classList.add("active");

});


/* =========================================================
   FERMER MODAL ÉTUDIANT
========================================================= */

bouton1.addEventListener("click", () => {

    modstd.classList.remove("active");

});


closeStudentModal.addEventListener("click", () => {

    modstd.classList.remove("active");

});


/* =========================================================
   ENREGISTRER UN ÉTUDIANT
========================================================= */

bouton2.addEventListener("click", async () => {

    try {

        /* Récupération des valeurs */

        const code =
            document.getElementById("code").value.trim();

        const numero =
            document.getElementById("num").value.trim();

        const nom =
            document.getElementById("etudnom").value.trim();

        const prenom =
            document.getElementById("etudpre").value.trim();

        const date_de_naissance =
            document.getElementById("daten").value.trim();

        const id_classe =
            parseInt(
                document.getElementById("id_classe").value
            );


        /* Vérification */

        if (!nom || !prenom || !numero) {

            alert(
                "Le nom, le prénom et le numéro sont obligatoires."
            );

            return;
        }


        /* Appel API */

        const response = await fetch(
            "http://127.0.0.1:8000/api/v1/etudiants",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    code: code,

                    numero: numero,

                    nom: nom,

                    prenom: prenom,

                    date_de_naissance:
                        date_de_naissance,

                    id_classe: id_classe

                })
            }
        );


        const resultat =
            await response.json();


        if (response.ok) {

            alert(
                "Étudiant ajouté avec succès !"
            );

            modstd.classList.remove("active");

            viderFormulaire();

            chargerEtudiants();

        } else {

            alert(
                "Erreur : " +
                JSON.stringify(
                    resultat.detail || resultat
                )
            );
        }


    } catch (erreur) {

        console.error(erreur);

        alert(
            "Impossible de contacter le serveur."
        );

    }

});


/* =========================================================
   VIDER FORMULAIRE
========================================================= */

function viderFormulaire() {

    document.getElementById("code").value = "";

    document.getElementById("num").value = "";

    document.getElementById("etudnom").value = "";

    document.getElementById("etudpre").value = "";

    document.getElementById("daten").value = "";

    document.getElementById("id_classe").value = "1";

}


/* =========================================================
   CHARGER LES ÉTUDIANTS
========================================================= */

async function chargerEtudiants() {

    try {

        const archivefiltre =
            ongletactif === "archives"
                ? "true"
                : "false";


        const response = await fetch(
            `http://127.0.0.1:8000/api/v1/etudiants?page=${page_actuelle}&limite=${limite}&recherche=${encodeURIComponent(recherche)}&archive=${archivefiltre}`
        );


        if (!response.ok) {

            throw new Error(
                "Erreur lors du chargement des étudiants."
            );

        }


        const donnee_etudiant =
            await response.json();


        afficher_etudiants(donnee_etudiant);

        pagination(donnee_etudiant.length);


    } catch (erreur) {

        console.error(erreur);

        const tbody =
            document.getElementById("tbody");

        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="error-table">
                    Impossible de charger les étudiants.
                </td>
            </tr>
        `;

    }

}


/* =========================================================
   AFFICHER LES ÉTUDIANTS
========================================================= */

function afficher_etudiants(donnee_etudiant) {

    const tbody =
        document.getElementById("tbody");


    /* Vider le tableau */

    tbody.innerHTML = "";


    /* Aucun étudiant */

    if (donnee_etudiant.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-table">
                    Aucun étudiant trouvé.
                </td>
            </tr>
        `;

        return;
    }


    /* Parcourir les étudiants */

    donnee_etudiant.forEach(etud => {

        const ligne =
            document.createElement("tr");


        /* Bouton archiver / restaurer */

        const btnaction =
            ongletactif === "actifs"

                ? `
                    <button
                        class="btn_archiver"
                        onclick="archiver(${etud.id})"
                        title="Archiver l'étudiant"
                    >
                        <i class="fas fa-archive"></i>
                        Archiver
                    </button>
                  `

                : `
                    <button
                        class="btn_restaurer"
                        onclick="restaurer(${etud.id})"
                        title="Restaurer l'étudiant"
                    >
                        <i class="fas fa-undo"></i>
                        Restaurer
                    </button>
                  `;


        /* Source */

        const source =
            etud.source === "JSON"

                ? `<span class="json">JSON</span>`

                : `<span class="bdd">BDD</span>`;


        /* Date */

        const date =
            etud.date_de_naissance || "-";


        /* Ligne */

        ligne.innerHTML = `

            <td>
                ${etud.id}
            </td>

            <td class="edit-code">
                ${etud.code || "-"}
            </td>

            <td>
                ${etud.numero || "-"}
            </td>

            <td class="edit-nom">
                ${etud.nom || "-"}
            </td>

            <td class="edit-prenom">
                ${etud.prenom || "-"}
            </td>

            <td class="edit-date">
                ${date}
            </td>

            <td class="edit-classe">
                ${etud.classe || "-"}
            </td>

            <td>
                ${btnaction}
            </td>

            <td>
                ${source}
            </td>

            <td>

                <button
                    class="btn_notes"
                    onclick="voirNotes(${etud.id})"
                    title="Voir le relevé de notes"
                >
                    <i class="fas fa-graduation-cap"></i>
                    Voir notes
                </button>

            </td>

        `;


        /* Double clic = modification */

        ligne.addEventListener(
            "dblclick",
            () => {

                if (
                    ligne.classList.contains(
                        "en-edition"
                    )
                ) {

                    return;
                }

                activemodification(
                    ligne,
                    etud
                );

            }
        );


        tbody.appendChild(ligne);

    });

}


/* =========================================================
   PAGINATION
========================================================= */

function pagination(nbrecu) {

    document.getElementById(
        "info_page"
    ).textContent =
        `Page ${page_actuelle}`;


    document.getElementById(
        "btn_prec"
    ).disabled =
        page_actuelle === 1;


    document.getElementById(
        "btn_suivant"
    ).disabled =
        nbrecu < limite;

}


/* =========================================================
   RECHERCHE
========================================================= */

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        function () {

            recherche =
                this.value.trim();

            page_actuelle = 1;

            chargerEtudiants();

        }
    );


/* =========================================================
   PAGINATION - PRÉCÉDENT
========================================================= */

document
    .getElementById("btn_prec")
    .addEventListener(
        "click",
        function () {

            if (page_actuelle > 1) {

                page_actuelle--;

                chargerEtudiants();

            }

        }
    );


/* =========================================================
   PAGINATION - SUIVANT
========================================================= */

document
    .getElementById("btn_suivant")
    .addEventListener(
        "click",
        function () {

            page_actuelle++;

            chargerEtudiants();

        }
    );


/* =========================================================
   ARCHIVER
========================================================= */

async function archiver(id) {

    try {

        const response =
            await fetch(
                `http://127.0.0.1:8000/api/v1/etudiants/${id}/archive`,
                {
                    method: "POST"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Erreur lors de l'archivage."
            );

        }


        chargerEtudiants();


    } catch (erreur) {

        console.error(erreur);

        alert(
            "Impossible d'archiver cet étudiant."
        );

    }

}


/* =========================================================
   RESTAURER
========================================================= */

async function restaurer(id) {

    try {

        const response =
            await fetch(
                `http://127.0.0.1:8000/api/v1/etudiants/${id}/restore`,
                {
                    method: "POST"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Erreur lors de la restauration."
            );

        }


        chargerEtudiants();


    } catch (erreur) {

        console.error(erreur);

        alert(
            "Impossible de restaurer cet étudiant."
        );

    }

}


/* =========================================================
   ACTIFS / ARCHIVES
========================================================= */

document
    .querySelectorAll(".tab-btn")
    .forEach(bouton => {

        bouton.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".tab-btn")
                    .forEach(b => {

                        b.classList.remove(
                            "active"
                        );

                    });


                bouton.classList.add(
                    "active"
                );


                ongletactif =
                    bouton.dataset.tab;


                page_actuelle = 1;


                chargerEtudiants();

            }
        );

    });


/* =========================================================
   IMPORT JSON
========================================================= */

document
    .getElementById("btn_import")
    .addEventListener(
        "click",
        async function () {

            try {

                const reponse =
                    await fetch(
                        "http://127.0.0.1:8000/api/v1/import/json",
                        {
                            method: "POST"
                        }
                    );


                const resultat =
                    await reponse.json();


                if (!reponse.ok) {

                    throw new Error(
                        resultat.detail ||
                        "Erreur pendant l'import."
                    );

                }


                alert(
                    resultat.message
                );


                page_actuelle = 1;

                chargerEtudiants();


            } catch (erreur) {

                console.error(erreur);

                alert(
                    "Erreur lors de l'import JSON : " +
                    erreur.message
                );

            }

        }
    );


/* =========================================================
   MODIFICATION AVEC DOUBLE CLIC
========================================================= */

function activemodification(
    ligne,
    etud
) {

    ligne.classList.add(
        "en-edition"
    );


    /* Récupérer les cellules */

    const cellCode =
        ligne.querySelector(
            ".edit-code"
        );

    const cellNom =
        ligne.querySelector(
            ".edit-nom"
        );

    const cellPrenom =
        ligne.querySelector(
            ".edit-prenom"
        );

    const cellDate =
        ligne.querySelector(
            ".edit-date"
        );

    const cellClasse =
        ligne.querySelector(
            ".edit-classe"
        );


    /* Valeur date */

    const dateValue =
        convertirDatePourInput(
            etud.date_de_naissance
        );


    /* Transformer en inputs */

    cellCode.innerHTML = `
        <input
            class="input-edition"
            value="${etud.code || ""}"
        >
    `;


    cellNom.innerHTML = `
        <input
            class="input-edition"
            value="${etud.nom || ""}"
        >
    `;


    cellPrenom.innerHTML = `
        <input
            class="input-edition"
            value="${etud.prenom || ""}"
        >
    `;


    cellDate.innerHTML = `
        <input
            type="date"
            class="input-edition"
            value="${dateValue}"
        >
    `;


    cellClasse.innerHTML = `
        <input
            class="input-edition"
            value="${etud.classe || ""}"
        >
    `;


    /* Focus */

    cellNom
        .querySelector("input")
        .focus();


    /* Gestion clavier */

    ligne
        .querySelectorAll(
            ".input-edition"
        )
        .forEach(input => {

            input.addEventListener(
                "keydown",
                async function (e) {


                    /* ENTER = enregistrer */

                    if (e.key === "Enter") {

                        const nouveauCode =
                            cellCode
                                .querySelector("input")
                                .value
                                .trim();


                        const nouveauNom =
                            cellNom
                                .querySelector("input")
                                .value
                                .trim();


                        const nouveauPrenom =
                            cellPrenom
                                .querySelector("input")
                                .value
                                .trim();


                        const nouvelleDate =
                            cellDate
                                .querySelector("input")
                                .value;


                        const nouvelleClasse =
                            cellClasse
                                .querySelector("input")
                                .value
                                .trim();


                        try {

                            const response =
                                await fetch(
                                    `http://127.0.0.1:8000/api/v1/etudiants/${etud.id}`,
                                    {
                                        method: "PATCH",

                                        headers: {
                                            "Content-Type":
                                                "application/json"
                                        },

                                        body:
                                            JSON.stringify({

                                                code:
                                                    nouveauCode,

                                                nom:
                                                    nouveauNom,

                                                prenom:
                                                    nouveauPrenom,

                                                date_naissance:
                                                    nouvelleDate,

                                                classe:
                                                    nouvelleClasse

                                            })
                                    }
                                );


                            if (response.ok) {

                                alert(
                                    "Étudiant modifié avec succès !"
                                );

                                chargerEtudiants();

                            } else {

                                const resultat =
                                    await response.json();

                                alert(
                                    "Erreur : " +
                                    JSON.stringify(
                                        resultat.detail ||
                                        resultat
                                    )
                                );

                            }


                        } catch (erreur) {

                            console.error(erreur);

                            alert(
                                "Impossible de contacter le serveur."
                            );

                        }

                    }


                    /* ESCAPE = annuler */

                    if (e.key === "Escape") {

                        chargerEtudiants();

                    }

                }
            );

        });

}


/* =========================================================
   CONVERSION DATE
========================================================= */

function convertirDatePourInput(date) {

    if (!date) {

        return "";

    }


    /*
       Si l'API renvoie :
       1993-04-12
       on conserve directement.
    */

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {

        return date;

    }


    /*
       Si l'API renvoie :
       12/04/1993
    */

    if (
        /^\d{2}\/\d{2}\/\d{4}$/.test(date)
    ) {

        const morceaux =
            date.split("/");

        return `
            ${morceaux[2]}-
            ${morceaux[1]}-
            ${morceaux[0]}
        `.replace(/\s/g, "");

    }


    return "";

}


/* =========================================================
   =========================================================
   RELEVÉ DE NOTES
   =========================================================
========================================================= */


/* Elements du modal */

const notesModal =
    document.getElementById(
        "notesModal"
    );

const closeNotesModal =
    document.getElementById(
        "closeNotesModal"
    );

const closeNotesButton =
    document.getElementById(
        "closeNotesButton"
    );

const notesLoading =
    document.getElementById(
        "notesLoading"
    );

const notesContent =
    document.getElementById(
        "notesContent"
    );

const notesError =
    document.getElementById(
        "notesError"
    );

const notesErrorMessage =
    document.getElementById(
        "notesErrorMessage"
    );

const notesTableBody =
    document.getElementById(
        "notesTableBody"
    );


/* =========================================================
   OUVRIR LE RELEVÉ
========================================================= */

async function voirNotes(id) {

    /* Ouvrir le modal */

    notesModal.classList.add(
        "active"
    );


    /* Réinitialiser */

    notesLoading.classList.add(
        "active"
    );

    notesContent.classList.remove(
        "active"
    );

    notesError.classList.remove(
        "active"
    );

    notesTableBody.innerHTML = "";


    document.getElementById(
        "notesStudentInfo"
    ).textContent =
        "Chargement...";


    try {

        /* Appel de l'API */

        const response =
            await fetch(
                `http://127.0.0.1:8000/api/v1/etudiants/${id}/notes`
            );


        const resultat =
            await response.json();


        if (!response.ok) {

            throw new Error(
                resultat.detail ||
                "Impossible de récupérer les notes."
            );

        }


        /* Afficher les informations */

        afficherReleveNotes(
            resultat
        );


    } catch (erreur) {

        console.error(erreur);

        notesLoading.classList.remove(
            "active"
        );

        notesError.classList.add(
            "active"
        );

        notesErrorMessage.textContent =
            erreur.message ||
            "Impossible de charger les notes.";

    }

}


/* =========================================================
   AFFICHER LE RELEVÉ
========================================================= */

function afficherReleveNotes(data) {

    const etudiant =
        data.etudiant;


    const matieres =
        data.matieres;


    /* Informations étudiant */

    const nomComplet =
        `${etudiant.prenom} ${etudiant.nom}`;


    document.getElementById(
        "notesStudentInfo"
    ).textContent =
        `${nomComplet} — ${etudiant.classe}`;


    document.getElementById(
        "notesStudentName"
    ).textContent =
        nomComplet;


    document.getElementById(
        "notesStudentClasse"
    ).textContent =
        etudiant.classe;


    /* Vider tableau */

    notesTableBody.innerHTML = "";


    /* Vérifier les matières */

    const listeMatieres =
        Object.entries(matieres);


    if (listeMatieres.length === 0) {

        notesTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Aucune note disponible.
                </td>
            </tr>
        `;

    } else {

        /* Une ligne par matière */

        listeMatieres.forEach(
            ([nomMatiere, donnees]) => {

                const devoirs =
                    donnees.devoirs || [];


                const examen =
                    donnees.examen;


                const moyenne =
                    donnees.moyenne;


                const devoir1 =
                    devoirs[0] !== undefined
                        ? formaterNote(devoirs[0])
                        : "-";


                const devoir2 =
                    devoirs[1] !== undefined
                        ? formaterNote(devoirs[1])
                        : "-";


                const devoir3 =
                    devoirs[2] !== undefined
                        ? formaterNote(devoirs[2])
                        : "-";


                const devoir4 =
                    devoirs[3] !== undefined
                        ? formaterNote(devoirs[3])
                        : "-";


                const examenAffiche =
                    examen !== null &&
                    examen !== undefined
                        ? formaterNote(examen)
                        : "-";


                const moyenneAffiche =
                    moyenne !== null &&
                    moyenne !== undefined
                        ? formaterNote(moyenne)
                        : "-";


                const ligne =
                    document.createElement("tr");


                ligne.innerHTML = `

                    <td>
                        ${nomMatiere}
                    </td>

                    <td>
                        ${devoir1}
                    </td>

                    <td>
                        ${devoir2}
                    </td>

                    <td>
                        ${devoir3}
                    </td>

                    <td>
                        ${devoir4}
                    </td>

                    <td>
                        ${examenAffiche}
                    </td>

                    <td class="moyenne-cell">
                        ${moyenneAffiche}
                    </td>

                `;


                notesTableBody.appendChild(
                    ligne
                );

            }
        );

    }


    /* Affichage */

    notesLoading.classList.remove(
        "active"
    );

    notesContent.classList.add(
        "active"
    );

}


/* =========================================================
   FORMATAGE DES NOTES
========================================================= */

function formaterNote(note) {

    const nombre =
        Number(note);


    if (Number.isNaN(nombre)) {

        return "-";

    }


    /*
       Exemple :
       16       → 16
       16.5     → 16.5
       16.50    → 16.5
    */

    return Number.isInteger(nombre)
        ? nombre
        : nombre.toFixed(2);

}


/* =========================================================
   FERMER MODAL NOTES
========================================================= */

function fermerNotes() {

    notesModal.classList.remove(
        "active"
    );

}


closeNotesModal.addEventListener(
    "click",
    fermerNotes
);


closeNotesButton.addEventListener(
    "click",
    fermerNotes
);


/* =========================================================
   FERMER MODALS EN CLIQUANT À L'EXTÉRIEUR
========================================================= */

window.addEventListener(
    "click",
    function (event) {

        if (
            event.target === modstd
        ) {

            modstd.classList.remove(
                "active"
            );

        }


        if (
            event.target === notesModal
        ) {

            fermerNotes();

        }

    }
);


/* =========================================================
   TOUCHE ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            modstd.classList.remove(
                "active"
            );

            fermerNotes();

        }

    }
);


/* =========================================================
   DÉMARRAGE
========================================================= */

chargerEtudiants();
