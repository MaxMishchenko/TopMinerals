$(document).ready(function () {
    const $productCat = $('.main__products-item');
    const $track = $('.main__products-carousel-track');
    const $dotsContainer = $('.main__products-carousel-dots');
    const $buttonsNav = $('.main__products-carousel-nav');
    const $carouselTrack = $('.main__hero-category-slider-track');
    const $slides = $('.main__hero-category-slider-slide');
    const slideGap = 16;

    let currentIndex = 0;
    let currentSlideIndex = 0;
    let slidesToShow = 1;

    // ==================================
    // Функція для ініціалізації слайдера
    // ==================================
    $(window).on('resize', () => {
        initSlider();
    });

    function getVisibleSlides() {
        return $track.find('.main__products-carousel-slide').filter(':visible');
    }

    function initSlider() {
        const $slides = getVisibleSlides();
        const isDesktop = window.innerWidth >= 1024;
        const slidesToShow = isDesktop ? 3 : 1;
        const slideToScroll = 1;

        const totalPages = isDesktop
            ? Math.max($slides.length - slidesToShow + 1, 1)
            : Math.ceil($slides.length / slidesToShow);

        if (isDesktop && $slides.length <= slidesToShow) {
            $track.css('transform', '');
            $dotsContainer.empty();
            $buttonsNav.hide();

            return;
        }

        $buttonsNav.show();
        currentIndex = Math.min(currentIndex, totalPages - 1);
        updateTrackPosition(slidesToShow);
        updateDots(totalPages);
    }

    // =======================
    // Оновлення позиції треку
    // =======================
    function updateTrackPosition(slidesToShow) {
        const $slides = getVisibleSlides();
        const $firstSlide = $slides.eq(0);

        if (!$firstSlide.length) return;

        const slideWidth = $firstSlide.outerWidth(true);
        const offset = currentIndex * (slideWidth + slideGap);

        $track.css('transform', `translateX(-${offset}px)`);
    }

    // =========================
    // Оновлення дотсів слайдера
    // =========================
    function updateDots(totalPages) {
        $dotsContainer.empty();
        for (let i = 0; i < totalPages; i++) {
            const $dot = createDot(i);
            $dotsContainer.append($dot);
        }
    }

    // ==============
    // Дотси слайдера
    // ==============
    function createDot(pageIndex) {
        const $dot = $('<button type="button"></button>')
            .attr('aria-label', 'Перемкнути на слайд ' + (pageIndex + 1))
            .toggleClass('active', pageIndex === currentIndex);

        $dot.on('click', () => {
            currentIndex = pageIndex;
            initSlider();
        });

        return $dot;
    }

    // ===========================
    // Додавання підтримки свайпів
    // ===========================
    function addSwipeSupport() {
        const carousel = $track[0];
        let startX, startY, endX, endY, isSwiping = false;

        carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
        carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
        carousel.addEventListener('touchend', handleTouchEnd);
    }

    // ==============
    // Обробка свайпу
    // ==============
    function handleTouchStart(e) {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        isSwiping = false;
    }

    function handleTouchMove(e) {
        const touch = e.touches[0];
        endX = touch.clientX;
        endY = touch.clientY;

        if (!isSwiping && Math.abs(endX - startX) > Math.abs(endY - startY)) {
            isSwiping = true;
            e.preventDefault();
        }
    }

    function handleTouchEnd() {
        if (!isSwiping) return;

        const deltaX = endX - startX;
        const $slides = getVisibleSlides();

        if (Math.abs(deltaX) > 50) {
            currentIndex = (currentIndex + (deltaX > 0 ? -1 : 1) + $slides.length) % $slides.length;
            initSlider();
        }

        resetTouchValues();
    }

    function resetTouchValues() {
        startX = startY = endX = endY = 0;
        isSwiping = false;
    }

    // ========================
    // Обробка кнопок навігації
    // ========================
    function handlePrevClick() {
        const $slides = getVisibleSlides();
        const isDesktop = window.innerWidth >= 1024;
        const slidesToShow = isDesktop ? 3 : 1;
        const totalPages = isDesktop
            ? Math.max($slides.length - slidesToShow + 1, 1)
            : Math.ceil($slides.length / slidesToShow);

        if (currentIndex > 0) {
            currentIndex--;
            initSlider();
        }
    }

    function handleNextClick() {
        const $slides = getVisibleSlides();
        const isDesktop = window.innerWidth >= 1024;
        const slidesToShow = isDesktop ? 3 : 1;
        const totalPages = isDesktop
            ? Math.max($slides.length - slidesToShow + 1, 1)
            : Math.ceil($slides.length / slidesToShow);

        if (currentIndex < totalPages - 1) {
            currentIndex++;
            initSlider();
        }
    }

    // ===========================
    // Обробка кліків по категорії
    // ===========================
    function handleCategoryClick() {
        $productCat.removeClass('active');
        $(this).addClass('active');

        const selectedCat = $(this).data('cat');
        filterSlidesByCategory(selectedCat);

        currentIndex = 0;
        initSlider();
        window.lazyLoadBackground();
    }

    function filterSlidesByCategory(selectedCat) {
        $('[data-slide-text], [data-slide-img], [data-slide]').each(function () {
            const $el = $(this);
            const text = $el.data('slideText');
            const img = $el.data('slideImg');
            const data = $el.attr('data-slide');
            const match = (text === selectedCat || img === selectedCat || (data && data.split(',').map(v => v.trim()).includes(String(selectedCat))));

            $el.toggleClass('hidden', !match);
        });
    }

    // ======================================
    // Міні слайдер категорій в першій секції
    // ======================================
    function updateCarousel() {
        const slideWidth = $slides.outerWidth(true);
        const offset = -currentSlideIndex * slideWidth;
        $carouselTrack.css('transform', `translateX(${offset}px)`);

        if (currentSlideIndex === 0) {
            $('.main__hero-category-slider-button--prev').addClass('disabled');
        } else {
            $('.main__hero-category-slider-button--prev').removeClass('disabled');
        }

        if (currentSlideIndex >= $slides.length - slidesToShow) {
            $('.main__hero-category-slider-button--next').addClass('disabled');
        } else {
            $('.main__hero-category-slider-button--next').removeClass('disabled');
        }
    }

    function updateSlidesToShow() {
        if (window.innerWidth >= 1440) {
            slidesToShow = 2;
        } else {
            slidesToShow = 1;
        }
    }

    // =======================
    // Ініціалізація слайдерів
    // =======================
    $('.main__hero-category-slider-button--next').click(function () {
        if (currentSlideIndex < $slides.length - slidesToShow) {
            currentSlideIndex++;
        }
        updateCarousel();
    });

    $('.main__hero-category-slider-button--prev').click(function () {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
        }
        updateCarousel();
    });

    updateSlidesToShow();
    updateCarousel();

    $(window).resize(function () {
        updateSlidesToShow();
        updateCarousel();
    });

    // =============
    // Ініціалізація
    // =============
    function init() {
        initSlider();
        addSwipeSupport();

        $('.main__products-carousel-nav--prev').click(handlePrevClick);
        $('.main__products-carousel-nav--next').click(handleNextClick);
        $productCat.on('click', handleCategoryClick);
    }

    init();
});