#!/usr/bin/env bash
# Sauvegarde locale des DONNÉES SERVEUR CONFIDENTIELLES de w.shoette.com.
#
# Télécharge par FTP (bookmark lftp « shoette ») les fichiers de données qui
# n'existent QUE sur le serveur (jamais sur GitHub) :
#   - /w/waitlist.csv            (e-mails de la liste d'attente)
#   - /w/app/data/users.json     (e-mails + hash bcrypt)
#   - /w/app/data/store_*.json   (données santé + mot de passe des comptes)
#
# Destination : sous-dossier daté de « sauvegarde donnees serveur confidentielles/ »
# (ce dossier est gitignoré → jamais poussé sur GitHub).
#
# Usage :  bash backup-donnees-serveur.sh
# Prérequis : lftp installé + bookmark « shoette » configuré (voir skill shoette-deploy).

set -euo pipefail
cd "$(dirname "$0")"

LFTP="$(command -v lftp || echo /opt/homebrew/bin/lftp)"
[ -x "$LFTP" ] || { echo "lftp introuvable"; exit 1; }

TS="$(date +%Y-%m-%d_%Hh%M)"
DEST="sauvegarde donnees serveur confidentielles/$TS"
ABS="$(pwd)/$DEST"
mkdir -p "$ABS/app-data"

"$LFTP" shoette -e "set ftp:ssl-allow no; set net:timeout 20; set net:max-retries 2; \
  get /w/waitlist.csv -o \"$ABS/waitlist.csv\"; \
  mirror --include-glob='*.json' /w/app/data \"$ABS/app-data\"; \
  bye"

echo "✓ Sauvegarde dans : $DEST"
ls -la "$ABS" "$ABS/app-data"
