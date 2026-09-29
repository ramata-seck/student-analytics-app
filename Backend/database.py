import os
import psycopg2
from dotenv import load_dotenv

# Charger les variables du fichier .env
load_dotenv()


# CONNEXION À POSTGRESQL
def fonct_connexion():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT")
    )


