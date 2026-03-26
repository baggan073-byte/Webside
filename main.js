document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();

    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;

    await loadContent();

    initScrollAnimations();
    initNavbar();
    initMobileMenu();
    initContactForm();
});

async function loadContent() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        renderServices(data.services);
        renderGallery(data.gallery);
        renderReviews(data.reviews);
        
        lucide.createIcons();
    } catch (error) {
        console.error('Failed to load content:', error);
    }
}

function renderServices(services) {
    const container = document.getElementById('services-container');
    container.innerHTML = services.map(service => `
        <div class="service-card group bg-white border border-gray-100 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-dark/5 hover:-translate-y-2 gs-reveal">
            <div class="w-14 h-14 bg-brand-light rounded-full flex items-center justify-center mb-8 transition-colors duration-300 group-hover:bg-brand-dark">
                <i data-lucide="${service.icon}" class="service-icon h-6 w-6 text-brand-dark transition-all duration-300 group-hover:text-brand-gold"></i>
            </div>
            <h3 class="text-xl font-serif text-brand-dark mb-4">${service.title}</h3>
            <p class="text-brand-muted font-light text-sm leading-relaxed">${service.description}</p>
        </div>
    `).join('');
}

function renderGallery(gallery) {
    const container = document.getElementById('gallery-container');
    container.innerHTML = gallery.map((item, index) => {
        const spanClass = index === 0 ? 'md:col-span-2 md:row-span-2 h-96 md:h-full' : 'h-80';
        return `
            <div class="gallery-item rounded-sm ${spanClass} gs-reveal">
                <img src="${item.image}" alt="${item.title}" class="gallery-img w-full h-full object-cover">
                <div class="gallery-overlay absolute inset-0 flex flex-col justify-end p-8">
                    <span class="text-brand-gold text-xs tracking-widest uppercase mb-2 gallery-text">${item.category}</span>
                    <h3 class="text-white text-xl font-serif gallery-text">${item.title}</h3>
                </div>
            </div>
        `;
    }).join('');
}

function renderReviews(reviews) {
    const container = document.getElementById('reviews-container');
    container.innerHTML = reviews.map(review => `
        <div class="bg-white/5 border border-white/10 p-10 backdrop-blur-sm transition-transform duration-500 hover:-translate-y-2 gs-reveal">
            <div class="flex gap-1 mb-6 text-brand-gold">
                ${Array(5).fill('<i data-lucide="star" class="h-4 w-4 fill-current"></i>').join('')}
            </div>
            <p class="text-gray-300 font-light italic mb-8 leading-relaxed">"${review.text}"</p>
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold font-serif">
                    ${review.author.charAt(0)}
                </div>
                <div>
                    <h4 class="text-white font-medium text-sm">${review.author}</h4>
                    <span class="text-brand-gold text-xs uppercase tracking-wider">${review.type}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to("#hero-img", {
        scale: 1,
        duration: 2,
        ease: "power2.out"
    });

    const revealElements = document.querySelectorAll('.gs-reveal');
    
    revealElements.forEach((el) => {
        gsap.fromTo(el, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-sm', 'border-gray-200');
            navbar.classList.remove('border-transparent');
        } else {
            navbar.classList.remove('shadow-sm', 'border-gray-200');
            navbar.classList.add('border-transparent');
        }
    });
}

function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const openMenu = () => {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        gsap.fromTo(mobileMenu, 
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
        
        gsap.fromTo(mobileLinks,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out", delay: 0.1 }
        );
    };

    const closeMenu = () => {
        gsap.to(mobileMenu, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                document.body.style.overflow = 'auto';
            }
        });
    };

    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="h-5 w-5 animate-spin"></i> Skickar...';
        lucide.createIcons();
        submitBtn.disabled = true;

        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            successMsg.classList.remove('hidden');
            lucide.createIcons();
            
            setTimeout(() => {
                successMsg.classList.add('hidden');
            }, 5000);
        }, 1500);
    });
}
