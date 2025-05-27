# CertiCasa Doc – UX Flow

> Refacto complet du dépôt pour une base moderne, typée et sans dettes techniques.

## Sommaire

1. 🚀 Mise en route
2. ⚙️ Variables d'environnement
3. 📦 Scripts NPM
4. 🧰 Stack & dépendances clés
5. 🗂️ Organisation du code
6. ✅ Checklist QA
7. 🤝 Contribuer (convention de commit)

---

### 1. 🚀 Mise en route

```bash
# 1. Cloner le repo
$ git clone <votre-url>
$ cd certicasa-doc-ux-flow

# 2. Installer les dépendances
$ npm install

# 3. Démarrer le mode dev (Vite + HMR)
$ npm run dev

# 4. Lancer le build de production
$ npm run build
```

Pré-requis : Node.js ≥ 18, npm ≥ 9.

---

### 2. ⚙️ Variables d'environnement (`.env`)

| Nom                 | Description                  | Exemple                            |
| ------------------- | ---------------------------- | ---------------------------------- |
| `VITE_API_BASE_URL` | URL de l'API REST principale | `https://certicasa.mitain.com/api` |
| `VITE_MAPS_API_KEY` | Clé Google Maps JS           | `AIza...`                          |

Créez un fichier `.env.local` (non versionné) :

```ini
VITE_API_BASE_URL=https://certicasa.mitain.com/api
VITE_MAPS_API_KEY=<your-google-maps-key>
```

---

### 3. 📦 Scripts NPM

| Commande           | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Démarre Vite en mode développement   |
| `npm run build`    | Génère le build de prod dans `dist/` |
| `npm run preview`  | Prévisualise le build localement     |
| `npm run lint`     | Analyse ESLint                       |
| `npm run lint:fix` | ESLint + auto-fix                    |
| `npm run format`   | Prettier (formatage)                 |
| `npm test`         | Tests unitaires (Vitest)             |

---

### 4. 🧰 Stack & dépendances clés

- Vite 5 + React 18 + TypeScript 5
- Tailwind CSS 3 / shadcn-ui
- TanStack Query 5 (fetch/cache)
- Zod (validation) & React-Hook-Form
- ESLint + Prettier (strict) – `strictNullChecks` activé
- Vitest (unit) & Playwright (E2E) – à compléter
- Husky + Commitlint + lint-staged (hooks Git)

---

### 5. 🗂️ Organisation du code (par feature)

```
src/
  features/
    clients/
    projects/
    documents/
    calculations/
  hooks/
  ui/ (shadcn components)
  lib/ & utils/
  services/
```

Les dossiers `features/*` contiennent composants + hooks + services spécifiques.

---

### 6. ✅ Checklist QA (à cocher dans la PR)

- [ ] `npm run build` sans warning ✅
- [ ] Lint/format passent (`npm run lint`)
- [ ] Tests unitaires verts (`npm test`)
- [ ] Responsiveness check (≥ 375 px)
- [ ] Dark / Light mode OK
- [ ] Pas de `console.log` ou `TODO` restants
- [ ] Temps de bundle principal < 500 kB gzip

---

### 7. 🤝 Contribuer

Le projet suit la convention de commit [Conventional Commits](https://www.conventionalcommits.org). Un hook Husky + Commitlint bloque les messages invalides.

Exemples :

```
feat(client): ajout de la recherche par adresse
fix(calculation): corrige le calcul du U-value
chore: bump deps
```

Avant chaque commit :

1. Vos fichiers modifiés sont formatés/lintés (hook `pre-commit`).
2. Le message est validé (hook `commit-msg`).

---

© CertiCasa – 2024
