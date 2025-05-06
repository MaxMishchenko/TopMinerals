$(document).ready(function () {
    const $track = $('.category__products-carousel-track');
    const $prevBtn = $('.category__products-carousel-nav--prev');
    const $nextBtn = $('.category__products-carousel-nav--next');
    const $dotsContainer = $('.category__products-carousel-dots');
    const slideGap = 16;

    let currentIndex = 0;
    let slidesToShow = 1;

    // ==========================
    // Визначення видимих слайдів
    // ==========================
    function getVisibleSlides() {
        return $track.find('.category__products-carousel-slide').filter(':visible');
    }

    // ===========================
    // Оновлення кількості слайдів
    // ===========================
    function updateSlidesToShow() {
        slidesToShow = window.innerWidth >= 1024 ? 3 : 1;
    }

    // ======================================
    // Визначення кількості сторінок слайдеру
    // ======================================
    function getTotalPages($slides) {
        return slidesToShow === 1
            ? Math.ceil($slides.length / slidesToShow)
            : Math.max($slides.length - slidesToShow + 1, 1);
    }

    // ====================================
    // Зміщення каруселі на поточний індекс
    // ====================================
    function updateTrackPosition() {
        const $slides = getVisibleSlides();
        const $firstSlide = $slides.eq(0);
        if (!$firstSlide.length) return;

        const slideWidth = $firstSlide.outerWidth(true);
        const offset = currentIndex * (slideWidth + slideGap);
        $track.css('transform', `translateX(-${offset}px)`);
    }

    // ======================================
    // Активація/деактивація кнопок навігації
    // ======================================
    function updateNavButtons(totalPages) {
        $prevBtn.toggleClass('disabled', currentIndex <= 0);
        $nextBtn.toggleClass('disabled', currentIndex >= totalPages - 1);
    }

    // ================
    // Створення дотсів
    // ================
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

    // ================
    // Оновлення дотсів
    // ================
    function updateDots(totalPages) {
        $dotsContainer.empty();
        for (let i = 0; i < totalPages; i++) {
            $dotsContainer.append(createDot(i));
        }
    }

    // ======================
    // Ініціалізації слайдера
    // ======================
    function initSlider() {
        const $slides = getVisibleSlides();
        updateSlidesToShow();
        const totalPages = getTotalPages($slides);

        if ($slides.length <= slidesToShow) {
            $track.css('transform', '');
            $dotsContainer.empty();
            $prevBtn.add($nextBtn).addClass('disabled').hide();
            return;
        } else {
            $prevBtn.add($nextBtn).show();
        }

        currentIndex = Math.min(currentIndex, totalPages - 1);
        updateTrackPosition();
        updateNavButtons(totalPages);
        updateDots(totalPages);
    }

    // ==========================
    // Кнопки "Назад" та "Вперед"
    // ==========================
    $prevBtn.click(function () {
        const $slides = getVisibleSlides();
        if (currentIndex > 0) {
            currentIndex--;
            initSlider();
        }
    });

    $nextBtn.click(function () {
        const $slides = getVisibleSlides();
        const totalPages = getTotalPages($slides);
        if (currentIndex < totalPages - 1) {
            currentIndex++;
            initSlider();
        }
    });

    // =================
    // Підтримка свайпів
    // =================
    let touchStartX = 0;
    let touchEndX = 0;

    $track.on('touchstart', function (e) {
        touchStartX = e.originalEvent.touches[0].clientX;
    });

    $track.on('touchmove', function (e) {
        touchEndX = e.originalEvent.touches[0].clientX;
    });

    $track.on('touchend', function () {
        const swipeDistance = touchEndX - touchStartX;
        const minSwipe = 50;

        if (swipeDistance > minSwipe && currentIndex > 0) {
            currentIndex--;
            initSlider();
        } else if (swipeDistance < -minSwipe) {
            const $slides = getVisibleSlides();
            const totalPages = getTotalPages($slides);
            if (currentIndex < totalPages - 1) {
                currentIndex++;
                initSlider();
            }
        }

        touchStartX = 0;
        touchEndX = 0;
    });

    // =================================
    // Ініціалізація слайдера на ресайзі
    // =================================
    $(window).on('resize', initSlider);

    // ================================
    // Початкова ініціалізація слайдера
    // ================================
    initSlider();
});