# kbyg.ai Social Media Templates - Usage Guide

## 📋 Overview

This directory contains 4 professional HTML/CSS templates for creating branded social media content for kbyg.ai. All templates use the official brand colors, Inter font, and are optimized for their respective platforms.

## 📁 Templates Included

| Template | Dimensions | Platform | File |
|----------|-----------|----------|------|
| Instagram Post | 1080×1080 | Instagram Feed | `instagram-post.html` |
| Twitter/X Card | 1200×675 | Twitter/X | `twitter-card.html` |
| LinkedIn Post | 1200×627 | LinkedIn | `linkedin-post.html` |
| Story | 1080×1920 | Instagram/Facebook Stories | `story-template.html` |

## 🎨 Brand Colors Used

All templates use the official kbyg.ai color palette:

- **AI Blue Primary**: `#3b82f6`
- **Neural Purple**: `#8b5cf6`
- **Cyber Cyan**: `#06b6d4`
- **Dark Backgrounds**: `#0f172a`, `#1e293b`
- **Neutrals**: Gray scale from `#f9fafb` to `#111827`

### Gradients
```css
/* Primary AI Gradient */
background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%);

/* Neural Gradient */
background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);

/* Cyber Gradient */
background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
```

## 🚀 Quick Start

### 1. Choose Your Template
Select the appropriate template for your platform:
- Square posts → `instagram-post.html`
- Twitter cards → `twitter-card.html`
- LinkedIn articles → `linkedin-post.html`
- Vertical stories → `story-template.html`

### 2. Open in Browser
Simply double-click the HTML file to open it in your default browser.

### 3. Edit the Content
Open the HTML file in any text editor and modify the text sections (detailed instructions below).

### 4. Export as Image
Take a screenshot at the exact dimensions or use browser developer tools.

## 📝 Editing Each Template

### Instagram Post (1080×1080)

**What to edit:**
```html
<!-- Main headline -->
<h1 class="headline">AI That Works<br>For You</h1>

<!-- Subheadline -->
<p class="subheadline">Transform complexity into clarity with next-generation AI solutions</p>

<!-- Call-to-action button -->
<a href="#" class="cta">Learn More</a>

<!-- Tagline -->
<div class="tagline">Next-Generation AI Solutions</div>
```

**To use background image:**
Uncomment this line:
```html
<!-- <img src="../../images/ai-generated/social/instagram-background.png" alt="" class="background-image"> -->
```

**Adjust image visibility:**
Change opacity in `.gradient-overlay`:
```css
.gradient-overlay {
    background: linear-gradient(...);
    opacity: 0.85; /* Lower = more image visible */
}
```

---

### Twitter/X Card (1200×675)

**What to edit:**
```html
<!-- Headline -->
<h1 class="headline">Transform Data Into Intelligence</h1>

<!-- Description -->
<p class="description">Advanced AI solutions that make complex technology accessible...</p>

<!-- Stats -->
<div class="stat">
    <div class="stat-value">10x</div>
    <div class="stat-label">Faster</div>
</div>
```

**Features:**
- Split-screen design (visual left, content right)
- Three customizable stats
- Professional dark theme
- Prominent logo display

**Tips:**
- Keep headline under 60 characters
- Stats should be impactful numbers
- Use 2-3 stats maximum for clarity

---

### LinkedIn Post (1200×627)

**What to edit:**
```html
<!-- Topic category -->
<div class="eyebrow">Innovation Spotlight</div>

<!-- Main headline -->
<h1 class="headline">Making AI Accessible For Everyone</h1>

<!-- Subheadline -->
<p class="subheadline">Transform complex data into actionable insights...</p>

<!-- Feature items -->
<div class="feature-item">
    <div class="feature-icon">✓</div>
    <span>Intelligent automation at scale</span>
</div>
```

**Best for:**
- Product announcements
- Thought leadership
- Case studies
- Company updates

**Customization:**
- Change eyebrow text for topic categorization
- Add/remove feature items (keep 2-4)
- Modify floating element text (`.float-1`, `.float-2`)
- Update visual center text (default: "AI")

---

### Story Template (1080×1920)

**Three layout options** - Choose one by commenting/uncommenting:

#### Layout 1: Feature Card (Default)
```html
<div class="feature-card">
    <div class="card-icon">🚀</div>
    <h2 class="card-title">
        <span class="highlight">10x Faster</span><br>
        AI Processing
    </h2>
    <p class="card-description">
        Transform your data into insights in seconds, not hours
    </p>
</div>
```

#### Layout 2: Stats Grid
```html
<div class="stats-grid">
    <div class="stat-box">
        <div class="stat-value">99%</div>
        <div class="stat-label">Accuracy</div>
    </div>
    <!-- 4 stats total -->
</div>
```

#### Layout 3: Quote
```html
<div class="quote-container">
    <div class="quote-mark">"</div>
    <div class="quote-text">
        AI technology that actually understands your business needs
    </div>
</div>
```

**To switch layouts:**
1. Comment out the active layout
2. Uncomment your chosen layout
3. Update the text content

---

## 🖼️ Using AI-Generated Images

All templates support background images from the brand assets library.

### Available Images
- `../../images/ai-generated/social/instagram-background.png`
- `../../images/ai-generated/social/social-banner.png`
- Other images in subdirectories: `abstract/`, `heroes/`, `products/`

### How to Add Background Images

1. **Uncomment the image tag:**
```html
<!-- BEFORE -->
<!-- <img src="../../images/ai-generated/social/instagram-background.png" alt="" class="background-image"> -->

<!-- AFTER -->
<img src="../../images/ai-generated/social/instagram-background.png" alt="" class="background-image">
```

2. **Adjust visibility with gradient overlay:**
```css
.gradient-overlay {
    opacity: 0.85; /* 0 = full image, 1 = hidden */
}
```

3. **Change image path:**
```html
<img src="../../images/ai-generated/abstract/abstract-1.png" alt="" class="background-image">
```

## 📸 Exporting Images

### Method 1: Browser Screenshot (Recommended)

**For Chrome/Edge:**
1. Open template in browser
2. Press `F12` to open DevTools
3. Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
4. Type "screenshot"
5. Select "Capture node screenshot"
6. Click on the main container element
7. Image saves automatically

**For Firefox:**
1. Right-click on the page
2. Select "Take Screenshot"
3. Choose "Save full page"

### Method 2: Browser DevTools Device Mode

1. Open DevTools (`F12`)
2. Click "Toggle Device Toolbar" (phone icon)
3. Set custom dimensions:
   - Instagram: 1080×1080
   - Twitter: 1200×675
   - LinkedIn: 1200×627
   - Story: 1080×1920
4. Take screenshot

### Method 3: Online Tools

Use tools like:
- **Screenshot.guru** - Paste URL, set dimensions
- **Browserframe** - Clean browser screenshots
- **Screely** - Beautiful mockups

## 🎯 Best Practices

### Content Guidelines

**Headlines:**
- Keep under 10 words
- Use action verbs
- Highlight benefits, not features
- Make it scannable

**Descriptions:**
- 1-2 sentences maximum
- Focus on value proposition
- Use simple language
- Avoid jargon

**CTAs:**
- Clear action: "Learn More", "Get Started", "Try Free"
- Keep it short (2-3 words)
- Use contrasting colors

### Visual Guidelines

**Colors:**
- Use gradients sparingly for emphasis
- Maintain 60/30/10 color ratio (Primary/Secondary/Accent)
- Ensure text contrast meets WCAG AA (4.5:1 minimum)

**Typography:**
- Use Inter font exclusively
- Limit to 2-3 font sizes per design
- Bold weights (700-800) for headlines
- Regular (400-500) for body text

**Images:**
- Keep opacity at 0.2-0.4 for backgrounds
- Use high-quality images only
- Ensure images align with message
- Test on mobile preview

### Platform-Specific Tips

**Instagram:**
- Square format works in feed and carousel
- Use bold, eye-catching visuals
- Text should be readable on mobile (min 40px)
- Include emoji for personality

**Twitter/X:**
- Keep text concise
- Stats perform well
- Use landscape orientation
- Preview shows 2:1 ratio in feed

**LinkedIn:**
- Professional tone essential
- Feature business value
- Use professional imagery
- Bullet points work well

**Stories:**
- Vertical orientation optimized for mobile
- Keep important content in safe zones (top/bottom)
- Use large text (48px+)
- Add interactive elements (polls, swipe-ups) after export

## 🔧 Advanced Customization

### Changing Colors

Find and replace hex codes throughout the file:

```css
/* Primary Blue */
#3b82f6 → YOUR_COLOR

/* Purple */
#8b5cf6 → YOUR_COLOR

/* Cyan */
#06b6d4 → YOUR_COLOR
```

### Adding New Elements

All templates use flexbox layouts. To add elements:

```html
<div class="new-element">
    <h3>New Section</h3>
    <p>Content here</p>
</div>
```

```css
.new-element {
    font-size: 24px;
    margin-top: 20px;
    color: white;
}
```

### Animations (for web use)

Add CSS animations:

```css
.headline {
    animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
```

## 📱 Responsive Considerations

While these templates are designed for specific social media dimensions, they include responsive fallbacks:

- Templates scale down on smaller screens
- Maintain aspect ratio
- Text remains readable
- Layouts adapt to viewport

For web embedding, add:
```css
@media (max-width: 768px) {
    .instagram-post {
        width: 100%;
        height: auto;
        aspect-ratio: 1 / 1;
    }
}
```

## ✅ Pre-Export Checklist

Before exporting your social media graphics:

- [ ] All text is spell-checked
- [ ] Brand colors are correct
- [ ] Logo is visible and correct
- [ ] Text is readable at mobile sizes
- [ ] Background image (if used) is properly licensed
- [ ] Contrast ratios meet accessibility standards
- [ ] CTA is clear and actionable
- [ ] Links/URLs are correct (if applicable)
- [ ] File dimensions match platform requirements
- [ ] Image quality is high (no pixelation)

## 🆘 Troubleshooting

### Issue: Font not displaying correctly
**Solution:** Ensure you have internet connection for Google Fonts, or download Inter font locally.

### Issue: Background image not showing
**Solution:** Check file path is correct relative to HTML file location.

### Issue: Colors look different after export
**Solution:** Use PNG format for export, ensure color profile is sRGB.

### Issue: Text is cut off
**Solution:** Reduce font size or shorten text. Check safe zones for each platform.

### Issue: Template looks different in different browsers
**Solution:** Use Chrome or Firefox for best CSS support. Export from same browser.

## 📚 Additional Resources

### Brand Assets
- Full brand guidelines: `../../BRAND_GUIDELINES.md`
- Color palette: `../../colors/COLOR_GUIDE.md`
- Typography guide: `../../fonts/typography.css`
- Logo files: `../../logos/`

### Social Media Specs
- Instagram: 1080×1080 (feed), 1080×1920 (stories)
- Twitter/X: 1200×675 (cards), 1600×900 (large)
- LinkedIn: 1200×627 (recommended), 1200×1200 (square)
- Facebook: 1200×630 (link previews)

### Tools
- **Figma:** Import HTML/CSS for further editing
- **Canva:** Use as inspiration, recreate with brand colors
- **Adobe XD:** Convert to XD for prototyping
- **Photoshop:** Import screenshot for advanced editing

## 📞 Support

For questions or custom template requests:
- **Email:** brand@kbyg.ai
- **Design Team:** design@kbyg.ai
- **Documentation:** See `../../README.md`

## 📄 License

These templates are proprietary to kbyg.ai. Internal use only.

---

**Version:** 1.0  
**Last Updated:** February 2024  
**Maintained by:** kbyg.ai Brand Team

**Quick Links:**
- 📖 [Brand Guidelines](../../BRAND_GUIDELINES.md)
- 🎨 [Color Guide](../../colors/COLOR_GUIDE.md)
- 📱 [Social Media Kit](../../SOCIAL_MEDIA_KIT.md)
- 🖼️ [AI-Generated Images](../../images/ai-generated/)
