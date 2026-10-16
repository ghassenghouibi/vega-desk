# VegaDesk — Landing page

React 18 + Vite + Framer Motion.

## Développement

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # génère dist/
```

## Déploiement Vercel

- **Via GitHub** : poussez le repo, puis sur vercel.com → *Add New Project* → importez le repo. Vercel détecte Vite automatiquement (config dans `vercel.json`).
- **Via CLI** : `npx vercel` (preview) puis `npx vercel --prod`.

Le logo est dans `public/` (`logo-mark.png` pour la navbar, `favicon.png`, `logo.jpg` pour l'aperçu de partage).
