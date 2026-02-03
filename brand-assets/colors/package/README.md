# 🎨 KBYG Brand Color Palette

Complete color palette package for KBYG brand, ready for use in Figma, Sketch, Adobe products, and web development.

## 📦 Package Contents

```
kbyg-color-palette/
├── README.md                      # This file
├── COLOR-USAGE-GUIDE.md          # When and how to use each color
├── ACCESSIBILITY.md              # WCAG contrast ratios and compliance
├── colors.css                    # CSS custom properties
├── kbyg-palette.sketchpalette   # Sketch palette file
├── tokens.json                   # Figma design tokens
├── kbyg-colors.ase              # Adobe Swatch Exchange
└── swatches/                     # PNG color swatches (200x200px)
    ├── gtm-blue.png
    ├── conference-purple.png
    ├── revenue-cyan.png
    ├── success-green.png
    ├── error-red.png
    ├── gray-900.png
    ├── gray-800.png
    ├── gray-600.png
    ├── gray-400.png
    ├── gray-300.png
    └── gray-100.png
```

---

## 🎨 Color Reference

### Brand Colors
| Color | Hex | Use Case |
|-------|-----|----------|
| **GTM Blue** | `#3b82f6` | Primary actions, GTM features |
| **Conference Purple** | `#8b5cf6` | Events, conferences, calendar |
| **Revenue Cyan** | `#06b6d4` | Financial metrics, revenue data |
| **Success Green** | `#10b981` | Success states, positive feedback |
| **Error Red** | `#ef4444` | Errors, destructive actions |

### Grayscale
| Color | Hex | Use Case |
|-------|-----|----------|
| **Gray 900** | `#1f2937` | Primary text, headings |
| **Gray 800** | `#374151` | Secondary text |
| **Gray 600** | `#6b7280` | Tertiary text, metadata |
| **Gray 400** | `#9ca3af` | Disabled text, placeholders |
| **Gray 300** | `#d1d5db` | Borders, dividers |
| **Gray 100** | `#f3f4f6` | Backgrounds, cards |

---

## 🚀 Installation & Usage

### 📱 Figma

**Method 1: Import Design Tokens (Recommended)**

1. Install the [Tokens Studio plugin](https://www.figma.com/community/plugin/843461159747178978)
2. Open your Figma file
3. Open Tokens Studio plugin
4. Click "Load from file"
5. Select `tokens.json` from this package
6. Apply token set to your design system

**Method 2: Manual Import**

1. Open your Figma file
2. Select any shape/text
3. Click the color picker
4. Click the "Document colors" section
5. Manually add each hex color from the reference above
6. Name each color appropriately

**Method 3: Copy PNG Swatches**

1. Open the `swatches/` folder
2. Drag PNG files directly into Figma
3. Use as color reference or create color styles from them

---

### ✏️ Sketch

**Import Palette File:**

1. Open Sketch
2. Go to `Preferences` → `Presets`
3. Click the `+` button under "Document Colors"
4. Navigate to `kbyg-palette.sketchpalette`
5. Click "Open"
6. Colors will now appear in the color picker

**Alternative - Manual Import:**

1. Download `swatches/` folder
2. Drag PNG swatches into Sketch
3. Use eyedropper tool to sample colors
4. Save as document colors or global colors

---

### 🎨 Adobe Creative Suite (Photoshop, Illustrator, InDesign, XD)

**Import ASE Swatch File:**

1. Open Adobe application
2. Open the Swatches panel (`Window` → `Swatches`)
3. Click the panel menu (≡) → `Import Swatches...`
4. Navigate to `kbyg-colors.ase`
5. Click "Open"
6. Colors will appear in your Swatches panel

**Works with:**
- Adobe Photoshop
- Adobe Illustrator
- Adobe InDesign
- Adobe XD
- Adobe After Effects

---

### 💻 Web Development (HTML/CSS)

**Method 1: Link CSS File**

```html
<link rel="stylesheet" href="path/to/colors.css">
```

**Method 2: Import in CSS**

```css
@import url('path/to/colors.css');
```

**Method 3: Copy Variables to Your Stylesheet**

Copy the contents of `colors.css` into your main stylesheet.

**Usage Examples:**

```css
/* Primary button */
.btn-primary {
  background-color: var(--color-gtm-blue);
  color: white;
}

/* Success message */
.alert-success {
  background-color: var(--color-success-green);
  color: white;
}

/* Body text */
body {
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
}

/* Secondary text */
.text-secondary {
  color: var(--color-gray-600);
}
```

**Semantic Aliases:**

```css
/* Use semantic names for flexible design */
.primary-action {
  background-color: var(--color-primary);
}

.error-message {
  color: var(--color-error);
}
```

---

### 🖼️ PowerPoint / Keynote / Google Slides

**Using PNG Swatches:**

1. Open `swatches/` folder
2. Insert PNG swatch into your presentation
3. Use eyedropper/color picker tool to sample color
4. Or manually enter hex codes from table above

**Quick Reference Table:**

Keep this README open while designing and reference the color table for hex codes.

---

### 🎥 Video Editing (Final Cut Pro, Premiere, DaVinci Resolve)

**Manual Entry:**

Most video editing software requires manual color entry:

1. Open color picker/generator
2. Enter hex values from the reference table
3. Save as presets or favorites in your software

**Hex values for quick reference:**
- GTM Blue: `#3b82f6` (RGB: 59, 130, 246)
- Conference Purple: `#8b5cf6` (RGB: 139, 92, 246)
- Revenue Cyan: `#06b6d4` (RGB: 6, 182, 212)
- Success Green: `#10b981` (RGB: 16, 185, 129)
- Error Red: `#ef4444` (RGB: 239, 68, 68)

---

### 📊 Data Visualization Tools (Tableau, PowerBI, Chart.js)

**Copy-paste hex values:**

```javascript
// Chart.js example
const colors = {
  gtmBlue: '#3b82f6',
  conferencePurple: '#8b5cf6',
  revenueCyan: '#06b6d4',
  successGreen: '#10b981',
  errorRed: '#ef4444',
  gray: {
    900: '#1f2937',
    800: '#374151',
    600: '#6b7280',
    400: '#9ca3af',
    300: '#d1d5db',
    100: '#f3f4f6'
  }
};
```

---

## 📚 Additional Resources

### Color Usage Guidelines
Read `COLOR-USAGE-GUIDE.md` for:
- When to use each color
- Color pairing recommendations
- What to avoid
- Dark mode considerations
- Best practices

### Accessibility Standards
Read `ACCESSIBILITY.md` for:
- WCAG 2.1 contrast ratios
- Compliant color combinations
- Testing tools
- Best practices for accessible design

---

## 🔄 Updating Colors

If brand colors change:

1. **Edit source colors** in this README
2. **Update `colors.css`** with new hex values
3. **Update `tokens.json`** with new values
4. **Re-run generation script** (if you have it) or manually update:
   - `kbyg-palette.sketchpalette`
   - `kbyg-colors.ase`
   - PNG swatches
5. **Redistribute** to design team

---

## 🤝 Contributing

If you create additional format exports (like Tailwind config, SASS variables, etc.), please add them to this package and update this README.

### Requested Formats
- [ ] Tailwind CSS config
- [ ] SASS/SCSS variables
- [ ] JSON for React/Vue
- [ ] Swift/SwiftUI colors
- [ ] Android XML colors
- [ ] Flutter/Dart colors

---

## 📋 Version History

### Version 1.0 (Current)
- Initial release
- 5 brand colors + 6 grayscale values
- Formats: CSS, Sketch, Figma, Adobe ASE, PNG
- Full documentation and accessibility guide

---

## 📞 Support

Questions about color usage? Check:
1. `COLOR-USAGE-GUIDE.md` - Usage guidelines
2. `ACCESSIBILITY.md` - Contrast and compliance
3. This README - Installation help

For brand guidelines or color change requests, contact the design team.

---

## 📄 License

© KBYG Brand Assets. For internal use only. Do not redistribute without permission.

---

**Made with ❤️ for designers and developers**
