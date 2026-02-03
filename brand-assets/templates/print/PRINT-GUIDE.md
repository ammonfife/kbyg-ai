# Print-Ready Materials Guide

This guide covers how to export and print all kbyg.ai marketing materials for professional use.

## 📋 Contents

1. [Business Cards](#business-cards)
2. [Letterhead](#letterhead)
3. [One-Pager Flyer](#one-pager-flyer)
4. [Poster (24x36")](#poster-24x36)
5. [Export Instructions](#export-instructions)
6. [Print Specifications](#print-specifications)
7. [Customization Guide](#customization-guide)

---

## Business Cards

**File:** `business-card.html`  
**Dimensions:** 3.5 × 2 inches  
**Format:** Front & Back (2 pages)

### Design Features
- **Front:** Dark gradient background with logo, tagline, and contact info
- **Back:** White background with personal details and QR code placeholder
- **Colors:** AI Blue (#3b82f6), Neural Purple (#8b5cf6), Cyber Cyan (#06b6d4)

### Customization Steps
1. Open `business-card.html` in a text editor
2. Replace placeholders on the back:
   - `[Your Name]` → Your full name
   - `[Your Title]` → Your job title
   - `[email@kbyg.ai]` → Your email address
   - `[+1 (XXX) XXX-XXXX]` → Your phone number
   - `[/in/yourprofile]` → Your LinkedIn handle
3. Generate a QR code linking to your contact page (use [QRCode Monkey](https://www.qrcode-monkey.com/))
4. Replace the QR placeholder with actual QR code image

### Print Specifications
- **Paper:** 16pt C2S (Coated 2 Sides) cardstock
- **Finish:** Matte or UV gloss coating
- **Bleed:** Add 0.125" bleed on all sides
- **Quantity:** Minimum 250 cards recommended
- **Print Method:** Digital or offset printing

---

## Letterhead

**File:** `letterhead.html`  
**Dimensions:** 8.5 × 11 inches (US Letter)

### Design Features
- Professional header with logo and company info
- Gradient accent line separating header
- Clean content area for letters
- Footer with links and social media

### Customization Steps
1. Update company address in the header contact section
2. Customize footer links
3. Replace placeholder text with your letter content
4. Update signature section with your name and title

### Print Specifications
- **Paper:** 24lb or 28lb premium white bond paper
- **Finish:** Uncoated for writing
- **Print Method:** Laser or offset printing
- **Quantity:** 500-1000 sheets recommended
- **Alternative:** Use as digital template for PDF letters

---

## One-Pager Flyer

**File:** `one-pager-flyer.html`  
**Dimensions:** 8.5 × 11 inches

### Design Features
- Eye-catching hero section with AI imagery
- 3-column feature grid
- Benefits section with icons
- Strong call-to-action footer
- QR code for quick website access

### Customization Steps
1. Replace AI-generated image path in hero section if needed
2. Update feature descriptions to match your offering
3. Customize benefits based on your use case
4. Update contact information in CTA section
5. Generate QR code linking to kbyg.ai and replace placeholder

### Print Specifications
- **Paper:** 100lb gloss text or 80lb gloss cover
- **Finish:** High-gloss coating for vibrant colors
- **Bleed:** Add 0.125" bleed on all sides
- **Print Method:** Digital for small runs, offset for 500+
- **Usage:** Trade shows, conferences, direct mail

---

## Poster (24×36")

**File:** `poster-24x36.html`  
**Dimensions:** 24 × 36 inches

### Design Features
- Large-format design optimized for visibility
- Bold typography with 140px main headline
- Grid of features with glassmorphic cards
- Statistics section highlighting key metrics
- Prominent CTA buttons
- QR code for engagement

### Customization Steps
1. Update statistics in the stats grid
2. Customize feature descriptions
3. Replace contact information
4. Generate large-format QR code (high resolution)
5. Consider adding actual product screenshots if available

### Print Specifications
- **Paper:** 10mil poster paper or vinyl banner material
- **Finish:** Matte for indoor, laminated for durability
- **Resolution:** 150 DPI minimum at full size
- **Mount:** Foam board backing for trade shows
- **Print Method:** Large-format inkjet or digital printing
- **Usage:** Trade shows, office displays, events

---

## Export Instructions

### Method 1: Print to PDF (Recommended)

#### Using Chrome/Edge:
1. Open the HTML file in Chrome or Edge browser
2. Press `Cmd+P` (Mac) or `Ctrl+P` (Windows)
3. **Destination:** Save as PDF
4. **Paper size:** 
   - Business cards: Custom 3.5 × 2 inches
   - Letterhead/Flyer: Letter (8.5 × 11 inches)
   - Poster: Custom 24 × 36 inches
5. **Margins:** None
6. **Scale:** 100%
7. **Options:** 
   - ✅ Background graphics
   - ✅ Headers and footers (OFF)
8. Click **Save** and name your PDF

#### Using Firefox:
1. Open HTML file in Firefox
2. Press `Cmd+P` (Mac) or `Ctrl+P` (Windows)
3. Choose **Print to PDF**
4. Set paper size and margins (as above)
5. Click **Save**

### Method 2: Screenshot for Quick Preview

For quick previews (not print-ready):
1. Open HTML file in browser
2. Use browser screenshot tools
3. Export as PNG at 300 DPI

### Method 3: Professional Export

For the highest quality:

#### Using Puppeteer (Node.js):
```bash
npm install puppeteer

# Create export script
node export-print.js
```

**export-print.js:**
```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Business Card
  await page.goto('file:///path/to/business-card.html');
  await page.pdf({
    path: 'business-card.pdf',
    width: '3.5in',
    height: '2in',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  // Letterhead
  await page.goto('file:///path/to/letterhead.html');
  await page.pdf({
    path: 'letterhead.pdf',
    format: 'Letter',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  // Flyer
  await page.goto('file:///path/to/one-pager-flyer.html');
  await page.pdf({
    path: 'flyer.pdf',
    format: 'Letter',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  // Poster
  await page.goto('file:///path/to/poster-24x36.html');
  await page.pdf({
    path: 'poster.pdf',
    width: '24in',
    height: '36in',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  await browser.close();
})();
```

---

## Print Specifications

### Color Management

**RGB to CMYK Conversion:**
- AI Blue (#3b82f6) → C:76 M:48 Y:0 K:0
- Neural Purple (#8b5cf6) → C:45 M:63 Y:0 K:0
- Cyber Cyan (#06b6d4) → C:83 M:0 Y:18 K:0

**Color Profile:** Use Adobe RGB (1998) or sRGB for web-to-print

### Resolution Guidelines

| Material | Screen | Print PDF | High-Res Export |
|----------|--------|-----------|-----------------|
| Business Card | 72 DPI | 300 DPI | 600 DPI |
| Letterhead | 72 DPI | 300 DPI | 300 DPI |
| Flyer | 72 DPI | 300 DPI | 300 DPI |
| Poster | 72 DPI | 150 DPI | 300 DPI |

### Bleed & Safe Zone

**Bleed:** Extra area beyond the cut line
- Business cards: 0.125" (3.175mm)
- Flyers: 0.125" (3.175mm)
- Posters: 0.25" (6.35mm)

**Safe Zone:** Keep important content inside
- Business cards: 0.25" from edge
- Flyers: 0.375" from edge
- Posters: 0.5" from edge

---

## Customization Guide

### Updating Brand Colors

All materials use CSS variables for easy color updates:

```css
:root {
  --ai-blue: #3b82f6;
  --neural-purple: #8b5cf6;
  --cyber-cyan: #06b6d4;
  --dark-bg: #0f172a;
  --slate: #1e293b;
}
```

To change colors, update these values in the `<style>` section of each HTML file.

### Changing Fonts

All materials use Inter font (loaded from Google Fonts). To change:

1. Update the Google Fonts link:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;600;700;800&display=swap" rel="stylesheet">
```

2. Update font-family in CSS:
```css
font-family: 'YourFont', sans-serif;
```

### Adding Logos

Replace text logo with SVG or PNG:

1. Save logo to brand-assets/logos/
2. Update HTML:
```html
<img src="../../logos/logo-primary.svg" alt="kbyg.ai" class="logo">
```

### Inserting Real Images

Replace placeholders with actual images:

1. Save images to brand-assets/images/
2. Update image paths in HTML:
```html
<img src="../../images/your-image.png" alt="Description">
```

For background images:
```css
background: url('../../images/your-image.png') center/cover;
```

---

## QR Code Generation

### Recommended Tools

1. **QRCode Monkey** (https://www.qrcode-monkey.com/)
   - Free, high-resolution
   - Custom colors and logo embedding
   - Export up to 3000px

2. **QR Code Generator** (https://www.qr-code-generator.com/)
   - Professional features
   - Dynamic QR codes (editable URLs)

3. **Command Line (qrencode):**
```bash
# Install
brew install qrencode

# Generate
qrencode -o qr-kbyg.png -s 10 "https://kbyg.ai"
```

### QR Code Specifications

| Material | Size | Resolution | Format |
|----------|------|------------|--------|
| Business Card | 0.8" × 0.8" | 300 DPI | PNG |
| Flyer | 1" × 1" | 300 DPI | PNG |
| Poster | 3" × 3" | 300 DPI | PNG/SVG |

**Best Practices:**
- Use high contrast (black on white)
- Test scanning from 2-3 feet away
- Include kbyg.ai branding colors if supported
- Link to specific landing pages for tracking

---

## Recommended Print Vendors

### Business Cards
- **Moo.com** - Premium quality, eco options
- **VistaPrint** - Affordable, fast turnaround
- **Jukebox Print** - Luxury finishes

### Letterhead & Flyers
- **PrintPlace** - Good for bulk orders
- **Overnight Prints** - Fast delivery
- **UPrinting** - Professional quality

### Posters
- **Vistaprint** - Standard sizes
- **Printful** - Print-on-demand
- **Signs.com** - Large format specialists

### Local Options
- Check local print shops for same-day service
- Request sample prints before large orders
- Ask for color proof/mockup

---

## File Checklist Before Printing

- [ ] All placeholder text updated
- [ ] Contact information correct
- [ ] QR codes generated and inserted
- [ ] Images high-resolution (300 DPI minimum)
- [ ] Colors checked in print preview
- [ ] Fonts embedded or converted to outlines
- [ ] Bleed added if required
- [ ] PDF exported at correct size
- [ ] Proofread for typos
- [ ] Test print on home/office printer

---

## Troubleshooting

### Problem: Colors look different in PDF
**Solution:** 
- Ensure "Background graphics" is enabled
- Use Chrome/Edge for best color accuracy
- Export at 300 DPI minimum

### Problem: Fonts don't match
**Solution:**
- Check internet connection (Google Fonts must load)
- Use fallback fonts: `-apple-system, BlinkMacSystemFont, sans-serif`
- Download and install Inter font locally

### Problem: Images missing in PDF
**Solution:**
- Use relative paths: `../../images/file.png`
- Ensure images exist in brand-assets folder
- Check file permissions

### Problem: PDF file size too large
**Solution:**
- Compress images before embedding
- Use PNG for graphics, JPEG for photos
- Reduce DPI to 300 for print (not higher)

### Problem: Print colors too dark/light
**Solution:**
- Calibrate monitor
- Request color proof from printer
- Convert RGB to CMYK using professional tools

---

## Support

For questions or issues with print materials:

**Email:** hello@kbyg.ai  
**Documentation:** kbyg.ai/brand  
**Design Assets:** This folder (`brand-assets/templates/print/`)

---

## Version History

- **v1.0** (2025-02-03) - Initial print materials created
  - Business card template
  - Letterhead template
  - One-pager flyer
  - 24×36" poster

---

**Last Updated:** February 3, 2025  
**Maintained By:** kbyg.ai Design Team
