from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import import_json, etudiants

app = FastAPI()

# ── Autoriser le frontend à parler au backend ────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # autorise tout le monde
    allow_credentials=True,
    allow_methods=["*"],        # autorise GET, POST, PATCH...
    allow_headers=["*"],        # autorise tous les headers
)

# Route health
@app.get("/api/v1/health")
def health():
    return {"status": "ok", "message": "Serveur en marche !"}

# Enregistrement des routers
app.include_router(import_json.route)
app.include_router(etudiants.route)