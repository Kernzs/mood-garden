# Mood Garden 🌱

Une PWA mobile-first, douce et colorée, pour **réduire sa consommation de joints à son rythme, sans jugement ni culpabilité**. Ce n'est ni une app médicale, ni une app de sobriété stricte — c'est un petit jardin cozy qui grandit avec tes choix positifs et **ne meurt jamais**.

> Approche **réduction des risques** : on récompense uniquement le joint évité. Le tabac n'est jamais valorisé ni recommandé.

## Stack

- **Vite 6** + **React 18** + **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`, tokens `@theme`, thème clair/sombre par variables CSS)
- **vite-plugin-pwa** (installable, offline, service worker)
- 100 % local : toutes les données vivent dans `localStorage`, rien n'est envoyé.

## Commandes

```bash
npm install
npm run dev        # serveur de dev (http://localhost:5173)
npm run build      # tsc --noEmit + build de prod (génère le PWA/service worker)
npm run preview    # sert le build de prod
npm run gen:icons  # régénère les PNG du manifest depuis public/icon.svg (via sharp)
```

## Fonctionnalités

- **Mode SOS 🌊** : « J'ai une envie, là » → respiration guidée (~1 min, 4s/6s) → log du résultat en 1 tap. L'app aide *pendant* l'envie.
- **Onboarding** doux en 3 écrans (coût/joint + objectif).
- **Accueil** : jardin illustré qui évolue en 8 étapes, **arrosage quotidien** (+1 ☀️/jour), 4 actions rapides, résumé du jour, série douce, compteur de ☀️.
- **Logging sans friction** : action positive → petite pluie de ☀️, encouragement, feuille optionnelle « Comment as-tu géré l'envie ? ». « J'ai fumé » → message bienveillant, **aucune régression du jardin**.
- **Célébration** animée au passage d'étape + **jalons doux** (~13 badges, dont « Honnêteté »).
- **Récompense réelle 🎁** : définis un vrai plaisir (resto, jeu…) — tes joints évités le financent (jauge dans Progrès).
- **Journal** groupé par jour.
- **Progrès** : objectif (anneau), stats, **argent économisé**, tendance 7 jours, **moments d'envie par créneau** + tendance douce, déclencheurs, séries, jalons.
- **Réglages** : objectif, coût par joint, devise, récompense, thème **Jour / Crépuscule**, **rappels best-effort** (Periodic Background Sync — Android installé ; copy honnête ailleurs), **export & import JSON**, réinitialisation, notice données locales.
- **Offline complet** : polices auto-hébergées (@fontsource), tout est précaché par le service worker.
- **A11y** : aria-pressed, spinbutton, focus trap dans les sheets, `prefers-reduced-motion` (respiration en mode texte).

**Reporté volontairement** : splash screens iOS, screenshots de manifest, mode paysage, édition d'entrées du journal.

## Architecture

```
src/
  types.ts                 # modèle de données
  lib/       garden.ts (étapes/soleil) · stats.ts (dérivés) · storage.ts (localStorage)
             date.ts · copy.ts (tous les textes FR) · options.ts · cn.ts
  context/   GardenContext.tsx  # état + logAction/reset/seed + persistance + thème
  hooks/     useToast.tsx
  components/ garden · home · log · stats · journal · onboarding · layout · ui
  screens/   Home · Journal · Stats · Settings
```

## 🎨 Brancher de l'art AI (optionnel)

Le jardin est dessiné en **SVG codé** (cohérent, animé, thémable). Un **point de swap** est prévu dans
[`src/components/garden/GardenScene.tsx`](src/components/garden/GardenScene.tsx) (voir le commentaire « SWAP SEAM »).

Pour remplacer une étape par une illustration générée (ChatGPT / autre), dépose
`public/garden/stage-<n>.png` et remplace le rendu SVG de cette étape par un `<image>` — le reste
de l'app (barre de progression, célébrations, thèmes) n'a pas besoin de changer.

**Specs conseillées** si tu génères des assets :
- Format carré **1024×1024**, fond **transparent** (ou fond plein pour l'icône/maskable).
- Style cohérent entre les 8 étapes : même pot, même angle, même palette pastel.
- Icône/mascotte PWA : réutilise `public/icon.svg` comme référence de style.
