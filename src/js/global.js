$(document).ready(function () {
    const $window = $(window);
    const windowHeight = $window.height();
    const $body = $('body');
    const $header = $('#header');
    const $burger = $('#burger');
    const $menu = $('#menu');
    const $menuChevron = $('#menu-chevron');
    const $submenu = $('#submenu');
    const $mobileMenu = $('#mobile-menu');
    const $lazyElements = $('.lazy-bg');
    const $toTop = $('.to-top');

    let scrollTimeout;
    let throttleTimer = null;

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
    window.lazyLoadBackground = function () {
        const scrollTop = $window.scrollTop();

        $('.lazy-bg').each(function () {
            const $el = $(this);
            const elTop = $el.offset().top;
            const bg = $el.data('bg');

            if ($el.hasClass('lazy-bg') && $el.is(':visible') && elTop < scrollTop + windowHeight && bg) {
                $el.css({ 'background-image': `url(${bg})`, opacity: 0 })
                    .animate({ opacity: 1 }, 400)
                    .removeClass('lazy-bg');
            }
        });
    };

    function throttledLazyLoad() {
        if (throttleTimer) return;

        throttleTimer = setTimeout(() => {
            window.lazyLoadBackground();
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

    $window.on('scroll', function () {
        checkHeaderPosition();
        handleToTopVisibility();
    });
});