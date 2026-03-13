document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       Navigation Scroll Effect
       ========================================= */
    const nav = document.querySelector('.glass-nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    /* =========================================
       Mobile Menu Toggle
       ========================================= */
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            const icon = menuBtn.querySelector('i');
            if (mobileNav.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    /* =========================================
       Scroll Animations (Intersection Observer)
       ========================================= */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with reveal classes
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    revealElements.forEach(el => observer.observe(el));

    /* =========================================
       Pre-select Product in Contact Form
       ========================================= */
    // If user clicks "Order" from product page, it passes ?product=Value in URL
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product');
    const productSelect = document.getElementById('productName');
    
    if (productParam && productSelect) {
        // Check if value exists in dropdown, then select it
        for(let i=0; i < productSelect.options.length; i++) {
            if(productSelect.options[i].value === productParam) {
                productSelect.selectedIndex = i;
                break;
            }
        }
    }

    /* =========================================
       Form Submission Logic
       ========================================= */
    const orderForm = document.getElementById('orderForm');
    const successMsg = document.getElementById('form-success-msg');
    const errorMsg = document.getElementById('form-error-msg');
    
    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Collect Form Data
            const formData = {
                customerName: document.getElementById('customerName').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                productName: document.getElementById('productName').value,
                quantity: document.getElementById('quantity').value,
                address: document.getElementById('address').value,
                message: document.getElementById('message').value,
            };

            const submitBtn = orderForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            try {
                // UI Feedback loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                // Hit our Express Backend /api/orders. 
                // We use relative path '/api/orders' as we serve this page from same port
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    // Success UI
                    orderForm.reset();
                    successMsg.style.display = 'block';
                    errorMsg.style.display = 'none';
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        successMsg.style.display = 'none';
                    }, 5000);
                } else {
                    throw new Error('Server returned an error');
                }
            } catch (err) {
                console.error('Order submission failed:', err);
                
                // Note: If running without the node backend (just opening static HTML), 
                // this will fail. We give a fallback message letting them know to use WA.
                errorMsg.style.display = 'block';
                successMsg.style.display = 'none';
            } finally {
                // Restore Button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
