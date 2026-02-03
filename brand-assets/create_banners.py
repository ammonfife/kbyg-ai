#!/usr/bin/env python3
"""
Create KBYG.ai platform-specific banners
"""

from pathlib import Path

BASE_DIR = Path(__file__).parent
BANNERS_DIR = BASE_DIR / "banners"

def create_banner_svg(width, height, platform, has_logo=True):
    """Create banner with gradient background and optional logo"""
    
    logo_element = ""
    if has_logo:
        # Scale logo appropriately for banner size
        logo_scale = min(height / 60 * 0.6, 1)
        logo_x = 40
        logo_y = height // 2
        
        logo_element = f'''
  <!-- Logo -->
  <g transform="translate({logo_x}, {logo_y - 30 * logo_scale}) scale({logo_scale})">
    <circle cx="20" cy="20" r="18" fill="none" stroke="white" stroke-width="2.5"/>
    <circle cx="12" cy="15" r="2.5" fill="white"/>
    <circle cx="28" cy="15" r="2.5" fill="white"/>
    <circle cx="20" cy="25" r="2.5" fill="white"/>
    <circle cx="12" cy="25" r="2" fill="white" opacity="0.7"/>
    <circle cx="28" cy="25" r="2" fill="white" opacity="0.7"/>
    <line x1="12" y1="15" x2="20" y2="25" stroke="white" stroke-width="1.5" opacity="0.6"/>
    <line x1="28" y1="15" x2="20" y2="25" stroke="white" stroke-width="1.5" opacity="0.6"/>
    <line x1="12" y1="25" x2="20" y2="25" stroke="white" stroke-width="1.5" opacity="0.6"/>
    <line x1="28" y1="25" x2="20" y2="25" stroke="white" stroke-width="1.5" opacity="0.6"/>
    <text x="45" y="30" font-family="'Inter', sans-serif" font-size="24" font-weight="800" fill="white">kbyg</text>
    <text x="95" y="30" font-family="'Inter', sans-serif" font-size="24" font-weight="300" fill="white">.ai</text>
  </g>
  
  <!-- Tagline -->
  <text x="{logo_x + 130 * logo_scale}" y="{logo_y + 5}" font-family="'Inter', sans-serif" font-size="{14 * logo_scale}" font-weight="600" fill="white" opacity="0.9">Intelligence Extraction for Revenue Teams</text>
'''
    
    # Abstract neural network pattern in background
    pattern = f'''
  <!-- Background pattern -->
  <g opacity="0.15">
    <circle cx="{width * 0.75}" cy="{height * 0.3}" r="{height * 0.15}" fill="none" stroke="white" stroke-width="2"/>
    <circle cx="{width * 0.85}" cy="{height * 0.6}" r="{height * 0.1}" fill="none" stroke="white" stroke-width="2"/>
    <circle cx="{width * 0.65}" cy="{height * 0.7}" r="{height * 0.12}" fill="none" stroke="white" stroke-width="2"/>
    <line x1="{width * 0.75}" y1="{height * 0.3}" x2="{width * 0.85}" y2="{height * 0.6}" stroke="white" stroke-width="1.5"/>
    <line x1="{width * 0.85}" y1="{height * 0.6}" x2="{width * 0.65}" y2="{height * 0.7}" stroke="white" stroke-width="1.5"/>
  </g>
'''
    
    return f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="banner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="{width}" height="{height}" fill="url(#banner-gradient)"/>
  
  {pattern}
  {logo_element}
  
  <!-- Platform indicator (remove in production) -->
  <text x="{width - 10}" y="{height - 10}" text-anchor="end" font-family="'Inter', sans-serif" font-size="10" fill="white" opacity="0.4">{platform.upper()} {width}x{height}</text>
</svg>'''

def main():
    print("🎨 Creating platform-specific banners...")
    
    # Create subdirectories
    platforms = ["linkedin", "twitter", "facebook", "youtube", "email", "website", "mobile"]
    for platform in platforms:
        (BANNERS_DIR / platform).mkdir(exist_ok=True)
    
    banners = {
        # LinkedIn
        "linkedin/linkedin-cover-1584x396.svg": (1584, 396, "LinkedIn"),
        
        # Twitter/X
        "twitter/twitter-header-1500x500.svg": (1500, 500, "Twitter/X"),
        
        # Facebook
        "facebook/facebook-cover-820x312.svg": (820, 312, "Facebook"),
        
        # YouTube
        "youtube/youtube-banner-2560x1440.svg": (2560, 1440, "YouTube"),
        
        # Email headers
        "email/email-header-600x200.svg": (600, 200, "Email"),
        "email/email-header-800x200.svg": (800, 200, "Email"),
        
        # Website hero banners
        "website/website-hero-1920x600.svg": (1920, 600, "Website"),
        "website/website-hero-2560x800.svg": (2560, 800, "Website"),
        
        # Mobile banners
        "mobile/mobile-banner-750x300.svg": (750, 300, "Mobile"),
    }
    
    for filename, (width, height, platform) in banners.items():
        content = create_banner_svg(width, height, platform)
        (BANNERS_DIR / filename).write_text(content)
        print(f"   ✅ {filename}")
    
    print(f"\n✅ Created {len(banners)} platform-specific banners")
    print("\n📂 Organized by platform:")
    for platform in platforms:
        count = len(list((BANNERS_DIR / platform).glob("*.svg")))
        if count > 0:
            print(f"   - banners/{platform}/ ({count} banner{'s' if count > 1 else ''})")

if __name__ == "__main__":
    main()
