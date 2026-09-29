# 🎓 Student Analytics App

Application web de gestion des étudiants développée avec **FastAPI**, **PostgreSQL**, **HTML/CSS** et **JavaScript** dans le cadre de la formation ODC.

Le projet permet de gérer les étudiants, leurs classes et leurs notes à travers une API REST et une interface frontend.

---

## 📌 Présentation du projet

**Student Analytics App** est une application de gestion des données étudiantes composée de :

* un backend REST développé avec **FastAPI** ;
* une base de données relationnelle **PostgreSQL** ;
* un frontend en **HTML / CSS / JavaScript** ;
* un système d'importation de données depuis un fichier **JSON** ;
* une gestion des **notes des étudiants** ;
* une documentation interactive de l'API avec **Swagger / OpenAPI**.

L'objectif du projet est de mettre en pratique le développement d'une API, la gestion d'une base de données relationnelle et l'intégration de données provenant de différentes sources.

---

## 🎯 Fonctionnalités

### 👨‍🎓 Gestion des étudiants

L'application permet de :

* consulter la liste des étudiants ;
* rechercher un étudiant ;
* paginer les résultats ;
* consulter le détail d'un étudiant ;
* ajouter un étudiant ;
* modifier les informations d'un étudiant ;
* archiver un étudiant ;
* restaurer un étudiant.

### 📝 Gestion des notes

L'application intègre également les **notes des étudiants**.

Les données permettent notamment de gérer :

* les matières ;
* les moyennes par matière ;
* les notes de devoirs ;
* les notes d'examen ;
* les relations entre étudiants et matières.

Les notes sont intégrées lors de l'importation des données JSON et sont stockées dans PostgreSQL.

### 📥 Importation JSON

L'application permet d'importer les données présentes dans :

```text
data/valides.json
```

L'importation permet de traiter :

```text
Étudiants
    ↓
Classes
    ↓
Matières
    ↓
Moyennes
    ↓
Devoirs
    ↓
Examens
```

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │       Frontend       │
                    │    HTML / CSS / JS   │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST
                               ▼
                    ┌──────────────────────┐
                    │       FastAPI        │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │   JSON source   │         │   PostgreSQL    │
        │  valides.json   │────────►│    Database     │
        └─────────────────┘         └─────────────────┘
```

---

## 🛠️ Technologies utilisées

### Backend

* **Python**
* **FastAPI**
* **Uvicorn**
* **Pydantic**
* **psycopg2**
* **python-dotenv**

### Base de données

* **PostgreSQL**
* **SQL**

### Frontend

* **HTML5**
* **CSS3**
* **JavaScript**

### Données

* **JSON**
* **CSV**
* **Pandas**

### Outils

* **Swagger / OpenAPI**
* **Git**
* **GitHub**

---

## 📁 Structure du projet

```text
student-analytics-app/
│
├── Backend/
│   ├── database.py
│   ├── main.py
│   ├── Query.sql
│   ├── schemas.py
│   │
│   ├── routes/
│   │   ├── etudiants.py
│   │   ├── import_json.py
│   │   └── stats.py
│   │
│   └── sql/
│       └── init.sql
│
├── data/
│   ├── DONNEEJSON.py
│   ├── donnees_propres.csv
│   ├── matplot.py
│   └── valides.json
│
├── Frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js
│   │   └── dashboard.js
│   ├── index.html
│   └── dashboard.html
│
├── scripts/
│   ├── run.sh
│   └── setup.sh
│
├── .gitignore
├── requirements.txt
└── README.md
```

---

# 🔌 API REST

## Vérification de l'API

### `GET /api/v1/health`

Permet de vérifier que le serveur fonctionne.

Exemple de réponse :

```json
{
  "status": "ok",
  "message": "Serveur en marche !"
}
```

---

## 👨‍🎓 Gestion des étudiants

### `GET /api/v1/etudiants`

Retourne la liste des étudiants.

La route prend en charge :

* la pagination ;
* la recherche ;
* le filtrage des étudiants archivés.

Exemple :

```text
GET /api/v1/etudiants?page=1&limite=5
```

Recherche :

```text
GET /api/v1/etudiants?recherche=Seck
```

Étudiants archivés :

```text
GET /api/v1/etudiants?archive=true
```

---

### `GET /api/v1/etudiants/{id}`

Permet de consulter un étudiant à partir de son identifiant.

```text
GET /api/v1/etudiants/1
```

---

### `POST /api/v1/etudiants`

Permet d'ajouter un étudiant.

Exemple :

```json
{
  "code": "ETU001",
  "numero": "20260001",
  "nom": "Seck",
  "prenom": "Rahma",
  "date_de_naissance": "2010-05-15",
  "id_classe": 1
}
```

---

### `PATCH /api/v1/etudiants/{id}`

Permet de modifier les informations d'un étudiant existant.

```text
PATCH /api/v1/etudiants/1
```

---

## 📦 Archivage

### `POST /api/v1/etudiants/{id}/archive`

Archive un étudiant.

```text
POST /api/v1/etudiants/1/archive
```

### `POST /api/v1/etudiants/{id}/restore`

Restaure un étudiant.

```text
POST /api/v1/etudiants/1/restore
```

---

# 📥 Importation des données

### `POST /api/v1/import/json`

Cette route permet d'importer les données depuis :

```text
data/valides.json
```

Le processus permet de :

1. lire le fichier JSON ;
2. vérifier ou créer les classes ;
3. insérer les étudiants ;
4. vérifier ou créer les matières ;
5. associer les étudiants aux matières ;
6. enregistrer les moyennes ;
7. enregistrer les notes de devoirs ;
8. enregistrer les notes d'examen ;
9. sauvegarder les données dans PostgreSQL.

### Flux d'importation

```text
                  valides.json
                       │
                       ▼
                 Lecture JSON
                       │
                       ▼
                   Classes
                       │
                       ▼
                  Étudiants
                       │
                       ▼
                   Matières
                       │
                       ▼
             ┌─────────┴─────────┐
             ▼                   ▼
        Devoirs              Examens
             │                   │
             └─────────┬─────────┘
                       ▼
                 PostgreSQL
```

---

# 📝 Structure des notes

Les notes sont organisées autour de la relation entre un étudiant et une matière.

```text
Étudiant
    │
    └── Matière
          │
          ├── Moyenne
          ├── Devoirs
          └── Examen
```

Cette organisation permet de conserver les informations académiques dans plusieurs tables reliées entre elles.

---

## 🖥️ Frontend

L'application possède une interface frontend développée avec :

* HTML ;
* CSS ;
* JavaScript.

Principaux fichiers :

```text
Frontend/
├── index.html
├── dashboard.html
├── css/
│   └── style.css
└── js/
    ├── app.js
    └── dashboard.js
```

Le frontend communique avec l'API FastAPI pour afficher et manipuler les données.

---

## 📚 Documentation API

FastAPI fournit automatiquement une documentation interactive.

### Swagger UI

```text
http://127.0.0.1:8000/docs
```

### OpenAPI

```text
http://127.0.0.1:8000/openapi.json
```

Swagger permet de tester directement les endpoints de l'API.

---

# ⚙️ Installation

## 1. Cloner le projet

```bash
git clone git@github.com:ramata-seck/student-analytics-app.git
cd student-analytics-app
```

## 2. Créer l'environnement virtuel

```bash
python3 -m venv venv
```

Activer l'environnement :

```bash
source venv/bin/activate
```

## 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

---

# 🗄️ Configuration PostgreSQL

Les paramètres de connexion à PostgreSQL sont stockés dans un fichier `.env`.

Exemple :

```env
DB_HOST=localhost
DB_NAME=nom_de_la_base
DB_USER=nom_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_PORT=5432
```

Le fichier `.env` est exclu du dépôt Git grâce au `.gitignore`.

---

# ▶️ Lancer le backend

Depuis le dossier `Backend` :

```bash
cd Backend
uvicorn main:app --reload
```

L'API est alors disponible à :

```text
http://127.0.0.1:8000
```

---

# 🧪 Tests avec Swagger

Une fois le serveur lancé, ouvrir :

```text
http://127.0.0.1:8000/docs
```

Les endpoints peuvent être testés directement depuis l'interface Swagger.

---

# 📊 Données

Les données du projet sont présentes dans :

```text
data/
├── valides.json
├── donnees_propres.csv
├── DONNEEJSON.py
└── matplot.py
```

Les données présentes dans `valides.json` sont des données fictives utilisées à des fins pédagogiques.

---

# 🔐 Sécurité

Les informations sensibles ne sont pas stockées directement dans le code source.

Les paramètres de connexion à PostgreSQL utilisent des variables d'environnement définies dans `.env`.

Le fichier `.env` est exclu du dépôt Git.

---

# 📈 Compétences mises en pratique

Ce projet m'a permis de travailler sur :

* développement d'API REST ;
* Python ;
* FastAPI ;
* PostgreSQL ;
* SQL ;
* Pydantic ;
* manipulation de données JSON ;
* relations entre tables ;
* gestion des étudiants ;
* gestion des notes ;
* pagination et recherche ;
* gestion des erreurs HTTP ;
* CORS ;
* documentation Swagger/OpenAPI ;
* séparation frontend/backend ;
* variables d'environnement ;
* Git et GitHub.

---

# 🚀 Améliorations possibles

Les évolutions suivantes peuvent être envisagées :

* ajouter une authentification ;
* améliorer la gestion des erreurs et des transactions ;
* renforcer la gestion des doublons lors de l'import JSON ;
* ajouter des tests automatisés avec Pytest ;
* ajouter des statistiques académiques ;
* conteneuriser l'application avec Docker ;
* améliorer la validation des données ;
* déployer l'application.

---

## 👩‍💻 Contexte

Projet réalisé dans le cadre de la formation **ODC**, avec pour objectif de mettre en pratique le développement d'API REST, la gestion de bases de données et l'intégration de données.

---

## 📄 Licence

Projet réalisé à des fins pédagogiques.
