document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Starfield: sparse, mostly still; a few stars twinkle ---------- */
    document.querySelectorAll('canvas.sky').forEach((canvas) => {
        const ctx = canvas.getContext('2d');
        const density = Number(canvas.dataset.density || 6500); // px² per star
        let stars = [], w = 0, h = 0;

        function seed() {
            const dpr = window.devicePixelRatio || 1;
            w = canvas.clientWidth; h = canvas.clientHeight;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.round((w * h) / density);
            stars = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() < 0.94 ? Math.random() * 0.8 + 0.2 : Math.random() * 1.1 + 0.9,
                a: Math.random() * 0.55 + 0.15,
                twinkle: Math.random() < 0.12,
                phase: Math.random() * Math.PI * 2,
                warm: Math.random() < 0.15
            }));
        }

        function draw(t) {
            ctx.clearRect(0, 0, w, h);
            for (const s of stars) {
                const a = s.twinkle && !reduceMotion ? s.a * (0.6 + 0.4 * Math.sin(t / 1400 + s.phase)) : s.a;
                ctx.fillStyle = s.warm ? `rgba(216,183,121,${a})` : `rgba(233,229,219,${a})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        let visible = true;
        function loop(t) {
            if (visible) draw(t);
            if (!reduceMotion) requestAnimationFrame(loop);
        }

        // Pause drawing when the hero is scrolled out of view.
        new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

        seed();
        requestAnimationFrame(loop);
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => { seed(); draw(performance.now()); }, 150);
        });
    });

    /* ---------- Mobile menu ---------- */
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav-toggle');
    if (nav && toggle) {
        toggle.addEventListener('click', () => {
            const open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
        });
        nav.querySelectorAll('.nav-links a').forEach((a) =>
            a.addEventListener('click', () => {
                nav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            })
        );
    }

    /* ---------- Reveal sections on scroll ---------- */
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach((el) => io.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add('visible'));
    }

    /* ---------- Highlight current section in the nav (home page) ---------- */
    const sections = [...document.querySelectorAll('main section[id]')];
    const links = [...document.querySelectorAll('.nav-links a')];
    if (sections.length) {
        const onScroll = () => {
            let current = '';
            const y = window.scrollY + window.innerHeight * 0.35;
            sections.forEach((s) => { if (s.offsetTop <= y) current = s.id; });
            links.forEach((a) => a.classList.toggle('active', a.getAttribute('href').split('#')[1] === current));
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
});
