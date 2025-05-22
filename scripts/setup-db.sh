#!/usr/bin/env bash
# Script : setup-db.sh
# Usage   : ./scripts/setup-db.sh
# Installe les dépendances, génère Prisma Client, applique la migration initiale
#          et exécute le seed mock. Nécessite la variable d'environnement DATABASE_URL.
set -euo pipefail

BLUE='\033[1;34m'
GREEN='\033[1;32m'
NC='\033[0m' # No Color

function step() {
  echo -e "${BLUE}› $1${NC}"
}

step "Installation des dépendances Node (peut être long)"
npm install

step "Génération du client Prisma"
npx prisma generate

step "Application de la migration initiale (init_clients)"
npx prisma migrate dev --name init_clients --skip-generate

step "Injection des données mock (seed)"
npx prisma db seed

echo -e "${GREEN}✔ Base de données prête !${NC}" 