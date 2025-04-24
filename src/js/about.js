$(document).ready(function () {
    // ========================
    // Акордіон блоку "Добрива"
    // ========================
    const $accordionItems = $('.about__products-list');
    const $allIcons = $('.about__products-icon');
    const $allTexts = $('[data-text]');

    $accordionItems.on('click', function () {
        const $currentItem = $(this);
        const $currentIcon = $currentItem.find('.about__products-icon');
        const $currentText = $currentItem.find('[data-text]');
        const isOpen = $currentIcon.hasClass('open');

        if (isOpen) {
            $currentIcon.removeClass('open');
            $currentText.stop(true, true).animate({opacity: 0}, 150, function () {
                $(this).slideUp(200);
            });
        } else {
            $allIcons.removeClass('open');
            $allTexts.stop(true, true).animate({opacity: 0}, 150, function () {
                $(this).slideUp(200);
            });

            setTimeout(() => {
                $currentIcon.addClass('open');
                $currentText
                    .stop(true, true)
                    .css({display: 'none', opacity: 0})
                    .slideDown(200)
                    .animate({opacity: 1}, 400);
            }, 0);
        }
    });
});