$(function(){

	var pin = {
		config: {
			number: ""
		},

		init: function(userPin){
			pin.config.number = userPin
			pin.configDOM()
			pin.addEventListeners()
		},

		configDOM: function(){//setting corresponding pin digit as data attribute to each button
			var allButtons = $(".view-pin-digit")
			
			$.each(allButtons, function(index){
				$(this).data("pinDigit", pin.config.number.charAt(index))
			})
		},

		addEventListeners: function(){
			$(".view-pin-digit").on("click", pin.checkIfActive)
		},

		checkIfActive: function(){
			var clicked = $(this)
			var allButtons = $(".view-pin-digit")

			if(clicked.hasClass("active")){ // if clicked button has digit revealed, hide it
				pin.hideDigit()
			} else if(allButtons.hasClass("active")){ // on click, if any digit is revealed, hide it, then reveal the clicked digit
				pin.hideDigit()
				pin.revealDigit(clicked)
			} else if (allButtons.hasClass("active") == false){ // on click, if no digit is revealed, reveal clicked digit
				pin.revealDigit(clicked)
			} else{ // otherwise, hide all digits
				pin.hideDigit()
			}
		},

		hideDigit: function(){
			$(".active").removeClass("active").children(".view-pin-text").text("View")
		},

		revealDigit: function($clicked){
			$clicked.animate({opacity: .1}, 150, function(){
				$(this).addClass("active").children(".view-pin-text").text($(this).data("pinDigit"))
				$(this).css("opacity", 1)
			})
		}

	}

	pin.init('2015')

})