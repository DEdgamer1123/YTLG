// Main JavaScript for YTLG Application

// Mobile navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu elements
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    
    // Header scroll effect
    const header = document.getElementById('header');
    
    // Mobile menu toggle functionality
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }
    
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
    
    // Close mobile nav when clicking on links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileNav && mobileNav.classList.contains('active')) {
            if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animation on scroll for service cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards for animation
    document.querySelectorAll('.service-card, .chart-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Add loading states for buttons
    document.querySelectorAll('.cta-button, .chart-button').forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.innerHTML;
            const originalWidth = this.offsetWidth;
            
            // Add loading state
            this.style.width = originalWidth + 'px';
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            this.disabled = true;
            
            // Remove loading state after 2 seconds (adjust as needed)
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                this.style.width = '';
            }, 2000);
        });
    });
    
    // Form validation helpers
    window.validateForm = function(formElement) {
        const inputs = formElement.querySelectorAll('.form-input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            const value = input.value.trim();
            const errorElement = input.parentNode.querySelector('.error-message');
            
            // Remove existing error
            if (errorElement) {
                errorElement.remove();
            }
            input.classList.remove('form-error');
            
            // Check if empty
            if (!value) {
                showFieldError(input, 'Este campo es requerido');
                isValid = false;
            }
            // Check if number input is valid
            else if (input.type === 'number' && isNaN(parseFloat(value))) {
                showFieldError(input, 'Ingresa un número válido');
                isValid = false;
            }
        });
        
        return isValid;
    };
    
    function showFieldError(input, message) {
        input.classList.add('form-error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        input.parentNode.appendChild(errorDiv);
    }
    
    // Utility functions for charts
    window.showNotification = function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: type === 'success' ? '#18936f' : type === 'error' ? '#e74c3c' : '#a6a4ff',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            maxWidth: '300px',
            animation: 'slideInRight 0.3s ease-out'
        });
        
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    };
    
    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification {
            font-family: var(--font-family, 'Poppins', sans-serif);
            font-size: 0.9rem;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
    
    // Keyboard navigation improvements
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Improve accessibility for mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-controls', 'mobileNav');
        
        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = mobileNav.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // Add focus trapping for mobile menu
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    if (mobileNav) {
        trapFocus(mobileNav);
    }
});

// Global utilities that can be used by chart pages
window.YTLG = {
    // Chart color schemes
    colorSchemes: {
        primary: [
            '#a6a4ff',
            '#aab1ff',
            '#7042b5',
            '#18936f',
            '#ff6b6b',
            '#4ecdc4',
            '#45b7d1',
            '#f9ca24',
            '#f0932b',
            '#eb4d4b'
        ],
        gradient: [
            'rgba(166, 164, 255, 0.8)',
            'rgba(170, 177, 255, 0.8)',
            'rgba(112, 66, 181, 0.8)',
            'rgba(24, 147, 111, 0.8)',
            'rgba(255, 107, 107, 0.8)',
            'rgba(78, 205, 196, 0.8)',
            'rgba(69, 183, 209, 0.8)',
            'rgba(249, 202, 36, 0.8)',
            'rgba(240, 147, 43, 0.8)',
            'rgba(235, 77, 75, 0.8)'
        ]
    },
    
    // Common chart options
    defaultChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    font: {
                        family: 'Poppins'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#a6a4ff',
                borderWidth: 1,
                titleFont: {
                    family: 'Poppins'
                },
                bodyFont: {
                    family: 'Poppins'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        family: 'Poppins'
                    }
                }
            },
            y: {
                ticks: {
                    font: {
                        family: 'Poppins'
                    }
                }
            }
        }
    },
    
    // Utility to format numbers
    formatNumber: function(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    },
    
    // Utility to validate chart data
    validateChartData: function(labels, data) {
        if (!labels || !data) return false;
        if (labels.length === 0 || data.length === 0) return false;
        if (labels.length !== data.length) return false;
        return data.every(value => !isNaN(value) && isFinite(value));
    }
};
