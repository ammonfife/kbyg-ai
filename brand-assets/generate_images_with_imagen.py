#!/usr/bin/env python3
"""
Generate KBYG.ai brand images using Google Imagen 3
Requires: google-cloud-aiplatform, proper GCP auth
"""

import json
import base64
from pathlib import Path
import time
import sys

try:
    from google.cloud import aiplatform
    from vertexai.preview.vision_models import ImageGenerationModel
except ImportError:
    print("❌ Missing required packages!")
    print("   Run: pip install google-cloud-aiplatform")
    sys.exit(1)

BASE_DIR = Path(__file__).parent
PROJECT_ID = "heimdall-8675309"
LOCATION = "us-central1"

def initialize_vertex_ai():
    """Initialize Vertex AI"""
    aiplatform.init(project=PROJECT_ID, location=LOCATION)
    print(f"✅ Initialized Vertex AI (project: {PROJECT_ID}, location: {LOCATION})")

def generate_image(prompt, output_path, aspect_ratio="1:1", number_of_images=1):
    """Generate image using Imagen 3"""
    try:
        # Initialize model
        model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-001")
        
        print(f"\n🎨 Generating: {output_path.name}")
        print(f"   Aspect: {aspect_ratio}")
        print(f"   Prompt: {prompt[:80]}...")
        
        # Generate image
        images = model.generate_images(
            prompt=prompt,
            number_of_images=number_of_images,
            aspect_ratio=aspect_ratio,
            safety_filter_level="block_some",
            person_generation="allow_adult"
        )
        
        # Save image
        if images and len(images) > 0:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            images[0].save(location=str(output_path))
            print(f"   ✅ Saved: {output_path}")
            return True
        else:
            print(f"   ❌ No image generated")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    print("🚀 KBYG.ai Image Generation with Google Imagen 3")
    print("=" * 70)
    
    # Initialize
    initialize_vertex_ai()
    
    # Load prompts manifest
    manifest_path = BASE_DIR / "IMAGEN_PROMPTS_MANIFEST.json"
    if not manifest_path.exists():
        print("❌ Prompts manifest not found. Run generate_assets.py first.")
        return
    
    with open(manifest_path) as f:
        all_prompts = json.load(f)
    
    print(f"\n📋 Loaded {sum(len(p) for p in all_prompts.values())} image prompts")
    
    # Generate images by category
    categories = [
        ("heroes_desktop", BASE_DIR / "heroes" / "desktop"),
        ("heroes_tablet", BASE_DIR / "heroes" / "tablet"),
        ("heroes_square", BASE_DIR / "heroes" / "square"),
        ("heroes_mobile", BASE_DIR / "heroes" / "mobile"),
        ("conference_scenes", BASE_DIR / "clip-art" / "conference-scenes"),
        ("networking", BASE_DIR / "clip-art" / "networking"),
        ("tech_intelligence", BASE_DIR / "clip-art" / "tech-intelligence"),
        ("gtm_strategy", BASE_DIR / "clip-art" / "gtm-strategy"),
        ("patterns", BASE_DIR / "clip-art" / "patterns"),
    ]
    
    total_generated = 0
    total_failed = 0
    
    for category_key, output_dir in categories:
        prompts = all_prompts.get(category_key, {})
        if not prompts:
            continue
        
        print(f"\n{'='*70}")
        print(f"📁 {category_key.upper().replace('_', ' ')} ({len(prompts)} images)")
        print(f"{'='*70}")
        
        for filename, data in prompts.items():
            output_path = output_dir / filename
            
            # Skip if already exists
            if output_path.exists():
                print(f"⏭️  Skipping (exists): {filename}")
                continue
            
            # Generate
            prompt = data["prompt"]
            aspect_ratio = data["ratio"]
            
            success = generate_image(prompt, output_path, aspect_ratio)
            
            if success:
                total_generated += 1
            else:
                total_failed += 1
            
            # Rate limiting - Imagen 3 has quotas
            time.sleep(2)
    
    print(f"\n{'='*70}")
    print(f"✅ GENERATION COMPLETE!")
    print(f"   Generated: {total_generated}")
    print(f"   Failed: {total_failed}")
    print(f"   Total: {total_generated + total_failed}")
    print(f"{'='*70}")

if __name__ == "__main__":
    main()
