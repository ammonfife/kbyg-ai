# KBYG.ai Command Center Presentation Template - Usage Guide

## 📋 Overview

This HTML-based presentation template uses **Reveal.js** to create professional, interactive presentations for **KBYG.ai Command Center - Intelligence Extraction for Revenue Teams**. The template features aggressive, revenue-focused messaging with your brand colors, multiple slide layouts, and integration with your AI-generated image library.

**KBYG.ai Product**: Intelligence extraction platform for trade shows and conferences. Extracts every high-value prospect, generates pre-qualified openers, and builds permanent sales assets. Know Before You Go.

---

## 🎨 Brand Colors

The template uses the following kbyg.ai brand colors:

- **AI Blue**: `#3b82f6` - Primary brand color
- **Neural Purple**: `#8b5cf6` - Secondary accent
- **Cyber Cyan**: `#06b6d4` - Tertiary highlight
- **Dark Background**: `#0f172a` - Main background
- **Light Text**: `#f8fafc` - Text color

---

## 🚀 Quick Start

### 1. Open the Template

Simply open `presentation-template.html` in any modern web browser:
- **Chrome** (recommended)
- **Firefox**
- **Safari**
- **Edge**

### 2. Present

- **Fullscreen**: Press `F` or `F11`
- **Navigate**: Use arrow keys (←/→ or ↑/↓)
- **Overview**: Press `ESC` or `O` to see all slides
- **Speaker Notes**: Press `S` (if you add notes)

### 3. Customize

Edit the HTML file in any text editor to customize content.

---

## 📐 Slide Types & How to Use Them

### 1️⃣ Title Slide

**Purpose**: Opening slide with presentation title and presenter info

```html
<section class="title-slide">
    <h1 class="logo">KBYG.ai Command Center</h1>
    <p class="tagline">Know Before You Go</p>
    <h3>Intelligence Extraction for Revenue Teams</h3>
    <p class="presenter">Your Name | Conference Name | Date</p>
</section>
```

**Customize**:
- Change `<h3>` for your specific pitch/presentation title
- Update `<p class="presenter">` with your name, event name, and date
- Keep the tagline as "Know Before You Go" for brand consistency

---

### 2️⃣ Section Divider

**Purpose**: Break presentation into major sections

```html
<section class="section-divider">
    <div>
        <p class="section-number">01</p>
        <h2>Introduction</h2>
    </div>
</section>
```

**Customize**:
- Change section number (01, 02, 03, etc.)
- Update section title
- Features full-gradient background for visual impact

---

### 3️⃣ Content Slide (Bullet Points)

**Purpose**: Standard content with title and bullet points

```html
<section class="content-slide">
    <h2>Deep-Tier Intelligence Extraction</h2>
    <ul>
        <li class="fragment">< 15s <span class="highlight">URL to Intelligence</span> - instant extraction</li>
        <li class="fragment"><span class="highlight">Pre-qualified ranking</span> - sorted by close probability</li>
        <li class="fragment"><span class="highlight">Revenue signal detection</span> - funding, tech stack, buying signals</li>
        <li class="fragment"><span class="highlight">100% Data Persistence</span> - permanent sales asset</li>
    </ul>
</section>
```

**Tips**:
- Use `class="fragment"` on `<li>` items to animate them one-by-one
- Use `<span class="highlight">` to emphasize keywords in cyan (intelligence extraction, revenue-ready, weaponized, etc.)
- Keep to 3-5 bullet points per slide
- Focus on aggressive revenue extraction and tactical intelligence benefits

---

### 4️⃣ Two-Column Layout

**Purpose**: Split content - text and image, or text and text

```html
<section class="content-slide">
    <h2>AI-Powered Innovation</h2>
    <div class="two-column">
        <div>
            <ul>
                <li>Neural network architecture</li>
                <li>Real-time data processing</li>
            </ul>
        </div>
        <div>
            <img src="../images/ai-generated/abstract/neural-network.png" alt="Neural Network">
        </div>
    </div>
</section>
```

**Image Paths**: Use relative paths from the templates folder:
- `../images/ai-generated/abstract/neural-network.png`
- `../images/ai-generated/heroes/hero-ai-network.png`
- `../images/ai-generated/products/dashboard-laptop.png`

---

### 5️⃣ Image Slide

**Purpose**: Full-screen image with caption

```html
<section class="image-slide bg-gradient-blue">
    <img src="../images/ai-generated/heroes/hero-ai-network.png" alt="AI Network">
    <p class="caption">Connected Intelligence</p>
</section>
```

**Background Options**:
- `bg-gradient-blue` - Blue/cyan gradient overlay
- `bg-gradient-purple` - Purple/blue gradient overlay
- No class - Plain dark background

---

### 6️⃣ Stats/Numbers Slide

**Purpose**: Display key metrics or statistics

```html
<section class="content-slide">
    <h2>From Event Page to Pipeline in Minutes</h2>
    <div class="stats-grid">
        <div class="stat-box fragment">
            <div class="number">&lt; 15s</div>
            <div class="label">URL to Intelligence</div>
        </div>
        <div class="stat-box fragment">
            <div class="number">100%</div>
            <div class="label">Data Persistence</div>
        </div>
        <div class="stat-box fragment">
            <div class="number">0</div>
            <div class="label">Manual Research</div>
        </div>
    </div>
</section>
```

**Tips**:
- Grid automatically handles 3 columns
- Use `fragment` class for staggered animation
- Keep numbers short and impactful
- Focus on speed, efficiency, and automation metrics

---

### 7️⃣ Closing Slide

**Purpose**: Final slide with call-to-action

```html
<section class="closing-slide">
    <h2>Know Before You Go</h2>
    <p class="contact">hello@kbyg.ai | www.kbyg.ai</p>
    <a href="https://kbyg.ai/demo" class="cta-button">Start Extracting Intelligence</a>
</section>
```

**Customize**:
- Change heading for your closing message (e.g., "Extract Every High-Value Prospect", "Know Before You Go")
- Update contact info if needed
- Modify CTA button text ("Start Extracting Intelligence", "Get Started", "Deploy Command Center")

---

## 🖼️ Available AI-Generated Images

### Abstract Concepts
- `../images/ai-generated/abstract/neural-network.png`
- `../images/ai-generated/abstract/digital-transformation.png`
- `../images/ai-generated/abstract/innovation-concept.png`

### Hero Images
- `../images/ai-generated/heroes/hero-ai-network.png`
- `../images/ai-generated/heroes/hero-data-viz.png`

### Products
- `../images/ai-generated/products/dashboard-laptop.png`
- `../images/ai-generated/products/mobile-app.png`

### Content
- `../images/ai-generated/content/blog-header.png`

### Social
- `../images/ai-generated/social/social-banner.png`
- `../images/ai-generated/social/instagram-background.png`

### Team
- `../images/ai-generated/team/customer-success.png`
- `../images/ai-generated/team/team-collaboration.png`

---

## ⌨️ Keyboard Controls

| Key | Action |
|-----|--------|
| **→ / ↓** | Next slide |
| **← / ↑** | Previous slide |
| **F / F11** | Fullscreen mode |
| **ESC / O** | Overview mode (see all slides) |
| **S** | Speaker notes (if added) |
| **B / .** | Pause/blackout |
| **Home** | First slide |
| **End** | Last slide |

---

## 🎯 Creating New Slides

### Add a New Content Slide

1. Find the `<!-- Blank Template Slides -->` section in the HTML
2. Copy this template:

```html
<section class="content-slide">
    <h2>Your Slide Title</h2>
    <ul>
        <li>Point 1</li>
        <li>Point 2</li>
        <li>Point 3</li>
    </ul>
</section>
```

3. Paste it where you want it in the presentation
4. Customize the content

### Add Fragments (Animations)

Add `class="fragment"` to any element to make it animate in:

```html
<li class="fragment">This will fade in</li>
<p class="fragment">This too!</p>
```

### Add Custom Content

You can add any HTML inside a `<section>`:
- Tables
- Videos (`<video>` tag)
- iframes
- Custom styled divs

---

## 🎨 Customization Tips

### Change Colors

Edit the CSS variables in the `<style>` section:

```css
:root {
    --ai-blue: #3b82f6;
    --neural-purple: #8b5cf6;
    --cyber-cyan: #06b6d4;
}
```

### Adjust Font Sizes

Modify font sizes in the CSS:

```css
.reveal h1 {
    font-size: 3.5em; /* Make larger or smaller */
}
```

### Change Transitions

In the JavaScript configuration at the bottom:

```javascript
transition: 'slide', // Options: none/fade/slide/convex/concave/zoom
```

---

## 📤 Exporting & Sharing

### Option 1: Share HTML File
Simply send the `presentation-template.html` file. It works offline and doesn't need installation.

### Option 2: Host Online
Upload to:
- GitHub Pages
- Netlify
- Your own web server

### Option 3: Export to PDF
1. Open in Chrome
2. Add `?print-pdf` to the URL
   - Example: `file:///path/to/presentation-template.html?print-pdf`
3. Print to PDF (Ctrl/Cmd + P)
4. Set orientation to Landscape

---

## 🔧 Advanced Configuration

### Reveal.js Settings

At the bottom of the HTML file, you can customize:

```javascript
Reveal.initialize({
    controls: true,        // Show arrow controls
    progress: true,        // Show progress bar
    slideNumber: true,     // Show slide numbers
    autoSlide: 0,          // Auto-advance (0 = off, or milliseconds)
    loop: false,           // Loop presentation
    transition: 'slide',   // Transition effect
    // ... more options
});
```

### Add Speaker Notes

```html
<section>
    <h2>Your Slide</h2>
    <p>Visible content</p>
    <aside class="notes">
        These notes are only visible in speaker view (press 'S')
    </aside>
</section>
```

---

## 🐛 Troubleshooting

### Images Not Loading

**Issue**: Images show broken icons

**Solution**: 
- Check that image paths are correct relative to the HTML file
- The template file is in `/templates/` so use `../images/ai-generated/...`
- Verify image files exist in the brand-assets folder

### Animations Not Working

**Issue**: Fragments don't animate

**Solution**:
- Ensure you have internet connection (for Reveal.js CDN)
- Check browser console for errors (F12)
- Make sure `class="fragment"` is spelled correctly

### Presentation Not Advancing

**Issue**: Arrow keys don't work

**Solution**:
- Click on the presentation first to focus it
- Try pressing ESC to exit any stuck state
- Refresh the browser

---

## 📚 Resources

### Reveal.js Documentation
- **Official Docs**: https://revealjs.com/
- **Examples**: https://revealjs.com/demo/
- **GitHub**: https://github.com/hakimel/reveal.js

### Design Tips
- Keep slides simple (less is more)
- Use high-contrast text
- Limit text per slide (6-7 lines max)
- Use visuals to support your message
- Practice with speaker notes

---

## 🎯 Intelligence Extraction Presentation Tips

### Common Scenarios

**Sales Kickoff / Team Training**
- Lead with "Your Next Trade Show Shouldn't Be a Gamble"
- Emphasize < 15s extraction speed and 0 manual research
- Show weaponized conversation openers in action
- Demo mobile command center for on-floor deployment

**Marketing to Revenue Teams**
- Lead with "The Problem" - blind prospecting wastes budget
- Focus on pre-qualified target mapping
- Emphasize permanent sales asset (100% data persistence)
- End with aggressive CTA: "Start Extracting Intelligence"

**Trade Show Booth Presentation**
- Keep it short (5-7 slides max)
- Lead with stats: "< 15s URL to Intelligence"
- Show intelligence extraction dashboard immediately
- Focus on revenue extraction, not networking
- Quick demo deployment ready

**Investor Pitch**
- Highlight revenue attribution tracking
- Show differentiation: deep-tier extraction vs. surface-level apps
- Focus on permanent sales asset creation
- Include pipeline-to-close metrics

### Key Messages to Emphasize

- **Deep-tier intelligence extraction** (not surface-level event apps)
- **Pre-qualified target mapping** (ranked by revenue potential)
- **Weaponized conversation openers** (tactical, personalized)
- **100% data persistence** (permanent sales asset)
- **Revenue-ready outreach** (automated deployment)
- **< 15s extraction speed** (URL to intelligence instantly)

## 💡 Best Practices

### Content
✅ **Do**:
- One main idea per slide
- Use aggressive, revenue-focused language
- Keep bullet points tactical and concise
- Use brand colors for emphasis
- Focus on intelligence extraction and revenue benefits
- Include hard metrics: < 15s, 100%, 0 manual research
- Use tactical terms: "weaponized," "extraction," "deployment"

❌ **Don't**:
- Use soft messaging like "transform" or "enhance"
- Say "Conference Intelligence Platform" - it's "Intelligence Extraction for Revenue Teams"
- Talk about "networking" - focus on revenue extraction
- Use generic "AI" - be specific about extraction capabilities
- Ignore white space
- Soften the aggressive tone - revenue teams want tactical language

### Presenting
- Test presentation beforehand
- Know your keyboard shortcuts
- Have a backup (PDF export)
- Use presenter mode (speaker notes)
- **Have live demo ready** - show < 15s extraction in real-time
- Prepare trade show-specific examples
- Use aggressive, confident delivery style
- Focus on ROI and revenue attribution

---

## 📞 Support

For questions about kbyg.ai brand guidelines or template customization:
- **Email**: hello@kbyg.ai
- **Website**: www.kbyg.ai

---

**Version**: 1.0  
**Last Updated**: February 2025  
**Template**: presentation-template.html  
**Created for**: kbyg.ai
