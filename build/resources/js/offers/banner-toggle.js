$(document).ready(function(){

	var bannerToggle = {
		config: {
			container: $(".header-banner"),
			divider: $(".banner-divider"),
			expandable_area: $(".feature-intro"),
			selector: $(".banner-toggle")
		},

		animateToggle: function() {
			var b = bannerToggle.config;

			if (!$(b.container).hasClass("active")) {
				bannerToggle.openToggle();
				$(b.container).addClass("active");
				$(b.selector).addClass("active");
			} else {
				bannerToggle.closeToggle();
				$(b.container).removeClass("active");
				$(b.selector).removeClass("active");
			}
		},

		closeToggle: function() {
			$(bannerToggle.config.divider).fadeOut(100, function(){
				$(bannerToggle.config.expandable_area).slideUp(200, bannerToggle.removeFirstViewClass);
			});
		},

		openToggle: function() {
			$(bannerToggle.config.divider).fadeIn(100, function(){
				$(bannerToggle.config.expandable_area).slideDown(200);
			});
		},

		removeFirstViewClass: function() {
			if ($(bannerToggle.config.container).hasClass("first-view")) {
				$(bannerToggle.config.container).removeClass("first-view");
			}
		},

		init: function() {
			$(bannerToggle.config.selector).click(bannerToggle.animateToggle);
		}
	};

	bannerToggle.init();
});