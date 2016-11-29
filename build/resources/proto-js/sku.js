(function($){

	function init(){
		$(".hitzone").hover(
			function(){
				$(".chooser").addClass($(this).attr("name"));
			},
			function(){
				$(".chooser").removeClass("sku1").removeClass("sku2").removeClass("sku3");
			});

		$(".hitzone").click(function(){

			if($(this).closest(".container.chooser-1").length){
				$(".picked-card").removeClass("sku1").removeClass("sku2").removeClass("sku3").addClass($(this).attr("name"));
				$(".chooser").animate({"top":"0%"},300);
			}else{
				$(".picked-card").removeClass("sku1").removeClass("sku2").removeClass("sku3").addClass($(this).attr("name"));
				$(".card-art").removeClass("sku1").removeClass("sku2").removeClass("sku3").addClass($(this).attr("name"));
				$(".chooser").animate({"top":"0%"},300);
				$("#reg").css({"opacity":1,"pointer-events":"auto"});
				setTimeout(function(){
					$(".card-art").css("z-index",3);
					$(".card-art").removeClass("shrink");
				},350)
			}


		});

		$(".btn-chooser").click(function(){

			if($(this).closest(".container.chooser-1").length){

				$(".chooser").animate({"top":"-100%"},300);

			}else{

				$(".card-art").addClass("shrink");
				setTimeout(function(){
					$(".card-art").css("z-index",0);
					$(".chooser").animate({"top":"-100%"},300);
					$("#reg").css({"opacity":.5,"pointer-events":"none"});
				}, 600);



			}

		});
	}

	$(init);

})(jQuery);