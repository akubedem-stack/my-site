/* ============================================================
   Эдем — фотограф природы
   Персональный скрипт сайта
   ------------------------------------------------------------
   1. Год в футере — автоматически
   2. Плавный скролл по якорям
   3. Появление секций при скролле (fade-in)
   4. Лайтбокс для галереи
   5. Кнопка «Наверх»
   6. Меню: закрытие при клике по пункту
   7. Ленивая загрузка фото (страховка на старые браузеры)
   ============================================================ */

(function () {
    'use strict';

    /* ---------- 1. Год в футере ---------- */
    var yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /* ---------- 2. Плавный скролл по якорям ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (!href || href === '#') return;

            var target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    /* ---------- 3. Fade-in секций ---------- */
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll(
            '.wrapper, .spotlight, #banner .inner, .gallery-grid a, .features li'
        ).forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
            observer.observe(el);
        });
    }

    /* ---------- 4. Лайтбокс для галереи ---------- */
    document.querySelectorAll('.gallery-grid a').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var img = this.querySelector('img');
            if (!img) return;

            e.preventDefault();

            var overlay = document.createElement('div');
            overlay.style.cssText =
                'position:fixed;inset:0;background:rgba(10,15,12,0.92);' +
                'display:flex;align-items:center;justify-content:center;' +
                'z-index:99999;cursor:zoom-out;opacity:0;' +
                'transition:opacity 0.3s ease;padding:20px;';

            var bigImg = document.createElement('img');
            bigImg.src = this.getAttribute('href');
            bigImg.alt = img.alt || '';
            bigImg.style.cssText =
                'max-width:92%;max-height:92%;border-radius:6px;' +
                'box-shadow:0 20px 60px rgba(0,0,0,0.6);' +
                'transform:scale(0.95);transition:transform 0.3s ease;';

            overlay.appendChild(bigImg);
            document.body.appendChild(overlay);

            // Плавное появление
            requestAnimationFrame(function () {
                overlay.style.opacity = '1';
                bigImg.style.transform = 'scale(1)';
            });

            // Клик по фону — закрыть
            overlay.addEventListener('click', function () {
                overlay.style.opacity = '0';
                bigImg.style.transform = 'scale(0.95)';
                setTimeout(function () { overlay.remove(); }, 300);
            });
        });
    });

    // Esc закрывает лайтбокс
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            var overlay = document.querySelector(
                'div[style*="z-index:99999"]'
            );
            if (overlay) overlay.click();
        }
    });

    /* ---------- 5. Кнопка «Наверх» ---------- */
    var upBtn = document.createElement('button');
    upBtn.textContent = '↑';
    upBtn.setAttribute('aria-label', 'Наверх');
    upBtn.style.cssText =
        'position:fixed;bottom:30px;right:30px;z-index:999;' +
        'width:48px;height:48px;border-radius:50%;border:none;' +
        'background:#8a9a5b;color:#fff;font-size:1.3em;cursor:pointer;' +
        'opacity:0;pointer-events:none;' +
        'transition:opacity 0.3s ease, background-color 0.2s ease;' +
        'box-shadow:0 6px 20px rgba(0,0,0,0.35);';
    document.body.appendChild(upBtn);

    upBtn.addEventListener('mouseenter', function () {
        upBtn.style.backgroundColor = '#9dae6d';
    });
    upBtn.addEventListener('mouseleave', function () {
        upBtn.style.backgroundColor = '#8a9a5b';
    });

    var toggleUpBtn = function () {
        if (window.scrollY > 600) {
            upBtn.style.opacity = '1';
            upBtn.style.pointerEvents = 'auto';
        } else {
            upBtn.style.opacity = '0';
            upBtn.style.pointerEvents = 'none';
        }
    };

    window.addEventListener('scroll', toggleUpBtn, { passive: true });
    toggleUpBtn();

    upBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---------- 6. Меню закрывается при клике по пункту ---------- */
    var menuLinks = document.querySelectorAll('#menu a');
    menuLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            // Убираем класс, отвечающий за открытое меню в Spectral
            document.body.classList.remove('is-menu-visible');
        });
    });

    /* ---------- 7. Ленивая загрузка (страховка) ---------- */
    if ('loading' in HTMLImageElement.prototype) {
        // Нативный lazy-load уже работает, ничего не нужно
    } else {
        // Fallback для очень старых браузеров
        var lazyImages = document.querySelectorAll('img[loading="lazy"]');
        if ('IntersectionObserver' in window) {
            var lazyObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var img = entry.target;
                        if (img.dataset.src) img.src = img.dataset.src;
                        lazyObserver.unobserve(img);
                    }
                });
            });
            lazyImages.forEach(function (img) { lazyObserver.observe(img); });
        }
    }

})();