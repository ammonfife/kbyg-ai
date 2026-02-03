#!/usr/bin/env python3
"""
Create KBYG.ai logo variations
"""

from pathlib import Path

BASE_DIR = Path(__file__).parent
LOGOS_DIR = BASE_DIR / "logos"

# SVG templates
def create_horizontal_primary(width=180, height=60):
    return f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- AI Brain Icon -->
  <g transform="translate(5, 10)">
    <circle cx="20" cy="20" r="18" fill="none" stroke="url(#gradient)" stroke-width="2.5"/>
    <circle cx="12" cy="15" r="2.5" fill="#3b82f6"/>
    <circle cx="28" cy="15" r="2.5" fill="#8b5cf6"/>
    <circle cx="20" cy="25" r="2.5" fill="#06b6d4"/>
    <circle cx="12" cy="25" r="2" fill="#3b82f6" opacity="0.6"/>
    <circle cx="28" cy="25" r="2" fill="#8b5cf6" opacity="0.6"/>
    <line x1="12" y1="15" x2="20" y2="25" stroke="url(#gradient)" stroke-width="1.5" opacity="0.5"/>
    <line x1="28" y1="15" x2="20" y2="25" stroke="url(#gradient)" stroke-width="1.5" opacity="0.5"/>
    <line x1="12" y1="25" x2="20" y2="25" stroke="url(#gradient)" stroke-width="1.5" opacity="0.5"/>
    <line x1="28" y1="25" x2="20" y2="25" stroke="url(#gradient)" stroke-width="1.5" opacity="0.5"/>
  </g>
  
  <text x="52" y="38" font-family="'Inter', sans-serif" font-size="28" font-weight="800" fill="#111827">kbyg</text>
  <text x="115" y="38" font-family="'Inter', sans-serif" font-size="28" font-weight="300" fill="#3b82f6">.ai</text>
</svg>'''

def create_vertical_primary(width=120, height=140):
    return f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- AI Brain Icon -->
  <g transform="translate(30, 10)">
    <circle cx="30" cy="30" r="28" fill="none" stroke="url(#gradient)" stroke-width="3"/>
    <circle cx="18" cy="23" r="3.5" fill="#3b82f6"/>
    <circle cx="42" cy="23" r="3.5" fill="#8b5cf6"/>
    <circle cx="30" cy="37" r="3.5" fill="#06b6d4"/>
    <circle cx="18" cy="37" r="3" fill="#3b82f6" opacity="0.6"/>
    <circle cx="42" cy="37" r="3" fill="#8b5cf6" opacity="0.6"/>
    <line x1="18" y1="23" x2="30" y2="37" stroke="url(#gradient)" stroke-width="2" opacity="0.5"/>
    <line x1="42" y1="23" x2="30" y2="37" stroke="url(#gradient)" stroke-width="2" opacity="0.5"/>
    <line x1="18" y1="37" x2="30" y2="37" stroke="url(#gradient)" stroke-width="2" opacity="0.5"/>
    <line x1="42" y1="37" x2="30" y2="37" stroke="url(#gradient)" stroke-width="2" opacity="0.5"/>
  </g>
  
  <text x="60" y="100" text-anchor="middle" font-family="'Inter', sans-serif" font-size="32" font-weight="800" fill="#111827">kbyg</text>
  <text x="60" y="125" text-anchor="middle" font-family="'Inter', sans-serif" font-size="32" font-weight="300" fill="#3b82f6">.ai</text>
</svg>'''

def create_stacked_primary(width=160, height=100):
    return f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- AI Brain Icon -->
  <g transform="translate(50, 5)">
    <circle cx="30" cy="25" r="22" fill="none" stroke="url(#gradient)" stroke-width="2.5"/>
    <circle cx="20" cy="19" r="3" fill="#3b82f6"/>
    <circle cx="40" cy="19" r="3" fill="#8b5cf6"/>
    <circle cx="30" cy="31" r="3" fill="#06b6d4"/>
    <circle cx="20" cy="31" r="2.5" fill="#3b82f6" opacity="0.6"/>
    <circle cx="40" cy="31" r="2.5" fill="#8b5cf6" opacity="0.6"/>
    <line x1="20" y1="19" x2="30" y2="31" stroke="url(#gradient)" stroke-width="1.8" opacity="0.5"/>
    <line x1="40" y1="19" x2="30" y2="31" stroke="url(#gradient)" stroke-width="1.8" opacity="0.5"/>
    <line x1="20" y1="31" x2="30" y2="31" stroke="url(#gradient)" stroke-width="1.8" opacity="0.5"/>
    <line x1="40" y1="31" x2="30" y2="31" stroke="url(#gradient)" stroke-width="1.8" opacity="0.5"/>
  </g>
  
  <text x="80" y="75" text-anchor="middle" font-family="'Inter', sans-serif" font-size="26" font-weight="800" fill="#111827">kbyg</text>
  <text x="80" y="95" text-anchor="middle" font-family="'Inter', sans-serif" font-size="26" font-weight="300" fill="#3b82f6">.ai</text>
</svg>'''

def create_compact_primary(width=150, height=50):
    return f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- AI Brain Icon -->
  <g transform="translate(3, 5)">
    <circle cx="20" cy="20" r="16" fill="none" stroke="url(#gradient)" stroke-width="2"/>
    <circle cx="13" cy="15" r="2" fill="#3b82f6"/>
    <circle cx="27" cy="15" r="2" fill="#8b5cf6"/>
    <circle cx="20" cy="24" r="2" fill="#06b6d4"/>
    <circle cx="13" cy="24" r="1.5" fill="#3b82f6" opacity="0.6"/>
    <circle cx="27" cy="24" r="1.5" fill="#8b5cf6" opacity="0.6"/>
    <line x1="13" y1="15" x2="20" y2="24" stroke="url(#gradient)" stroke-width="1.2" opacity="0.5"/>
    <line x1="27" y1="15" x2="20" y2="24" stroke="url(#gradient)" stroke-width="1.2" opacity="0.5"/>
    <line x1="13" y1="24" x2="20" y2="24" stroke="url(#gradient)" stroke-width="1.2" opacity="0.5"/>
    <line x1="27" y1="24" x2="20" y2="24" stroke="url(#gradient)" stroke-width="1.2" opacity="0.5"/>
  </g>
  
  <text x="45" y="33" font-family="'Inter', sans-serif" font-size="24" font-weight="800" fill="#111827">kbyg</text>
  <text x="98" y="33" font-family="'Inter', sans-serif" font-size="24" font-weight="300" fill="#3b82f6">.ai</text>
</svg>'''

def create_full_primary(width=240, height=80):
    return f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- AI Brain Icon -->
  <g transform="translate(5, 15)">
    <circle cx="25" cy="25" r="23" fill="none" stroke="url(#gradient)" stroke-width="3"/>
    <circle cx="15" cy="19" r="3.5" fill="#3b82f6"/>
    <circle cx="35" cy="19" r="3.5" fill="#8b5cf6"/>
    <circle cx="25" cy="31" r="3.5" fill="#06b6d4"/>
    <circle cx="15" cy="31" r="3" fill="#3b82f6" opacity="0.6"/>
    <circle cx="35" cy="31" r="3" fill="#8b5cf6" opacity="0.6"/>
    <line x1="15" y1="19" x2="25" y2="31" stroke="url(#gradient)" stroke-width="2" opacity="0.5"/>
    <line x1="35" y1="19" x2="25" y2="31" stroke="url(#gradient)" stroke-width="2" opacity="0.5"/>
    <line x1="15" y1="31" x2="25" y2="31" stroke="url(#gradient)" stroke-width="2" opacity="0.5"/>
    <line x1="35" y1="31" x2="25" y2="31" stroke="url(#gradient)" stroke-width="2" opacity="0.5"/>
  </g>
  
  <text x="60" y="48" font-family="'Inter', sans-serif" font-size="36" font-weight="800" fill="#111827">kbyg</text>
  <text x="135" y="48" font-family="'Inter', sans-serif" font-size="36" font-weight="300" fill="#3b82f6">.ai</text>
  <text x="120" y="68" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" font-weight="500" fill="#6b7280">INTELLIGENCE EXTRACTION FOR REVENUE TEAMS</text>
</svg>'''

# White versions (replace colors)
def make_white_version(svg_content):
    return svg_content.replace('fill="#111827"', 'fill="#ffffff"').replace('fill="#3b82f6"', 'fill="#ffffff"').replace('fill="#6b7280"', 'fill="#e5e7eb"')

# Dark versions (replace colors)
def make_dark_version(svg_content):
    return svg_content.replace('fill="#3b82f6"', 'fill="#111827"').replace('fill="#8b5cf6"', 'fill="#111827"').replace('fill="#06b6d4"', 'fill="#111827"').replace('stroke="url(#gradient)"', 'stroke="#111827"')

def main():
    print("🎨 Creating logo variations...")
    
    # Create directories
    (LOGOS_DIR / "primary").mkdir(exist_ok=True)
    (LOGOS_DIR / "white").mkdir(exist_ok=True)
    (LOGOS_DIR / "dark").mkdir(exist_ok=True)
    (LOGOS_DIR / "icon-only").mkdir(exist_ok=True)
    
    # Primary logos
    primary_logos = {
        "logo-horizontal.svg": create_horizontal_primary(),
        "logo-vertical.svg": create_vertical_primary(),
        "logo-stacked.svg": create_stacked_primary(),
        "logo-compact.svg": create_compact_primary(),
        "logo-full.svg": create_full_primary()
    }
    
    for name, content in primary_logos.items():
        # Primary
        (LOGOS_DIR / "primary" / name).write_text(content)
        # White
        (LOGOS_DIR / "white" / name.replace(".svg", "-white.svg")).write_text(make_white_version(content))
        # Dark
        (LOGOS_DIR / "dark" / name.replace(".svg", "-dark.svg")).write_text(make_dark_version(content))
    
    # Icon-only variations
    icon_512 = '''<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="240" fill="url(#gradient)"/>
  <g transform="translate(76, 76)">
    <circle cx="180" cy="180" r="140" fill="none" stroke="white" stroke-width="18"/>
    <circle cx="130" cy="145" r="22" fill="white"/>
    <circle cx="230" cy="145" r="22" fill="white"/>
    <circle cx="180" cy="215" r="22" fill="white"/>
    <circle cx="130" cy="215" r="18" fill="white" opacity="0.7"/>
    <circle cx="230" cy="215" r="18" fill="white" opacity="0.7"/>
    <line x1="130" y1="145" x2="180" y2="215" stroke="white" stroke-width="12" opacity="0.6"/>
    <line x1="230" y1="145" x2="180" y2="215" stroke="white" stroke-width="12" opacity="0.6"/>
    <line x1="130" y1="215" x2="180" y2="215" stroke="white" stroke-width="12" opacity="0.6"/>
    <line x1="230" y1="215" x2="180" y2="215" stroke="white" stroke-width="12" opacity="0.6"/>
  </g>
</svg>'''
    
    (LOGOS_DIR / "icon-only" / "icon-square-512.svg").write_text(icon_512)
    
    # Create smaller icon sizes (256, 128)
    icon_256 = icon_512.replace('width="512" height="512"', 'width="256" height="256"').replace('viewBox="0 0 512 512"', 'viewBox="0 0 512 512"')
    icon_128 = icon_512.replace('width="512" height="512"', 'width="128" height="128"').replace('viewBox="0 0 512 512"', 'viewBox="0 0 512 512"')
    
    (LOGOS_DIR / "icon-only" / "icon-square-256.svg").write_text(icon_256)
    (LOGOS_DIR / "icon-only" / "icon-square-128.svg").write_text(icon_128)
    
    # Circular icon
    icon_circle = '''<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
    <clipPath id="circle">
      <circle cx="256" cy="256" r="256"/>
    </clipPath>
  </defs>
  <g clip-path="url(#circle)">
    <circle cx="256" cy="256" r="256" fill="url(#gradient)"/>
    <g transform="translate(76, 76)">
      <circle cx="180" cy="180" r="140" fill="none" stroke="white" stroke-width="18"/>
      <circle cx="130" cy="145" r="22" fill="white"/>
      <circle cx="230" cy="145" r="22" fill="white"/>
      <circle cx="180" cy="215" r="22" fill="white"/>
      <circle cx="130" cy="215" r="18" fill="white" opacity="0.7"/>
      <circle cx="230" cy="215" r="18" fill="white" opacity="0.7"/>
      <line x1="130" y1="145" x2="180" y2="215" stroke="white" stroke-width="12" opacity="0.6"/>
      <line x1="230" y1="145" x2="180" y2="215" stroke="white" stroke-width="12" opacity="0.6"/>
      <line x1="130" y1="215" x2="180" y2="215" stroke="white" stroke-width="12" opacity="0.6"/>
      <line x1="230" y1="215" x2="180" y2="215" stroke="white" stroke-width="12" opacity="0.6"/>
    </g>
  </g>
</svg>'''
    
    (LOGOS_DIR / "icon-only" / "icon-circle-512.svg").write_text(icon_circle)
    
    # 3D gradient icon (simplified version)
    icon_3d = '''<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient3d" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="sphere" cx="40%" cy="40%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.4" />
      <stop offset="100%" style="stop-color:#000000;stop-opacity:0.2" />
    </radialGradient>
  </defs>
  <circle cx="256" cy="256" r="240" fill="url(#gradient3d)"/>
  <circle cx="256" cy="256" r="240" fill="url(#sphere)"/>
  <g transform="translate(76, 76)">
    <circle cx="180" cy="180" r="140" fill="none" stroke="white" stroke-width="20" opacity="0.9"/>
    <circle cx="130" cy="145" r="24" fill="white" opacity="0.95"/>
    <circle cx="230" cy="145" r="24" fill="white" opacity="0.95"/>
    <circle cx="180" cy="215" r="24" fill="white" opacity="0.95"/>
    <circle cx="130" cy="215" r="20" fill="white" opacity="0.75"/>
    <circle cx="230" cy="215" r="20" fill="white" opacity="0.75"/>
    <line x1="130" y1="145" x2="180" y2="215" stroke="white" stroke-width="14" opacity="0.7"/>
    <line x1="230" y1="145" x2="180" y2="215" stroke="white" stroke-width="14" opacity="0.7"/>
    <line x1="130" y1="215" x2="180" y2="215" stroke="white" stroke-width="14" opacity="0.7"/>
    <line x1="230" y1="215" x2="180" y2="215" stroke="white" stroke-width="14" opacity="0.7"/>
  </g>
</svg>'''
    
    (LOGOS_DIR / "icon-only" / "icon-gradient-3d.svg").write_text(icon_3d)
    
    print("✅ Created 20+ logo variations:")
    print("   - 5 primary variations")
    print("   - 5 white variations")
    print("   - 5 dark variations")
    print("   - 5 icon-only variations")
    print("\n📂 Organized in subdirectories:")
    print("   - logos/primary/")
    print("   - logos/white/")
    print("   - logos/dark/")
    print("   - logos/icon-only/")

if __name__ == "__main__":
    main()
