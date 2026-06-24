# Cahier des charges v2 — Application iOS « What works for me »
## Version 1 (MVP) — spécification technique « staffable »

> **Statut** : ce document **remplace** `cahier-des-charges.md` (v1). Il en conserve tout le
> contenu et ajoute les artefacts nécessaires pour découper, attribuer et construire le projet
> sans clarification permanente : taxonomie, schémas IA, contrat d'API, modèle SQL + RLS,
> design system, critères d'acceptation, QA/observabilité, gate de conformité, plan détaillé.
>
> **Décisions intégrées (échange du 2026-06-24)** : une seule appli (iOS natif) + un seul backend
> (Supabase) ; insights = **hybride stats + Claude** ; **tout** le périmètre dans la V1 ;
> réalisation **Claude + Elena**. Le **prototype web est conservé** comme **outil de conception / environnement de staging** (annexe §21).

---

## 0. Changelog v1 → v2

| Ajout / changement | Section |
|---|---|
| Positionnement « outil empirique de corrélations / à montrer au médecin » + disclaimers | §2 |
| Architecture : chemin critique, modèle de synchro/conflit, environnements, secrets, idempotence | §4 |
| Modèle de données complet : DDL, enums, index, **policies RLS écrites**, migrations | §5 |
| **Taxonomie des signaux** (vocabulaire contrôlé fermé) — artefact pivot | §6 |
| **Contrats IA** : prompt + schéma JSON de structuration (Haiku) ; **moteur d'insights hybride** (stats + Sonnet) | §7 |
| **Contrat d'API** (Edge Functions, PostgREST, jobs planifiés) | §8 |
| Critères d'acceptation, états (vide/chargement/erreur/hors-ligne), cas limites par feature | §9 |
| **Design system** complet (tokens, composants, accessibilité) + réconciliation police | §11 |
| **Moteur de relances** détaillé (apprentissage, planification, APNs) | §13 |
| **Gate de conformité** horodaté avant vrais utilisateurs | §15 |
| **QA & observabilité** | §16 |
| Plan : lots, dépendances, **chemin critique**, estimations | §18 |

---

## 1. Présentation du projet

- **Nom de l'app** : **What works for me**.
- **Promesse** : « The health journal you talk to » / « Le journal de santé à qui vous parlez ».
- **Vision** : l'utilisateur raconte librement son quotidien (symptômes, sommeil, humeur, stress,
  repas…) à la voix, par texte ou par photo. L'app agrège des signaux (Apple Santé, météo, cycle…),
  les **structure automatiquement en coulisses**, et fait remonter des **corrélations empiriques**
  — p.ex. *« Raideur des mains les jours de dîner laitier + temps humide : 11 occurrences sur 14 jours »*.
- **Nature du produit** : **journal de santé** + **outil d'enquête personnel** + **outil de
  collecte, visualisation et présentation de corrélations à transmettre à son médecin**.
- **Public cible** : personnes avec symptômes persistants mal expliqués, qui veulent comprendre
  les schémas de leur santé et arriver mieux préparées en consultation.

---

## 2. Objectifs, règles & positionnement

### 2.1 Règles de la V1 (inchangées)
1. **100 % gratuit** — aucune mention de paiement nulle part.
2. **Pas de sécurité/chiffrement applicatif à développer** — **données de test** uniquement au
   départ (on s'appuie sur la sécurité native de Supabase). Voir le **gate** §15.
3. **Bilingue FR + EN** — choix dans les Paramètres. **FR par défaut.**
4. **Comptes utilisateurs** — chaque compte n'accède qu'à ses propres données.
5. **Sauvegarde** — données persistantes (survivent à la suppression de l'app), accessibles même
   machine éteinte, **jamais sur GitHub** (§14).

### 2.2 Positionnement & disclaimers (vocabulaire validé)
- **Ce n'est PAS un dispositif médical** et **cela ne remplace pas un médecin**.
- L'app est un **outil empirique de recherche de corrélations** : elle **observe des associations**,
  elle n'établit **pas** de causalité ni de diagnostic.
- Vocabulaire à employer dans l'UI : « association observée », « occurrences », « à explorer »,
  « à présenter à votre médecin » — **jamais** « cause », « diagnostic », « vous devriez ».
- **Disclaimer** affiché à l'onboarding + accessible dans Paramètres (FR/EN) :
  > « What works for me est un journal de santé et un outil d'exploration de corrélations. Il ne
  > fournit pas de diagnostic et ne remplace pas l'avis d'un professionnel de santé. Les associations
  > présentées sont statistiques, pas des preuves de cause à effet. »
- **Exposition juridique** : assumée faible en phase MVP (données de test, usage interne) ; **revue
  juridique complète avant toute commercialisation** (cf. gate §15).

---

## 3. Décisions techniques validées

| Sujet | Choix |
|---|---|
| Plateforme | **iOS natif, SwiftUI** (cible **iOS 17+**) |
| Backend (unique) | **Supabase** : Auth, Postgres + RLS, Storage (photos), Edge Functions (Deno/TS), `pg_cron` |
| IA — structuration | **Claude Haiku 4.5** (`claude-haiku-4-5`) — extraction de signaux, haut volume/bas coût |
| IA — narration d'insights | **Claude Sonnet 4.6** (`claude-sonnet-4-6`) — mise en mots, volume faible |
| Insights — méthode | **Hybride** : moteur statistique déterministe (détection + force) → Claude rédige |
| Saisie | **Voix + texte + photo (OCR)** |
| Sources auto | **Apple Santé (HealthKit)**, **Météo (WeatherKit + CoreLocation)**, **Cycle** |
| Notifications | **Locales** au démarrage → **push APNs** (piloté backend) dès compte Apple Developer |
| Cache local | **SwiftData** (lecture hors-ligne + file d'attente d'envoi) |
| Langues | **FR (défaut) + EN** |
| Police | **Inter** (texte) + **Space Grotesk** (titres) — embarquées (cohérence avec la marque) ; icônes **SF Symbols** |

> **Note coûts IA** (réf. tarifs cache 2026-06-04) : Haiku 4.5 **1 $/MTok in, 5 $/MTok out** ;
> Sonnet 4.6 **3 $/MTok in, 15 $/MTok out**. Entrées courtes + cache de la taxonomie → coût/entrée négligeable (§7.4).

---

## 4. Architecture technique

### 4.1 Vue d'ensemble (une appli, un backend)
```
┌────────────────────────┐     HTTPS/JWT      ┌─────────────────────────────────────┐     ┌─────────────┐
│  App iOS (SwiftUI)      │ ◄────────────────► │  Supabase                           │ ──► │  API Claude  │
│  • Saisie voix/texte    │  (PostgREST +      │  • Auth (email/mot de passe)        │ clé │  (Anthropic) │
│  • Photo + OCR (Vision) │   Edge Functions)  │  • Postgres + RLS (données/compte)  │ srv │  Haiku/Sonnet│
│  • HealthKit / Weather  │                    │  • Storage (photos, privé)          │     └─────────────┘
│  • SwiftData (cache)    │ ◄──── APNs ──────  │  • Edge Functions (IA, push, export)│
└────────────────────────┘                    │  • pg_cron (nuit : insights, nudges,│
                                               │    export FTP)                      │ ──► Export JSON → FTP OVH (secours)
                                               └─────────────────────────────────────┘
```
- **Clé API Claude** : uniquement dans les Edge Functions (secret Supabase). Jamais dans l'app.
- **Le web n'est plus dans l'architecture** : un seul client (iOS), un seul backend (Supabase).

### 4.2 Chemin critique « saisie → structuration → UI » (asynchrone, UI optimiste)
1. L'utilisateur valide une entrée → écriture **locale** (SwiftData) + insertion `entries` (statut `pending`).
   L'entrée apparaît **immédiatement** dans le Journal (récit brut).
2. L'app appelle `POST /functions/v1/structure-entry { entry_id }`.
3. L'Edge Function appelle **Haiku 4.5** (structured output), insère les `signals`, passe l'entrée à `structured`.
4. L'app reçoit la réponse (ou via Realtime) → affiche les **puces** de signaux. En cas d'échec : statut
   `failed`, **retry** exponentiel (3 tentatives), l'entrée reste lisible. Aucune perte.
- **Règle** : la structuration ne **bloque jamais** la saisie. Latence cible structuration < 3 s (p50).

### 4.3 Synchronisation & conflits
- **Source de vérité = Supabase.** SwiftData = cache + file d'attente hors-ligne.
- Chaque ligne porte `id` (UUID généré client), `updated_at`, `deleted_at` (soft-delete = tombstone).
- **Écritures** : upsert. **Pull** des changements via filtre `updated_at > last_sync_watermark`.
- **Conflits** : **last-write-wins au niveau ligne** par `updated_at` (les entrées sont surtout en
  ajout ; édition rare). Les signaux dérivés sont **remplacés** par `entry_id` (idempotent, §4.5).
- **Hors-ligne** : mutations mises en file locale → rejouées à la reconnexion ; lecture depuis le cache.

### 4.4 Environnements, secrets, migrations
- **Environnements** : `dev` et `prod` = deux projets Supabase distincts (région **EU**). Schéma `Debug`/`Release` côté Xcode.
- **Secrets** : clé Anthropic, identifiants FTP, clé service Supabase → **secrets Edge Functions** + `xcconfig` non versionnés. **Jamais** dans le dépôt (`.gitignore`, §14).
- **Migrations** : SQL versionné dans `supabase/migrations/` (CLI Supabase). Toute évolution de schéma = nouvelle migration.
- **CI/CD** : build Xcode + tests sur PR ; déploiement Edge Functions via `supabase functions deploy`. (Détail outil à valider.)

### 4.5 Idempotence des sources automatiques
- Chaque échantillon HealthKit a un **UUID**. On stocke `source` + `source_uuid` sur le signal, avec
  **index unique** `(user_id, source, source_uuid)` → ré-imports sans doublons.
- Météo : clé d'idempotence = `(user_id, 'weather', date_locale)` (1 relevé/jour).

---

## 5. Modèle de données (Postgres / Supabase)

### 5.1 Enums
```sql
create type signal_source as enum ('manual','health','weather','cycle');
create type entry_source  as enum ('text','voice','photo','mixed');
create type signal_category as enum (
  'sleep','food','mood','energy','pain','stress','symptom',
  'medication','activity','measurement','environment','cycle','other');
create type signal_polarity as enum ('positive','neutral','negative');
create type entry_status   as enum ('pending','structured','failed');
create type insight_status as enum ('new','seen','dismissed');
```

### 5.2 Tables (extrait DDL)
```sql
create table profiles (
  user_id     uuid primary key references auth.users on delete cascade,
  lang        text not null default 'fr' check (lang in ('fr','en')),
  theme       text not null default 'turquoise' check (theme in ('turquoise','coral')),
  timezone    text not null default 'Europe/Paris',
  notif_prefs jsonb not null default '{}'::jsonb,   -- {enabled, quiet_start, quiet_end, per_category:{}}
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table entries (
  id          uuid primary key,                      -- généré côté client
  user_id     uuid not null references auth.users on delete cascade,
  created_at  timestamptz not null default now(),
  event_time  timestamptz,                           -- moment de l'événement (peut différer)
  source      entry_source not null default 'text',
  raw_text    text,
  ocr_text    text,
  photo_path  text,                                  -- chemin Storage (bucket privé)
  lang        text not null default 'fr',
  status      entry_status not null default 'pending',
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);
create index on entries (user_id, created_at desc);
create index on entries (user_id, updated_at);

create table signals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  entry_id    uuid references entries on delete cascade,
  source      signal_source not null default 'manual',
  source_uuid text,                                  -- UUID HealthKit / clé d'idempotence
  category    signal_category not null,
  key         text,                                  -- ex: 'dairy','headache','glucose' (vocab §6)
  value_text  text,
  value_num   double precision,
  unit        text,                                  -- ex: 'h','mg/dL','mmHg' (§6)
  polarity    signal_polarity not null default 'neutral',
  event_time  timestamptz not null,
  confidence  double precision not null default 0.7,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);
create index on signals (user_id, category, event_time);
create unique index signals_source_dedup
  on signals (user_id, source, source_uuid) where source_uuid is not null;

create table insights (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users on delete cascade,
  statement    text not null,                        -- texte rédigé par Claude
  caveat       text,                                 -- "association, pas causalité"
  outcome_cat  signal_category not null,
  trigger_key  text not null,
  incidents    int not null,                         -- nb de co-occurrences (support)
  days_observed int not null,
  strength     double precision not null,            -- lift ou |phi|
  strength_band text not null,                       -- 'weak'|'moderate'|'strong'
  p_value      double precision,
  supporting_signal_ids uuid[] not null default '{}',
  status       insight_status not null default 'new',
  computed_at  timestamptz not null default now()
);
create index on insights (user_id, status, computed_at desc);

create table device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  apns_token text not null,
  environment text not null default 'sandbox',       -- sandbox|production
  updated_at timestamptz not null default now(),
  unique (user_id, apns_token)
);

create table nudge_habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  category signal_category not null,
  expected_start time, expected_end time,            -- créneau habituel (heure locale)
  weight double precision not null default 0,        -- force de l'habitude (apprise)
  enabled boolean not null default true,
  last_nudged_at timestamptz,
  unique (user_id, category)
);

create table ai_logs (                               -- observabilité IA
  id bigserial primary key, user_id uuid, kind text, model text,
  input_tokens int, output_tokens int, latency_ms int, ok boolean,
  error text, created_at timestamptz not null default now()
);
```

### 5.3 RLS (Row-Level Security) — écrites
```sql
alter table profiles      enable row level security;
alter table entries       enable row level security;
alter table signals       enable row level security;
alter table insights      enable row level security;
alter table device_tokens enable row level security;
alter table nudge_habits  enable row level security;

-- Modèle générique appliqué à chaque table « owned by user » :
create policy "own_select" on entries for select using (auth.uid() = user_id);
create policy "own_insert" on entries for insert with check (auth.uid() = user_id);
create policy "own_update" on entries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_delete" on entries for delete using (auth.uid() = user_id);
-- (idem signals, profiles[user_id=auth.uid()], insights, device_tokens, nudge_habits)
```
- **insights**, **nudge_habits**, **ai_logs** sont écrits par les Edge Functions avec la **service key**
  (bypass RLS côté serveur) ; l'app les lit en RLS (select own).
- **Storage** : bucket `photos` privé, policy `auth.uid() = (storage.foldername)[1]` (1 dossier/UID), URLs signées.

### 5.4 Suppression de compte (RGPD-friendly dès la V1)
`delete auth.users` → cascade sur tout (FK `on delete cascade`) + suppression des objets Storage du dossier UID.

---

## 6. Taxonomie des signaux (vocabulaire contrôlé) — **artefact pivot**

> Cette taxonomie est **partagée** par : le prompt de structuration (Haiku), le modèle de données,
> la vue Tables, les graphiques et le moteur d'insights. Les **clés sont en anglais** (stables) ;
> les **libellés FR/EN** vivent dans les fichiers de localisation. Enum **fermé** ; ajout = migration.

| `category` | `key` (exemples, liste contrôlée) | `value_num` + `unit` | `polarity` utile ? |
|---|---|---|---|
| `sleep` | `duration`, `quality`, `awakening` | `duration`→`h` | oui (quality) |
| `food` | `dairy`,`gluten`,`sugar`,`alcohol`,`coffee`,`meal`,`water` | — | non |
| `mood` | `state` | échelle 1–5 (optionnelle) | oui |
| `energy` | `level` | 1–5 | oui |
| `pain` | `headache`,`joint`,`back`,`stomach`,`muscle`,`other` | intensité 1–10 | oui (négatif) |
| `stress` | `level` | 1–5 | oui (négatif) |
| `symptom` | `nausea`,`fever`,`cough`,`rash`,`bloating`,`dizziness`,`other` | `fever`→`°C` | oui (négatif) |
| `medication` | `<nom libre>` | dose→`mg` | non |
| `activity` | `walk`,`run`,`yoga`,`gym`,`bike`,`swim`,`steps` | `steps`→count, durée→`min` | non |
| `measurement` | `glucose`,`blood_pressure`,`weight`,`heart_rate`,`hrv` | `mg/dL`,`mmHg`,`kg`,`bpm`,`ms` | non |
| `environment` | `rain`,`humidity`,`temperature`,`pressure` | `%`,`°C`,`hPa` | non |
| `cycle` | `period`,`phase` | jour du cycle | non |
| `other` | `note` | — | non |

**Règles de normalisation** : durées sommeil en heures décimales ; tension `"120/80"`→`value_text`
+ `unit='mmHg'` ; échelles bornées 1–5 (mood/energy/stress) ou 1–10 (douleur) ; température en °C ;
dates relatives (« hier soir », « ce matin ») résolues en `event_time` (cf. §7.2).

---

## 7. Contrats IA (Claude)

### 7.1 Structuration — modèle, déclenchement, idempotence
- **Modèle** : `claude-haiku-4-5`. **Déclencheur** : création/édition d'entrée (debounce 1 s).
- **Idempotence** : la fonction **supprime** les `signals` existants de `entry_id` puis réinsère
  (édition d'entrée ⇒ re-structuration propre).
- **Multilingue** : Claude reçoit `lang` ; les `key`/`category` restent en anglais (vocab §6).
- **Sortie structurée** : `output_config.format` `{type:"json_schema", schema:…}` (validation au niveau API).
  Contraintes du schéma JSON Anthropic : `additionalProperties:false` requis ; **pas** de min/max/longueur
  (on valide `confidence∈[0,1]` côté serveur).

**Schéma de sortie (structuration)** :
```json
{
  "type":"object","additionalProperties":false,
  "properties":{
    "signals":{"type":"array","items":{
      "type":"object","additionalProperties":false,
      "properties":{
        "category":{"type":"string","enum":["sleep","food","mood","energy","pain","stress","symptom","medication","activity","measurement","environment","cycle","other"]},
        "key":{"type":"string"},
        "value_text":{"type":["string","null"]},
        "value_num":{"type":["number","null"]},
        "unit":{"type":["string","null"]},
        "polarity":{"type":"string","enum":["positive","neutral","negative"]},
        "event_time":{"type":"string","format":"date-time"},
        "confidence":{"type":"number"}
      },
      "required":["category","key","value_text","value_num","unit","polarity","event_time","confidence"]
    }}
  },
  "required":["signals"]
}
```
**System prompt (structuration, mis en cache)** — esquisse : rôle = extracteur ; reçoit la **taxonomie §6**
(catégories/clés/unités autorisées) ; règles de normalisation et de résolution des dates relatives
(avec `now_local` + `timezone` fournis dans le message utilisateur) ; **n'invente pas**, met `confidence`
bas si incertain ; renvoie `[]` si aucun signal.

### 7.2 Résolution temporelle
Le message utilisateur fournit `now_local` (ISO) + `timezone`. Claude convertit « hier soir »≈J-1 21:00,
« ce matin »≈J 08:00, « cette nuit »≈nuit J-1→J, etc. Défaut si aucune indication = `event_time` de l'entrée.

### 7.3 Moteur d'insights — **hybride (stats déterministes → narration Claude)**
**Pourquoi** : produit = « outil empirique » à montrer au médecin ⇒ les chiffres doivent **vouloir dire
quelque chose** et être reproductibles. Les stats détectent ; Claude **met en mots seulement**.

**a) Agrégation journalière** (par utilisateur, fenêtre glissante ≥ 14 j, idéalement 30–90 j) : pour chaque
jour, vecteur de présence/valeur par (`category`,`key`) — p.ex. `pain.headache=true`, `food.dairy=true`,
`environment.humidity=78`, `sleep.duration=5.5`.

**b) Paires candidates** : *outcomes* = `pain.*`, `symptom.*`, `mood`(négatif), `energy`(bas) ;
*triggers* = `food.*`, `environment.*`, `sleep`, `activity`, `medication`. Tester aussi le **décalage J→J+1**.

**c) Mesure d'association** :
- Binaire×binaire : table 2×2 sur les jours → **support** (co-occurrences = `incidents`), **lift**
  `P(out|trig)/P(out)`, **phi**, et **p-value de Fisher** (petits échantillons).
- Numérique : **Spearman** (ex. humidité ↔ intensité douleur).

**d) Seuils & garde-fous** : support min (≥ ~5 jours avec le trigger **et** ≥ 3 co-occurrences) ; force min
(lift ≥ 1.5 ou |phi| ≥ 0.3) ; **correction multi-comparaisons** (Benjamini–Hochberg, FDR 0.1) car on teste
beaucoup de paires. On ne garde que ce qui passe support + force + FDR.

**e) Affichage honnête de la « confiance »** : **pas** de pseudo-pourcentage médical. On montre
`incidents/jours observés` + une **bande de force** (`weak`/`moderate`/`strong`) issue de lift/phi, +
caveat « association observée, pas une preuve de cause à effet ». (Un % « force d'association » dérivé de
phi est possible mais doit être **étiqueté force**, pas confiance médicale.)

**f) Narration (Claude Sonnet 4.6)** : reçoit l'association **déjà calculée** (chiffres, incidents, dates,
bande de force) et rédige **1 phrase** en langue utilisateur, **strictement fondée sur les nombres
fournis**, sans causalité. Sortie structurée :
```json
{"type":"object","additionalProperties":false,
 "properties":{"statement":{"type":"string"},"caveat":{"type":"string"}},
 "required":["statement","caveat"]}
```
**g) Cadence** : **déclenchement manuel** via le bouton **« Mettre à jour »** en haut de l'écran
Corrélations — **économise les tokens** (pas d'appel à chaque entrée). La **date du dernier lancement**
est affichée à côté du bouton. *(La structuration des entrées, elle, reste automatique — léger/Haiku.)*
Un job **nocturne** (Batch API `POST /v1/messages/batches`) reste **optionnel/V2**. **Seuil** : afficher
**« informations entrées insuffisantes »** tant qu'il n'y a pas assez de données/corrélations.
**h) Incidents justificatifs** : `supporting_signal_ids` listés → l'utilisateur (et son médecin) peuvent
remonter aux entrées sources.

### 7.4 Coûts, cache, repli
- **Cache** : taxonomie + règles = bloc **system** avec `cache_control:{type:"ephemeral"}` (lecture ~0.1×).
  ⚠️ préfixe min cacheable Haiku 4.5 = **4096 tokens** ; si la taxonomie est plus courte, le cache ne
  s'active pas (sans erreur) — regrouper règles+exemples pour dépasser le seuil, sinon accepter sans cache.
- **Repli** : si Claude indisponible/quota → entrée `failed`, retries (backoff), l'app reste fonctionnelle
  (récit brut visible). **Aucune heuristique côté app** (le prototype web n'est pas réutilisé).
- **Observabilité IA** : chaque appel logué dans `ai_logs` (tokens, latence, ok/erreur).

### 7.5 Évaluation (qualité IA)
- **Structuration** : jeu doré de ~30 entrées FR/EN → signaux attendus ; mesurer précision/rappel par catégorie.
- **Insights** : historiques synthétiques avec corrélations connues (et **pièges** anti-fallacieux) → vérifier
  que le moteur retrouve les vraies et **rejette** les fausses (FDR).

---

## 8. Contrat d'API

### 8.1 CRUD (PostgREST, JWT + RLS) — pas d'endpoint custom
`entries`, `signals`(lecture), `insights`(lecture/maj statut), `profiles`, `device_tokens`, `nudge_habits`.

### 8.2 Edge Functions (clé Claude / privilèges serveur)
| Fonction | Méthode | Entrée | Sortie | Auth | Erreurs |
|---|---|---|---|---|---|
| `structure-entry` | POST | `{entry_id}` | `{signals:[…]}` | JWT user | 401, 404, 422 (entrée vide), 502 (Claude), 429 |
| `compute-insights` | POST | `{since?}` | `{inserted:int}` | JWT user | 401, 429 (1/h) |
| `register-device` | POST | `{apns_token, environment}` | `{ok:true}` | JWT user | 401, 422 |
| `export-account` | POST | `—` | `{url}` (JSON signé) | JWT user | 401 |

**Jobs planifiés (`pg_cron` → Edge Functions, service key)** :
| Job | Cadence | Rôle |
|---|---|---|
| `nightly-insights` | 1×/nuit | Recalcule les insights des utilisateurs actifs (§7.3) |
| `nudge-scheduler` | toutes 15 min | Évalue les habitudes/créneaux → envoie relances (locales/APNs) (§13) |
| `ftp-backup-export` | 1×/nuit | Dump JSON par utilisateur → **FTP OVH** (§14) |

**Format d'erreur** : `{ "error": { "code": "...", "message": "..." } }` + HTTP standard.

---

## 9. Périmètre fonctionnel V1 (avec critères d'acceptation)

> Format : description → **CA** (critères d'acceptation) → **États** → **Cas limites**.

### 9.1 Comptes & authentification
Inscription/connexion **email + mot de passe** (Supabase Auth) ; réinitialisation par email ; déconnexion ; **suppression de compte** (cascade §5.4). *(Sign in with Apple : V2.)*
- **CA** : un compte ne voit que ses données (RLS vérifiée par test) ; après réinstallation + reconnexion, les données reviennent (serveur) ; suppression efface tout (données + photos).
- **États** : non connecté / connexion en cours / erreur (mauvais identifiants) / connecté.
- **Cas limites** : email déjà utilisé ; mot de passe trop court (≥ 8) ; hors-ligne à la connexion (message clair).

### 9.2 Saisie multimodale
- **Voix** : `SFSpeechRecognizer` (locale = langue app), transcription **on-device** si dispo → texte éditable ; bouton stop ; **autorisation micro** demandée au 1ᵉʳ usage. *(Refus → champ texte seul + message.)*
- **Texte** : zone libre, longueur max 5 000 caractères.
- **Photo** : `PHPickerViewController`/caméra → **VisionKit/`VNRecognizeTextRequest`** (OCR) → `ocr_text` ; image stockée dans Storage (bucket privé). Formats : JPEG/PNG/HEIC ; max 8 Mo (compression).
- Une **entrée** combine voix+texte+photo. **Édition/suppression** d'une entrée possibles (re-structuration).
- **CA** : saisie possible **hors-ligne** (file d'attente) ; l'entrée apparaît instantanément (UI optimiste) ; la structuration ne bloque pas.
- **États** : brouillon / envoi / structurée / échec (badge « réessayer »).
- **Cas limites** : entrée vide refusée ; OCR sans texte → photo conservée sans `ocr_text` ; perte réseau pendant l'envoi → reste en file.

### 9.3 Structuration invisible (cf. §7.1)
- **CA** : chaque entrée non vide produit ≥ 1 signal **ou** un signal `other/note` ; édition d'entrée ⇒ signaux recalculés ; aucune donnée affichée à l'utilisateur sur le « comment ».

### 9.4 Les deux vues
- **Journal (chrono)** : fil anti-chronologique, récit brut + **puces** de signaux. **UI V1 : fusionné avec la Saisie** (encart de saisie en haut, fil dessous). Pagination par **fenêtre glissante de 24 h** + « afficher plus » (24 h de plus à chaque clic). **Recherche** plein-texte (loupe) + **Filtres** : plage de dates, **tag** (catégorie), **tranche horaire** (heure début → fin).
- **Données — récap 14 j (en haut, tableau fixe)** : bascule **« Valeurs santé »** (moyennes : ex. Sommeil 8 h/nuit, Alimentation 5 prises/jour, Douleur quotidienne, Climat frais…) ↔ **« Complétude du suivi »** (par dimension, score **1 rouge** = absent/insuffisant, **2 jaune** = intermédiaire, **3 vert** = suffisant pour les analyses).
- **Tables (par thème)** : signaux regroupés par `category` ; tri par date ; filtre par période ; tap → détail catégorie (liste + mini-graphe).
- **CA** : un signal apparaît dans **les deux** vues ; éditer/supprimer une entrée mets à jour les deux.
- **États** : vide (« note ta première journée ») / chargement (skeleton) / hors-ligne (bandeau).

### 9.5 Sources automatiques
- **Apple Santé (HealthKit, lecture)** : `sleepAnalysis`, `stepCount`, `heartRate`(repos/moy), `hrv` ; **cycle** : `menstrualFlow`. Autorisations granulaires à l'onboarding. Sync à l'ouverture + **livraison en arrière-plan** (`HKObserverQuery`). Dédoublonnage par `source_uuid` (§4.5).
- **Météo** : `WeatherKit` + `CoreLocation` (autorisation **quand l'app est utilisée**) → 1 relevé/jour (humidité, température, pression, pluie) en signaux `environment`.
- **CA** : refus d'une permission ⇒ la source est ignorée proprement (pas de crash, pas de relance intrusive) ; pas de doublons après plusieurs syncs.
- **Cas limites** : pas de localisation → météo désactivée ; HealthKit indispo (iPad) → masqué.

### 9.6 Insights / corrélations (cf. §7.3)
- **CA** : aucun insight avant ~7 jours ; chaque insight affiche **occurrences**, **jours observés**, **bande de force**, **caveat**, et la liste d'incidents (entrées sources cliquables) ; bouton « **Préparer pour mon médecin** » (résumé partageable, §9.9).
- **États** : « bientôt des tendances » / liste / détail.

### 9.7 Corrélations (écran) — analyses uniquement
- **Tagline (FR)** : « Ce que l'app commence à remarquer dans tes données. Attention, corrélation n'est pas causalité. » *(EN à localiser.)*
- **Uniquement des analyses de corrélation** (cartes : facteur, occurrences, force, caveat). **Pas de graphiques de tendances ici** — le récap/tendances est dans **Données** (§9.4).
- **Déclenchement** : bouton **« Mettre à jour »** en haut + **date du dernier lancement** à côté (cf. §7.3).
- **Données insuffisantes** : afficher **« informations entrées insuffisantes »**.
- **CA** : « Mettre à jour » (re)calcule et horodate ; rien ne se recalcule automatiquement à chaque entrée.

### 9.8 Relances intelligentes (cf. §13)
- **CA** : démarrage en **notifications locales** ; respect des heures calmes ; coupure par catégorie ; pas plus d'1 relance/créneau/catégorie/jour ; bascule APNs sans changement d'UX.

### 9.9 Partage « pour mon médecin »
- Génère un **résumé** (PDF/texte) : période, signaux clés, insights (avec occurrences + caveats), graphiques. Partage via la feuille iOS. *(Export PDF élaboré = amélioration V2 ; V1 = résumé simple.)*

### 9.10 Paramètres
**Accessibilité (taille de texte : Normal / Grand)** ; Langue (FR/EN) ; thème (Turquoise/Corail) ; compte (email, déconnexion, suppression) ; connexions (Santé, localisation) ; notifications (activation, heures calmes, par catégorie) ; sauvegarde/export (JSON) ; mention légale (§2.2).

---

## 10. Parcours & écrans

**Parcours (sans onboarding)** : 1ᵉʳ lancement = création de compte + **disclaimer** (sur l'écran Auth) ; les **autorisations** (micro, Santé, localisation, notifications) sont demandées **en contexte** au 1ᵉʳ usage de chaque fonction. → Quotidien (saisie libre + relances + consultation) → Découverte (l'utilisateur lance l'**analyse de corrélations** quand il le souhaite).

**Écrans (V1 — pas d'onboarding)** : 1) Auth · 2) **Journal** *(saisie en haut + fil ; 24 h glissantes + « afficher plus » ; recherche + filtres)* · 3) **Données** *(récap 14 j en haut avec bascule Valeurs santé / Complétude, puis tables par thème)* · 4) **Corrélations** *(analyses uniquement ; bouton « Mettre à jour » + date du dernier lancement)* · 5) **Détail corrélation** (incidents + « pour mon médecin ») · 6) **Paramètres**.
*(Pas d'onboarding dans le MVP. La Saisie est fusionnée en haut du Journal. Les tendances/récap sont dans Données, pas dans Corrélations.)*
**États transverses par écran** : vide, chargement (skeleton), erreur (réessayer), hors-ligne (bandeau).

---

## 11. Design system

**Principes** : ultra simple, **aéré**, monochrome par thème, hiérarchie par taille/poids, zéro fioriture.

**Réconciliation police (résout la contradiction v1)** : on **embarque** **Inter** (texte) + **Space
Grotesk** (titres/chiffres) — identité de marque (site `w.shoette.com`), avec repli police système. *(La v1
mentionnait « SF Pro » ; décision v2 = Inter/Space Grotesk embarquées.)* **Icônes** : **SF Symbols**.

**Tokens** :
- **Type scale** (pts, Dynamic Type via `UIFontMetrics`/`relativeTo`) : Display 28/Bold · Title 22/Semibold ·
  Headline 17/Semibold · Body 17/Regular · Callout 15 · Caption 12.
- **Espacement** : grille **8 pt** (4/8/12/16/24/32/48).
- **Rayons** : 12 (champs), 18–20 (cartes), pill (puces/boutons ronds). **Ombres** : douces (`0 14 34 -20 rgba(0,0,0,.38)`).
- **Couleur — 2 thèmes** (fond blanc + rampe monochrome) :

**Turquoise** (base #118996) : 50 #E8F3F4 · 100 #C5E3E5 · 200 #93C9CD · 300 #5FAFB5 · 400 #2F9AA1 · **500 #118996** · 600 #0E6E78 · 700 #0B545C · 800 #073A40 · 900 #042227
**Corail** (base #F1514F) : 50 #FDECEC · 100 #FBCFCE · 200 #F7A6A4 · 300 #F47F7D · 400 #F26967 · **500 #F1514F** · 600 #CE3F3D · 700 #9E302E · 800 #6F2120 · 900 #431312

- **Usage** : fond blanc/50 ; boutons/accents 500–600 ; **texte** 800–900 ; bordures 100–200 ; désactivé 200–300.
- **Composants** : bouton (primary/ghost/soft), champ, carte, **puce** (chip de signal), barre de nav basse
  (5 onglets), carte d'insight (barre de force), table de catégorie (accordéon), états vides, toast.

**Accessibilité (baseline V1)** : Dynamic Type (toutes les tailles scalables) ; **VoiceOver** (labels sur
icônes/puces/graphes) ; **contraste** AA (texte 800/900 sur blanc OK ; ne jamais poser du texte petit en 400
sur blanc) ; cibles tactiles ≥ **44×44 pt** ; `prefers-reduced-motion` respecté. **Mode sombre : V2** (clair only en V1, documenté).

**i18n & layout** : le FR est ~20 % plus long que l'EN → composants extensibles, pas de largeurs figées.

**Mobile-first & responsive** : conception **mobile d'abord** (inspiration **Alan** : épuré, arrondi,
généreux, amical). Les **grands éléments (tableaux/données)** peuvent avoir une présentation **différente
desktop vs mobile** (ex. grille multi-colonnes sur desktop, accordéon empilé sur mobile). **Taille de texte** :
réglage **Normal / Grand** (Accessibilité, §9.10) — léger agrandissement global du texte ; en natif, branché sur **Dynamic Type**.

---

## 12. Internationalisation
- UI 100 % localisée FR + EN (String Catalogs `.xcstrings`), pluriels gérés.
- **Défaut FR** ; bascule manuelle dans Paramètres (indépendante de la langue système).
- Dates/nombres via `Locale`. Transcription vocale dans la langue choisie ; Claude **structure/rédige** dans la langue utilisateur (clés taxonomiques restant en anglais).

---

## 13. Moteur de relances (notifications)
- **Apprentissage léger** : `nudge-scheduler` agrège, par utilisateur, les catégories réellement journalisées
  et leurs heures habituelles → met à jour `nudge_habits` (`weight`, `expected_start/end`). Démarrage avec
  **défauts** (réveil 8–10 h ; repas 12–14 h & 19–21 h ; humeur/énergie 1×/jour).
- **Déclenchement** : si une catégorie « habituelle » n'a **pas** d'entrée aujourd'hui à l'heure du créneau,
  et hors **heures calmes**, et pas déjà relancée (`last_nudged_at`) → notification contextuelle, message en
  langue utilisateur (gabarits : « Réveillé ? Comment s'est passée la nuit ? » / « Toujours rien mangé ? »).
- **Transport** : **locales** (programmées sur l'appareil) au démarrage ; **APNs** piloté par l'Edge Function
  dès compte Apple Developer (token dans `device_tokens`). UX identique.
- **Réglages** : activation globale, **heures calmes** (par défaut 22 h–8 h), coupure **par catégorie**.
- **Anti-spam** : max 1 relance / créneau / catégorie / jour ; jamais la nuit ; respect des refus.

---

## 14. Sauvegarde & confidentialité des données
- **Maison principale = Supabase** (cloud EU, 24/7) : suppression de l'app ≠ perte ; reconnexion = tout revient.
  **Distinct de GitHub** : aucune donnée perso ne transite par le dépôt.
- **Filet de secours = export auto vers FTP OVH** : `ftp-backup-export` (nuit) dépose des **dumps JSON par
  utilisateur** sur l'espace OVH (indépendant de la machine d'Elena, toujours dispo). Identifiants FTP en secret.
- **Anti-fuite GitHub** : `.gitignore` exclut **données** et **secrets** (clé Anthropic, service key Supabase,
  identifiants FTP, `*.xcconfig` de secrets). Le **code** peut aller sur GitHub ; **données/secrets jamais**.
- **Export utilisateur** : `export-account` → JSON signé (RGPD-friendly).

---

## 15. Conformité & sécurité — **gate avant vrais utilisateurs**
**Posture V1 (assumée)** : **données de test / usage interne uniquement**, pas de durcissement spécifique
(règle §2.2). C'est un **report explicite**, pas un oubli.

**Gate obligatoire avant tout utilisateur réel avec données de santé réelles** (revue juridique incluse) :
- [ ] **Consentement** explicite (catégorie particulière de données — RGPD art. 9).
- [ ] **DPA** avec Anthropic (traitement de données de santé) + vérifier non-réutilisation pour entraînement.
- [ ] **Résidence EU** confirmée (Supabase région EU) ; étudier **HDS** si hébergement de données de santé en France.
- [ ] **Chiffrement at-rest** (fourni par Supabase) + audit **RLS** + politique de **rétention**/minimisation.
- [ ] **Suppression/export RGPD** (déjà câblés §5.4/§14) testés de bout en bout.
- [ ] Disclaimers (§2.2) revus par juridique ; mentions « pas un dispositif médical » validées.

---

## 16. Qualité : tests & observabilité
- **Tests unitaires** : mapping taxonomie (parsing/normalisation), **moteur de stats** (fixtures avec
  corrélations connues + pièges fallacieux), résolution des dates relatives, file d'attente hors-ligne.
- **Tests UI / snapshots** : écrans clés × 2 thèmes × FR/EN × Dynamic Type (XL).
- **Tests d'intégration** : sync online↔offline, RLS (un compte ne lit pas un autre), idempotence HealthKit.
- **Évals IA** (§7.5) : structuration (précision/rappel), insights (vrais positifs / rejet des faux).
- **Matrice** : iPhone SE → Pro Max ; iOS 17 & 18 ; appareil réel requis pour HealthKit/Weather/push.
- **Observabilité** : crash reporting (MetricKit + collecte Supabase, ou Sentry à valider) ; logs Edge Functions ;
  `ai_logs` (coût/latence/erreurs) ; événements analytics : `entry_created`, `structured_ok|failed`,
  `insight_generated`, `nudge_sent|opened`, `share_for_doctor`.

---

## 17. Hors périmètre V1 (→ V2+)
Paiement/abonnement · conformité HDS/RGPD complète & chiffrement applicatif avancé · intégrations tierces
(Oura, Fitbit, agenda, glucomètres Bluetooth) · export PDF médecin élaboré · analyse du **ton de voix** ·
personnalisation ML poussée des relances · **mode sombre** · Sign in with Apple.

---

## 18. Plan de construction (réalisation **Claude + Elena**)

**Chemin critique (à produire EN PREMIER — tout en dépend)** : **Taxonomie §6** → **Schéma SQL + RLS §5** →
**Contrats IA §7** + **Contrat d'API §8** → **Design tokens §11**. Tant que ces 5 fondations n'existent pas,
les couches saisie/back/IA se télescopent sur le contrat de données.

**Lots (séquencés par dépendances ; estimations indicatives en sessions de build avec Claude)** :
| Lot | Contenu | Dépend de | Indicatif |
|---|---|---|---|
| **L0 — Fondations** | Projet Xcode + projet Supabase EU ; migrations §5 ; tokens design §11 ; taxonomie §6 | — | court |
| **L1 — Boucle de base** | Auth ; saisie texte/voix ; `structure-entry` (Haiku) ; **Journal** ; 2 thèmes ; i18n ; cache local/offline | L0 | moyen |
| **L2 — Données & sources** | **Tables** par catégorie + détail ; **HealthKit** ; **météo** ; **cycle** ; idempotence | L1 | moyen |
| **L3 — Intelligence** | Moteur **stats** + `compute-insights` + narration Sonnet ; **Corrélations** (écran) ; « pour mon médecin » | L1–L2 | moyen-long |
| **L4 — Engagement** | **Relances** (locales→APNs) ; **photo + OCR** ; export **FTP** ; finitions a11y/i18n | L1–L3 | moyen |
| **L5 — Qualité** | Évals IA, tests, observabilité, matrice appareils | continu | continu |

**Jalons** : M1 = L0+L1 démontrables (saisie→structuration→Journal) ; M2 = L2 (données structurées + sources) ;
M3 = L3 (premiers insights honnêtes + partage médecin) ; M4 = L4+L5 (relances, photo/OCR, sauvegarde, durci QA).
*(Si une équipe externe reprend : chaque lot = fiche attribuable — iOS / back-Supabase / IA-prompt / design.)*

---

## 19. Prérequis pratiques
- **Mac + Xcode** (à installer). **Compte Apple Developer (~99 $/an)** : plus tard (démarrage local) — requis
  pour push APNs, test device, HealthKit réel, TestFlight/App Store. Coût **dev**, pas utilisateur → règle « gratuit » respectée.
- **Compte Supabase** (offre gratuite, région EU). **Clé API Anthropic** (usage faible en test). **Accès FTP OVH** (déjà dispo).

## 20. Décisions finalisées (log)
Nom **What works for me** · une appli (iOS natif) + un backend (Supabase) · insights **hybrides** ·
**tout** en V1 · réalisation **Claude + Elena** · thèmes Turquoise/Corail · police **Inter + Space Grotesk** ·
démarrage notifications **locales** · sauvegarde **Supabase + FTP OVH**, jamais sur GitHub · conformité **gate** avant vrais utilisateurs.

## 21. Annexe — prototype web (jetable)
Un prototype web a été déployé sur `https://w.shoette.com/app/` **uniquement** pour visualiser l'UX
immédiatement (l'app native ne tourne pas sans Xcode/Apple Developer). **Hors périmètre produit**, non
maintenu, **à abandonner** une fois la V1 native lancée. Réutilisables : design, textes, flux, taxonomie.

## 22. Glossaire
- **Entrée** : texte/voix/photo horodaté saisi librement.
- **Signal** : fait structuré extrait d'une entrée ou d'une source auto (catégorie+clé+valeur+heure).
- **Insight** : association statistique entre un *trigger* et un *outcome*, avec occurrences + force, rédigée par Claude.
- **Trigger / Outcome** : facteur potentiel (aliment, météo…) / manifestation observée (douleur, symptôme…).
- **Bande de force** : `weak`/`moderate`/`strong`, dérivée de lift/phi — **pas** une probabilité médicale.
