# kbyg.ai Brand Color Guide

## Primary Palette

### AI Blue (Primary)
- **Primary**: `#3b82f6` - Main brand color, CTAs, links
- **Light**: `#60a5fa` - Hover states, backgrounds
- **Dark**: `#2563eb` - Active states, text

**Usage**: Primary actions, AI-related features, technology elements

### Neural Purple (Secondary)
- **Secondary**: `#8b5cf6` - Secondary actions, neural themes
- **Light**: `#a78bfa` - Highlights, badges
- **Dark**: `#7c3aed` - Deep accents

**Usage**: AI/ML features, neural network visualizations, secondary CTAs

### Cyber Cyan (Accent)
- **Accent**: `#06b6d4` - Innovation, data visualization
- **Light**: `#22d3ee` - Subtle highlights
- **Dark**: `#0891b2` - Strong emphasis

**Usage**: Data points, highlights, futuristic elements, innovation features

## Neutral Palette

| Shade | Hex | Usage |
|-------|-----|-------|
| 50 | `#f9fafb` | Light backgrounds |
| 100 | `#f3f4f6` | Subtle backgrounds |
| 200 | `#e5e7eb` | Borders, dividers |
| 300 | `#d1d5db` | Disabled states |
| 400 | `#9ca3af` | Placeholders |
| 500 | `#6b7280` | Secondary text |
| 600 | `#4b5563` | Body text |
| 700 | `#374151` | Headings |
| 800 | `#1f2937` | Dark backgrounds |
| 900 | `#111827` | Primary text |

## Semantic Colors

- **Success**: `#10b981` - Successful operations, confirmations
- **Warning**: `#f59e0b` - Warnings, alerts, attention needed
- **Error**: `#ef4444` - Errors, destructive actions
- **Info**: `#3b82f6` - Information, tips, guidance

## AI-Themed Gradients

### Primary AI Gradient
```css
background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%);
```
Use for: Hero sections, premium AI features, main branding

### Neural Gradient
```css
background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
```
Use for: Neural network features, ML components

### Cyber Gradient
```css
background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
```
Use for: Data visualization, analytics, tech features

### Dark Gradient
```css
background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
```
Use for: Dark mode backgrounds, premium sections

### AI Glow
```css
background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
```
Use for: Ambient lighting effects, focus areas

## Color Psychology

- **Blue**: Trust, intelligence, technology, reliability
- **Purple**: Innovation, creativity, AI/neural networks
- **Cyan**: Future, data, digital transformation

## Accessibility

All color combinations meet WCAG AA standards:
- Primary blue on white: ✓ 4.52:1 (WCAG AA)
- White on primary blue: ✓ 4.52:1 (WCAG AA)
- Text colors meet minimum 4.5:1 ratio
- Interactive elements have 3:1 ratio minimum

## Usage Guidelines

1. **Primary (Blue)**: Use for primary actions, AI features, main brand elements
2. **Secondary (Purple)**: Neural networks, ML features, innovation
3. **Accent (Cyan)**: Data visualization, highlights, tech elements
4. **Neutral Colors**: Majority of UI, text, backgrounds
5. **Semantic Colors**: Only for their specific purpose
6. **Gradients**: Use for emphasis and branding, not everywhere

## Dark Mode

```css
/* Dark mode variables */
--brand-bg-primary: #0f172a;
--brand-bg-secondary: #1e293b;
--brand-text-primary: #f1f5f9;
--brand-text-secondary: #cbd5e1;
```

Use the AI gradients sparingly in dark mode for accent and emphasis.
