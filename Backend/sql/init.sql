DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS etudiant_matieres CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS matieres CASCADE;
DROP TABLE IF EXISTS etudiants CASCADE;

DROP TYPE IF EXISTS type_note_enum;

CREATE TYPE type_note_enum AS ENUM('Devoir','Examen');

CREATE TABLE classes(
    id_classe SERIAL PRIMARY KEY,
    nom_classe TEXT,
    annee_scolaire VARCHAR(20)
         );

CREATE TABLE etudiants(
    id SERIAL PRIMARY KEY,
    code VARCHAR(10),
    numero VARCHAR(50) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_de_naissance DATE,
    id_classe INT,
    archive BOOLEAN DEFAULT FALSE,
    source VARCHAR(50) DEFAULT "BDD",
    FOREIGN KEY(id_classe) REFERENCES classes(id_classe)
                      );

CREATE TABLE matieres(
    id_matiere SERIAL PRIMARY KEY,
    nom_matiere VARCHAR(100) UNIQUE,
    coefficient INT,
    description TEXT
    );

CREATE TABLE etudiant_matieres(
    id_em SERIAL PRIMARY KEY,
    id_etudiant INT,
    id_matiere INT,
    moyenne_matiere FLOAT,
    FOREIGN KEY(id_etudiant) REFERENCES etudiants(id),
    FOREIGN KEY(id_matiere) REFERENCES matieres(id_matiere)
        );

CREATE TABLE notes(
    id_note SERIAL PRIMARY KEY,
    id_em INT,
    valeur_note FLOAT NOT NULL,
    type_note type_note_enum NOT NULL,
    FOREIGN KEY (id_em) REFERENCES etudiant_matieres(id_em)
    );


