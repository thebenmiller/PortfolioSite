//	!!IMPORTANT!!
//	THIS FILE SHOULD BE MERGED INTO INTERACTIONS.JS



(function($){

	var Hudson = {};

	Hudson.Widget = new function () {

		var HW = this;

		HW.init = function() {

			var $conditionalSelect = $("[data-widget-type=conditional-select]");

			if($conditionalSelect.length)
				HW.ConditionalSelect.init($conditionalSelect);
		}

		HW.ConditionalSelect = new function(){

			var CS = this;
			var me,parent,children;

			CS.init = function(n){
				me = n;
				parent = me.find("[data-widget-property=parent-select]");
				children = me.find("[data-widget-property=child-select]");

				parent.on("change", CS.parentChange);
				CS.parentChange();
				
			}

			CS.parentChange = function(){
				var selectedValue = parent.val();
				var thisChild = children.filter("[name="+selectedValue+"]");
				children.closest(".filter-item").hide();
				thisChild.val(0).closest(".filter-item").show();
				CS.childChange(thisChild);
			}

			CS.childChange = function(thisChild){
				var otherChild = children.not(thisChild);
				thisChild[0].selectedIndex = otherChild[0].selectedIndex;
				thisChild.trigger("change");
			}

		}
	}

	$(document).ready(function() {
		Hudson.Widget.init();
	})

})(jQuery);