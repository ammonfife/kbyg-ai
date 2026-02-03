# KBYG Color Usage Guide

## Brand Colors

### 🔵 GTM Blue (`#3b82f6`)
**When to use:**
- Primary CTAs and action buttons
- GTM (Go-To-Market) related features and metrics
- Links and interactive elements
- Primary navigation highlights
- Charts and graphs for main metrics

**When NOT to use:**
- Large background areas (too vibrant)
- Body text (insufficient contrast)
- Error or warning states

**Pairs well with:**
- White backgrounds
- Gray-100 backgrounds
- Gray-900 text

---

### 💜 Conference Purple (`#8b5cf6`)
**When to use:**
- Conference and event features
- Calendar integrations
- Meeting scheduling UI
- Event badges and tags
- Secondary actions

**When NOT to use:**
- Primary navigation
- Critical alerts
- Data visualization for financial metrics

**Pairs well with:**
- White backgrounds
- Light purple tints (mix with white)
- Gray-900 text

---

### 🌊 Revenue Cyan (`#06b6d4`)
**When to use:**
- Revenue metrics and financial data
- Analytics dashboards
- Pricing information
- Performance indicators (positive growth)
- Data tables highlighting revenue

**When NOT to use:**
- Error states
- Text on dark backgrounds (may lack contrast)
- Overlapping with Success Green in same context

**Pairs well with:**
- White backgrounds
- Gray-100 backgrounds
- Dark gray text (Gray-800, Gray-900)

---

### ✅ Success Green (`#10b981`)
**When to use:**
- Success messages and confirmations
- Positive state indicators
- Completed tasks/milestones
- Growth metrics
- "Active" or "Live" status badges

**When NOT to use:**
- Revenue-specific metrics (use Revenue Cyan)
- Large background areas
- Neutral informational messages

**Pairs well with:**
- White backgrounds
- Light green tints
- Gray-900 text

---

### 🚨 Error Red (`#ef4444`)
**When to use:**
- Error messages and alerts
- Destructive actions (delete, remove)
- Critical warnings
- Failed states
- Validation errors
- Negative metrics

**When NOT to use:**
- Informational messages
- Revenue decline (use muted red or orange)
- Non-critical warnings (consider orange)

**Pairs well with:**
- White backgrounds
- Very light pink/red tints
- Gray-900 text

---

## Grayscale

### 🌑 Gray-900 (`#1f2937`)
**Primary text color**
- Headings
- Body text
- High-emphasis content
- Dark mode backgrounds

### 🌑 Gray-800 (`#374151`)
**Secondary emphasis**
- Subheadings
- Secondary backgrounds
- Dark mode UI elements

### 🌫️ Gray-600 (`#6b7280`)
**Secondary text**
- Metadata
- Captions
- Less important text
- Placeholders

### 🌫️ Gray-400 (`#9ca3af`)
**Tertiary text**
- Disabled text
- Very subtle captions
- Timestamps

### ⬜ Gray-300 (`#d1d5db`)
**Borders and dividers**
- Input borders
- Card separators
- Horizontal rules

### ⬜ Gray-100 (`#f3f4f6`)
**Backgrounds**
- Page backgrounds
- Card backgrounds
- Hover states
- Disabled backgrounds

---

## Color Combinations

### ✅ Recommended Combinations

| Background | Text Color | Use Case |
|-----------|-----------|----------|
| White | Gray-900 | Primary content |
| Gray-100 | Gray-900 | Secondary sections |
| GTM Blue | White | Primary buttons |
| Success Green | White | Success alerts |
| Error Red | White | Error alerts |

### ⚠️ Avoid These Combinations

| Background | Text Color | Why |
|-----------|-----------|------|
| GTM Blue | Success Green | Insufficient contrast |
| Revenue Cyan | White | May fail WCAG AA on small text |
| Gray-400 | White | Poor contrast |
| Conference Purple | Success Green | Color clash |

---

## Accessibility Guidelines

- **AA Compliance**: All text combinations must meet WCAG 2.1 Level AA (4.5:1 for normal text, 3:1 for large text)
- **AAA Compliance**: Aim for Level AAA (7:1 for normal text) on body content
- **Color Independence**: Never use color alone to convey information
- **Test with Tools**: Use color contrast checkers regularly

---

## Dark Mode Considerations

When implementing dark mode:
- Use Gray-900 as primary background
- Use Gray-100 or white for primary text
- Reduce color saturation by 10-15% for better readability
- Increase spacing and element separation
- Test all color combinations in dark mode

---

## File Format Reference

This package includes:
- `colors.css` - CSS variables
- `kbyg-palette.sketchpalette` - Sketch import
- `tokens.json` - Figma tokens
- `kbyg-colors.ase` - Adobe Swatch Exchange
- `swatches/*.png` - PNG color swatches

See `README.md` for installation instructions.
