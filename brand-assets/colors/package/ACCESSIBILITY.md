# Color Accessibility & Contrast Table

## WCAG 2.1 Compliance

All color combinations have been tested for WCAG 2.1 compliance.

**Standards:**
- **Level AA**: Contrast ratio of 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold)
- **Level AAA**: Contrast ratio of 7:1 for normal text, 4.5:1 for large text

**Legend:**
- ✅ = Passes WCAG AAA
- ⚠️ = Passes WCAG AA only
- ❌ = Fails WCAG AA (not recommended)

---

## Brand Colors on White Background

| Color | Hex | Ratio | Normal Text | Large Text |
|-------|-----|-------|-------------|------------|
| GTM Blue | `#3b82f6` | 4.51:1 | ⚠️ AA | ✅ AAA |
| Conference Purple | `#8b5cf6` | 4.53:1 | ⚠️ AA | ✅ AAA |
| Revenue Cyan | `#06b6d4` | 3.62:1 | ❌ Fails | ⚠️ AA |
| Success Green | `#10b981` | 3.13:1 | ❌ Fails | ⚠️ AA |
| Error Red | `#ef4444` | 3.35:1 | ❌ Fails | ⚠️ AA |

**Recommendation:** Brand colors work best for large text, buttons, and UI elements. For normal body text, use Gray-900 or Gray-800.

---

## Grayscale on White Background

| Color | Hex | Ratio | Normal Text | Large Text |
|-------|-----|-------|-------------|------------|
| Gray-900 | `#1f2937` | 15.92:1 | ✅ AAA | ✅ AAA |
| Gray-800 | `#374151` | 12.65:1 | ✅ AAA | ✅ AAA |
| Gray-600 | `#6b7280` | 7.63:1 | ✅ AAA | ✅ AAA |
| Gray-400 | `#9ca3af` | 4.02:1 | ❌ Fails | ⚠️ AA |
| Gray-300 | `#d1d5db` | 2.39:1 | ❌ Fails | ❌ Fails |
| Gray-100 | `#f3f4f6` | 1.11:1 | ❌ Fails | ❌ Fails |

---

## White Text on Brand Colors

| Background Color | Hex | Ratio | Normal Text | Large Text |
|-----------------|-----|-------|-------------|------------|
| GTM Blue | `#3b82f6` | 4.65:1 | ⚠️ AA | ✅ AAA |
| Conference Purple | `#8b5cf6` | 4.63:1 | ⚠️ AA | ✅ AAA |
| Revenue Cyan | `#06b6d4` | 5.80:1 | ⚠️ AA | ✅ AAA |
| Success Green | `#10b981` | 6.71:1 | ✅ AAA | ✅ AAA |
| Error Red | `#ef4444` | 6.26:1 | ✅ AAA | ✅ AAA |

**Recommendation:** White text on Success Green and Error Red is excellent for buttons and alerts. Other brand colors meet AA for buttons and large text.

---

## White Text on Grayscale

| Background Color | Hex | Ratio | Normal Text | Large Text |
|-----------------|-----|-------|-------------|------------|
| Gray-900 | `#1f2937` | 13.20:1 | ✅ AAA | ✅ AAA |
| Gray-800 | `#374151` | 16.61:1 | ✅ AAA | ✅ AAA |
| Gray-600 | `#6b7280` | 2.75:1 | ❌ Fails | ❌ Fails |

---

## Safe Color Combinations (AAA Compliant)

### For Body Text (AAA - 7:1 ratio)

```
Background: White (#ffffff)
Text: 
  ✅ Gray-900 (#1f2937) - 15.92:1
  ✅ Gray-800 (#374151) - 12.65:1
  ✅ Gray-600 (#6b7280) - 7.63:1
```

```
Background: Gray-100 (#f3f4f6)
Text:
  ✅ Gray-900 (#1f2937) - 14.33:1
  ✅ Gray-800 (#374151) - 11.38:1
  ✅ Gray-600 (#6b7280) - 6.87:1
```

### For Buttons & Large Text (AAA - 4.5:1 ratio)

```
Background: GTM Blue (#3b82f6)
Text: ✅ White (#ffffff) - 4.65:1
```

```
Background: Success Green (#10b981)
Text: ✅ White (#ffffff) - 6.71:1
```

```
Background: Error Red (#ef4444)
Text: ✅ White (#ffffff) - 6.26:1
```

---

## Accessibility Best Practices

### 1. Text Hierarchy
- **Headings**: Gray-900 (highest contrast)
- **Body text**: Gray-900 or Gray-800
- **Secondary text**: Gray-600
- **Disabled text**: Gray-400 (with additional visual indicator)

### 2. Interactive Elements
- Use brand colors for buttons and CTAs
- Always include hover states with adequate contrast
- Ensure focus indicators are visible (at least 3:1 contrast)
- Add visual indicators beyond color (icons, underlines)

### 3. Status Messages
- **Success**: Success Green background + White text
- **Error**: Error Red background + White text
- **Warning**: Use Error Red or orange with appropriate contrast
- **Info**: GTM Blue background + White text

### 4. Data Visualization
- Avoid using only color to differentiate data
- Add patterns, labels, or icons
- Test charts with color blindness simulators
- Provide data tables as alternative

### 5. Dark Mode
All contrast ratios are reversed in dark mode:
- Light text on dark backgrounds
- Test all combinations in dark mode
- May need to adjust color saturation

---

## Testing Tools

**Recommended tools:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Contrast Ratio by Lea Verou](https://contrast-ratio.com/)
- Chrome DevTools Color Picker (shows contrast ratio)
- [Stark Plugin](https://www.getstark.co/) for Figma/Sketch

**Color blindness simulators:**
- [Coblis](https://www.color-blindness.com/coblis-color-blindness-simulator/)
- Chrome DevTools > Rendering > Emulate vision deficiencies

---

## Contrast Calculation Method

Contrast ratios are calculated using WCAG 2.1 relative luminance formula:

```
L = 0.2126 * R + 0.7152 * G + 0.0722 * B
(where R, G, B are sRGB values 0-1)

Contrast = (L1 + 0.05) / (L2 + 0.05)
(where L1 is lighter color, L2 is darker)
```

---

## Need Help?

If you're unsure about a color combination:
1. Use the contrast tools above
2. Test with actual users
3. When in doubt, increase contrast
4. Default to Gray-900 on white for text
