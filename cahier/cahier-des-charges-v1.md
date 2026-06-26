# Cahier des charges — Application iOS « What works for me »
## Version 1 (MVP)

> Document de référence pour la V1.
> Projet présenté sur https://w.shoette.com/ (marque publique : « What is wrong with me »).
> **Nom de l'application : « What works for me ».**

---

## 1. Présentation du projet

- **Nom de l'app** : **What works for me**.
- **Promesse** : « The AI health journal you talk to » / « Le journal de santé intelligent à qui vous parlez ».
- **Vision** : l'utilisateur raconte librement son quotidien (symptômes, sommeil, humeur,
  stress, repas…) à la voix, par texte ou par photo. L'application agrège des centaines de
  signaux (Apple Santé, météo, cycle…), les **structure automatiquement en coulisses** grâce
  à l'IA, et fait remonter des **corrélations** classées par niveau de confiance — par exemple :
  *« Raideur des mains après les dîners laitiers, les jours humides — confiance 84 %, 11 incidents »*.
- **Public cible** : personnes avec des symptômes persistants mal expliqués par la médecine
  classique, qui veulent comprendre les schémas de leur santé.
- **Positionnement légal** : **ce n'est pas un dispositif médical**, mais un outil numérique
  d'aide à la compréhension. Disclaimer clair dans l'app.

---

## 2. Objectifs et règles de la V1 (MVP)

1. **100 % gratuit** — aucune mention de paiement, d'abonnement ou de prix nulle part.
2. **Pas de sécurité/chiffrement applicatif à développer** — uniquement des **données de test**
   au départ (on s'appuie sur la sécurité de base fournie automatiquement par le backend).
3. **Bilingue FR + EN** — choix dans les Paramètres. **Français par défaut.**
4. **Gestion de comptes utilisateurs** — chaque compte n'accède qu'à ses propres données.
5. **Sauvegarde des données** — les données survivent à la suppression de l'app, restent
   accessibles même machine éteinte, et **ne sont jamais envoyées sur GitHub** (cf. §8).

**Succès du MVP** : démontrer la boucle de valeur —
*saisie libre → structuration IA invisible → consultation (journal + tables) → insights → relances intelligentes*.

---

## 3. Décisions techniques validées

| Sujet | Choix retenu |
|---|---|
| Plateforme | **iOS natif, SwiftUI** (cible iOS 17+) |
| Backend | **Supabase** (Auth, Postgres + RLS, Storage photos, Edge Functions) |
| IA / insights | **API Anthropic (Claude)**, appelée **côté serveur uniquement** ; clé jamais embarquée |
| Saisie | **Voix + texte + photo (OCR)** |
| Sources automatiques | **Apple Santé (HealthKit)**, **Météo + localisation**, **Cycle menstruel** |
| Notifications | **Push (APNs)** à terme — **démarrage en notifications LOCALES** (sans compte Apple Developer) |
| Langues | **FR (défaut) + EN**, bascule dans les Paramètres |
| Design | **Ultra simple, aéré, police système** ; système couleur monochrome, **2 thèmes** (cf. §10) |
| Stockage / sauvegarde | Cloud Supabase (toujours allumé) + **export de secours vers FTP OVH** (cf. §8) |

---

## 4. Périmètre fonctionnel V1

### 4.1 Comptes & authentification
- Inscription / connexion **email + mot de passe** (Supabase Auth).
- **Cloisonnement par compte** (row-level security : chaque ligne liée à un `user_id`).
- Déconnexion, suppression de compte.

### 4.2 Saisie multimodale (le cœur)
- **Voix** : micro → transcription temps réel (langue de l'app) → texte éditable.
- **Texte** : zone de saisie libre.
- **Photo** : prise de vue ou import (labo, tensiomètre, glucomètre, repas…) → **OCR** (VisionKit).
- Une **entrée** = contenu libre horodaté combinant voix + texte + photo. **Aucun formulaire imposé.**

### 4.3 Structuration invisible par l'IA
- Chaque entrée est envoyée à Claude qui en extrait des **signaux structurés** (catégorie,
  valeur, date/heure de l'événement, confiance) — **invisibles** pour l'utilisateur.
- Catégories V1 : Sommeil, Alimentation, Humeur, Énergie, Douleur, Stress, Symptômes,
  Médicaments, Activité, Mesures (glycémie, tension…), Environnement, Divers.
- Les sources automatiques alimentent les **mêmes** catégories.

### 4.4 Les deux vues des données
- **Vue Journal (chronologique)** : fil des entrées telles que saisies + puces des signaux détectés. Recherche.
- **Vue Tables structurées** : signaux regroupés **par catégorie** (tout le Sommeil ensemble,
  toute l'Alimentation ensemble…), triables/filtrables. L'utilisateur **voit ses données
  organisées sans avoir rempli de formulaire**.

### 4.5 Sources de données automatiques
- **Apple Santé (HealthKit)** : sommeil, pas, fréquence cardiaque (lecture).
- **Météo + localisation** : météo / humidité / pression du jour → signaux « Environnement ».
- **Cycle menstruel** : via Apple Santé si dispo, sinon saisie libre.

### 4.6 Moteur d'insights / corrélations
- Régulièrement / à la demande, Claude analyse l'historique et fait remonter des **patterns**
  en langage naturel, avec **niveau de confiance** et **incidents justificatifs**.
- Affichage en **cartes** ; statut nouveau / vu / écarté.

### 4.7 Tableau de bord (tendances)
- Graphiques par catégorie clé sur ~2 semaines (sommeil, douleur, énergie, humeur, météo…).
- Cartes des insights récents.

### 4.8 Relances intelligentes (notifications)
- Le backend identifie, par utilisateur, les **catégories importantes** et leurs **créneaux habituels**.
- V1 : valeurs par défaut sensées + apprentissage léger des habitudes réelles dès le 1ᵉʳ jour.
- Donnée attendue manquante → **relance contextuelle** en langage naturel :
  *« Réveillé ? Comment s'est passée la nuit ? »* / *« Toujours rien mangé aujourd'hui ? »*.
- Respect des **heures calmes** ; coupure possible par catégorie.
- **Démarrage** : notifications **locales** (programmées sur l'appareil). Passage au **push
  serveur (APNs)** dès l'obtention du compte Apple Developer.

### 4.9 Paramètres
- **Langue** (FR / EN).
- **Thème** (Turquoise / Corail) — cf. §10.
- Compte (email, déconnexion, suppression).
- Connexions (Apple Santé, localisation/météo).
- Notifications (activation, heures calmes).
- **Sauvegarde / export** des données (cf. §8).
- Mention légale « Ce n'est pas un dispositif médical ».

---

## 5. Parcours utilisateur

1. **Onboarding** : création de compte → 3 écrans d'explication → autorisations (micro, Santé,
   localisation, notifications) → **première entrée guidée**.
2. **Quotidien** : l'utilisateur parle / écrit / photographie librement ; reçoit des relances
   contextuelles ; consulte journal et tables.
3. **Découverte** : après quelques jours, les **premiers insights** apparaissent.

---

## 6. Liste des écrans (V1)

1. Authentification (connexion / inscription)
2. Onboarding (intro + autorisations)
3. **Accueil / Saisie rapide** (micro, texte, photo) — écran central
4. **Journal** (timeline)
5. **Tables structurées** (par catégorie) + détail d'une catégorie
6. **Insights / Tendances** (tableau de bord)
7. Détail d'un insight (incidents justificatifs)
8. Paramètres

(+ états : vide, chargement, hors-ligne.)

---

## 7. Architecture technique

```
┌────────────────────┐        ┌──────────────────────────────┐        ┌──────────────┐
│   App iOS (SwiftUI) │◄──────►│  Supabase                    │◄──────►│  API Claude  │
│  - Saisie voix/txt  │  HTTPS │  - Auth (comptes)            │  (clé  │ (Anthropic)  │
│  - Photo + OCR      │        │  - Postgres + RLS (données)  │ secrète│ structuration│
│  - HealthKit        │        │  - Storage (photos)          │ serveur│  + insights  │
│  - WeatherKit/Loc   │        │  - Edge Functions (IA, push) │ only)  │              │
│  - Cache local      │        │  - pg_cron (relances)        │        │              │
└─────────┬──────────┘        └────────┬───────────┬─────────┘        └──────────────┘
          │                            │           │
          └──────── notifs ────────────┘           └──► Export auto → FTP OVH (sauvegarde)
```

- **Clé API Claude** : uniquement dans les Edge Functions (jamais dans l'app).
- **HealthKit / WeatherKit / CoreLocation** : lecture sur l'appareil → envoi des signaux au backend.
- **Notifications** : locales au démarrage ; APNs piloté par Edge Function + pg_cron ensuite.
- **Cache local** (SwiftData) : consultation hors-ligne + file d'attente d'envoi.

---

## 8. Sauvegarde & confidentialité des données

**Besoin** : les données doivent survivre à la suppression de l'app, rester accessibles même
machine éteinte, et **ne jamais se retrouver sur GitHub**.

- **Maison principale = Supabase (cloud, allumé 24/7)** : supprimer l'app n'efface **pas** les
  données ; après réinstallation + reconnexion, tout revient. Supabase est **distinct de GitHub** —
  aucune donnée personnelle ne transite par le dépôt de code.
- **Filet de sécurité sous ton contrôle = export automatique vers ton FTP OVH** : une fonction
  planifiée (côté serveur, indépendante de ta machine) dépose des **dumps JSON** (par utilisateur)
  sur ton espace OVH. Toujours dispo, toujours à toi, même Mac éteint.
- **Anti-fuite GitHub** : `.gitignore` exclut **toute donnée** et **tout secret** ; les clés
  (Anthropic, Supabase service key, identifiants FTP) vivent dans des variables d'environnement /
  fichiers **non versionnés**. Le code peut aller sur GitHub ; **les données et les secrets, jamais**.
- **Phase de démarrage local** (avant branchement Supabase) : les données de test sont en local
  (SwiftData) ; un **export manuel** (fichier JSON partageable / envoi FTP) permet déjà de les sauvegarder.

---

## 9. Modèle de données (simplifié)

- **profiles** : `user_id`, langue, thème, fuseau horaire, préférences de notification.
- **entries** : `id`, `user_id`, `created_at`, `event_time?`, `source`, `raw_text`, `photo_url?`, `ocr_text?`, `lang`.
- **signals** : `id`, `user_id`, `entry_id?`, `source`, `category`, `key`, `value_text`, `value_num?`, `unit?`, `event_time`, `confidence`.
- **insights** : `id`, `user_id`, `statement`, `confidence`, `category_tags[]`, `supporting_signal_ids[]`, `status`, `created_at`.
- **device_tokens** : `id`, `user_id`, `apns_token`, `platform`, `updated_at`.
- **nudge_habits** : `id`, `user_id`, `category`, `expected_window`, `enabled`.

---

## 10. Direction artistique / Design

**Principes** : ultra simple, **aéré** (beaucoup d'espace blanc), **une seule police simple**
(police système iOS — SF Pro), hiérarchie par taille/poids, zéro fioriture.

**Système de couleur monochrome** : fond blanc + une **rampe de nuances d'UNE couleur**.
**2 thèmes** au choix dans les préférences de chaque utilisateur (persistant) :

**Thème 1 — Turquoise** (base **#118996**)
| 50 | 100 | 200 | 300 | 400 | **500** | 600 | 700 | 800 | 900 |
|----|-----|-----|-----|-----|--------|-----|-----|-----|-----|
| #E8F3F4 | #C5E3E5 | #93C9CD | #5FAFB5 | #2F9AA1 | **#118996** | #0E6E78 | #0B545C | #073A40 | #042227 |

**Thème 2 — Corail** (base **#F1514F**, rouge du site)
| 50 | 100 | 200 | 300 | 400 | **500** | 600 | 700 | 800 | 900 |
|----|-----|-----|-----|-----|--------|-----|-----|-----|-----|
| #FDECEC | #FBCFCE | #F7A6A4 | #F47F7D | #F26967 | **#F1514F** | #CE3F3D | #9E302E | #6F2120 | #431312 |

*(Rampes indicatives, à affiner.)*

**Usage** : fond blanc / 50 ; boutons & accents 500–600 ; textes 800–900 ; bordures/séparateurs
100–200 ; états désactivés 200–300. Mode sombre : V2.

---

## 11. Internationalisation (FR / EN)

- Tous les textes de l'interface localisés FR + EN.
- **Défaut : FR** ; bascule manuelle dans les Paramètres (indépendante de la langue système).
- Transcription vocale dans la langue choisie ; Claude **structure et répond dans la langue de l'utilisateur**.

---

## 12. Hors périmètre V1 (→ V2+)

- Paiement / abonnement (volontairement absent).
- Chiffrement applicatif avancé, conformité HDS/RGPD complète.
- Intégrations tierces étendues (Oura, Fitbit, agenda, glucomètres Bluetooth…).
- Partage médecin / export PDF élaboré.
- Analyse du **ton de la voix** (détection de tension).
- Personnalisation poussée des relances (ML avancé).
- Mode sombre.

---

## 13. Phasage & démarrage

- **Lot 1 — Boucle de base** : Auth + saisie texte/voix + structuration IA + vue Journal + 2 thèmes + i18n.
- **Lot 2 — Données & sources** : Tables par catégorie + Apple Santé + météo + cycle.
- **Lot 3 — Intelligence** : Insights / corrélations + tableau de bord.
- **Lot 4 — Engagement** : Relances (locales → push) + photo/OCR + sauvegarde FTP + finitions.

**Première version visible** : Lot 1 en **local-first** (sans dépendre de Supabase/clé API/compte
Apple Developer), pour valider l'expérience le plus vite possible. Branchement Supabase + Claude
réel + sauvegarde FTP dès que les accès sont disponibles.

---

## 14. Prérequis pratiques

- **Mac + Xcode** (gratuit).
- **Compte Apple Developer (~99 $/an)** : **plus tard** (on démarre en local). Requis ensuite pour
  le push réel (APNs), le test sur iPhone, HealthKit réel et TestFlight/App Store. → Coût de
  **développement**, pas pour l'utilisateur final : la règle « gratuit » reste respectée.
- **Compte Supabase** (offre gratuite).
- **Clé API Anthropic** (facturation à l'usage, faible en test) — invisible pour l'utilisateur.
- **Accès FTP OVH** (déjà disponible) pour la sauvegarde de secours.

---

## 15. Décisions finalisées

- **Nom de l'app** : **What works for me**.
- **Apple Developer** : démarrage en **local** ; passage à un vrai compte **dès que possible**.
- **Thèmes** : Turquoise (#118996) et Corail (#F1514F), au choix dans les préférences.
- **Sauvegarde** : Supabase (principal) + export FTP OVH (secours) ; jamais de données sur GitHub.
- **Construction** : en continu ; première version visible = Lot 1 local-first.

---

## 16. Annexe — V1 web intermédiaire (en ligne)

En attendant l'installation de Xcode + le compte Apple Developer (indispensables à l'app
native), une **V1 web fonctionnelle** est déployée pour tester l'expérience tout de suite,
y compris sur iPhone.

- **URL** : https://w.shoette.com/app/ (sous-dossier, n'affecte pas la landing).
- **Stack** : HTML/CSS/JS + petit backend **PHP** (`api.php`) qui stocke chaque compte dans
  `/w/app/data/store_<id>.json` sur OVH → données persistantes (survivent à la suppression de
  l'app, accessibles partout, **hors GitHub**). Dossier `data/` protégé (403).
- **Inclus** : comptes (inscription/connexion), saisie libre, **structuration automatique** en
  signaux (heuristique FR/EN en attendant le vrai Claude), vue **Journal**, vue **Tables** par
  catégorie, **Tendances** + liens repérés, **2 thèmes**, **FR/EN**, export JSON, jeu d'exemples.
  PWA (« Ajouter à l'écran d'accueil »).
- **Limites assumées** : structuration heuristique (le vrai Claude se branche dès qu'une clé API
  est fournie, via un proxy serveur) ; dictée vocale indisponible dans Safari iOS (native plus
  tard) ; OCR photo non inclus pour l'instant.
- **Vérifié en ligne** : page + assets (200), backend `signup`/`save`/`load` (round-trip OK),
  protection `data/` (403).
- **Code local** : `app-web/`. **Cible finale inchangée** : app **native SwiftUI** (cf. tout le présent document).
