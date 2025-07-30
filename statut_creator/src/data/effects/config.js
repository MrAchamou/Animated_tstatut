
// config.js - Configuration globale des effets

export const EFFECT_CATEGORIES = {
  TEXT: 'text',
  IMAGE: 'image', 
  UNIVERSAL: 'universal'
};

export const EFFECT_SUBCATEGORIES = {
  ANIMATION: 'animation',
  STYLE: 'style',
  TRANSFORM: 'transform',
  FILTER: 'filter'
};

export const EFFECT_INTENSITIES = {
  LOW: 'low',
  MEDIUM: 'medium', 
  HIGH: 'high'
};

export const EFFECT_PERFORMANCES = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy'
};

// Configuration par défaut pour les nouveaux effets
export const DEFAULT_EFFECT_CONFIG = {
  category: EFFECT_CATEGORIES.UNIVERSAL,
  subcategory: EFFECT_SUBCATEGORIES.STYLE,
  intensity: EFFECT_INTENSITIES.MEDIUM,
  performance: EFFECT_PERFORMANCES.MEDIUM,
  compatibility: {
    text: true,
    image: false,
    logo: false,
    background: false
  },
  parameters: {
    vitesse: {
      type: "range",
      min: 0.1,
      max: 3,
      default: 1,
      description: "Vitesse d'animation"
    },
    intensite: {
      type: "range", 
      min: 0,
      max: 1,
      default: 0.8,
      description: "Intensité de l'effet"
    }
  },
  preview: {
    duration: 3000,
    loop: true
  }
};

// Utilitaires pour les développeurs
export const EffectUtils = {
  // Valider la structure d'un effet
  validateEffect(effect) {
    const required = ['id', 'name', 'description', 'category', 'engine'];
    return required.every(prop => effect.hasOwnProperty(prop));
  },
  
  // Obtenir tous les tags uniques
  getAllTags(effects) {
    const tags = new Set();
    Object.values(effects).forEach(effect => {
      effect.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  },
  
  // Statistiques des effets
  getStats(effects) {
    const stats = {
      total: Object.keys(effects).length,
      categories: {},
      subcategories: {},
      intensities: {},
      performances: {}
    };
    
    Object.values(effects).forEach(effect => {
      stats.categories[effect.category] = (stats.categories[effect.category] || 0) + 1;
      stats.subcategories[effect.subcategory] = (stats.subcategories[effect.subcategory] || 0) + 1;
      stats.intensities[effect.intensity] = (stats.intensities[effect.intensity] || 0) + 1;
      stats.performances[effect.performance] = (stats.performances[effect.performance] || 0) + 1;
    });
    
    return stats;
  }
};
