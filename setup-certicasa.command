#!/bin/bash
#
# setup-certicasa.command
# -------------------------------------------------------
# Double‑click this file in Finder to prepare the database
# and switch the project to Prisma automatically.
#
set -e

echo "============================================="
echo "  CertiCasa – Automatic DB/Prisma bootstrap  "
echo "============================================="

# Move to the directory where the script lives (project root)
cd "$(dirname "$0")"

# 1. Ensure .env exists
if [ ! -f ".env" ]; then
  echo ".env introuvable à la racine du projet."
  read -p "Veuillez coller votre DATABASE_URL PostgreSQL : " DBURL
  echo "DATABASE_URL="${DBURL}"" > .env
  echo ".env créé avec DATABASE_URL."
else
  echo ".env détecté – ok."
fi

# 2. Vérifier Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js est absent. Installation via Homebrew..."
  if ! command -v brew >/dev/null 2>&1; then
    echo "❌ Homebrew n'est pas installé. Installez Homebrew puis relancez."
    exit 1
  fi
  brew install node
fi
echo "Node.js version $(node -v) – ok."

# 3. Installer les dépendances du projet
echo "Installation des dépendances npm…"
npm install

# 4. S'assurer que Prisma est installé
if ! npx prisma -v >/dev/null 2>&1; then
  echo "Ajout de Prisma…"
  npm install --save-dev prisma @prisma/client
fi

# 5. Rendre le script setup-db exécutable et l'exécuter
if [ -f scripts/setup-db.sh ]; then
  chmod +x scripts/setup-db.sh
  echo "Exécution de npm run setup-db…"
  npm run setup-db
else
  echo "❌ scripts/setup-db.sh introuvable."
  exit 1
fi

# 6. Introspecter la base et regénérer le client
echo "Introspection du schéma existant…"
npx prisma db pull
echo "Génération du client Prisma…"
npx prisma generate

echo "✅ Tout est prêt ! Lancez maintenant votre app :"
echo "   npm run dev"
