# kbyg.ai Brand Assets Quick Reference

## 🎨 Colors

### Primary Palette (Intelligence-Themed)
```css
--brand-primary: #3b82f6        /* Command Blue */
--brand-secondary: #8b5cf6      /* Extraction Purple */
--brand-accent: #06b6d4         /* Tactical Cyan */
```

### Quick Classes
```html
<div class="bg-primary text-white">Command Blue</div>
<div class="bg-secondary text-white">Extraction Purple</div>
<div class="text-accent">Tactical Cyan</div>
```

## 📝 Typography

### Headings & Body (Inter)
```html
<h1><!-- 48px Inter Bold --></h1>
<h2><!-- 36px Inter Bold --></h2>
<h3><!-- 30px Inter Bold --></h3>
<p class="text-base"><!-- 16px Inter Regular --></p>
<p class="text-sm"><!-- 14px Inter Regular --></p>
```

### Brand Wordmark
- "kbyg" = Inter 800 (Extrabold)
- ".ai" = Inter 300 (Light) in primary blue

## 🔘 Buttons

```html
<!-- Primary -->
<button class="btn btn-primary">Extract Intelligence</button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-lg">Large</button>

<!-- Variants -->
<button class="btn btn-secondary">Weaponize Openers</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-gradient"><span>Dominate Your Next Event</span></button>
```

## 🗂️ Cards

```html
<!-- Basic Card -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Intelligence Extraction</h3>
  </div>
  <div class="card-body">Content</div>
  <div class="card-footer">Footer</div>
</div>

<!-- Feature Card -->
<div class="card card-feature">
  <div class="card-feature-icon">⚡</div>
  <h3 class="card-title">Weaponized Openers</h3>
  <p>Pre-qualified openers that close deals</p>
</div>
```

## 🖼️ Logos

```html
<!-- Light background -->
<img src="logos/logo-primary.svg" alt="kbyg.ai" height="60">

<!-- Dark background -->
<img src="logos/logo-white.svg" alt="kbyg.ai" height="60">

<!-- Icon only -->
<img src="logos/icon-only.svg" alt="kbyg.ai" height="60">
```

## 📐 Spacing Scale

```css
4px   = 0.25rem
8px   = 0.5rem
16px  = 1rem
24px  = 1.5rem
32px  = 2rem
48px  = 3rem
```

## 🎯 Border Radius

```css
Small:  0.375rem (6px)
Medium: 0.5rem   (8px)
Large:  0.75rem  (12px)
Round:  9999px   (pill)
```

## 💡 Intelligence Gradients

```css
/* Primary Command Gradient */
background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%);

/* Extraction Gradient */
background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);

/* Tactical Gradient */
background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
```

## 📦 File Structure

```
brand-assets/
├── logos/          → SVG logo files (intelligence extraction icon)
├── banners/        → Social & web banners
├── images/         → Intelligence extraction & tactical imagery
├── colors/         → Color CSS & guide (Command Center theme)
├── fonts/          → Typography CSS (Inter)
├── templates/      → Component CSS
└── example.html    → Live demo
```

## 🚀 Getting Started

1. **Import styles:**
   ```html
   <link rel="stylesheet" href="brand-assets/colors/palette.css">
   <link rel="stylesheet" href="brand-assets/fonts/typography.css">
   <link rel="stylesheet" href="brand-assets/templates/buttons.css">
   <link rel="stylesheet" href="brand-assets/templates/cards.css">
   ```

2. **Use logo:**
   ```html
   <img src="brand-assets/logos/logo-primary.svg" alt="kbyg.ai" height="60">
   ```

3. **Use components:**
   ```html
   <button class="btn btn-primary">Get Started</button>
   ```

4. **Open `example.html`** to see everything in action

## 🎨 Color Psychology

- **Command Blue (#3b82f6)**: Authority, execution, tactical precision
- **Extraction Purple (#8b5cf6)**: Intelligence, competitive edge, deep-tier access
- **Tactical Cyan (#06b6d4)**: Domination, revenue obsession, unfair advantage

---

**Full documentation:** See `README.md`
**Color guide:** See `colors/COLOR_GUIDE.md`
**Design specs:** See `DESIGN_SPECS.md`
