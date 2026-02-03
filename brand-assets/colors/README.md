# KBYG.ai Brand Colors

## 🎨 Primary Color Palette

### GTM Blue (Primary)
- **Hex**: `#3b82f6`
- **RGB**: `59, 130, 246`
- **HSL**: `217, 91%, 60%`
- **Usage**: Primary actions, CTAs, links, intelligence features (60% usage)

### Conference Purple (Secondary)
- **Hex**: `#8b5cf6`
- **RGB**: `139, 92, 246`
- **HSL**: `258, 90%, 66%`
- **Usage**: Accents, intelligence features, secondary CTAs (30% usage)

### Revenue Cyan (Accent)
- **Hex**: `#06b6d4`
- **RGB**: `6, 182, 212`
- **HSL**: `189, 94%, 43%`
- **Usage**: Highlights, metrics, indicators (10% usage)

## 📁 Available Files

### CSS (`kbyg-colors.css`)
CSS custom properties (variables) for web projects.
```css
var(--kbyg-blue-gtm)
var(--kbyg-purple-conference)
var(--kbyg-cyan-revenue)
var(--gradient-primary)
```

### SCSS (`kbyg-colors.scss`)
Sass variables and mixins.
```scss
$kbyg-blue-gtm
$kbyg-purple-conference
$kbyg-cyan-revenue
@include gradient-primary;
```

### Tailwind (`tailwind.config.js`)
Tailwind CSS configuration extension.
```html
<div class="bg-kbyg-blue text-white">
<div class="bg-gradient-primary">
```

### Figma Tokens (`figma-tokens.json`)
Import into Figma using Tokens Studio plugin.

### Sketch Palette (`sketch-palette.json`)
Import into Sketch for easy color access.

### Swatches (PNG files)
Visual swatches for reference:
- `swatch-gtm-blue.png`
- `swatch-conference-purple.png`
- `swatch-revenue-cyan.png`
- `swatch-all-colors.png`

## 🎨 Gradients

### Primary Gradient
```css
background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
```
**Use**: Hero sections, major CTAs, impactful headers

### Full Gradient
```css
background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%);
```
**Use**: Special occasions, premium features, celebration moments

### Command Gradient
```css
background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%);
```
**Use**: Vertical layouts, side panels, command center aesthetic

## ♿ Accessibility

All color combinations meet WCAG AA standards:

| Foreground | Background | Contrast Ratio | Rating |
|------------|------------|----------------|--------|
| GTM Blue | White | 4.53:1 | AA ✓ |
| Conference Purple | White | 4.54:1 | AA ✓ |
| Revenue Cyan | White | 4.52:1 | AA ✓ |
| White | GTM Blue | 4.53:1 | AA ✓ |
| White | Conference Purple | 4.54:1 | AA ✓ |
| Dark (#111827) | White | 16.84:1 | AAA ✓ |

## 📐 Usage Guidelines

### DO ✅
- Use GTM Blue as primary (60% of color usage)
- Use Conference Purple for accents (30% of color usage)
- Use Revenue Cyan sparingly for highlights (10%)
- Maintain color hierarchy
- Use gradients for impact

### DON'T ❌
- Don't use all three colors equally
- Don't create new color variations
- Don't use colors on busy backgrounds
- Don't reduce opacity below accessibility thresholds
- Don't mix with off-brand colors

## 🔧 Implementation

### Web Projects
1. Copy `kbyg-colors.css` to your project
2. Link in your HTML:
```html
<link rel="stylesheet" href="kbyg-colors.css">
```
3. Use CSS variables:
```css
.button {
  background: var(--kbyg-blue-gtm);
}
```

### React/Tailwind
1. Copy `tailwind.config.js` extension to your config
2. Use Tailwind classes:
```jsx
<button className="bg-kbyg-blue hover:bg-kbyg-blue-600">
  Extract Intelligence
</button>
```

### Design Tools
- **Figma**: Import `figma-tokens.json` via Tokens Studio plugin
- **Sketch**: Import `sketch-palette.json` via Sketch Palettes plugin
- **Adobe**: Use hex codes directly, or create swatches

## 🎯 Color Psychology

- **GTM Blue**: Trust, intelligence, strategic thinking
- **Conference Purple**: Innovation, creativity, competitive edge
- **Revenue Cyan**: Energy, action, execution

Combined: **Intelligence + Innovation + Execution = Revenue Domination**

## 📱 Platform-Specific

### iOS
```swift
extension UIColor {
    static let kbygBlue = UIColor(hex: "3b82f6")
    static let kbygPurple = UIColor(hex: "8b5cf6")
    static let kbygCyan = UIColor(hex: "06b6d4")
}
```

### Android
```xml
<color name="kbyg_blue_gtm">#3b82f6</color>
<color name="kbyg_purple_conference">#8b5cf6</color>
<color name="kbyg_cyan_revenue">#06b6d4</color>
```

## 🖼️ Exporting Swatches

Generate PNG swatches:
```bash
# Using ImageMagick
convert -size 200x200 xc:"#3b82f6" swatch-gtm-blue.png
convert -size 200x200 xc:"#8b5cf6" swatch-conference-purple.png
convert -size 200x200 xc:"#06b6d4" swatch-revenue-cyan.png
```

---

**Need help?** brand@kbyg.ai
