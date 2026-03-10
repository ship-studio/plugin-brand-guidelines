/**
 * Pure extraction functions for CSS colors, fonts, and visible text.
 * Transforms raw CSS/HTML into structured input for AI analysis.
 */

// ── Types ──────────────────────────────────────────────────────────────────

export interface RawColor {
  value: string;
  hex: string;
  varName?: string;
  /** Number of times this color appears in the CSS. */
  count: number;
}

// ── Named CSS Colors (all 148) ─────────────────────────────────────────────

const NAMED_COLORS: Record<string, string> = {
  aliceblue: '#f0f8ff', antiquewhite: '#faebd7', aqua: '#00ffff',
  aquamarine: '#7fffd4', azure: '#f0ffff', beige: '#f5f5dc',
  bisque: '#ffe4c4', black: '#000000', blanchedalmond: '#ffebcd',
  blue: '#0000ff', blueviolet: '#8a2be2', brown: '#a52a2a',
  burlywood: '#deb887', cadetblue: '#5f9ea0', chartreuse: '#7fff00',
  chocolate: '#d2691e', coral: '#ff7f50', cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc', crimson: '#dc143c', cyan: '#00ffff',
  darkblue: '#00008b', darkcyan: '#008b8b', darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9', darkgreen: '#006400', darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b', darkmagenta: '#8b008b', darkolivegreen: '#556b2f',
  darkorange: '#ff8c00', darkorchid: '#9932cc', darkred: '#8b0000',
  darksalmon: '#e9967a', darkseagreen: '#8fbc8f', darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f', darkslategrey: '#2f4f4f', darkturquoise: '#00ced1',
  darkviolet: '#9400d3', deeppink: '#ff1493', deepskyblue: '#00bfff',
  dimgray: '#696969', dimgrey: '#696969', dodgerblue: '#1e90ff',
  firebrick: '#b22222', floralwhite: '#fffaf0', forestgreen: '#228b22',
  fuchsia: '#ff00ff', gainsboro: '#dcdcdc', ghostwhite: '#f8f8ff',
  gold: '#ffd700', goldenrod: '#daa520', gray: '#808080',
  green: '#008000', greenyellow: '#adff2f', grey: '#808080',
  honeydew: '#f0fff0', hotpink: '#ff69b4', indianred: '#cd5c5c',
  indigo: '#4b0082', ivory: '#fffff0', khaki: '#f0e68c',
  lavender: '#e6e6fa', lavenderblush: '#fff0f5', lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd', lightblue: '#add8e6', lightcoral: '#f08080',
  lightcyan: '#e0ffff', lightgoldenrodyellow: '#fafad2', lightgray: '#d3d3d3',
  lightgreen: '#90ee90', lightgrey: '#d3d3d3', lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a', lightseagreen: '#20b2aa', lightskyblue: '#87cefa',
  lightslategray: '#778899', lightslategrey: '#778899', lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0', lime: '#00ff00', limegreen: '#32cd32',
  linen: '#faf0e6', magenta: '#ff00ff', maroon: '#800000',
  mediumaquamarine: '#66cdaa', mediumblue: '#0000cd', mediumorchid: '#ba55d3',
  mediumpurple: '#9370db', mediumseagreen: '#3cb371', mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a', mediumturquoise: '#48d1cc', mediumvioletred: '#c71585',
  midnightblue: '#191970', mintcream: '#f5fffa', mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5', navajowhite: '#ffdead', navy: '#000080',
  oldlace: '#fdf5e6', olive: '#808000', olivedrab: '#6b8e23',
  orange: '#ffa500', orangered: '#ff4500', orchid: '#da70d6',
  palegoldenrod: '#eee8aa', palegreen: '#98fb98', paleturquoise: '#afeeee',
  palevioletred: '#db7093', papayawhip: '#ffefd5', peachpuff: '#ffdab9',
  peru: '#cd853f', pink: '#ffc0cb', plum: '#dda0dd',
  powderblue: '#b0e0e6', purple: '#800080', rebeccapurple: '#663399',
  red: '#ff0000', rosybrown: '#bc8f8f', royalblue: '#4169e1',
  saddlebrown: '#8b4513', salmon: '#fa8072', sandybrown: '#f4a460',
  seagreen: '#2e8b57', seashell: '#fff5ee', sienna: '#a0522d',
  silver: '#c0c0c0', skyblue: '#87ceeb', slateblue: '#6a5acd',
  slategray: '#708090', slategrey: '#708090', snow: '#fffafa',
  springgreen: '#00ff7f', steelblue: '#4682b4', tan: '#d2b48c',
  teal: '#008080', thistle: '#d8bfd8', tomato: '#ff6347',
  turquoise: '#40e0d0', violet: '#ee82ee', wheat: '#f5deb3',
  white: '#ffffff', whitesmoke: '#f5f5f5', yellow: '#ffff00',
  yellowgreen: '#9acd32',
};

// ── Regex Patterns ─────────────────────────────────────────────────────────

const HEX_RE = /#(?:[0-9a-fA-F]{3,4}){1,2}\b/g;
const RGB_RE = /rgba?\(\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?(?:\s*[/,]\s*[\d.]+%?)?\s*\)/gi;
const HSL_RE = /hsla?\(\s*[\d.]+(?:deg|rad|grad|turn)?\s*[,\s]\s*[\d.]+%\s*[,\s]\s*[\d.]+%(?:\s*[/,]\s*[\d.]+%?)?\s*\)/gi;
const CSS_VAR_COLOR_RE = /(--[\w-]+)\s*:\s*(#(?:[0-9a-fA-F]{3,4}){1,2}\b|rgba?\([^)]+\)|hsla?\([^)]+\))/g;
const FONT_FAMILY_RE = /font-family\s*:\s*([^;}]+)/gi;
const FONT_SHORTHAND_RE = /font\s*:\s*(?:(?:italic|oblique|normal|small-caps|bold|bolder|lighter|\d+)\s+)*[\d.]+(?:px|rem|em|%|pt)\s*(?:\/\s*[\d.]+(?:px|rem|em|%)?\s*)?([^;}]+)/gi;

const NAMED_COLOR_KEYS = Object.keys(NAMED_COLORS);

const GENERIC_FONTS = [
  'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy',
  'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded',
  'inherit', 'initial', 'unset',
];

// ── Conversion Helpers ─────────────────────────────────────────────────────

function expandHex(hex: string): string {
  const h = hex.replace('#', '').toLowerCase();
  if (h.length === 3) return '#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length === 4) return '#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length === 8) return '#' + h.slice(0, 6);
  return '#' + h;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => {
    const clamped = Math.max(0, Math.min(255, Math.round(v)));
    return clamped.toString(16).padStart(2, '0');
  }).join('');
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s / 100));
  l = Math.max(0, Math.min(1, l / 100));

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }

  return rgbToHex(
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  );
}

function parseRgbValues(value: string): [number, number, number] | null {
  // Match rgb(r, g, b) or rgb(r g b) or rgb(r g b / a)
  const m = value.match(/rgba?\(\s*([\d.]+)%?\s*[,\s]\s*([\d.]+)%?\s*[,\s]\s*([\d.]+)%?/i);
  if (!m) return null;
  return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])];
}

function parseHslValues(value: string): [number, number, number] | null {
  const m = value.match(/hsla?\(\s*([\d.]+)(?:deg|rad|grad|turn)?\s*[,\s]\s*([\d.]+)%\s*[,\s]\s*([\d.]+)%/i);
  if (!m) return null;
  return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])];
}

// ── Public Functions ───────────────────────────────────────────────────────

/**
 * Normalize any CSS color value to a lowercase 6-digit hex string.
 * Returns null if the value cannot be parsed.
 */
export function normalizeToHex(value: string): string | null {
  const trimmed = value.trim().toLowerCase();

  // Hex
  if (trimmed.startsWith('#')) {
    const stripped = trimmed.replace('#', '');
    if (/^[0-9a-f]{3,8}$/.test(stripped)) {
      return expandHex(trimmed);
    }
    return null;
  }

  // RGB/RGBA
  if (trimmed.startsWith('rgb')) {
    const vals = parseRgbValues(trimmed);
    if (vals) return rgbToHex(vals[0], vals[1], vals[2]);
    return null;
  }

  // HSL/HSLA
  if (trimmed.startsWith('hsl')) {
    const vals = parseHslValues(trimmed);
    if (vals) return hslToHex(vals[0], vals[1], vals[2]);
    return null;
  }

  // Named color
  if (NAMED_COLORS[trimmed]) {
    return NAMED_COLORS[trimmed];
  }

  return null;
}

/**
 * Extract all color values from CSS text arrays.
 * Returns deduplicated RawColor array with normalized hex values.
 */
export function extractColors(cssTexts: string[]): RawColor[] {
  const colors: RawColor[] = [];
  const seenHex = new Map<string, number>(); // hex -> index in colors array
  const combined = cssTexts.join('\n');

  if (!combined.trim()) return [];

  function addColor(value: string, hex: string, varName?: string) {
    const normalizedHex = hex.toLowerCase();
    const existing = seenHex.get(normalizedHex);
    if (existing !== undefined) {
      colors[existing].count++;
      return;
    }
    seenHex.set(normalizedHex, colors.length);
    const entry: RawColor = { value, hex: normalizedHex, count: 1 };
    if (varName) entry.varName = varName;
    colors.push(entry);
  }

  // 1. CSS custom properties with color values
  let match: RegExpExecArray | null;
  const varRe = new RegExp(CSS_VAR_COLOR_RE.source, CSS_VAR_COLOR_RE.flags);
  while ((match = varRe.exec(combined))) {
    const hex = normalizeToHex(match[2]);
    if (hex) addColor(match[2], hex, match[1]);
  }

  // 2. Hex colors
  const hexRe = new RegExp(HEX_RE.source, HEX_RE.flags);
  while ((match = hexRe.exec(combined))) {
    const hex = normalizeToHex(match[0]);
    if (hex) addColor(match[0], hex);
  }

  // 3. RGB/RGBA
  const rgbRe = new RegExp(RGB_RE.source, RGB_RE.flags);
  while ((match = rgbRe.exec(combined))) {
    const hex = normalizeToHex(match[0]);
    if (hex) addColor(match[0], hex);
  }

  // 4. HSL/HSLA
  const hslRe = new RegExp(HSL_RE.source, HSL_RE.flags);
  while ((match = hslRe.exec(combined))) {
    const hex = normalizeToHex(match[0]);
    if (hex) addColor(match[0], hex);
  }

  // 5. Named colors — scan for property values that are named colors
  // Match patterns like "color: red;" or "background: blue;"
  const propValueRe = /(?:color|background(?:-color)?)\s*:\s*([a-z]+)\s*[;}\s]/gi;
  let propMatch: RegExpExecArray | null;
  const propRe = new RegExp(propValueRe.source, propValueRe.flags);
  while ((propMatch = propRe.exec(combined))) {
    const name = propMatch[1].toLowerCase();
    if (NAMED_COLORS[name]) {
      addColor(propMatch[1], NAMED_COLORS[name]);
    }
  }

  // Sort by frequency (most used first) so AI prioritizes dominant colors
  colors.sort((a, b) => b.count - a.count);
  return colors;
}

/**
 * Parse comma-separated font families, stripping quotes and filtering generics.
 */
function parseFontFamilies(raw: string): string[] {
  return raw
    .split(',')
    .map(f => f.trim().replace(/^["']|["']$/g, ''))
    .filter(f => f && !GENERIC_FONTS.includes(f.toLowerCase()));
}

/**
 * Extract unique font family names from CSS text arrays.
 * Filters out generic CSS font families.
 */
export function extractFonts(cssTexts: string[]): string[] {
  const fonts = new Set<string>();
  const combined = cssTexts.join('\n');

  // font-family declarations
  let match: RegExpExecArray | null;
  const ffRe = new RegExp(FONT_FAMILY_RE.source, FONT_FAMILY_RE.flags);
  while ((match = ffRe.exec(combined))) {
    for (const f of parseFontFamilies(match[1])) {
      fonts.add(f);
    }
  }

  // font shorthand
  const fsRe = new RegExp(FONT_SHORTHAND_RE.source, FONT_SHORTHAND_RE.flags);
  while ((match = fsRe.exec(combined))) {
    for (const f of parseFontFamilies(match[1])) {
      fonts.add(f);
    }
  }

  return Array.from(fonts);
}

/**
 * Extract visible text from HTML, stripping non-content elements.
 * Returns collapsed whitespace text truncated to 10KB.
 */
export function extractVisibleText(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const removeTags = ['script', 'style', 'nav', 'footer', 'header', 'noscript', 'svg', 'iframe'];
  for (const tag of removeTags) {
    doc.querySelectorAll(tag).forEach(el => el.remove());
  }

  const text = (doc.body?.textContent || '')
    .replace(/\s+/g, ' ')
    .trim();

  return text.slice(0, 10_000);
}

/**
 * Extract unique border-radius values from CSS text arrays.
 * Filters out zero, inherit, initial, unset, revert, and none values.
 */
export function extractRadii(cssTexts: string[]): string[] {
  const values = new Set<string>();
  const combined = cssTexts.join('\n');
  const skipValues = new Set(['0', '0px', 'inherit', 'initial', 'unset', 'revert', 'none']);

  const re = new RegExp(
    /border(?:-top-left|-top-right|-bottom-left|-bottom-right)?-radius\s*:\s*([^;}\n]+)/gi.source,
    'gi',
  );
  let match: RegExpExecArray | null;
  while ((match = re.exec(combined))) {
    const val = match[1].trim().toLowerCase();
    if (!skipValues.has(val)) {
      values.add(val);
    }
  }

  return Array.from(values);
}

/**
 * Extract unique spacing values from CSS text arrays.
 * Splits shorthand properties and filters out zero, auto, inherit, etc.
 */
export function extractSpacing(cssTexts: string[]): string[] {
  const values = new Set<string>();
  const combined = cssTexts.join('\n');
  const skipValues = new Set([
    '0', '0px', 'auto', 'inherit', 'initial', 'unset', 'revert', 'none', 'normal',
  ]);

  const re = new RegExp(
    /(?:padding|margin|gap|row-gap|column-gap)(?:-(?:top|right|bottom|left))?\s*:\s*([^;}\n]+)/gi.source,
    'gi',
  );
  let match: RegExpExecArray | null;
  while ((match = re.exec(combined))) {
    const parts = match[1].trim().toLowerCase().split(/\s+/);
    for (const part of parts) {
      if (!skipValues.has(part) && /^[\d.]/.test(part)) {
        values.add(part);
      }
    }
  }

  return Array.from(values);
}

/**
 * Extract CSS from <style> blocks in HTML.
 */
export function extractEmbeddedStyles(html: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const styles: string[] = [];
  doc.querySelectorAll('style').forEach(el => {
    const text = el.textContent?.trim();
    if (text) styles.push(text);
  });
  return styles;
}
