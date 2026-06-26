# What works for me — Cahier des charges (v4)

> **Version 4 — 26 juin 2026 à 22h55.** Mise au net de session. Ajouts depuis la v3 :
> (1) **Réglages → Choix du moteur** : nouvelle fonction *Analyse du ton de la voix*
> (manuel/local indisponibles ; via IA = analyse du son de la voix pour détecter l'humeur —
> stress, énervement, joie, etc.) ; (2) nouvelle partie **Réglages → Corrélations →
> Sources médicales** (sous-parties « URL d'API » et « Jeux de données » ; toggles, champs
> URL / import de fichier, recherche marketplace, « Ajouter une source » toujours visible)
> — **cosmétique**, en vue de la future version IA.
>
> **Statut du document.** Spécification complète et faisant autorité de l'application
> *What works for me* (journal de santé conversationnel + exploration de corrélations).
> Cette v4 consolide tout ce qui a été décidé, **y compris des fonctions pas encore
> présentes dans la démo web**. Elle remplace les versions précédentes
> (`cahier-des-charges.md`, `cahier-des-charges-v2.md`, `cahier-des-charges-v3.md`).
>
> **Public visé : Claude.** Ce document est écrit pour être implémenté par un agent
> Claude. Il est donc explicite sur les modèles de données, les algorithmes (avec
> formules), les comportements écran par écran, et les critères d'acceptation. Quand une
> fonction est « décidée mais pas encore codée », elle est marquée **[ROADMAP]** avec le
> détail d'implémentation attendu.

---

## 1. Objet & vision

**What works for me** est *« le journal de santé à qui tu parles »* (EN : *the health
journal you talk to*). L'utilisateur note son vécu de santé en **langage naturel**, sans
formulaire. L'app **structure** automatiquement chaque note (tags + valeurs), la
**range** par thème, et **explore des corrélations** entre facteurs (alimentation, météo,
sommeil…) et symptômes (douleur, brouillard mental…).

Promesse : obtenir des données de santé exploitables *sans remplir un seul formulaire*.

Garde-fou permanent : l'app **n'établit pas de diagnostic** et rappelle systématiquement
que **corrélation n'est pas causalité**. Les associations sont statistiques.

### Cibles de plateforme
- **Démo web (existant)** : PWA mobile-first, vanilla JS + PHP/OVH, local-first. Sert à
  valider les flux et le design. URL : `https://w.shoette.com/app/`.
- **App native iOS (cible)** : à développer. La démo web est la référence fonctionnelle.

---

## 2. Principes UX transverses

- **Mobile-first**, aéré, monochrome par thème (turquoise par défaut, corail en option).
- **Local-first** : tout est écrit en local puis synchronisé ; doit fonctionner hors-ligne.
- **Saisie zéro-friction** : texte libre, dictée vocale, photo. Pas de champs obligatoires.
- **Bilingue FR/EN**, bascule instantanée de toute l'interface.
- **Accessibilité** : taille de texte Normal / Grand (+12 %).
- **Polices** : display = *Space Grotesk* ; corps = *Inter*.
- **Navigation** : barre d'onglets bas (5 entrées) + accès *Mon compte* via le nom en
  haut à droite.

### Barre d'onglets (5)
`Journal` · `Données` · `Corrélations automatiques` · `Corrélations manuelles` · `Réglages`
Libellés **complets** (pas d'abréviation), sur 2 lignes si besoin, icône à côté du texte,
fins séparateurs verticaux entre items (non bord-à-bord). Repli sous 600 px : icône
au-dessus du texte.

---

## 3. Architecture technique

### Démo web (état actuel)
- **Front** : un seul fichier `app.js` (vanilla JS, IIFE), rendu par concaténation de
  chaînes HTML réinjectées dans `#app`. CSS unique `styles.css` (variables par thème).
- **Back** : `api.php` minimal sur hébergement mutualisé OVH. Comptes dans
  `data/store_<id>.json`. Mots de passe hashés bcrypt (`password_hash`). Actions :
  `signup`, `login`, `load`, `save`.
- **Persistance** : `localStorage` (clé `wwfm_store_<token>`) + sync serveur asynchrone
  via `persistStore()`. Session dans `wwfm_session`.
- **Déploiement** : FTP (lftp) vers `/w/app` sur le cluster OVH.

### Cible production / iOS [ROADMAP]
- Base de données (PostgreSQL ou SQLite) au lieu des fichiers JSON.
- Sessions signées (JWT ou session durcie), chiffrement at-rest des données de santé.
- Dictée vocale native, notifications push (Service Worker côté web, APNs côté iOS).
- Le schéma JSON ci-dessous est directement mappable sur un schéma relationnel.

---

## 4. Modèle de données (schéma du `store`)

Le `store` d'un compte est un objet JSON. `normStore()` garantit les valeurs par défaut.

```jsonc
{
  "profile": {
    "lang": "fr",                // 'fr' | 'en'
    "theme": "turquoise",        // 'turquoise' | 'coral'
    "textsize": "normal",        // 'normal' | 'large'
    "password": "…",             // EN CLAIR (démo test uniquement) — voir §12
    "createdAt": 1750000000000,  // ms ; défaut = date de la 1re entrée, sinon now()
    "sex": "F",                  // 'M' | 'F' | 'O' (sexe à la naissance) ; pour standards métaboliques
    "birthdate": "1990-05-12"    // 'YYYY-MM-DD'
  },
  "entries": [
    {
      "id": "e_xxx",
      "createdAt": 1750000000000,
      "text": "Dîner fromage, mains raides ce matin, temps humide",
      "photo": null,             // dataURL JPEG redimensionné, ou null
      "signals": [               // tags structurés (voir §6)
        { "category": "food", "label": "Fromage", "value": "Fromage", "confidence": 0.74 }
      ],
      "editedAt": 1750000500000  // présent SI l'entrée a été éditée après création
    }
  ],
  "correlations": {              // dictionnaire persistant des corrélations AUTO (clé = trigger)
    "fromage": {
      "key": "fromage", "label": "Fromage",
      "incidents": 4, "days": 5, "band": "moderate", "ratio": 0.8,
      "observedAt": 1750000000000, "windowDays": 3,
      "current": true,           // présent dans le dernier run
      "pinned": false,           // épinglé par l'utilisateur (toujours affiché)
      "hidden": false            // masqué par l'utilisateur
    }
  },
  "corrWindow": 3,               // fenêtre d'analyse auto : 1 | 3 | 7 (jours)
  "recapDays": 7,                // fenêtre du Récap Données : 7 | 14 | 30
  "corrBtnStyle": "icons",       // 'icons' | 'iconstext' (boutons pin/masquer)
  "manual": {                    // corrélations manuelles (voir §10)
    "factors": ["heure du coucher", "qualité de la nuit"],
    "saved": [                   // liste PERSISTANTE des analyses lancées, dédupliquée par facteurs
      {
        "key": "heure du coucher | qualité de la nuit", // facteurs normalisés (minuscules) + triés
        "mode": "pair",          // 'pair' (2 facteurs) | 'multi' (3+)
        "pair": {  },            // OU "multi": { } selon le mode (détails §10.3)
        "pinned": false,         // épinglée par l'utilisateur (tri en tête)
        "hidden": false,         // masquée (bascule dans l'archive)
        "createdAt": 1750000000000
      }
    ]
  },
  "lastAnalysisAt": 1750000000000, // dernier run de l'analyse auto
  "insights": []                 // legacy (ne plus utiliser ; remplacé par correlations)
}
```

**Champs hors `store`** (identité de compte, non transplantés à l'import) :
`token` (= id de compte), `email`, et copie session de lang/theme/textsize.

---

## 5. Authentification

- Écran d'accueil : logo, tagline, e-mail + mot de passe, bascule **Créer un compte /
  Se connecter**.
- `signup` / `login` via `api.php` ; **repli local** (`localSignup`/`localLogin`) si le
  réseau échoue.
- À l'inscription **et** à la connexion, le mot de passe saisi est **capturé** et rangé
  dans `profile.password` (pour l'affichage en clair dans *Mon compte*, voir §9.6 et §12).
- Validation : e-mail + mot de passe requis. Messages d'erreur i18n
  (`errMissing`/`errExists`/`errNouser`/`errBadpass`).

---

## 6. Taxonomie & moteur d'attribution de tags

### 6.1 Catégories (12)
| clé | emoji | FR | EN | rôle corrélation auto |
|---|---|---|---|---|
| `sleep` | 😴 | Sommeil | Sleep | — |
| `food` | 🍽️ | Alimentation | Food | **trigger** |
| `mood` | 🙂 | Humeur | Mood | — |
| `energy` | ⚡️ | Énergie | Energy | — |
| `pain` | 🩹 | Douleur | Pain | **symptôme (flag)** |
| `stress` | 🌀 | Stress | Stress | — |
| `symptom` | 🌡️ | Symptômes | Symptoms | **symptôme (flag)** |
| `brain_fog` | 🌫️ | Brouillard mental | Brain fog | **symptôme (flag)** |
| `meds` | 💊 | Médicaments | Medication | — |
| `activity` | 🏃 | Activité | Activity | — |
| `measure` | 📊 | Mesures | Measurements | — |
| `environment` | ⛅️ | Environnement / Climat | Environment / Climate | **trigger** |
| `other` | 📝 | Divers | Other | — |

`RECAP_KEYS` (ordre du Récap Données) : `sleep, food, mood, energy, pain, stress,
brain_fog, environment`.

### 6.2 Moteur de tags (existant, 100 % client)
- `structureEntry(text)` met le texte en minuscules, teste des **listes de mots-clés**
  codées en dur par catégorie. Premier mot-clé trouvé → tag de la catégorie.
- Extraction de **valeurs numériques** : sommeil (`Xh`), tension (`120/80 mmHg`),
  glycémie (`mg/dl`, `g/l`), poids (`kg`), pouls (`bpm`).
- Si rien ne matche → tag `other`. Détection de **négation** simple (pas/peu/sans/no/bad…)
  pour qualifier sommeil/humeur/énergie en « plutôt difficile » vs « noté ».
- Latence nulle, coût zéro (aucun appel réseau, aucun token).

### 6.3 [ROADMAP] Apprentissage des re-qualifications (`userRules`)
Quand l'utilisateur corrige/ajoute un tag sur une entrée, **mémoriser la règle** pour les
saisies futures.
- Stocker `profile.userRules = { "<mot/expression>": ["food","symptom"], ... }`.
- `structureEntry` consulte `userRules` **en priorité** sur les listes génériques.
- Prévoir résolution de conflits (règle utilisateur > règle générique) et une action
  « réappliquer mes règles aux entrées passées ».
- **Sans token** (déterministe). C'est l'évolution attendue par l'utilisatrice (ex :
  « soif » → Alimentation **et** Symptôme).

### 6.4 [ROADMAP] Classification LLM (option hybride)
Appel à l'API Anthropic (Claude) pour classer les entrées : compréhension du langage
naturel, multilinguisme, négations, contexte. Mode **hybride** : règles locales d'abord,
LLM en repli si confiance basse. Coût : latence ~300–800 ms + ~50–150 tokens d'input par
entrée. Implique d'envoyer des données de santé à un tiers → **point de gouvernance à
trancher** (consentement, anonymisation).

---

## 7. Écran Journal

### 7.1 Ajouter une entrée
- Zone de saisie en haut (textarea), placeholder d'exemple.
- **Texte libre** + **dictée vocale** (Web Speech API en démo ; native en iOS) +
  **photo** (redimensionnée ≤ 1000 px, JPEG qualité 0.7).
- **Raccourcis rapides** sous la zone : *😴 Ma nuit*, *🍽️ Mon repas*, *🩹 Une douleur*,
  *🙂 Mon humeur* (pré-remplissent un début de phrase).
- À l'envoi : entrée **horodatée**, **taguée** (`structureEntry`), **sauvegardée**, toast
  de confirmation.

### 7.2 Entrées sollicitées (pull)
Section **au milieu de l'écran**, entre la saisie libre (7.1) et le journal (7.3) : les
**saisies sollicitées par l'app** (« pull »), par opposition à la saisie libre spontanée.

- **Présentation** : encart **sans fond**, simple **bordure fine** (`--c-100`), badge
  « **Proposé par l'app** » + titre « **Entrées sollicitées** ». Le haut de page (saisie
  libre + sollicitations) reste **neutre/blanc** ; la démarcation visuelle se fait par le
  **fond teinté de la section « Ton journal »** en dessous (voir §7.3).
- **Toujours visible** : la section est **affichée en permanence**, même lorsqu'aucune
  sollicitation n'est en attente — dans ce cas elle conserve son en-tête et affiche le
  message « *Aucune sollicitation en attente pour le moment.* ». *(Comportement et message
  validés.)*
- **Encarts pré-renseignés**, à compléter (ou non) puis envoyer. Deux types :
  - **Question ouverte** : champ texte pré-rempli (ex. « J'ai mangé … ») + boutons
    **Envoyer** / **Ignorer**.
  - **Oui / Non** : boutons **Oui** / **Non** + **Ignorer**.
- **Effet** : répondre **crée une vraie entrée de journal** (horodatée, **auto-taguée** via
  `structureEntry`), puis l'encart disparaît ; *Ignorer* le retire sans saisie.
- **Règles de déclenchement** (quelles sollicitations, et quand) : consignées dans
  **Réglages → Entrées sollicitées / « Pull Input »** (voir §12).
- **[ROADMAP]** Le **moteur de déclenchement** (évaluation des conditions + notification
  *push*) n'est pas encore actif : en démo, les sollicitations d'exemple restent affichées
  jusqu'à réponse ou *Ignorer*. Le **mode de déclenchement** (à la main / local / IA) est
  exposé dans **Réglages → « Choix du moteur »**, ligne *moteur de sollicitation d'entrées*
  (voir §12).

### 7.3 Consulter le journal
- Liste anti-chronologique. Fenêtre par défaut : **dernières 24 h** ; bouton
  *Afficher plus* (+24 h par clic).
- **Recherche** textuelle temps réel (texte + tags).
- **Filtres** : plage de dates, tag (catégorie), tranche horaire (double slider).
  Icône filtre **colorée** (fond plein) quand un filtre est actif.
- **Fond teinté dédié** : la section « Ton journal » (titre + recherche/filtres + liste)
  a un **fond de couleur propre, dédié par thème** (`--journal-bg` : turquoise `#CDE7E8`,
  corail `#FAD8D8`) ; **les cartes d'entrées restent blanches** et ressortent dessus. But :
  démarquer nettement le **journal (passé)** du **haut de page** (saisie + sollicitations).

### 7.4 Éditer / supprimer une entrée
- Bouton crayon ✏️ discret sur chaque carte → **bottom sheet** d'édition.
- Permet : modifier le **texte**, **ajouter/retirer des tags**, **supprimer** l'entrée.
- À l'enregistrement : `editedAt = now`, signaux recalculés depuis le nouveau texte (ou
  conservés si édités manuellement). Badge « modifiée » sur la carte.
- **Effet sur l'analyse (retenue)** : une entrée éditée après le dernier run est marquée ;
  l'écran *Corrélations automatiques* affiche une **bannière** invitant à relancer, et le
  prochain run **réintègre** la version à jour (les infos issues de la v1 obsolète ne sont
  plus comptées).

---

## 8. Écran Données

### 8.1 Récap (panneau compact)
- **Panneau de synthèse teinté** (fond `--c-50`, en-tête `--c-100`), visuellement
  **distinct** des listes détaillées qui suivent. Lignes condensées, emoji inline,
  valeurs en pastilles blanches.
- Titre « Récap » + période dynamique « {n} derniers jours ».
- Deux vues commutables (segmented control) : **Valeurs santé** / **Complétude du suivi**.
  - *Valeurs* : valeur extraite par dimension (ex : `6,5 h/nuit`, `2 prises/jour`,
    climat dominant) ou **« informations absentes »** (style dédié : pastille pointillée
    estompée) si aucune donnée.
  - *Complétude* : pastille score 1/2/3 (Insuffisant / Intermédiaire / Suffisant).
- **Fenêtre paramétrable** : défaut **7 jours** ; choix **7 / 14 / 30** dans Réglages.
  Les seuils de complétude (`score3 = ⌈0,7·win⌉`, `score2 = ⌈0,35·win⌉`) et de fréquence
  (quotidien `⌈0,8·win⌉`, fréquent `⌈0,4·win⌉`) sont **proportionnels** à la fenêtre.

### 8.2 Par thème
- Liste complète regroupée par catégorie, **un thème par ligne** (pas en grille).
- Chaque bloc dépliable liste les valeurs extraites + horodatage. `sleep/food/pain`
  ouverts par défaut.
- **Liste à hauteur fixe** (~5 lignes, **identique pour toutes** les catégories) avec
  **scroll vertical interne**. **Chargement progressif** : **40 lignes** affichées au
  départ (on scrolle dans la boîte pour les parcourir), puis lien **« Voir plus »** (+20),
  puis bouton **« Afficher plus »** (+20 par clic) jusqu'à épuisement. La hauteur de la
  boîte ne change jamais ; seul le contenu défilable grandit. La position de scroll est
  préservée lors d'un chargement supplémentaire. (Compteur d'en-tête = total réel.)

---

## 9. Écran Corrélations automatiques

(Renommé depuis « Corrélations ».)

### 9.1 Fonctionnement
- Pas de mise à jour automatique : bouton **Mettre à jour** lance `runAnalysis()`.
- Affiche les associations trouvées + date du dernier run.
- Bannière **stale** si des entrées ont `editedAt > lastAnalysisAt`.

### 9.2 Fenêtre d'analyse (sélecteur sous la tagline)
- **24 h / 3 jours / 1 semaine** = délai cause→effet recherché entre un trigger et un
  symptôme. Changer la fenêtre **relance** l'analyse. (Pas de ligne d'explication sous le
  sélecteur.)

### 9.3 Algorithme `computeInsights(windowDays)`
- Portée : **14 derniers jours** d'entrées. *(Voir [ROADMAP] §9.7 : option tout
  l'historique.)*
- Agrégation **par jour** : un jour est *flag* s'il contient `pain`, `symptom` ou
  `brain_fog`. Les valeurs de `food` et `environment` sont des *triggers*.
- Un trigger de jour J co-occure si un *flag* existe à J, J+1, … J+(windowDays−1)
  (fenêtre glissante).
- Retenir les triggers avec **≥ 2 co-occurrences**. Bande : `weak` (<4), `moderate`
  (4–5), `strong` (≥6). `ratio = co-occurrences / jours-avec-trigger`. Max **6**, triées
  par occurrences.

### 9.4 Dictionnaire persistant & cycle de vie
- `runAnalysis()` fusionne les résultats frais dans `store.correlations` (clé = trigger) :
  met à jour data + `observedAt = now` + `windowDays` + `current = true`, **en
  conservant** `pinned`/`hidden`. Les clés absentes du run passent `current = false`.
- **Affichées** (liste principale) : `!hidden && (current || pinned)`, triées
  (épinglées d'abord, puis par occurrences).
- **Archivées** (section dépliable « Afficher les corrélations obsolètes (N) ») :
  `hidden || (!current && !pinned)`.

### 9.5 Carte de corrélation
- Énoncé : « Tes douleurs/symptômes reviennent souvent les jours où tu notes : « {x} ». »
- Bande de force + barre de ratio + texte d'occurrences.
- **Ligne de date normée** (remplace l'ancien caveat) : « Association observée le {date},
  sur les données {des 24 h / des 3 jours / de la semaine} précédentes. » Date + fenêtre
  = celles de la dernière observation (une obsolète garde sa fenêtre d'origine).
- **Actions en pictogrammes discrets** à droite de la ligne de date :
  - 📌 **Épingler / Désépingler** : reste affichée en permanence, **sans échéance**.
  - 🚫 **Masquer / Réafficher** : bascule dans l'archive.
  - Style réglable : **Pictogrammes** (défaut) ou **Pictogrammes et texte** (Réglages).

### 9.6 Tags d'état
`Épinglée` (plein), `Obsolète` (gris), `Masquée` (pointillé) selon l'état.

### 9.7 [ROADMAP] Portée « tout l'historique »
Ajouter une option (réglage ou sélecteur) pour analyser **toutes les données** au lieu des
14 derniers jours. Impact : plus de patterns mais aussi associations plus anciennes.
Implémentation : paramétrer le `since` de `computeInsights` (et idéalement exposer le choix
à l'utilisateur).

---

## 10. Écran Corrélations manuelles

Génération **on demand** d'analyses choisies par l'utilisateur.

### 10.1 Saisie des facteurs
- **N facteurs** (min 2) en **texte libre** ; boutons *+ Ajouter un facteur* / × retirer.
- **Méga-menu de suggestions** : panneau **sous le champ** (pas à droite), pleine largeur,
  **4 colonnes** desktop / 2 mobile. Source : presets (heure du coucher, heure du dîner,
  heure du réveil, qualité de la nuit) + noms de thèmes + valeurs/tags des entrées
  passées. **Filtrage à la frappe**, **clic pour remplir**, fermeture à la sélection / au
  blur / Échap.
- Bouton **Run**.

### 10.2 Construction des séries `factorDaily(factor)`
- Match : une entrée concerne un facteur si son texte/ses signaux contiennent un mot
  (>2 lettres) du facteur.
- Valeur quotidienne : si facteur « horaire » (heure/coucher/réveil/dîner…), extraire
  l'heure du texte (`23h`, `23:30`) sinon l'heure de `createdAt`. Sinon : 1er nombre d'un
  signal puis du texte ; à défaut, **nombre d'occurrences** du jour. Agrégat = moyenne.

### 10.3 Calcul & affichage
- **2 facteurs** : Pearson sur jours communs → **nuage de points** + verdict.
- **3+ facteurs** : **un seul résultat global** (jamais la liste des paires). Matrice de
  corrélation k×k puis **valeur propre dominante** λ₁ (power iteration) →
  `force = clamp((λ₁−1)/(k−1), 0, 1)`. Affichage : carte unique « f1 × f2 × f3 » +
  **graphique multi-courbes** (une ligne normalisée par facteur).
- **Verdict + note + pastille (toujours)** :
  - 🟢 **Vert** — *Corrélation forte* (|r| ou force ≥ 0,6)
  - 🟡 **Jaune** — *Corrélation possible* (≥ 0,35)
  - 🔴 **Rouge** — *Pas de corrélation claire* (< 0,35, < 3 jours communs, ou variance nulle)
  - Note rédigée : « Coefficient r = {r} sur {n} jours communs. {sens} » ou
    « Schéma commun aux {k} facteurs : force {s}/100, sur {n} jours communs. » + rappel
    « association observée, pas une preuve de cause à effet ».
- **Graphiques neutres** : le nuage de points et le multi-courbes utilisent une palette
  **gris/noir** (fond, axes, points, courbes — variables `--chart-*`) **indépendante du
  thème** — rendu volontairement sobre/professionnel, **identique** en turquoise comme en
  corail.

### 10.4 Sauvegarde, épingler & masquer
- Chaque **Run** enregistre le résultat dans `store.manual.saved` (liste **persistante**),
  **dédupliquée par facteurs** (clé = facteurs en minuscules, triés) : relancer la même
  combinaison **met à jour** la carte existante en conservant son épinglage/masquage.
- Chaque carte porte un **pied épingler / masquer** identique à l'écran auto (§9.5) :
  📌 **épingler** (tri en tête, tag « Épinglée ») et 🚫 **masquer** (bascule dans la section
  dépliable **« Afficher les corrélations masquées (N) »**, avec réaffichage). Style des
  boutons réglable (Pictogrammes / Pictogrammes et texte, cf. §12).
- Tri des visibles : épinglées d'abord, puis par date de calcul décroissante.

### 10.5 [ROADMAP] Robustesse de l'extraction
L'extraction numérique actuelle (premier nombre) confond deux facteurs chiffrés dans une
même entrée. Cible : extraction **ciblée par facteur** (fenêtre autour du mot-clé) ou
**champs structurés/typés** à la saisie (unités explicites).

---

## 11. Écran Mon compte

Accessible via le **nom (avatar + pseudo) en haut à droite**, cliquable.

- **Identité** : e-mail (lecture seule), **mot de passe en clair** (ou « reconnecte-toi
  pour l'afficher » si non capturé), bouton **Se déconnecter**. *(Bloc déplacé depuis
  Réglages.)*
- **Profil** :
  - **Date de création** (lecture seule). Défaut = date de la 1re entrée si non stockée.
    [ROADMAP] exposer la vraie date d'inscription via `api.php` (présente dans
    `users.json`) au login.
  - **Entrées au journal** : `entries.length` (les éditions **ne comptent pas** comme de
    nouvelles entrées).
  - **Sexe à la naissance** : H / F / Autre (`M`/`F`/`O`) — « pour les standards du
    métabolisme ». Éditable, persistant.
  - **Date de naissance** : sélecteur de date. Éditable, persistant.

---

## 12. Écran Réglages

- **Langue** : Français / English.
- **Thème** : Turquoise (défaut) / Corail.
- **Taille du texte** : Normal / Grand (+12 %).
- **Récap des données** : 7 (défaut) / 14 / 30 jours, avec note « Nombre de jours analysés
  (7 par défaut) ».
- **Boutons des corrélations** : Pictogrammes / Pictogrammes et texte.
- **Choix du moteur** (cf. §6) : **matrice « fonction × méthode »**. 6 fonctions —
  *la liste des tags*, *la transformation des entrées en infos ordonnée*, *moteur de
  sollicitation d'entrées*, *facteurs du Récap*, *moteur de corrélations automatiques*,
  *analyse du ton de la voix* — et **3 méthodes en colonnes** : **à la main dans réglages**,
  **moteur en local dans l'appareil**, **via un modèle IA/LLM**. Boutons radio dont la
  sélection **reflète l'état réel de la webapp** (aujourd'hui : tout « en local » sauf la
  sollicitation, « à la main »).
  Lien **« Plus d'informations »** dépliable : la **même grille en texte** explique chaque
  méthode, avec la mention **« Utilise des tokens — option payante »** sur la colonne LLM.
  **Cosmétique en démo** (changer un bouton n'a pas d'effet). Lié aux [ROADMAP] §6.3
  (règles utilisateur) et §6.4 (classification LLM).
  - **[ROADMAP]** *Analyse du ton de la voix* : **indisponible** en « à la main » et « en
    local » ; en **IA/LLM** = analyse du son de la voix pour détecter l'humeur (stress,
    énervement, joie, etc.). Aucune méthode active aujourd'hui (futur).
- **Corrélations → Sources médicales** *(nouvelle partie de Réglages, cosmétique)* :
  sources officielles que l'IA pourra mobiliser pour ses analyses, en **2 sous-parties** :
  - **URL d'API** : 8 sources (OMS-GHO, OMS-CIM-11, HAS, ANSM-BDPM, ANSES-Ciqual,
    PubMed/MEDLINE, openFDA, SNOMED CT/UMLS), chacune avec **toggle** + **champ URL**
    (pré-rempli avec l'endpoint réel, éditable).
  - **Jeux de données** : items avec **toggle** + **import de fichier** (*format à
    déterminer*) ; placeholders de démo (régimes Atkins, Dukan, JCH cétose, kétogène) ;
    champ **recherche** au libellé « Browse the market place to buy a program ».
  - **« Ajouter une source »** toujours visible dans chaque sous-partie. **Cosmétique** :
    aucun système branché (RAG / tool-use à construire en version IA). Formes d'usage d'une
    source par une IA : **RAG** (ingestion + citation des sources), **appel d'API**
    (tool-use temps réel), **terminologies/ontologies** (normalisation), connaissance
    pré-entraînée. Licences : ouvertes (OMS/BDPM/PubMed/openFDA/Ciqual) vs compte requis
    (UMLS/SNOMED) vs payantes (DrugBank/Vidal/UpToDate).
- **Entrées sollicitées (« Pull Input »)** : **règles de déclenchement** des saisies
  sollicitées (cf. §7.2), dépliables (type + déclencheur). En démo : **cosmétique** (cases
  sans effet, titres marqués `*`). Règles consignées :
  - *« Qu'as-tu mangé ? »* (ouverte) — 8 h sans saisie concernant une prise alimentaire.
  - *« Toujours mal aux cuisses ? »* (Oui/Non) — une douleur signalée dans la journée sans
    entrée ultérieure indiquant sa fin.
  - *« As-tu dormi depuis ton dernier sommeil ? »* (Oui/Non) — 12 h après la première
    saisie de la journée (comptée dès 4 h) ; « Oui » enregistre « a dormi à un moment dans
    la journée ».
- **Charger des exemples** (jeu de démo).
- **Exporter mes données (JSON)** : export **complet** de `store` (tout : entrées, tags,
  réglages, profil, corrélations). Nom de fichier **par compte** + **[ROADMAP] date et
  heure sans secondes** : `wwfm-<user>-AAAA-MM-JJ-HHMM.json`.
- **Importer des données (JSON)** : restaure un export dans le compte courant. Remplace les
  données **mais préserve l'identité** (token/email) et le **mot de passe** du compte
  courant. Confirmation si le compte a déjà des entrées.
- **Gestion des données personnelles et fonctions associées** : liste d'items à
  **cocher / déplier** (au clic, le titre déploie une explication). **Cosmétique en démo**
  (titres marqués `*`, note de bas de section « présentées à titre indicatif — pas encore
  actives dans cette démo ») :
  - *Ne jamais transmettre mes données ni mon nom à un tiers* — **coché et verrouillé**,
    étiquette « **RESTERA TOUJOURS GRATUIT** ».
  - *Chiffrer le stockage de mes données* — OVH mutualisé par défaut ; option disque dédié
    + chiffrement de bout en bout, étiquette « **150 €/mois** ».
  - *Me proposer de tester de nouveaux protocoles de laboratoire*.
  - *Partager mon journal de façon anonyme*.
  - *Personnaliser mes valeurs de référence* — option payante, étiquette « **Sur devis** ».
- **Informations légales** : 3 liens ouvrant chacun un **écran texte** dédié (avec bouton
  retour vers Réglages) — **Mentions légales**, **Conditions générales d'utilisation
  (CGU)**, **Conditions générales de vente (CGV)**. Contenu **lorem ipsum** en démo, à
  remplacer par la version juridique définitive.

**Design de l'écran Réglages** : présentation **neutre et structurée**, **sans le code
couleur du thème** — palette en **gris**, **cartes plates** à bord net, **en-têtes de
section en petites capitales**, espacement augmenté (rendu « sérieux »). Exceptions
colorées (volontaires) : les **pastilles turquoise/corail** du sélecteur de thème (c'est le
contenu) et la **navigation** (barre d'onglets / haut), communes à toute l'app. La
**section du haut** (Taille du texte · Langue · Thème) présente ses **3 toggles au même
format pleine largeur**, libellés **allégés** (non gras, légèrement plus petits).

Le segmented control « actif » doit être lisible : rail teinté + pastille blanche
surélevée (anneau + ombre), texte inactif atténué.

---

## 13. i18n
Toutes les chaînes via `t(key)`, dictionnaires `I18N.fr` / `I18N.en`. La bascule de langue
re-rend toute l'app. **Attention encodage** : en JS, les délimiteurs de chaîne doivent être
des apostrophes ASCII `'` ; les apostrophes typographiques `'` ne sont valides qu'à
l'**intérieur** des chaînes. (Bug récurrent : un outil d'édition convertit les délimiteurs
en `'`/`'` et casse le JS → page blanche. Vérifier après chaque édition.)

---

## 14. Sécurité & confidentialité
- **Démo = données de test**, sans durcissement (cf. `api.php`). Mots de passe **en clair**
  côté client/serveur **acceptable uniquement en démo** ; **à proscrire en production**.
- Données de santé = sensibles. Production : chiffrement at-rest, sessions signées,
  consentement explicite avant tout envoi à un tiers (LLM).
- Jamais de push de données réelles sur GitHub.

---

## 15. Déploiement
- **Règle permanente** : chaque modification est **mise en ligne sur la production**
  (FTP/lftp vers `/w/app`) **sans pousser sur GitHub**, sauf demande explicite.
- Après chaque édition de `app.js` : vérifier l'absence de guillemets typographiques comme
  délimiteurs + équilibre accolades/parenthèses, puis valider en ligne par `curl`.

---

## 16. Critères d'acceptation (checklist)
- [ ] Saisie texte/voix/photo ; entrée taguée + horodatée + persistée.
- [ ] Édition/suppression d'entrée ; `editedAt` ; bannière stale ; réintégration au run.
- [ ] Récap configurable 7/14/30 (défaut 7) ; seuils proportionnels ; « informations
      absentes » stylé ; panneau distinct des listes.
- [ ] Corrélations auto : fenêtre 24 h/3 j/1 sem ; pin (sans échéance) ; masquer ;
      obsolètes en section dépliable ; ligne de date normée ; bannière stale.
- [ ] Corrélations manuelles : N facteurs ; méga-menu colonnes sous le champ ; 2 facteurs →
      nuage ; 3+ → score global unique (pas la liste des paires) + multi-courbes ; pastille
      verte/jaune/rouge + note **toujours**.
- [ ] Mon compte accessible via le nom ; identité + profil (création, nb entrées hors
      éditions, sexe, naissance).
- [ ] Réglages : langue, thème, taille texte, récap jours, style boutons, sample, export
      (nom horodaté), import (préserve identité+mdp).
- [ ] Journal : section « Entrées sollicitées » (pull) toujours visible (message si vide) ;
      répondre → vraie entrée auto-taguée ; fond teinté dédié sur « Ton journal » (cartes
      blanches).
- [ ] Données « Par thème » : listes à hauteur fixe + scroll interne + chargement
      progressif (40 puis +20 « Voir plus » / « Afficher plus »).
- [ ] Corrélations manuelles : liste sauvegardée (dédupliquée) + épingler/masquer +
      archive « masquées » ; graphiques neutres (gris) indépendants du thème.
- [ ] Réglages : « Choix du moteur » (matrice fonction × méthode + « Plus d'informations »
      avec note tokens/payant) ; « Gestion des données personnelles » (cosmétique, `*`) ;
      écrans légaux (mentions / CGU / CGV) ; design neutre de l'écran (hors navigation).
- [ ] 5 onglets, libellés complets 2 lignes, séparateurs fins.
- [ ] Bilingue FR/EN ; thèmes turquoise/corail ; grand texte.
- [ ] **[ROADMAP]** userRules ; portée tout l'historique ; export horodaté ; vraie date
      d'inscription serveur ; extraction numérique ciblée ; LLM hybride ; natif iOS
      (dictée, push) ; base de données + sécurité production.
