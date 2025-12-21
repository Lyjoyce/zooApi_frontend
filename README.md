Ne pas lancer Eclipse à chaque fois

Avec Spring Boot : tu peux utiliser spring-boot:run dans ton terminal ou java -jar target/app.jar

Eclipse n’est plus obligatoire pour lancer l’application.

# 🚑 Fiche Git d’Urgence
Petite trousse de secours pour réparer rapidement ton dépôt GitHub (HTML/CSS/JS front-end).

## 1. Revenir à l’état GitHub (perdre mes modifs locales)
```bash
git fetch origin
git reset --hard origin/main


👉 Ton dossier local = identique à ce qu’il y a sur GitHub.

2. Supprimer le dernier push (revenir un commit en arrière sur GitHub)
git reset --hard HEAD~1
git push origin main --force


👉 Efface le dernier commit/push de GitHub et revient à l’état précédent.

3. Forcer GitHub à prendre ton code local (quand GitHub est “cassé”)
git push origin main --force


👉 Ton dépôt GitHub est remplacé par ton code local. ⚠️ Attention : ça écrase l’historique.

4. Vérifier l’état de ton dépôt local
git status


👉 Montre si tu as des fichiers modifiés/non commités.
