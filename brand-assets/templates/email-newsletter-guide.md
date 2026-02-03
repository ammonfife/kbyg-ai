# kbyg.ai Email Newsletter Template Guide

## Overview
This comprehensive email newsletter template is designed for kbyg.ai's marketing communications. It features modern design, mobile responsiveness, and brand-consistent styling.

## Brand Colors

- **AI Blue**: `#3b82f6` - Primary brand color, used for main CTAs and accents
- **Neural Purple**: `#8b5cf6` - Secondary brand color, used in gradients and highlights
- **Cyber Cyan**: `#06b6d4` - Accent color for variety and visual interest

## Template Structure

### 1. Header Section
- **Logo**: Centered logo area (180px recommended width)
- **Background**: White with rounded corners
- **Customization**: Replace `[LOGO_URL]` with your actual logo URL

### 2. Hero Section
- **Gradient Background**: AI Blue → Neural Purple → Cyber Cyan
- **Content**: 
  - Main headline (H1)
  - Supporting text
  - Primary CTA button
- **Customization**: 
  - `[HERO_HEADLINE]` - Main hero message
  - `[HERO_DESCRIPTION]` - Supporting text
  - `[HERO_CTA_LINK]` - Button destination URL

### 3. Featured Article
- **Image**: Full-width featured image (536px max)
- **Content**:
  - Article title (H2)
  - Excerpt/description
  - "Continue Reading" CTA
- **Customization**:
  - `[FEATURED_IMAGE_URL]` - Featured article image
  - `[FEATURED_TITLE]` - Article headline
  - `[FEATURED_EXCERPT]` - Article summary (2-3 sentences)
  - `[FEATURED_LINK]` - Article URL

### 4. Feature Blocks (3 sections)
Each feature block includes:
- **Icon/Emoji**: Gradient background circle with emoji
- **Title**: H3 heading
- **Description**: Supporting text
- **Link**: "Learn More" link

**Feature Block 1** (🚀 - AI Blue to Neural Purple gradient):
- `[FEATURE_1_TITLE]`
- `[FEATURE_1_DESCRIPTION]`
- `[FEATURE_1_LINK]`

**Feature Block 2** (💡 - Neural Purple to Cyber Cyan gradient):
- `[FEATURE_2_TITLE]`
- `[FEATURE_2_DESCRIPTION]`
- `[FEATURE_2_LINK]`

**Feature Block 3** (⚡ - Cyber Cyan to AI Blue gradient):
- `[FEATURE_3_TITLE]`
- `[FEATURE_3_DESCRIPTION]`
- `[FEATURE_3_LINK]`

### 5. Call-to-Action Section
- **Dark Background**: Gradient dark gray for contrast
- **Content**:
  - Headline
  - Supporting text
  - Two CTA buttons (primary and outline)
- **Customization**:
  - `[PRIMARY_CTA_LINK]` - Main action (e.g., "Get Started Free")
  - `[SECONDARY_CTA_LINK]` - Secondary action (e.g., "Book a Demo")

### 6. Social Links
- **Icons**: Twitter, LinkedIn, GitHub, YouTube
- **Customization**:
  - `[TWITTER_LINK]` - Your Twitter/X profile
  - `[LINKEDIN_LINK]` - Your LinkedIn page
  - `[GITHUB_LINK]` - Your GitHub organization
  - `[YOUTUBE_LINK]` - Your YouTube channel

### 7. Footer
- **Company Info**: Name, tagline, address
- **Legal Links**: Preferences and unsubscribe
- **Customization**:
  - `[COMPANY_ADDRESS]` - Street address
  - `[COMPANY_CITY]` - City
  - `[COMPANY_STATE]` - State/Province
  - `[COMPANY_ZIP]` - Postal code
  - `[PREFERENCES_LINK]` - Email preferences page
  - `[UNSUBSCRIBE_LINK]` - Unsubscribe link (required by law)

## Customization Variables

All template variables are marked with square brackets `[VARIABLE_NAME]`. Use find-and-replace to customize:

```
[HERO_CTA_LINK]
[FEATURED_IMAGE_URL]
[FEATURED_TITLE]
[FEATURED_EXCERPT]
[FEATURED_LINK]
[FEATURE_1_TITLE]
[FEATURE_1_DESCRIPTION]
[FEATURE_1_LINK]
[FEATURE_2_TITLE]
[FEATURE_2_DESCRIPTION]
[FEATURE_2_LINK]
[FEATURE_3_TITLE]
[FEATURE_3_DESCRIPTION]
[FEATURE_3_LINK]
[PRIMARY_CTA_LINK]
[SECONDARY_CTA_LINK]
[TWITTER_LINK]
[LINKEDIN_LINK]
[GITHUB_LINK]
[YOUTUBE_LINK]
[COMPANY_ADDRESS]
[COMPANY_CITY]
[COMPANY_STATE]
[COMPANY_ZIP]
[PREFERENCES_LINK]
[UNSUBSCRIBE_LINK]
```

## Typography

**Font Family**: Inter (Google Fonts)
- **Headings**: Inter Bold (700 weight)
- **Subheadings**: Inter Semi-Bold (600 weight)
- **Body Text**: Inter Regular (400 weight)

**Font Sizes**:
- H1: 32px (28px mobile)
- H2: 24px (22px mobile)
- H3: 20px (18px mobile)
- Body: 16px
- Small text: 14-15px
- Footer: 12px

## Button Styles

### Primary Button
- **Style**: Gradient (AI Blue → Neural Purple)
- **Use**: Main CTAs, primary actions
- **Text Color**: White
- **Padding**: 14px 32px (12px 24px mobile)

### Secondary Button
- **Style**: Solid Cyber Cyan
- **Use**: Alternative actions
- **Text Color**: White
- **Padding**: 14px 32px (12px 24px mobile)

### Outline Button
- **Style**: Transparent with border
- **Use**: Tertiary actions, dark backgrounds
- **Border**: 2px solid
- **Padding**: 14px 32px (12px 24px mobile)

## Mobile Responsiveness

The template automatically adapts for mobile devices (≤600px):
- **Container**: Full width with 16px padding
- **Typography**: Reduced font sizes
- **Buttons**: Smaller padding
- **Layout**: Feature blocks stack vertically
- **Images**: Scale proportionally

## Email Client Compatibility

This template is optimized for:
- ✅ Gmail (web, iOS, Android)
- ✅ Apple Mail (macOS, iOS)
- ✅ Outlook (2016+, Office 365, web)
- ✅ Yahoo Mail
- ✅ Proton Mail
- ✅ Mobile email clients

**Special Handling**:
- Inline CSS for maximum compatibility
- MSO conditional comments for Outlook
- Table-based layout (required for email)
- Fallback fonts for non-web font support

## Best Practices

### Content
1. **Subject Line**: Keep under 50 characters
2. **Preview Text**: First 90-100 characters (customize in template)
3. **Hero**: Lead with your strongest message
4. **CTAs**: Use action-oriented language ("Get Started", "Learn More")
5. **Links**: Always use HTTPS
6. **Alt Text**: Add to all images for accessibility

### Images
1. **Hosting**: Use reliable CDN or email platform's image hosting
2. **Size**: Optimize images (compress before upload)
3. **Dimensions**: Featured image ~1200px wide recommended
4. **Format**: JPG for photos, PNG for logos/graphics
5. **Alt Text**: Descriptive for screen readers

### Testing
1. **Email Clients**: Test in multiple clients (use Litmus or Email on Acid)
2. **Devices**: Test on desktop, tablet, mobile
3. **Links**: Verify all links work
4. **Personalization**: Test merge tags/variables
5. **Spam Score**: Check spam score before sending

### Legal Requirements
1. **CAN-SPAM Compliance** (US):
   - Include physical address
   - Provide unsubscribe link
   - Honor opt-outs within 10 days
2. **GDPR Compliance** (EU):
   - Obtain consent before sending
   - Provide preference management
   - Include privacy policy link

## Integration with Email Service Providers

### Mailchimp
1. Create new campaign → "Email templates"
2. "Code your own" → Paste HTML
3. Use `*|MERGE_TAG|*` syntax for personalization
4. Replace `[UNSUBSCRIBE_LINK]` with `*|UNSUB|*`

### SendGrid
1. Marketing → "Email Templates" → "Create Template"
2. "Code Editor" → Paste HTML
3. Use `{{variable}}` syntax for personalization
4. Replace links with `{{unsubscribe_link}}`

### Klaviyo
1. Email → "Templates" → "Create Template"
2. "HTML" editor → Paste code
3. Use `{{ person.first_name }}` for personalization
4. Built-in unsubscribe tags available

### HubSpot
1. Marketing → Email → "Create email"
2. "Custom" template → Paste HTML
3. Use `{{ contact.firstname }}` for personalization
4. Replace `[UNSUBSCRIBE_LINK]` with HubSpot token

### ConvertKit
1. "Broadcasts" → "Email Template"
2. "Code" option → Paste HTML
3. Use `{{ subscriber.first_name }}` syntax
4. Built-in unsubscribe footer required

## Quick Start Workflow

1. **Copy the template file** to create a new campaign
2. **Replace all `[VARIABLES]`** with your content:
   - Find: `\[([A-Z_]+)\]` (regex search)
   - Replace one by one with actual content
3. **Upload images** to your email platform or CDN
4. **Update image URLs** in the template
5. **Customize colors** if needed (search for hex codes)
6. **Test send** to yourself and team
7. **Check all links** - click every button and link
8. **Review on mobile** - forward to phone, check formatting
9. **Final review** - proofread all copy
10. **Schedule or send** through your ESP

## Content Ideas by Section

### Hero Section Ideas
- Product launch announcements
- Major feature releases
- Seasonal campaigns
- Event invitations
- Special offers

### Featured Article Ideas
- Customer success stories
- Industry insights and trends
- How-to guides and tutorials
- Behind-the-scenes content
- Company news and updates

### Feature Block Ideas
- **Block 1**: New feature highlight
- **Block 2**: Educational content
- **Block 3**: Community spotlight or event

### CTA Section Ideas
- Free trial signup
- Demo booking
- Resource download (ebook, whitepaper)
- Event registration
- Community join (Discord, Slack)

## Tracking & Analytics

Add UTM parameters to all links for tracking:
```
?utm_source=newsletter&utm_medium=email&utm_campaign=[campaign_name]
```

**Example**:
```
https://kbyg.ai/features?utm_source=newsletter&utm_medium=email&utm_campaign=january_2025
```

Track these metrics:
- **Open Rate**: Industry average ~20-25%
- **Click-Through Rate**: Industry average ~2-5%
- **Conversion Rate**: Depends on goal
- **Unsubscribe Rate**: Keep below 0.5%

## Version History

- **v1.0** (2025-01-24): Initial template with mobile-responsive design
  - Brand colors integrated
  - Inter font family
  - Hero section, featured article, 3 feature blocks
  - Dual CTA section
  - Social links and footer

## Support & Resources

- **Template Location**: `/Users/benfife/My Drive (ammonfife@gmail.com)/brand-assets/templates/`
- **Related Assets**: Check `/brand-assets/` for logos, images, and brand guidelines
- **Email Testing**: [Litmus](https://litmus.com) | [Email on Acid](https://www.emailonacid.com)
- **HTML Email Guide**: [Really Good Emails](https://reallygoodemails.com)

---

**Last Updated**: January 24, 2025  
**Maintained by**: kbyg.ai Marketing Team  
**Template Version**: 1.0
