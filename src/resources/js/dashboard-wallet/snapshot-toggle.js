$(document).ready(function(){

	var springToggle = {
		init: function() {
			$( ".banner-toggle" ).click(function() {
				$( this ).toggleClass( "active" );
				$( "#spring-header" ).toggleClass( "active" );
			});
		}
	};

	springToggle.init();
});