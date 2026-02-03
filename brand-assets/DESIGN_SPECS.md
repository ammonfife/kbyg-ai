# Design Specifications

## Color System

### Primary Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Primary | `#2563eb` | `37, 99, 235` | CTAs, links, primary actions |
| Primary Light | `#60a5fa` | `96, 165, 250` | Hover states, light accents |
| Primary Dark | `#1e40af` | `30, 64, 175` | Active states, dark text |

### Secondary Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Secondary | `#7c3aed` | `124, 58, 237` | Secondary actions, accents |
| Secondary Light | `#a78bfa` | `167, 139, 250` | Highlights, badges |
| Secondary Dark | `#5b21b6` | `91, 33, 182` | Deep accents |

### Accent Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Accent | `#f59e0b` | `245, 158, 11` | Warnings, highlights |
| Accent Light | `#fbbf24` | `251, 191, 36` | Subtle highlights |
| Accent Dark | `#d97706` | `217, 119, 6` | Strong emphasis |

### Neutral Scale
| Shade | Hex | RGB |
|-------|-----|-----|
| 50 | `#f9fafb` | `249, 250, 251` |
| 100 | `#f3f4f6` | `243, 244, 246` |
| 200 | `#e5e7eb` | `229, 231, 235` |
| 300 | `#d1d5db` | `209, 213, 219` |
| 400 | `#9ca3af` | `156, 163, 175` |
| 500 | `#6b7280` | `107, 114, 128` |
| 600 | `#4b5563` | `75, 85, 99` |
| 700 | `#374151` | `55, 65, 81` |
| 800 | `#1f2937` | `31, 41, 55` |
| 900 | `#111827` | `17, 24, 39` |

### Semantic Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Success | `#10b981` | `16, 185, 129` | Success states |
| Warning | `#f59e0b` | `245, 158, 11` | Warnings, alerts |
| Error | `#ef4444` | `239, 68, 68` | Errors, destructive |
| Info | `#3b82f6` | `59, 130, 246` | Information |

## Typography

### Font Families
| Type | Font | Weight | Usage |
|------|------|--------|-------|
| Primary | Inter | 400, 500, 600, 700, 800 | Body, UI |
| Heading | Poppins | 400, 500, 600, 700, 800 | Headings |
| Monospace | Courier New | 400 | Code |

### Type Scale
| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| xs | 12px (0.75rem) | 16px | Labels, captions |
| sm | 14px (0.875rem) | 20px | Small text |
| base | 16px (1rem) | 24px | Body text |
| lg | 18px (1.125rem) | 28px | Large body |
| xl | 20px (1.25rem) | 28px | Subheadings |
| 2xl | 24px (1.5rem) | 32px | Section titles |
| 3xl | 30px (1.875rem) | 36px | Page titles |
| 4xl | 36px (2.25rem) | 40px | Display |
| 5xl | 48px (3rem) | 1 | Hero headings |
| 6xl | 60px (3.75rem) | 1 | Large displays |

### Font Weights
| Name | Value |
|------|-------|
| Normal | 400 |
| Medium | 500 |
| Semibold | 600 |
| Bold | 700 |
| Extrabold | 800 |

### Line Heights
| Name | Value | Usage |
|------|-------|-------|
| Tight | 1.25 | Headings |
| Normal | 1.5 | Body text |
| Relaxed | 1.75 | Long-form content |
| Loose | 2 | Special formatting |

## Spacing System

### Scale (4px base)
| Name | Size | Pixels | Usage |
|------|------|--------|-------|
| 0 | 0rem | 0px | Reset |
| 1 | 0.25rem | 4px | Tiny gaps |
| 2 | 0.5rem | 8px | Small spacing |
| 3 | 0.75rem | 12px | Compact elements |
| 4 | 1rem | 16px | Default spacing |
| 5 | 1.25rem | 20px | Medium spacing |
| 6 | 1.5rem | 24px | Section spacing |
| 8 | 2rem | 32px | Large spacing |
| 10 | 2.5rem | 40px | Component gaps |
| 12 | 3rem | 48px | Section gaps |
| 16 | 4rem | 64px | Large sections |
| 20 | 5rem | 80px | Page sections |

## Border Radius

| Name | Size | Pixels | Usage |
|------|------|--------|-------|
| None | 0 | 0px | Square corners |
| sm | 0.375rem | 6px | Small elements |
| base | 0.5rem | 8px | Default |
| md | 0.5rem | 8px | Default alias |
| lg | 0.75rem | 12px | Cards, containers |
| xl | 1rem | 16px | Large containers |
| 2xl | 1.25rem | 20px | Modals, panels |
| full | 9999px | ∞ | Pills, circles |

## Shadows

### Elevation Scale
```css
/* Level 1 - Subtle */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

/* Level 2 - Card */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

/* Level 3 - Elevated */
box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);

/* Level 4 - Modal */
box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
```

### Brand Shadows
```css
/* Primary glow */
box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);

/* Secondary glow */
box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
```

## Component Specifications

### Buttons

#### Sizes
| Size | Padding | Font Size | Height |
|------|---------|-----------|--------|
| sm | 8px 16px | 14px | 32px |
| base | 12px 24px | 16px | 44px |
| lg | 16px 32px | 18px | 52px |
| xl | 20px 40px | 20px | 60px |

#### States
- **Default**: Base color
- **Hover**: Darker shade + transform(-1px) + shadow
- **Active**: Transform(0)
- **Disabled**: 50% opacity
- **Loading**: Spinner animation

### Cards

#### Padding
- **Header**: 24px
- **Body**: 24px
- **Footer**: 24px

#### Borders
- **Default**: 1px solid gray-200
- **Radius**: 12px (0.75rem)

### Input Fields

#### Sizes
| Size | Padding | Font Size | Height |
|------|---------|-----------|--------|
| sm | 8px 12px | 14px | 32px |
| base | 10px 14px | 16px | 40px |
| lg | 12px 16px | 18px | 48px |

#### States
- **Default**: Border gray-300
- **Focus**: Border primary + ring
- **Error**: Border error + ring
- **Disabled**: Background gray-100

## Logo Specifications

### Sizes
| Context | Min Width | Recommended |
|---------|-----------|-------------|
| Website Header | 120px | 180px |
| Favicon | 16px | 32px |
| Social Profile | 200px | 400px |
| Print | 1 inch | 2 inches |

### Clear Space
- Minimum clear space: Height of the icon
- Don't place other elements within this area

### Variations
- **Primary**: Color on light backgrounds
- **White**: On dark backgrounds (700-900)
- **Icon Only**: Small spaces, app icons

## Grid System

### Breakpoints
| Name | Width | Columns |
|------|-------|---------|
| Mobile | < 640px | 4 |
| Tablet | 640px - 1023px | 8 |
| Desktop | 1024px - 1279px | 12 |
| Wide | ≥ 1280px | 12 |

### Containers
| Breakpoint | Max Width |
|------------|-----------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |

### Gutters
- Mobile: 16px
- Tablet+: 24px

## Animation

### Timing
| Name | Duration | Easing |
|------|----------|--------|
| Fast | 150ms | ease-out |
| Base | 200ms | ease-in-out |
| Slow | 300ms | ease-in-out |

### Common Transitions
```css
transition: all 0.2s ease;           /* Default */
transition: transform 0.2s ease;     /* Movement */
transition: opacity 0.2s ease;       /* Fade */
transition: background 0.2s ease;    /* Color */
```

## Accessibility

### Contrast Ratios (WCAG AA)
- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum
- **UI components**: 3:1 minimum

### Touch Targets
- **Minimum size**: 44x44px
- **Recommended**: 48x48px

### Focus States
- All interactive elements must have visible focus
- Focus ring: 2px primary color, 2px offset

---

**Version**: 1.0  
**Last Updated**: 2024  
**Format**: Design handoff specification
