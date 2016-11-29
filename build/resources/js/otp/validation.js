!function($){

	// $.validator.addMethod("regex-pattern", function(val, element) {
	// 	return this.optional(element) || val.match(element.getAttribute("data-val-regex-pattern"));
	// });

	// $("#activate-card").validate({
	// 	rules : {
	// 		CardNumber : {
	// 			required : true,
	// 			"regex-pattern" : true
	// 		},
	// 		SecurityCode : {
	// 			required : true,
	// 			"regex-pattern" : true
	// 		}
	// 	},
	// 	messages : {
	// 		CardNumber : "The Serve Card number is invalid. Please enter a different 15 digit Card number.",
	// 		SecurityCode : "Please enter a valid 3-digit security code."
	// 	},
	// 	errorPlacement: function(error, element) {
	// 		error.appendTo( element.siblings(".field-validation-error") );
	// 	}
	// });

	// $("#balance-alerts").validate({
	// 	rules : {
	// 		DollarAmount : {
	// 			required : $("#LowBalanceAlert").is(":checked"),
	// 			"regex-pattern" : true
	// 		}
	// 	},
	// 	messages : {
	// 		DollarAmount : "Please enter a valid amount"
	// 	},
	// 	errorPlacement: function(error, element) {
	// 		error.appendTo( element.siblings(".field-validation-error") );
	// 	}
	// });

	$("#js-otp-submit-code").validate({
		messages: {
			verification: "Please enter a 6 digit verification code"
		},

		errorPlacement: function(error, element) {
			error.appendTo( element.siblings(".field-validation-error") );
		}
	});

	$.fn.alphanumeric = function (p) {

		p = $.extend({
			ichars: "!@#$%^&*()+=[]\\\';,/{}|\":<>?~`.-_€£¥ ",
			nchars: "",
			allow: "",
			maxchars: ""
		}, p);

		return this.each(function () {
			if (p.nocaps) p.nchars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			if (p.allcaps) p.nchars += "abcdefghijklmnopqrstuvwxyz";

            /*
            Had to change s to be a local variable because it was
            conflicting with omniture.
            */
            var s = p.allow.split('');
            for (i = 0; i < s.length; i++) if (p.ichars.indexOf(s[i]) != -1) s[i] = "\\" + s[i];
            	p.allow = s.join('|');

            var reg = new RegExp(p.allow, 'gi');
            var ch = p.ichars + p.nchars;
            ch = ch.replace(reg, '');

            $(this).keypress(function (e) {

            	if (e.charCode > 123) e.preventDefault();

            	if (!e.charCode) k = String.fromCharCode(e.which);
            	else k = String.fromCharCode(e.charCode);

            	if (ch.indexOf(k) != -1) e.preventDefault();
            	if (e.ctrlKey && k == 'v') e.preventDefault();

                // Limit the max characters, if specified
                if (p.maxchars != "" && typeof (e.currentTarget) != 'undefined'
                	&& p.maxchars < e.currentTarget.value.length + 1
                	&& e.keyCode != 8)
                	e.preventDefault();

              });

          });
};

/* common.js FROM PRODUCTION */
$.fn.numeric = function (p) {

	var az = "abcdefghijklmnopqrstuvwxyz";
	az += az.toUpperCase();

	p = $.extend({
		nchars: az,
		maxchars: ""
	}, p);

	return this.each(function () {
		$(this).alphanumeric(p);
	});
};

$.fn.dollaramount = function (p) {
	var az = "abcdefghijklmnopqrstuvwxyz";
	az += az.toUpperCase();

	p = $.extend({
		nchars: az,
		maxchars: "",
		allow: "."
	}, p);

	return this.each(function () {
		$(this).alphanumeric(p);
	});
}

/* interactions.js FROM PRODUCTION */
$('#verification').keyup(function () {
  if (this.value.match(/[^[$,.0-9]/g)) {
    this.value = this.value.replace(/[^[$,.0-9]/g, '');
  }
});

}(jQuery);