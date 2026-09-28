# student-analytics-app
# 🎓 Student Analytics App

API REST de gestion des étudiants développée avec **FastAPI** et **PostgreSQL** dans le cadre de la formation ODC.

Le projet permet de gérer les étudiants à travers une API, de rechercher et paginer les données, d'archiver ou restaurer des étudiants et d'importer automatiquement des données provenant d'un fichier JSON.

---

## 📌 Présentation du projet

**Student Analytics App** est une application de gestion des données étudiantes composée de :

* un **backend REST** développé avec FastAPI ;
* une base de données **PostgreSQL** ;
* des données d'entrée au format **JSON** ;
* une interface frontend en **HTML / CSS / JavaScript** ;
* une documentation interactive de l'API grâce à **Swagger UI**.

L'objectif principal du projet est de mettre en pratique la création d'une API, la connexion à une base de données relationnelle et la manipulation de données provenant de différentes sources.

---

## 🎯 Objectifs

Ce projet permet de mettre en pratique :

* la création d'une API avec FastAPI ;
* la création et l'utilisation de routes REST ;
* la connexion entre Python et PostgreSQL ;
* les opérations CRUD sur les étudiants ;
* la pagination des résultats ;
* la recherche d'étudiants ;
* l'archivage et la restauration des étudiants ;
* la validation des données avec Pydantic ;
* l'importation de données JSON ;
* la gestion des relations entre étudiants, classes, matières et notes ;
* la communication entre frontend et backend avec CORS.

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │ HTML / CSS / JS     │
                    └──────────┬──────────┘
                               │
                               │ HTTP / REST
                               ▼
                    ┌─────────────────────┐
                    │       FastAPI       │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │  Fichier JSON   │         │   PostgreSQL    │
        │   valides.json  │────────►│    Database     │
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
* SQL

### Frontend

* HTML5
* CSS3
* JavaScript

### Données

* JSON
* CSV
* Pandas

### Documentation API

* Swagger UI
* OpenAPI

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
├── .env
├── .gitignore
├── requirements.txt
└── README.md
```

---

## ⚙️ Installation

### 1. Cloner le projet

```bash
git clone git@github.com:ramata-seck/student-analytics-app.git
cd student-analytics-app
```

### 2. Créer un environnement virtuel

```bash
python3 -m venv venv
```

Activer l'environnement :

```bash
source venv/bin/activate
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

---

## 🗄️ Configuration PostgreSQL

Le projet utilise PostgreSQL comme système de gestion de base de données.

Les informations de connexion sont stockées dans un fichier `.env` afin de ne pas exposer les identifiants dans le code source.

Exemple de structure :

```env
DB_HOST=localhost
DB_NAME=nom_de_la_base
DB_USER=nom_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_PORT=5432
```

> ⚠️ Le fichier `.env` ne doit pas être publié sur GitHub. Il est déjà exclu du dépôt grâce au `.gitignore`.

---

## 🏗️ Initialisation de la base de données

Le script SQL d'initialisation se trouve dans :

```text
Backend/sql/init.sql
```

Il permet de préparer la structure nécessaire au fonctionnement de l'application.

---

## ▶️ Lancer l'application

Depuis le dossier `Backend` :

```bash
cd Backend
uvicorn main:app --reload
```

L'API sera alors accessible à :

```text
http://127.0.0.1:8000
```

---

## 📚 Documentation de l'API

FastAPI génère automatiquement une documentation interactive.

### Swagger UI

```text
http://127.0.0.1:8000/docs
```

### OpenAPI

```text
http://127.0.0.1:8000/openapi.json
```

Swagger permet de tester directement les différentes routes de l'API.

---

# 🔌 Endpoints disponibles

## Vérification de l'API

### `GET /api/v1/health`

Permet de vérifier que le serveur fonctionne correctement.

Réponse :

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

Filtrer les étudiants archivés :

```text
GET /api/v1/etudiants?archive=true
```

---

### `GET /api/v1/etudiants/{id}`

Retourne les informations d'un étudiant à partir de son identifiant.

Exemple :

```text
GET /api/v1/etudiants/1
```

Si l'étudiant n'existe pas, l'API retourne une erreur `404`.

---

### `POST /api/v1/etudiants`

Permet d'ajouter un nouvel étudiant.

Exemple de données :

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

Permet de modifier certaines informations d'un étudiant existant.

Exemple :

```text
PATCH /api/v1/etudiants/1
```

Les informations pouvant être modifiées comprennent notamment :

* le nom ;
* le prénom ;
* la date de naissance ;
* la classe.

---

## 📦 Archivage des étudiants

### `POST /api/v1/etudiants/{id}/archive`

Permet d'archiver un étudiant.

```text
POST /api/v1/etudiants/1/archive
```

### `POST /api/v1/etudiants/{id}/restore`

Permet de restaurer un étudiant précédemment archivé.

```text
POST /api/v1/etudiants/1/restore
```

---

# 📥 Import des données JSON

### `POST /api/v1/import/json`

Cette route permet d'importer automatiquement les données présentes dans :

```text
data/valides.json
```

Le processus d'importation :

```text
valides.json
      │
      ▼
Lecture du fichier
      │
      ▼
Vérification / création des classes
      │
      ▼
Insertion des étudiants
      │
      ▼
Vérification / création des matières
      │
      ▼
Association étudiants ↔ matières
      │
      ▼
Insertion des notes
      │
      ▼
PostgreSQL
```

Cette fonctionnalité permet notamment de manipuler des données structurées provenant d'une source externe avant leur intégration dans une base relationnelle.

---

## 🔐 Gestion des variables d'environnement

Les informations sensibles ne sont pas directement écrites dans le code.

La connexion PostgreSQL utilise les variables définies dans `.env`.

Le fichier `.env` est exclu du dépôt grâce au `.gitignore`.

---

## 🌐 CORS

Le backend utilise le middleware **CORS** afin de permettre au frontend de communiquer avec l'API.

Cela permet notamment au frontend JavaScript d'effectuer des requêtes HTTP vers le backend FastAPI.

---

## 🖥️ Frontend

Le projet contient également une interface frontend développée avec :

* HTML ;
* CSS ;
* JavaScript.

Les fichiers principaux sont :

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

Le frontend communique avec les endpoints de l'API pour exploiter les données étudiantes.

---

## 🧪 Données

Le projet contient plusieurs fichiers utilisés pour la manipulation et l'importation des données :

```text
data/
├── valides.json
├── donnees_propres.csv
├── DONNEEJSON.py
└── matplot.py
```

Les données présentes dans `valides.json` sont des données fictives utilisées à des fins pédagogiques.

---

## 📈 Compétences mises en pratique

À travers ce projet, les principales compétences travaillées sont :

* développement d'API REST ;
* FastAPI ;
* Python ;
* SQL ;
* PostgreSQL ;
* conception de routes ;
* validation des données ;
* connexion application ↔ base de données ;
* import de données JSON ;
* manipulation de données ;
* pagination et recherche ;
* gestion des erreurs HTTP ;
* CORS ;
* documentation OpenAPI / Swagger ;
* séparation backend / frontend ;
* gestion des variables d'environnement ;
* Git et GitHub.

---

## 🚀 Améliorations possibles

Les évolutions suivantes pourraient être ajoutées ultérieurement :

* authentification et gestion des utilisateurs ;
* gestion plus complète des erreurs et des transactions ;
* amélioration de la gestion des doublons lors de l'import JSON ;
* ajout de statistiques dédiées ;
* tests automatisés avec Pytest ;
* conteneurisation avec Docker ;
* amélioration de la validation des données ;
* documentation API plus détaillée ;
* déploiement de l'application.

---

## 👩‍💻 Contexte

Projet réalisé dans le cadre de la formation **ODC**, avec pour objectif de mettre en pratique le développement d'API et la gestion de données.

---

## 📄 Licence

Projet réalisé à des fins pédagogiques.
