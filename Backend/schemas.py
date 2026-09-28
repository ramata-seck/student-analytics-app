from pydantic import BaseModel
from typing import Optional
from datetime import date

#SCHema pour creer un etudiant
class creer_Etudiant(BaseModel):
    code:str
    numero:str
    nom:str
    prenom:str
    date_de_naissance:date
    id_classe: int

#Schema pour modifier un etudiant (pour la modification tous les champs ne sont pas obligatoires)
class modifier_etudiant(BaseModel):
    nom:Optional[str]=None
    prenom:Optional[str]=None
    date_de_naissance:Optional[date]=None
    id_classe: Optional[int]=None
