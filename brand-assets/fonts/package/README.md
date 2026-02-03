# Inter Font Package

A ready-to-use package of the Inter typeface with multiple formats and weights for designers and developers.

## What's Included

- **5 Font Weights:** Light (300), Regular (400), Medium (500), SemiBold (600), Bold (700)
- **2 Formats:** WOFF2 (web, modern browsers) and TTF (desktop applications)
- **CSS File:** Pre-configured @font-face declarations
- **Font Specimen:** Interactive HTML preview of all weights and styles

## Package Contents

```
fonts/
├── woff2/               # Web fonts (WOFF2 format, best compression)
│   ├── Inter-Light.woff2
│   ├── Inter-Regular.woff2
│   ├── Inter-Medium.woff2
│   ├── Inter-SemiBold.woff2
│   └── Inter-Bold.woff2
├── ttf/                 # Desktop fonts (TrueType format)
│   ├── Inter-Light.ttf
│   ├── Inter-Regular.ttf
│   ├── Inter-Medium.ttf
│   ├── Inter-SemiBold.ttf
│   └── Inter-Bold.ttf
fonts.css                # CSS with @font-face declarations
font-specimen.html       # Preview all weights and styles
README.md               # This file
```

## Installation

### For Web Projects

1. **Copy the font files and CSS to your project:**
   ```
   project/
   ├── fonts/
   │   ├── woff2/
   │   └── ttf/
   └── fonts.css
   ```

2. **Link the CSS in your HTML:**
   ```html
   <link rel="stylesheet" href="fonts.css">
   ```

3. **Use in your CSS:**
   ```css
   body {
     font-family: 'Inter', sans-serif;
   }

   h1 {
     font-family: 'Inter', sans-serif;
     font-weight: 700; /* Bold */
   }

   .subtitle {
     font-family: 'Inter', sans-serif;
     font-weight: 300; /* Light */
   }
   ```

### For Design Tools (Figma, Sketch, Adobe, etc.)

1. **Locate the TTF files** in the `fonts/ttf/` folder
2. **Install on your system:**
   - **Mac:** Double-click each `.ttf` file and click "Install Font"
   - **Windows:** Right-click each `.ttf` file and select "Install"
   - **Linux:** Copy to `~/.local/share/fonts/` or `/usr/share/fonts/`
3. **Restart your design application** if it was already open
4. **Select "Inter"** from the font menu

## Font Weights Reference

| Weight Name | CSS Value | When to Use |
|------------|-----------|-------------|
| Light      | 300       | Large headings, elegant displays |
| Regular    | 400       | Body text, default paragraphs |
| Medium     | 500       | Emphasized text, subheadings |
| SemiBold   | 600       | Strong emphasis, UI labels |
| Bold       | 700       | Headings, buttons, strong emphasis |

## CSS Usage Examples

### Basic Setup
```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 400;
}
```

### Different Weights
```css
h1 { font-weight: 700; } /* Bold */
h2 { font-weight: 600; } /* SemiBold */
h3 { font-weight: 500; } /* Medium */
p  { font-weight: 400; } /* Regular */
.caption { font-weight: 300; } /* Light */
```

### Responsive Typography
```css
.hero-title {
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  font-size: 3rem;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .hero-title {
    font-weight: 400; /* More readable at smaller sizes */
    font-size: 2rem;
  }
}
```

## Browser Support

### WOFF2 Format
Supported by all modern browsers (95%+ global coverage):
- Chrome 36+
- Firefox 39+
- Safari 10+
- Edge 14+
- iOS Safari 10+
- Android Chrome 95+

### TTF Fallback
The CSS file includes TTF as a fallback for older browsers.

## Performance Tips

1. **Use WOFF2 for web** - It offers 30% better compression than WOFF
2. **Font-display: swap** - Already configured in `fonts.css` to prevent invisible text
3. **Preload key fonts:**
   ```html
   <link rel="preload" href="fonts/woff2/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>
   ```
4. **Only load weights you use** - Modify `fonts.css` to remove unused weights

## Customization

### Modifying fonts.css

The included `fonts.css` loads all 5 weights. If you only need specific weights, you can remove unused @font-face declarations to reduce load time:

```css
/* Example: Only load Regular and Bold */
@font-face {
  font-family: 'Inter';
  font-weight: 400;
  src: url('fonts/woff2/Inter-Regular.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-weight: 700;
  src: url('fonts/woff2/Inter-Bold.woff2') format('woff2');
}
```

### Adjusting Font Paths

If you place fonts in a different folder, update the paths in `fonts.css`:

```css
/* Example: Fonts in /assets/fonts/ */
src: url('/assets/fonts/woff2/Inter-Regular.woff2') format('woff2');
```

## Preview

Open `font-specimen.html` in your browser to see all weights and styles in action.

## About Inter

Inter is a typeface carefully crafted and designed for computer screens. It features:

- Tall x-height for improved readability
- Distinct letterforms to reduce confusion
- Optimized for UI and body text
- Open source and free to use

**Designer:** Rasmus Andersson  
**License:** SIL Open Font License 1.1  
**Website:** https://rsms.me/inter/

## License

Inter is licensed under the [SIL Open Font License 1.1](https://github.com/rsms/inter/blob/master/LICENSE.txt).

This means you can:
- ✅ Use it for personal and commercial projects
- ✅ Modify and redistribute it
- ✅ Embed it in applications
- ✅ Bundle it with software

## Additional Formats

This package includes WOFF2 and TTF formats. If you need other formats:

- **WOFF (legacy):** Convert from TTF using [FontForge](https://fontforge.org/) or online tools
- **EOT (IE9):** Convert from TTF using [font-converter](https://www.fontconverter.io/)
- **Variable fonts:** Available from the [official Inter repository](https://github.com/rsms/inter)

## Support

For issues or questions:
- Inter project: https://github.com/rsms/inter
- Font suggestions: https://rsms.me/inter/

---

**Package created:** February 2025  
**Inter version:** 4.1  
**Last updated:** February 3, 2025
