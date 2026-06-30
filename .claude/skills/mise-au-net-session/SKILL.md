---
name: mise-au-net-session
description: Mettre au net la session de travail sur l'app « What works for me » (w.shoette.com) — consolider tout le travail dans un état propre, versionné et persisté (prod, Git, cahier des charges, doc produit, mémoire), et POUSSER sur GitHub d'office. À utiliser quand Elena dit « mets au net la session », « mise au net », « consolide la session », « fais le propre de la session ». NE PAS archiver la session. NE PAS écrire de nouveau code applicatif (le déploiement passe par le skill shoette-deploy ; la mise à jour de contenu du cahier passe par cahier-sync).
---

# Mise au net de la session — « What works for me »

Racine projet : `/Users/elenahagege/Documents/CODE TECH/W`.

## Principe directeur
> **Rien d'important ne doit rester uniquement dans le transcript.** Une fois la session
> froide (archivée / contexte compacté), seul survit ce qui a été persisté ailleurs. La
> mise au net fait passer tout le durable du contexte vers : **prod + Git + cahier
> versionné + doc produit + mémoire**.

## Ce que cette skill NE fait PAS
- **Pas d'archivage** de la session (Elena le fait elle-même).
- **Pas de nouveau code applicatif** ni de refonte. Elle *consolide et publie* l'existant.
- Elle **orchestre** les skills `shoette-deploy`, `cahier-sync`, `github-push` — sans
  dupliquer leur logique.

## Les 3 pages publiées (rôles distincts)
| Page | Source locale | FTP | URL | Rôle |
|---|---|---|---|---|
| Doc produit | `app-web/howitworks/index.html` | `/w/app/howitworks` | `https://w.shoette.com/app/howitworks/` | Guide utilisateur + note technique |
| Cahier **courant** | `app-web/cahier/` (`index.html` + `cahier-des-charges.md`) | `/w/app/cahier` | `https://w.shoette.com/app/cahier/` | Affiche la **dernière** version (le `.md` est fetché par `index.html`) |
| **Archive** des versions | `cahier/` (`index.html` + `view.html` + `cahier-des-charges-v*.md`) | `/w/cahier` | `https://w.shoette.com/cahier/` | **Liste** toutes les versions, **datées, commentées, téléchargeables** (récent en haut) |

Source canonique du cahier : `app-ios/cahier-des-charges-v{N}.md` (la plus haute = courante).

## Règle de versionnage du cahier (schéma A — snapshots numérotés)
- **`N`** : entier, **+1 à la *première* mise au net du jour** (un nouveau jour ⇒ nouveau numéro). Suit l'existant (v3 → v4).
- **Mises au net multiples le même jour** : on garde le même `N` et on ajoute un **suffixe daté + lettre** (`b`, `c`…) ; la 1ʳᵉ du jour n'a pas de suffixe.
  - 1ʳᵉ du jour : `cahier-des-charges-v4.md`
  - 2ᵉ le même jour : `cahier-des-charges-v4-2026-06-26b.md`
  - 3ᵉ : `cahier-des-charges-v4-2026-06-26c.md`
  - lendemain : `cahier-des-charges-v5.md`
- **En-tête de chaque nouvelle version** : numéro + **date (avec heure `HHhMM`)** + **commentaire** = le résumé de l'étape 1.
- ⚠️ Récupérer la date/heure réelles via `date` (ne jamais inventer).

## Étapes

### 1. Recenser & résumer (matière première, pas jetable)
`git log` depuis le début de la session + fichiers touchés (`git diff --stat`). En tirer un
**court résumé réutilisable**. Ce résumé sert **tel quel** dans : le **commentaire de
version** du cahier (étape 4), l'**entrée de l'archive `/cahier/`** (étape 6), la **note
d'état de session** (étape 11), les **messages de commit** (étape 8). Il oriente aussi les
vérifs/déploiements (quels fichiers changés).

### 2. Cohérence du code (si `app-web/app.js` ou `styles.css` ont été touchés)
Garde-fou récurrent (bug « page blanche ») :
```bash
cd "/Users/elenahagege/Documents/CODE TECH/W/app-web"
python3 -c "import re;c=open('app.js',encoding='utf-8').read();print('curly-delim:',len(re.findall(r'[:\(,]\s*[‘’]',c)));print('braces',c.count('{')-c.count('}'),'parens',c.count('(')-c.count(')'),'brackets',c.count('[')-c.count(']'))"
```
Attendu : `curly-delim: 0` et tous les diffs à `0`. Sinon corriger (remplacer les
guillemets typographiques **délimiteurs** par des apostrophes ASCII, en gardant les
apostrophes typographiques *à l'intérieur* des chaînes françaises).

### 3. Prod à jour & vérifiée
S'assurer que tout le travail est **déployé** (skill `shoette-deploy`, lftp bookmark
`shoette`, `set ftp:ssl-allow no`). Vérifier en ligne par **sha256 local ↔ servi** sur
chaque fichier changé, ex. :
```bash
for p in "app-web/app.js|https://w.shoette.com/app/app.js" "app-web/styles.css|https://w.shoette.com/app/styles.css"; do
  f=${p%|*};u=${p#*|};l=$(shasum -a256 "$f"|awk '{print $1}');r=$(curl -s "$u"|shasum -a256|awk '{print $1}')
  [ "$l" = "$r" ] && echo "✓ $u" || echo "✗ $u DIFFÈRE"
done
```

### 4. Cahier — générer la nouvelle version (schéma A)
1. **Consolider le contenu** via le skill `cahier-sync` (additif et sûr : ajoute tout ce
   qui manque, n'édite/supprime que l'obsolète en conflit, ne supprime jamais l'incompris).
2. Déterminer le **label** `v{N}` selon la règle de versionnage (lire les noms existants
   dans `cahier/` pour trouver le N le plus haut ; `date` pour le jour/heure).
3. Créer le **nouveau fichier numéroté** dans `app-ios/` ET `cahier/` (même contenu),
   avec un **en-tête** : numéro + date `JJ mois AAAA à HHhMM` + **commentaire** (résumé §1).

### 5. Mettre à jour `/app/cahier/` (cahier courant)
Copier le contenu de la nouvelle version vers le fichier servi, puis déployer :
```bash
cd "/Users/elenahagege/Documents/CODE TECH/W"
cp cahier/<nouveau-fichier>.md app-web/cahier/cahier-des-charges.md
( cd app-web/cahier && lftp shoette -e "set ftp:ssl-allow no; set net:timeout 20; cd /w/app/cahier; put cahier-des-charges.md; bye" )
```
(`app-web/cahier/index.html` fetch ce `.md` en `cache:'no-store'` → rien d'autre à bumper.
La bascule **EN reste « coming soon »** — ne pas traduire.)

### 6. Mettre à jour `/cahier/` (archive des versions)
1. Déposer le nouveau `.md` : `cp cahier/<nouveau-fichier>.md cahier/` (déjà fait à l'étape 4 si créé directement dans `cahier/`).
2. Éditer `cahier/index.html` :
   - **Ajouter un bloc `<article class="doc">` en HAUT** de la liste (récent en haut), sur le modèle des blocs existants : `doc__v` = « Version N », `doc__date` = date+heure, `doc__badge` = **« Version actuelle »**, `doc__desc` = commentaire (résumé §1), et les deux liens (`view.html?doc=<fichier>` + téléchargement `/cahier/<fichier>`).
   - **Rétrograder l'ancienne courante** : son badge passe de `<span class="doc__badge">Version actuelle</span>` à `<span class="doc__badge archive">Archivée</span>`.
   - **Ne PAS toucher** aux versions plus anciennes ni à `view.html` (archives figées).
   - **Ne PAS ajouter de liens retour** sur cette page.
3. Déployer :
```bash
( cd cahier && lftp shoette -e "set ftp:ssl-allow no; set net:timeout 20; cd /w/cahier; put index.html; put <nouveau-fichier>.md; bye" )
```
Vérifier en prod (sha256) le `.md` et que l'`index.html` liste bien la nouvelle version.

### 7. Doc produit `/app/howitworks/`
Mettre à jour `app-web/howitworks/index.html` si des écrans/fonctions ont changé pendant la
session (sections utilisateur + blocs techniques). Vérifier que les liens vers `/app/` et
`/app/cahier/` sont valides. Déployer (`put index.html` dans `/w/app/howitworks`).

### 8. Git — push d'office
Committer **tout** (code, cahiers `app-ios/` + `cahier/`, pages web, doc, mémoire) avec des
messages clairs (réutiliser le résumé §1), puis **pousser systématiquement** :
```bash
cd "/Users/elenahagege/Documents/CODE TECH/W"
git add -A && git commit -m "<résumé>" && git push origin main
```
Terminer les messages de commit par la ligne `Co-Authored-By: …` habituelle.
État cible : **working tree propre**, `main == origin/main`, **prod == git == local**.

### 9. Mémoire
Écrire les **faits durables** de la session dans `…/memory/` (un fichier = un fait) +
une ligne d'index dans `MEMORY.md` : décisions, gotchas, URLs, écrans, structure. Mettre à
jour / purger l'obsolète. (Ne pas dupliquer ce que le code/Git documente déjà.)

### 10. Fils en suspens — backlog + miroir Notes
Lister, pour ne rien oublier une fois la session froide : **tâches planifiées** encore
actives (scheduled tasks / cron), items **[ROADMAP]** ouverts, chips `spawn_task` non
traités, TODO/FIXME introduits.
- **Backlog global** : consigner dans `~/.claude/backlog.md` (sous le `##` du projet) tout
  sujet **discuté mais non codé** de la session ; retirer ce qui a été traité.
- **Synchroniser le miroir Apple Notes** (SYSTÉMATIQUE à chaque mise au net) :
  `bash ~/.claude/backlog-to-notes.sh` — reflète le `.md` dans la note « Backlog Claude »
  (sens unique, idempotent). Source canonique = le `.md`.
- **Transcript des sessions** : désormais **automatique** — le hook global `Stop`
  (`~/.claude/transcript-hook.py`) re-synchronise la session à **chaque échange** dans
  `~/Documents/CODE TECH/Transcripts/transcript-<sous-domaine>.shoette.com.md`. **Rien à faire ici.**
  (Reconstruction complète si besoin : `python3 ~/.claude/transcript-populate.py`.)
- **Contexte (base de connaissance)** (SYSTÉMATIQUE) : rafraîchir
  `~/Documents/CODE TECH/Contexts/contexte-<sous-domaine>.shoette.com.md` — distiller la
  **session courante** (1 sous-agent qui lit son transcript et renvoie objectif/décisions/
  construit-changé/état/gotchas/fils ouverts/vocabulaire), **ajouter sa section au Journal**,
  puis **réconcilier l'« État consolidé courant »** (la décision la plus récente gagne). C'est
  une tâche **modèle** (distillation), donc faite ici à la main, pas par hook. Backup avant écriture.

### 11. Note d'état de session
Écrire un récap **Fait / Décidé / À faire / Points de vigilance** dans un fichier mémoire
`project`, pour la passation à la prochaine session.

### 12. Nettoyage
Stopper les serveurs preview ; purger les temporaires (`/tmp/wwfm`, scratchpad).

### 13. Rapport final
Présenter à Elena un rapport à cases cochées : version créée (label + URL), pages
déployées (3) + vérifs sha256, état Git (poussé), mémoire mise à jour, fils en suspens
(**backlog + miroir Notes synchronisés**). Conclure par **« Session au net ✓ »** (sans archiver).

## Points de vigilance
- **Push d'office** : c'est la seule action sortante automatique assumée par cette skill
  (le reste du temps, la règle globale reste « déployer en prod, ne pas pousser sauf
  demande » — ici la demande est intégrée à la skill).
- **EN du cahier** : laisser « coming soon » (ne pas traduire).
- **`cahier-sync` cible `v3`** dans sa propre doc : si la version courante dépasse v3,
  signaler qu'il faudra faire évoluer cette référence (ou la mettre à jour) pour rester
  cohérent.
- **Archives figées** dans `/cahier/` : ne jamais modifier les versions antérieures,
  `view.html`, ni les blocs `article.doc` des anciennes versions (hors swap de badge).
