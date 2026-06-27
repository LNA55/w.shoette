# Glossaire canonique — « What works for me » (Ubiquitous Language)

> Un seul mot par concept, identique partout : **ce que dit Elena = le mot dans le code = le mot dans l'UI**.
> Convention de code : **identifiants en anglais, commentaires & textes UI en français/anglais (I18N)**.
> Dernière mise à jour : 27/06/2026.

---

## 1. Les 4 termes piliers (corrélations)

| Concept | UI (FR) | Code (EN) | Définition | Exemple | À NE PAS dire |
|---|---|---|---|---|---|
| Le **type** (liste fixe ~13) | **Catégorie** | `category` (abrégé `cat`, `CATS`, `catName`) | Une famille de signaux détectée par le moteur de tags | « Alimentation », « Sommeil » | ~~tag~~, ~~type~~, ~~thème~~ |
| L'**instance** dans une catégorie | **Valeur** | `value` | Une donnée concrète extraite d'une entrée | « Sucre », « Pluie », « 7,5 h » | ~~élément~~, ~~facteur~~ (dans ce sens) |
| L'**ombrelle** corrélable | **Facteur** | `factor` | Une chose qu'on met dans une analyse de corrélation : **une catégorie OU une valeur** | (l'un ou l'autre) | ~~variable~~, ~~paramètre~~ |
| L'**intensité** d'une corrélation | **Force** | `band` | Le niveau de force d'une corrélation | faible / modérée / forte | ~~verdict~~ |

**Règle clé** : un `factor` porte un `.kind` ∈ `'category' | 'value'`. Dans l'UI, le chip d'une **catégorie** a un fond **plus intense** que celui d'une **valeur** (`.mf-sug--category` vs `.mf-sug--value`).

---

## 2. Modèle de données (saisie)

| UI (FR) | Code (EN) | Définition |
|---|---|---|
| Entrée | `entry` / `entries[]` | Un post du journal : `{id, createdAt, text, photo, signals[]}` |
| (interne) | `signal` / `entry.signals[]` | Élément tagué extrait d'une entrée : `{category, label, value, confidence}` |
| Valeur | `value` (+ `label`) | `value` = valeur numérique extraite (ou null) ; `label` = `value` sinon mot-clé. L'UI affiche `value || label`. |

---

## 3. Corrélations automatiques

| UI (FR) | Code (EN) | Définition |
|---|---|---|
| Déclencheur | `trigger` (`trig`) | Une **valeur** de catégorie `food`/`environment` candidate à être cause |
| Symptôme | `flag` | Jour marqué si catégorie ∈ {`pain`, `symptom`, `brain_fog`} |
| Corrélation | `insight` / `correlations{}` | Paire déclencheur ↔ symptôme détectée |
| Occurrence | `incidents` | Nombre de co-occurrences |
| Force | `band` | faible (<4) / modérée (4–5) / forte (≥6) |

---

## 4. Corrélations manuelles

| UI (FR) | Code (EN) | Définition |
|---|---|---|
| Facteur | `factor` | Élément libre à corréler (catégorie ou valeur) |
| Suggestions | `manualVocab()` | Liste de facteurs typés `{label, kind:'category'|'value'}` |
| Force | `band` | Résultat : 2 facteurs → Pearson ; 3+ → valeur propre. Affiché en 3 niveaux colorés (libellés « Corrélation forte / possible / aucune »). |

---

## 5. Mots homonymes à NE PAS confondre (garder tels quels)

- **`theme`** = le **thème couleur** (turquoise / corail), `S.theme`, `applyTheme`, `data-theme`. ⚠️ RIEN à voir avec « catégorie ».
- **`tag` (badge)** = `pinnedTag` / `obsoleteTag` / `hiddenTag`, `.corr-tag` = **badges de statut** d'une corrélation (Épinglée / Obsolète / Masquée). Sens « étiquette de statut », pas « catégorie ».
- **`price-tag`**, **`pdp*Tag`** = étiquettes de **prix** sur l'écran d'abonnement.
- **`tagline`** = le **slogan** de l'app.

---

## 6. Chantiers de mise en conformité

- [x] `manualVocab()` typé `category`/`value` + chips différenciés (déployé 27/06/2026).
- [x] `verdict` → `band` (code + CSS `.v-*` → `.band-*`), couleurs/libellés conservés.
- [x] `tag` (sens **catégorie**) → `category` : `pendingTag`→`pendingCategory`, `filters.tag`→`filters.category`, `data-act=tag`→`category`, `.tagchip`→`.catchip`, `tagsBody`→`categoriesBody`, textes « Thème/Topic/tag » → « Catégorie/Category ».
- [ ] (optionnel) badges de statut `pinnedTag`/`corr-tag` → vocabulaire « badge » si souhaité (hors périmètre actuel).
