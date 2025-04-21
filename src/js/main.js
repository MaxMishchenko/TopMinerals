$(document).ready(function () {
    const $window = $(window);
    const $body = $('body');
    const $header = $('#header');
    const $burger = $('#burger');
    const $menu = $('#menu');
    const $menuChevron = $('#menu-chevron');
    const $submenu = $('#submenu');
    const $mobileMenu = $('#mobile-menu');
    const $lazyElements = $('.lazy-bg');
    const $toTop = $('.to-top');
    const $productCat = $('.section__products-item');
    const $track = $('.section__products-carousel-track');
    const $dotsContainer = $('.section__products-carousel-dots');
    const windowHeight = $window.height();

    let scrollTimeout;
    let throttleTimer;
    let currentIndex = 0;

    // ========================
    // Хедер і кнопка "вгору"
    // ========================
    function checkHeaderPosition() {
        if ($window.scrollTop() > 16 || $header.offset().top !== 16) {
            $header.addClass('floating');
        } else {
            $header.removeClass('floating');
        }
    }

    function handleToTopVisibility() {
        if ($window.scrollTop() > 400) {
            if (!$toTop.is(':visible')) $toTop.fadeInFlex(300);
        } else {
            if ($toTop.is(':visible')) $toTop.fadeOutFlex(300);
        }

        $toTop.addClass('scrolling');
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => $toTop.removeClass('scrolling'), 200);
    }

    $toTop.click(function (e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 500);
    });

    // ========================
    // Lazy load фонів
    // ========================
    function lazyLoadBackground() {
        const scrollTop = $window.scrollTop();

        $lazyElements.each(function () {
            const $el = $(this);
            const elTop = $el.offset().top;
            const bg = $el.data('bg');

            if ($el.hasClass('lazy-bg') && $el.is(':visible') && elTop < scrollTop + windowHeight && bg) {
                $el.css({'background-image': `url(${bg})`, opacity: 0})
                    .animate({opacity: 1}, 400)
                    .removeClass('lazy-bg');
            }
        });
    }

    function throttledLazyLoad() {
        if (throttleTimer) return;

        throttleTimer = setTimeout(() => {
            lazyLoadBackground();
            throttleTimer = null;
        }, 200);
    }

    $window.on('scroll resize', throttledLazyLoad);

    // ========================
    // Анімації .fadeInFlex та .fadeOutFlex
    // ========================
    $.fn.fadeInFlex = function (duration = 400) {
        return this.css({display: 'flex', opacity: 0}).animate({opacity: 1}, duration);
    };

    $.fn.fadeOutFlex = function (duration = 400) {
        return this.animate({opacity: 0}, duration, function () {
            $(this).css('display', 'none');
        });
    };

    // ========================
    // Слайдер продуктів
    // ========================
    function initSlider() {
        const $slides = $track.find('.section__products-carousel-slide').filter(':visible');
        currentIndex = Math.min(currentIndex, $slides.length - 1);

        const translateX = `calc(-${currentIndex * 100}% - ${currentIndex * 16}px)`;
        $track.css('transform', `translateX(${translateX})`);

        $dotsContainer.empty();
        $slides.each((i) => {
            const $dot = $('<button type="button"></button>')
                .attr('aria-label', 'Перемкнути на слайд ' + (i + 1))
                .toggleClass('active', i === currentIndex);

            $dot.on('click', () => {
                currentIndex = i;
                initSlider();
            });

            $dotsContainer.append($dot);
        });
    }

    function addSwipeSupport() {
        const carousel = $track[0];
        let startX, startY, endX, endY, isSwiping = false;

        carousel.addEventListener('touchstart', e => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            isSwiping = false;
        }, {passive: true});

        carousel.addEventListener('touchmove', e => {
            const touch = e.touches[0];
            endX = touch.clientX;
            endY = touch.clientY;

            if (!isSwiping && Math.abs(endX - startX) > Math.abs(endY - startY)) {
                isSwiping = true;
                e.preventDefault();
            }
        }, {passive: false});

        carousel.addEventListener('touchend', () => {
            if (!isSwiping) return;

            const deltaX = endX - startX;
            const $slides = $track.find('.section__products-carousel-slide').filter(':visible');

            if (Math.abs(deltaX) > 50) {
                currentIndex = (currentIndex + (deltaX > 0 ? -1 : 1) + $slides.length) % $slides.length;
                initSlider();
            }

            startX = startY = endX = endY = 0;
            isSwiping = false;
        });
    }

    $('.section__products-carousel-nav--prev').click(() => {
        const $slides = $track.find('.section__products-carousel-slide').filter(':visible');
        currentIndex = (currentIndex - 1 + $slides.length) % $slides.length;
        initSlider();
    });

    $('.section__products-carousel-nav--next').click(() => {
        const $slides = $track.find('.section__products-carousel-slide').filter(':visible');
        currentIndex = (currentIndex + 1) % $slides.length;
        initSlider();
    });

    $productCat.on('click', function () {
        $productCat.removeClass('active');
        $(this).addClass('active');

        const selectedCat = $(this).data('cat');

        $('[data-slide-text], [data-slide-img], [data-slide]').each(function () {
            const $el = $(this);
            const text = $el.data('slideText');
            const img = $el.data('slideImg');
            const data = $el.attr('data-slide');
            const match = (text === selectedCat || img === selectedCat || (data && data.split(',').map(v => v.trim()).includes(String(selectedCat))));

            $el.toggleClass('hidden', !match);
        });

        currentIndex = 0;
        initSlider();
        lazyLoadBackground();
    });

    // ========================
    // Мобільне меню
    // ========================
    function smoothMenuToggle() {
        const isVisible = $submenu.hasClass('visible');

        if (!isVisible) {
            $submenu.removeClass('hidden').addClass('visible').css({opacity: 0, transition: 'max-height 0.4s ease'});

            setTimeout(() => {
                $submenu.css({transition: 'opacity 0.4s ease', opacity: 1});
            }, 400);
        } else {
            $submenu.css({transition: 'opacity 0.4s ease', opacity: 0});

            setTimeout(() => {
                $submenu.removeClass('visible').css('transition', 'max-height 0.4s ease, opacity 0.4s ease');
            }, 400);
        }

        $menuChevron.toggleClass('active');
    }

    $burger.on('click', function () {
        $(this).toggleClass('active');
        $mobileMenu.toggleClass('active');
        $body.toggleClass('lock');

        if ($submenu.hasClass('visible')) smoothMenuToggle();
    });

    $menu.click(smoothMenuToggle);

    // ========================
    // Ініціалізація
    // ========================
    checkHeaderPosition();
    lazyLoadBackground();
    initSlider();
    addSwipeSupport();

    $window.on('scroll', function () {
        checkHeaderPosition();
        handleToTopVisibility();
    });
});