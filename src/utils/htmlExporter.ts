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
        .website-bg-success { background-color: var(--website-color-success); }
        .website-bg-warning { background-color: var(--website-color-warning); }
        .website-bg-error { background-color: var(--website-color-error); }
        
        .website-text-primary { color: var(--website-color-text); }
        .website-text-secondary { color: var(--website-color-text-secondary); }
        .website-text-accent { color: var(--website-color-accent); }
        .website-text-white { color: #ffffff; }
        .website-text-success { color: var(--website-color-success); }
        .website-text-warning { color: var(--website-color-warning); }
        .website-text-error { color: var(--website-color-error); }
        
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
        
        .website-gradient-secondary {
            background: linear-gradient(135deg, var(--website-color-secondary), var(--website-color-accent));
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
            font-size: 16px;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: var(--website-shadow-lg);
            opacity: 0.9;
            text-decoration: none;
            color: white;
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
            font-size: 16px;
        }
        
        .btn-secondary:hover {
            background: var(--website-color-primary);
            color: white;
            transform: translateY(-2px);
            text-decoration: none;
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
        
        .container-sm {
            max-width: 800px;
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
        .font-light { font-weight: 300; }
        
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
        
        @keyframes fadeInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-fade-in-left {
            animation: fadeInLeft 0.6s ease-out;
        }
        
        .animate-fade-in-right {
            animation: fadeInRight 0.6s ease-out;
        }
        
        .animate-fade-in {
            animation: fadeIn 0.6s ease-out;
        }
        
        /* Hover Effects */
        .hover-scale:hover {
            transform: scale(1.05);
            transition: transform 0.3s ease;
        }
        
        .hover-shadow:hover {
            box-shadow: var(--website-shadow-xl);
            transition: box-shadow 0.3s ease;
        }
        
        /* Mobile Menu Styles */
        .mobile-menu {
            display: none;
        }
        
        .mobile-menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 40;
            display: none;
        }
        
        .mobile-menu-panel {
            position: fixed;
            top: 0;
            right: -100%;
            width: 280px;
            height: 100vh;
            background: var(--website-color-background);
            z-index: 50;
            transition: right 0.3s ease;
            overflow-y: auto;
            padding: 1rem;
        }
        
        .mobile-menu-panel.open {
            right: 0;
        }
        
        @media (max-width: 768px) {
            .desktop-menu { display: none; }
            .mobile-menu { display: block; }
        }
        
        /* Responsive Text */
        @media (max-width: 768px) {
            .text-responsive-xl { font-size: 2rem; line-height: 1.2; }
            .text-responsive-lg { font-size: 1.5rem; line-height: 1.3; }
            .text-responsive-md { font-size: 1.25rem; line-height: 1.4; }
        }
        
        @media (min-width: 769px) {
            .text-responsive-xl { font-size: 3rem; line-height: 1.2; }
            .text-responsive-lg { font-size: 2rem; line-height: 1.3; }
            .text-responsive-md { font-size: 1.5rem; line-height: 1.4; }
        }
        
        @media (min-width: 1024px) {
            .text-responsive-xl { font-size: 4rem; line-height: 1.1; }
            .text-responsive-lg { font-size: 2.5rem; line-height: 1.2; }
            .text-responsive-md { font-size: 1.75rem; line-height: 1.3; }
        }
        
        /* Icon Styles */
        .icon {
            width: 1.5rem;
            height: 1.5rem;
            display: inline-block;
            vertical-align: middle;
            fill: currentColor;
            color: inherit;
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
        
        .icon-2xl {
            width: 4rem;
            height: 4rem;
        }
        
        /* Card Styles */
        .card {
            background: var(--website-color-surface);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: var(--website-shadow-md);
            transition: all 0.3s ease;
        }
        
        .card:hover {
            box-shadow: var(--website-shadow-lg);
            transform: translateY(-2px);
        }
        
        /* Badge Styles */
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 9999px;
            background: var(--website-color-primary);
            color: white;
        }
        
        .badge-secondary {
            background: var(--website-color-secondary);
        }
        
        .badge-accent {
            background: var(--website-color-accent);
        }
        
        /* Loading States */
        .loading {
            opacity: 0.7;
            pointer-events: none;
        }
        
        /* Focus Styles */
        *:focus {
            outline: 2px solid var(--website-color-primary);
            outline-offset: 2px;
        }
        
        /* Print Styles */
        @media print {
            .no-print {
                display: none !important;
            }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .auto-dark {
                filter: invert(1) hue-rotate(180deg);
            }
        }
    </style>
    <script>
        // Mobile menu toggle
        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            const overlay = document.getElementById('mobile-menu-overlay');
            const panel = document.getElementById('mobile-menu-panel');
            
            if (menu && overlay && panel) {
                const isOpen = panel.classList.contains('open');
                
                if (isOpen) {
                    panel.classList.remove('open');
                    overlay.style.display = 'none';
                    document.body.style.overflow = '';
                } else {
                    panel.classList.add('open');
                    overlay.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            }
        }
        
        // Close mobile menu when clicking overlay
        function closeMobileMenu() {
            const overlay = document.getElementById('mobile-menu-overlay');
            const panel = document.getElementById('mobile-menu-panel');
            
            if (overlay && panel) {
                panel.classList.remove('open');
                overlay.style.display = 'none';
                document.body.style.overflow = '';
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
                        target.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                        // Close mobile menu if open
                        closeMobileMenu();
                    }
                });
            });
            
            // Add scroll-based animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = entry.target.dataset.animation || 'fadeInUp 0.6s ease-out';
                        entry.target.style.opacity = '1';
                    }
                });
            }, observerOptions);
            
            // Observe elements with animation classes
            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                el.style.opacity = '0';
                observer.observe(el);
            });
        });
        
        // Form submission handler
        function handleFormSubmit(event) {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1000);
        }
        
        // Add keyboard navigation support
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
        
        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    </script>
</head>
<body>
    <!-- Mobile Menu Overlay -->
    <div id="mobile-menu-overlay" class="mobile-menu-overlay" onclick="closeMobileMenu()"></div>
    
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

// Icon mapping with exact SVG paths
const getIconSVG = (iconName: string): string => {
    const icons: Record<string, string> = {
        // Design & Creative
        'Palette': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5z"></path></svg>',
        'PaintBrush': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5z"></path></svg>',

        // Technology & Development
        'Code': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>',
        'Code2': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m18 16 4-4-4-4M6 8l-4 4 4 4m14.5-13-5 14"></path></svg>',
        'Monitor': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="8" y1="21" x2="16" y2="21"></line><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" y1="17" x2="12" y2="21"></line></svg>',
        'Smartphone': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01"></path></svg>',
        'Laptop': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 16V7a2 2 0 00-2-2H6a2 2 0 00-2 2v9m16 0H4m16 0l1.28 2.55a1 1 0 01-.9 1.45H3.62a1 1 0 01-.9-1.45L4 16"></path></svg>',
        'Database': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><ellipse stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="12" cy="5" rx="9" ry="3"></ellipse><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"></path></svg>',
        'Server': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="2" y="3" width="20" height="4" rx="1"></rect><rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="2" y="9" width="20" height="4" rx="1"></rect><rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="2" y="15" width="20" height="4" rx="1"></rect><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="6" y1="5" x2="6.01" y2="5"></line><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="6" y1="11" x2="6.01" y2="11"></line><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="6" y1="17" x2="6.01" y2="17"></line></svg>',
        'Globe': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="12" cy="12" r="10"></circle><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="2" y1="12" x2="22" y2="12"></line><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',

        // Business & Analytics
        'TrendingUp': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>',
        'BarChart': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" y1="20" x2="12" y2="10"></line><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="18" y1="20" x2="18" y2="4"></line><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="6" y1="20" x2="6" y2="16"></line></svg>',
        'BarChart3': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
        'PieChart': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z"></path></svg>',
        'DollarSign': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" y1="1" x2="12" y2="23"></line><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path></svg>',
        'CreditCard': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="1" y1="10" x2="23" y2="10"></line></svg>',
        'Briefcase': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"></path></svg>',
        'Building': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="12" cy="10" r="3"></circle></svg>',

        // Security & Protection
        'Shield': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
        'ShieldCheck': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
        'Lock': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11V7a5 5 0 0110 0v4"></path></svg>',
        'Key': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"></path></svg>',

        // Performance & Speed
        'Zap': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="13,2 3,14 12,14 11,22 21,10 12,10"></polygon></svg>',
        'Gauge': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 100-6 3 3 0 000 6zm0 0v6m9-9.5a9 9 0 11-18 0"></path></svg>',
        'Timer': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="12" cy="13" r="8"></circle><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v4l2 2m6-6l-2-2M6 6l2 2"></path></svg>',
        'Activity': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline></svg>',
        'Rocket': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c-2.22 0-4.44.87-6.05 2.05A22 22 0 0113 6l-3 3 2 2z"></path></svg>',

        // Communication & Social
        'Mail': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="22,6 12,13 2,6"></polyline></svg>',
        'Phone': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path></svg>',
        'MessageCircle': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path></svg>',
        'Send': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="22" y1="2" x2="11" y2="13"></line><polygon stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="22,2 15,22 11,13 2,9"></polygon></svg>',
        'Users': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="9" cy="7" r="4"></circle><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75"></path></svg>',
        'User': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="12" cy="7" r="4"></circle></svg>',

        // Social Media
        'Facebook': '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
        'Twitter': '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
        'Instagram': '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
        'LinkedIn': '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
        'Youtube': '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
        'Github': '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',

        // UI & Interface
        'Star': '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
        'Heart': '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
        'Check': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="20,6 9,17 4,12"></polyline></svg>',
        'CheckCircle': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
        'X': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="18" y1="6" x2="6" y2="18"></line><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="6" y1="6" x2="18" y2="18"></line></svg>',
        'ArrowRight': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="5" y1="12" x2="19" y2="12"></line><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="12,5 19,12 12,19"></polyline></svg>',
        'ChevronDown': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="6,9 12,15 18,9"></polyline></svg>',
        'Menu': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="3" y1="6" x2="21" y2="6"></line><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="3" y1="12" x2="21" y2="12"></line><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="3" y1="18" x2="21" y2="18"></line></svg>',
        'Search': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="11" cy="11" r="8"></circle><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35"></path></svg>',
        'Settings': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="12" cy="12" r="3"></circle><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
        'MapPin': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="12" cy="10" r="3"></circle></svg>',
        'Clock': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="12" cy="12" r="10"></circle><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="12,6 12,12 16,14"></polyline></svg>',
        'Calendar': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16" y1="2" x2="16" y2="6"></line><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="8" y1="2" x2="8" y2="6"></line><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="3" y1="10" x2="21" y2="10"></line></svg>',
        'Camera': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="12" cy="13" r="4"></circle></svg>',
        'Image': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="8.5" cy="8.5" r="1.5"></circle><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="21,15 16,10 5,21"></polyline></svg>',
        'Video': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="23,7 16,12 23,17"></polygon><rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>',
        'Download': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="7,10 12,15 17,10"></polyline><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" y1="15" x2="12" y2="3"></line></svg>',
        'Upload': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="17,8 12,3 7,8"></polyline><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" y1="3" x2="12" y2="15"></line></svg>',
        'Link': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
        'ExternalLink': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="15,3 21,3 21,9"></polyline><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="10" y1="14" x2="21" y2="3"></line></svg>',
        'Eye': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="12" cy="12" r="3"></circle></svg>',
        'EyeOff': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="1" y1="1" x2="23" y2="23"></line></svg>',
        'Play': '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"></polygon></svg>',
        'Pause': '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',
        'Plus': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" y1="5" x2="12" y2="19"></line><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="5" y1="12" x2="19" y2="12"></line></svg>',
        'Minus': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="5" y1="12" x2="19" y2="12"></line></svg>',
        'Edit': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
        'Trash': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="3,6 5,6 21,6"></polyline><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
        'Copy': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
        'File': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="13,2 13,9 20,9"></polyline></svg>',
        'Folder': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
        'Award': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="12" cy="8" r="7"></circle><polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="8.21,13.89 7,23 12,20 17,23 15.79,13.88"></polyline></svg>',
        'Target': '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="12" cy="12" r="10"></circle><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="12" cy="12" r="6"></circle><circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="12" cy="12" r="2"></circle></svg>',
    };

    return icons[iconName] || icons['Star'];
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
                        <a href="#${item.toLowerCase()}" class="font-medium hover:opacity-70 transition-opacity website-font-secondary" style="color: var(--website-color-text);">
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
                    ${getIconSVG('Menu')}
                </button>
            </div>
        </div>
    </header>
    
    <div id="mobile-menu-panel" class="mobile-menu-panel">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold website-font-primary" style="color: var(--website-color-primary);">
                ${content.logo}
            </h2>
            <button onclick="closeMobileMenu()" class="p-2">
                ${getIconSVG('X')}
            </button>
        </div>
        <nav class="space-y-4">
            ${content.menuItems.map((item: string) => `
                <a href="#${item.toLowerCase()}" class="block py-2 website-font-secondary" style="color: var(--website-color-text);" onclick="closeMobileMenu()">
                    ${item}
                </a>
            `).join('')}
            <div class="pt-4">
                <a href="${content.ctaLink}" class="btn-primary w-full text-center" onclick="closeMobileMenu()">
                    ${content.ctaText}
                </a>
            </div>
        </nav>
    </div>
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
                        <a href="#${item.toLowerCase()}" class="font-medium hover:opacity-70 transition-opacity website-font-secondary" style="color: ${textColor};">
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
                    ${getIconSVG('Menu')}
                </button>
            </div>
        </div>
    </header>
    
    <div id="mobile-menu-panel" class="mobile-menu-panel" style="background: ${content.hasGradient ? 'linear-gradient(135deg, var(--website-color-primary), var(--website-color-secondary))' : 'var(--website-color-background)'};">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold website-font-primary" style="color: ${textColor};">
                ${content.logo}
            </h2>
            <button onclick="closeMobileMenu()" class="p-2" style="color: ${textColor};">
                ${getIconSVG('X')}
            </button>
        </div>
        <nav class="space-y-4">
            ${content.menuItems.map((item: string) => `
                <a href="#${item.toLowerCase()}" class="block py-2 website-font-secondary" style="color: ${textColor};" onclick="closeMobileMenu()">
                    ${item}
                </a>
            `).join('')}
            <div class="pt-4">
                <a href="${content.ctaLink}" class="block w-full px-4 py-2 rounded-lg font-medium text-center transition-colors website-font-secondary" style="${ctaStyle}" onclick="closeMobileMenu()">
                    ${content.ctaText}
                </a>
            </div>
        </nav>
    </div>
  `;
};

const generateHeroModernHTML = (content: any, theme: ThemeConfig): string => {
    return `
    <section id="home" class="relative min-h-screen flex items-center justify-center website-font-primary" style="background-image: url('${content.backgroundImage}'); background-size: cover; background-position: center;">
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="relative z-10 container text-center text-white animate-on-scroll" data-animation="fadeInUp 0.6s ease-out">
            <h1 class="text-responsive-xl font-bold mb-6 website-font-primary">
                ${content.title}
            </h1>
            <p class="text-responsive-lg mb-4 website-font-secondary">
                ${content.subtitle}
            </p>
            <p class="text-lg mb-8 max-w-2xl mx-auto opacity-90 website-font-secondary">
                ${content.description}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="${content.ctaLink}" class="btn-primary text-lg px-8 py-4">
                    ${content.ctaText}
                </a>
                ${content.secondaryCtaText ? `
                    <a href="${content.secondaryCtaLink || '#about'}" class="btn-secondary text-lg px-8 py-4" style="border-color: white; color: white;">
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
    <section id="home" class="section-padding website-bg-background">
        <div class="container">
            <div class="grid-2 items-center gap-12">
                <div class="animate-on-scroll" data-animation="fadeInLeft 0.6s ease-out">
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
                                ${getIconSVG('Check')}
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
                <div class="relative animate-on-scroll" data-animation="fadeInRight 0.6s ease-out">
                    <img src="${content.image}" alt="${content.title}" class="rounded-2xl website-shadow-lg w-full">
                </div>
            </div>
        </div>
    </section>
  `;
};

const generateAboutSimpleHTML = (content: any, theme: ThemeConfig): string => {
    return `
    <section id="about" class="section-padding website-bg-surface">
        <div class="container">
            <div class="grid-2 items-center gap-12">
                <div class="animate-on-scroll" data-animation="fadeInLeft 0.6s ease-out">
                    <h2 class="text-responsive-lg font-bold mb-6 website-font-primary" style="color: var(--website-color-primary);">
                        ${content.title}
                    </h2>
                    <p class="text-lg mb-6 website-text-secondary website-font-secondary">
                        ${content.description}
                    </p>
                    ${content.features ? content.features.map((feature: string) => `
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-5 h-5 rounded-full flex items-center justify-center" style="background-color: var(--website-color-success);">
                                ${getIconSVG('Check')}
                            </div>
                            <span class="website-text-primary website-font-secondary">${feature}</span>
                        </div>
                    `).join('') : ''}
                </div>
                <div class="relative animate-on-scroll" data-animation="fadeInRight 0.6s ease-out">
                    <img src="${content.image}" alt="${content.title}" class="rounded-2xl website-shadow-lg w-full">
                </div>
            </div>
        </div>
    </section>
  `;
};

const generateAboutTeamHTML = (content: any, theme: ThemeConfig): string => {
    return `
    <section id="team" class="section-padding website-bg-background">
        <div class="container">
            <div class="text-center mb-16 animate-on-scroll" data-animation="fadeInUp 0.6s ease-out">
                <h2 class="text-responsive-lg font-bold mb-4 website-font-primary" style="color: var(--website-color-primary);">
                    ${content.title}
                </h2>
                <p class="text-lg website-text-secondary website-font-secondary max-w-3xl mx-auto">
                    ${content.subtitle}
                </p>
            </div>
            <div class="grid-3 gap-8">
                ${content.teamMembers.map((member: any, index: number) => `
                    <div class="text-center rounded-xl p-6 website-bg-surface website-shadow-lg hover-shadow animate-on-scroll" data-animation="fadeInUp ${0.6 + index * 0.1}s ease-out">
                        <img src="${member.image}" alt="${member.name}" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover website-shadow-md">
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
    <section id="services" class="section-padding website-bg-background">
        <div class="container">
            <div class="text-center mb-16 animate-on-scroll" data-animation="fadeInUp 0.6s ease-out">
                <h2 class="text-responsive-lg font-bold mb-4 website-font-primary" style="color: var(--website-color-primary);">
                    ${content.title}
                </h2>
                <p class="text-lg website-text-secondary website-font-secondary max-w-2xl mx-auto">
                    ${content.subtitle}
                </p>
            </div>
            <div class="grid-3 gap-8">
                ${content.services.map((service: any, index: number) => `
                    <div class="website-bg-surface rounded-xl p-8 website-shadow-lg hover-shadow animate-on-scroll" data-animation="fadeInUp ${0.6 + index * 0.1}s ease-out">
                        <div class="w-16 h-16 website-gradient-primary rounded-xl flex items-center justify-center mb-6 text-white">
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
    <section id="features" class="section-padding website-bg-surface">
        <div class="container">
            <div class="text-center mb-16 animate-on-scroll" data-animation="fadeInUp 0.6s ease-out">
                <h2 class="text-responsive-lg font-bold mb-4 website-font-primary" style="color: var(--website-color-primary);">
                    ${content.title}
                </h2>
                <p class="text-lg website-text-secondary website-font-secondary max-w-3xl mx-auto">
                    ${content.subtitle}
                </p>
            </div>
            <div class="grid-2 gap-8">
                ${content.features.map((feature: any, index: number) => `
                    <div class="flex items-start gap-4 p-6 rounded-xl website-bg-background border hover-shadow animate-on-scroll" style="border-color: var(--website-color-border);" data-animation="fadeInUp ${0.6 + index * 0.1}s ease-out">
                        <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style="background-color: rgba(var(--website-color-primary-rgb), 0.2); color: var(--website-color-primary);">
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
    <section id="pricing" class="section-padding website-bg-surface">
        <div class="container">
            <div class="text-center mb-16 animate-on-scroll" data-animation="fadeInUp 0.6s ease-out">
                <h2 class="text-responsive-lg font-bold mb-4 website-font-primary" style="color: var(--website-color-primary);">
                    ${content.title}
                </h2>
            </div>
            <div class="grid-3 gap-8">
                ${content.plans.map((plan: any, index: number) => `
                    <div class="website-bg-background rounded-xl p-8 website-shadow-lg hover-shadow animate-on-scroll ${index === 1 ? 'transform scale-105' : ''}" style="border: 2px solid ${index === 1 ? 'var(--website-color-primary)' : 'var(--website-color-border)'};" data-animation="fadeInUp ${0.6 + index * 0.1}s ease-out">
                        ${index === 1 ? `<div class="text-center -mt-4 mb-4">
                            <span class="website-gradient-primary text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
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
                                    <div class="w-5 h-5 rounded-full flex items-center justify-center" style="background-color: rgba(var(--website-color-success-rgb), 0.2); color: var(--website-color-success);">
                                        ${getIconSVG('Check')}
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
    <section id="testimonials" class="section-padding website-bg-background">
        <div class="container">
            <div class="text-center mb-16 animate-on-scroll" data-animation="fadeInUp 0.6s ease-out">
                <h2 class="text-responsive-lg font-bold mb-4 website-font-primary" style="color: var(--website-color-primary);">
                    ${content.title}
                </h2>
                <p class="text-lg website-text-secondary website-font-secondary max-w-3xl mx-auto">
                    ${content.subtitle}
                </p>
            </div>
            <div class="grid-3 gap-8">
                ${content.testimonials.map((testimonial: any, index: number) => `
                    <div class="website-bg-surface rounded-xl p-6 website-shadow-lg hover-shadow animate-on-scroll" data-animation="fadeInUp ${0.6 + index * 0.1}s ease-out">
                        <div class="flex items-center gap-4 mb-4">
                            <img src="${testimonial.avatar}" alt="${testimonial.name}" class="w-12 h-12 rounded-full object-cover website-shadow-sm">
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
                                <svg class="w-4 h-4 ${i < (testimonial.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
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
    <section id="portfolio" class="section-padding website-bg-background">
        <div class="container">
            <div class="text-center mb-16 animate-on-scroll" data-animation="fadeInUp 0.6s ease-out">
                <h2 class="text-responsive-lg font-bold mb-4 website-font-primary" style="color: var(--website-color-primary);">
                    ${content.title}
                </h2>
                <p class="text-lg website-text-secondary website-font-secondary max-w-3xl mx-auto">
                    ${content.subtitle}
                </p>
            </div>
            <div class="grid-3 gap-8">
                ${content.projects.map((project: any, index: number) => `
                    <div class="website-bg-surface rounded-xl overflow-hidden website-shadow-lg hover-shadow group animate-on-scroll" data-animation="fadeInUp ${0.6 + index * 0.1}s ease-out">
                        <div class="relative overflow-hidden">
                            <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300">
                            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                <a href="${project.url}" class="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover-scale website-shadow-lg">
                                    ${getIconSVG('ExternalLink')}
                                </a>
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="mb-3">
                                <span class="text-sm font-medium website-font-secondary badge" style="background-color: var(--website-color-primary);">
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
    <section id="contact" class="section-padding website-bg-background">
        <div class="container-lg">
            <div class="text-center mb-16 animate-on-scroll" data-animation="fadeInUp 0.6s ease-out">
                <h2 class="text-responsive-lg font-bold mb-4 website-font-primary" style="color: var(--website-color-primary);">
                    ${content.title}
                </h2>
                <p class="text-lg website-text-secondary website-font-secondary">
                    ${content.subtitle}
                </p>
            </div>
            <div class="grid-2 gap-12">
                <div class="space-y-6 animate-on-scroll" data-animation="fadeInLeft 0.6s ease-out">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-lg flex items-center justify-center" style="background-color: rgba(var(--website-color-primary-rgb), 0.2); color: var(--website-color-primary);">
                            ${getIconSVG('Mail')}
                        </div>
                        <div>
                            <h3 class="font-semibold mb-1 website-text-primary website-font-primary">Email</h3>
                            <p class="website-text-secondary website-font-secondary">${content.email}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-lg flex items-center justify-center" style="background-color: rgba(var(--website-color-primary-rgb), 0.2); color: var(--website-color-primary);">
                            ${getIconSVG('Phone')}
                        </div>
                        <div>
                            <h3 class="font-semibold mb-1 website-text-primary website-font-primary">Phone</h3>
                            <p class="website-text-secondary website-font-secondary">${content.phone}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-lg flex items-center justify-center" style="background-color: rgba(var(--website-color-primary-rgb), 0.2); color: var(--website-color-primary);">
                            ${getIconSVG('MapPin')}
                        </div>
                        <div>
                            <h3 class="font-semibold mb-1 website-text-primary website-font-primary">Address</h3>
                            <p class="website-text-secondary website-font-secondary">${content.address}</p>
                        </div>
                    </div>
                </div>
                <div class="website-bg-surface rounded-2xl p-8 website-shadow-lg animate-on-scroll" data-animation="fadeInRight 0.6s ease-out">
                    <form onsubmit="handleFormSubmit(event)">
                        <div class="grid-2 mb-6">
                            <input type="text" name="name" placeholder="Your Name" class="form-input" required>
                            <input type="email" name="email" placeholder="Your Email" class="form-input" required>
                        </div>
                        <input type="text" name="subject" placeholder="Subject" class="form-input mb-6" required>
                        <textarea name="message" placeholder="Your Message" class="form-textarea mb-6" required></textarea>
                        <button type="submit" class="btn-primary w-full">
                            ${getIconSVG('Send')}
                            Send Message
                        </button>
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
                    ${content.socialLinks.map((link: any) => `
                        <a href="${link.url}" class="hover:opacity-70 transition-opacity" target="_blank" rel="noopener noreferrer">
                            ${getIconSVG(link.icon)}
                        </a>
                    `).join('')}
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
            <div class="grid-4 mb-12 gap-8">
                <div>
                    <h3 class="text-2xl font-bold mb-4 website-font-primary">${content.companyName}</h3>
                    <p class="mb-6 opacity-90 website-font-secondary">${content.description}</p>
                    <div class="flex space-x-4">
                        ${content.socialLinks.map((link: any) => `
                            <a href="${link.url}" class="hover:opacity-70 transition-opacity" target="_blank" rel="noopener noreferrer">
                                ${getIconSVG(link.icon)}
                            </a>
                        `).join('')}
                    </div>
                </div>
                ${content.sections.map((section: any) => `
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
                `).join('')}
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
        <div class="container text-center animate-on-scroll" data-animation="fadeInUp 0.6s ease-out">
            <h2 class="text-responsive-lg font-bold mb-6 website-font-primary">
                ${content.title}
            </h2>
            <p class="text-lg mb-8 max-w-2xl mx-auto opacity-90 website-font-secondary">
                ${content.description}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="${content.ctaLink}" class="inline-block px-8 py-4 bg-white rounded-lg hover:bg-gray-100 transition-colors font-semibold website-font-secondary" style="color: var(--website-color-primary);">
                    ${content.ctaText}
                </a>
                ${content.secondaryCtaText ? `
                    <a href="${content.secondaryCtaLink || '#'}" class="inline-block px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white transition-colors font-semibold website-font-secondary" style="hover: color: var(--website-color-primary);">
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
    <section id="blog" class="section-padding website-bg-background">
        <div class="container">
            <div class="text-center mb-16 animate-on-scroll" data-animation="fadeInUp 0.6s ease-out">
                <h2 class="text-responsive-lg font-bold mb-4 website-font-primary" style="color: var(--website-color-primary);">
                    ${content.title}
                </h2>
                <p class="text-lg website-text-secondary website-font-secondary max-w-3xl mx-auto">
                    ${content.subtitle}
                </p>
            </div>
            <div class="grid-3 gap-8">
                ${content.posts.map((post: any, index: number) => `
                    <article class="website-bg-surface rounded-xl overflow-hidden website-shadow-lg hover-shadow animate-on-scroll" data-animation="fadeInUp ${0.6 + index * 0.1}s ease-out">
                        <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover">
                        <div class="p-6">
                            <div class="flex items-center gap-4 mb-3 text-sm">
                                <div class="flex items-center gap-1">
                                    ${getIconSVG('Calendar')}
                                    <span class="website-text-secondary website-font-secondary">
                                        ${new Date(post.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div class="flex items-center gap-1">
                                    ${getIconSVG('User')}
                                    <span class="website-text-secondary website-font-secondary">
                                        ${post.author}
                                    </span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <span class="text-sm font-medium website-font-secondary badge" style="background-color: var(--website-color-primary);">
                                    ${post.category}
                                </span>
                            </div>
                            <h3 class="text-xl font-semibold mb-3 website-text-primary website-font-primary">
                                ${post.title}
                            </h3>
                            <p class="leading-relaxed mb-4 text-sm website-text-secondary website-font-secondary">
                                ${post.excerpt}
                            </p>
                            <a href="${post.url}" class="inline-flex items-center gap-2 font-medium hover:underline website-font-secondary" style="color: var(--website-color-primary);">
                                Read More
                                ${getIconSVG('ArrowRight')}
                            </a>
                        </div>
                    </article>
                `).join('')}
            </div>
        </div>
    </section>
  `;
};