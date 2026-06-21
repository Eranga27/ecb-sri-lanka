// main.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis for Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // 2. GSAP Animations

        // Hero Animations (if hero exists)
        if (document.querySelector('.hero')) {
            gsap.to('.reveal-up', {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                delay: 0.5
            });
        }

        // ScrollTrigger Animations for Teasers
        const teasers = document.querySelectorAll('.teaser-section');
        teasers.forEach((teaser) => {
            const revealLeft = teaser.querySelector('.reveal-left');
            const revealRight = teaser.querySelector('.reveal-right');

            if (revealLeft) {
                gsap.to(revealLeft, {
                    scrollTrigger: {
                        trigger: teaser,
                        start: "top 80%",
                    },
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out"
                });
            }

            if (revealRight) {
                gsap.to(revealRight, {
                    scrollTrigger: {
                        trigger: teaser,
                        start: "top 80%",
                    },
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    delay: 0.2
                });
            }
        });
    }

    // 3. Sticky Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Page Transitions
    const transitionOverlay = document.querySelector('.page-transition-overlay');
    
    // Page load reveal
    if (transitionOverlay && typeof gsap !== 'undefined') {
        gsap.to(transitionOverlay, {
            y: '-100%',
            duration: 0.8,
            ease: "power3.inOut"
        });
    }

    // Intercept link clicks for page transitions
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Ignore hash links or external links
            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
            
            // Allow default behavior for new tabs
            if (this.getAttribute('target') === '_blank') return;

            e.preventDefault();
            
            if (transitionOverlay && typeof gsap !== 'undefined') {
                gsap.set(transitionOverlay, { y: '100%' });
                gsap.to(transitionOverlay, {
                    y: '0%',
                    duration: 0.6,
                    ease: "power3.inOut",
                    onComplete: () => {
                        window.location.href = href;
                    }
                });
            } else {
                window.location.href = href;
            }
        });
    });

    // Smooth scroll for hash links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement, { offset: -80 });
            }
        });
    });
});
