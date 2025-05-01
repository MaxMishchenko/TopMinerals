$(document).ready(function () {
    const $window = $(window);
    const windowHeight = $window.height();
    const currentPath = window.location.pathname;
    const $body = $('body');
    const $burger = $('#burger');
    const $menu = $('#menu');
    const $menuChevron = $('#menu-chevron');
    const $submenu = $('#submenu');
    const $mobileMenu = $('#mobile-menu');
    const $lazyElements = $('.lazy-bg');
    const $toTop = $('.to-top');
    const $headerMenuLink = $('.header__menu-link');
    const $headerMenuItem = $('.header__menu-item');

    let scrollTimeout;
    let throttleTimer = null;
    let $header;

    // ======================
    // Хедер і кнопка "вгору"
    // ======================
    function updateHeader() {
        if (window.innerWidth >= 1024) {
            $('#header').removeClass('floating');
            $header = $('#header-wrapper');
        } else {
            $header = $('#header');
        }
    }

    function checkHeaderPosition() {
        const isWideScreen = window.innerWidth >= 1024;
        const scrollThreshold = isWideScreen ? 30 : 16;
        const offsetThreshold = isWideScreen ? 30 : 16;

        if (typeof $header !== 'undefined' && $header.length &&
            ($window.scrollTop() > scrollThreshold || $header.offset().top > offsetThreshold)) {

            if (isWideScreen) {
                $('#header-wrapper').addClass('floating');
            } else {
                $('#header').addClass('floating');
            }
        } else {
            if (isWideScreen) {
                $('#header-wrapper').removeClass('floating');
            } else {
                $('#header').removeClass('floating');
            }
        }
    }

    function handleToTopVisibility() {
        if ($window.scrollTop() > 400) {
            if (!$toTop.is(':visible')) $toTop.fadeInFlex(200);
        } else {
            if ($toTop.is(':visible')) $toTop.fadeOutFlex(200);
        }

        if (window.innerWidth < 1024) {
            $toTop.addClass('scrolling');
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => $toTop.removeClass('scrolling'), 200);
        }
    }

    $toTop.click(function (e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 500);
    });

    // =========
    // Lazy load
    // =========
    window.lazyLoadBackground = function () {
        const scrollTop = $window.scrollTop();

        $('.lazy-bg').each(function () {
            const $el = $(this);
            const elTop = $el.offset().top;
            const bg = $el.data('bg');

            if ($el.hasClass('lazy-bg') && $el.is(':visible') && elTop < scrollTop + windowHeight && bg) {
                $el.css({ 'background-image': `url(${bg})`, opacity: 0 })
                    .animate({ opacity: 1 }, 600)
                    .removeClass('lazy-bg');
            }
        });

        $('img[loading="lazy"]').each(function () {
            const $el = $(this);

            if ($el.data('lazy-animated')) return;

            if ($el[0].complete) {
                $el.css('opacity', 0)
                    .animate({ opacity: 1 }, 600)
                    .data('lazy-animated', true);
            } else {
                $el.css('opacity', 0).on('load', function () {
                    $(this).animate({ opacity: 1 }, 600).data('lazy-animated', true);
                });
            }
        });
    };

    // ===========================
    // Саморобна реалізація throttle
    // ===========================
    function throttledLazyLoad() {
        if (throttleTimer) return;

        throttleTimer = setTimeout(() => {
            window.lazyLoadBackground();
            throttleTimer = null;
        }, 200);
    }

    $window.on('scroll resize', throttledLazyLoad);
    $(window).on('resize', updateHeader);

    // ============================================
    // Анімації появи та .fadeInFlex / .fadeOutFlex
    // ============================================
    $.fn.fadeInFlex = function (duration = 400) {
        return this.css({display: 'flex', opacity: 0}).animate({opacity: 1}, duration);
    };

    $.fn.fadeOutFlex = function (duration = 400) {
        return this.animate({opacity: 0}, duration, function () {
            $(this).css('display', 'none');
        });
    };

    function checkFadeInVisibility() {
        const scrollTop = $(window).scrollTop();
        const windowHeight = $(window).height();
        const visibilityThreshold = windowHeight * 0.1;

        $('.fade--in:not(.visible)').each(function () {
            const $el = $(this);
            const elTop = $el.offset().top;
            const elBottom = elTop + $el.outerHeight();

            if (elTop + $el.outerHeight() * 0.1 < scrollTop + windowHeight && elBottom - $el.outerHeight() * 0.5 > scrollTop) {
                $el.addClass('visible');
            }
        });
    }

    $(window).on('scroll resize load', checkFadeInVisibility);

    // =======================================
    // Визначення поточної сторінки для header
    // =======================================
    $headerMenuLink.each(function () {
        const linkPath = $(this).attr('href');

        if (linkPath === currentPath) {
            $headerMenuItem.removeClass('active');
            $(this).closest($headerMenuItem).addClass('active');
        }
    });

    // ================
    // Мобільне меню
    // ================
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

    $(window).on('resize', function () {
        if ($(window).width() >= 1024) {
            $burger.removeClass('active');
            $mobileMenu.removeClass('active');
            $body.removeClass('lock');

            if ($submenu.hasClass('visible')) {
                smoothMenuToggle();
                $menuChevron.removeClass('active');
            }
        }
    });

    // ================
    // Ініціалізація
    // ================
    updateHeader();
    checkHeaderPosition();
    lazyLoadBackground();

    $window.on('scroll', function () {
        checkHeaderPosition();
        handleToTopVisibility();
    });
});