// Professional Website JavaScript
class EnvelopeEmpireWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupMobileMenu();
        this.setupFormInteractions();
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Active navigation highlighting
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('main section');

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -50% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    setupScrollEffects() {
        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(10, 10, 10, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
            } else {
                header.style.background = 'rgba(10, 10, 10, 0.95)';
                header.style.boxShadow = 'none';
            }
        });

        // Reveal animations on scroll
        const revealElements = document.querySelectorAll('.step, .service-card, .overview-card, .highlight');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease-out';
            revealObserver.observe(element);
        });
    }

    setupAnimations() {
        // Counter animation for stats
        const animateCounter = (element, target, duration = 2000) => {
            let start = 0;
            const increment = target / (duration / 16);
            
            function updateCounter() {
                start += increment;
                if (start < target) {
                    if (element.textContent.includes('$')) {
                        element.textContent = '$' + Math.ceil(start);
                    } else if (element.textContent.includes('%')) {
                        element.textContent = Math.ceil(start) + '%';
                    } else if (element.textContent.includes('+')) {
                        element.textContent = Math.ceil(start) + '+';
                    } else {
                        element.textContent = Math.ceil(start);
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    if (element.textContent.includes('$')) {
                        element.textContent = '$' + target;
                    } else if (element.textContent.includes('%')) {
                        element.textContent = target + '%';
                    } else if (element.textContent.includes('+')) {
                        element.textContent = target + '+';
                    } else {
                        element.textContent = target;
                    }
                }
            }
            
            updateCounter();
        };

        // Animate stats when they come into view
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target.querySelector('.stat-number, .roi-number');
                    if (statNumber && !statNumber.dataset.animated) {
                        statNumber.dataset.animated = 'true';
                        const text = statNumber.textContent;
                        
                        if (text.includes('$5')) {
                            animateCounter(statNumber, 5);
                        } else if (text.includes('99%')) {
                            animateCounter(statNumber, 99);
                        } else if (text.includes('1000+')) {
                            animateCounter(statNumber, 1000);
                        } else if (text.includes('604%')) {
                            animateCounter(statNumber, 604);
                        } else if (text.includes('$0.71')) {
                            statNumber.textContent = '$0.71';
                        } else if (text.includes('$5.00')) {
                            statNumber.textContent = '$5.00';
                        }
                    }
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat, .roi-stat').forEach(stat => {
            statsObserver.observe(stat);
        });

        // Service card hover effects
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Step hover effects
        document.querySelectorAll('.step').forEach(step => {
            step.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });
            
            step.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    setupFormInteractions() {
        // Discord button special effects
        const discordBtn = document.querySelector('.discord-btn');
        if (discordBtn) {
            discordBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.02)';
            });
            
            discordBtn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
            
            discordBtn.addEventListener('click', function(e) {
                // Add click ripple effect
                const ripple = document.createElement('div');
                ripple.style.cssText = `
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0);
                `;
                
                this.style.position = 'relative';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    this.removeChild(ripple);
                }, 600);
            });
        }

        // Add hover effects to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                if (this.classList.contains('btn-primary')) {
                    this.style.transform = 'translateY(-2px) scale(1.02)';
                } else {
                    this.style.transform = 'translateY(-2px)';
                }
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Utility function to check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    new EnvelopeEmpireWebsite();
});

// Add CSS for ripple animation
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
    
    .nav-link.active {
        color: var(--primary-gold);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(rippleStyles);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Add keyboard navigation styles
const keyboardStyles = document.createElement('style');
keyboardStyles.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-gold);
        outline-offset: 2px;
    }
`;
document.head.appendChild(keyboardStyles);

// Performance monitoring
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Non-critical animations and effects
        console.log('Website loaded and optimized');
    });
}

// Error handling for external links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="https://discord.com"]')) {
        e.target.addEventListener('error', () => {
            console.error('Discord link failed to open');
        });
    }
});

// Preload optimization
const preloadCriticalResources = () => {
    const criticalFonts = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap'
    ];
    
    criticalFonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = font;
        link.as = 'style';
        document.head.appendChild(link);
    });
};

// Call preload function
preloadCriticalResources();