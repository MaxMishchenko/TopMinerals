$(document).ready(function () {
    lazyLoadBackground();

    $(window).on('scroll resize', lazyLoadBackground);

    function lazyLoadBackground() {
        $('.lazy-bg').each(function () {
            let $this = $(this);

            if ($this.is(':visible') && $this.offset().top < $(window).scrollTop() + $(window).height()) {
                let bg = $this.data('bg');

                if (bg) {
                    $this.css({'background-image': `url(${bg})`, 'opacity': 0}).animate({opacity: 1}, 400);

                    $this.removeClass("lazy-bg");
                }
            }
        });
    }
});
