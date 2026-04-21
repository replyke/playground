interface ColorPalette {
  colors: string[];
  name: string;
}

interface BannerResult {
  backgroundImage: string;
  patternType: string;
  palette: string;
}

export function generateProfileBanner(userId: string): BannerResult {
  const hash = (str: string): number => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      h = (h << 5) - h + char;
      h = h & h;
    }
    return Math.abs(h);
  };

  const seed = hash(userId);

  const seededRandom = (s: number): number => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const random1 = seededRandom(seed);
  const random2 = seededRandom(seed * 2);
  const random3 = seededRandom(seed * 3);
  const random4 = seededRandom(seed * 4);
  const random5 = seededRandom(seed * 5);
  const random6 = seededRandom(seed * 6);
  const random7 = seededRandom(seed * 7);

  const colorPalettes: ColorPalette[] = [
    { colors: ["#ff0080", "#7928ca", "#0070f3", "#00dfd8"], name: "neon" },
    { colors: ["#ff6b35", "#f7931e", "#ffcd3c", "#c5d86d"], name: "tropical" },
    { colors: ["#ff007f", "#bf00ff", "#8000ff", "#4000ff"], name: "cyberpunk" },
    { colors: ["#ff4757", "#ff6b35", "#feca57", "#48ca48"], name: "rainbow" },
    { colors: ["#00d4aa", "#01a3a4", "#2e86ab", "#a23b72"], name: "electric-ocean" },
    { colors: ["#ff9500", "#ff5722", "#e91e63", "#9c27b0"], name: "sunset-burst" },
    { colors: ["#16a085", "#27ae60", "#2ecc71", "#58d68d"], name: "mint" },
    { colors: ["#ff5722", "#ff7043", "#ff8a65", "#ffab91"], name: "coral" },
    { colors: ["#6a0dad", "#9d4edd", "#c77dff", "#e0aaff"], name: "galaxy" },
    { colors: ["#ff6b35", "#ff8e53", "#ff9f43", "#feca57"], name: "citrus" },
  ];

  const selectedPalette = colorPalettes[Math.floor(random1 * colorPalettes.length)];
  const c = selectedPalette.colors;

  const patterns = [
    {
      type: "geometric-triangles",
      style: (
        "linear-gradient(135deg, " + c[0] + " 0%, " + c[1] + " 100%)," +
        "repeating-linear-gradient(45deg, transparent, transparent 20px, " + c[2] + "40 20px, " + c[2] + "40 40px)," +
        "repeating-linear-gradient(-45deg, transparent, transparent 25px, " + c[3] + "30 25px, " + c[3] + "30 50px)"
      ).replace(/\s+/g, " "),
    },
    {
      type: "organic-blobs",
      style: (
        "radial-gradient(ellipse 80% 50% at " + (Math.floor(random2 * 40) + 20) + "% " + (Math.floor(random3 * 40) + 30) + "%, " + c[0] + " 0%, transparent 50%)," +
        "radial-gradient(ellipse 60% 70% at " + (Math.floor(random4 * 40) + 40) + "% " + (Math.floor(random5 * 30) + 20) + "%, " + c[1] + " 0%, transparent 50%)," +
        "radial-gradient(ellipse 90% 40% at " + (Math.floor(random6 * 30) + 60) + "% " + (Math.floor(random7 * 50) + 40) + "%, " + c[2] + " 0%, transparent 50%)," +
        "linear-gradient(135deg, " + c[3] + " 0%, " + c[0] + " 100%)"
      ).replace(/\s+/g, " "),
    },
    {
      type: "polka-dots",
      style: (
        "radial-gradient(circle at 20% 20%, " + c[0] + " 15%, transparent 16%)," +
        "radial-gradient(circle at 60% 40%, " + c[1] + " 12%, transparent 13%)," +
        "radial-gradient(circle at 80% 70%, " + c[2] + " 10%, transparent 11%)," +
        "radial-gradient(circle at 30% 80%, " + c[3] + " 8%, transparent 9%)," +
        "radial-gradient(circle at 90% 10%, " + c[0] + " 6%, transparent 7%)," +
        "linear-gradient(45deg, " + c[2] + "20 0%, " + c[1] + "30 100%)"
      ).replace(/\s+/g, " "),
    },
    {
      type: "diagonal-party",
      style: (
        "repeating-linear-gradient(30deg, " + c[0] + " 0px, " + c[0] + " 15px, " + c[1] + " 15px, " + c[1] + " 30px)," +
        "repeating-linear-gradient(120deg, transparent 0px, transparent 10px, " + c[2] + "60 10px, " + c[2] + "60 20px)," +
        "linear-gradient(60deg, " + c[3] + "40 0%, " + c[0] + "40 100%)"
      ).replace(/\s+/g, " "),
    },
    {
      type: "hexagon-honeycomb",
      style: (
        "radial-gradient(circle at 25% 25%, " + c[0] + " 20%, transparent 21%)," +
        "radial-gradient(circle at 75% 25%, " + c[1] + " 20%, transparent 21%)," +
        "radial-gradient(circle at 50% 50%, " + c[2] + " 20%, transparent 21%)," +
        "radial-gradient(circle at 25% 75%, " + c[3] + " 20%, transparent 21%)," +
        "radial-gradient(circle at 75% 75%, " + c[0] + " 20%, transparent 21%)," +
        "linear-gradient(135deg, " + c[1] + "30 0%, " + c[2] + "30 100%)"
      ).replace(/\s+/g, " "),
    },
    {
      type: "color-blocks",
      style: (
        "linear-gradient(to right, " + c[0] + " 0%, " + c[0] + " 33%, " + c[1] + " 33%, " + c[1] + " 66%, " + c[2] + " 66%, " + c[2] + " 100%)," +
        "linear-gradient(90deg, transparent 0%, transparent 25%, " + c[3] + "70 25%, " + c[3] + "70 75%, transparent 75%, transparent 100%)"
      ).replace(/\s+/g, " "),
    },
    {
      type: "wavy-ribbons",
      style: (
        "repeating-linear-gradient(" + Math.floor(random2 * 360) + "deg, " + c[0] + " 0px, " + c[1] + " 25px, " + c[2] + " 50px, " + c[3] + " 75px, " + c[0] + " 100px)," +
        "radial-gradient(ellipse at center, transparent 30%, " + c[1] + "40 70%)"
      ).replace(/\s+/g, " "),
    },
    {
      type: "starburst",
      style: (
        "conic-gradient(from " + Math.floor(random3 * 360) + "deg, " + c[0] + " 0deg, " + c[1] + " 90deg, " + c[2] + " 180deg, " + c[3] + " 270deg, " + c[0] + " 360deg)," +
        "radial-gradient(circle at 50% 50%, transparent 30%, " + c[0] + "20 70%)"
      ).replace(/\s+/g, " "),
    },
  ];

  const selectedPattern = patterns[Math.floor(random2 * patterns.length)];

  return {
    backgroundImage: selectedPattern.style,
    patternType: selectedPattern.type,
    palette: selectedPalette.name,
  };
}
