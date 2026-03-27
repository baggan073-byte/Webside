
lucide.createIcons();


const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled-nav');
        navbar.classList.remove('py-6');
    } else {
        navbar.classList.remove('scrolled-nav');
        navbar.classList.add('py-6');
    }
});


mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
});


mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
    });
});


gsap.registerPlugin(ScrollTrigger);


const heroTl = gsap.timeline();
heroTl.fromTo(".reveal-sequence > *", 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2 }
);


const revealElements = document.querySelectorAll('.reveal-up');
revealElements.forEach(el => {
    gsap.fromTo(el, 
        { autoAlpha: 0, y: 50 },
        { 
            autoAlpha: 1, 
            y: 0, 
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }
    );
});


gsap.to("#hero-img", {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
        trigger: "section",
        start: "top top", 
        end: "bottom top",
        scrub: true
    }
});


const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Skickat!';
        submitBtn.classList.remove('bg-brand-500', 'hover:bg-brand-600');
        submitBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        lucide.createIcons();
        
        contactForm.reset();
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.classList.add('bg-brand-500', 'hover:bg-brand-600');
            submitBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
            lucide.createIcons();
        }, 3000);
    });
}
