$(document).ready(function(){
	
	$("#suggested").next().addClass("active")
	var form = $("#toggle-form")

	$("#edit-address--link").on("click", function(){
		form.toggleClass("hide-form")

		if(!form.hasClass("hide-form")){
			$("#original").next().addClass("active")
			$("#suggested").next().removeClass("active")
		}

	})

	$("#suggested").on("click", function(){
		if($(this).next().hasClass("active")){
			form.addClass("hide-form")
		}

	})

})