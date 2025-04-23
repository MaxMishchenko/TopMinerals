$(document).ready(function () {
    const $productCat = $('.main__products-item');
    const $track = $('.main__products-carousel-track');
    const $dotsContainer = $('.main__products-carousel-dots');

    let currentIndex = 0;

    // ==============================
    // Функція ініціалізації слайдера
    // ==============================
    function initSlider() {
        const $slides = getVisibleSlides();
        currentIndex = Math.min(currentIndex, $slides.length - 1);

        updateTrackPosition();
        updateDots($slides);
    }

    function getVisibleSlides() {
        return $track.find('.main__products-carousel-slide').filter(':visible');
    }

    function updateTrackPosition() {
        const translateX = `calc(-${currentIndex * 100}% - ${currentIndex * 16}px)`;
        $track.css('transform', `translateX(${translateX})`);
    }

    function updateDots($slides) {
        $dotsContainer.empty();
        $slides.each((i) => {
            const $dot = createDot(i);
            $dotsContainer.append($dot);
        });
    }

    function createDot(i) {
        const $dot = $('<button type="button"></button>')
            .attr('aria-label', 'Перемкнути на слайд ' + (i + 1))
            .toggleClass('active', i === currentIndex);

        $dot.on('click', () => {
            currentIndex = i;
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

        carousel.addEventListener('touchstart', handleTouchStart, {passive: true});
        carousel.addEventListener('touchmove', handleTouchMove, {passive: false});
        carousel.addEventListener('touchend', handleTouchEnd);
    }

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
        currentIndex = (currentIndex - 1 + $slides.length) % $slides.length;
        initSlider();
    }

    function handleNextClick() {
        const $slides = getVisibleSlides();
        currentIndex = (currentIndex + 1) % $slides.length;
        initSlider();
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
