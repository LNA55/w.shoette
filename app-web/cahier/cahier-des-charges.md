# What works for me — Cahier des charges (v6)

> **Version 6 — 30 juin 2026 à 11h05.** Mise au net de session. Ajouts depuis la v5c :
> **Mantra projet** en pied de la barre d'onglets (FR « Comparaison n'est pas raison. Test & Learn. » / EN « Comparison is not proof. Test & Learn. », clé i18n `footerMantra`). **Moteur d'extraction commutable** (Réglages → II. Moteur → « Choix du moteur », fonction `fn2`) : **local** (défaut, sur l'appareil) ou **IA/LLM** (conçu, pas encore branché → repli local + note « non connecté ») ; aiguilleur `extractEntry()`. **Moteur local enrichi** : correspondance **mot-entier** (corrige les faux positifs type « bu »→« bureau », plus d'« Alimentation » hallucinée), **rôles SOMMEIL** (coucher/réveil/durée), **ÉNERGIE notée 1→5**, **libellés contextuels** (« Coucher à 22h », « 8h de sommeil », « Glycémie 110 mg/dl »). **Réanalyse** : bouton **« Tout réanalyser »** + migration automatique unique (réversible via `_sigBak`) — le **texte des entrées n'est jamais modifié**, seule la couche dérivée est régénérée. **Refonte du Récap (Données)** : ordre Sommeil / Alimentation / Activité / Social / Énergie / Douleur / Brouillard mental / Climat ; **Humeur & Stress retirés du récap** ; sommeil en **h:mm**, énergie en **/5** et alimentation en **prises/jour** (1 décimale, **arrondi au plafond**), douleur & brouillard en **fréquence** (non / occasionnel / fréquent / quotidien), climat = tendance dominante ; règle « calculer à partir de l'existant, même 1 seule donnée ». **« Par catégorie »** affiche les **libellés contextuels**. **Nouveau §18 — Modèle cible « valeurs plates » & extraction IA** (validé en conception ; **remplace** la piste « champs typés par catégorie »), dont **§18.5 : anonymisation obligatoire comme condition de branchement du moteur IA, dès la démo**. Reprise du statut v5c ci-dessous.
>
> **Version 5c — 27 juin 2026 à 19h20.** Mise au net de session. Ajouts depuis la v5b :
> **Langage canonique (Ubiquitous Language)** — suggestions de facteurs **typées** catégorie/valeur (chips différenciés), `verdict`→`band` (Force), `tag`→`category` (UI + code + i18n) ; glossaire `app-ios/glossaire.md` (§17). **Liste des valeurs** (Réglages → Moteur) — éditer / supprimer / ajouter / **fusionner par glisser-déposer** (souris + tactile) ; base d'alias `valueAliases` + `valuesExtra` (§4) + **normalisation à la saisie** (« Sucré »→« Sucre ») ; numériques exclus (§6.5). **Journal** — picto **« masquer le contenu »** (floute texte/photos, chips visibles) ; **raccourcis rapides retirés**. **Données** — « Par catégorie » **replié par défaut**. **Mon compte** — section **« Comment ça marche »**. **Corrélations manuelles** — sous-titre « Corrélation n'est pas causalité » ; chaque carte porte « **Corrélation observée le {date}, sur les données du … au …** » ; « Association observée »→« Corrélation observée » (auto + manuel). **Catégorie « Social »** (👥) + valeurs-graines « Quality Family Time » / « Network pro ». Reprise du statut v5b ci-dessous.
>
> **Version 5b — 27 juin 2026 à 08h56.** Mise au net de session. Ajouts depuis la v5 :
> **Corrélations manuelles** — le méga-menu de suggestions **reste affiché tant que le curseur est dans un champ** (ouverture au focus / clic / frappe ; sélectionner une suggestion garde le focus ET le menu ouvert ; fermeture seulement quand le focus quitte tous les champs, ou via Échap) ; **filtrage à la frappe** ; comportement documenté (§10.1, §16). **Réglages** — titres de sous-sections **toujours en noir** même si la fonction dedans est inactive (le gris ne porte que sur le contenu) ; « Boutons des corrélations » → **« Boutons »** ; note « les fonctions en gris… » **retirée** ; **tous les styles de Réglages forkés sous `.settings-screen`** (isolation totale, retouchables sans impact ailleurs) ; titres de groupe agrandis (≈ 1,2 rem). Reprise du statut v5 ci-dessous.
>
> **Version 5 — 27 juin 2026 à 00h06.** Mise au net de session. Ajout depuis la v4 :
> **réorganisation complète de l'écran Réglages en 4 grandes parties** (I. Design · II. Moteur · III. Gestion des données personnelles · IV. Informations légales), avec sous-groupes et sections repliables, et la **matrice « Choix du moteur » éclatée en sections « Fonctions » par étape** ; ajout de la sous-section **« Applications à connecter »** (Apple Santé, Google Fit, Oura, Fitbit, Withings, Dexcom, **Localisation & météo**) ; tag **« Climat »** (renommé) ; **« Charger des exemples » retiré** des Réglages. Reprise du statut v4 ci-dessous.
>
> **Statut v4 (26 juin 2026 à 22h55).** Mise au net de session. Ajouts depuis la v3 :
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
  "valueAliases": {              // base de VALEURS GROUPÉES (§6.5) : "categorie::valeurLower" -> valeur principale
    "food::sucré": "Sucre"       //   ex. « Sucré » résout (rétroactif + futur) vers « Sucre »
  },
  "valuesExtra": {               // valeurs textuelles ajoutées manuellement par catégorie (pas encore dans les entrées)
    "food": ["Miel"]
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

### 6.1 Catégories (13)
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
| `social` | 👥 | Social | Social | — |  *(ajoutée le 27/06/2026)*
| `measure` | 📊 | Mesures | Measurements | — |
| `environment` | ⛅️ | Climat | Climate | **trigger** |  *(clé `environment` inchangée)*
| `other` | 📝 | Divers | Other | — |

`RECAP_KEYS` (ordre du Récap Données) : `sleep, food, mood, energy, pain, stress,
brain_fog, environment`.

**Valeurs « graines »** (`CAT_SEED_VALUES`) : valeurs fournies par l'app pour certaines
catégories, visibles dans la Liste des valeurs (§6.5) même sans entrée — actuellement
`social` → « Quality Family Time », « Network pro ».

### 6.2 Moteur de tags (existant, 100 % client)
- `structureEntry(text)` met le texte en minuscules, teste des **listes de mots-clés**
  codées en dur par catégorie. Premier mot-clé trouvé → tag de la catégorie.
- Extraction de **valeurs numériques** : sommeil (`Xh`), tension (`120/80 mmHg`),
  glycémie (`mg/dl`, `g/l`), poids (`kg`), pouls (`bpm`).
- Si rien ne matche → tag `other`. Détection de **négation** simple (pas/peu/sans/no/bad…)
  pour qualifier sommeil/humeur/énergie en « plutôt difficile » vs « noté ».
- Latence nulle, coût zéro (aucun appel réseau, aucun token).

**Améliorations v6 (30/06/2026) — moteur local :**
- **Correspondance MOT-ENTIER** (`kwHit`) : un mot-clé ne matche que s'il est bordé de non-lettres → corrige les faux positifs de sous-chaîne (« bu » dans « bureau », « dos » dans « adossé »…). Fini l'« Alimentation » fantôme.
- **Sommeil typé** (`sleepSignals`) : détection de **rôles** — `coucher` / `réveil` (heures d'horloge, gère minuit) et `durée` (déclarée). Un nombre n'est interprété **que** s'il y a un indice de rôle dans le texte (sinon laissé brut, sans inventer) → « 22h » n'est plus lu comme « 22 h de sommeil ».
- **Énergie notée 1→5** (`energyLevel`) : 1 épuisé · 2 fatigué · 3 correct · 4 en forme · 5 pleine forme (négation prise en compte).
- **Libellés contextuels** (`text` du signal, affiché dans les puces + « Par catégorie ») : « Coucher à 22h », « 8h de sommeil », « Glycémie 110 mg/dl », « Tension 12/8 », « Poids … kg ».
- **Moteur commutable** : réglage `store.extractEngine` (`local` défaut / `llm` / `manual`), piloté par la matrice « Choix du moteur » (`fn2`) ; aiguilleur `extractEntry(text)`. `llm` non branché → repli `structureEntry` + note ; `manual` → aucune extraction auto.
- **Réanalyse** : `reanalyzeAll()` (bouton « Tout réanalyser ») + `maybeMigrate()` (réanalyse auto unique au changement de moteur, `store.engineBuild`). Les anciens signaux sont archivés dans `entry._sigBak` (réversible) ; **le texte de l'entrée n'est jamais touché**.

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

### 6.5 Liste des valeurs (édition, fusion, alias) — Réglages → II. Moteur
Sous *Listes de catégories* (cf. §12), une section **« Liste des valeurs »** expose les
**valeurs** textuelles (hors nombres/mesures) détectées dans les entrées, **groupées par
catégorie**, avec un compteur d'occurrences. Contrairement aux catégories (figées), les
valeurs sont **éditables** :
- **Éditer** (renommer) : re-tague rétroactivement toutes les entrées portant cette valeur,
  et enregistre un **alias** ancien→nouveau.
- **Supprimer** : retire **tout le signal** des entrées concernées (l'entrée est conservée),
  après **confirmation** (compteur d'entrées affecté) ; nettoie aussi les alias liés.
- **Ajouter** : crée une valeur (stockée dans `valuesExtra`), disponible comme cible de fusion.
- **Fusionner par glisser-déposer** (souris **et** tactile, via *pointer events*) : glisser
  une valeur **sur** une autre (même catégorie) → fusion ; **la valeur reçue est conservée**.
  Toutes les entrées de la valeur glissée sont retaguées vers la valeur reçue.
- **Base de valeurs groupées** (`store.valueAliases`, clé `categorie::valeurLower`) : chaîne
  d'alias résolue (anti-cycle). **Le moteur de tags applique cette normalisation à la saisie**
  (`structureEntry`) : écrire « Sucré » → tag **« Sucre »** (la valeur principale).

---

## 7. Écran Journal

### 7.1 Ajouter une entrée
- Zone de saisie en haut (textarea), placeholder d'exemple.
- **Texte libre** + **dictée vocale** (Web Speech API en démo ; native en iOS) +
  **photo** (redimensionnée ≤ 1000 px, JPEG qualité 0.7).
- _(Retiré le 27/06/2026 : les **raccourcis rapides** sous la zone — Ma nuit / Mon repas /
  Une douleur / Mon humeur — ont été supprimés ; clés i18n `quick1-4`/`qs1-4` dormantes.)_
- À l'envoi : entrée **horodatée**, **catégorisée** (`structureEntry`), **sauvegardée**, toast
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
- **Recherche** textuelle temps réel (texte + catégories).
- **Filtres** : plage de dates, catégorie, tranche horaire (double slider).
  Icône filtre **colorée** (fond plein) quand un filtre est actif.
- **Masquer le contenu** : picto (œil) à côté du titre « Ton journal » qui **floute le texte
  et les photos** des entrées — les **chips** (catégories/valeurs) restent visibles. But :
  montrer les _data_ à quelqu'un **sans** le détail écrit. Bascule de session (non persistée).
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
  - *Valeurs* : valeur par dimension (détail v6 ci-dessous) ou **« informations absentes »**
    (style dédié : pastille pointillée estompée) si aucune donnée.
  - *Complétude* : pastille score 1/2/3 (Insuffisant / Intermédiaire / Suffisant).
- **Fenêtre paramétrable** : défaut **7 jours** ; choix **7 / 14 / 30** dans Réglages.
  Les seuils de complétude (`score3 = ⌈0,7·win⌉`, `score2 = ⌈0,35·win⌉`) et de fréquence
  (quotidien `⌈0,8·win⌉`, fréquent `⌈0,4·win⌉`) sont **proportionnels** à la fenêtre.

**Contenu du Récap — spec validée v6 (30/06/2026).** S'applique **quel que soit le moteur**
(local ou IA) ; seule la *fiabilité* des données diffère — assumé, c'est le rôle de la vue
*Complétude*. Règle générale : **calculer à partir de ce qui existe** (même une seule donnée
sur la fenêtre est restituée). Pour les moyennes calculées : **1 décimale, arrondie au
plafond** (vers le haut). Ordre des lignes (Humeur & Stress **retirés** du récap) :

1. **Sommeil** — *moyenne d'heures de sommeil par nuit*, en **h:mm** (pas en décimal) = Σ(durée des nuits) ÷ **nuits avec info**. La durée d'une nuit est **déclarée** (« dormi 8h ») **ou calculée** (réveil − coucher de la veille ; gère minuit ; la déclarée l'emporte).
2. **Alimentation** — *prises par jour* = nb de prises ÷ **jours avec info** (1 décimale, plafond).
3. **Activité** — *nombre de fois* sur la période (compte total).
4. **Social** — *nombre de fois* sur la période (compte total).
5. **Énergie** — *moyenne /5* : chaque jour donne un score 1→5 (moyenne des indices du jour), puis moyenne des jours (1 décimale, plafond).
6. **Douleur** — **fréquence** : `non` (0 j) / `occasionnel` (1-2 j) / `fréquent` (3-5 j) / `quotidien` (6-7 j) — proportionnel à la fenêtre.
7. **Brouillard mental** — **fréquence** (même barème).
8. **Climat** — température + humidité moyennes si chiffres disponibles ; sinon **tendance dominante** (ex. « Humide (4/7 j) »).

### 8.2 Par catégorie
- Liste complète regroupée par catégorie, **une catégorie par ligne** (pas en grille).
- Chaque bloc dépliable liste les valeurs extraites + horodatage. **Tous repliés par
  défaut** (depuis 27/06/2026 ; auparavant `sleep/food/pain` ouverts).
- **v6 (moteur local)** : les valeurs s'affichent avec leur **libellé contextuel** (« Coucher à 22h », « 8h de sommeil », « Glycémie 110 mg/dl ») plutôt qu'un nombre nu. En **moteur IA**, c'est l'IA qui détermine ce qu'elle inclut.
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
- **Ligne de date normée** (remplace l'ancien caveat) : « Corrélation observée le {date},
  sur les données {des 24 h / des 3 jours / de la semaine} précédentes. » Date + fenêtre
  = celles de la dernière observation (une obsolète garde sa fenêtre d'origine).
  La **même ligne figure désormais sur les cartes manuelles** (§10.4) : date du Run +
  **plage des jours réellement analysés** (« du {premier} au {dernier} »).
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
  heure du réveil, qualité de la nuit). Un **facteur** est soit une **catégorie**
  (ex. « Alimentation »), soit une **valeur** (ex. « Sucre ») : la liste mêle les **noms de
  catégories** et les **valeurs** extraites des entrées passées, chaque suggestion portant
  son type (`manualVocab()` renvoie `{label, kind:'category'|'value'}`). Voir §17 (vocabulaire).
  - **Chips différenciés par type** : une suggestion **catégorie** a un fond **plus intense**
    qu'une **valeur** (`.mf-sug--category` = `--c-200` vs base `.mf-sug` = `--c-50`).
  - **Filtrage à la frappe** : à chaque caractère ajouté/retiré, la liste se restreint aux
    suggestions contenant le texte saisi (sous-chaîne, insensible à la casse).
  - **Reste affiché tant que le curseur est dans un champ de facteur** : ouverture au
    **focus**, au **clic** et à la **frappe** ; **sélectionner une suggestion** remplit le
    champ, **garde le focus ET le menu ouvert** (re-filtré sur la nouvelle valeur) ;
    fermeture **uniquement** quand le focus quitte **tous** les champs de facteur, ou via
    **Échap**. Passer d'un champ à l'autre **ne ferme pas** le menu (il se repositionne sous
    le champ actif).
  - **Clic sur une suggestion** = remplit le champ correspondant (`data-idx`).
- Bouton **Run**.

### 10.2 Construction des séries `factorDaily(factor)`
- Match : une entrée concerne un facteur si son texte/ses signaux contiennent un mot
  (>2 lettres) du facteur.
- Valeur quotidienne : si facteur « horaire » (heure/coucher/réveil/dîner…), extraire
  l'heure du texte (`23h`, `23:30`) sinon l'heure de `createdAt`. Sinon : 1er nombre d'un
  signal puis du texte ; à défaut, **nombre d'occurrences** du jour. Agrégat = moyenne.

### 10.3 Calcul & affichage
- **2 facteurs** : Pearson sur jours communs → **nuage de points** + force.
- **3+ facteurs** : **un seul résultat global** (jamais la liste des paires). Matrice de
  corrélation k×k puis **valeur propre dominante** λ₁ (power iteration) →
  `force = clamp((λ₁−1)/(k−1), 0, 1)`. Affichage : carte unique « f1 × f2 × f3 » +
  **graphique multi-courbes** (une ligne normalisée par facteur).
- **Force + note + pastille (toujours)** _(code : champ `band`, badge `.band-dot`)_ :
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
- **Ligne de date** (comme l'écran auto §9.5) : « **Corrélation observée le {date}, sur les
  données du {premier} au {dernier}.** » — {date} = génération du Run ; plage = étendue des
  **jours réellement analysés** (jours communs aux facteurs). Le sous-titre de l'écran est
  « Choisis 2 facteurs ou plus, puis lance l'analyse. **Corrélation n'est pas causalité** ».

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
- **Comment ça marche** : court texte d'onboarding **sous Profil**, résumant l'_user journey_
  en langage canonique — Journal → **Entrées** → **Catégories**/**Valeurs** → Données →
  **Corrélations automatiques** (**Déclencheur** ↔ **Symptôme**, **Force**) → **Corrélations
  manuelles** (**Facteurs** : Catégorie ou Valeur). Cf. §17.

---

## 12. Écran Réglages

Écran **réorganisé en 4 grandes parties** (niveau 1), chacune contenant des **sous-groupes**
(niveau 2) et des **sections repliables** (niveau 3). Hiérarchie visuelle : partie en gras +
séparateur fort ; **titres de sous-groupe agrandis (≈ 1,2 rem) et TOUJOURS en noir**, même si
la fonction qu'ils contiennent est inactive ; section = carte dépliable. Le **gris** ne porte
que sur le **contenu** d'une section inactive (jamais sur son titre) — c'est l'unique
indicateur d'inactivité (plus de note explicative dédiée). **Tous les styles de Réglages
sont forkés sous `.settings-screen`** (isolation totale) : on peut les retoucher sans
impacter le reste du site.

### I. Design
Le tableau des **4 préférences** (toggles **pleine largeur**, libellés allégés) :
**Taille du texte** (Normal / Grand +12 %), **Langue** (Français / English), **Thème**
(Turquoise / Corail), **Boutons** (Pictogrammes / Pictogrammes et texte).

### II. Moteur
La matrice
**« Choix du moteur »** (fonction × méthode) est **éclatée en sections « Fonctions »** par
étape. **3 méthodes en colonnes** : **à la main dans réglages**, **moteur en local dans
l'appareil**, **via un modèle IA/LLM** ; boutons radio reflétant l'état réel (aujourd'hui :
tout « en local » sauf la sollicitation, « à la main »). Chaque « Fonctions » a son lien
**« Plus d'informations »** (même grille en texte ; mention « Utilise des tokens — option
payante » sur la colonne LLM). **Cosmétique en démo.** Lié aux [ROADMAP] §6.3/§6.4.

- **Les données entrées** → **Applications à connecter** *(grisé / futur)* : table d'apps
  avec un **interrupteur** par ligne — Apple Santé, Google Fit, Oura, Fitbit, Withings,
  Dexcom, **Localisation & météo** (température & humidité du lieu où l'on est, via la
  géolocalisation) — + **« Plus d'informations »** détaillant les données récupérées par app.
  *(Pas de « Fonctions » ici : aucune fonction du moteur ne s'y rattache.)*
- **Les entrées saisie** → **Fonctions** (*liste des tags* · *transformation* ·
  *sollicitation* · *analyse du ton de la voix*) · **Listes de tags** (chips des 13 thèmes +
  champ **« Ajouter un tag »** grisé) · **Structure des données** (transformation en
  informations ordonnées : catégorisation, extraction de valeurs, négations) ·
  **Campagnes de sollicitation** *(grisé)* = règles d'entrées sollicitées (cf. §7.2 ;
  *Qu'as-tu mangé ?* / *Toujours mal aux cuisses ?* / *As-tu dormi depuis ton dernier
  sommeil ?* avec leurs déclencheurs).
- **Traitement et présentation des données** → **Fonctions** (*facteurs du Récap*) ·
  **Récap des données** (7 / 14 / 30 jours, **actif**, ouvert par défaut) · **Portée de
  l'analyse** *(grisé)*.
- **Corrélations** → **Fonctions** (*moteur de corrélations*) · **Sources médicales**
  *(grisé)* : sources officielles mobilisables par l'IA, en **2 sous-parties** —
  **URL d'API** (8 sources : OMS-GHO, OMS-CIM-11, HAS, ANSM-BDPM, ANSES-Ciqual,
  PubMed/MEDLINE, openFDA, SNOMED CT/UMLS ; toggle + champ URL réel éditable) et **Jeux de
  données** (toggle + import de fichier ; placeholders régimes ; recherche « marketplace ») ;
  **« Ajouter une source »** toujours visible. **Cosmétique** (RAG / tool-use à construire).
  - **[ROADMAP]** *Analyse du ton de la voix* : **indisponible** en « à la main » et « en
    local » ; en **IA/LLM** = analyse du son de la voix pour détecter l'humeur (stress,
    énervement, joie…). Aucune méthode active aujourd'hui.

### III. Gestion des données personnelles
- **Import** → *Importer des données dans le journal* **[ROADMAP, grisé]** · *Importer des
  données (JSON)* (**fonctionnel** : restaure un export, **préserve l'identité** (token/email)
  et le mot de passe, confirmation si le compte a déjà des entrées).
- **Export et partage** → *Exporter le journal (JSON)* **[ROADMAP, grisé]** · *Exporter
  toutes les données* (**fonctionnel** : export **complet** de `store` ; nom
  `wwfm-<user>-AAAA-MM-JJ-HHMM.json`) · *Rapport pour mon médecin* **[ROADMAP, grisé]**.
- **Gestion des données personnelles et fonctions associées** *(grisé / cosmétique)* : items
  à cocher / déplier — *Ne jamais transmettre mes données ni mon nom à un tiers* (coché &
  verrouillé, étiquette « **RESTERA TOUJOURS GRATUIT** ») · *Chiffrer le stockage de mes
  données* (OVH mutualisé / option disque dédié + chiffrement de bout en bout, « **150 €/mois**
  ») · *Me proposer de tester de nouveaux protocoles de laboratoire* · *Partager mon journal
  de façon anonyme* · *Personnaliser mes valeurs de référence* (« **Sur devis** »).

### IV. Informations légales
3 liens ouvrant chacun un **écran texte** dédié (avec bouton retour vers Réglages) —
**Mentions légales**, **Conditions générales d'utilisation (CGU)**, **Conditions générales
de vente (CGV)**. Contenu **lorem ipsum** en démo, à remplacer par la version juridique.

> *« Charger des exemples » a été **retiré** des Réglages.*

**Design de l'écran Réglages** : présentation **neutre et structurée**, **sans le code
couleur du thème** — palette **grise**, **cartes plates** à bord net, en-têtes de **partie
(I–IV) en gras + séparateur**, **sous-groupes en petites capitales grises**, sections
repliables. Exceptions colorées (volontaires) : les **pastilles turquoise/corail** du
sélecteur de thème (c'est le contenu) et la **navigation** (barre d'onglets / haut), communes
à toute l'app. Segmented control « actif » : rail teinté + pastille blanche surélevée (anneau
+ ombre), texte inactif atténué.

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
- [ ] Corrélations manuelles : N facteurs ; méga-menu colonnes sous le champ, **affiché tant
      que le champ est focalisé** et **filtré à la frappe** (ne se ferme pas à la sélection) ;
      2 facteurs → nuage ; 3+ → score global unique (pas la liste des paires) + multi-courbes ;
      pastille verte/jaune/rouge + note **toujours**.
- [ ] Corrélations manuelles : suggestions de **facteurs typées** (catégorie/valeur) ; chip
      **catégorie** au fond plus intense que chip **valeur** (cf. §17 vocabulaire canonique).
- [ ] Réglages → **Liste des valeurs** (§6.5) : valeurs textuelles groupées par catégorie
      (nombres exclus) ; éditer / supprimer (retire le signal, confirmation) / ajouter ;
      **fusion par glisser-déposer** (souris + tactile, valeur reçue conservée) ; alias
      persistés + **normalisation à la saisie** (« Sucré » → « Sucre »).
- [ ] Journal : picto **Masquer le contenu** (floute texte + photos, chips visibles).
- [ ] Données : « Par catégorie » **replié par défaut**.
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

---

## 17. Vocabulaire canonique (Ubiquitous Language)

> Un seul mot par concept, identique partout : **ce que dit Elena = le mot dans le code = le
> mot dans l'UI**. Convention de code : **identifiants en anglais, textes UI via I18N**.
> Référence complète : `app-ios/glossaire.md`.

### 17.1 Termes piliers (corrélations)
- **Catégorie** (`category`, abrégé `cat`/`CATS`/`catName`) — un type, liste fixe (~13 :
  Sommeil, Alimentation, Douleur, Climat…). _Abandonné : « tag », « type », « thème »._
- **Valeur** (`value`) — une instance dans une catégorie (« Sucre », « Pluie », « 7,5 h »).
  _Abandonné : « élément », et « facteur » dans ce sens._
- **Facteur** (`factor`) — **ombrelle** : une chose corrélable = une **catégorie OU une valeur**.
  _Abandonné : « variable », « paramètre »._
- **Force** (`band`) — l'intensité d'une corrélation (faible/modérée/forte côté auto ;
  vert/jaune/rouge côté manuel). _Abandonné : « verdict »._

### 17.2 Homonymes à NE PAS confondre (conservés)
- `theme` = thème **couleur** (turquoise/corail), ≠ catégorie.
- `pinnedTag`/`obsoleteTag`/`hiddenTag`, `.corr-tag` = **badges de statut** d'une corrélation.
- `price-tag`, `pdp*Tag` = étiquettes de **prix** ; `tagline` = **slogan**.

### 17.3 Mises en conformité (faites, 27 juin 2026)
- `manualVocab()` renvoie des **facteurs typés** `{label, kind:'category'|'value'}` ; chips
  différenciés `.mf-sug--category` (fond `--c-200`) vs valeur `.mf-sug` (`--c-50`).
- **`verdict` → `band`** (code + CSS `.v-*` → `.band-*`/`.band-dot`) ; couleurs/libellés
  inchangés ; rétrocompat des données sauvegardées (`band || verdict`).
- **`tag` (sens catégorie) → `category`** : `pendingCategory`, `S.filters.category`,
  `data-act="category"`, `.catchip`/`.catchips`, `categoriesBody()`, libellés « Catégorie /
  Catégories actives / Ajouter une catégorie », textes « par catégorie », etc.

### 17.4 [ROADMAP] Alignement terminologique restant
- Aligner progressivement les mentions « tag »/« thème » des sections antérieures (notamment
  §6 « moteur d'attribution de tags », §8.2 « Par thème ») vers « catégorie ».
- (Optionnel) renommer les badges de statut `pinnedTag`/`.corr-tag` vers un vocabulaire
  « badge » si souhaité.

---

## 18. [VALIDÉ 30/06/2026 · conception] Modèle cible « valeurs plates » & extraction IA

> Issu d'une session de co-conception. **Remplace** la piste « champs typés par catégorie »
> (§17.4 backlog). Validé sur le principe ; **pas encore codé** (le moteur IA est gaté —
> voir §18.5). La démo web garde aujourd'hui le moteur **local** (§6.2) ; ce §18 décrit la
> **cible**.

### 18.1 Positionnement produit
- Le moteur raisonne sur une **masse** d'informations → produit **énormément d'indicateurs
  intermédiaires** (plus qu'un médecin n'en calculerait), puis **repère ce qui sort de
  l'ordinaire** (définition d'« ordinaire » à préciser ultérieurement), et **livre au
  patient s'il le souhaite mais surtout au médecin qui l'accompagne**.
- W **augmente** la relation patient↔médecin ; **ne diagnostique pas** (le médecin
  interprète). « Hors des repères de santé » = **information / repère**, jamais une alerte
  médicale ni un diagnostic.
- **V1 = « boîte de verre »** : seule utilisatrice = Elena (+ investisseurs) ; les
  investisseurs veulent **voir tous les KPI intermédiaires** → tout est **visible et
  auditable**. Filtres / vues = plus tard.

### 18.2 Modèle « valeurs plates »
- Un seul objet : la **valeur**. **Pas de niveaux figés** — la hiérarchie **émerge des
  formules** (graphe de dépendances : brut → calculé → agrégé → comparé).
- **Catégorie = un attribut / tag** sur la valeur, pas un niveau.
- Une **valeur** est une **série** (suite de points dans le temps), pas un scalaire.
- **Champs qualifiants** : toujours `nom (préférence) · type · source · grain` ; selon le
  cas `unité / échelle · formule (si calculée)` ; optionnels `synonymes · favori`.
  - **type** ∈ {numérique, durée, heure-horloge, booléen, ordinal, étiquette}
  - **source** ∈ {extraite (journal), calculée (formule), donnée (constante posée)}
  - **occurrence** = l'unité « par X » (nuit, jour…) = les **lignes** ; les valeurs = les
    **colonnes** ; une formule « point par point » aligne ses opérandes sur l'occurrence.
- **Agrégations (moyennes) & favoris** sortent de la liste plate → **encart Récap dédié à
  règles** (valeur source + agrégation + fenêtre + normale + repère → écart + statut).
  *(Récap/moyennes/formules : parkés pour l'instant — le focus courant est l'extraction.)*

### 18.3 Focus courant : EXTRACTION — partage des rôles
- **Elena fournit la STRUCTURE** (le schéma) ; **l'IA déduit & peuple** les valeurs depuis
  les entrées **et découvre de nouveaux types au fil de l'eau** (le catalogue n'est **pas**
  pré-listé) ; **Elena cure** (renommer / fusionner / corriger). La « Liste des valeurs »
  (§6.5) devient l'outil de **curation** du catalogue déduit par l'IA.

### 18.4 Structure de base (extraction)
- **Entrée** : `id · date-heure · texte · (photo)`
- **Type de valeur** *(catalogue déduit par l'IA, éditable)* : `id · nom (préférence) ·
  synonymes[] · type · unité/échelle · catégorie (tag)`
- **Relevé** *(extrait d'une entrée)* : `id · → type de valeur · valeur (typée) ·
  moment/date de référence (≠ horodatage de l'entrée si le texte le précise) ·
  → entrée source + extrait exact · confiance`
- Liens : une **Entrée** produit plusieurs **Relevés** ; chaque **Relevé** pointe vers un
  **Type de valeur** et vers son **Entrée** d'origine (traçabilité = base de la boîte de verre).

### 18.5 Moteur IA — faisabilité & coût (gate)
- Aujourd'hui l'extraction = **regex local** (`structureEntry`, §6.2). Pour l'IA :
  `api.php` → **API Anthropic** (paiement **à l'usage, sans abonnement**), **clé côté
  serveur uniquement** (jamais dans `app.js`, jamais poussée). **Pas** lié au compte
  claude.ai (chat). Tourne **à chaque entrée** (+ « Tout réanalyser » pour l'historique).
- **Coût** ≈ **46 $/an** avec **Haiku 4.5** à 50 entrées/jour (~0,25 ¢/entrée) — sans forfait.
- **Décision en attente** (débloque le branchement) : clé API · accord pour que le **texte
  des entrées parte vers l'API** (au moins pour le démo) · conception du **prompt
  d'extraction**. Le réglage `fn2` (§6.2) bascule local ↔ IA dès branchement.
- **CONDITION DE BRANCHEMENT — ANONYMISATION (non négociable, dès la phase démo).**
  Exigence explicite d'Elena (30/06/2026) : *« si quelqu'un tape un jour mon nom dans une
  base, même privée, d'Anthropic, il ne doit jamais tomber sur mes infos (poids,
  alimentation, énergie…) ».* L'extraction IA n'est branchée **que** si elle est
  **anonymisée par construction** dans `api.php` :
  1. **Compte API neutre** — clé Anthropic créée sous une identité **projet / pseudonyme**, jamais le nom de l'utilisatrice (le compte qui émet les requêtes n'est pas son identité).
  2. **Payload minimal** — la requête ne contient **QUE le texte de l'entrée** ; **jamais** le nom, l'e-mail, le token de session, ni un champ de profil. L'identité reste sur le serveur OVH (`store_acc_<id>.json`, clé par ID opaque) et dans le navigateur — hors du chemin vers l'API.
  3. **Caviardage des identifiants** — avant l'envoi, retirer du **texte** le nom et le slug d'e-mail connus de l'app (→ « [moi] »), au cas où l'entrée se nommerait elle-même.
  4. **Référence opaque** — si une requête devait porter un identifiant utilisateur (inutile pour l'extraction), ce serait un **id aléatoire**, jamais le nom.
  → **Objectif : aucune donnée reliable au nom de l'utilisatrice** ; une recherche par nom
  ne renvoie rien. Rappels API : **pas d'entraînement** sur les données API, **rétention
  courte** (non indéfinie) puis suppression, contenu **non indexé / non exposé à des tiers**
  — durée exacte / ZDR à confirmer dans le **DPA + conditions** Anthropic du moment. *(La
  gouvernance « vrais patients » — RGPD, donnée de santé hors UE, consentement, DPA — reste
  un chantier distinct, hors démo.)*
- **Ligne non négociable** : tout **chiffre de corrélation** reste calculé par du **code
  déterministe auditable** (raccord mantra « Comparaison n'est pas raison ») ; l'IA
  interprète / extrait / explique, ne tranche pas la statistique.
