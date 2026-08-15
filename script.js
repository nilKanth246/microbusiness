// Loader
(function () {
    const loader = document.getElementById('loaderWrapper');
    if (loader) {
        window.addEventListener('load', function () {
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.transition = 'opacity 0.8s ease';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 800);
            }, 2000);
        });
    }
})();

// Custom Cursor
(function () {
    const cursor = document.getElementById('customCursor');
    const trail = document.getElementById('cursorTrail');

    if (!cursor || !trail) return;

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    function animate() {
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;

        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        trail.style.transform = `translate(${trailX}px, ${trailY}px)`;

        requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.display = 'block';
        trail.style.display = 'block';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
        trail.style.display = 'none';
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(0.8)`;
        trail.style.transform = `translate(${trailX}px, ${trailY}px) scale(0.9)`;
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1)`;
        trail.style.transform = `translate(${trailX}px, ${trailY}px) scale(1)`;
    });

    const hoverElements = document.querySelectorAll('a, button, .service-card, .code-card, .slider-btn, .dot, [data-tilt]');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1.5)`;
            trail.style.transform = `translate(${trailX}px, ${trailY}px) scale(1.3)`;
            cursor.classList.add('hover');
            trail.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1)`;
            trail.style.transform = `translate(${trailX}px, ${trailY}px) scale(1)`;
            cursor.classList.remove('hover');
            trail.classList.remove('hover');
        });
    });

    animate();
})();

// Header Scroll
(function () {
    const header = document.getElementById('header');
    if (!header) return;

    const toggleScrolled = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', toggleScrolled);
    toggleScrolled();
})();

// Mobile Navigation
(function () {
    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('nav');

    if (!navToggle || !nav) return;

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
})();

// Active Navigation on Scroll
(function () {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');

    if (!navItems.length || !sections.length) return;

    function setActiveNav() {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);

            if (navItem) {
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navItems.forEach(item => item.classList.remove('active'));
                    navItem.classList.add('active');
                }
            }
        });
    }

    sections.forEach((section, i) => {
        const id = section.getAttribute('id');
        navItems[i].setAttribute('data-section', id);
    });

    window.addEventListener('scroll', setActiveNav);
    setActiveNav();
})();

// Back to Top Button
(function () {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    const toggleVisibility = () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility();
})();

// Stats Counter
(function () {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (!statNumbers.length) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(el => {
                    const target = parseInt(el.getAttribute('data-count'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let count = 0;

                    const updateCount = () => {
                        count += increment;
                        if (count >= target) {
                            el.textContent = target;
                        } else {
                            el.textContent = Math.floor(count);
                            requestAnimationFrame(updateCount);
                        }
                    };

                    el.textContent = '0';
                    requestAnimationFrame(updateCount);
                });
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el.parentElement));
})();

// Projects Slider
(function () {
    const slides = document.querySelectorAll('.project-slide');
    const dotsContainer = document.getElementById('sliderDots');

    if (!slides.length || !dotsContainer) return;

    let currentSlide = 0;
    let slideInterval;

    const createDots = () => {
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
    };

    const updateDots = () => {
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    };

    const goToSlide = (index) => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        updateDots();
        resetInterval();
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    const resetInterval = () => {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    };

    const nextBtn = document.querySelector('.slider-btn.next');
    const prevBtn = document.querySelector('.slider-btn.prev');

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    const startSlider = () => {
        createDots();
        resetInterval();
    };

    startSlider();
})();

// Scroll Reveal Animation
(function () {
    const revealElements = document.querySelectorAll('[data-scroll-reveal]');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
})();

// Tilt Effect
(function () {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    if (!tiltElements.length) return;

    tiltElements.forEach(el => {
        el.style.transition = 'transform 0.1s ease-out';

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const tiltX = ((y - centerY) / centerY) * 10;
            const tiltY = ((x - centerX) / centerX) * 10;

            el.style.transform = `perspective(1000px) rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
})();

// Smooth scrolling for anchor links
(function () {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();

// Parallax on scroll
(function () {
    const parallaxElements = document.querySelectorAll('.hero');
    if (!parallaxElements.length) return;

    const handleScroll = () => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach(el => {
            el.style.backgroundPositionY = `${scrolled * 0.5}px`;
        });
    };

    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll);
})();
