$(function(){
	// Ben's OTP Code //
	var hiddenEl = $(".hidden-until-active");
	var inputSwitch = $("input#"+hiddenEl.closest("label").attr("for"));

	hiddenEl.hide();

	$("input[name="+inputSwitch.attr("name")+"]").change(function(){
		if (inputSwitch.is(":checked")) {
			hiddenEl.show();
		} else {
			hiddenEl.hide();
		}
	});

	// ******* PROTOTYPE ONLY – FOR FAKING AJAX CALLS ******* //
	$.ajax = function(data){setTimeout(data.success,1500);}
	// ****************************************************** //

	// Main OTP object containing all functional aspects of the flow //
	var otp = {

		// Placeholder object representing OTP server responses //
		server_response: {
			code_sent: true, // indication that user's channel submission was successful
	    code_match: true, // indication that the user entered code matches our dispatched code
	    can_verify: true, // user has remaining verification requests
			can_submit: true // user has remaining code submission attempts
		},

		// Animate fade between current and requested OTP screen //
		animateScreenTransition: function(current_screen, new_screen) {
			var first_screen = $('.js-otp').find("[data-otp-screen="+ current_screen +"]");
			var next_screen = $('.js-otp').find("[data-otp-screen="+ new_screen +"]");

			first_screen.fadeOut("slow", function() {
				next_screen.fadeIn("slow");
			});
		},

		errorHide: function($context) {
			$context.find(".js-otp-error").hide(); // hide the block error

			// if on the code entry screen //
			if ($context.attr('data-otp-screen') === 'entry') {
				var input_field = $context.find("#verification"); // find the input
				
				input_field.removeClass('error'); // remove red highlight from input
				$("#js-otp-submit-code").validate().resetForm(); // remove jQuery validation error text from the form
			}
		},

		errorShow: function($context) {
			$context.find(".js-otp-error").show(); // hide the block error

			// if on the code entry screen //
			if ($context.attr('data-otp-screen') === 'entry') {
				var input_field = $context.find("#verification"); // find the input
				input_field.addClass('error'); // add red highlight to the input
			}
		},

		// Hide or show the global processing overlay and spinner //
		processingHide: function() {
			$('.global-notice.processing').fadeOut(300);
			$('.global-overlay').fadeOut(300);
		},

		processingShow: function() {
			$('.global-notice.processing').fadeIn(300);
			$('.global-overlay').fadeIn(300);
		},

		// Set Listeners for main OTP actions //
		setEventListeners: function() {
			// Link to Default OTP Code Entry Screen //
			$("[data-otp-entry]").on("click", function(event) {
				event.preventDefault();
				otp.toggleChannelText("default");
				otp.animateScreenTransition("home", "entry");
			});

			// Link to OTP Home Screen //
			$("[data-otp-home]").on("click", function(event) {
				event.preventDefault();
				// Make sure all errors are cleared when re-starting the flow //
				otp.errorHide($("[data-otp-screen='home']")); 
				otp.errorHide($("[data-otp-screen='entry']"));
				// Make sure code entry input-field is cleared //
				$("#verification").val("");
				otp.animateScreenTransition("entry", "home");
			});

			// Select Channel Form Submission //
			$("#js-otp-submit-channel").on("submit", function(event) {
				event.preventDefault();
				var data = $(this).serialize();
				// Call submitChannel with form data and success and error callbacks //
				otp.submitChannel(data, otp.submitChannelSuccess, otp.submitChannelError);
			});

			// Submit OTP Code Form Submission //
			$("#js-otp-submit-code").on("submit", function(event) {
				event.preventDefault();
				var data = $(this).serialize();
				// Call submitCode with form data and success and error callbacks //
				otp.submitCode(data, otp.submitCodeSuccess, otp.submitCodeError);
			});
		},

		// Determine which OTP channel was chosen to set correct Code Entry Screen text //
		setSelectedChannel: function() {
			var channel_selection = $("input[name='send-method']:checked").val();

			// If channel_selection is undefined, set it to the value of the present send-method input //
			// For when we provide only one OTP channel option as a hidden input (eg. Serve Mexico) //
			if (!channel_selection) {
				channel_selection = $("input[name='send-method']").val();
			}

			return channel_selection;
		},

		// Submit the channel selection via AJAX //
		submitChannel: function(form_data, successCallback, errorCallback) {
			otp.processingShow();

			$.ajax({
				type: "POST",
				url: "example.dev/otp",
				data: form_data,
				success: successCallback,
				error: errorCallback
			});
		},

		submitChannelSuccess: function(response) {
			// Response_info is a placeholder for the kind of response we expect to get from AJAX success //
			var response_info = { 
				"can-verify": true,
				"code-sent": true	
			};

			otp.server_response.can_verify = response_info["can-verify"];
			otp.server_response.code_sent = response_info["code-sent"];

			if (!otp.server_response.can_verify) {
				// Redirect to 'locked out' error page if too many submit attempts //
				window.location.href = '/OneTimePassword/Error/error-requests.html'; 
			}

			if (otp.server_response.code_sent) {
				otp.processingHide();
				otp.toggleChannelText(otp.setSelectedChannel());
				otp.animateScreenTransition("home", "entry");
			} else {
				otp.processingHide();
				otp.errorShow($("[data-otp-screen='home']"));
			}
		},

		submitChannelError: function() {
			otp.processingHide();
			otp.errorShow($("[data-otp-screen='home']")); // no data has come back - 404/500 type error
		},

		submitCode: function(form_data, successCallback, errorCallback) {
			// If the form passes jQuery validate requirements, submit via AJAX //
			if ($('#js-otp-submit-code').validate().form()) {
				otp.processingShow();

				$.ajax({
					type: "POST",
					url: "example.dev/otp", // Placeholder for actual production url
					data: form_data,
					success: successCallback,
					error: errorCallback
				});
			}
		},

		submitCodeSuccess: function(response) {
			// Response_info is a placeholder for the kind of response we expect to get from AJAX success //
			var response_info = {
				"can-submit": true,
				"code-match": true
			};

			otp.server_response.can_submit = response_info["can-submit"];
			otp.server_response.code_match = response_info["code-match"];

			if (!otp.server_response.can_submit) {
				// Redirect to 'locked out' error page if too many code submission attempts // 
				window.location.href = '/OneTimePassword/Error/error-attempts.html'; 
			}

			if (otp.server_response.code_match) {
				otp.processingHide();
				otp.submitHiddenForm();
			} else {
				otp.processingHide();
				otp.errorShow($("[data-otp-screen='entry']"));
			}
		},

		submitCodeError: function() {
			otp.processingHide();
			otp.errorShow($("[data-otp-screen='entry']"));
		},

		// Re-submit the initial form on the user's behalf //
		submitHiddenForm: function() {
			$('[data-otp-trigger]').submit();
		},

		// Show the appropriate text on the code entry screen (3 options: default, phone, email) //
		toggleChannelText: function(channel_type) {
			var channel_text = $('.js-otp-channel-text');

			channel_text.removeClass('active');
			$('.js-otp-' + channel_type).addClass('active');
		},

		init: function() {
			otp.setEventListeners();
		}
	}

	// Initialize OTP //
	otp.init();
});