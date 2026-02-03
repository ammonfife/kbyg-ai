# KBYG.ai Hero Images

**Generated:** 2025-01-08  
**Tool:** Google Imagen 3 via Vertex AI  
**Brand:** KBYG.ai Command Center

## Brand Positioning

**KBYG.ai Command Center** - Aggressive, tactical, revenue-focused intelligence extraction platform for conferences and trade shows.

## Brand Colors

- **GTM Blue**: `#3b82f6` - Primary brand color, represents intelligence and trust
- **Conference Purple**: `#8b5cf6` - Secondary accent, represents events and connections
- **Revenue Cyan**: `#06b6d4` - Tertiary accent, represents growth and opportunity

## Directory Structure

```
heroes/
├── desktop/     # 16:9 desktop hero images (1920x1080, 2560x1440)
├── tablet/      # 4:3 tablet hero images (1024x768, 2048x1536)
├── square/      # 1:1 square images for social (1080x1080, 2048x2048)
├── mobile/      # 9:16 vertical mobile heroes (1080x1920)
└── README.md    # This file
```

## Themes & Variations

### 1. Conference Intelligence Extraction
**Concept:** Capturing and processing business intelligence from live conference environments

**Variations:**
- `v1`: Modern conference center with holographic data streams
- `v2`: Aerial view of trade show with data networks
- `v3`: Close-up badge scanning with intelligence extraction

**Use cases:**
- Landing pages focused on conference intelligence
- Product pages explaining data capture
- Marketing materials for conference attendees

---

### 2. Trade Show GTM Focus
**Concept:** Go-to-market intelligence extraction at trade shows and exhibitions

**Variations:**
- `v1`: Epic wide shot of massive trade show with revenue tracking
- `v2`: Strategic bird's eye view with GTM opportunity zones
- `v3`: Dynamic booth moment with opportunity capture

**Use cases:**
- Sales enablement materials
- Trade show marketing campaigns
- GTM strategy presentations

---

### 3. Revenue Team in Action
**Concept:** Professional revenue teams leveraging conference intelligence

**Variations:**
- `v1`: Elite team in modern command center
- `v2`: Strategic planning session with tactical displays
- `v3`: Close-up of analyst examining intelligence data

**Use cases:**
- Customer testimonial pages
- Team/company culture content
- B2B marketing emphasizing human element

---

### 4. Command Center Dashboard
**Concept:** The KBYG.ai tactical intelligence dashboard interface

**Variations:**
- `v1`: Massive curved display wall with live intelligence
- `v2`: Futuristic multi-conference intelligence extraction
- `v3`: Close-up of tactical screen with GTM opportunities

**Use cases:**
- Product screenshots and mockups
- Dashboard feature announcements
- Demo and presentation backgrounds

---

## File Naming Convention

```
{theme}_v{variation}_{width}x{height}.png
```

**Examples:**
- `conference_intelligence_v1_1920x1080.png`
- `trade_show_gtm_v2_1080x1920.png`
- `revenue_team_v3_2048x2048.png`

---

## Usage Guidelines

### Desktop (16:9)
- **1920×1080**: Standard HD desktop hero, most website headers
- **2560×1440**: High-res desktop hero for retina displays and large screens

### Tablet (4:3)
- **1024×768**: Standard tablet hero, responsive layouts
- **2048×1536**: Retina tablet hero for iPad Pro and high-DPI devices

### Square (1:1)
- **1080×1080**: Instagram posts, square social media cards
- **2048×2048**: High-res social media, LinkedIn featured images

### Mobile (9:16)
- **1080×1920**: Mobile hero images, stories, vertical video backgrounds

---

## Responsive Implementation

### Recommended HTML Picture Element

```html
<picture>
  <source 
    media="(orientation: portrait)" 
    srcset="/heroes/mobile/conference_intelligence_v1_1080x1920.png"
  />
  <source 
    media="(min-width: 1920px)" 
    srcset="/heroes/desktop/conference_intelligence_v1_2560x1440.png"
  />
  <source 
    media="(min-width: 768px) and (max-width: 1919px)" 
    srcset="/heroes/desktop/conference_intelligence_v1_1920x1080.png"
  />
  <img 
    src="/heroes/tablet/conference_intelligence_v1_1024x768.png" 
    alt="KBYG.ai Conference Intelligence"
  />
</picture>
```

### CSS Background Images

```css
.hero {
  background-image: url('/heroes/desktop/conference_intelligence_v1_1920x1080.png');
  background-size: cover;
  background-position: center;
}

@media (min-width: 1920px) {
  .hero {
    background-image: url('/heroes/desktop/conference_intelligence_v1_2560x1440.png');
  }
}

@media (orientation: portrait) {
  .hero {
    background-image: url('/heroes/mobile/conference_intelligence_v1_1080x1920.png');
  }
}
```

---

## Image Optimization

All images are generated as PNG files for maximum quality. For production use:

1. **WebP Conversion**: Convert to WebP for ~30% file size reduction
   ```bash
   cwebp -q 85 input.png -o output.webp
   ```

2. **AVIF Conversion**: Convert to AVIF for ~50% file size reduction (modern browsers)
   ```bash
   avifenc -s 0 input.png output.avif
   ```

3. **Serve Multiple Formats**: Use `<picture>` with format fallbacks
   ```html
   <picture>
     <source srcset="hero.avif" type="image/avif" />
     <source srcset="hero.webp" type="image/webp" />
     <img src="hero.png" alt="Hero" />
   </picture>
   ```

---

## Brand Consistency

### Visual Elements
- All images feature dominant brand colors (blue, purple, cyan)
- Tactical/command center aesthetic throughout
- Professional business context (conferences, teams, technology)
- Futuristic but credible technology visualization

### Tone & Mood
- **Aggressive**: Bold, confident, action-oriented
- **Tactical**: Strategic, data-driven, military-inspired precision
- **Revenue-focused**: Bottom-line results, GTM success, opportunity capture

### Typography Pairing
When overlaying text on these heroes, use:
- **Headings**: Inter Bold/Black, Montserrat Bold, or similar modern sans-serif
- **Body**: Inter Regular/Medium
- **Accent**: Monospace for data/metrics (Fira Code, JetBrains Mono)

### Text Overlay Guidelines
```css
.hero-text {
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
}

.hero-overlay {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1),
    rgba(139, 92, 246, 0.1)
  );
}
```

---

## Generation Details

**Model**: Google Imagen 3  
**API**: Vertex AI Image Generation  
**Project**: heimdall-8675309  
**Region**: us-central1  
**Safety Settings**: block_few (minimal filtering for professional content)  
**Person Generation**: allow_adult (professional business people)

---

## License & Usage

These images are proprietary assets for **KBYG.ai** brand and marketing use only.

- ✅ **Permitted**: KBYG.ai websites, marketing materials, presentations, social media
- ❌ **Prohibited**: Redistribution, resale, use by competitors, stock photo sites

For questions about usage rights, contact the KBYG.ai marketing team.

---

**Questions or need custom sizes?** Regenerate using the generation script or contact the design team.
