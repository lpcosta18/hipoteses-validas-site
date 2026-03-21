# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for "Hipóteses Válidas, Lda.", a Portuguese accounting, taxation, and management consulting firm based in Torres Vedras. The website is a single-page application built with vanilla HTML, CSS (Tailwind CSS via CDN), and JavaScript, deployed on Vercel with serverless API endpoints.

## Architecture

### File Structure
- `frontend/index.html` - The main HTML file containing all content, styles, and scripts
- `frontend/assets/logo/` - Contains logo images in various formats (PNG, WebP)
  - `logo-hv-favicon.png` - Favicon
  - `logo-hv-home.png` - Main logo (light version)
  - `logo-hv-home-neg.png` - Logo for dark backgrounds
  - WebP versions for better performance
- `api/` - Serverless API endpoints for Vercel
  - `contact.js` - Contact form submission handler with email integration via Resend
  - `ping.js` - Health check endpoint
- `vercel.json` - Vercel deployment configuration
- `package.json` - Node.js dependencies and scripts

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
5. **Contact form** with backend API integration (Resend email service)
6. **Google Maps integration** for location display
7. **Vercel deployment** with serverless API endpoints

### External Dependencies (CDN)
- Tailwind CSS v3
- Font Awesome 6 for icons
- Google Fonts (Playfair Display, Inter)
- Google Maps embed

### Backend Dependencies
- Resend API for email sending
- Axios for HTTP requests (installed but not currently used)
- UUID for unique identifiers (installed but not currently used)

## Development Notes

### Build and Deployment
This project uses Vercel for deployment with serverless API functions. The frontend is static HTML/CSS/JS, while the backend consists of Node.js serverless functions.

### Environment Variables
- `RESEND_API_KEY` - API key for Resend email service
- `EMAIL_FROM` - Sender email address (defaults to Resend onboarding email)
- `EMAIL_TO_DEFAULT` - Recipient email address (defaults to luispintocosta@hotmail.com)
- Store sensitive values in `.env.local` for local development (not committed to git)

### Contact Form Integration
The contact form in `frontend/index.html` submits to `/api/contact` which:
1. Validates form data
2. Loads environment variables from `.env.local` in development
3. Sends email via Resend API
4. Returns JSON response with success/error messages

### Vercel Configuration
`vercel.json` routes:
- `/api/*` → `api/*.js` serverless functions
- `/assets/*` → `frontend/assets/*` static files
- All other routes → `frontend/index.html` (SPA routing)

## Common Commands

### Local Development
```bash
# Install dependencies
npm install

# Start Vercel development server
npm run dev

# Test API endpoints locally
curl http://localhost:3000/api/ping
```

### Deployment
```bash
# Deploy to production
npm run deploy

# Deploy preview
vercel
```

### Testing
```bash
# Run tests (if test.ts exists)
npm test

# Test contact form locally
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"nome":"Test","email":"test@example.com","mensagem":"Test message","privacidade":true}'
```

## Development Workflow

### Making Frontend Changes
1. Edit `frontend/index.html` directly
2. Test locally with `npm run dev`
3. No build step required - changes are immediate

### Adding API Endpoints
1. Create new `.js` file in `api/` directory
2. Export default async function handler(req, res)
3. Follow Vercel serverless function patterns
4. Test locally with `npm run dev`

### Environment Setup
1. Copy `.env.local.example` to `.env.local` (if exists)
2. Add required environment variables
3. For production, set environment variables in Vercel dashboard

### Image Assets
Place images in `frontend/assets/` directory and reference with relative paths. Consider adding WebP versions alongside PNG for better performance.

### Styling Updates
- Modify the `<style>` block in `frontend/index.html`
- Use existing CSS variables for consistent theming
- Add Tailwind utility classes for layout and responsive design

### JavaScript Updates
- All JavaScript is at the bottom of `frontend/index.html`
- Functions handle mobile menu, scroll effects, animations, and form submission
- Use vanilla JavaScript to maintain simplicity