(function ($) {
    var hasPlaceholder = 'placeholder' in document.createElement('input');
    var isOldOpera = (navigator.userAgent.indexOf("Opera") != -1) && parseFloat(navigator.appVersion) < 10.5;
    $.fn.placeholder = function (options) {
        var placeholder;
        var options = $.extend({}, $.fn.placeholder.defaults, options),
            o_left = options.placeholderCSS.left;

        return (hasPlaceholder) ? this : this.each(function () {
            var $this = $(this),
                inputVal = $.trim($this.val()),

            inputWidth = $this.width(),
            inputHeight = $this.height(),
            inputLineHeight = $this.css('height'),
            inputLineHeight = (parseFloat($this.css("padding-top")) == 0 ? $this.css('height') : 'normal'),
            
                inputId = (this.id) ? this.id : 'placeholder' + (Math.floor(Math.random() * 1123456789)),
                placeholderText = $this.attr('placeholder'),
                placeholder = $('<label for=' + inputId + '>' + placeholderText + '</label>');

            options.placeholderCSS['width'] = inputWidth * 2;
            options.placeholderCSS['height'] = inputHeight * 2;
            options.placeholderCSS['line-height'] = inputLineHeight;
            options.placeholderCSS['padding-top'] = $this.css('padding-top');
            options.placeholderCSS.left = (isOldOpera && (this.type == 'email' || this.type == 'url')) ? '11%' : o_left;
            placeholder.css(options.placeholderCSS);
            $this.wrap(options.inputWrapper);
            $this.attr('id', inputId).after(placeholder);
            if (inputVal) {
                placeholder.hide()
            };

            $this.focus(function () {

                if (!$.trim($this.val())) {
                    placeholder.hide()
                }
            });
            $this.blur(function () {
                if (!$.trim($this.val())) {
                    placeholder.show()
                }
            })
            $this.focusout(function () {
                if (!$.trim($this.val())) {
                    placeholder.show()
                }
            })
        })
    };
    $.fn.placeholder.defaults = {
        inputWrapper: '<span style="position:relative; display:block; overflow: hidden; color: #A9A9A9;"></span>',
        placeholderCSS: {
            'position': 'absolute',
            'text-align': 'left',
            'left': '10px',
            'top': '0px',
            'overflow': 'hidden'
        }
    }
})(jQuery);
$(function () {
    $('textarea[placeholder]').placeholder();
    $('input[placeholder]').placeholder();
});
