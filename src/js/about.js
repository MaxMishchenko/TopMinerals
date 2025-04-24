$(document).ready(function () {
    // ================
    // Добрива акордеон
    // ================
    $('.about__products-list').on('click', function () {
        const $icon = $(this).find('.about__products-icon');
        const $text = $(this).find('[data-text]');
        const isOpen = $icon.hasClass('open');

        $('.about__products-icon').removeClass('open');
        $('[data-text]').stop(true, true).slideUp(200);

        if (!isOpen) {
            $icon.addClass('open');
            $text.stop(true, true).slideDown(200);
        }
    });
});