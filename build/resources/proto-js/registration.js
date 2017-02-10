/*

THIS STUFF MAKES REGISTRATION WORK LIKE PRODUCTION
COMMENT WITH PRODUCTION FILE NAME THAT THE FIXES CAME FROM

*/

(function($){

function showStarterCardSection() {
	$("[data-action-role=action-target][data-widget-name='starter-card']").slideDown(300);
}
function hideStarterCardSection() {
	$("[data-action-role=action-target][data-widget-name='starter-card']").slideUp(300);
}


function setupRules() {
	$('#StarterCardNumber').on("keydown", function () {
		$(this).numeric();
	});
	$('#StarterCardSecurityCode').on("keydown", function () {
		$(this).numeric();
	});
	$('#StarterCardNo').on("click", function () {
		$('#StarterCardNumber').val('');
		$('#StarterCardSecurityCode').val('');
		$('.CardValidation span').html('');
		$('.message.global-error').html('');
		$("#HasStarterCard").val("false");
		hideStarterCardSection();
	});

	$('#StarterCardYes').on("click", function () {
		$("#HasStarterCard").val("true");
		showStarterCardSection();
	});

	var hasStarterCard = $("#HasStarterCard").val();
	if (hasStarterCard != null) {
		if (hasStarterCard.toLowerCase() == "false") {
			hideStarterCardSection();
		}
		else if (hasStarterCard.toLowerCase() == "true") {
			showStarterCardSection();
		}
	}

	$('input[name="Password"]').keydown(
		function (event) {
			var keyStroke = event.keyCode ? event.keyCode : ((event.charCode) ? event.charCode : event.which);
			if (pwStore != "") {
				pwStore = pwStore + String.fromCharCode(keyStroke);
			} else {
				pwStore = String.fromCharCode(keyStroke);
			}
			setTimeout(function () {
				setPasswordContextualHelpRules("kd", pwStore, keyStroke, "Password");
			}, 300);
		});

	$('input[name="Password"]').keypress(
		function (event) {
			var keyStroke = event.keyCode ? event.keyCode : ((event.charCode) ? event.charCode : event.which);
			if (pwTempStore != "") {
				pwTempStore = pwTempStore + String.fromCharCode(keyStroke);
			} else {
				pwTempStore = String.fromCharCode(keyStroke);
			}
			setTimeout(function () {
				setPasswordContextualHelpRules("kp", pwTempStore, keyStroke, "Password");
			}, 300);
		});

	$('input[name="PasswordConfirm"]').keydown(
		function (event) {
			var keyStroke = event.keyCode ? event.keyCode : ((event.charCode) ? event.charCode : event.which);
			if (pwStore != "") {
				pwStore = pwStore + String.fromCharCode(keyStroke);
			} else {
				pwStore = String.fromCharCode(keyStroke);
			}
			setTimeout(function () {
				setPasswordContextualHelpRules("kd", pwStore, keyStroke, "PasswordConfirm");
			}, 300);
		});

	$('input[name="PasswordConfirm"]').keypress(
		function (event) {
			var keyStroke = event.keyCode ? event.keyCode : ((event.charCode) ? event.charCode : event.which);
			if (pwTempStore != "") {
				pwTempStore = pwTempStore + String.fromCharCode(keyStroke);
			} else {
				pwTempStore = String.fromCharCode(keyStroke);
			}
			setTimeout(function () {
				setPasswordContextualHelpRules("kp", pwTempStore, keyStroke, "PasswordConfirm");
			}, 300);
		});

	$('input[name="Pin"]').keydown(
		function (event) {
			var keyStroke = event.keyCode ? event.keyCode : ((event.charCode) ? event.charCode : event.which);
			if (pinStore != "") {
				pinStore = pinStore + String.fromCharCode(keyStroke);
			} else {
				pinStore = String.fromCharCode(keyStroke);
			}
			setTimeout(function () {
				setPinContextualHelpRules("kd", pinStore, keyStroke, "Pin");
			}, 300);
		});

	$('input[name="Pin"]').keypress(
		function (event) {
			var keyStroke = event.keyCode ? event.keyCode : ((event.charCode) ? event.charCode : event.which);
			if (pinTempStore != "") {
				pinTempStore = pinTempStore + String.fromCharCode(keyStroke);
			} else {
				pinTempStore = String.fromCharCode(keyStroke);
			}
			setTimeout(function () {
				setPinContextualHelpRules("kp", pinTempStore, keyStroke, "Pin");
			}, 300);
		});

	$('input[name="PinConfirm"]').keydown(
		function (event) {
			var keyStroke = event.keyCode ? event.keyCode : ((event.charCode) ? event.charCode : event.which);
			if (pinStore != "") {
				pinStore = pinStore + String.fromCharCode(keyStroke);
			} else {
				pinStore = String.fromCharCode(keyStroke);
			}
			setTimeout(function () {
				setPinContextualHelpRules("kd", pinStore, keyStroke, "PinConfirm");
			}, 300);
		});

	$('input[name="PinConfirm"]').keypress(
		function (event) {
			var keyStroke = event.keyCode ? event.keyCode : ((event.charCode) ? event.charCode : event.which);
			if (pinTempStore != "") {
				pinTempStore = pinTempStore + String.fromCharCode(keyStroke);
			} else {
				pinTempStore = String.fromCharCode(keyStroke);
			}
			setTimeout(function () {
				setPinContextualHelpRules("kp", pinTempStore, keyStroke, "PinConfirm");
			}, 300);
		});

	$('input[name="UserName"]').keydown(
		function (event) {
			var keyStroke = event.keyCode ? event.keyCode : ((event.charCode) ? event.charCode : event.which);
			if (unStore != "") {
				unStore = unStore + String.fromCharCode(keyStroke);
			} else {
				unStore = String.fromCharCode(keyStroke);
			}
			setTimeout(function () {
				setUsernameContextualHelpRules("kd", unStore, keyStroke, "UserName");
			}, 300);
		});

	$('input[name="UserName"]').keypress(
		function (event) {
			var keyStroke = event.keyCode ? event.keyCode : ((event.charCode) ? event.charCode : event.which);
			if (unTempStore != "") {
				unTempStore = pinTempStore + String.fromCharCode(keyStroke);
			} else {
				unTempStore = String.fromCharCode(keyStroke);
			}
			setTimeout(function () {
				setUsernameContextualHelpRules("kp", unTempStore, keyStroke, "UserName");
			}, 300);
		});

	var nameLengthCheck = {
		limit: 21,
		lengthError: $('.name-length-warning'),
		checkFields: $('.name-length-check'),

		runCheck: function () {
			var totalChar = 0;

			nameLengthCheck.checkFields.each(function () {
				var thisLength = $(this).attr('value').length;
				totalChar = totalChar + thisLength;
			});

			if (totalChar <= nameLengthCheck.limit) {
				nameLengthCheck.lengthError.hide('fast');
			} else {
				nameLengthCheck.lengthError.show('fast');
			}
		},

		init: function () {
			if (nameLengthCheck.checkFields) {
				nameLengthCheck.runCheck();

				$('.name-length-check').on('blur', function () {
					nameLengthCheck.runCheck();
				});
			}
		}
	};

	nameLengthCheck.init();

	var ssnField = $('.SsnNumericClass');
	var maskedSsnField = $('.MaskedSsnNumericClass');

	var isIsisAcntSetup = ($('#isIsisAcntSetup').val());
	if (isIsisAcntSetup != undefined && isIsisAcntSetup == 'true') {
		maskedSsnField.hide();
		ssnField.show();


		function mask() {
			var tel = '';
			var val = ssnTempStore.split('');
			for (var i = 0; i < val.length; i++) {

				if (val[i] != "-") {
					val[i] = unescape("%u25CF");
				}
				tel = tel + val[i];
			}
			maskedSsnField.val(tel);
		}


		ssnField.on('blur', function () {
			if ($(this).val().length >= 11) {
				ssnTempStore = ssnField.val();
				if (ssnTempStore != '') {
					maskedSsnField.val(ssnTempStore);
					maskedSsnField.show();
					ssnField.hide();
					mask();
				}
			}
		});
		maskedSsnField.on('focus', function () {
			maskedSsnField.blur();
			maskedSsnField.hide();
			ssnField.val('');
			ssnField.show();
			ssnField.focus();
		});

		ssnField.on('focus', function () {
		});
	} else {

		$('#SsnFull').on('blur', function () {
			if ($(this).val().length >= 11) {
				document.getElementById("SsnFull").setAttribute("type", "password");
			}
		});

		$('#SsnFull').on('focus', function () {
			document.getElementById("SsnFull").setAttribute("type", "tel");
		});

		$('#SsnFull, #SsnLast4').on('focus', function () {
			$(this).val('');
		});

	}

	$('#check-balance').click(function (e) {
		e.preventDefault();
		userNameRequiredCondValidation();
		$('.card-balance.grid-row').remove();
		var cardnumbererror = $('#StarterCardNumber').valid();
		var cardcodeerror = $('#StarterCardSecurityCode').valid();
		if (cardcodeerror == 0 || cardnumbererror == 0)
			return false;

		var StarterCardNumber = $('#StarterCardNumber').val();
		var CardId = $('#StarterCardSecurityCode').val();
		if ($('.card-balance').length > 0)
			$('.card-balance').remove();

		$('#check-balance').addClass('inline-loading');

		var result = null;

		$.ajax({
			url: P2P_PATH + "User/Registration/GetCardBalance",
			data: { argString: "arg string" },
			dataType: "json",
			traditional: true,
			type: "POST",
			data: { CardNumber: StarterCardNumber, CardId: CardId },
			async: true,
			success: function (result) {
				$('#check-balance').removeClass('inline-loading');

				if (result != null && result.isRedirect) {
					window.location = result.redirectUrl;
					return;
				}

				if (result != null && result.errorMessage.toString() == "") {
					var value = '<div class="card-balance grid-row"><div class="label grid-contents">' + JSResxKeys.Scripts_Registration_Custom_AjaxCardBalance_Part1 + '</div><div class="value grid-contents">' + JSResxKeys.Scripts_Registration_Custom_AjaxCardBalance_Part2 + result.availableBalance.toFixed(2).toString() + '</div></div>';
					if ($('.card-balance').length == 0) {
						$(value).insertAfter('.check-balance');
					}
					$('.CardValidation span').html('');
				}
				else {
					$('.CardValidation span').html(result.errorMessage.toString());
				}
			},
			error: function () {
			}
		});


});

}

function setPasswordContextualHelpRules(fromPress, pwStore, keyStroke, field) {

	var p = $('input[name="' + field + '"]');
	if (p[0].value == "") {
		setAllPasswordRulesFailed(p);
		return;
	}

	pwStore = p[0].value;
	var dispProp = $("[data-valmsg-for='Password']").css("display");
	setAllPasswordRules(pwStore, dispProp);
}

function setPinContextualHelpRules(fromPress, pinStore, keyStroke, field) {
	initialState = false;
	var p = $('input[name="' + field + '"]');
	if (p[0].value == "") {
		setAllPinRulesFailed(p);
		return;
	}

	pinStore = p[0].value;
	var dispProp = $("[data-valmsg-for='Pin']").css("display");
	setAllPinRules(pinStore, dispProp, p);
}

setupRules();

})(jQuery);