const hashCode = (str: string): number => {
  let hash = 0;
  if (str.length === 0) return hash;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  hash = hash ^ (hash >>> 16);
  hash = hash * 0x85ebca6b;
  hash = hash ^ (hash >>> 13);
  hash = hash * 0xc2b2ae35;
  hash = hash ^ (hash >>> 16);

  return Math.abs(hash);
};

const seededRandom = (seed: string, index = 0): number => {
  const value = hashCode(seed + index);
  return (value % 1000) / 1000;
};

interface ColorPalette {
  bg: string;
  shapes: string[];
}

const colorPalettes: ColorPalette[] = [
  { bg: '#e74c3c', shapes: ['#f39c12', '#2ecc71', '#ecf0f1'] },
  { bg: '#f39c12', shapes: ['#e74c3c', '#27ae60', '#34495e'] },
  { bg: '#f1c40f', shapes: ['#8e44ad', '#16a085', '#2c3e50'] },
  { bg: '#27ae60', shapes: ['#3498db', '#e74c3c', '#ecf0f1'] },
  { bg: '#16a085', shapes: ['#f39c12', '#9b59b6', '#34495e'] },
  { bg: '#3498db', shapes: ['#e67e22', '#27ae60', '#2c3e50'] },
  { bg: '#9b59b6', shapes: ['#f1c40f', '#16a085', '#ecf0f1'] },
  { bg: '#e91e63', shapes: ['#00bcd4', '#4caf50', '#424242'] },
  { bg: '#8d6e63', shapes: ['#ff9800', '#009688', '#f5f5f5'] },
  { bg: '#607d8b', shapes: ['#ff5722', '#8bc34a', '#ffffff'] },
  { bg: '#00e676', shapes: ['#ff1744', '#2979ff', '#37474f'] },
  { bg: '#263238', shapes: ['#ff6f00', '#e91e63', '#00acc1'] },
];

const generatePattern = (seed: string, type: number): string => {
  const r1 = seededRandom(seed, type * 10);
  const r2 = seededRandom(seed, type * 10 + 1);
  const r3 = seededRandom(seed, type * 10 + 2);

  const size = 30 + r1 * 40;
  const x = r2 * 80;
  const y = r3 * 80;

  switch (type % 4) {
    case 0:
      return `<circle cx="${x + 20}" cy="${y + 20}" r="${size / 2}" fill-opacity="0.8"/>`;
    case 1:
      return `<rect x="${x + 10}" y="${y + 10}" width="${size}" height="${size * 0.6}" fill-opacity="0.7" rx="5"/>`;
    case 2: {
      const points = `${x + 20},${y + 10} ${x + 20 + size / 2},${y + 10 + size} ${x + 20 - size / 2},${y + 10 + size}`;
      return `<polygon points="${points}" fill-opacity="0.6"/>`;
    }
    case 3: {
      const diamond = `${x + 20},${y} ${x + 20 + size / 2},${y + 20} ${x + 20},${y + 40} ${x + 20 - size / 2},${y + 20}`;
      return `<polygon points="${diamond}" fill-opacity="0.7"/>`;
    }
    default:
      return '';
  }
};

export default function getUserAvatar(id: string): string {
  if (!id) {
    return 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#ddd"/></svg>');
  }

  const stringLength = id.length;
  const firstChar = id.charCodeAt(0) || 0;
  const lastChar = id.charCodeAt(id.length - 1) || 0;
  const middleChar = id.charCodeAt(Math.floor(id.length / 2)) || 0;

  const distributionValue = (
    hashCode(id) +
    stringLength * 47 +
    firstChar * 73 +
    lastChar * 101 +
    middleChar * 137
  );

  const paletteIndex = Math.abs(distributionValue) % colorPalettes.length;
  const palette = colorPalettes[paletteIndex];

  const numShapes = 3 + (hashCode(id + 'count') % 2);
  const shapes: string[] = [];

  for (let i = 0; i < numShapes; i++) {
    const colorIndex = hashCode(id + 'color' + i) % palette.shapes.length;
    const shapeColor = palette.shapes[colorIndex];
    const pattern = generatePattern(id + 'shape' + i, i);

    if (pattern) {
      shapes.push(`<g fill="${shapeColor}">${pattern}</g>`);
    }
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="${palette.bg}"/>
      ${shapes.join('')}
    </svg>
  `.trim();

  return 'data:image/svg+xml;base64,' + btoa(svg);
}
