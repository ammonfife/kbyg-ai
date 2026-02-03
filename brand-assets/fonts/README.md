# KBYG.ai Font Package

## 🔤 Font Family: Inter

**Inter** is the official brand font for KBYG.ai, used across all applications.

## 📦 Included Formats

### Web Fonts
- `Inter-Light.woff2` (300)
- `Inter-Regular.woff2` (400)
- `Inter-Medium.woff2` (500)
- `Inter-SemiBold.woff2` (600)
- `Inter-Bold.woff2` (700)
- `Inter-ExtraBold.woff2` (800)

### Desktop Fonts
- `Inter-Light.ttf` (300)
- `Inter-Regular.ttf` (400)
- `Inter-Medium.ttf` (500)
- `Inter-SemiBold.ttf` (600)
- `Inter-Bold.ttf` (700)
- `Inter-ExtraBold.ttf` (800)

## 💻 Web Font CSS

```css
/* Inter Light */
@font-face {
  font-family: 'Inter';
  font-weight: 300;
  font-style: normal;
  font-display: swap;
  src: url('./Inter-Light.woff2') format('woff2');
}

/* Inter Regular */
@font-face {
  font-family: 'Inter';
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url('./Inter-Regular.woff2') format('woff2');
}

/* Inter Medium */
@font-face {
  font-family: 'Inter';
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  src: url('./Inter-Medium.woff2') format('woff2');
}

/* Inter SemiBold */
@font-face {
  font-family: 'Inter';
  font-weight: 600;
  font-style: normal;
  font-display: swap;
  src: url('./Inter-SemiBold.woff2') format('woff2');
}

/* Inter Bold */
@font-face {
  font-family: 'Inter';
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  src: url('./Inter-Bold.woff2') format('woff2');
}

/* Inter ExtraBold */
@font-face {
  font-family: 'Inter';
  font-weight: 800;
  font-style: normal;
  font-display: swap;
  src: url('./Inter-ExtraBold.woff2') format('woff2');
}

/* Apply to body */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

## 🎨 Brand Usage

### Wordmark Typography
```css
.kbyg-wordmark {
  font-family: 'Inter', sans-serif;
}

.kbyg-wordmark .kbyg {
  font-weight: 800; /* ExtraBold */
  color: #111827;
}

.kbyg-wordmark .ai {
  font-weight: 300; /* Light */
  color: #3b82f6;
}
```

### Hierarchy
- **800 (ExtraBold)**: Logo "kbyg", major headings
- **700 (Bold)**: H1, H2 headings
- **600 (SemiBold)**: H3, emphasis, CTAs
- **500 (Medium)**: H4, subheadings, labels
- **400 (Regular)**: Body text, paragraphs
- **300 (Light)**: Logo ".ai", subtle text

## 📱 Platform-Specific

### Tailwind CSS
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

### React/Next.js
```js
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})
```

## 📥 Installation

### Desktop (macOS/Windows)
1. Download all `.ttf` files
2. Double-click to install
3. Restart design applications

### Web Project
1. Copy `*.woff2` files to your project
2. Include the CSS above
3. Reference in your stylesheets

### NPM (Google Fonts)
```bash
npm install @fontsource/inter
```

```js
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
```

## 🔗 Official Source

Inter is open source: [https://rsms.me/inter/](https://rsms.me/inter/)

## 📄 License

Inter is licensed under the SIL Open Font License 1.1
Free for commercial and personal use
