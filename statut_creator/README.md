
# Status Creator - Effects Library

## Structure des Effets

Ce repository contient **59 effets visuels** organisés de manière structurée pour le développement.

### 📁 Organisation des fichiers

```
src/data/effects/
├── index.js                 ← Export de tous les effets + utilitaires
├── breathing.effect.js      ← Effet de respiration
├── neon-glow.effect.js      ← Effet néon lumineux  
├── quantum-phase.effect.js  ← Effet quantique
└── ... (56 autres effets)
```

### 🏗️ Structure d'un effet

Chaque effet suit cette structure standardisée :

```javascript
export const effectNameEffect = {
  id: "effect-name",
  name: "Effect Name",
  description: `Description détaillée de l'effet...`,
  
  // Classification
  category: "text|image|universal",
  subcategory: "animation|style|transform|filter", 
  intensity: "low|medium|high",
  performance: "light|medium|heavy",
  
  // Compatibilité
  compatibility: {
    text: true/false,
    image: true/false, 
    logo: true/false,
    background: true/false
  },
  
  // Tags pour la recherche
  tags: ["tag1", "tag2", "tag3"],
  
  // Paramètres configurables
  parameters: {
    vitesse: {
      type: "range",
      min: 0.1,
      max: 3,
      default: 1,
      description: "Vitesse d'animation"
    }
  },
  
  // Aperçu
  preview: {
    gif: "effect-name.gif",
    duration: 3000,
    loop: true
  },
  
  // Moteur d'exécution
  engine: (element, params) => {
    // Code de l'effet
  }
};
```

### 🔍 Utilisation

```javascript
import { allEffects, filterEffects } from './src/data/effects/index.js';

// Obtenir tous les effets
const effects = allEffects;

// Filtrer les effets
const textEffects = filterEffects({ category: 'text' });
const lightEffects = filterEffects({ performance: 'light' });
const glowEffects = filterEffects({ tags: ['glow'] });
```

### 📊 Statistiques

- **59 effets** convertis automatiquement
- **4 catégories** : text, image, universal
- **4 sous-catégories** : animation, style, transform, filter
- **3 niveaux d'intensité** : low, medium, high
- **3 niveaux de performance** : light, medium, heavy

### 🎯 Catégories disponibles

#### Text Effects
Effets spécifiquement conçus pour le texte et les titres.

#### Image Effects  
Effets pour les images, logos et éléments visuels.

#### Universal Effects
Effets applicables à tous types d'éléments.

---

*Généré automatiquement à partir des effets Premium*
