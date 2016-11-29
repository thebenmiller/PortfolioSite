$(document).ready(function(){

var DropdownMenu = {

	container: $(".js-dropdown"),
	menu_icon: $(".js-dropdown-selector"),
	last_link: $(".js-dropdown-links a").last(),

	addNonTouchListeners: function() {
		// When mouse hovers over dropdown, show the dropdown
		DropdownMenu.container.on("mouseenter", function() {
			DropdownMenu.container.addClass("active");
		});

		// When mouse isn't hovering over dropdown, hide the dropdown
		DropdownMenu.container.on("mouseleave", function() {
			DropdownMenu.container.removeClass("active");
		});

		// On focus of menu_icon, show dropdown menu
		DropdownMenu.menu_icon.on("focus", function() {
			DropdownMenu.container.addClass("active");
		});

		// On blur of last dropdown link, hide the dropdown
		DropdownMenu.last_link.on("blur", function() {
			DropdownMenu.container.removeClass("active");
		});
	},

	/** have to check for touch class when events occur
	 *  since it always exists on first pageload
	 */

	addTouchListeners: function() {
		// When user touches menu_icon, toggle show/hide the dropdown
		DropdownMenu.menu_icon.on("click", function(e) {
			e.preventDefault()

			if ($("html").hasClass("touch")) {
				DropdownMenu.container.toggleClass("active");
			}
		});

		// When user taps outside dropdown, hide the dropdown
		DropdownMenu.menu_icon.on("touchleave", function(e) {
			e.preventDefault()

			if ($("html").hasClass("touch")) {
				DropdownMenu.container.removeClass("active");
			}
		});
	},

	init: function() {
		DropdownMenu.addNonTouchListeners();
		DropdownMenu.addTouchListeners();
	}
}

DropdownMenu.init();

});
