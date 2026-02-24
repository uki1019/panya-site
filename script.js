document.addEventListener('DOMContentLoaded', () => {
    // lucide icons
    if (window.lucide?.createIcons) {
        window.lucide.createIcons();
    }

    // Hero Section Image Carousel with Fade Effect
    const heroImages = document.querySelectorAll('.hero-images-container .hero-image');
    if (heroImages.length > 0) {
        let currentIndex = 0;
        
        // Set initial active image
        heroImages[0].classList.add('active');
        
        // Rotate images every 5 seconds
        setInterval(() => {
            heroImages[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % heroImages.length;
            heroImages[currentIndex].classList.add('active');
        }, 5000);
    }

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const revealElements = document.querySelectorAll('.reveal');

    // Scroll Tracking for Active Links + Effects
    const qualityOverlay = document.querySelector('.quality-overlay');
    const qualitySection = document.querySelector('#quality');
    const gallerySection = document.querySelector('#gallery');
    const galleryCards = document.querySelectorAll('.gallery-card');

    const onScroll = () => {
        let current = "";
        const scrollY = window.pageYOffset;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });

        // Parallax effect for image27 (quality-overlay)
        if (qualityOverlay && qualitySection) {
            const sectionTop = qualitySection.offsetTop;
            const sectionHeight = qualitySection.offsetHeight;
            const windowHeight = window.innerHeight;

            const sectionBottom = sectionTop + sectionHeight;
            const scrollStart = sectionTop - windowHeight * 0.5;
            const scrollEnd = sectionBottom + windowHeight * 0.5;
            const scrollRange = scrollEnd - scrollStart;

            if (scrollY >= scrollStart && scrollY <= scrollEnd) {
                const scrollProgress = (scrollY - scrollStart) / scrollRange;
                const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
                const easedProgress = clampedProgress * clampedProgress * (3 - 2 * clampedProgress);

                // NOTE: keep your current tuning (0.20)
                const maxTranslate = window.innerWidth * 0.20;
                const translateX = easedProgress * maxTranslate;

                qualityOverlay.style.transform = `scale(1.9) translateX(${translateX}px)`;
            } else if (scrollY < scrollStart) {
                qualityOverlay.style.transform = `scale(1.9) translateX(0px)`;
            } else {
                qualityOverlay.style.transform = `scale(1.9) translateX(${window.innerWidth * 0.21}px)`;
            }
        }

        // Gallery cards rotation effect
        if (gallerySection && galleryCards.length > 0) {
            const sectionTop = gallerySection.offsetTop;
            const sectionHeight = gallerySection.offsetHeight;
            const windowHeight = window.innerHeight;

            const sectionBottom = sectionTop + sectionHeight;
            const scrollStart = sectionTop - windowHeight * 0.3;
            const scrollEnd = sectionBottom + windowHeight * 0.3;
            const scrollRange = scrollEnd - scrollStart;

            if (scrollY >= scrollStart && scrollY <= scrollEnd) {
                const scrollProgress = (scrollY - scrollStart) / scrollRange;
                const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
                const easedProgress = clampedProgress * clampedProgress * (3 - 2 * clampedProgress);

                const maxRotation = 40;
                const rotation = easedProgress * maxRotation;

                galleryCards.forEach((card, index) => {
                    if (index % 2 === 0) {
                        card.style.transform = `rotate(${rotation}deg)`;
                    } else {
                        card.style.transform = `rotate(-${rotation}deg)`;
                    }
                });
            } else if (scrollY < scrollStart) {
                galleryCards.forEach(card => {
                    card.style.transform = 'rotate(0deg)';
                });
            } else {
                galleryCards.forEach((card, index) => {
                    if (index % 2 === 0) {
                        card.style.transform = 'rotate(30deg)';
                    } else {
                        card.style.transform = 'rotate(-30deg)';
                    }
                });
            }
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ===== Menu Stack (card stack + scroll paging) =====
    function initMenuStackScrollCards() {
        const scrollRoot = document.querySelector('.js-menu-stack-scroll');
        const stage = document.querySelector('.js-menu-stack-stage');
        const cards = Array.from(document.querySelectorAll('.js-menu-stack-card'));

        if (!scrollRoot || !stage || cards.length === 0) return;

        // 防重复
        if (scrollRoot.dataset.menuStackInited === '1') return;
        scrollRoot.dataset.menuStackInited = '1';

        const pageCount = cards.length;

        const clamp01 = (n) => Math.max(0, Math.min(1, n));

        const update = () => {
            const rect = scrollRoot.getBoundingClientRect();
            const vh = window.innerHeight || 0;
            const total = rect.height - vh;
            const p = clamp01(-rect.top / (total || 1));

            const seg = 1 / pageCount;

            // reset
            for (let i = 0; i < pageCount; i++) {
                cards[i].style.setProperty('--enter', '0');
                cards[i].style.setProperty('--shrink', '0');
                cards[i].classList.remove('is-active');
            }

            // enter / shrink
            for (let i = 0; i < pageCount; i++) {
                const enter = clamp01((p - i * seg) / seg);
                cards[i].style.setProperty('--enter', enter.toFixed(3));

                if (i > 0) {
                    const shrink = clamp01((p - (i - 1) * seg) / seg);
                    cards[i - 1].style.setProperty('--shrink', shrink.toFixed(3));
                }
            }

            const activeIndex = Math.min(pageCount - 1, Math.floor(p / seg));
            cards[activeIndex]?.classList.add('is-active');
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
    }

    initMenuStackScrollCards();

    // Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // Smooth Scrolling for Links
    document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href'))?.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

