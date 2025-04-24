$(document).ready(function () {
    const $selectField = $('.contacts__form-select-field');
    const $trigger = $selectField.find('#custom-select');
    const $optionsList = $selectField.find('.contacts__form-select-options');
    const $optionsWrapper = $selectField.find('.contacts__form-select-wrapper');
    const $options = $optionsList.find('.custom--option');
    const $selectedText = $trigger.find('#selected-region');
    const $hiddenInput = $selectField.find('input[name="region"]');
    const $phoneInput = $('#phone');
    const $emailInput = $('#email');
    const $privacyCheckbox = $('#privacy-checkbox');
    const $privacy = $('#privacy');
    const $nameInput = $('#name');
    const $form = $('#contact-form');
    const $submitButton = $('#submit');
    const defaultPrefix = '+380 ';
    const $faqItems = $('.contacts__faq-list');
    const $allIcons = $('.contacts__faq-icon');
    const $allTexts = $('[data-text]');

    // ===================
    // Функції для селекту
    // ===================
    function toggleOptions(e) {
        e.stopPropagation();
        $optionsList.toggleClass('open');
        $optionsWrapper.toggleClass('open');
        $selectField.toggleClass('active');
    }

    function selectOption(e) {
        e.stopPropagation();

        const $this = $(this);
        const value = $this.data('value');
        const text = $this.text();

        $selectedText.text(text);
        $hiddenInput.val(value);
        $options.removeClass('selected');
        $this.addClass('selected');

        closeSelect();
    }

    function closeSelect() {
        $optionsList.removeClass('open');
        $optionsWrapper.removeClass('open');
        $selectField.removeClass('active');
    }

    function handleSelectKeydown(e) {
        if (e.key === 'Enter' && $(this).is(':focus')) {
            e.preventDefault();
            $trigger.trigger('click');
        }
    }

    // ================
    // Обробка телефону
    // ================
    function autoPrefixPhone() {
        if (!$phoneInput.val().startsWith(defaultPrefix)) {
            $phoneInput.val(defaultPrefix);
        }
    }

    function formatPhoneInput() {
        let digits = $phoneInput.val().replace(/\D/g, '');

        if (digits.length === 1 && !$phoneInput.val().startsWith(defaultPrefix)) {
            digits = '380' + digits;
        }

        if (!digits.startsWith('380')) {
            digits = '380' + digits.replace(/^380/, '');
        }

        digits = digits.slice(0, 12);

        let formatted = '+';
        if (digits.length > 0) formatted += digits.substring(0, 3);
        if (digits.length > 3) formatted += ' ' + digits.substring(3, 5);
        if (digits.length > 5) formatted += ' ' + digits.substring(5, 8);
        if (digits.length > 8) formatted += ' ' + digits.substring(8, 12);

        $phoneInput.val(formatted);

        if ($phoneInput.hasClass('error') && digits.length === 12) {
            $phoneInput.removeClass('error');
        }
    }

    function preventPrefixDeletion(e) {
        const val = $phoneInput.val();
        if ((e.key === 'Backspace' || e.key === 'Delete') && $phoneInput[0].selectionStart <= defaultPrefix.length) {
            e.preventDefault();
        }
    }

    function validatePhone() {
        const digits = $phoneInput.val().replace(/\D/g, '');
        if (digits.length === 0) {
            $phoneInput.val('');
            $phoneInput.removeClass('error');
        } else if (digits.length !== 12) {
            $phoneInput.addClass('error');
        } else {
            $phoneInput.removeClass('error');
        }
    }

    // ===============
    // Валідація email
    // ===============
    function validateEmail() {
        const emailValue = $emailInput.val().trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (emailValue === '') {
            $emailInput.removeClass('error');
            return true;
        }

        if (!emailRegex.test(emailValue)) {
            $emailInput.addClass('error');
            return false;
        }

        return true;
    }

    function handleEmailInput() {
        if ($emailInput.hasClass('error')) {
            if (validateEmail()) {
                $emailInput.removeClass('error');
            }
        }
    }

    function handleEmailBlur() {
        if (!validateEmail()) {
            $emailInput.addClass('error');
        }
    }

    // =============
    // Обробка форми
    // =============
    function validateForm() {
        let formIsValid = true;

        $form.find('[required]').each(function () {
            if ($(this).val().trim() === '') {
                $(this).addClass('error');
                formIsValid = false;
            } else {
                $(this).removeClass('error');
            }
        });

        const phoneDigits = $phoneInput.val().replace(/\D/g, '');
        if (phoneDigits.length !== 12) {
            $phoneInput.addClass('error');
            formIsValid = false;
        } else {
            $phoneInput.removeClass('error');
        }

        if (!$privacy.prop('checked')) {
            $privacy.addClass('error');
            formIsValid = false;
        } else {
            $privacy.removeClass('error');
        }

        if (!formIsValid) {
            const $firstError = $form.find('.error').first();

            if ($firstError.length) {
                const offset = $firstError.offset().top - ($(window).height() / 2) + ($firstError.outerHeight() / 2);
                $('html, body').animate({
                    scrollTop: offset
                }, 500);
            }
        }

        return formIsValid;
    }

    function submitForm(e) {
        e.preventDefault();

        if (validateForm()) {
            const formData = $form.serialize();
            const success = $('.contacts__form');
            const formOffset = success.offset().top;
            const formHeight = success.outerHeight();
            const windowHeight = $(window).height();
            const scrollTo = formOffset - (windowHeight / 2) + (formHeight / 2);

            $.ajax({
                type: 'POST',
                url: 'https://jsonplaceholder.typicode.com/posts',
                data: formData,
                success: function (response) {
                    $('.contacts__form-wrapper').hide();
                    $('.contacts__form-success').removeClass('hidden');

                    $('html, body').animate({
                        scrollTop: scrollTo
                    }, 600);

                    $form[0].reset();
                    $form.find('.error').removeClass('error');
                },
                error: function (xhr, status, error) {
                }
            });
        }
    }

    // =============================
    // Наглядач за помилками в формі
    // =============================
    function handleMutation(mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.attributeName === 'class') {
                const $target = $(mutation.target);

                if ($target.hasClass('error')) {
                    $target.siblings('.contacts__form-field-error').css('display', 'flex');
                } else {
                    $target.siblings('.contacts__form-field-error').css('display', '');
                }
            }
        });
    }

    const observer = new MutationObserver(handleMutation);

    // ===============
    // Обробники подій
    // ===============
    $trigger.on('click', toggleOptions);
    $trigger.on('keydown', handleSelectKeydown);
    $options.on('click', selectOption);
    $(document).on('click', closeSelect);
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            closeSelect();
        }
    });

    $phoneInput.on('focus', autoPrefixPhone);
    $phoneInput.on('input', formatPhoneInput);
    $phoneInput.on('keydown', preventPrefixDeletion);
    $phoneInput.on('blur', validatePhone);

    $emailInput.on('input', handleEmailInput);
    $emailInput.on('blur', handleEmailBlur);

    $submitButton.on('click', submitForm);

    $('.contacts__form-field').each(function () {
        observer.observe(this, {
            attributes: true,
            attributeFilter: ['class']
        });
    });

    // =====================
    // Взаємодія з чекбоксом
    // =====================
    function togglePrivacyCheckbox(e) {
        e.preventDefault();

        const $checkbox = $('#privacy');
        const $icon = $('.contacts__form-checkbox-icon');

        $checkbox.removeClass('error');

        if ($checkbox.hasClass('checked')) {
            $checkbox.prop('checked', false).removeClass('checked');
            $icon.removeClass('checked');
        } else {
            $checkbox.prop('checked', true).addClass('checked');
            $icon.addClass('checked');
        }
    }

    $('#privacy-checkbox, #privacy').on('click', togglePrivacyCheckbox);

    $privacy.on('change', function () {
        if ($(this).prop('checked')) {
            $(this).removeClass('error');
        }
    });

    $nameInput.on('input', function () {
        const value = $(this).val().trim();
        if ($(this).hasClass('error') && value.length >= 2) {
            $(this).removeClass('error');
            $(this).siblings('.contacts__form-field-error').css('display', '');
        }
    });

    // ============
    // FAQ акордеон
    // ============
    $faqItems.on('click', function () {
        const $currentItem = $(this);
        const $currentIcon = $currentItem.find('.contacts__faq-icon');
        const $currentText = $currentItem.find('[data-text]');
        const isOpen = $currentIcon.hasClass('open');

        if (isOpen) {
            $currentIcon.removeClass('open');
            $currentText.stop(true, true).animate({ opacity: 0 }, 150, function () {
                $(this).slideUp(200);
            });
        } else {
            $allIcons.removeClass('open');
            $allTexts.stop(true, true).animate({ opacity: 0 }, 150, function () {
                $(this).slideUp(200);
            });

            setTimeout(() => {
                $currentIcon.addClass('open');
                $currentText
                    .stop(true, true)
                    .css({ display: 'none', opacity: 0 })
                    .slideDown(200)
                    .animate({ opacity: 1 }, 400);
            }, 0);
        }
    });
});
