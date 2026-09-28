let page_actuelle=1
const limite=5 // nombre d'étudiant par page
let recherche="" // mot rechercher
let ongletactif="actifs" //

//Element du dom
let ajout = document.getElementById("btnaj")
//let tbody = document.getElementById("tbody")
let modstd = document.getElementById("studentModal")

let bouton1 = document.getElementById("btn1")
let bouton2 = document.getElementById("btn2")

// OUVRIR
ajout.addEventListener("click", () => {
    modstd.classList.add("active")
})

// FERMER
bouton1.addEventListener("click", () => {
    modstd.classList.remove("active")
})

// ENREGISTRER UN ETUDIANT
bouton2.addEventListener("click", async() => {

    //Récupération des valeurs remplis dans le formulaire
    const code = document.getElementById("code").value.trim()
    const numero = document.getElementById("num").value.trim()
    const nom = document.getElementById("etudnom").value.trim()
    const prenom = document.getElementById("etudpre").value.trim()
    const date_de_naissance = document.getElementById("daten").value.trim()
    const id_classe = parseInt(document.getElementById("id_classe").value)


    //Vérifier que tous les champs obligatoires sont remplis
    if (!nom || !prenom || !numero) {
        alert("Nom,prenomet numéro sont obligatoires")
        return
    }

    //ENvoyr les données a l'API

    const response = await fetch("http://127.0.0.1:8000/api/v1/etudiants", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            code: code,
            numero: numero,
            nom: nom,
            prenom: prenom,
            date_de_naissance: date_de_naissance,
            id_classe: id_classe
        })

    })
    const resultat = await response.json()

    if (response.ok) {
        alert("Etudiant ajouté avec succés")
        modstd.classList.remove("active")
        chargerEtudiants()
    }else {
        alert("Erreur:"+JSON.stringify(resultat.detail||resultat))
    }

})

// ── Vider le formulaire après ajout ──────────────────────
function viderFormulaire() {
    document.getElementById("code").value    = ""
    document.getElementById("num").value     = ""
    document.getElementById("etudnom").value = ""
    document.getElementById("etudpre").value = ""
    document.getElementById("daten").value   = ""
    document.getElementById("id_classe").value   = ""
}


//----------------------------------------------------------------------
//Fonction charger les etudiants
async function chargerEtudiants() {

    //Si on est sur Actifs archivé=False sinon archivé=True
    const archivefiltre=(ongletactif==="archives") ? "true":"false";
    //fech envoi une requete get a l'API
    const response = await fetch(`http://127.0.0.1:8000/api/v1/etudiants?page=${page_actuelle}&limite=${limite}&recherche=${recherche}&archive=${archivefiltre}`)

    //On convertit la reponse en tableau javascripty
    const donnee_etudiant = await response.json()

    //Appel a la fonction afficher etudiants
    afficher_etudiants(donnee_etudiant)
    pagination(donnee_etudiant.length)
}

//----------------------------------------------------------------------
//Fonction AFFICHER ETUDIANTS
function afficher_etudiants(donnee_etudiant){
    const tbody = document.getElementById("tbody")

    //On vide d'abord le tableau
    tbody.innerHTML = ""

    //Pour chaque etudiants on créé une ligne tr
    donnee_etudiant.forEach(etud => {
        const ligne=document.createElement("tr")
        //boiuton clicable selon l'action("archivé" ou "restaurer"
        const btnaction=ongletactif==="actifs"
        ? `<button class="btn_archiver" onclick="archiver(${etud.id})"> Archiver </button>`
            :`<button class="btn_restaurer" onclick="restaurer(${etud.id})"> Restaurer </button>`

        //SOURCE
        const source=etud.source==="JSON"
        ? `<span class="json"> JSON </span>`
            : `<span class="bdd"> BDD </span>`
        ligne.innerHTML += `
            <td>${etud.id}</td>
            <td class="edit-code">${etud.code }</td>
            <td>${etud.numero }</td>
            <td class="edit-nom">${etud.nom}</td>
            <td class="edit-prenom">${etud.prenom}</td>
            <td class="edit-date">${etud.date_de_naissance }</td>
            <td class="edit-classe">${etud.classe} </td>
            <td>  ${btnaction} </td>
            <td> ${source}  </td>
        `

        //DOUble clique mode édition
        ligne.addEventListener("dblclick", () => {
            if (ligne.classList.contains("en-edition")) return
            activemodification(ligne, etud)
        })
        tbody.appendChild(ligne)
    })
}
//Mis a jour pagination
function pagination(nbrecu){
    //const nbrepage= Math.ceil(etudiants.length / limite);
    document.getElementById("info_page").textContent=`page${page_actuelle}`

    //Désactiver précedent si on est à la page1
    document.getElementById("btn_prec").disabled=(page_actuelle===1)

    //Désactiver le suivant si on atteind la limite de page
    document.getElementById("btn_suivant").disabled=(nbrecu<limite)
}



//Recherche
document.getElementById("searchInput").addEventListener("input",function(){
    recherche=this.value //Recupérer ce que l'utilisateur va recherche
    page_actuelle=1
    chargerEtudiants()
})

//Pagination
document.getElementById("btn_prec").addEventListener("click",function(){
    if (page_actuelle>1){
        page_actuelle--
        chargerEtudiants()
    }
})

document.getElementById("btn_suivant").addEventListener("click",function(){
        page_actuelle++
        chargerEtudiants()
})

//Archiveé etudiants
async function archiver(id){
    await fetch(`http://127.0.0.1:8000/api/v1/etudiants/${id}/archive`,{method:"POST"
    })
    chargerEtudiants()
}

//restauré etudiants
async function restaurer(id){
    await fetch(`http://127.0.0.1:8000/api/v1/etudiants/${id}/restore`,{method:"POST"
    })
    chargerEtudiants()
}

// Archives---Actifs
document.querySelectorAll(".tab-btn").forEach(bouton=>{
    bouton.addEventListener("click",()=> {

        document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"))
        bouton.classList.add("active")
        ongletactif=bouton.dataset.tab
        page_actuelle=1

            chargerEtudiants()

    })
})
//IMPORTER LE JSON
document.getElementById("btn_import").addEventListener("click", async function() {
    const reponse = await fetch("http://127.0.0.1:8000/api/v1/import/json", {
        method: "POST"
    })
    const resultat = await reponse.json()
    alert(resultat.message)
    chargerEtudiants()
})


// MODIFICATION AVEC DOUBLE CLIQUE
function activemodification(ligne,etud) {
    ligne.classList.add("en-edition")
//Recupéré les cellules qu'on veut mofifier
    const cellCode=ligne.querySelector(".edit-code")
    const cellNom = ligne.querySelector(".edit-nom")
    const cellPrenom=ligne.querySelector(".edit-prenom")
    const cellDate=ligne.querySelector(".edit-date")
    const cellClasse=ligne.querySelector(".edit-classe")

  /*  // Sauvegarder les valeurs originale pour annuler
    const nomOg=etud.nom
    const prenomOg=etud.prenom
    const codeOg=etud.:code
    const dateOg=etud.date
    const classeOg=etud.classe
*/
    //Remplacer le texte par des inputs
    cellCode.innerHTML=`<input class="input-edition" value="${etud.code}">`
    cellNom.innerHTML=`<input class="input-edition" value="${etud.nom}">`
    cellPrenom.innerHTML=`<input class="input-edition" value="${etud.prenom}">`
    cellDate.innerHTML=`<input class="input-edition" value="${etud.date}">`
    cellClasse.innerHTML=`<input class="input-edition" value="${etud.classe}">`



    // Mettre le focus sur le premier champ
    cellNom.querySelector("input").focus()

    // ── Entrée = valider ─────────────────────────────────
    ligne.querySelectorAll(".input-edition").forEach(input=> {

    input.addEventListener("keydown", async function gererTouche(e) {

        if (e.key === "Enter") {
            const nouveauCode = cellCode.querySelector("input").value.trim()
            const nouveauNom = cellNom.querySelector("input").value.trim()
            const nouveauPrenom = cellPrenom.querySelector("input").value.trim()
            const nouvelleDate  = cellDate.querySelector("input").value
            const nouvelleClasse  = cellClasse.querySelector("input").value.trim()

            console.log("PATCH envoyé :", { nouveauCode, nouveauNom, nouveauPrenom, nouvelleDate, nouvelleClasse })

            // Envoyer le PATCH à l'API
            const response = await fetch(`http://127.0.0.1:8000/api/v1/etudiants/${etud.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code:            nouveauCode,
                    nom:            nouveauNom,
                    prenom:         nouveauPrenom,
                    date_naissance: nouvelleDate,
                    classe: nouvelleClasse
                })
            })

            if (response.ok) {
                alert("Étudiant modifié avec succès !")
            } else {
                alert("Erreur lors de la modification")
            }

            // Retirer l'écouteur et recharger
            ligne.removeEventListener("keydown", gererTouche)
            chargerEtudiants()
        }

        if (e.key === "Escape") {
            ligne.removeEventListener("keydown", gererTouche)
            chargerEtudiants() // Annuler et recharger les données originales
        }
    })
})
}
// ── PAGINATION ────────────────────────────────────────────────────────
function pagination(nbrecu) {
    document.getElementById("info_page").textContent = `page ${page_actuelle}`
    document.getElementById("btn_prec").disabled = (page_actuelle === 1)
    document.getElementById("btn_suivant").disabled = (nbrecu < limite)
}

document.getElementById("searchInput").addEventListener("input", function () {
    recherche = this.value
    page_actuelle = 1
    chargerEtudiants()
})

document.getElementById("btn_prec").addEventListener("click", function () {
    if (page_actuelle > 1) { page_actuelle--; chargerEtudiants() }
})

document.getElementById("btn_suivant").addEventListener("click", function () {
    page_actuelle++
    chargerEtudiants()
})

async function archiver(id) {
    await fetch(`http://127.0.0.1:8000/api/v1/etudiants/${id}/archive`, { method: "POST" })
    chargerEtudiants()
}

async function restaurer(id) {
    await fetch(`http://127.0.0.1:8000/api/v1/etudiants/${id}/restore`, { method: "POST" })
    chargerEtudiants()
}

document.querySelectorAll(".tab-btn").forEach(bouton => {
    bouton.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"))
        bouton.classList.add("active")
        ongletactif = bouton.dataset.tab
        page_actuelle = 1
        chargerEtudiants()
    })
})

document.getElementById("btn_import").addEventListener("click", async function () {
    const reponse = await fetch("http://127.0.0.1:8000/api/v1/import/json", { method: "POST" })
    const resultat = await reponse.json()
    alert(resultat.message)
    chargerEtudiants()
})

chargerEtudiants()
