// Main JavaScript for TheGeeksInfo Website

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contact-form');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    preloadCriticalImages();
    ensureLogoLoading();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializePortfolioFilter();
    initializeContactForm();
    initializeCounters();
    initializeTypingEffect();
    initializeApplicationModal();
});

// Preload critical images for better performance
function preloadCriticalImages() {
    const criticalImages = [
        'assets/images/logo300x300.png'
    ];
    
    criticalImages.forEach(imageSrc => {
        const img = new Image();
        img.onload = function() {
            // Image loaded successfully
            console.log('Preloaded:', imageSrc);
        };
        img.onerror = function() {
            // Fallback if image fails to load
            console.warn('Failed to preload:', imageSrc);
        };
        img.src = imageSrc;
    });
}

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    function highlightActiveSection() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection);
}

// Scroll effects
function initializeScrollEffects() {
    // Navbar background on scroll
    function updateNavbar() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbar);

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = hero.querySelector('.hero-visual');
            if (parallax) {
                const speed = scrolled * 0.5;
                parallax.style.transform = `translateY(${speed}px)`;
            }
        });
    }
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Trigger counter animation if it's a stat element
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.service-card, .program-card, .portfolio-item, .about-text, .contact-info, .stat'
    );

    animatedElements.forEach(element => {
        element.classList.add('fade-in-observer');
        observer.observe(element);
    });
}

// Portfolio filter functionality
function initializePortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Contact form functionality
function initializeContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const service = formData.get('service');
        const message = formData.get('message');
        
        // Validate form
        if (!name || !email || !service || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Create mailto link to send email to thegeeksinformation@gmail.com
        const subject = encodeURIComponent(`New Contact Form Submission from ${name} - ${service}`);
        const body = encodeURIComponent(`
Hello TheGeeksInfo Team,

You have received a new contact form submission from your website:

Name: ${name}
Email: ${email}
Service Interested: ${service}

Message:
${message}

---
Please reply to this person at: ${email}

This message was sent from the TheGeeksInfo contact form.
        `);
        
        const mailtoLink = `mailto:thegeeksinformation@gmail.com?subject=${subject}&body=${body}`;
        
        // Show success message
        showNotification('Opening your email client to send the message to thegeeksinformation@gmail.com...', 'success');
        
        // Open mailto link
        window.location.href = mailtoLink;
        
        // Reset form after a short delay
        setTimeout(() => {
            contactForm.reset();
        }, 1000);
    });
}

// Form validation
function validateForm(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name');
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }

    if (!data.service) {
        errors.push('Please select a service');
    }

    if (!data.message || data.message.trim().length < 10) {
        errors.push('Please enter a message with at least 10 characters');
    }

    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }

    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideInDown 0.3s ease-out;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Close functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.animation = 'slideInUp 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInUp 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Counter animation
function initializeCounters() {
    // This will be triggered by the intersection observer
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Typing effect for hero section
function initializeTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    const gradientText = heroTitle.querySelector('.gradient-text');
    
    if (gradientText) {
        const gradientTextContent = gradientText.textContent;
        const beforeGradient = text.substring(0, text.indexOf(gradientTextContent));
        const afterGradient = text.substring(text.indexOf(gradientTextContent) + gradientTextContent.length);

        // Clear the title
        heroTitle.innerHTML = '';

        // Add typing animation
        let i = 0;
        const typeWriter = () => {
            if (i < beforeGradient.length) {
                heroTitle.innerHTML += beforeGradient.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else if (i === beforeGradient.length) {
                heroTitle.innerHTML += `<span class="gradient-text">${gradientTextContent}</span>`;
                i++;
                setTimeout(typeWriter, 50);
            } else if (i - beforeGradient.length - 1 < afterGradient.length) {
                const currentAfterIndex = i - beforeGradient.length - 1;
                const currentAfterText = afterGradient.substring(0, currentAfterIndex + 1);
                heroTitle.innerHTML = beforeGradient + `<span class="gradient-text">${gradientTextContent}</span>` + currentAfterText;
                i++;
                setTimeout(typeWriter, 50);
            }
        };

        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Enhanced logo loading with performance optimization
function ensureLogoLoading() {
    const logoImages = document.querySelectorAll('.logo-image');
    let loadAttempts = 0;
    const maxRetries = 3;
    
    logoImages.forEach((img, index) => {
        // Set initial state
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
        
        // Performance optimization
        img.style.willChange = 'opacity, transform';
        
        // Advanced error handling with exponential backoff
        img.addEventListener('error', function() {
            loadAttempts++;
            console.warn(`Logo failed to load (attempt ${loadAttempts}/${maxRetries})`);
            
            if (loadAttempts <= maxRetries) {
                const retryDelay = Math.pow(2, loadAttempts) * 100; // Exponential backoff
                setTimeout(() => {
                    this.src = this.src.split('?')[0] + '?retry=' + Date.now() + '_' + loadAttempts;
                }, retryDelay);
            } else {
                // Final fallback - show placeholder or hide
                this.style.opacity = '0.3';
                this.style.filter = 'grayscale(100%)';
                console.error('Logo failed to load after all retries');
            }
        });
        
        // Enhanced load event with performance monitoring
        img.addEventListener('load', function() {
            console.log(`Logo loaded successfully (index: ${index})`);
            this.style.opacity = '1';
            this.style.willChange = 'auto'; // Reset will-change for performance
            
            // Mark as loaded for other scripts
            this.setAttribute('data-loaded', 'true');
            
            // Trigger custom event for other components
            document.dispatchEvent(new CustomEvent('logoLoaded', { 
                detail: { index: index, img: this } 
            }));
        });
        
        // Intersection Observer for lazy loading optimization (for footer logo)
        if (index > 0) { // Apply only to non-critical logos
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(img);
        }
        
        // Force reload check with enhanced detection
        if (img.complete) {
            if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                // Image failed to load properly, force reload
                img.src = img.src.split('?')[0] + '?force=' + Date.now();
            } else {
                // Image loaded successfully
                img.style.opacity = '1';
                img.setAttribute('data-loaded', 'true');
            }
        }
        
        // Timeout fallback
        setTimeout(() => {
            if (!img.getAttribute('data-loaded')) {
                console.warn('Logo loading timeout, applying fallback');
                img.style.opacity = '0.5';
            }
        }, 5000);
    });
    
    // Preload next priority images after logo loads
    document.addEventListener('logoLoaded', function() {
        console.log('Logo loaded, starting secondary asset preload');
    });
}

// Application Modal functionality
function initializeApplicationModal() {
    const modal = document.getElementById('applicationModal');
    const applyButtons = document.querySelectorAll('.apply-now-btn');
    const closeBtn = document.querySelector('.close-modal');
    const modalTitle = document.querySelector('.modal-header h2');
    
    // Track modal state to prevent multiple openings
    let isModalOpen = false;
    
    // Open modal when Apply Now buttons are clicked
    applyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Prevent multiple modal openings
            if (isModalOpen) return;
            
            const programName = this.getAttribute('data-program') || 'Our Program';
            modalTitle.textContent = `Apply for ${programName}`;
            
            isModalOpen = true;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Refresh iframe to prevent caching issues
            const iframe = document.getElementById('applicationForm');
            if (iframe) {
                iframe.src = iframe.src;
            }
            
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'application_modal_opened', {
                    program_name: programName
                });
            }
        });
    });
    
    // Close modal when X is clicked
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside of it
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    function closeModal() {
        if (!isModalOpen) return;
        
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
        isModalOpen = false;
        
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'application_modal_closed');
        }
    }
}

// Utility functions
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimization
window.addEventListener('scroll', throttle(function() {
    // Scroll-based animations and effects are handled here
    updateScrollProgress();
}, 16)); // 60 FPS

function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Update progress bar if it exists
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
}

// Add scroll progress bar
document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        z-index: 10001;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Analytics and tracking (placeholder)
function trackEvent(eventName, eventProperties = {}) {
    // Replace with your analytics implementation
    console.log('Event tracked:', eventName, eventProperties);
}

// Track CTA button clicks
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('CTA_Click', {
                button_text: this.textContent.trim(),
                button_location: this.closest('section')?.id || 'unknown'
            });
        });
    });
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can send this to your error tracking service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You can send this to your error tracking service
});

// Export functions for external use
window.TheGeeksInfo = {
    showNotification,
    trackEvent,
    animateCounter
};
