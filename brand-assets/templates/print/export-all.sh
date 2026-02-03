#!/bin/bash

# Export all print materials to PDF
# Requires Chrome/Chromium browser

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}kbyg.ai Print Materials Export Script${NC}"
echo "======================================"
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Create output directory
mkdir -p pdfs

echo -e "${GREEN}Exporting print materials...${NC}"
echo ""

# Check if Chrome is available
if [ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
    CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
elif command -v google-chrome &> /dev/null; then
    CHROME="google-chrome"
elif command -v chromium &> /dev/null; then
    CHROME="chromium"
else
    echo "Error: Chrome/Chromium not found. Please install Google Chrome."
    exit 1
fi

# Function to print PDF using Chrome headless
print_pdf() {
    local input_file=$1
    local output_file=$2
    local paper_width=$3
    local paper_height=$4
    
    echo "Exporting: $input_file → $output_file"
    
    "$CHROME" \
        --headless \
        --disable-gpu \
        --no-pdf-header-footer \
        --print-to-pdf="$output_file" \
        --print-to-pdf-no-header \
        --no-margins \
        "file://$SCRIPT_DIR/$input_file" \
        2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "  ✓ Success: $(ls -lh "$output_file" | awk '{print $5}')"
    else
        echo "  ✗ Failed to export $input_file"
    fi
    echo ""
}

# Export Business Card (3.5 x 2 inches)
echo "1. Business Card (3.5×2 inches)"
print_pdf "business-card.html" "pdfs/business-card.pdf" "3.5" "2"

# Export Letterhead (8.5 x 11 inches)
echo "2. Letterhead (8.5×11 inches)"
print_pdf "letterhead.html" "pdfs/letterhead.pdf" "8.5" "11"

# Export One-Pager Flyer (8.5 x 11 inches)
echo "3. One-Pager Flyer (8.5×11 inches)"
print_pdf "one-pager-flyer.html" "pdfs/one-pager-flyer.pdf" "8.5" "11"

# Export Poster (24 x 36 inches)
echo "4. Poster (24×36 inches)"
print_pdf "poster-24x36.html" "pdfs/poster-24x36.pdf" "24" "36"

echo -e "${GREEN}Export complete!${NC}"
echo ""
echo "PDFs saved to: $SCRIPT_DIR/pdfs/"
echo ""
echo "Next steps:"
echo "  1. Review PDFs in the pdfs/ directory"
echo "  2. Customize HTML files with your information"
echo "  3. Run this script again to regenerate PDFs"
echo "  4. Send to your print vendor"
echo ""
echo "See PRINT-GUIDE.md for detailed instructions."
