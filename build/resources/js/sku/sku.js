(function($){

	var SKU_CHOOSER = function(){

		var $me;
		var agreementLinks = {
			"sku-serve" : "https://www.serve.com/legal.html#Serve_User_Agreement",
			"sku-cash" : "https://www.serve.com/legal.html#Serve_User_Agreement",
			"sku-rewards" : "https://www.serve.com/legal.html#Serve_User_Agreement"
		};
		var oldAndroid = null;

		var init = function(){

			checkAndroidVersion();

			$me = $(".container.card-chooser");
			$me.find("#TempCardYes").on("change", tempChange);
			$me.find("#TempCardNo").on("change", tempChange);
			//tempChange(null);
			$me.find(".chooser-link").click(chooserClick);
			$me.find(".card-panel").click(chooserPanelClick);
			$me.find(".process-temp-card").click(processTempCard);
			$me.find(".chooser-temp-selected .close-btn-container").click(closeTempCard);
			$me.find("#TempCardSecurityCode").focus(showCSC).blur(hideCSC);

			$me.find("#fee-link").click(showFeeChart);
			$(".fee-chart-container").find("#fee-chart-close").click(closeFeeChart);

			if($(".selected-sku.default-visible.sku-cash").length>0){
				$(".cash-atm-disc").hide();
			}

		}

		var checkAndroidVersion = function(){
			if (window.navigator.userAgent.match(/Android/) &&
				! window.navigator.userAgent.match(/Android 4/) &&
				! window.FileReader ){
				oldAndroid = true;
				$("html").addClass("old-android");
			}
		}

		var tempChange = function(){
			var showTemp = $("#TempCardYes").is(":checked");
			toggleTempSelected(showTemp);
		}

		var toggleTempSelected = function(showTemp){
			var isSmall = checkIsSmall();
			//$(".temp-tile-selected, .temp-tile-temp").filter(".default-hidden").removeClass("default-hidden");
			if(showTemp){
				$me.find(".chooser-default").addClass("temp-selected");
				$me.find(".card-art-perspective").addClass("shrink");
				//if(!isSmall){
					setTimeout(function(){
						$me.find(".temp-tile-selected").fadeOut(300,function(){
							$me.find(".temp-tile-temp").fadeIn(150);
						});
					},isSmall?0:150);

				$(".registration-container").addClass("faded");
			}else{
				$me.find(".chooser-default").removeClass("temp-selected");
				$me.find(".temp-tile-temp").fadeOut(300,function(){
					$me.find(".temp-tile-selected").fadeIn(150);
					setTimeout(function(){
						$me.find(".card-art-perspective").removeClass("shrink");
					},100);
				});
				$(".registration-container").removeClass("faded");
			}
		}

		var chooserClick = function(){
			var isSmall = checkIsSmall();
			var cssTrans = checkNoCssTransitions();
			$me.find(".card-art-perspective").addClass("shrink");
			setTimeout(function(){
				$(".registration-container").addClass("faded");
				$me.find(".chooser").show(0);
				$me.find(".chooser-contents").animate({top:0},300);
			}, (isSmall||cssTrans)?0:150);
		}



		var chooserPanelClick = function(){
			var isSmall = checkIsSmall();
			var sku = $(this).attr("name");

			$me.find("#sku-selected").val(sku);
			$("#sku-agreement").attr("href",agreementLinks[sku]);

			$me.find(".selected-sku").hide();
			$me.find(".selected-sku."+sku).show();
			$(".registration-container").removeClass("faded");
			$me.find(".chooser-contents").animate({top:"100%"},300,function(){
				$me.find(".chooser").hide(0);
				//if(!isSmall)
				$me.find(".card-art-perspective").removeClass("shrink");
			});

			if(sku == "sku-serve"){
				$(".cash-atm-disc").show();
			}else{
				$(".cash-atm-disc").hide();
			}
		}

		var processTempCard = function(event){
			event.preventDefault();
			var panelHeight;
			$("#processing").css("visibility","visible");

			//replace with ajax call...
			setTimeout(function(){
				$("#processing").css("visibility","hidden");

				//replace with data from server about card
				//$(".user-agreement").attr("href",agreementLinks[sku]);

				$(".registration-container").removeClass("faded");

				$me.find(".chooser-default").fadeOut(300,function(){
					$me.find(".chooser-temp-selected").fadeIn(300);
				});

				//$me.find(".chooser-default").hide();
			}, 500);
		}

		var closeTempCard = function(){
			$me.find("#TempCardNumber").val("");
			$me.find("#TempCardSecurityCode").val("");
			$me.find(".chooser-temp-selected").hide();
			$me.find(".chooser-default").show();
			$(".registration-container").addClass("faded");
		}

		var showCSC = function(){
			var isSmall = checkIsSmall();
			if(!isSmall)
				$me.find(".temp-helper").show();
		}

		var hideCSC = function(){
			var isSmall = checkIsSmall();
			if(!isSmall)
				$me.find(".temp-helper").hide();
		}

		var checkIsSmall = function(){
			return ($("html").attr("data-current-breakpoint") == "small" || $("html").attr("data-current-breakpoint") == "medium");
		}

		var checkNoCssTransitions = function(){
			return !$("html").hasClass("csstransitions");
		}

		var showFeeChart = function(){
		if(!oldAndroid){
				$("body").addClass("ww-overlay");
				$("html").addClass("ww-overlay");
				$(".fee-chart-container").fadeIn(300);
			}else{
				$("html,body").animate({"scrollTop":0},0);
				$(".fee-chart-container").show(0);
			}
		}

		var closeFeeChart = function(){
			$("body").removeClass("ww-overlay");
			$("html").removeClass("ww-overlay");
			$(".fee-chart-container").fadeOut(300);
		}

		$(init);

	}();

})(jQuery);