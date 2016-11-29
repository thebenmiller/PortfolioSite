$(document).ready(function(){
	var regEmailServe = {
		regEmailProvider: function(){
			var actionArea = $('.action-area');
			var emailAddress = $('#email-address').text();
			var verifyEmailContainer = $('.btn-submit');
			var verifyEmail = $('.btn-primary');

			//checks if email address used to register is from 1 of our top email providers (gmail, yahoo, msn/hotmail & aol)
			if( /\@(gmail|yahoo|msn|hotmail|outlook|aol)/gi.test(emailAddress) ) {
				//if true, show action area and the verify email button
				actionArea.removeClass('lg-hide');
				verifyEmailContainer.removeClass('hidden');

				//conditional to change href of the verify email button according to the email address provider used during registration
				if( /\@(gmail)/gi.test(emailAddress) ) {
					verifyEmail.attr('href','//mail.google.com');
				} else if( /\@(yahoo)/gi.test(emailAddress) ) {
					verifyEmail.attr('href','//mail.yahoo.com');
				} else if( /\@(msn|hotmail|outlook)/gi.test(emailAddress) ) {
					verifyEmail.attr('href','//login.live.com');
				} else if( /\@(aol)/gi.test(emailAddress) ) {
					verifyEmail.attr('href','//mail.aol.com');
				} else {
					// do nothing
				}
			}
		}
	};

	jQuery.fn.extend(regEmailServe);
	regEmailServe.regEmailProvider();
});