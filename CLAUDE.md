# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for "Hipóteses Válidas, Lda.", a Portuguese accounting, taxation, and management consulting firm based in Torres Vedras. The website is a single-page application built with vanilla HTML, CSS (Tailwind CSS via CDN), and JavaScript.

## Architecture

### File Structure
- `index.html` - The main HTML file containing all content, styles, and scripts
- `assets/logo/` - Contains logo images in various formats (PNG, WebP)
  - `logo-hv-favicon.png` - Favicon
  - `logo-hv-home.png` - Main logo (light version)
  - `logo-hv-home-neg.png` - Logo for dark backgrounds
  - WebP versions for better performance

### Design System
- **Color Palette**: Gold (`#c59e43`) as primary color with dark gray (`#1a1a1a`) and sand (`#f8f5f0`) backgrounds
- **Typography**: Playfair Display for headings, Inter for body text
- **Styling Approach**: Inline CSS with custom CSS variables in `<style>` block
- **Responsive Design**: Mobile-first with Tailwind CSS utility classes
- **Animations**: Fade-in animations triggered by Intersection Observer API

### Key Features
1. **Single-page navigation** with smooth scrolling to sections
2. **Responsive mobile menu** with toggle functionality
3. **Glassmorphism effects** for cards and navigation
4. **Animated background elements** with moving blobs
5. **Contact form** with validation (currently alerts on submit)
6. **Google Maps integration** for location display

### External Dependencies (CDN)
- Tailwind CSS v3
- Font Awesome 6 for icons
- Google Fonts (Playfair Display, Inter)
- Google Maps embed

## Development Notes

### No Build Process
This is a static website with no build system, package manager, or compilation step. All dependencies are loaded via CDN.

### Image Assets
Logo files are stored in `assets/logo/` with multiple formats for optimization:
- Use WebP versions where supported for better performance
- PNG versions as fallbacks
- Different color variants for light/dark backgrounds

### Browser Compatibility
The site uses modern CSS features (CSS variables, backdrop-filter, CSS Grid, Flexbox) and JavaScript APIs (Intersection Observer). Ensure compatibility with target browsers.

### Form Handling
The contact form currently shows an alert on submission. For production, this would need backend integration or a form service.

### Performance Considerations
- All CSS and JavaScript are inline in the HTML file
- Images should be optimized for web delivery
- Consider lazy loading for images if more are added

## Common Tasks

### Testing
Open `index.html` directly in a browser or use a local HTTP server:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve
```

### Making Changes
1. Edit `index.html` directly
2. Test in browser
3. No build or deployment steps required

### Adding New Images
Place images in `assets/` directory and reference with relative paths. Consider adding WebP versions alongside PNG for better performance.

### Styling Updates
- Modify the `<style>` block in `index.html`
- Use existing CSS variables for consistent theming
- Add Tailwind utility classes for layout and responsive design

### JavaScript Updates
- All JavaScript is at the bottom of `index.html`
- Functions handle mobile menu, scroll effects, animations, and form submission
- Use vanilla JavaScript to maintain simplicity