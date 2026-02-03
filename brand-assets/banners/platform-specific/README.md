# KBYG.ai Command Center - Platform-Specific Banners

**Brand:** KBYG.ai Command Center  
**Tagline:** "Intelligence Extraction for Revenue Teams"  
**Theme:** Conference/GTM intelligence, analytics dashboard aesthetic  
**Generated:** Using Google Imagen 3  
**Date:** January 2025

## Brand Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| Blue | `#3b82f6` | Primary brand color |
| Purple | `#8b5cf6` | Secondary accent |
| Cyan | `#06b6d4` | Tertiary highlight |

## Design Elements

- **Style:** Modern tech aesthetic with gradient backgrounds
- **Typography:** Bold, professional corporate tech branding
- **Visual Theme:** Abstract geometric patterns, network graphs, data visualization
- **Content:** "KBYG.ai Command Center" branding + "Intelligence Extraction for Revenue Teams" tagline
- **Aesthetic:** Conference and Go-To-Market intelligence dashboard

---

## Social Media Banners

Located in: `social/`

### LinkedIn Cover
- **File:** `linkedin_cover.png`
- **Dimensions:** 1584 × 396 px
- **Aspect Ratio:** 4:1
- **Format:** PNG
- **Use Case:** LinkedIn company page cover photo
- **Notes:** Optimized for desktop and mobile viewing. Safe zone in center 1000×200px for logo/text.

### Twitter/X Header
- **File:** `twitter_header.png`
- **Dimensions:** 1500 × 500 px
- **Aspect Ratio:** 3:1
- **Format:** PNG
- **Use Case:** Twitter/X profile header image
- **Notes:** Profile photo overlaps bottom-left corner. Keep important elements right or centered.

### Facebook Cover
- **File:** `facebook_cover.png`
- **Dimensions:** 820 × 312 px
- **Aspect Ratio:** ~2.63:1
- **Format:** PNG
- **Use Case:** Facebook business page cover photo
- **Notes:** Displays at 820×312 on desktop, 640×360 on mobile. Keep text centered.

### YouTube Banner
- **File:** `youtube_banner.png`
- **Dimensions:** 2560 × 1440 px
- **Aspect Ratio:** 16:9
- **Format:** PNG
- **Use Case:** YouTube channel banner/header
- **Notes:** Safe area for all devices: 1546×423px centered. Full image visible on TV.

---

## Website Banners

Located in: `website/`

### Hero Banner (Standard)
- **File:** `hero_banner.png`
- **Dimensions:** 1920 × 600 px
- **Aspect Ratio:** 3.2:1
- **Format:** PNG
- **Use Case:** Main website hero section, landing pages
- **Notes:** Standard full-width desktop hero. Optimize for above-the-fold content.

### Wide Hero Banner
- **File:** `wide_hero.png`
- **Dimensions:** 2560 × 800 px
- **Aspect Ratio:** 3.2:1
- **Format:** PNG
- **Use Case:** Ultra-wide monitors, premium landing pages, conference displays
- **Notes:** Designed for high-resolution displays and large screens.

### Mobile Banner
- **File:** `mobile_banner.png`
- **Dimensions:** 750 × 300 px
- **Aspect Ratio:** 2.5:1
- **Format:** PNG
- **Use Case:** Mobile-optimized hero sections, responsive web design
- **Notes:** Portrait-friendly layout. Works well on phones and tablets.

---

## Email Headers

Located in: `email/`

### Standard Email Header
- **File:** `standard_header.png`
- **Dimensions:** 600 × 200 px
- **Aspect Ratio:** 3:1
- **Format:** PNG
- **Use Case:** Email newsletters, standard email templates
- **Notes:** 600px is standard email width. Works across all email clients.

### Wide Email Header
- **File:** `wide_header.png`
- **Dimensions:** 800 × 200 px
- **Aspect Ratio:** 4:1
- **Format:** PNG
- **Use Case:** Wide email templates, promotional emails
- **Notes:** For modern email clients supporting wider layouts. May scale down on mobile.

---

## Technical Specifications

### File Format
- **Type:** PNG (Portable Network Graphics)
- **Compression:** Lossless
- **Color Space:** RGB
- **Transparency:** No (opaque backgrounds)

### Quality
- **Resolution:** High-quality output from Google Imagen 3
- **Resizing:** Post-processed with ImageMagick for exact dimensions
- **Color Accuracy:** Professional-grade color reproduction

### File Sizes
All files optimized for web use while maintaining visual quality:
- Social media: ~200-800 KB
- Website: ~500-1500 KB (larger due to higher resolution)
- Email: ~100-300 KB (optimized for email delivery)

---

## Usage Guidelines

### ✅ Recommended Uses
- Social media profiles and covers
- Website hero sections and headers
- Email marketing campaigns
- Conference/event presentations
- Digital marketing materials

### ⚠️ Important Notes
1. **Scaling:** Do not upscale images beyond their native resolution
2. **Cropping:** Maintain aspect ratios when resizing
3. **Compression:** If re-exporting, use high-quality PNG or JPEG (85%+)
4. **Safe Zones:** Each platform has specific safe zones - refer to individual specs above
5. **Testing:** Always preview banners on actual platforms before final deployment

### 📝 Platform-Specific Tips

**LinkedIn:**
- Profile photo overlaps bottom-left corner
- Displays differently on desktop vs. mobile
- Test with profile photo in place

**Twitter/X:**
- Profile picture covers lower-left area
- Recommended to keep text/branding in top-right or center-right

**Facebook:**
- Crops differently on mobile and desktop
- Keep critical content in center 640px width

**YouTube:**
- Different viewable areas on TV, desktop, tablet, mobile
- Use safe area guidelines from YouTube Creator Studio

**Email:**
- Some clients block images by default
- Include alt text for accessibility
- Test across major email clients (Gmail, Outlook, Apple Mail)

---

## Generation Details

### AI Model
- **Model:** Google Imagen 3 (imagen-3.0-generate-001)
- **Platform:** Vertex AI
- **Location:** us-central1
- **Safety:** Standard content filters enabled

### Generation Script
Available in workspace: `/Users/benfife/clawd-q/generate_banners.py`

To regenerate or create variations:
```bash
cd /Users/benfife/clawd-q
source .venv-banners/bin/activate
python3 generate_banners.py
```

---

## File Structure

```
platform-specific/
├── README.md                   # This file
├── social/
│   ├── linkedin_cover.png     # 1584×396
│   ├── twitter_header.png     # 1500×500
│   ├── facebook_cover.png     # 820×312
│   └── youtube_banner.png     # 2560×1440
├── website/
│   ├── hero_banner.png        # 1920×600
│   ├── wide_hero.png          # 2560×800
│   └── mobile_banner.png      # 750×300
└── email/
    ├── standard_header.png    # 600×200
    └── wide_header.png        # 800×200
```

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| Jan 2025 | 1.0 | Initial generation - all 9 platform-specific banners created |

---

## Contact & Support

For questions about these assets or to request custom sizes:
- **Brand:** KBYG.ai Command Center
- **Generated by:** AI automation system
- **Repository:** Google Drive → brand-assets/banners/platform-specific/

---

**Last Updated:** January 29, 2025
