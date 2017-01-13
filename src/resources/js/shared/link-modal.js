(function($){

	Hudson = {};

	Hudson.ModalLink = new function(){

		ML = this;

		var me;
		var link;
		var isFixed = true;

		ML.init = function(node){

			me = node;
			isFixed = desktopOrModernDevice();

			$("[data-widget-type=modal-link]").on("click", function(e){
				(e.preventDefault) ? e.preventDefault() : e.returnValue = false;
				link = $(this).attr("href");
				me.find("[data-widget-property=continue-action]").attr("href", link);
				showModal();
				return false;
			});

			me.find("[data-widget-property=close-action],[data-widget-property=continue-action]").on("click", function(){
				hideModal();
			});
		}

		var desktopOrModernDevice = function(){
				var supportsFixed = false;

				if($("html").hasClass("notouch")) return true;

				var UA = window.navigator.userAgent,
					androidRe = /(Android 4)/,
					iOSRe = /(iPhone|iPad)/;

				if (UA.match(androidRe) && window.FileReader){
					supportsFixed = true;
				}else if (UA.match(iOSRe) && window.FileReader){
					supportsFixed = true;
				}

				return supportsFixed;
		}

		var showModal = function(){

			if(isFixed){
				if($("html").hasClass("touch"))
					window.scrollTo(0,0);
				me.find(".modal-overlay").fadeIn(300);
				me.find(".modal-container").fadeIn(300);
				setTimeout(function(){
					me.find("[data-widget-property=close-action]").eq(1).focus();
				}, 400);
			}else{
				if (window.confirm("You are now leaving this American Express Serve website. You are about to enter a third-party website where all use is governed by that website's terms and conditions and subject to its privacy and security policies and practices.")) {
				  window.open(link);
				}


			}
		}

		var hideModal = function(){
			me.find(".modal-overlay").fadeOut(300);
			me.find(".modal-container").fadeOut(300);

		}

	}

	 $(document).ready(function() {
	 	var linkModal =  $("[data-widget-type=link-modal]");
	 	if(linkModal.length)
        	Hudson.ModalLink.init(linkModal);
    });

})(jQuery);