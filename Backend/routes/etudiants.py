from fastapi import APIRouter, HTTPException
from database import fonct_connexion
from schemas import creer_Etudiant, modifier_etudiant

route = APIRouter()

# ── Route — Notes d'un étudiant ─────────────────────────
@route.get("/api/v1/etudiants/{id}/notes")
def get_notes_etudiant(id: int):

    connexion = fonct_connexion()
    curseur = connexion.cursor()

    # Vérifier que l'étudiant existe
    curseur.execute("""
        SELECT e.id, e.nom, e.prenom, c.nom_classe
        FROM etudiants e
        JOIN classes c ON e.id_classe = c.id_classe
        WHERE e.id = %s
    """, (id,))

    etudiant = curseur.fetchone()

    if not etudiant:
        curseur.close()
        connexion.close()
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")

    # Récupérer les matières et les notes
    curseur.execute("""
        SELECT
            m.nom_matiere,
            em.moyenne_matiere,
            n.valeur_note,
            n.type_note
        FROM etudiant_matieres em
        JOIN matieres m
            ON em.id_matiere = m.id_matiere
        JOIN notes n
            ON em.id_em = n.id_em
        WHERE em.id_etudiant = %s
        ORDER BY m.nom_matiere, n.type_note
    """, (id,))

    rows = curseur.fetchall()

    curseur.close()
    connexion.close()

    # Organiser les résultats
    matieres = {}

    for nom_matiere, moyenne, valeur, type_note in rows:

        if nom_matiere not in matieres:
            matieres[nom_matiere] = {
                "devoirs": [],
                "examen": None,
                "moyenne": float(moyenne)
            }

        if type_note == "Devoir":
            matieres[nom_matiere]["devoirs"].append(float(valeur))

        elif type_note == "Examen":
            matieres[nom_matiere]["examen"] = float(valeur)

    return {
        "etudiant": {
            "id": etudiant[0],
            "nom": etudiant[1],
            "prenom": etudiant[2],
            "classe": etudiant[3]
        },
        "matieres": matieres
    }
# ── Route — Notes d'un étudiant ─────────────────────────
@route.get("/api/v1/etudiants/{id}/notes")
def get_notes_etudiant(id: int):

    connexion = fonct_connexion()
    curseur = connexion.cursor()

    # Vérifier que l'étudiant existe
    curseur.execute("""
        SELECT e.id, e.nom, e.prenom, c.nom_classe
        FROM etudiants e
        JOIN classes c ON e.id_classe = c.id_classe
        WHERE e.id = %s
    """, (id,))

    etudiant = curseur.fetchone()

    if not etudiant:
        curseur.close()
        connexion.close()
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")

    # Récupérer les matières et les notes
    curseur.execute("""
        SELECT
            m.nom_matiere,
            em.moyenne_matiere,
            n.valeur_note,
            n.type_note
        FROM etudiant_matieres em
        JOIN matieres m
            ON em.id_matiere = m.id_matiere
        JOIN notes n
            ON em.id_em = n.id_em
        WHERE em.id_etudiant = %s
        ORDER BY m.nom_matiere, n.type_note
    """, (id,))

    rows = curseur.fetchall()

    curseur.close()
    connexion.close()

    # Organiser les résultats
    matieres = {}

    for nom_matiere, moyenne, valeur, type_note in rows:

        if nom_matiere not in matieres:
            matieres[nom_matiere] = {
                "devoirs": [],
                "examen": None,
                "moyenne": float(moyenne)
            }

        if type_note == "Devoir":
            matieres[nom_matiere]["devoirs"].append(float(valeur))

        elif type_note == "Examen":
            matieres[nom_matiere]["examen"] = float(valeur)

    return {
        "etudiant": {
            "id": etudiant[0],
            "nom": etudiant[1],
            "prenom": etudiant[2],
            "classe": etudiant[3]
        },
        "matieres": matieres
    }# ── Route — Notes d'un étudiant ─────────────────────────
@route.get("/api/v1/etudiants/{id}/notes")
def get_notes_etudiant(id: int):

    connexion = fonct_connexion()
    curseur = connexion.cursor()

    # Vérifier que l'étudiant existe
    curseur.execute("""
        SELECT e.id, e.nom, e.prenom, c.nom_classe
        FROM etudiants e
        JOIN classes c ON e.id_classe = c.id_classe
        WHERE e.id = %s
    """, (id,))

    etudiant = curseur.fetchone()

    if not etudiant:
        curseur.close()
        connexion.close()
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")

    # Récupérer les matières et les notes
    curseur.execute("""
        SELECT
            m.nom_matiere,
            em.moyenne_matiere,
            n.valeur_note,
            n.type_note
        FROM etudiant_matieres em
        JOIN matieres m
            ON em.id_matiere = m.id_matiere
        JOIN notes n
            ON em.id_em = n.id_em
        WHERE em.id_etudiant = %s
        ORDER BY m.nom_matiere, n.type_note
    """, (id,))

    rows = curseur.fetchall()

    curseur.close()
    connexion.close()

    # Organiser les résultats
    matieres = {}

    for nom_matiere, moyenne, valeur, type_note in rows:

        if nom_matiere not in matieres:
            matieres[nom_matiere] = {
                "devoirs": [],
                "examen": None,
                "moyenne": float(moyenne)
            }

        if type_note == "Devoir":
            matieres[nom_matiere]["devoirs"].append(float(valeur))

        elif type_note == "Examen":
            matieres[nom_matiere]["examen"] = float(valeur)

    return {
        "etudiant": {
            "id": etudiant[0],
            "nom": etudiant[1],
            "prenom": etudiant[2],
            "classe": etudiant[3]
        },
        "matieres": matieres
    }# ── Route — Notes d'un étudiant ─────────────────────────
@route.get("/api/v1/etudiants/{id}/notes")
def get_notes_etudiant(id: int):

    connexion = fonct_connexion()
    curseur = connexion.cursor()

    # Vérifier que l'étudiant existe
    curseur.execute("""
        SELECT e.id, e.nom, e.prenom, c.nom_classe
        FROM etudiants e
        JOIN classes c ON e.id_classe = c.id_classe
        WHERE e.id = %s
    """, (id,))

    etudiant = curseur.fetchone()

    if not etudiant:
        curseur.close()
        connexion.close()
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")

    # Récupérer les matières et les notes
    curseur.execute("""
        SELECT
            m.nom_matiere,
            em.moyenne_matiere,
            n.valeur_note,
            n.type_note
        FROM etudiant_matieres em
        JOIN matieres m
            ON em.id_matiere = m.id_matiere
        JOIN notes n
            ON em.id_em = n.id_em
        WHERE em.id_etudiant = %s
        ORDER BY m.nom_matiere, n.type_note
    """, (id,))

    rows = curseur.fetchall()

    curseur.close()
    connexion.close()

    # Organiser les résultats
    matieres = {}

    for nom_matiere, moyenne, valeur, type_note in rows:

        if nom_matiere not in matieres:
            matieres[nom_matiere] = {
                "devoirs": [],
                "examen": None,
                "moyenne": float(moyenne)
            }

        if type_note == "Devoir":
            matieres[nom_matiere]["devoirs"].append(float(valeur))

        elif type_note == "Examen":
            matieres[nom_matiere]["examen"] = float(valeur)

    return {
        "etudiant": {
            "id": etudiant[0],
            "nom": etudiant[1],
            "prenom": etudiant[2],
            "classe": etudiant[3]
        },
        "matieres": matieres
    }# ── Route — Notes d'un étudiant ─────────────────────────
@route.get("/api/v1/etudiants/{id}/notes")
def get_notes_etudiant(id: int):

    connexion = fonct_connexion()
    curseur = connexion.cursor()

    # Vérifier que l'étudiant existe
    curseur.execute("""
        SELECT e.id, e.nom, e.prenom, c.nom_classe
        FROM etudiants e
        JOIN classes c ON e.id_classe = c.id_classe
        WHERE e.id = %s
    """, (id,))

    etudiant = curseur.fetchone()

    if not etudiant:
        curseur.close()
        connexion.close()
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")

    # Récupérer les matières et les notes
    curseur.execute("""
        SELECT
            m.nom_matiere,
            em.moyenne_matiere,
            n.valeur_note,
            n.type_note
        FROM etudiant_matieres em
        JOIN matieres m
            ON em.id_matiere = m.id_matiere
        JOIN notes n
            ON em.id_em = n.id_em
        WHERE em.id_etudiant = %s
        ORDER BY m.nom_matiere, n.type_note
    """, (id,))

    rows = curseur.fetchall()

    curseur.close()
    connexion.close()

    # Organiser les résultats
    matieres = {}

    for nom_matiere, moyenne, valeur, type_note in rows:

        if nom_matiere not in matieres:
            matieres[nom_matiere] = {
                "devoirs": [],
                "examen": None,
                "moyenne": float(moyenne)
            }

        if type_note == "Devoir":
            matieres[nom_matiere]["devoirs"].append(float(valeur))

        elif type_note == "Examen":
            matieres[nom_matiere]["examen"] = float(valeur)

    return {
        "etudiant": {
            "id": etudiant[0],
            "nom": etudiant[1],
            "prenom": etudiant[2],
            "classe": etudiant[3]
        },
        "matieres": matieres
    }

# ── Route 6 — Liste des étudiants ───────────────────────
@route.get("/api/v1/etudiants")
def get_etudiants(page: int = 1, limite: int = 5, recherche: str = "",archive: bool=False):
    offset = (page - 1) * limite  # calcul de la page

    connexion = fonct_connexion()  # On appel la fonction (connexion) creer dans database.py
    curseur = connexion.cursor()
    curseur.execute(""" SELECT e.id, e.code,e.numero,e.nom,e.prenom,e.date_de_naissance,c.nom_classe,e.archive,e.source
     FROM etudiants e JOIN classes c ON e.id_classe=c.id_classe
     WHERE (e.nom ILIKE %s OR e.prenom ILIKE %s OR e.code ILIKE %s OR e.numero ILIKE %s OR c.nom_classe ILIKE %s) AND e.archive=%s Limit %s OFFSET %s

""", (f"%{recherche}%", f"%{recherche}%",f"%{recherche}%", f"%{recherche}%", f"%{recherche}%", archive, limite, offset))

    rows = curseur.fetchall()
    curseur.close()
    connexion.close()

    return [
        {
            "id": row[0],
            "code": row[1],
            "numero": row[2],
            "nom": row[3],
            "prenom": row[4],
            "date_de_naissance": str(row[5]),
            "classe": row[6],
            "archive": row[7],
            "source": row[8]
        }
        for row in rows
    ]


# ── Route 7 — Détail d'un étudiant ──────────────────────
@route.get("/api/v1/etudiants/{id}")
def get_un_etudiant(id: int):
    connexion = fonct_connexion() # On appel la fonction (connexion) creer dans database.py
    curseur = connexion.cursor()

    curseur.execute("SELECT * FROM etudiants WHERE id = %s", (id,))
    etudiant = curseur.fetchone()

    curseur.close()
    connexion.close()

    if not etudiant:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")

    return etudiant


# ── Route 8 — Ajouter un étudiant ───────────────────────
@route.post("/api/v1/etudiants")
def ajouter_etudiant(etudiant: creer_Etudiant):
    connexion = fonct_connexion()
    curseur = connexion.cursor()

    curseur.execute("""
        INSERT INTO etudiants
            (code, numero, nom, prenom, date_de_naissance, id_classe)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (
        etudiant.code,
        etudiant.numero,
        etudiant.nom,
        etudiant.prenom,
        etudiant.date_de_naissance,
        etudiant.id_classe
    ))

    id_nouveau = curseur.fetchone()[0]
    connexion.commit()
    curseur.close()
    connexion.close()

    return {"message": "Étudiant ajouté !", "id": id_nouveau}


# ── Route 9 — Modifier un étudiant ──────────────────────
@route.patch("/api/v1/etudiants/{id}")
def modifier_un_etudiant(id: int, donnees: modifier_etudiant): #id dit qui modifier, donnees dit quoi modifier
    connexion = fonct_connexion()
    curseur = connexion.cursor()

    champs = []
    valeurs = []

    if donnees.nom:
        champs.append("nom = %s")
        valeurs.append(donnees.nom)
    if donnees.prenom:
        champs.append("prenom = %s")
        valeurs.append(donnees.prenom)
    if donnees.date_de_naissance:
        champs.append("date_de_naissance = %s")
        valeurs.append(donnees.date_de_naissance)
    if donnees.id_classe:
        champs.append("id_classe = %s")
        valeurs.append(donnees.id_classe)

    if not champs: # si la liste(champs) est vide
        raise HTTPException(status_code=400, detail="Aucune donnée à modifier")

    valeurs.append(id)
    curseur.execute(f"""
        UPDATE etudiants SET {', '.join(champs)}
        WHERE id = %s
    """, valeurs)

    connexion.commit()
    curseur.close()
    connexion.close()
    return {"message": " Étudiant modifié !"}


# ── Route 10 — Archiver / Restaurer ─────────────────────
@route.post("/api/v1/etudiants/{id}/archive")
def archiver(id: int):
    connexion = fonct_connexion()
    curseur = connexion.cursor()
    curseur.execute(
        "UPDATE etudiants SET archive = TRUE WHERE id = %s", (id,)
    )
    connexion.commit()
    curseur.close()
    connexion.close()
    return {"message": " Étudiant archivé !"}


@route.post("/api/v1/etudiants/{id}/restore")
def restaurer(id: int):
    connexion = fonct_connexion()
    curseur = connexion.cursor()
    curseur.execute(
        "UPDATE etudiants SET archive = FALSE WHERE id = %s", (id,)
    )
    connexion.commit()
    curseur.close()
    connexion.close()
    return {"message": " Étudiant restauré !"}
