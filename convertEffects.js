
const fs = require('fs');
const path = require('path');

// Configuration des mappages
const categoryMapping = {
  'text': ['text', 'texte', 'font', 'writing', 'typewriter', 'letter'],
  'image': ['image', 'pixel', 'particle', 'dissolve', 'distortion', 'glitch'],
  'universal': ['universal', 'aura', 'glow', 'energy', 'quantum', 'plasma']
};

const subcategoryMapping = {
  'animation': ['dance', 'float', 'swing', 'orbit', 'pulse', 'heartbeat'],
  'style': ['glow', 'neon', 'sparkle', 'aura', 'breathing'],
  'transform': ['morph', 'shift', 'phase', 'dimension', '3d', 'rotation'],
  'filter': ['dissolve', 'glitch', 'distortion', 'wave', 'prism', 'mirror']
};

const intensityMapping = {
  'low': ['breathing', 'fade', 'echo'],
  'medium': ['glow', 'sparkle', 'wave', 'float'],
  'high': ['explosion', 'plasma', 'quantum', 'reality', 'gravity']
};

const performanceMapping = {
  'light': ['fade', 'breathing', 'glow', 'echo'],
  'medium': ['neon', 'sparkle', 'wave', 'particle'],
  'heavy': ['plasma', 'quantum', 'reality', 'gravity', '3d']
};

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
            .replace(/^[a-z]/, (g) => g.toLowerCase());
}

function toTitleCase(str) {
  return str.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
}

function detectCategory(name, description) {
  const text = (name + ' ' + description).toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryMapping)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  return 'universal';
}

function detectSubcategory(name, description) {
  const text = (name + ' ' + description).toLowerCase();
  
  for (const [subcategory, keywords] of Object.entries(subcategoryMapping)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return subcategory;
    }
  }
  return 'style';
}

function detectIntensity(name, description) {
  const text = (name + ' ' + description).toLowerCase();
  
  for (const [intensity, keywords] of Object.entries(intensityMapping)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return intensity;
    }
  }
  return 'medium';
}

function detectPerformance(name, description) {
  const text = (name + ' ' + description).toLowerCase();
  
  for (const [performance, keywords] of Object.entries(performanceMapping)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return performance;
    }
  }
  return 'medium';
}

function extractTags(name, description) {
  const text = (name + ' ' + description).toLowerCase();
  const allKeywords = Object.values({
    ...categoryMapping,
    ...subcategoryMapping,
    ...intensityMapping,
    ...performanceMapping
  }).flat();
  
  const foundTags = allKeywords.filter(keyword => text.includes(keyword));
  
  // Ajouter des tags spécifiques basés sur le nom
  const specificTags = name.toLowerCase().split('-').filter(tag => tag.length > 2);
  
  return [...new Set([...foundTags, ...specificTags])].slice(0, 6);
}

function generateCompatibility(category) {
  switch (category) {
    case 'text':
      return { text: true, image: false, logo: true, background: false };
    case 'image':
      return { text: false, image: true, logo: false, background: true };
    case 'universal':
      return { text: true, image: true, logo: true, background: true };
    default:
      return { text: true, image: false, logo: false, background: false };
  }
}

function processEffectCode(code) {
  // Nettoyer le code et le préparer pour l'injection
  let processedCode = code
    .replace(/export\s+default\s+class\s+\w+Effect\s+extends\s+BaseEffect\s*{/, '')
    .replace(/^class\s+\w+Effect\s+extends\s+BaseEffect\s*{/, '')
    .replace(/}\s*$/, '')
    .trim();
  
  // Si c'est une classe, on enveloppe dans une fonction
  if (processedCode.includes('constructor(') || processedCode.includes('initialize(') || processedCode.includes('render(')) {
    return `
    // Code original de l'effet intégré
    ${processedCode}
    `;
  }
  
  return processedCode;
}

function convertEffect(effectDir, effectName) {
  const effectPath = path.join(effectDir, effectName);
  const descriptionFile = path.join(effectPath, 'Description.txt');
  const effectFiles = fs.readdirSync(effectPath).filter(f => f.endsWith('.js'));
  
  if (!fs.existsSync(descriptionFile) || effectFiles.length === 0) {
    console.warn(`Skipping ${effectName}: missing files`);
    return null;
  }
  
  const description = fs.readFileSync(descriptionFile, 'utf8').trim();
  const effectCode = fs.readFileSync(path.join(effectPath, effectFiles[0]), 'utf8');
  
  const category = detectCategory(effectName, description);
  const subcategory = detectSubcategory(effectName, description);
  const intensity = detectIntensity(effectName, description);
  const performance = detectPerformance(effectName, description);
  const tags = extractTags(effectName, description);
  const compatibility = generateCompatibility(category);
  
  const camelCaseName = toCamelCase(effectName.toLowerCase());
  const titleName = toTitleCase(effectName.toLowerCase());
  
  return `// ${effectName.toLowerCase()}.effect.js

export const ${camelCaseName}Effect = {
  id: "${effectName.toLowerCase()}",
  name: "${titleName}",
  
  description: \`${description}\`,

  category: "${category}",
  subcategory: "${subcategory}",
  intensity: "${intensity}",
  performance: "${performance}",

  compatibility: {
    text: ${compatibility.text},
    image: ${compatibility.image},
    logo: ${compatibility.logo},
    background: ${compatibility.background}
  },

  tags: [${tags.map(tag => `"${tag}"`).join(', ')}],

  parameters: {
    // Paramètres par défaut - à personnaliser selon l'effet
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
    gif: "${effectName.toLowerCase()}.gif",
    duration: 3000,
    loop: true
  },

  engine: (element, params) => {
    ${processEffectCode(effectCode)}
  }
};
`;
}

function main() {
  const sourceDir = './Effet_premium';
  const targetDir = './src/data/effects';
  
  // Créer le dossier de destination
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const effects = fs.readdirSync(sourceDir).filter(item => {
    return fs.statSync(path.join(sourceDir, item)).isDirectory();
  });
  
  console.log(`Found ${effects.length} effects to convert...`);
  
  const convertedEffects = [];
  
  effects.forEach(effectName => {
    try {
      const convertedCode = convertEffect(sourceDir, effectName);
      if (convertedCode) {
        const fileName = `${effectName.toLowerCase()}.effect.js`;
        const filePath = path.join(targetDir, fileName);
        fs.writeFileSync(filePath, convertedCode);
        convertedEffects.push(effectName);
        console.log(`✅ Converted: ${effectName} -> ${fileName}`);
      }
    } catch (error) {
      console.error(`❌ Error converting ${effectName}:`, error.message);
    }
  });
  
  // Créer un index pour importer tous les effets
  const indexContent = `// index.js - Auto-generated effects index
${convertedEffects.map(effect => {
  const camelName = toCamelCase(effect.toLowerCase());
  return `export { ${camelName}Effect } from './${effect.toLowerCase()}.effect.js';`;
}).join('\n')}

// Objet contenant tous les effets
export const allEffects = {
${convertedEffects.map(effect => {
  const camelName = toCamelCase(effect.toLowerCase());
  return `  "${effect.toLowerCase()}": ${camelName}Effect`;
}).join(',\n')}
};

// Fonction utilitaire pour filtrer les effets
export function filterEffects(criteria = {}) {
  const { category, subcategory, intensity, performance, tags, compatibility } = criteria;
  
  return Object.values(allEffects).filter(effect => {
    if (category && effect.category !== category) return false;
    if (subcategory && effect.subcategory !== subcategory) return false;
    if (intensity && effect.intensity !== intensity) return false;
    if (performance && effect.performance !== performance) return false;
    if (tags && !tags.some(tag => effect.tags.includes(tag))) return false;
    if (compatibility && !Object.keys(compatibility).every(key => 
      compatibility[key] ? effect.compatibility[key] : true
    )) return false;
    
    return true;
  });
}
`;
  
  fs.writeFileSync(path.join(targetDir, 'index.js'), indexContent);
  
  console.log(`\n🎉 Conversion complete!`);
  console.log(`✅ ${convertedEffects.length} effects converted`);
  console.log(`📁 Files created in: ${targetDir}/`);
  console.log(`📋 Index file created: ${targetDir}/index.js`);
}

if (require.main === module) {
  main();
}

module.exports = { convertEffect, main };
