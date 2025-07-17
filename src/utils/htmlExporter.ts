import { Project, SectionInstance } from '../types';
import { ThemeConfig } from '../types';

export const generateCompleteHTML = (project: Project, theme: ThemeConfig): string => {
  const cssVariables = generateCSSVariables(theme);
  const sectionsHTML = project.sections
    .sort((a, b) => a.order - b.order)
    .map(section => generateSectionHTML(section, theme))
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?${Object.values(theme.fonts).map(font => 
      `family=${font.replace(' ', '+')}:wght@300;400;500;600;700;800;900`
    ).join('&')}&display=swap" rel="stylesheet">
    <style>
        :root {
            ${cssVariables}
        }
        
        /* Base Styles */
        * {
            box-sizing: border-box;
        }
        
        body {
            margin: 0;
            padding: 0;
            font-family: var(--website-font-primary);
            color: var(--website-color-text);
            background-color: var(--website-color-background);
            line-height: 1.6;
        }
        
        /* Utility Classes */
        .website-bg-primary { background-color: var(--website-color-primary); }
        .website-bg-secondary { background-color: var(--website-color-secondary); }
        .website-bg-accent { background-color: var(--website-color-accent); }
        .website-bg-surface { background-color: var(--website-color-surface); }
        .website-bg-background { background-color: var(--website-color-background); }
        
        .website-text-primary { color: var(--website-color-text); }
        .website-text-secondary { color: var(--website-color-text-secondary); }
        .website-text-accent { color: var(--website-color-accent); }
        .website-text-white { color: #ffffff; }
        
        .website-font-primary { font-family: var(--website-font-primary); }
        .website-font-secondary { font-family: var(--website-font-secondary); }
        .website-font-accent { font-family: var(--website-font-accent); }
        
        .website-shadow-sm { box-shadow: var(--website-shadow-sm); }
        .website-shadow-md { box-shadow: var(--website-shadow-md); }
        .website-shadow-lg { box-shadow: var(--website-shadow-lg); }
        .website-shadow-xl { box-shadow: var(--website-shadow-xl); }
        
        .website-gradient-primary {
            background: linear-gradient(135deg, var(--website-color-primary), var(--website-color-secondary));
        }
        
        .website-border { border-color: var(--website-color-border); }
        
        /* Button Styles */
        .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, var(--website-color-primary), var(--website-color-secondary));
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-family: var(--website-font-secondary);
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: var(--website-shadow-lg);
            opacity: 0.9;
        }
        
        .btn-secondary {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: transparent;
            color: var(--website-color-primary);
            padding: 12px 24px;
            border: 2px solid var(--website-color-primary);
            border-radius: 12px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            font-family: var(--website-font-secondary);
        }
        
        .btn-secondary:hover {
            background: var(--website-color-primary);
            color: white;
            transform: translateY(-2px);
        }
        
        /* Form Styles */
        .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid var(--website-color-border);
            border-radius: 8px;
            font-family: var(--website-font-secondary);
            font-size: 16px;
            transition: all 0.3s ease;
            background-color: var(--website-color-surface);
            color: var(--website-color-text);
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--website-color-primary);
            box-shadow: 0 0 0 3px rgba(var(--website-color-primary-rgb), 0.1);
        }
        
        .form-textarea {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid var(--website-color-border);
            border-radius: 8px;
            font-family: var(--website-font-secondary);
            font-size: 16px;
            transition: all 0.3s ease;
            background-color: var(--website-color-surface);
            color: var(--website-color-text);
            resize: vertical;
            min-height: 120px;
        }
        
        .form-textarea:focus {
            outline: none;
            border-color: var(--website-color-primary);
            box-shadow: 0 0 0 3px rgba(var(--website-color-primary-rgb), 0.1);
        }
        
        /* Responsive Grid */
        .grid-1 { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
        
        @media (max-width: 1024px) {
            .grid-4 { grid-template-columns: repeat(2, 1fr); }
            .grid-3 { grid-template-columns: repeat(2, 1fr); }
        }
        
        @media (max-width: 768px) {
            .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }
        }
        
        /* Container */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }
        
        .container-lg {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 1rem;
        }
        
        /* Spacing */
        .section-padding { padding: 5rem 0; }
        .section-padding-sm { padding: 3rem 0; }
        .section-padding-lg { padding: 7rem 0; }
        
        /* Text Styles */
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        
        /* Smooth Scrolling */
        html {
            scroll-behavior: smooth;
        }
        
        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out;
        }
        
        /* Mobile Menu Styles */
        .mobile-menu {
            display: none;
        }
        
        @media (max-width: 768px) {
            .desktop-menu { display: none; }
            .mobile-menu { display: block; }
        }
        
        /* Responsive Text */
        @media (max-width: 768px) {
            .text-responsive-xl { font-size: 2rem; }
            .text-responsive-lg { font-size: 1.5rem; }
            .text-responsive-md { font-size: 1.25rem; }
        }
        
        @media (min-width: 769px) {
            .text-responsive-xl { font-size: 3rem; }
            .text-responsive-lg { font-size: 2rem; }
            .text-responsive-md { font-size: 1.5rem; }
        }
        
        @media (min-width: 1024px) {
            .text-responsive-xl { font-size: 4rem; }
            .text-responsive-lg { font-size: 2.5rem; }
            .text-responsive-md { font-size: 1.75rem; }
        }
        
        /* Icon Styles */
        .icon {
            width: 1.5rem;
            height: 1.5rem;
            display: inline-block;
            vertical-align: middle;
        }
        
        .icon-sm {
            width: 1rem;
            height: 1rem;
        }
        
        .icon-lg {
            width: 2rem;
            height: 2rem;
        }
        
        .icon-xl {
            width: 3rem;
            height: 3rem;
        }
    </style>
    <script>
        // Mobile menu toggle
        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            if (menu) {
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            }
        }
        
        // Smooth scroll for anchor links
        document.addEventListener('DOMContentLoaded', function() {
            const links = document.querySelectorAll('a[href^="#"]');
            links.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        });
        
        // Form submission handler
        function handleFormSubmit(event) {
            event.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            event.target.reset();
        }
    </script>
</head>
<body>
    ${sectionsHTML}
</body>
</html>`;
};

const generateCSSVariables = (theme: ThemeConfig): string => {
  // Convert hex colors to RGB for use in rgba()
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      '0, 0, 0';
  };

  return Object.entries(theme.colors)
    .map(([key, value]) => {
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `--website-color-${cssVar}: ${value};\n            --website-color-${cssVar}-rgb: ${hexToRgb(value)};`;
    })
    .concat(
      Object.entries(theme.fonts).map(([key, value]) => 
        `--website-font-${key}: '${value}', sans-serif;`
      )
    )
    .concat(
      Object.entries(theme.shadows).map(([key, value]) => 
        `--website-shadow-${key}: ${value};`
      )
    )
    .join('\n            ');
};

const generateSectionHTML = (section: SectionInstance, theme: ThemeConfig): string => {
  const content = section.data;
  
  switch (section.templateId) {
    case 'header-simple-001':
      return generateHeaderSimpleHTML(content, theme);
    case 'header-modern-002':
      return generateHeaderModernHTML(content, theme);
    case 'hero-modern-001':
      return generateHeroModernHTML(content, theme);
    case 'hero-split-002':
      return generateHeroSplitHTML(content, theme);
    case 'about-simple-001':
      return generateAboutSimpleHTML(content, theme);
    case 'about-team-002':
      return generateAboutTeamHTML(content, theme);
    case 'services-grid-001':
      return generateServicesGridHTML(content, theme);
    case 'features-list-001':
      return generateFeaturesListHTML(content, theme);
    case 'pricing-cards-001':
      return generatePricingCardsHTML(content, theme);
    case 'testimonials-grid-001':
      return generateTestimonialsGridHTML(content, theme);
    case 'portfolio-grid-001':
      return generatePortfolioGridHTML(content, theme);
    case 'contact-form-001':
      return generateContactFormHTML(content, theme);
    case 'footer-simple-001':
      return generateFooterSimpleHTML(content, theme);
    case 'footer-detailed-002':
      return generateFooterDetailedHTML(content, theme);
    case 'cta-simple-001':
      return generateCTASimpleHTML(content, theme);
    case 'blog-grid-001':
      return generateBlogGridHTML(content, theme);
    default:
      return `<!-- Unsupported section: ${section.templateId} -->`;
  }
};

// Icon mapping for HTML export
const getIconSVG = (iconName: string): string => {
  const icons: Record<string, string> = {
    'Palette': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5z"></path></svg>',
    'Code': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>',
    'Smartphone': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path></svg>',
    'TrendingUp': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>',
    'BarChart3': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
    'Shield': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
    'Zap': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
    'Lock': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>',
    'Facebook': '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    'Twitter': '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
    'Linkedin': '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    'Instagram': '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
  };
  
  return icons[iconName] || icons['Palette'];
};

const generateHeaderSimpleHTML = (content: any, theme: ThemeConfig): string => {
  return `
    <header class="sticky top-0 z-50 border-b backdrop-blur-xl" style="background-color: rgba(255, 255, 255, 0.95); border-color: var(--website-color-border);">
        <div class="container">
            <div class="flex items-center justify-between h-16">
                <h1 class="text-xl font-bold website-font-primary" style="color: var(--website-color-primary);">
                    ${content.logo}
                </h1>
                
                <nav class="desktop-menu flex items-center space-x-8">
                    ${content.menuItems.map((item: string) => `
                        <a href="#" class="font-medium hover:opacity-70 transition-opacity website-font-secondary" style="color: var(--website-color-text);">
                            ${item}
                        </a>
                    `).join('')}
                </nav>
                
                <div class="desktop-menu">
                    <a href="${content.ctaLink}" class="btn-primary">
                        ${content.ctaText}
                    </a>
                </div>
                
                <button class="mobile-menu p-2" onclick="toggleMobileMenu()">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>
            
            <div id="mobile-menu" class="mobile-menu" style="display: none; padding: 1rem 0; border-top: 1px solid var(--website-color-border);">
                ${content.menuItems.map((item: string) => `
                    <a href="#" class="block py-2 website-font-secondary" style="color: var(--website-color-text);">
                        ${item}
                    </a>
                `).join('')}
                <div class="pt-4">
                    <a href="${content.ctaLink}" class="btn-primary w-full text-center">
                        ${content.ctaText}
                    </a>
                </div>
            </div>
        </div>
    </header>
  `;
};

const generateHeaderModernHTML = (content: any, theme: ThemeConfig): string => {
  const headerStyle = content.hasGradient 
    ? `background: linear-gradient(135deg, var(--website-color-primary), var(--website-color-secondary));`
    : `background-color: rgba(255, 255, 255, 0.95); border-bottom: 1px solid var(--website-color-border);`;
  
  const textColor = content.hasGradient ? '#ffffff' : 'var(--website-color-text)';
  const ctaStyle = content.hasGradient 
    ? 'background-color: #ffffff; color: var(--website-color-primary);'
    : 'background: linear-gradient(135deg, var(--website-color-primary), var(--website-color-secondary)); color: white;';

  return `
    <header class="sticky top-0 z-50 backdrop-blur-xl" style="${headerStyle}">
        <div class="container">
            <div class="flex items-center justify-between h-16">
                <h1 class="text-xl font-bold website-font-primary" style="color: ${textColor};">
                    ${content.logo}
                </h1>
                
                <nav class="desktop-menu flex items-center space-x-8">
                    ${content.menuItems.map((item: string) => `
                        <a href="#" class="font-medium hover:opacity-70 transition-opacity website-font-secondary" style="color: ${textColor};">
                            ${item}
                        </a>
                    `).join('')}
                </nav>
                
                <div class="desktop-menu">
                    <a href="${content.ctaLink}" class="px-4 py-2 rounded-lg font-medium transition-colors website-font-secondary" style="${ctaStyle}">
                        ${content.ctaText}
                    </a>
                </div>
                
                <button class="mobile-menu p-2" onclick="toggleMobileMenu()" style="color: ${textColor};">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>
            
            <div id="mobile-menu" class="mobile-menu" style="display: none; padding: 1rem 0; border-top: 1px solid rgba(255,255,255,0.2);">
                ${content.menuItems.map((item: string) => `
                    <a href="#" class="block py-2 website-font-secondary" style="color: ${textColor};">
                        ${item}
                    </a>
                `).join('')}
                <div class="pt-4">
                    <a href="${content.ctaLink}" class="block w-full px-4 py-2 rounded-lg font-medium text-center transition-colors website-font-secondary" style="${ctaStyle}">
                        ${content.ctaText}
                    </a>
                </div>
            </div>
        </div>
    </header>
  `;
};

const generateHeroModernHTML = (content: any, theme: ThemeConfig): string => {
  return `
    <section class="relative min-h-screen flex items-center justify-center website-font-primary" style="background-image: url('${content.backgroundImage}'); background-size: cover; background-position: center;">
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="relative z-10 container text-center text-white">
            <h1 class="text-responsive-xl font-bold mb-6 website-font-primary animate-fade-in-up">
                ${content.title}
            </h1>
            <p class="text-responsive-lg mb-4 website-font-secondary animate-fade-in-up" style="animation-delay: 0.2s;">
                ${content.subtitle}
            </p>
            <p class="text-lg mb-8 max-w-2xl mx-auto opacity-90 website-font-secondary animate-fade-in-up" style="animation-delay: 0.4s;">
                ${content.description}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style="animation-delay: 0.6s;">
                <a href="${content.ctaLink}" class="btn-primary text-lg px-8 py-4">
                    ${content.ctaText}
                </a>
                ${content.secondaryCtaText ? `
                    <a href="#" class="btn-secondary text-lg px-8 py-4" style="border-color: white; color: white;">
                        ${content.secondaryCtaText}
                    </a>
                ` : ''}
            </div>
        </div>
    </section>
  `;
};

const generateHeroSplitHTML = (content: any, theme: ThemeConfig): string => {
  return `
    <section class="section-padding website-bg-background">
        <div class="container">
            <div class="grid-2 items-center">
                <div>
                    <h1 class="text-responsive-xl font-bold mb-6 website-font-primary" style="color: var(--website-color-primary);">
                        ${content.title}
                    </h1>
                    <p class="text-responsive-md mb-4 website-text-secondary website-font-secondary">
                        ${content.subtitle}
                    </p>
                    <p class="text-lg mb-6 website-text-secondary website-font-secondary">
                        ${content.description}
                    </p>
                    ${content.features ? content.features.map((feature: string) => `
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-5 h-5 rounded-full flex items-center justify-center" style="background-color: var(--website-color-success);">
                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="website-text-primary website-font-secondary">${feature}</span>
                        </div>
                    `).join('') : ''}
                    <div class="mt-8">
                        <a href="${content.ctaLink}" class="btn-primary text-lg px-8 py-4">
                            ${content.ctaText}
                        </a>
                    </div>
                </div>
                <div class="relative">
                    <img src="${content.image}" alt="${content.title}" class="rounded-2xl website-shadow-lg w-full">
                </div>
            </div>
        </div>
    </section>
  `;
};

const generateAboutSimpleHTML = (content: any, theme: ThemeConfig): string => {
  return `
    <section class="section-padding website-bg-surface">
        <div class="container">
            <div class="grid-2 items-center">
                <div>
                    <h2 class="text-responsive-lg font-bold mb-6 website-font-primary" style="color: var(--website-color-primary);">
                        ${content.title}
                    </h2>
                    <p class="text-lg mb-6 website-text-secondary website-font-secondary">
                        ${content.description}
                    </p>
                    ${content.features ? content.features.map((feature: string) => `
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-5 h-5 rounded-full flex items-center justify-center" style="background-color: var(--website-color-success);">
                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <span class="website-text-primary website-font-secondary">${feature}</span>
                        </div>
                    `).join('') : ''}
                </div>
                <div class="relative">
                    <img src="${content.image}" alt="${content.title}" class="rounded-2xl website-shadow-lg w-full">
                </div>
            </div>
        </div>
    </section>
  `;
};

const generateAboutTeamHTML = (content: any, theme: ThemeConfig): string => {
  return `
    <section class="section-padding website-bg-background">
        <div class="container">
            <div class="text-center mb-16">
                <h2 class="text-responsive-lg font-bold mb-4 website-font-primary" style="color: var(--website-color-primary);">
                    ${content.title}
                </h2>
                <p class="text-lg website-text-secondary website-font-secondary max-w-3xl mx-auto">
                    ${content.subtitle}
                </p>
            </div>
            <div class="grid-3">
                ${content.teamMembers.map((member: any) => `
                    <div class="text-center rounded-xl p-6 website-bg-surface website-shadow-lg">
                        <img src="${member.image}" alt="${member.name}" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover">
                        <h3 class="text-xl font-semibold mb-2 website-text-primary website-font-primary">
                            ${member.name}
                        </h3>
                        <p class="mb-3 website-font-secondary" style="color: var(--website-color-primary);">
                            ${member.role}
                        </p>
                        <p class="text-sm website-text-secondary website-font-secondary">
                            ${member.bio}
                        </p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
  `;
};

const generateServicesGridHTML = (content: any, theme: ThemeConfig): string => {
  return `
    <section class="section-padding website-bg-background">
        <div class="container">
            <div class="text-center mb-16">
                <h2 class="text-responsive-lg font-bold mb-4 website-font-primary" style="color: var(--website-color-primary);">
                    ${content.title}
                </h2>
                <p class="text-lg website-text-secondary website-font-secondary max-w-2xl mx-auto">
                    ${content.subtitle}
                </p>
            </div>
            <div class="grid-3">
                ${content.services.map((service: any) => `
                    <div class="website-bg-surface rounded-xl p-8 website-shadow-lg hover:website-shadow-xl transition-shadow">
                        <div class="w-16 h-16 website-gradient-primary rounded-xl flex items-center justify-center mb-6">
                            ${getIconSVG(service.icon)}
                        </div>
                        <h3 class="text-xl font-bold mb-4 website-text-primary website-font-primary">
                            ${service.title}
                        </h3>
                        <p class="website-text-secondary website-font-secondary">
                            ${service.description}
                        </p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
  `;
};

const generateFeaturesListHTML = (content: any, theme: ThemeConfig): string => {
  return `
    <section class="section-padding website-bg-surface">
        <div class="container">
            <div class="text-center mb-16">
                <h2 class="text-responsive-lg font-bold mb-4 website-font-primary" style="color: var(--website-color-primary);">
                    ${content.title}
                </h2>
                <p class="text-lg website-text-secondary website-font-secondary max-w-3xl mx-auto">
                    ${content.subtitle}
                </p>
            </div>
            <div class="grid-2">
                ${content.features.map((feature: any) => `
                    <div class="flex items-start gap-4 p-6 rounded-xl website-bg-background border" style="border-color: var(--website-color-border);">
                        <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style="background-color: rgba(var(--website-color-primary-rgb), 0.2);">
                            ${getIconSVG(feature.icon)}
                        </div>
                        <div class="flex-1">
                            <h3 class="text-xl font-semibold mb-2 website-text-primary website-font-primary">
                                ${feature.title}
                            </h3>
                            <p class="website-text-secondary website-font-secondary">
                                ${feature.description}
                            </p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
  `;
};

const generatePricingCardsHTML = (content: any, theme: ThemeConfig): string => {
  return `
    <section class="section-padding website-bg-surface">
        <div class="container">
            <div class="text-center mb-16">
                <h2 class="text-responsive-lg font-bold mb-4 website-font-primary" style="color: var(--website-color-primary);">
                    ${content.title}
                </h2>
            </div>
            <div class="grid-3">
                ${content.plans.map((plan: any, index: number) => `
                    <div class="website-bg-background rounded-xl p-8 website-shadow-lg ${index === 1 ? 'transform scale-105' : ''}" style="border: 2px solid ${index === 1 ? 'var(--website-color-primary)' : 'var(--website-color-border)'};">
                        ${index === 1 ? `<div class="text-center -mt-4 mb-4">
                            <span class="website-gradient-primary text-white px-4 py-1 rounded-full text-sm font-semibold">Popular</span>
                        </div>` : ''}
                        <div class="text-center mb-8">
                            <h3 class="text-2xl font-bold mb-4 website-text-primary website-font-primary">
                                ${plan.name}
                            </h3>
                            <div class="text-4xl font-bold mb-2 website-font-accent" style="color: var(--website-color-primary);">
                                ${plan.price}
                            </div>
                            <p class="website-text-secondary website-font-secondary">per month</p>
                        </div>
                        <div class="space-y-4 mb-8">
                            ${plan.features.map((feature: string) => `
                                <div class="flex items-center gap-3">
                                    <div class="w-5 h-5 rounded-full flex items-center justify-center" style="background-color: rgba(var(--website-color-success-rgb), 0.2);">
                                        <svg class="w-3 h-3" style="color: var(--website-color-success);" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                    </div>
                                    <span class="website-text-primary website-font-secondary">${feature}</span>
                                </div>
                            `).join('')}
                        </div>
                        <button class="w-full btn-primary">Get Started</button>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
  `;
};

const generateTestimonialsGridHTML = (content: any, theme: ThemeConfig): string => {
  return `
    <section class="section-padding website-bg-background">
        <div class="container">
            <div class="text-center mb-16">
                <h2 class="text-responsive-lg font-bold mb-4 website-font-primary" style="color: var(--website-color-primary);">
                    ${content.title}
                </h2>
                <p class="text-lg website-text-secondary website-font-secondary max-w-3xl mx-auto">
                    ${content.subtitle}
                </p>
            </div>
            <div class="grid-3">
                ${content.testimonials.map((testimonial: any) => `
                    <div class="website-bg-surface rounded-xl p-6 website-shadow-lg">
                        <div class="flex items-center gap-4 mb-4">
                            <img src="${testimonial.avatar}" alt="${testimonial.name}" class="w-12 h-12 rounded-full object-cover">
                            <div class="flex-1">
                                <h4 class="font-semibold website-text-primary website-font-primary">
                                    ${testimonial.name}
                                </h4>
                                <p class="text-sm website-text-secondary website-font-secondary">
                                    ${testimonial.role}, ${testimonial.company}
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-1 mb-4">
                            ${Array.from({ length: 5 }, (_, i) => `
                                <svg class="w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                            `).join('')}
                        </div>
                        <p class="italic website-text-secondary website-font-secondary">
                            "${testimonial.content}"
                        </p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
  `;
};

const generatePortfolioGridHTML = (content: any, theme: ThemeConfig): string => {
  return `
    <section class="section-padding website-bg-background">
        <div class="container">
            <div class="text-center mb-16">
                <h2 class="text-responsive-lg font-bold mb-4 website-font-primary" style="color: var(--website-color-primary);">
                    ${content.title}
                </h2>
                ${content.subtitle ? `
                    <p class="text-lg website-text-secondary website-font-secondary max-w-3xl mx-auto">
                        ${content.subtitle}
                    </p>
                ` : ''}
            </div>
            <div class="grid-3">
                ${content.projects.map((project: any) => `
                    <div class="website-bg-surface rounded-xl overflow-hidden website-shadow-lg hover:website-shadow-xl transition-shadow group">
                        <div class="relative overflow-hidden">
                            <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300">
                            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                <a href="${project.url}" class="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 transform website-shadow-lg">
                                    <svg class="w-5 h-5 website-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="mb-3">
                                <span class="text-sm font-medium website-font-secondary" style="color: var(--website-color-primary);">
                                    ${project.category}
                                </span>
                            </div>
                            <h3 class="text-xl font-semibold mb-3 website-text-primary website-font-primary">
                                ${project.title}
                            </h3>
                            <p class="leading-relaxed text-sm website-text-secondary website-font-secondary">
                                ${project.description}
                            </p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
  `;
};

const generateContactFormHTML = (content: any, theme: ThemeConfig): string => {
  return `
    <section class="section-padding website-bg-background">
        <div class="container-lg">
            <div class="text-center mb-16">
                <h2 class="text-responsive-lg font-bold mb-4 website-font-primary" style="color: var(--website-color-primary);">
                    ${content.title}
                </h2>
                <p class="text-lg website-text-secondary website-font-secondary">
                    ${content.subtitle}
                </p>
            </div>
            <div class="grid-2">
                <div class="space-y-6">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-lg flex items-center justify-center" style="background-color: rgba(var(--website-color-primary-rgb), 0.2);">
                            <svg class="w-6 h-6" style="color: var(--website-color-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold mb-1 website-text-primary website-font-primary">Email</h3>
                            <p class="website-text-secondary website-font-secondary">${content.email}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-lg flex items-center justify-center" style="background-color: rgba(var(--website-color-primary-rgb), 0.2);">
                            <svg class="w-6 h-6" style="color: var(--website-color-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold mb-1 website-text-primary website-font-primary">Phone</h3>
                            <p class="website-text-secondary website-font-secondary">${content.phone}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-lg flex items-center justify-center" style="background-color: rgba(var(--website-color-primary-rgb), 0.2);">
                            <svg class="w-6 h-6" style="color: var(--website-color-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold mb-1 website-text-primary website-font-primary">Address</h3>
                            <p class="website-text-secondary website-font-secondary">${content.address}</p>
                        </div>
                    </div>
                </div>
                <div class="website-bg-surface rounded-2xl p-8 website-shadow-lg">
                    <form onsubmit="handleFormSubmit(event)">
                        <div class="grid-2 mb-6">
                            <input type="text" placeholder="Your Name" class="form-input" required>
                            <input type="email" placeholder="Your Email" class="form-input" required>
                        </div>
                        <input type="text" placeholder="Subject" class="form-input mb-6" required>
                        <textarea placeholder="Your Message" class="form-textarea mb-6" required></textarea>
                        <button type="submit" class="btn-primary w-full">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
  `;
};

const generateFooterSimpleHTML = (content: any, theme: ThemeConfig): string => {
  return `
    <footer class="py-12 website-gradient-primary text-white">
        <div class="container">
            <div class="text-center">
                <h3 class="text-2xl font-bold mb-4 website-font-primary">${content.companyName}</h3>
                <p class="mb-6 website-font-secondary">${content.description}</p>
                <div class="flex justify-center space-x-6 mb-6">
                    ${content.socialLinks ? content.socialLinks.map((link: any) => `
                        <a href="${link.url}" class="hover:opacity-70 transition-opacity" target="_blank" rel="noopener noreferrer">
                            ${getIconSVG(link.icon)}
                        </a>
                    `).join('') : ''}
                </div>
                <p class="text-sm opacity-70 website-font-secondary">${content.copyright}</p>
            </div>
        </div>
    </footer>
  `;
};

const generateFooterDetailedHTML = (content: any, theme: ThemeConfig): string => {
  return `
    <footer class="py-16 website-gradient-primary text-white">
        <div class="container">
            <div class="grid-4 mb-12">
                <div>
                    <h3 class="text-2xl font-bold mb-4 website-font-primary">${content.companyName}</h3>
                    <p class="mb-6 opacity-90 website-font-secondary">${content.description}</p>
                    <div class="flex space-x-4">
                        ${content.socialLinks ? content.socialLinks.map((link: any) => `
                            <a href="${link.url}" class="hover:opacity-70 transition-opacity" target="_blank" rel="noopener noreferrer">
                                ${getIconSVG(link.icon)}
                            </a>
                        `).join('') : ''}
                    </div>
                </div>
                ${content.sections ? content.sections.map((section: any) => `
                    <div>
                        <h4 class="text-lg font-semibold mb-4 website-font-primary">${section.title}</h4>
                        <ul class="space-y-2">
                            ${section.links.map((link: string) => `
                                <li>
                                    <a href="#" class="opacity-90 hover:opacity-100 transition-opacity website-font-secondary">
                                        ${link}
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('') : ''}
            </div>
            <div class="border-t border-white/20 pt-8 text-center">
                <p class="text-sm opacity-70 website-font-secondary">${content.copyright}</p>
            </div>
        </div>
    </footer>
  `;
};

const generateCTASimpleHTML = (content: any, theme: ThemeConfig): string => {
  return `
    <section class="section-padding website-gradient-primary text-white">
        <div class="container text-center">
            <h2 class="text-responsive-lg font-bold mb-6 website-font-primary">
                ${content.title}
            </h2>
            <p class="text-lg mb-8 max-w-2xl mx-auto opacity-90 website-font-secondary">
                ${content.description}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="${content.ctaLink}" class="inline-block px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-semibold website-font-secondary">
                    ${content.ctaText}
                </a>
                ${content.secondaryCtaText ? `
                    <a href="#" class="inline-block px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-semibold website-font-secondary">
                        ${content.secondaryCtaText}
                    </a>
                ` : ''}
            </div>
        </div>
    </section>
  `;
};

const generateBlogGridHTML = (content: any, theme: ThemeConfig): string => {
  return `
    <section class="section-padding website-bg-background">
        <div class="container">
            <div class="text-center mb-16">
                <h2 class="text-responsive-lg font-bold mb-4 website-font-primary" style="color: var(--website-color-primary);">
                    ${content.title}
                </h2>
                <p class="text-lg website-text-secondary website-font-secondary max-w-3xl mx-auto">
                    ${content.subtitle}
                </p>
            </div>
            <div class="grid-3">
                ${content.posts.map((post: any) => `
                    <article class="website-bg-surface rounded-xl overflow-hidden website-shadow-lg hover:website-shadow-xl transition-shadow">
                        <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover">
                        <div class="p-6">
                            <div class="flex items-center gap-4 mb-3 text-sm">
                                <div class="flex items-center gap-1">
                                    <svg class="w-4 h-4 website-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <span class="website-text-secondary website-font-secondary">
                                        ${new Date(post.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <svg class="w-4 h-4 website-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    <span class="website-text-secondary website-font-secondary">
                                        ${post.author}
                                    </span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <span class="text-sm font-medium website-font-secondary" style="color: var(--website-color-primary);">
                                    ${post.category}
                                </span>
                            </div>
                            <h3 class="text-xl font-semibold mb-3 website-text-primary website-font-primary">
                                ${post.title}
                            </h3>
                            <p class="leading-relaxed mb-4 text-sm website-text-secondary website-font-secondary">
                                ${post.excerpt}
                            </p>
                            <a href="${post.url}" class="inline-block font-medium hover:underline website-font-secondary" style="color: var(--website-color-primary);">
                                Read More →
                            </a>
                        </div>
                    </article>
                `).join('')}
            </div>
        </div>
    </section>
  `;
};