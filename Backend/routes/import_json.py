from pathlib import Path
import json
import ast
import psycopg2
from fastapi import APIRouter
from database import fonct_connexion
#Creation d'une route: celle qui gere les routes de ce fchier
route=APIRouter()

#La route POST /api/v1/import/json
@route.post("/api/v1/import/json")
def import_json():

    connexion=fonct_connexion()
    curseur=connexion.cursor()
    #NB:
    #connexion — c'est le câble branché entre Python et ta base de données
    #curseur — c'est le stylo qui va écrire dans la base. Sans curseur, impossible d'envoyer des commandes SQL


    #LIRE LE FICHIER JSON
    BASE_DIR = Path(__file__).resolve().parents[2]
    fichier_json = BASE_DIR / "data" / "valides.json"

    with open(fichier_json, "r", encoding="utf-8") as fichier:
        etudiants = json.load(fichier)

    # parcourir la variable etudiants(liste de dictionnaire contenant les etudiants)
    for etudiant in etudiants:
        #On cherche d'abord  si le nom de la classe est dans la base de donnee-------------------------------------------------
        curseur.execute("SELECT id_classe FROM classes WHERE nom_classe=%s",
                        (etudiant["classe"],)
                         )
        row=curseur.fetchone() #recupere le resultat de la requete exécutée
        if row: #si ça existe alors
            id_classe=row[0] #recupere le premier element du tuple
        else: #sinon
            curseur.execute("INSERT INTO classes (nom_classe) VALUES (%s) RETURNING id_classe",
            (etudiant["classe"],) #on lui insert une classe depuis le fichier json
            )
            id_classe=curseur.fetchone()[0]

        #la table etudiants-------------------------------------------------
        curseur.execute("""
        INSERT INTO etudiants (code,numero,nom,prenom,date_de_naissance,id_classe) VALUES (%s,%s,%s,%s,TO_DATE(%s,'DD/MM/YYYY'),%s)
            ON CONFLICT (numero) DO NOTHING
            RETURNING id
        """,(etudiant["code"],
            etudiant["numero"],
            etudiant["nom"],
            etudiant["prenom"],
            etudiant["date_naissance"],
            id_classe,
            ))
        row=curseur.fetchone()
        if row:
            id_etudiant=row[0]
        else:
            curseur.execute(" SELECT id from etudiants WHERE numero=%s",
                            (etudiant["numero"],)
                            )
        #recupéré l'id de l'etudiant q'on vient d'inserer
            id_etudiant=curseur.fetchone()[0]

        #Transformer les notes en dictionnaire
        note=etudiant["notes"]
        note_dict=ast.literal_eval(note)

        #Inserer chaque matiere-------------------------------------------------
        for nom_matiere,donnees in note_dict.items():
            #moyenne_devoir=sum(detail["devoirs"])/len(detail["devoirs"]) if detail["devoirs"] else 0

            curseur.execute("SELECT id_matiere FROM matieres WHERE nom_matiere = %s",
                            (nom_matiere,))
            row=curseur.fetchone()
            if row:
                id_matiere=row[0]
            else:
                curseur.execute("""
                                INSERT INTO matieres (nom_matiere)
                                VALUES (%s) RETURNING id_matiere
                                """, (nom_matiere,)
                )
                id_matiere=curseur.fetchone()[0]

            #INSERER dans etudiant_matiere-------------------------------------------------
            curseur.execute("""
                INSERT INTO etudiant_matieres (id_etudiant,id_matiere,moyenne_matiere) VALUES (%s,%s,%s)
                RETURNING id_em
                """,(id_etudiant,id_matiere,donnees["moyenne"],))
            id_em=curseur.fetchone()[0]

            # INSERER LES NOTES  Devoirs  -------------------------------------------------
            for note in donnees["devoirs"]:
                curseur.execute("""
                INSERT INTO notes (id_em, valeur_note, type_note)
                VALUES (%s, %s, 'Devoir')
                    """, (id_em, note)
                )

           #INSERER LES NOTES  Examen  -------------------------------------------------
            curseur.execute("""
                INSERT INTO notes (id_em, valeur_note,type_note)
                VALUES (%s,%s,'Examen')
                """,(id_em,donnees["examen"])

                )
    #cette partie permet de sauvegarder avec commit et fermer avec close
    connexion.commit() #pour sauvegarder
    curseur.close()
    connexion.close()
    print("Insersion terminéééééééééééééé")

    return {"message": "Donnees importer avec succées!!!!!"}



