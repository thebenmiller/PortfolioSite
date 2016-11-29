(function($){

	//added support for indexOf on IE8
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (searchElement , fromIndex) {
			var i,
			pivot = (fromIndex) ? fromIndex : 0,
			length;

			if (!this) {
				throw new TypeError();
			}

			length = this.length;

			if (length === 0 || pivot >= length) {
				return -1;
			}

			if (pivot < 0) {
				pivot = length - Math.abs(pivot);
			}

			for (i = pivot; i < length; i++) {
				if (this[i] === searchElement) {
					return i;
				}
			}
			return -1;
		};
	}


/**
* The "Hudson" object is used to namespace all of the code defined on the Serve site.  Although technically a class, it's role is purely for namespacing.
*
* @class Hudson
* @constructor function
*/
var Hudson = {};
window.Hudsoninteraction = Hudson;

Hudson.Async = new function () {
	var HA = this;

	HA.ajaxCall = function(referencingNode, widgetNode, callURL, callBack) {
		var localLoadingIndicator = $('[data-widget-role=inline-process][data-role-name="' + referencingNode.attr('data-widget-role') + '"]');

		toggleLoader(localLoadingIndicator, 1);

			//THIS IS PROTOTYPE SPECIFIC, AND SHOULD BE REPLACED BY FUNCTIONAL AJAX CALL CODE
			var FAKE_result = true;
			setTimeout(function() {
				callBack(FAKE_result);
				toggleLoader(localLoadingIndicator, 0);
			}, 2000);
		}

		/**
		* A simple function that shows/hides a loading indicator
		*
		* @namespace Hudson.Async
		* @param {Object} loaderNode A jQuery object representing the particular loading indicator to toggle
		* @param {Boolean} direction Bool true (1) turns the loader node on, false turns it off
		* @return {none}
		*/
		function toggleLoader(loaderNode, direction) {
			if (direction) {
				loaderNode.css('display', 'block');
				loaderNode.addClass('active');
			} else {
				loaderNode.css('display', 'none');
				loaderNode.removeClass('active');
			}
		}
	}

	Hudson.testTouch = function() {
		return !!('ontouchstart' in window) || !!('onmsgesturechange' in window) || (navigator.appVersion.toLowerCase().indexOf("mobile") != -1);
	};

	/**
	* Hudson.Window contains methods and properties related to the viewport and content resizing around changes in viewport size
	*
	* @class Window
	* @namespace Hudson
	* @constructor function
	*/
	Hudson.Window = new function () {
		var W = this;

		W.touch = true;
		W.width = 0;
		W.scrollPos = 0;

		/**
		* Sets some initial variables for the viewport based on device size, capabilities
		*
		* @method init
		* @namespace Hudson.Window
		* @param {none}
		* @return {none}
		*/
		W.init = function() {
			//$(window).on('load', windowLoadEvent);
			windowLoadEvent();
			$(window).on('orientationchange orientationEvent resize', windowChangeEvent);
			testInlineBehavior();
		};


		function testInlineBehavior() {
			var testSet = "<div id = 'inline-test' class = 'grid-row'><div class ='check' style = 'width: 1px' id = 'unit1'></div> <div class = 'check' style = 'width: 1px'  id = 'unit2'></div></div>"
			$('body').append(testSet);
			if ($('#unit2').offset().left > 1) {$('html').addClass('inline-fail')} else {$('html').addClass('inline-pass')};
			$('#inline-test').remove();
		}


		/**
		* Fires on load to attach the touch class and data-current-breakpoint attr to the HTML tag
		*
		* @method windowLoadEvent
		* @namespace Hudson.Window
		* @return {none}
		*/
		function windowLoadEvent(e) {
			var breakpointAttr = getCurrentBreakpoint();
			$('html').attr('data-current-breakpoint', breakpointAttr);
			if (!testTouch()) {
				$('html').removeClass('touch').addClass('notouch');
				W.touch = false;
			}

			//test for baseline devices
			baselineSupportTest();

			var HM = Hudson.Menu;

			//detect android tablets in portrait mode
			if (HM.isAndroidTablet()){
				$('html').addClass('android-tablet');
			}else {
				$('html').removeClass('android-tablet');
			}

			//for modern devices
			if ($('html').hasClass('android-modern')|| $('html').hasClass('ios-modern')){
				/*
				landscape behavior for modern requires navpanel to have specified height, so we adjust it based on its contents
				*/
				HM.adjustSubNavHeight();
				//don't do prevent overscroll for tablets, do it for phones only (where navpanel is = window width)
				if (parseInt($('.nav-wrapper').css('width'),10) === $(window).width()){
					HM.preventOverScroll();
				}
			}
		}

		/**
		* Fires whenever the viewport changes dimensions (resize or device rotate), and resets
		* the current breakpoint attribute assigned to the HTML tag
		*
		* @method windowChangeEvent
		* @namespace Hudson.Window
		* @return {none}
		*/
		function windowChangeEvent(e) {
			var HM = Hudson.Menu;
			var breakpointAttr = getCurrentBreakpoint();
			$('html').attr('data-current-breakpoint', breakpointAttr);
			var show = $('.nav-wrapper').hasClass('active');

			//for baseline devices resize overlay using javascript instead of CSS
			if ($('html').hasClass('baseline')){
				HM.adjustOverlayHeight(show);
			}

			/*
			add/remove landscape class based on orientation for modern phones
			landscape class enables special behavior for modern phones on landscape orientation
			*/
			if ($(window).height() > 320){
				$('.landscape').removeClass('landscape');
			}else {
				if ($('html').hasClass('android-modern')|| $('html').hasClass('ios-modern')){
					$('html').addClass('landscape');
					HM.lockDocumentScroll(false);
				}
			}

			/*
			landscape behavior for modern requires navpanel to have specified height, so we adjust it based on its contents
			*/
			if ($('html').hasClass('android-modern')|| $('html').hasClass('ios-modern')){
				HM.adjustSubNavHeight();
			}

			/*
			to avoid breaking layouts, hide navpanel overlay when resizing desktop windows from small to large
			*/
			if ($('html').hasClass('notouch') && $(window).width() > 320 && $('.nav-wrapper').hasClass('active') && !$('html').hasClass('lt-ie9')){
				HM.showNav(false);
			}

			/*
			for tablets, position navpanel based on right offset of nav (to cover various margins on android tablets)
				*/
			if (parseInt($('.nav-wrapper').css('width'),10) !== $(window).width() && $('html').hasClass('touch')){
				var navHeaderOffset = $('#nav-header').offset().left;
				var navPanelPosition = navHeaderOffset > 10 ? navHeaderOffset + 5 : 0;
				$('.nav-wrapper').css({'right': navPanelPosition});
			}

			/*
			update whether this is a baseline phone
			*/
			if (isBaselinePhone()){
				$('html').addClass('baseline');
			}else {
				$('html').removeClass('baseline');
			}

			/*
			update whether this is an android tablet
			*/
			if (HM.isAndroidTablet()){
				$('html').addClass('android-tablet');
			}else {
				$('html').removeClass('android-tablet');
			}
		}


		/* TODO: testtouch is repeated in 2700 and intial interactions, remove duplication */

		/**
		* A simple test to see if this is a touch device.  Necessary to change the menu system
		* at the large breakpoint
		* 6/21/13 - added additional check for msMaxTouchPoints to identify touch in IE10
		*
		* @method testTouch
		* @namespace Hudson.Window
		* @return {none}
		*/
		function testTouch() {
			if (window.navigator.msMaxTouchPoints != undefined) {
				return (window.navigator.msMaxTouchPoints > 0) ? true : false;
			} else {
				return !!('ontouchstart' in window) || !!('onmsgesturechange' in window) || !!(/iemobile/i.test(navigator.userAgent));
			}
		};

		/**
		* Maps the predefined breakpoints to their names.  The width values of this
		* object are the smallest pixel width allowed by the breakpoint.
		*
		* @attribute breakPoints
		* @namespace Hudson.Window
		* @type object
		*/
		W.breakpoints = {
			"small": {
				"width" : 320,
				"breakpointName": "small"

			},
			"medium": {
				"width" : 500,
				"breakpointName": "medium"
			},
			"large": {
				"width" : 720,
				"breakpointName": "large"
			},
			"extralarge": {
				"width" : 1024,
				"breakpointName": "xlarge"
			}
		};


		/**
		* This function queries the current window size against the predefined breakpoints sizes
		* established in W.breakpoints.
		*
		* @method getCurrentBreakpoint
		* @namespace Hudson.Window
		* @return {string} The name of the current breakpoint
		*/
		function getCurrentBreakpoint() {
			var currentBreakpoint,key,attr,src
			var currentWidth = W.width = $(window).width();
			$.each(W.breakpoints, function(index, obj) {
				if (obj.width <= currentWidth) {
					currentBreakpoint = obj.breakpointName;
				}
			});
			return currentBreakpoint;
		}
	};


	/**
	* Hudson.Menu controls the user actions and animations with the menu and submens for touch and non touch devices
	*
	* @class Menu
	* @namespace Hudson
	* @constructor function
	*/
	Hudson.Menu = new function(){
		var HM = this;
		var HW = Hudson.Window;

		//navigation breaks at slightly different points than the rest of the site
		var navBreakpoints = {
			"small" : 320,
			"medium-" : 500,
			"medium+" : 525,
			"large" : 720,
			"large+" : 780,
			"xlarge" : 1024
		}

		/*
		navigation breakpoint detection using css properties instead of window width
		an invisible js-mq div is added to the page
		nav.css media queries set the z-index
		that z-index is compared to the array below to determine which media query is in effect
		*/
		var jsmqIndices = [
		"base",
		"xl-global-retina",
		"small",
		"small-landscape",
		"small-retina",
		"medium-hamburger",
		"medium",
		"medium-landscape",
		"large",
		"large-",
		"x-large"
		];


		HM.getMediaQueryName = function(){
			if ($('.js-mq').length === 0){
				$('body').append($('<div class="js-mq"></div>'));
			}
			//array is zero-based,
			//z-indices begin at 1
			var jsmqIndex = $('.js-mq').css('z-index') - 1;
			$('.js-mq').remove();
			return jsmqIndices[jsmqIndex]
		}

		HM.getMediaQueryIndex = function(breakpointName){
			var match = -1;
			for (var i=0; i < jsmqIndices.length; i++){
				if (jsmqIndices[i] === breakpointName){
					match = i;
				}
			}
			return match > -1 ? match : false;
		}

		HM.getCurrentMediaQueryIndex = function(){
			var currentMediaQueryName = HM.getMediaQueryName();
			return HM.getMediaQueryIndex(currentMediaQueryName);
		}

		//HM.checkMediaQueryRange(minbreakpoint, maxbreakpoint)

		var scrollBounds = [74,75];
		var animating = false;
		var pinned = false;
		var container, header, nav, headerSpacer, overlay, nonav;

		HM.init = function(){
			container = $(".pinnable");
			header = container.find(".header-wrapper");
			nav = container.find(".nav-wrapper");
			headerSpacer = container.find(".header-spacer");
			overlay = $(".nav-overlay");
			nonav = $(".no-nav");

			setTimeout(HM.hideAddressBar, 50);

			if(HW.touch === false){
				$(window).on("scroll", HM.scrollEvent);
				$(window).on("resize", HM.resizeEvent);
			}

			container.find(".has-sub-nav").on("click", HM.subNavClickEvent);
			container.find(".more-link, .close").on("click", HM.navClickEvent);

			//overlay is not clickable on baseline and desktop and android tablet
			if ($('.header-wrapper').css('position') === 'fixed' && !HM.isAndroidTablet()){
				//overlay.on("click", HM.navClickEvent);
				overlay.on("mousedown", HM.navClickEvent);
			}
		}

		//hide the address bar on mobile devices
		HM.hideAddressBar = function(){
			window.scrollTo(0,~~window.scrollY+1);
		}

		//checks to see which nav actions to take, either adds a shadow to the nav or pins and unpins based on scroll pos
		HM.scrollEvent = function(){
			HW.scrollPos = $(document).scrollTop();

			if(nonav.length)
				return;

			var currentBreakpointIndex = HM.getCurrentMediaQueryIndex();
			var largeplusIndex = HM.getMediaQueryIndex("large");

			if(currentBreakpointIndex < largeplusIndex) return;

			if(pinned && HW.scrollPos <= scrollBounds[0]){

				if(animating) HM.cancelPinning();
				HM.unpinHeader();

			}else if(!pinned && HW.scrollPos >= scrollBounds[1]){

				if(!animating)
					HM.pinHeader();
			}
		}

		//sticks the header to the top of the page
		HM.pinHeader = function(){

			var breakPoint = $('html').data('data-current-breakpoint');
			if (($(window).width() / $(window).height() > 1.6 && breakPoint !== 'small' && $('html').hasClass('touch')) ){
				//don't bother with pinning on short tablets
				return;
			}

			animating = pinned = true;
			container.addClass("pinned");

			nav.find("*").css({"opacity":0}).animate({"opacity":1},400,function(){
				animating = false;
			});
		}

		//unsticks the header from the page, returns to normal flow
		HM.unpinHeader = function(){
			container.removeClass("pinned");
			pinned = false;
		}

		HM.cancelPinning = function(){
			nav.find("*").stop()
			nav.find("*").css("opacity","");
			animating = false;
		}

		//checks for the user winging the screen to a different size and applies pinning
		HM.resizeEvent = function(){
			var currentBreakpointIndex = HM.getCurrentMediaQueryIndex();
			var largeplusIndex = HM.getMediaQueryIndex("large");

			//if(HW.width <= navBreakpoints["large+"])
			if(currentBreakpointIndex < largeplusIndex){
				HM.unpinHeader();
			}


			//if(HW.width > navBreakpoints["large+"] && !pinned && HW.scrollPos >= scrollBounds[1] ){
			if(currentBreakpointIndex > largeplusIndex && !pinned && HW.scrollPos >= scrollBounds[1] ){
				container.addClass("pinned");
				pinned = true;
			}
		}

		//calls click events on the main nav for touch devices, or at the small breakpoint
		HM.navClickEvent = function(){
			//prevent nav click events happening on wider desktop but let it happen for hamburger medium desktop
			var currentBreakpointIndex = HM.getCurrentMediaQueryIndex();
			var smallIndex = HM.getMediaQueryIndex("small");

			if ($('html').hasClass('notouch') && $('.pinnable').height() > 90 && currentBreakpointIndex > smallIndex) return;
			var me = $(this);
			var show = me.hasClass("more-link") && !nav.hasClass("active");
			HM.showNav(show);
			return false; //keep overlay clicks from hitting items under them
		}

		//prevents document from scrolling during overlay
		HM.consumeScrollEvents = function(e){
			if ($('html').hasClass('landscape')) return;
			e.preventDefault();
		}

		//additional method to enable high end nav behavior on top of baseline for modern phones
		HM.showHighendNav = function(show){
			if ($(window).height() > 320) return;
			if (show){
				$('html').addClass('landscape');
				HM.adjustSubNavHeight();
			}else {
				$('html').removeClass('landscape');
			}

		}

		//shows the baseline nav available to lower end devices
		HM.showBaselineNav = function(show){
			if (show){
				if ($('html').hasClass('baseline')){
					//don't fadein for baseline
					nav.addClass('active');
					$(".nav-close-spacer").addClass("active");
					if($('html').attr('data-current-breakpoint') === 'small'){
						window.scrollTo(0,0);
					}
				}else {
					//position the nav panel for android tablets based on offset of header
					if (parseInt($('.nav-wrapper').css('width'),10) !== $(window).width() && $('html').hasClass('touch')){
						var navHeaderOffset = $('#nav-header').offset().left;
						var navPanelPosition = navHeaderOffset > 10 ? navHeaderOffset + 5 : 0;
						$('.nav-wrapper').css({'right': navPanelPosition});
					}
					nav.fadeIn(400,function(){
						nav.addClass("active");
						$(".nav-close-spacer").addClass("active");
						//nav.removeAttr("style");
						nav.css("display","");
						nav.css("overflow","");
						if($('html').attr('data-current-breakpoint') === 'small'){
							window.scrollTo(0,0);
						}
					});
				}
				header.find(".more-wrapper").addClass("active");
			}else {
				if ($('html').hasClass('baseline') || $('html').hasClass('touch') && $('html').attr('data-current-breakpoint') !== 'small' || $('html').hasClass('notouch') && ["small","medium"].indexOf($('html').attr('data-current-breakpoint')) === -1 ){
					//don't fadeout for baseline and tablets (tablets show ghosting and only animate when swipes are over)
					nav.hide();
					nav.removeClass('active');
					$(".nav-close-spacer").removeClass("active");
					nav.css("display","");
				}else {
					//prevent queued up fadeouts on multiple resize events
					if (!animating){
						animating = true;
						$(".nav-close-spacer").removeClass("active");
						nav.fadeOut(400,function(){ nav.removeClass("active"); nav.css("display",""); animating = false; });
					}
				}
				header.find(".more-wrapper").removeClass("active");
			}
		}

		//detect android tablets in portrait mode
		HM.isAndroidTablet = function(){
			if (!isBaselinePhone()) return false;
			if ($('html').hasClass('notouch')) return false;
			//only detects for portrait android tablets
			return (window.orientation === 0 && $(window).width() < $(window).height() && $('html').attr('data-current-breakpoint') !== 'small');
		}

		// function for preventing overscroll behavior where scrolling in nav panel triggers scrolling in the background
		HM.updateOverScrollBounds = function(){
			var elem = $('.main-nav-wrapper')[0];
			if(elem){
				HM.allowScrollUp = (elem.scrollTop > 0);
				HM.allowScrollDown = (elem.scrollTop < elem.scrollHeight - elem.clientHeight - 3);
			}
		}

			// function for preventing overscroll behavior where scrolling in nav panel triggers scrolling in the background
			HM.preventOverScroll = function(){
				var elem = $('.main-nav-wrapper')[0];
				var touchstartListener = function(e){
					HM.updateOverScrollBounds();
					HM.lastY = e.touches[0].pageY;
				};
				var touchmoveListener = function(e){
					HM.up   = (e.touches[0].pageY > HM.lastY);
					HM.tap  = e.touches[0].pageY === HM.lastY;
					HM.down = ! HM.up;
					HM.lastY    = e.touches[0].pageY;
					if ((HM.up && HM.allowScrollUp) || (HM.down && HM.allowScrollDown)) {
						e.stopPropagation();
					} else {
						if ($('html').hasClass('landscape') || HM.tap) return;
						e.preventDefault();
					}
				};
				if (!$('html').hasClass('landscape')){
					HM.allowScrollUp = true,
					HM.allowScrollDown = true,
					HM.lastY = 0;
					elem.addEventListener('touchstart', touchstartListener, true);
					elem.addEventListener('touchmove', touchmoveListener, true);
					elem.addEventListener('touchstart', touchmoveListener, true);
				}
			}

		// locks the document behind the overlay from being scrolled
		HM.lockDocumentScroll = function(show) {
			if (show){
				$(document).bind('touchmove', HM.consumeScrollEvents);
			}else {
				$(document).unbind('touchmove', HM.consumeScrollEvents);
			}
		};

		// shows/hides the overlay
		HM.showOverlay = function(show){
			if (show){
				overlay.addClass("active");
				HM.adjustOverlayHeight(show);

				// to simplify layout issues, hide other content on page when baseline
				if (isBaselinePhone() && !HM.isAndroidTablet()){
					$('#page-content,footer').hide();
				}
			}else {
				overlay.removeClass("active");
				overlay.removeAttr('style');
				HM.adjustOverlayHeight(show);
				//always show (in case of transitions from small to xlarge, etc)
				$('#page-content,footer').show();
			}

			if (
				$('html').hasClass('ios-modern') ||
				( $('html').hasClass('android-modern') && ["small","medium"].indexOf($('html').attr('data-current-breakpoint')) !== -1 )
				){
				HM.lockDocumentScroll(show);
		}
	}

		//manually adjusts overlayheight to fix CSS inconsistencies
		HM.adjustOverlayHeight = function(show){
			if (show){
				//var maxHeight = $(document).height() > $('.top-nav').height() ? $(document).height() : $('.top-nav').height();
				if ($('html').hasClass('baseline') && !HM.isAndroidTablet()){
					var compareTo = $(window).height();
				}else {
					var compareTo = $(document).height();
				}
				var maxHeight = compareTo > $('.top-nav').height() ? compareTo : $('.top-nav').height();
				//pad the bottom
				maxHeight += 15;
				$('.nav-overlay').css({'height': maxHeight});
			}else {
				$('.nav-overlay').css("height","");
			}
		}


		//shows or hides the main nav
		HM.showNav = function(show){
			HM.showBaselineNav(show);
			if ($('html').hasClass('ios-modern') || $('html').hasClass('android-modern')){
				HM.showHighendNav(show);
			}
			HM.showOverlay(show);

		}

		//hides any existing navigation elements and shows or hides the clicked nav
		HM.subNavClickEvent = function(e){
			//filter out desktop
			if ($('html').hasClass('notouch') && $('.pinnable').height() > 90 && $(window).width() >= 541) return;
			// if(HW.width > navBreakpoints["medium-"] && HW.touch === false){
			// 	console.log('returning');
			// 	return;
			// }

			var me = $(this);
			var show = !me.hasClass("active");
			var open = $(".has-sub-nav.active");


			if (e.target.getAttribute('href') !== '#' && open) return; //disables slide up animation for slower phones when navigating away instead of sliding up

			if(me.hasClass("nonactive")) return;

			if(open.length){
				HM.showSubNav(open,false);
			}


			if(show){
				setTimeout(function(){ HM.showSubNav(me, true)}, (open.length?301:0));
			}
		}


		//adjusts the navpanel's height based on its contents
		HM.adjustSubNavHeight = function(){
			if ($('html').hasClass('baseline')) return;
			var mainNavHeight = $('.min-money-bar').height() + $('.action-nav').height() + 10;
			var topLevelUnit = $('li.top-level').not('.sub-nav').eq(0).height();
			$('li.top-level').each(function(){
				mainNavHeight += topLevelUnit;
			});
			$('li.top-level.active').find('li').each(function(){
				mainNavHeight += $(this).height();
			});
			if ($('html').hasClass('landscape')){
				$('.top-nav').css({'height': mainNavHeight});
			}else {
				$('.top-nav').removeAttr('style');
			}
			HM.updateOverScrollBounds();
		}

		//shows or hides the sub nav
		HM.showSubNav = function(me,show){
			//var restoreHeight = 445;
			if(show){
				me.addClass("up");
				me.find(".sub-nav").slideDown(300,function(){
					$(this).css({"display":"","overflow":""});
					me.addClass("active");
					HM.adjustOverlayHeight(show);
				});
				setTimeout(function(){me.closest(".main-nav-wrapper").animate({"scrollTop":me[0].offsetTop},100,'swing', function(){ HM.adjustSubNavHeight() });},300);
			}else{
				me.closest(".main-nav-wrapper").animate({"scrollTop":0},100);
				me.removeClass("up");
				me.find(".sub-nav").slideUp(300,function(){
					$(this).css({"display":"","overflow":""});
					me.removeClass("active");
					//check if overlay is still visible (changed widths and subnav hidden)
					if ($('.nav-overlay').css('height') !== '0px'){
						HM.adjustOverlayHeight(true);
					}
					HM.adjustSubNavHeight();
				});
				// if ($('.landscape').length > 0){
				// 	$('.top-nav').css({'height': restoreHeight});
				// }
			}
		}



	}




	/**
	* Contains behaviors for all the interactive elements on the responsive site, including tooltips,
	* progressive enhancements, and animations
	*
	* @class Widget
	* @namespace Hudson
	* @constructor function
	*/
	Hudson.Widget = new function () {
		var HW = this;


		/**
		* Initializes all of the widget and progressive enhancement items.
		*
		* @method init
		* @namespace Hudson.Widget
		* @param {none}
		* @return {none}
		*/
		HW.init = function($scope) {
			$scope = $scope || $('body');
			$scope.find('*[data-widget-type]').each(function() {
				var subConstructor;
				var me = $(this);
				var type = me.attr('data-widget-type');
				switch (type) {
					case 'card-selection':
					subConstructor = HW.CardSelection
					me.on('click', 'a', subConstructor.click);
					break;
					case 'action-prompt':
					subConstructor = HW.ActionPrompt;
					subConstructor.init(me);
					me.on('click', subConstructor.reveal);
					break;
					case 'mp-action-prompt':
					subConstructor = HW.MpActionPrompt;
					subConstructor.init(me);
					me.on('click', subConstructor.reveal);
					break;
					case 'inline-modifier':
					subConstructor = HW.InlineModifier;
					me.on('click', subConstructor.click);
					break;
					case 'input-form-label-focus-select':
					subConstructor = HW.InputFocusSelectRadio;
					subConstructor.init(me);
					break;
					case 'dismissable':
					subConstructor = HW.Dismissable;
					subConstructor.init(me);
					break;
					case 'date-filter':
					subConstructor = HW.DateFilter;
					subConstructor.init(me);
					case 'select':
					subConstructor = HW.EnhancedSelect.Simple
					subConstructor.init(me);
					me.on('change', subConstructor.click);
					break;
					case 'select-card':
					subConstructor = HW.EnhancedSelect.Card
					subConstructor.init(me);
					me.on('change', subConstructor.click);
					break;
					case 'select-state':
					subConstructor = HW.EnhancedSelect.State;
					subConstructor.init(me);
					me.on('change', subConstructor.click);
					break;
					case 'select-card-and-reveal':
					HW.EnhancedSelect.Card.init(me);
					me.on('focus', HW.AccordionReveal.focus);
					me.on('change', HW.EnhancedSelect.Card.click);
					me.on('change', HW.AccordionReveal.change);
					break;
					case 'tooltip':
					me.on('click', HW.ToolTip.click);
					break;
					case 'contacts':
					subConstructor = HW.Contacts;
					me.on('click', subConstructor.open);
					subConstructor.delegateClick(me);
					break;
					case 'page-view-control':
					subConstructor = HW.PageView;
					subConstructor.init(me);
					me.on('change', subConstructor.change);
					break;
					case 'load-more-control':
					subConstructor = HW.LoadMore;
					me.on('click', subConstructor.click);
					break;
					case 'delete-payee-container':
					subConstructor = HW.DeletePayee;
					subConstructor.init(me);
					break;
					case 'bill-pay-date-filter':
					subConstructor = HW.BPDateFilter;
					subConstructor.init(me);
					break;
					case 'bp-load-more':
					subConstructor = HW.BpLoadMore;
					subConstructor.init(me);
					break;
					case 'processing-overlay':
					subConstructor = HW.ProcessingOverlay;
					subConstructor.init(me);
					break;
					case 'radio-clear':
					me.one('change', HW.RadioClear.change);
					break;
					case 'radio-hide':
					me.on('change', HW.RadioHide.change);
					break;
					case 'radio-expand-animate':
					HW.RadioExpandAnimate.init(me);
					break;
					case 'radio-clear-always':
					me.on('change', HW.RadioClear.change);
					break;
					case 'check-helper':
					HW.BankAccountHelper.init(me);
					break;
					case 'message-fades':
					HW.MessageFades.init(me);
					break;
					case 'reveal-accordion-trigger' :
					me.on('focus', HW.AccordionReveal.focus);
					break;
					case 'show-hide-drawer' :
					subConstructor = HW.ShowHideDrawer
					subConstructor.init(me);
					break;
					case 'dynamic-card-changer':
					subConstructor = HW.CardTypeReveal;
					subConstructor.init(me);
					me.on('keyup', subConstructor.keyup);
					break;
					case 'contextual-help':
					$('#bubble').addClass('first');
					subConstructor = HW.HelpBubble;
					me.on('mousedown', '#bubble a', subConstructor.linkMouseDown);
					me.on('mouseup', '#bubble a', subConstructor.linkMouseUp);
					me.on('focus', 'input, select', subConstructor.reveal);
					me.on('blur', 'input, select', subConstructor.hide);
					break;
					case 'replace-link-confirm':
					me.on('click', function(e){
						HW.replaceLinkWithConfirm.resend();
						e.preventDefault;
					});
					break;
					case 'referAddEmails':
					subConstructor = HW.ReferEmails;
					subConstructor.init(me);
					break;
					case 'fileUploadBtn':
					HW.FileUpload.init(me);
					break;
					case 'addAnotherFile':
					HW.AddAnotherFile.init(me);
					break;
					case 'enhance-link':
					HW.enhanceLink(me);
					break;
					case 'date-filter-future' :
					subConstructor = HW.DateFilterFuture
					subConstructor.init(me);
					break;
					case 'toggle-date-field':
					me.on('change', HW.ToggleField.change);
					break;
					case 'edit-inline':
					HW.EditNameInline.init(me);
					break;
					case 'dynamic-frequency':
					HW.DynamicFrequency.init(me);
					break;
					case 'seg-accts-dynamic-pause' :
					me.on('click', HW.SegAccts.click);
					break;
					case 'load-more-transaction-control':
					subConstructor = HW.LoadMoreTransaction;
					me.on('click', subConstructor.click);
					break;
					case 'direct-deposit-print-form':
					subConstructor = HW.PrintForm;
					subConstructor.init(me);
					break;
					case 'responsive-image':
					subConstructor = HW.ResponsiveImage;
					subConstructor.init(me);
					break;
					case 'bar-chart':
					subConstructor = HW.BarChart;
					subConstructor.init(me);
					break;
					case 'dismissable-notification':
					subConstructor = HW.DismissableNotification;
					subConstructor.init(me);
					break;

					/* TODO: 'action-prompt-2' and 'mp-action-prompt-2'
					added by BSD and may be redundant - investigate removal */

					// case 'action-prompt-2':
					// subConstructor = HW.ActionPrompt2;
					// subConstructor.init(me);
					// me.on('click', subConstructor.reveal);
					// break;
					// case 'mp-action-prompt-2':
					// subConstructor = HW.MpActionPrompt2;
					// subConstructor.init(me);
					// me.on('click', subConstructor.reveal);
					// break;
					case 'focus-reveal':
					subConstructor = HW.FocusReveal;
					subConstructor.init(me);
					break;
					default:
					break;
				}
			});

$('input, textarea').each(function() {
	var me = $(this);
	var dataType = me.attr('data-input-type');
	var myClass = me.attr('class');
	var myInputType = me.attr('type');
	var subConstructor;

	switch (dataType) {
		case 'dollar':
		subConstructor = HW.DollarInput;
		me.on('focus', subConstructor.focus);
		me.on('keyup', subConstructor.keyup);
		me.on('blur', subConstructor.blur);
		break;
		case 'percent':
		subConstructor = HW.PercentageInput;
		me.on('blur', subConstructor.blur);
		break;
		default:
		break;
	}

	switch (myInputType) {
		case 'radio':
		subConstructor = HW.EnhancedRadio;
		subConstructor.init(me);
		me.on('change', subConstructor.change);
		break;
		case 'checkbox':
		subConstructor = HW.EnhancedCheckbox
		subConstructor.init(me);
		me.on('change', subConstructor.change);
		break;
		default:
		break;
	}

	if (myClass != undefined) {
		if (myClass.indexOf('prefill') >= 0) {
			subConstructor = HW.ClearPrefill;
			subConstructor.init(me);
			me.on('keyup change', subConstructor.keyup);
		}
	}
})

$('.container').on('click', function(e){
	clearOpen(e);
});

Date.prototype.toMMDDYYYYString = function () {return isNaN (this) ? 'NaN' : [this.getMonth() > 8 ? this.getMonth() + 1 : '0' +  (this.getMonth() + 1), this.getDate() > 9 ? this.getDate() : '0' + this.getDate(),  this.getFullYear()].join('/')}
Date.prototype.toYYYYMMDDString = function () {return isNaN (this) ? 'NaN' : [this.getFullYear(), this.getMonth() > 8 ? this.getMonth() + 1 : '0' +  (this.getMonth() + 1), this.getDate() > 9 ? this.getDate() : '0' + this.getDate()].join('-')}
Date.prototype.plusDays = function(days){ this.setDate(this.getDate() + days ); return this; };
}

		/**
		* General utility to close any open tooltips, menu items or other popups.
		*
		* @method clearOpen
		* @namespace Hudson.Widget
		* @param {Object} e The event object.
		* @return {none}
		*/
		function clearOpen(e) {
			var target = e ? e.target : window.event.srcElement;
			var thisTarget = $(target);

			/* default behavior of most popups is to remain open when you click on the popup body itself (like the moneybar, contacts)*/
			/* so only close if we aren't clicking on the popup or one of it's children */
			if (!(thisTarget.attr('data-action-state') === 'open' || thisTarget.closest('[data-action-state=open]').length === 1)) {
				if ($("*[data-open-by=animation]").attr('data-action-state') === 'open') {
					$('*[data-open-by=animation]').slideToggle(100);
				};
				$("*[data-action-state='open']").attr("data-action-state", "closed").attr('aria-hidden', 'true');
				$('input[data-widget-type=contact-field]').removeAttr('disabled');
			}

			/* however, tooltips should be closeable with a click on the tooltip, so check if the tooltip is both open and the target of the click */
			/* if so, close the tooltip */
			else if ((thisTarget.attr('data-action-state') === 'open' || thisTarget.closest('[data-action-state="open"]').length > 0) && (thisTarget.attr('data-action-role') === 'tootltip-body' || (thisTarget.closest('[data-action-role=tooltip-body]').length > 0 && thisTarget.prop("tagName") != "A"))){
				$("*[data-action-state='open']").attr("data-action-state", "closed").attr('aria-hidden', 'true');
			}
		}

		HW.InlineModifier = new function(){

			var IM = this;

			IM.click = function(e){
				var me = $(this);

				var node = me.closest('*[data-widget-type=inline-actionable]');

				switch(me.attr("data-property-action")){
					case "delete":
					IM.DeleteInline(node);
					break;
					case "primary":
					IM.SwapPrimary(node);
					break;
					case "optin":
					IM.OptIn(node);
					break;
					case "optout":
					IM.OptOut(node);
					break;
					case "addphone":
					IM.AddPhone(node);
					break;
					case "verify-0":
					IM.Verify(node,0);
					break;
					case "verify-1":
					IM.Verify(node,1);
					break;
					case "close-prompt":
					IM.closePrompt(node);
					break;
					case "email":
					IM.ResendEmail(node);
					break;
					case "resend-code":
					IM.ResendCode(node);
					break;
					case "addemail":
					IM.AddEmail(node);
					break;
					case "disableAutoAccept":
					IM.DisableAutoAccept(node);
					break;
					case "enableAutoAccept":
					IM.EnableAutoAccept(node);
					break;
					case "deleteSetting":
					IM.DeleteSetting(node);
					break;
					case "directDeposit":
					IM.DirectDeposit(node);
					break;
					case "disableLowBalanceAlerts":
					IM.DisableLowBalanceAlerts(node);
					break;
					case "disableScheduleAlerts":
					IM.DisableScheduleAlerts(node);
					break;
					case "enableATMWithdrawals":
					IM.EnableATMWithdrawals(node);
					break;
					case "disableATMWithdrawals":
					IM.DisableATMWithdrawals(node);
					break;
					case "enableSMSNotifications":
					IM.EnableSMSNotifications(node);
					break;
					case "disableSMSNotifications":
					IM.DisableSMSNotifications(node);
					break;
					case "enableSettingsChangedNotifications":
					IM.EnableSettingsChangedNotifications(node);
					break;
					case "disableSettingsChangedNotifications":
					IM.DisableSettingsChangedNotifications(node);
					break;
					case "disableCloseAccount":
					IM.DisableCloseAccount(node);
					break;
					case "primary-game":
					IM.GameChange(node);
					break;
					case "pauseReserve":
					IM.pauseReserve(node);
					break;
				}

			}

			IM.InlineOverlay = function(show){
				if(show){
					$(".inline-overlay").css("display","block");
				}else{
					$(".inline-overlay").css("display","none");
				}
			}

			IM.DeleteInline = function(node){
				IM.InlineOverlay(true);
				node.find(".inline-processing").show(0)

				//setTimeout for prototype
				setTimeout(function(){IM.DeleteInlineComplete(node)}, 2500);

			}

			IM.DeleteInlineComplete = function(node){
				node.fadeOut(300);
				IM.InlineOverlay(false);
				setTimeout(function(){node.remove()}, 450);

			}

			IM.SwapPrimary = function(node){
				IM.InlineOverlay(true);
				node.find(".inline-processing").show(0)

				//setTimeout for prototype
				setTimeout(function(){IM.SwapPrimaryComplete(node)}, 2500);
			}

			IM.SwapPrimaryComplete = function(node){

				var primary = $("*[data-widget-type=inline-actionable][data-property-primary=true]");
				var primaryCopy = primary.clone(false, false);

				primary.fadeOut(300);
				node.fadeOut(300);

				setTimeout(function(){

					if (node.attr("data-property-email")) {
						primary.find(".phonenumber").text( node.find(".phonenumber").text() );
						primary.find(".item").find(".label").text("(Verified)");
						node.find(".phonenumber").text( primaryCopy.find(".phonenumber").text() );
						node.find(".item").find(".label").text("");
						node.prependTo(node.parent());
					} else {
						var nodeMobile = node.attr("data-property-mobile") === "true";
						var nodeSMS = node.attr("data-property-optin") === "true";
						var nodeName = node.attr("data-widget-name");

						var primaryName = primary.attr("data-widget-name");
						var primaryMobile = primary.attr("data-property-mobile") === "true";
						var primarySMS = primary.attr("data-property-optin") === "true";

						primary.attr("data-property-mobile", nodeMobile);
						primary.attr("data-property-optin", nodeSMS);

						node.attr("data-property-mobile", primaryMobile);
						node.attr("data-property-optin", primarySMS);

						primary.find(".phonenumber").text( node.find(".phonenumber").text() );
						primary.find(".item").find(".label").text( nodeMobile && nodeSMS ? "(SMS Enabled)" : "" );

						var primaryActionLink = "<ul><li><a data-widget-type = 'action-prompt' data-widget-name = '"+ primaryName +"-"+ (nodeSMS?"optout":"optin") +"'>"+ (nodeSMS?"Disable":"Enable") +" SMS</a></li></ul>";
						primary.find(".action-link").html(nodeMobile?primaryActionLink:"");

						node.find(".phonenumber").text( primaryCopy.find(".phonenumber").text() );
						node.find(".item").find(".label").text( primaryMobile && primarySMS ? "(SMS Enabled)" : "" );

						var nodeActionLink = "<ul>";
						if(primaryMobile) nodeActionLink += "<li><a id = 'opt-out' data-widget-type = 'action-prompt' data-widget-name = '"+ nodeName +"-"+ (primarySMS?"optout":"optin") +"'>"+ (primarySMS?"Disable":"Enable") +" SMS</a></li><span class = 'separator'>|</span>";
						nodeActionLink +="<li><a data-widget-type = 'action-prompt' data-widget-name = '"+ nodeName +"-promote'>Make Primary</a></li><span class = 'separator'>|</span><li><a data-widget-type = 'action-prompt' data-widget-name = '"+ nodeName +"-delete'>Delete</a></li>"

						node.find(".action-link").html(nodeActionLink);

						node.prependTo(node.parent());

					}

					IM.InlineOverlay(false);
					node.find('*[data-widget-type=action-prompt]').each(function(){ HW.ActionPrompt.init( $(this) ); $(this).click( HW.ActionPrompt.reveal ); });
					primary.find('*[data-widget-type=action-prompt]').each(function(){ HW.ActionPrompt.init( $(this) ); $(this).click( HW.ActionPrompt.reveal ); });
				}, 300);

setTimeout(function(){

	node.find('.prompt-revealed').removeClass('prompt-revealed');
	node.find('.prompt-box').removeClass('active').hide(0);
	node.find(".inline-processing").hide();
	primaryCopy.remove();
	setTimeout(function(){
		node.fadeIn(300);
	}, 200);
	primary.fadeIn(300);
}, 400);


}

IM.Verify = function(node, stage){
	if (stage == 0) {
		node.find("*[data-widget-property=pre-state]").fadeOut(300, function() {
			node.addClass('pending-verification');

			//find sms phone button and checkmark
			node.find('#enable-text-btn').addClass('hidden');
			node.find('.icon-check').removeClass('hidden');

			node.find("*[data-widget-property=post-state]").fadeIn(300, function() {
				node.find('.prompt-box').removeClass('active');
				$(this).addClass('active');
			});
		});
	} else {
		IM.OptIn(node);
	}
}

IM.OptIn = function(node) {
	IM.InlineOverlay(true);
	node.find(".inline-processing").show(0);

				//setTimeout for prototype
				setTimeout(function(){IM.OptInComplete(node)}, 2500);
			};

			IM.OptInComplete = function(node){
				var nodeName = node.attr("data-widget-name");
				node.find('.prompt-revealed').removeClass('prompt-revealed');
				node.find('.prompt-box').removeClass('active').hide(0);
				node.find(".inline-processing").hide();
				node.find(".item").find(".label").text( "(SMS Enabled)" );
				node.find(".item").find(".label").fadeOut(0).fadeIn(300);
				node.find('*[data-widget-type=action-prompt][data-widget-name='+nodeName+'-optin]').text("Disable SMS").attr("data-widget-name", nodeName+"-optout");
				node.find('*[data-widget-type=action-prompt]').each(function(){ HW.ActionPrompt.init( $(this) ); $(this).click( HW.ActionPrompt.reveal ); });
				IM.InlineOverlay(false);
				node.closest('.grey-box').removeClass('pending-verification');
			}

			IM.OptOut = function(node) {
				IM.InlineOverlay(true);
				node.find(".inline-processing").show(0)

				//setTimeout for prototype
				setTimeout(function(){IM.OptOutComplete(node)}, 2500);

			};

			IM.OptOutComplete = function(node){
				var nodeName = node.attr("data-widget-name");
				node.find(".item").find(".label").fadeOut(150);
				setTimeout(function(){ node.find(".item").find(".label").text( "" ).fadeIn(0);  },160)
				node.find('.prompt-revealed').removeClass('prompt-revealed');
				node.find('.prompt-box').removeClass('active').hide(0);
				node.find(".inline-processing").hide();
				node.find('*[data-widget-type=action-prompt][data-widget-name='+nodeName+'-optout]').text("Enable SMS").attr("data-widget-name", nodeName+"-optin");
				node.find('*[data-widget-type=action-prompt]').each(function(){ HW.ActionPrompt.init( $(this) ); $(this).click( HW.ActionPrompt.reveal ); });
				IM.InlineOverlay(false);
			}

			IM.closePrompt = function(node){
				node.find('.prompt-revealed').removeClass('prompt-revealed');

				node.find('.prompt-box').removeClass('active').fadeOut(400);

				node.find(".inline-processing").hide();

				setTimeout(function(){ 
					node.removeClass('pending-verification'); 
				}, 400)
			}

			IM.AddPhone = function(node){
				//this is wrong
				$("#proto-new-phone").fadeIn(300);
				IM.InlineOverlay(false);
			}

			IM.AddEmail = function(node){
				//this is wrong
				$('#proto-unverified-email').fadeIn(300);
			}

			IM.ResendEmail = function(node){
				IM.InlineOverlay(true);
				setTimeout(function(){ IM.InlineOverlay(false); }, 3100);
				node.find("*[data-widget-type=module-message-alert]").fadeIn(300).delay(2500).fadeOut(300);
			}

			IM.ResendCode = function(node){
				IM.InlineOverlay(true);
				setTimeout(function(){ IM.InlineOverlay(false); }, 3100);
				node.find("*[data-widget-type=module-message-alert]").fadeIn(300).delay(2500).fadeOut(300);
			}

			IM.EnableAutoAccept = function(node){
				IM.InlineOverlay(true);
				node.find(".inline-processing").show(0);
				//setTimeout for prototype
				setTimeout(function(){IM.EnableAutoAcceptComplete(node)}, 2500);
			}

			IM.EnableAutoAcceptComplete = function(node){
				node.find("*[data-widget-property=pre]").fadeOut(300);
				setTimeout(function(){
					IM.InlineOverlay(false);
					node.find(".inline-processing").hide();
					node.find("*[data-widget-property=post]").fadeIn(300);
				},300)

			}

			IM.DisableAutoAccept = function(node){
				node.find(".inline-processing").show(0);
				//setTimeout for prototype
				setTimeout(function(){IM.DisableAutoAcceptComplete(node)}, 2500);
			}

			IM.DisableAutoAcceptComplete = function(node){
				console.log(node);
				node.find("*[data-widget-property=post]").fadeOut(300);

				setTimeout(function(){
					IM.InlineOverlay(false);
					node.find(".inline-processing").hide();
					console.log('aher');
					node.find("*[data-widget-property=pre]").fadeIn(300);
					node.find("*[data-widget-property=replaced-by-prompt]").fadeIn(300);
					node.find('.prompt-revealed').removeClass('prompt-revealed');
					node.find('.prompt-box').removeClass('active').fadeOut(400);
				},300)
			}

			IM.DeleteSetting = function(node){
				IM.InlineOverlay(true);
				node.find(".inline-processing").show(0);
				//setTimeout for prototype
				setTimeout(function(){IM.DeleteSettingComplete(node)}, 2500);
			}

			IM.DeleteSettingComplete = function(node){
				node.find("*[data-widget-property=pre]").fadeOut(300);
				setTimeout(function(){
					IM.InlineOverlay(false);
					node.find(".inline-processing").hide();
					node.find("*[data-widget-property=post]").fadeIn(300);
				},300)
			}

			IM.DirectDeposit = function(node){
				IM.InlineOverlay(true);
				node.find(".inline-processing").show(0);
				//setTimeout for prototype
				setTimeout(function(){IM.DirectDepositComplete(node)}, 2500);
			}

			IM.DirectDepositComplete = function(node){
				node.find("*[data-widget-property=pre]").fadeOut(300);
				setTimeout(function(){
					IM.InlineOverlay(false);
					node.find(".inline-processing").hide();
					node.find("*[data-widget-property=post]").fadeIn(300);
				},300)
			}

			IM.DisableLowBalanceAlerts = function(node){
				IM.InlineOverlay(true);
				node.find(".inline-processing").show(0);
				//setTimeout for prototype
				setTimeout(function(){IM.DisableLowBalanceAlertsComplete(node)}, 2500);
			}

			IM.DisableLowBalanceAlertsComplete = function(node){
				node.find("*[data-widget-property=pre]").fadeOut(300);
				setTimeout(function(){
					IM.InlineOverlay(false);
					node.find(".inline-processing").hide();
					node.find("*[data-widget-property=post]").fadeIn(300);
				},300)
			}

			IM.DisableScheduleAlerts = function(node){
				IM.InlineOverlay(true);
				node.find(".inline-processing").show(0);
				//setTimeout for prototype
				setTimeout(function(){IM.DisableScheduleAlertsComplete(node)}, 2500);
			}

			IM.DisableScheduleAlertsComplete = function(node){
				node.find("*[data-widget-property=pre]").fadeOut(300);
				setTimeout(function(){
					IM.InlineOverlay(false);
					node.find(".inline-processing").hide();
					node.find("*[data-widget-property=post]").fadeIn(300);
				},300)
			}

			IM.EnableATMWithdrawals = function(node){
				IM.InlineOverlay(true);
				node.find(".inline-processing").show(0);
				//setTimeout for prototype
				setTimeout(function(){IM.EnableATMWithdrawalsComplete(node)}, 2500);
			}

			IM.EnableATMWithdrawalsComplete = function(node){
				node.find("*[data-widget-property=pre]").fadeOut(300);
				setTimeout(function(){
					IM.InlineOverlay(false);
					node.find(".inline-processing").hide();
					node.find("*[data-widget-property=post]").fadeIn(300);
				},300)

			}

			IM.DisableATMWithdrawals = function(node){
				IM.InlineOverlay(true);
				node.find(".inline-processing").show(0);
				//setTimeout for prototype
				setTimeout(function(){IM.DisableATMWithdrawalsComplete(node)}, 2500);
			}

			IM.DisableATMWithdrawalsComplete = function(node){
				node.find("*[data-widget-property=post]").fadeOut(300);
				setTimeout(function(){
					IM.InlineOverlay(false);
					node.find(".inline-processing").hide();
					node.find("*[data-widget-property=pre]").fadeIn(300);
					node.find('.prompt-revealed').removeClass('prompt-revealed');
					node.find('.prompt-box').removeClass('active').fadeOut(400);
				},300)
			}

			IM.EnableSMSNotifications = function(node){
				IM.InlineOverlay(true);
				node.find(".inline-processing").show(0);
				//setTimeout for prototype
				setTimeout(function(){IM.EnableSMSNotificationsComplete(node)}, 2500);
			}

			IM.EnableSMSNotificationsComplete = function(node){
				node.find("*[data-widget-property=pre]").fadeOut(300);
				setTimeout(function(){
					IM.InlineOverlay(false);
					node.find(".inline-processing").hide();
					node.find("*[data-widget-property=post]").fadeIn(300);
				}, 300)

			}

			IM.DisableSMSNotifications = function(node){
				IM.InlineOverlay(true);
				node.find(".inline-processing").show(0);
				//setTimeout for prototype
				setTimeout(function(){IM.DisableSMSNotificationsComplete(node)}, 2500);
			}

			IM.DisableSMSNotificationsComplete = function(node){
				node.find("*[data-widget-property=post]").fadeOut(300);
				setTimeout(function(){
					IM.InlineOverlay(false);
					node.find(".inline-processing").hide();
					node.find("*[data-widget-property=pre]").fadeIn(300);
					node.find('.prompt-revealed').removeClass('prompt-revealed');
					node.find('.prompt-box').removeClass('active').fadeOut(400);
				},300)
			}

			IM.EnableSettingsChangedNotifications = function(node){
				IM.InlineOverlay(true);
				node.find(".inline-processing").show(0);
				//setTimeout for prototype
				setTimeout(function(){IM.EnableSettingsChangedNotificationsComplete(node)}, 2500);
			}

			IM.EnableSettingsChangedNotificationsComplete = function(node){
				node.find("*[data-widget-property=pre]").fadeOut(300);
				setTimeout(function(){
					IM.InlineOverlay(false);
					node.find(".inline-processing").hide();
					node.find("*[data-widget-property=post]").fadeIn(300);
				},300)

			}

			IM.DisableSettingsChangedNotifications = function(node){
				IM.InlineOverlay(true);
				node.find(".inline-processing").show(0);
				//setTimeout for prototype
				setTimeout(function(){IM.DisableSettingsChangedNotificationsComplete(node)}, 2500);
			}

			IM.DisableSettingsChangedNotificationsComplete = function(node){
				node.find("*[data-widget-property=post]").fadeOut(300);
				setTimeout(function(){
					IM.InlineOverlay(false);
					node.find(".inline-processing").hide();
					node.find("*[data-widget-property=pre]").fadeIn(300);
					node.find('.prompt-revealed').removeClass('prompt-revealed');
					node.find('.prompt-box').removeClass('active').fadeOut(400);
				},300)
			}

			IM.DisableCloseAccount = function(node){
				IM.InlineOverlay(true);
				node.find(".inline-processing").show(0);
				//setTimeout for prototype
				setTimeout(function(){IM.DisableCloseAccountComplete(node)}, 2500);
			}

			IM.DisableCloseAccountComplete = function(node){
				node.find("*[data-widget-property=post]").fadeOut(300);
				setTimeout(function(){
					IM.InlineOverlay(false);
					node.find(".inline-processing").hide();
					node.find("*[data-widget-property=pre]").fadeIn(300);
					node.find('.prompt-revealed').removeClass('prompt-revealed');
					node.find('.prompt-box').removeClass('active').fadeOut(400);
				},300)
			}

			IM.pauseReserve = function(node){
				node.find(".inline-processing").show(0);
				//setTimeout for prototype
				setTimeout(function(){pauseReserveComplete(node)}, 2500);

				function pauseReserveComplete(n) {
					var status = n.find('[data-widget-property=status]');
					n.find('[data-widget-property=active-state]').addClass('inactive');
					n.find('[data-widget-property=paused-state]').removeClass('inactive');
					n.find('[data-widget-name=reserve-pause]').fadeOut(300);
					status.fadeOut(300)
					setTimeout(
						function(){
							status.text('Paused').fadeIn(300);
						},
						300
						);

				}
			}


			IM.InlineOverlay = function(show){
				if(show){
					$(".inline-overlay").css("display","block");
				}else{
					$(".inline-overlay").css("display","none");
				}
			}

			IM.GameChange = function(node){
				IM.InlineOverlay(true);
				node.find(".inline-processing").show(0)

				//setTimeout for prototype
				setTimeout(function(){IM.GameChangeComplete(node)}, 2500);
			}

			IM.GameChangeComplete = function(node){
				var primary = $("*[data-widget-type=inline-actionable][data-property-primary=true]");
				var primaryTitle = primary.attr("data-property-title");
				var nodeTitle = node.attr("data-property-title");


				primary.fadeOut(300);
				node.fadeOut(300);

				setTimeout(function(){

					primary.find("*[data-widget-property=title]").text(nodeTitle);
					primary.find("*[data-widget-property=thumb]").removeClass(primaryTitle.toLowerCase()).addClass(nodeTitle.toLowerCase());
					primary.find("*[data-widget-property=switch-btn]").text("Switch to "+nodeTitle);

					node.find("*[data-widget-property=title]").text(primaryTitle);
					node.find("*[data-widget-property=thumb]").removeClass(nodeTitle.toLowerCase()).addClass(primaryTitle.toLowerCase());
					node.find("*[data-widget-property=switch-btn]").text("Switch to "+primaryTitle);

					primary.attr("data-property-title", nodeTitle);
					node.attr("data-property-title", primaryTitle);

				}, 300);

				setTimeout(function(){

					node.find('.prompt-revealed').removeClass('prompt-revealed');
					node.find('.prompt-box').removeClass('active').hide(0);
					node.find('*[data-widget-property=replaced-by-prompt]').addClass('active').show();
					node.find(".inline-processing").hide();

					setTimeout(function(){
						IM.InlineOverlay(false);
						node.fadeIn(300);
					}, 200);
					primary.fadeIn(300);
				}, 400);

			}
		}

		HW.DateFilter = new function(){

			var DF = this;
			var me;
			var dateInputs=[];
			var useDefaultPicker = true;
			var filtersApplied = false;
			var filterValues = ["",""];
			var pickerHasFocus = null;
			var closeFiltersOnComplete;
			var hasErrors = 0;

			DF.init = function(n){
				me = n;
				useDefaultPicker = DF.getDateCapabilities();
				closeFiltersOnComplete = true;
				dateInputs = me.find('[data-widget-property=date-input]');
				if(!useDefaultPicker){
					dateInputs.datepicker({
						minDate:"0",
						yearRange: "0:+10",
						onClose:DF.pickerCloseHandler
					});
				}else{
					//straight JS because jQuery doesn't allow type changes due to < IE8 limitations
					for(var i=0; i<dateInputs.length;i++){
						try{
							dateInputs[i].type = "date";
						}catch(e){
							// ie has a time changing the type
						}
					}
				}
				DF.attachHandlers();


				//clean this up some
				$("[data-widget-property=input-container]").each(function () {
					var $this = $(this).find("input");
					var placeholder = $(this).find("label");
					placeholder.find("span").attr("data-text", placeholder.find("span").text());
					inputVal = $.trim($this.val());
					if (inputVal) {
						placeholder.hide()
					};
					$this.focus(function () {
						if(pickerHasFocus === $this[0]) return;
						pickerHasFocus = $this[0];
						if (!$.trim($this.val())) {
							placeholder.find("span").text("");
						}
						if(!useDefaultPicker){

							var maxmin = ($this[0] === dateInputs[0] ? "maxDate" : "minDate");
							var todate = null;

							if(maxmin=="maxDate")
								todate = $.trim(dateInputs[1].value) ? dateInputs[1].value : null
							else
								todate = $.trim(dateInputs[0].value) ? dateInputs[0].value : 0;
							$this.datepicker( "option", maxmin, todate );

						}
					});
					$this.blur(function () {
						var datepickerOpen = !!$.datepicker._lastInput && $.datepicker._lastInput === $this[0];
						if(!datepickerOpen) pickerHasFocus=null;
						setTimeout(function(){DF.placeholderHandler($this,placeholder)}, 200)
					})
				})

}

DF.getDateCapabilities = function(){
	return Hudson.testTouch();
}

DF.attachHandlers = function(){
	dateInputs.keyup(DF.keyHandler);
	me.find('[data-widget-property=filter-open]').click(DF.openFilters);
	me.find('[data-widget-property=filter-close]').click(DF.closeFilters);
	me.find('[data-widget-property=filter-apply]').click(DF.applyFilters);
	me.find('[data-widget-property=filter-reset]').click(DF.resetFilters);
	me.find('[data-widget-property=filter-clear]').click(DF.clearFilters);

}

DF.keyHandler = function(event){
	if (event.keyCode === 13) DF.dateValidate();
}

DF.openFilters = function(){
	closeFiltersOnComplete = true;
	if(filterValues[0] && useDefaultPicker) dateInputs[0].value = ( filterValues[0] );
	if(filterValues[1] && useDefaultPicker) dateInputs[1].value = ( filterValues[1] ) ;
	DF.placeholderHandler($(dateInputs[0]), $(dateInputs[0]).closest("[data-widget-property=input-container]").find("label"));
	DF.placeholderHandler($(dateInputs[1]), $(dateInputs[1]).closest("[data-widget-property=input-container]").find("label"));
	$("[data-widget-property=date-filter-closed]").fadeOut(300, function(){ $("[data-widget-property=date-filter-open]").fadeIn(300).css("display","inline-block"); })
	$("[data-widget-property=filter-result-count]").fadeOut(300);
}

DF.closeFilters = function(){
	pickerHasFocus = null;
	if(filtersApplied) $("[data-widget-property=filter-text]").text( new Date( filterValues[0]+"T12:00" ).toMMDDYYYYString() +" - "+ new Date( filterValues[1]+"T12:00" ).toMMDDYYYYString() );
	else $("[data-widget-property=filter-text]").text("Filter By Date");
	$("[data-widget-property=date-filter-open]").fadeOut(300, function(){
		$("[data-widget-property=date-filter-closed]").fadeIn(300);
		if(filtersApplied) $("[data-widget-property=filter-result-count]").fadeIn(300);
	})
}

DF.applyFilters = function(){
				//style date filters on small date bar instead of on filter save, keep native filter text the same
				if($(this).hasClass("disabled") || applyingFiltersProcessing) return;
				applyingFiltersProcessing = filtersApplied = true;
				DF.processFilters();
				filterValues = [
				dateInputs[0].value,
				dateInputs[1].value
				//new Date(dateInputs[0].value).toMMDDYYYYString(),
				//new Date(dateInputs[1].value).toMMDDYYYYString(),
				];
			}

			DF.clearFilters = function(){
				$("[data-widget-property=input-container]").each(function () {
					var $this = $(this).find("input");
					var placeholder = $(this).find("label");
					$this.val("");
					placeholder.find("span").text(placeholder.find("span").attr("data-text"));
				})
				$("[data-widget-property=filter-result-count]").fadeOut(300);
				filtersApplied = false;
				filterValues = ["",""];
				DF.processFilters();
				$("[data-widget-property=filter-text]").text("Filter By Date");

			}

			DF.resetFilters = function(){
				$("[data-widget-property=input-container]").each(function () {
					var $this = $(this).find("input");
					var placeholder = $(this).find("label");
					$this.val("");
					placeholder.find("span").text(placeholder.find("span").attr("data-text"));
				})
				if(filtersApplied){
					closeFiltersOnComplete = false;
					DF.processFilters();
					filterValues = ["",""];
					filtersApplied = false;
				}
			}

			DF.placeholderHandler = function($this, $placeholder){
				var datepickerOpen = !!$.datepicker._lastInput && $.datepicker._lastInput === $this[0];
				DF.dateValidate();
				if (!$.trim($this.val())) {
					if(!datepickerOpen && $this[0] != pickerHasFocus ){
						$placeholder.find("span").text($placeholder.find("span").attr("data-text"));
					}
				}else{
					$placeholder.find("span").text("");
				}
			}

			DF.dateValidate = function(){
				var isValid=0;
				dateInputs.each(function(){
					if(this.value==""){
						DF.removeError($(this));
					}else
					if( ( this.type=="date" || (/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/).test(this.value) ) &&  !isNaN((new Date(this.value)).getTime()) ){
							//correct date value
							isValid++;
							DF.removeError($(this));
						}else{
							hasErrors = 0;
							DF.triggerError($(this), "Please enter a valid date")
						}
					});
				if(isValid==2) $("[data-widget-property=filter-apply]").removeClass("disabled");
				else $("[data-widget-property=filter-apply]").addClass("disabled");
			}

			DF.processFilters = function(){
				loadMoreEnabled = false;
				Springboard.Widget.ProcessingOverlay.fullscreen(false);
				Springboard.Widget.ProcessingOverlay.show();
				SA.FilterRequest(DF.PROTO_changeItems, dateInputs[0], dateInputs[1]);

			}

			DF.applyFiltersComplete = function(){
				Springboard.Widget.ProcessingOverlay.hide(Springboard.Widget.ProcessingOverlay.fullscreen);
				if(filtersApplied) $("[data-widget-property=filter-result-count]").fadeIn(300);
				loadMoreEnabled = !filtersApplied;
				applyingFiltersProcessing = false;
				if(closeFiltersOnComplete)
					DF.closeFilters();

			}

			DF.pickerCloseHandler = function(){
				var $this = $(this)
				var placeholder = $(this).closest("[data-widget-property=input-container]").find("label");
				setTimeout(function(){DF.placeholderHandler($this,placeholder)}, 200)
				/*
				if( this === dateInputs[0] && dateInputs[1].value === "" && this.value != "")
					setTimeout(function(){$(dateInputs[1]).datepicker("show")},100);
				*/
			}

			DF.triggerError = function($this, errorText){
				$this.addClass("error");
				$this.parent().find(".contextual-error").text(errorText).show(0);
				$(".sb-filters .grid-row").addClass("error-state");
				hasErrors++;
			}

			DF.removeError = function($this){
				$this.removeClass("error");
				$this.parent().find(".contextual-error").hide(0);
				hasErrors--;
				if(hasErrors<0)
					$(".sb-filters .grid-row").removeClass("error-state");
			}

			DF.PROTO_changeItems = function(filtersApplied){

				DF.applyFiltersComplete();
			}

		}
/*
		HW.BPDateFilter = new function(){

			var DF = this;
			DF.SA = HW;
			var me;
			var dateInputs=[];
			var searchInput = null;
			var useDefaultPicker = true;
			var filtersApplied = false;
			var filterValues = ["","",""];
			var pickerHasFocus = null;
			var closeFiltersOnComplete;
			var applyingFiltersProcessing;
			var hasErrors = 0;
			var pickerLastBlurred = null;
			var PROTO_ITEMS_HOLDER;
			var PROTO_ITEMS_FILTERED = $(payments);
			var PROTO_ITEMS_TEMP = $("<section class = 'container section-title-group'><div class = 'center-col'><div class = 'section-title-inner'><div class = 'empty-set-title'>We couldn't find any payments that match your search.</div></div></div></section>");

			DF.init = function(n){
				me = n;
				useDefaultPicker = DF.getDateCapabilities();
				closeFiltersOnComplete = true;
				dateInputs = me.find('[data-widget-property=date-input]');
				searchInput = me.find('[data-widget-property=search-input]');
				if(!useDefaultPicker){
					dateInputs.datepicker({
						maxDate: '0',
						yearRange: "-10:0",
						onClose:DF.pickerCloseHandler
					});
				}else{
					//straight JS because jQuery doesn't allow type changes due to < IE8 limitations
					for(var i=0; i<dateInputs.length;i++){
						try{
							dateInputs[i].type = "date";
						}catch(e){
							// ie has a time changing the type
						}
					}
				}
				DF.attachHandlers();


				//clean this up some
				$("[data-widget-property=input-container]").each(function () {
					var $this = $(this).find("input");
					var placeholder = $(this).find("label");
					placeholder.find("span").attr("data-text", placeholder.find("span").text());
					inputVal = $.trim($this.val());
					if (inputVal) {
						placeholder.hide()
					};
					 $this.focus(function () {
						if(pickerHasFocus === $this[0]) return;
						pickerHasFocus = $this[0];
						if (!$.trim($this.val())) {
							placeholder.find("span").text("");
						}
						if(!useDefaultPicker){
							var isFrom = $this[0] === dateInputs[0];
							var maxDate;
							var minDate;

							if(isFrom){
								if( ( dateInputs[1].type=="date" ||
									$.trim(dateInputs[1].value) &&
									(/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/).test(dateInputs[1].value) ) &&
									!isNaN((new Date(dateInputs[1].value)).getTime()) &&
									dateInputs[1].value < $.datepicker.formatDate('mm/dd/yyyy', new Date()) ){

										maxDate = dateInputs[1].value;
										minDate = new Date(maxDate).plusDays(-90).toMMDDYYYYString();
								}else{
									maxDate = 0;
									minDate = null;
								}
							}else{
								if(( dateInputs[0].type=="date" ||
									$.trim(dateInputs[0].value) &&
									(/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/).test(dateInputs[0].value) ) &&
									!isNaN((new Date(dateInputs[0].value)).getTime()) ){
									minDate = dateInputs[0].value;

									if(dateInputs[0].value < $.datepicker.formatDate('mm/dd/yyyy', new Date().plusDays(-90))){
										maxDate = new Date(minDate).plusDays(90).toMMDDYYYYString();
									}else{
										maxDate = 0;
									}
								}else{
									minDate = null;
									maxDate = 0;
								}
							}

							$this.datepicker( "option", "maxDate", maxDate );
							$this.datepicker( "option", "minDate", minDate );
						}
					});
					$this.blur(function () {
						var datepickerOpen = !!$.datepicker._lastInput && $.datepicker._lastInput === $this[0];
						if(!datepickerOpen) pickerHasFocus=null;
						pickerLastBlurred = $this;
						setTimeout(DF.placeholderHandler, 200, $this, placeholder)
					})
				})

			}

			DF.getDateCapabilities = function(){
				return Hudson.testTouch();
			}

			DF.attachHandlers = function(){
				dateInputs.keyup(DF.keyHandler);
				searchInput.keyup(DF.keyHandler);
				me.find('[data-widget-property=filter-open]').click(DF.openFilters);
				me.find('[data-widget-property=filter-close]').click(DF.closeFilters);
				me.find('[data-widget-property=filter-apply]').click(DF.applyFilters);
				me.find('[data-widget-property=filter-reset]').click(DF.resetFilters);
				me.find('[data-widget-property=filter-clear]').click(DF.clearFilters);

			}

			DF.keyHandler = function(event){
				if(this.id === "search-input") DF.checkValidation();
				if (event.keyCode === 13) DF.checkValidation();
			}

			DF.openFilters = function(){
				closeFiltersOnComplete = true;
				dateInputs[0].value = filterValues[0];
				dateInputs[1].value = filterValues[1];
				searchInput.val(filterValues[2]);
				DF.placeholderHandler($(dateInputs[0]), $(dateInputs[0]).closest("[data-widget-property=input-container]").find("label"));
				DF.placeholderHandler($(dateInputs[1]), $(dateInputs[1]).closest("[data-widget-property=input-container]").find("label"));
				$("[data-widget-property=date-filter-closed]").fadeOut(300, function(){ $("[data-widget-property=date-filter-open]").fadeIn(300).css("display","inline-block"); })
				$("[data-widget-property=filter-result-count]").fadeOut(300);
			}

			DF.closeFilters = function(){
				pickerHasFocus = null;
				if(filtersApplied)
					$("[data-widget-property=filter-text]").text( DF.getFilterText() );
				else $("[data-widget-property=filter-text]").text("Search Payee or Date");

				$("[data-widget-property=date-filter-open]").fadeOut(300, function(){
					$("[data-widget-property=date-filter-closed]").fadeIn(300);
					if(filtersApplied) $("[data-widget-property=filter-result-count]").fadeIn(300);
				})
			}

			DF.getFilterText = function(){
				var filterText = "";
				var timeModifier = (!isNaN((new Date(filterValues[0]+"T12:00")).getTime()))?"T12:00":"";


				if(filterValues[2]!=undefined&&filterValues[2]!="")
					filterText += '"'+filterValues[2]+'" ';

				if(filterValues[0]!=undefined&&filterValues[0]!="")
					filterText +=
						new Date( filterValues[0]+timeModifier).toMMDDYYYYString()
						+" - "+
						new Date( filterValues[1]+timeModifier ).toMMDDYYYYString();

				return filterText;
			}

			DF.applyFilters = function(){
				//style date filters on small date bar instead of on filter save, keep native filter text the same
				if($(this).hasClass("disabled") || applyingFiltersProcessing) return;
				applyingFiltersProcessing = filtersApplied = closeFiltersOnComplete = true;
				DF.processFilters();
				filterValues = [
					dateInputs[0].value,
					dateInputs[1].value,
					searchInput.val()
					];
			}

			DF.clearFilters = function(){
				$("[data-widget-property=input-container]").each(function () {
					var $this = $(this).find("input");
					var placeholder = $(this).find("label");
					$this.val("");
					placeholder.find("span").text(placeholder.find("span").attr("data-text"));
				})
				$("[data-widget-property=filter-result-count]").fadeOut(300);
				filtersApplied = false;
				filterValues = ["","",""];
				DF.processFilters();
				$("[data-widget-property=filter-text]").text("Search Payee or Date");

			}

			DF.resetFilters = function(){
				$("[data-widget-property=input-container]").each(function () {
					var $this = $(this).find("input");
					var placeholder = $(this).find("label");
					$this.val("");
					DF.removeError($this);
					placeholder.find("span").text(placeholder.find("span").attr("data-text"));
				})
				searchInput.val("");
				DF.checkValidation();
				if(filtersApplied){
					closeFiltersOnComplete = false;
					DF.processFilters();
					filterValues = ["","",""];
					filtersApplied = false;
				}
			}

			DF.placeholderHandler = function($this, $placeholder){
				var datepickerOpen = !!$.datepicker._lastInput && $.datepicker._lastInput === $this[0];
				DF.checkValidation();
				if (!$.trim($this.val())) {
					if(!datepickerOpen && $this[0] != pickerHasFocus ){
						$placeholder.find("span").text($placeholder.find("span").attr("data-text"));
					}
				}else{
					$placeholder.find("span").text("");
				}
			}

			DF.searchValidate = function(){
				return searchInput && searchInput.val() != "";
			}

			DF.dateValidate = function(){
				var isValid=0;
				dateInputs.each(function(){

					if(this.value==""){
						DF.removeError($(this));
					}else
						if( ( this.type=="date" || (/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/).test(this.value) ) &&  !isNaN((new Date(this.value.replace(/-/g,"/"))).getTime()) ){
							//correct date value
							isValid++;
							DF.removeError($(this));
						}else{
							hasErrors = 0;
							DF.triggerError($(this), "Please enter a valid date.")
						}
				});
				if(isValid==2){
					if(Math.abs(new Date(dateInputs[0].value) - new Date(dateInputs[1].value)) > 7776000000 ){
						DF.triggerError($(dateInputs[0]), "");
						DF.triggerError($(dateInputs[1]), "");
						DF.triggerError(pickerLastBlurred, "Date range must be 90 days or less.");
						isValid = 0;
					}
				}

				return isValid === 2;
				//if(isValid==2) $("[data-widget-property=filter-apply]").removeClass("disabled");
				//else $("[data-widget-property=filter-apply]").addClass("disabled");
			}

			DF.checkValidation = function(){
				if(DF.searchValidate() || DF.dateValidate())
					$("[data-widget-property=filter-apply]").removeClass("disabled");
				else $("[data-widget-property=filter-apply]").addClass("disabled");
			}

			DF.processFilters = function(){
				loadMoreEnabled = false;
				HW.ProcessingOverlay.fullscreen(false);
				HW.ProcessingOverlay.show();

				setTimeout(DF.PROTO_changeItems, 2500)
				//SA.FilterRequest(DF.PROTO_changeItems, dateInputs[0], dateInputs[1]);

			}

			DF.applyFiltersComplete = function(){
				HW.ProcessingOverlay.hide(HW.ProcessingOverlay.fullscreen);
				if(filtersApplied) $("[data-widget-property=filter-result-count]").fadeIn(300);
				loadMoreEnabled = !filtersApplied;
				applyingFiltersProcessing = false;
				if(closeFiltersOnComplete)
					DF.closeFilters();

			}

			DF.pickerCloseHandler = function(){
				var $this = $(this)
				var placeholder = $(this).closest("[data-widget-property=input-container]").find("label");
				setTimeout(DF.placeholderHandler, 200, $this, placeholder);
				if( this === dateInputs[0] && dateInputs[1].value === "" && this.value != ""){
					setTimeout(function(){
						$(dateInputs[1]).val(new Date());
						$(dateInputs[1]).datepicker("show");
						$(dateInputs[1]).closest("[data-widget-property=input-container]").find("span").text("");
					},100);
				}
			}

			DF.triggerError = function($this, errorText){
				$this.addClass("error");
				$this.parent().find(".contextual-error").text(errorText).show(0);
				$(".sb-filters .grid-row").addClass("error-state");
				hasErrors++;
			}

			DF.removeError = function($this){
				$this.removeClass("error");
				$this.parent().find(".contextual-error").hide(0);
				hasErrors--;
				if(hasErrors<0)
					$(".sb-filters .grid-row").removeClass("error-state");
			}

			DF.PROTO_changeItems = function(filtersApplied){
				if(me.is("*[data-proto-property='empty-set']")){
					if( $("*[data-proto-content='filter']").length === 0 ){
						PROTO_ITEMS_HOLDER = me.closest("section.sb-filters").siblings("section");
						PROTO_ITEMS_HOLDER.fadeOut(0);
						$(".results-count").text("0 Results");
						$("#page-content").append(PROTO_ITEMS_TEMP);
						me.attr("data-proto-content","filter");
						$("*[data-widget-property=hide-on-filter]").hide(0);
					}else{
						PROTO_ITEMS_TEMP.remove();
						PROTO_ITEMS_HOLDER.fadeIn(300);
						me.attr("data-proto-content","");
						$("*[data-widget-property=hide-on-filter]").show(0);
					}
				}else{
					if( $("*[data-proto-content='filter']").length === 0 ){
						PROTO_ITEMS_HOLDER = me.closest("section.sb-filters").siblings("section").not(".section-title-group");
						PROTO_ITEMS_HOLDER.fadeOut(0);
						$(".results-count").text("11 Results");
						$("#page-content").append(PROTO_ITEMS_FILTERED);
						me.attr("data-proto-content","filter");
						$("*[data-widget-property=hide-on-filter]").hide(0);

					}else{
						PROTO_ITEMS_FILTERED.remove();
						PROTO_ITEMS_HOLDER.fadeIn(300);
						me.attr("data-proto-content","");
						$("*[data-widget-property=hide-on-filter]").show(0);
					}
				}
				DF.applyFiltersComplete();
			}
		}

		*/

/**
		*
		* Copied from Ben's work on date filters from springboard.js, but altered to
		* allow selection of future dates
		* TODO: Consolidate into one control for all date filters.
		*
		*/
		HW.DateFilterFuture = new function(){

			var DF = this;
			var me;
			var dateInputs=[];
			var useDefaultPicker = true;
			var filtersApplied = false;
			var filterValues = ["",""];
			var pickerHasFocus = null;
			var closeFiltersOnComplete;
			var hasErrors = 0;

			DF.init = function(n){
				me = n;
				useDefaultPicker = DF.getDateCapabilities();
				closeFiltersOnComplete = true;
				dateInputs = me.find('[data-widget-property=date-input]');
				if(!useDefaultPicker){
					dateInputs.datepicker({
						minDate:"0",
						yearRange: "0:+10",
						onClose:DF.pickerCloseHandler
					});
				}else{
					//straight JS because jQuery doesn't allow type changes due to < IE8 limitations
					for(var i=0; i<dateInputs.length;i++){
						try{
							dateInputs[i].type = "date";
						}catch(e){
							// ie has a time changing the type
						}
					}
				}
				DF.attachHandlers();


				//clean this up some
				$("[data-widget-property=input-container]").each(function () {
					var $this = $(this).find("input");
					var placeholder = $(this).find("label");
					placeholder.find("span").attr("data-text", placeholder.find("span").text());
					inputVal = $.trim($this.val());
					if (inputVal) {
						placeholder.hide()
					};
					$this.focus(function () {
						if(pickerHasFocus == $this[0]) return;
						pickerHasFocus = $this[0];
						if (!$.trim($this.val())) {
							placeholder.find("span").text("");
						}
						if(!useDefaultPicker){

							var maxmin = ($this[0] == dateInputs[0] ? "maxDate" : "minDate");
							var todate = null;

							if(dateInputs.count > 1){
								if(maxmin=="maxDate")
									todate = $.trim(dateInputs[1].value) ? dateInputs[1].value : null
								else
									todate = $.trim(dateInputs[0].value) ? dateInputs[0].value : 0;

								$this.datepicker( "option", maxmin, todate );
							}

						}
					});
					$this.blur(function () {
						var datepickerOpen = !!$.datepicker._lastInput && $.datepicker._lastInput == $this[0];
						if(!datepickerOpen) pickerHasFocus=null;
						setTimeout(function(){DF.placeholderHandler($this,placeholder)}, 200)
					})
				})

}

/*THIS IS REDUNDANT - TEST HAS ALREADY BEEN RUN IN HUDSON.WINDOW INIT function */
/* TODO: MAKE THIS METHOD AVAILABLE GLOBALLY */
DF.getDateCapabilities = function(){
	if (window.navigator.msMaxTouchPoints != undefined) {
		return (window.navigator.msMaxTouchPoints > 0) ? true : false;
	} else {
		return !!('ontouchstart' in window) || !!('onmsgesturechange' in window);
	}
}

DF.attachHandlers = function(){
	dateInputs.keyup(DF.keyHandler);
	me.find('[data-widget-property=filter-open]').click(DF.openFilters);
	me.find('[data-widget-property=filter-close]').click(DF.closeFilters);
	me.find('[data-widget-property=filter-apply]').click(DF.applyFilters);
	me.find('[data-widget-property=filter-reset]').click(DF.resetFilters);
	me.find('[data-widget-property=filter-clear]').click(DF.clearFilters);

}

DF.keyHandler = function(event){
	if (event.keyCode == 13) DF.dateValidate();
}

DF.openFilters = function(){
	closeFiltersOnComplete = true;
	if(filterValues[0] && useDefaultPicker) dateInputs[0].value = ( filterValues[0] );
	if(filterValues[1] && useDefaultPicker) dateInputs[1].value = ( filterValues[1] ) ;
	DF.placeholderHandler($(dateInputs[0]), $(dateInputs[0]).closest("[data-widget-property=input-container]").find("label"));
	DF.placeholderHandler($(dateInputs[1]), $(dateInputs[1]).closest("[data-widget-property=input-container]").find("label"));
	$("[data-widget-property=date-filter-closed]").fadeOut(300, function(){ $("[data-widget-property=date-filter-open]").fadeIn(300).css("display","inline-block"); })
	$("[data-widget-property=filter-result-count]").fadeOut(300);
}

DF.closeFilters = function(){
	pickerHasFocus = null;
	if(filtersApplied) $("[data-widget-property=filter-text]").text( new Date( filterValues[0]+"T12:00" ).toMMDDYYYYString() +" - "+ new Date( filterValues[1]+"T12:00" ).toMMDDYYYYString() );
	else $("[data-widget-property=filter-text]").text("Filter By Date");
	$("[data-widget-property=date-filter-open]").fadeOut(300, function(){
		$("[data-widget-property=date-filter-closed]").fadeIn(300);
		if(filtersApplied) $("[data-widget-property=filter-result-count]").fadeIn(300);
	})
}

DF.applyFilters = function(){
				//style date filters on small date bar instead of on filter save, keep native filter text the same
				if($(this).hasClass("disabled") || applyingFiltersProcessing) return;
				applyingFiltersProcessing = filtersApplied = true;
				DF.processFilters();
				filterValues = [
				dateInputs[0].value,
				dateInputs[1].value
				//new Date(dateInputs[0].value).toMMDDYYYYString(),
				//new Date(dateInputs[1].value).toMMDDYYYYString(),
				];
			}

			DF.clearFilters = function(){
				$("[data-widget-property=input-container]").each(function () {
					var $this = $(this).find("input");
					var placeholder = $(this).find("label");
					$this.val("");
					placeholder.find("span").text(placeholder.find("span").attr("data-text"));
				})
				$("[data-widget-property=filter-result-count]").fadeOut(300);
				filtersApplied = false;
				filterValues = ["",""];
				DF.processFilters();
				$("[data-widget-property=filter-text]").text("Filter By Date");

			}

			DF.resetFilters = function(){
				$("[data-widget-property=input-container]").each(function () {
					var $this = $(this).find("input");
					var placeholder = $(this).find("label");
					$this.val("");
					placeholder.find("span").text(placeholder.find("span").attr("data-text"));
				})
				if(filtersApplied){
					closeFiltersOnComplete = false;
					DF.processFilters();
					filterValues = ["",""];
					filtersApplied = false;
				}
			}

			DF.placeholderHandler = function($this, $placeholder){
				var datepickerOpen = !!$.datepicker._lastInput && $.datepicker._lastInput == $this[0];
				DF.dateValidate();
				if (!$.trim($this.val())) {
					if(!datepickerOpen && $this[0] != pickerHasFocus ){
						$placeholder.find("span").text($placeholder.find("span").attr("data-text"));
					}
				}else{
					$placeholder.find("span").text("");
				}
			}

			DF.dateValidate = function(){
				var isValid=0;
				dateInputs.each(function(){
					if(this.value==""){
						DF.removeError($(this));
					}else
					if( ( this.type=="date" || (/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/).test(this.value) ) &&  !isNaN((new Date(this.value)).getTime()) ){
							//correct date value
							isValid++;
							DF.removeError($(this));
						}else{
							hasErrors = 0;
							DF.triggerError($(this), "Please enter a valid date")
						}
					});
				if(isValid==2) $("[data-widget-property=filter-apply]").removeClass("disabled");
				else $("[data-widget-property=filter-apply]").addClass("disabled");
			}

			DF.processFilters = function(){
				loadMoreEnabled = false;
				Springboard.Widget.ProcessingOverlay.fullscreen(false);
				Springboard.Widget.ProcessingOverlay.show();
				SA.FilterRequest(DF.PROTO_changeItems, dateInputs[0], dateInputs[1]);

			}

			DF.applyFiltersComplete = function(){
				Springboard.Widget.ProcessingOverlay.hide(Springboard.Widget.ProcessingOverlay.fullscreen);
				if(filtersApplied) $("[data-widget-property=filter-result-count]").fadeIn(300);
				loadMoreEnabled = !filtersApplied;
				applyingFiltersProcessing = false;
				if(closeFiltersOnComplete)
					DF.closeFilters();

			}

			DF.pickerCloseHandler = function(){
				var $this = $(this)
				var placeholder = $(this).closest("[data-widget-property=input-container]").find("label");
				setTimeout(function(){DF.placeholderHandler($this,placeholder)}, 200)
				/*
				if( this == dateInputs[0] && dateInputs[1].value == "" && this.value != "")
					setTimeout(function(){$(dateInputs[1]).datepicker("show")},100);
				*/
			}

			DF.triggerError = function($this, errorText){
				$this.addClass("error");
				$this.parent().find(".contextual-error").text(errorText).show(0);
				$(".sb-filters .grid-row").addClass("error-state");
				hasErrors++;
			}

			DF.removeError = function($this){
				$this.removeClass("error");
				$this.parent().find(".contextual-error").hide(0);
				hasErrors--;
				if(hasErrors<0)
					$(".sb-filters .grid-row").removeClass("error-state");
			}

			DF.PROTO_changeItems = function(filtersApplied){

				DF.applyFiltersComplete();
			}

		},

		/**
		* Controls Progressive Enhancement of radio buttons, replacing the native UI
		* with a custom cover across all breakpoints.
		*
		* This widget is used throughout the site.
		*
		* @class EnhancedRadio
		* @namespace Hudson.Widget
		* @constructor {function}

		*/
		HW.EnhancedRadio = new function() {

			/**
			* Enables the custom radio cover, and hides the native element directly on top of
			* it so that the custom element is interactive as expected.
			*
			* @method init
			* @namespace Hudson.Widget.EnhancedRadio
			* @param {object} n jQuery object representing the particular input node
			* @return {none}
			*/
			this.init = function(n) {
				var siblingDiv;
				var me = n;
				var thisInputName = me.attr('id');
				var parentDiv = '<div class = "form-radio" />';

				if (me[0].checked) {
					siblingDiv = '<div class = "cover active" />'
				} else {
					siblingDiv = '<div class = "cover" />'
				}
				me.wrap(parentDiv);
				me.parent('.form-radio').append(siblingDiv);
				$('label[for="' + thisInputName + '"]').appendTo(me.parent('.form-radio'));
			}

			/**
			* Fired on change of the radio element, swaps in and out the appropriate cover
			* ui element
			*
			* @method change
			* @namespace Hudson.Widget.EnhancedRadio
			* @param {object} e The event object.
			* @return {none}
			*/
			this.change = function(e) {
				var me = $(this);
				var thisName = me.attr('name');
				var siblingSelector = '[name=' + thisName + ']';

				$(siblingSelector).siblings('.cover').removeClass('active');
				me.siblings('.cover').toggleClass('active');
			}
		}


		/**
		* Controls Progressive Enhancement of check boxes, replacing the native UI
		* with a custom cover across all breakpoints.
		*
		* This widget is used throughout the site.
		*
		* @class EnhancedCheckbox
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		HW.EnhancedCheckbox = new function() {
			/**
			* Enables the custom radio cover, and hides the native element directly on top of
			* it so that the custom element is interactive as expected.
			*
			* @method init
			* @namespace Hudson.Widget.EnhancedCheckbox
			* @param {object} n jQuery object representing the particular input node
			* @return {none}
			*/
			this.init = function(n) {
				var siblingDiv;
				var me = n;
				var parentDiv = '<div class = "form-checkbox" />';
				//var siblingDiv = '<div class = "cover" />';
				if (me.is(':checked')) {
					siblingDiv = '<div class = "cover active" />';
				} else {
					siblingDiv = '<div class = "cover" />';
				}
				me.wrap(parentDiv);
				me.parent('.form-checkbox').append(siblingDiv);

			}

			/**
			* Fired on change of the checkbox element, swaps in and out the appropriate cover
			* ui element
			*
			* @method change
			* @namespace Hudson.Widget.EnhancedCheckbox
			* @param {object} e The event object.
			* @return {none}
			*/
			this.change = function(e) {
				$(this).siblings('.cover').toggleClass('active');
			}
		}


		/**
		* Controls Progressive Enhancement of select elements, replacing the native UI
		* with a custom cover across all breakpoints.  Includes controls for two types of selects,
		* one standard, and one for a select with a displayed funding source type icon
		*
		* This widget is used throughout the site, like on the 'add money' page.
		*
		* @class EnhancedSelect
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		HW.EnhancedSelect = new function() {

			/**
			* Controls simple select elements, where the only thing displayed is text.
			*
			* This widget is used throughout the site, like state selectors on the registration first page
			*
			* @class Simple
			* @namespace Hudson.Widget.EnhancedSelect
			* @constructor {function}
			*/
			this.Simple = new function() {

				/**
				* Enables the custom cover, and hides the native element directly on top of
				* it so that the custom element is interactive as expected.
				*
				* @method init
				* @namespace Hudson.Widget.EnhancedSelect
				* @param {object} n jQuery object representing the particular input node
				* @return {none}
				*/
				this.init = function(n) {
					var activeValue, coverDivSnippet, cover, option, placeholderText;
					var me = n;

					placeholderText = me.siblings('.placeholder').html();
					me.find('option').each(function(index, value) {
						option = $(this);
						if ((placeholderText != undefined) && (placeholderText.length > 0)) {
							activeValue = placeholderText;
							me.prepend('<option value data-select-placeholder = "null"></option>');
							me.val('');
						} else if (option.attr('selected')) {
							activeValue = option.text();
						}
					});
					me.addClass('widget-active')
					coverDivSnippet = '<div class="t-body-bold filter-value"><div class = "picker-icon"></div><div class= "filter-text"><div class = "filter-text-inner">' + activeValue + '</div></div></div>';
					cover = me.parent().append(coverDivSnippet);
				}

				/**
				* Fired on click of the select element, swaps in and out the appropriate cover
				* ui element to represent the option that has actually been selected
				*
				* @method change
				* @namespace Hudson.Widget.EnhancedSelect
				* @param {object} e The event object.
				* @return {none}
				*/
				this.click = function() {
					var selectedText, value
					var selected = $(this);
					var selectedValue = $(this).val();
					var selectedText = selected.find("option[value='" + selectedValue +"']").text()
					var displayText = (selectedText != undefined && selectedText.length > 0) ? selectedText : selectedValue;

					value = '<div class = "picker-icon"></div><div class= "filter-text"><div class = "filter-text-inner">' + displayText + '</div></div>';
					selected.siblings('.filter-value').html(value);
				}
			}

			/**
			* Controls funding-source select elements, where the select element displays
			* both text and an icon representing the funding source type.
			*
			* This widget is used throughout the site, like on the 'add money' page.
			*
			* @class Card
			* @namespace Hudson.Widget.EnhancedSelect.
			* @constructor {function}
			*/
			this.Card = new function() {

				/**
				* Enables the custom cover, and hides the native element directly on top of
				* it so that the custom element is interactive as expected.
				*
				* @method init
				* @namespace Hudson.Widget.EnhancedSelect
				* @param {object} n jQuery object representing the particular input node
				* @return {none}
				*/
				this.init = function(n) {
					var activeValue, cardType, coverDivSnippet, cover, selectItem, paymentClass, fineprint, finePrintType;
					var me = n;
					me.find('option').each(function(index) {
						selectItem = $(this);
						if (selectItem.attr('selected')) {
							//activeValue = selectItem.val().length > 0 ? selectItem.val() : selectItem.html() ;
							activeValue = selectItem.text();
							paymentClass = selectItem.attr('data-payment-class') != undefined ? selectItem.attr('data-payment-class') : 'none';
						}
					});

					me.addClass('widget-active')
					coverDivSnippet = '<div class="t-body-bold filter-value"><div class = "picker-icon"></div><div class= "filter-text"><div class = "filter-text-inner">' + activeValue + '</div></div></div>';
					cover = n.parent().append(coverDivSnippet);
					me.attr('value', activeValue);

					//look for fineprint
					fineprint = me.closest('.filter-item').siblings('.payment-fineprint');
					if (fineprint.length > 0) {
						fineprint.find("[data-smallprint-for]").removeClass('active');
						fineprint.find("[data-smallprint-for=" + paymentClass + "]").addClass('active');
					}
				}

				/**
				* Fired on click of the select element, swaps in and out the appropriate cover
				* ui element to represent the option that has actually been selected
				*
				* @method change
				* @namespace Hudson.Widget.EnhancedSelect
				* @param {object} e The event object.
				* @return {none}
				*/
				this.click = function() {
					var cardType, selectItem, selectedValue, fineprint, value;
					var selected = $(this);

					selected.find('option').each(function(index) {
						selectItem = $(this);
						if (selectItem[0].selected) {
							activeValue = selectItem.text();//selectItem.val().length > 0 ? selectItem.val() : selectItem.html() ;
							cardType = selectItem.attr('data-card-type') != undefined ? selectItem.attr('data-card-type') : 'none';
							paymentClass = selectItem.attr('data-payment-class') != undefined ? selectItem.attr('data-payment-class') : 'none';
						}
					});

					value = '<div class = "picker-icon"></div><div class= "filter-text"><div class = "filter-text-inner">' + activeValue + '</div></div>';
					selected.siblings('.filter-value').html(value);
					fineprint = selected.closest('.filter-item').siblings('.payment-fineprint');
					if (fineprint.length > 0) {
						fineprint.find("[data-smallprint-for]").removeClass('active');
						fineprint.find("[data-smallprint-for=" + paymentClass + "]").addClass('active');
					}
				}
			}

			this.State = new function() {

				this.init = function(n) {
					var activeValue, cardType, coverDivSnippet, cover, selectItem, paymentClass, fineprint, finePrintType;
					var me = n;
					me.find('option').each(function(index) {
						selectItem = $(this);
						if (selectItem.attr('selected')) {
							//activeValue = selectItem.val().length > 0 ? selectItem.val() : selectItem.html() ;
							activeValue = selectItem.text();
							cardType = selectItem.attr('data-card-type') != undefined ? selectItem.attr('data-card-type') : 'none';
							paymentClass = selectItem.attr('data-payment-class') != undefined ? selectItem.attr('data-payment-class') : 'none';
						}
					});

					me.addClass('widget-active')
					coverDivSnippet = '<div class="t-body-bold filter-value"><div class = "picker-icon"></div><div class= "filter-text ' + cardType + '"><div class = "account-icon"></div><div class = "filter-text-inner">' + activeValue + '</div></div></div>';
					cover = n.parent().append(coverDivSnippet);
					me.attr('value', activeValue);

					//look for fineprint
					fineprint = me.closest('.filter-item').siblings('.payment-fineprint');
					if (fineprint.length > 0) {
						fineprint.find("[data-smallprint-for]").removeClass('active');
						fineprint.find("[data-smallprint-for=" + paymentClass + "]").addClass('active');
					}
				}

				/**
				* Fired on click of the select element, swaps in and out the appropriate cover
				* ui element to represent the option that has actually been selected
				*
				* @method change
				* @namespace Hudson.Widget.EnhancedSelect
				* @param {object} e The event object.
				* @return {none}
				*/
				this.click = function() {
					var cardType, selectItem, selectedValue, fineprint, value;
					var selected = $(this);

					selected.find('option').each(function(index) {
						selectItem = $(this);
						if (selectItem[0].selected) {
							activeValue = selectItem.val().length > 0 ? selectItem.val() : selectItem.html() ;
							cardType = selectItem.attr('data-card-type') != undefined ? selectItem.attr('data-card-type') : 'none';
							paymentClass = selectItem.attr('data-payment-class') != undefined ? selectItem.attr('data-payment-class') : 'none';
						}
					});

					var selectedValue = $(this).val();
					var selectedText = selected.find("option[value='" + selectedValue +"']").text()
					var displayText = (selectedText != undefined && selectedText.length > 0) ? selectedText : selectedValue;

					value = '<div class = "picker-icon"></div><div class= "filter-text ' + cardType + '"><div class = "account-icon"></div><div class = "filter-text-inner">' + displayText + '</div></div>';
					selected.siblings('.filter-value').html(value);
					fineprint = selected.closest('.filter-item').siblings('.payment-fineprint');
					if (fineprint.length > 0) {
						fineprint.find("[data-smallprint-for]").removeClass('active');
						fineprint.find("[data-smallprint-for=" + paymentClass + "]").addClass('active');
					}
				}
			}
		}


		/**
		* Controls Progressive Enhancement of radio buttons, replacing the native UI
		* with a custom cover across all breakpoints.
		*
		* This widget is used throughout the site.
		*
		* @class EnhancedRadio
		* @namespace Hudson.Widget
		* @constructor {function}

		*/
		HW.FocusReveal = new function() {

			/**
			* Reveals more form content when form field receives focus
			*
			* @method init
			* @namespace Hudson.Widget.FocusReveal
			* @param {object} n jQuery object representing the particular input node
			* @return {none}
			*/
			this.init = function(n) {
				var me = n;
				var targetSelector = me.attr('data-focus-reveal-target');
				var target = $(targetSelector);

				if(target){
					target.css('display','none');
					me.on('focus', function(){
						target.slideDown('fast', function(){
							target.css('overflow', 'visible');
						});
					})
				}
			}


		}

		HW.ShowHideDrawer = new function() {

			/**
			* Reveals content and hides it if canceled
			*
			* @method init
			* @namespace Hudson.Widget.ShowHideDrawer
			* @param {object} n jQuery object representing the particular input node
			* @return {none}
			*/
			this.init = function(n) {
				var me = n;
				var showTrigger = me.find('*[data-widget-type=show-hide-drawer-show]');
				var hideTrigger = me.find('*[data-widget-type=show-hide-drawer-hide]');
				var origin = me.find('*[data-widget-type=show-hide-drawer-origin]');
				var targetDrawer = me.find('*[data-widget-type=show-hide-drawer-drawer]');

				if(showTrigger && origin && targetDrawer){
					showTrigger.on('click', function(e){
						origin.fadeOut('fast', function(){
							targetDrawer.slideDown('fast');
						})

						hideTrigger.on('click', function(e){
							targetDrawer.fadeOut('fast', function(){
								origin.fadeIn('fast');
							})
						})
						e.preventDefault();
					});
				}
			}


		}


		/**
		* For form sets where there is a text field related to a radio button this
		* auto-selects the related radio button when the form is focused
		*
		* This widget is used throughout the site.
		*
		* @class InputFocusSelectRadio
		* @namespace Hudson.Widget
		* @constructor {function}

		*/
		HW.InputFocusSelectRadio = new function() {

			/**
			* Reveals more form content when form field receives focus
			*
			* @method init
			* @namespace Hudson.Widget.InputFocusSelectRadio
			* @param {object} n jQuery object representing the particular input node
			* @return {none}
			*/
			this.init = function(n) {

				var me = n;
				var focusTargets = me.find('input[type=text]');

				if(focusTargets){
					focusTargets.each(function(){
						$(this).on('focus', function(){
							var targetRadio = $(this).parents('.radio-group').find('input[type=radio]');
							targetRadio.attr('checked', 'checked');
							me.find('.cover').removeClass('active');
							targetRadio.next('.cover').addClass('active');
						});
					});
				};
			}
		}


		/**
		* Controls the opening of tooltips across all breakpoints.
		*
		* This widget is used throughout the site, for instance on the login page attached
		* to 'remember email address'
		*
		* @class ToolTip
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		HW.ToolTip = new function() {

			/**
			* Opens the tooltip, assigning classes and/or CSS offset so that the tooltip
			* relatively centered on the x axis within the viewport.  If necessary, scrolls
			* the viewport to expose the entire tooltip.
			*
			* @method click
			* @namespace Hudson.Widget.ToolTip
			* @param {object} e Event object
			* @return {none}
			*/
			this.click = function(e) {
				var offsetCorrection, toolTipBodyHeight, documentHeight, scrollOffset, newScroll,
				tooltipName, tooltipBody, currentState, thisOffset, activatorOffset, documentWidth,
				documentHeight, scrollOffset, toolTipBodyWidth, currentSize, newScrollPos, isIEMobile;
				var me = $(this);
				var currentState = me.find('[data-action-role=tooltip-body]').attr('data-action-state');
				var thisTarget = $(e.target);

				//e.preventDefault();
				e.stopPropagation();
				/* open any other tooltips that had been opened*/
				clearOpen(e);

				if (currentState != 'open') {
					tooltipName = me.attr('data-widget-name');
					tooltipBody = $("*[data-action-role = 'tooltip-body'][data-widget-name = '" + tooltipName +"']");
					currentState = tooltipBody.attr('data-action-state');

					/*clear any classes or css that may have already been applied so we start with a blank slate*/
					me.removeClass('left');
					tooltipBody.find('.tooltip-body').removeAttr('css')

					thisOffset = me.offset()
					activatorOffset = thisOffset.left + 8;
					documentWidth = $(window).width()
					documentHeight = $(window).height();
					scrollOffset = thisOffset.top - $('body').scrollTop();
					isIEMobile = navigator.userAgent.indexOf('IEMobile') >= 0 ? true : false;

					toolTipBodyWidth = parseInt(tooltipBody.find('.tooltip-body').css('width'), 10);
					currentSize = $('html').attr('data-current-breakpoint');

					/*position the tooltip on the x axis*/
					if (currentSize === 'large' || currentSize === 'xlarge' || currentSize === 'medium') {
						if (activatorOffset < (documentWidth / 2)) {
							me.addClass("left");
						}
					}

					if ((toolTipBodyWidth - activatorOffset) > 20) {
						if (activatorOffset + toolTipBodyWidth > documentWidth - 20) {
							offsetCorrection = activatorOffset - documentWidth + 30;
						} else {
							offsetCorrection = (activatorOffset - toolTipBodyWidth) - 8;
						}
						tooltipBody.find('.tooltip-body').css('right', offsetCorrection);
					}


					/*open/close the tooltip*/
					if (tooltipBody.attr("data-open-by") === 'animation') {
						tooltipBody.slideToggle(300, function() {
							me.attr('data-action-state', 'open')
						});
					} else {
						tooltipBody.attr('data-action-state', 'open')
					};

					tooltipBody.attr('aria-hidden','false');

					/*if necessary, scroll the document to reveal the entire tooltip body*/
					//have to figure height after tooltip opens, because it has display:none when it is closed
					//IEMobile 7.5 doesn't accurately return scrollTop(), so disable this affordance
					if (!isIEMobile) {
						toolTipBodyHeight = tooltipBody.find('.tooltip-body').height() + 30;
						if (documentHeight - scrollOffset < toolTipBodyHeight) {
							newScrollPos = thisOffset.top - documentHeight + toolTipBodyHeight + 60;
							$('html, body').animate({
								scrollTop: newScrollPos
							}, 600);
						}
					}
				} else {
					clearOpen(e);
				}
			}
		}

		HW.CardSelection = new function() {
			/**
			*/
			this.click = function(e) {
				e.preventDefault();
				var me = $(this);
				me.siblings().removeClass('active').addClass('inactive');
				me.removeClass('inactive').addClass('active');
			}
		}


		/**
		* This affordance is used to expose the card type (Amex, Visa, MC, etc.) on certain entry fields.
		* The way it achieves this affect is by toggling the class of associated graphic elements to active or
		* inactive states.
		*
		* This widget is used, for instance, on the link credit card page.
		*
		* @class CardTypeReveal
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		HW.CardTypeReveal = new function() {

			/**
			* Holds information about the reveal widget.  It's filled on init, then accessed on change
			*
			* @attribute State
			* @namespace Hudson.Widget.CardTypeReveal
			* @type object
			*/
			var state = {};

			/**
			* Records the element that lists the card types associated with the reveal widget, and then stores it
			* to the state attribute;
			*
			* @method init
			* @namespace Hudson.Widget.CardTypeReveal
			* @param {object} n The reveal node itself (not currently used)
			* @return {none}
			*/
			this.init = function(n) {
				state.cardChangeBlock = $('*[data-widget-type=cards-list]');
			}

			/**
			* Reads the value of the reveal input field onkeyup, and then toggles the classes on the card
			* listing images as appropriate
			*
			* @method keyup
			* @namespace Hudson.Widget.CardTypeReveal
			* @param {object} e The event object.
			* @return {none}
			*/
			this.keyup = function(e) {
				var me = $(this)
				var contentToChange = state.cardChangeBlock;
				var thisValue = me.val();
				var stem = thisValue.slice(0,4);
				var type;

				if (stem.slice(0,1) === '4') {
					type = 'visa';
				} else if (stem.slice(0,2) === '51' || stem.slice(0,2) === '55') {
					type = 'mc';
				} else if (stem.slice(0,2) === '34' || stem.slice(0,2) === '37') {
					type = 'amex';
				} else if (stem === '6011' || stem.slice(0,2) === '65') {
					type = 'discover'
				} else {
					if (thisValue.length > 4) {
						type = 'fail';
					} else {
						type = 'none';
					}
				}

				contentToChange.find('*[data-card-type]').each(function(){
					var cardType = $(this).attr('data-card-type');

					if (type != 'fail') {
						if (cardType != type && type != 'none') {
							$(this).addClass('inactive');
						} else {
							$(this).removeClass('inactive');
						}
					} else {
						$(this).addClass('inactive');
					}
				});
			}
		}

		HW.Dismissable = new function() {
			var D = this;

			D.init = function(node) {
				var me = node;
				var close_btn = me.find('.close-btn');
				close_btn.on('click', function() {
					me.fadeOut(400);
					ajaxCall()
				});
			}

			/* AJAX CALL TO SET 'DISMISSED' PROPERTY GOES HERE */
			function callBack() {
				ajaxCall('as');
			}

		}


		/**
		* Controls the behaviors of action prompts, which are dynamic confirmation checks.  Action prompts
		* perform like modal windows on the old mobile site, allowing the user to confirm or cancel and action
		* before submitting it.
		*
		* This widget is used, for instance, on some types of pending transactions, and on the funding source
		* page to delete funding sources.
		*
		* @class ActionPrompt
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		HW.ActionPrompt = new function() {

			/**
			* Initializes the widget, defining the node to expand and behavior for the cancel button within the prompt
			*
			* @method init
			* @namespace Hudson.Widget.ActionPrompt
			* @param {object} n The action prompt node
			* @return {none}
			*/
			this.init = function(n) {
				var me = n;
				var thisWidget = me.attr('data-widget-name');
				var sectionToExpand = $('*[data-widget-type=action-prompt-target][data-widget-name='+thisWidget+']');
				var cancelBtn = sectionToExpand.find("*[data-widget-action=cancel]").filter(function(){ return sectionToExpand[0] === $(this).closest("*[data-widget-type=action-prompt-target]")[0] });
				var thisTransitionType = (me.attr('data-transition-type') != undefined) ? me.attr('data-transition-type') : 'toggle';

				if (thisTransitionType === 'fadeoutfadein') {
					// Event Listener on click of cancel button
					cancelBtn.on('click', function() {
						originalSection = me.closest('[data-widget-property=replaced-by-prompt]');

						if (originalSection.length === 0) {
							originalSection = me.closest('*[data-widget-type=inline-actionable]').find('*[data-widget-property=replaced-by-prompt]');
						}

						me.removeClass('prompt-revealed');

						sectionToExpand.fadeOut(300, function() {
							originalSection.fadeIn(300);
						});
					})
				} else {
					// Event Listener on click of cancel button
					cancelBtn.on('click', function() {
						$('*[data-widget-type=action-prompt][data-widget-name='+thisWidget+']').removeClass('prompt-revealed');
						if (sectionToExpand.length > 0) {
							sectionToExpand.fadeOut(300, function() {
								$(this).removeClass('active');
							});
						};
					})
				}
			}

			/**
			* Defines the expand behavior of the action prompt.
			*
			* @method reveal
			* @namespace Hudson.Widget.ActionPrompt
			* @param {object} e The event object
			* @return {none}
			*/



			this.reveal = function(e) {
				var replacementTarget;
				var me = $(this);
				var thisWidget = me.attr('data-widget-name');
				var thisTransitionType = (me.attr('data-transition-type') != undefined) ? me.attr('data-transition-type') : 'toggle';
				var sectionToExpand = $('[data-widget-type=action-prompt-target][data-widget-name='+thisWidget+']');
				var parent = me.closest('.funding-source-inner');
				var openSection = me.closest('*[data-widget-type=inline-actionable]').find('[data-widget-type=action-prompt-target].active');

				if (me.hasClass('prompt-revealed')) {
					me.removeClass('prompt-revealed');
				} else {
					me.addClass('prompt-revealed');
				}

				if (thisTransitionType === 'fadeoutfadein') {
					replacementTarget = me.closest('*[data-widget-type=inline-actionable]').find('*[data-widget-property=replaced-by-prompt]');
					replacementTarget.fadeOut(300, function() {
						sectionToExpand.fadeIn(300);
					});
				} else {
					if (openSection.length > 0) {
						var currentOpenSectionName = openSection.attr('data-widget-name');
						var sectionToExpandName = sectionToExpand.attr('data-widget-name');

						$('[data-widget-type=action-prompt][data-widget-name=' + currentOpenSectionName + ']').removeClass('prompt-revealed');
						openSection.fadeOut(300, function() {
							sectionToExpand.fadeIn(300, function() {
								$(this).addClass('active');
								$('[data-widget-type=action-prompt][data-widget-name=' + sectionToExpandName + ']').addClass('prompt-revealed');
								$(this).css("overflow","");
							});
							$(this).removeClass('active');
						});
					} else {
						sectionToExpand.fadeIn(300, function() {
							$(this).addClass('active');
							$(this).css("overflow","");
						});
					}
				}
			}
		}

		/**
		* Controls the behaviors of action prompts, which are dynamic confirmation checks.  Action prompts
		* perform like modal windows on the old mobile site, allowing the user to confirm or cancel and action
		* before submitting it.
		*
		* This widget is used, for instance, on some types of pending transactions, and on the funding source
		* page to delete funding sources.
		*
		* @class ActionPrompt
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		HW.MpActionPrompt = new function() {

			/**
			* Initializes the widget, defining the node to expand and behavior for the cancel button within the prompt
			*
			* @method init
			* @namespace Hudson.Widget.ActionPrompt
			* @param {object} n The action prompt node
			* @return {none}
			*/

			this.init = function(n) {
				var me = n;

				var thisWidget = me.attr('data-widget-name');
				var thisTransitionType = (me.attr('data-transition-type') != undefined) ? me.attr('data-transition-type') : 'toggle';
				var sectionToExpand = $('*[data-widget-type=mp-action-prompt-target][data-widget-name='+ thisWidget +']');
				var cancelBtn = sectionToExpand.find("*[data-widget-action=cancel]").filter(function(){ return sectionToExpand[0] === $(this).closest("*[data-widget-type=mp-action-prompt-target]")[0] });

				if (thisTransitionType === 'fadeoutfadein') {
					// Register Event Listener on Click of Cancel Button
					cancelBtn.on('click', function() {
						var originalSection = me.closest('[data-widget-property=replaced-by-prompt]');

						if(originalSection.length === 0){
							originalSection = me.closest('*[data-widget-type=inline-actionable]').find('*[data-widget-property=replaced-by-prompt]');
						}

						me.removeClass('prompt-revealed');

						sectionToExpand.fadeOut(300, function() {
							originalSection.fadeIn(300);
						});
					})
				} else {
					// Register Event Listener on Click of Cancel Button
					cancelBtn.on('click', function() {
						$('*[data-widget-type=mp-action-prompt][data-widget-name='+thisWidget+']').removeClass('prompt-revealed');

						if (sectionToExpand.length > 0) {

							$(this).closest(".payee-container").animate({backgroundColor: 'transparent'}, 300);
							$(this).closest(".payee-container").siblings(".ruleset.with-or").fadeTo(300, 1);

							sectionToExpand.fadeOut(300, function() {
								$(this).removeClass('active');
							});
						};
					})
				}
			}

			/**
			* Defines the expand behavior of the action prompt.
			*
			* @method reveal
			* @namespace Hudson.Widget.ActionPrompt
			* @param {object} e The event object
			* @return {none}
			*/

			this.reveal = function(e) {
				var me = $(this);
				var thisWidget = me.attr('data-widget-name');
				var thisTransitionType = (me.attr('data-transition-type') != undefined) ? me.attr('data-transition-type') : 'toggle';
				var parentPayee = me.closest('.payee-container');
				var openSection = me.closest('.payee-container').find('[data-widget-type=mp-action-prompt-target].active');
				var parent = me.closest('.funding-source-inner');
				var replacementTarget;
				var sectionToExpand = $('[data-widget-type=mp-action-prompt-target][data-widget-name='+thisWidget+']');
				
				if (me.hasClass('prompt-revealed')) {
					me.removeClass('prompt-revealed');
				} else {
					me.addClass('prompt-revealed');
				}

				if (thisTransitionType === 'fadeoutfadein') {
					replacementTarget = me.closest('*[data-widget-type=inline-actionable]').find('*[data-widget-property=replaced-by-prompt]');
					replacementTarget.fadeOut(300, function() {
						sectionToExpand.fadeIn(300);
					});
				} else {
					if (openSection.length > 0) {
						var currentOpenSectionName = openSection.attr('data-widget-name');
						var sectionToExpandName = sectionToExpand.attr('data-widget-name');

						$('[data-widget-type=mp-action-prompt][data-widget-name=' + currentOpenSectionName + ']').removeClass('prompt-revealed');
						openSection.fadeOut(300, function() {
							sectionToExpand.fadeIn(300, function() {
								$(this).addClass('active');
								$('[data-widget-type=mp-action-prompt][data-widget-name=' + sectionToExpandName + ']').addClass('prompt-revealed');
								$(this).css("overflow","");
							});

							$(this).removeClass('active');
						});
					} else {
						parentPayee.animate({backgroundColor: '#F6F6F6'}, 300);
						parentPayee.next(".ruleset.with-or").fadeTo(300, .01);
						parentPayee.prev(".ruleset.with-or").fadeTo(300, .01);

						sectionToExpand.fadeIn(300, function() {
							$(this).addClass('active');
							$(this).css("overflow","");
						});
					}
				}
			}
		}

		/**
		* Improvement of exiting function from Responsive 2600.  Adds toggling of contextual errors, and also
		* clears the card balance when a user checks a starter card balance in registration
		*
		*
		* @class RadioClear
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		HW.RadioClear = new function() {

			/**
			* Clears a set of fields matching the name defined by 'data-widget-name'
			*
			* @method change
			* @namespace Hudson.Widget.RadioClear
			* @param {object} e The event object
			* @return {none}
			*/
			this.change = function(e) {
				var input, select;
				var me = $(this);
				var widgetName = me.attr('data-widget-name');
				var sectionToClear = $('*[data-widget-type=section-to-clear][data-widget-name="' + widgetName + '"]');
				var selectNewOption;

				sectionToClear.find('input').each(function() {
					input = $(this);
					input.val('').removeClass('prefill');
					input.removeClass('error');
					input.siblings('.contextual-error').removeClass('active');
				});

				sectionToClear.find('select').each(function() {
					select = $(this);
					select.find('option[selected]').removeAttr('selected');
					selectNewOption = select.find('option:first')
					selectNewOption.attr('selected','selected');
					select.siblings('.filter-value').find('.filter-text-inner').html(selectNewOption.html())
					select.siblings('.contextual-error').removeClass('active');
				});

				sectionToClear.find('.card-balance').remove();
			}
		}


		/**
		* Defines a simple widget that hides a field to disable it
		*
		* This widget is used on the 'try another way' path of the forgot email flow.
		*
		* @class RadioHide
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		HW.RadioHide = new function() {

			/**
			* Hides a node to disable it.  Fired on change, for instance, of a radio button.
			* Please note that this method should not be applied directly to an input node,
			* but rather to a container node wrapped around that node.  Otherwise, the contextual
			* help disappears and does not reappear after the field is revealed.
			*
			* @method change
			* @namespace Hudson.Widget.RadioHide
			* @param {object} e The event object
			* @return {none}
			*/
			this.change = function (e) {
				var widgetName = $(this).attr('data-widget-name');
				var sectionToHide = $('*[data-widget-type=section-to-hide][data-widget-name="' + widgetName + '"]');
				sectionToHide.toggleClass('hide-height');
			}
		}

		/**
		* Allows a set of radio buttons to open/close a related section with an animation, as in the starter card
		* section in Registration.
		*
		* @class RadioExpandAnimate
		* @namespace Hudson.Widget
		* @constructor {function}
		*/

		HW.RadioExpandAnimate = new function() {

			/*
			* Initializes the widget, assigning event listeners to the open and close activators.
			*
			* @method init
			* @namespace Hudson.Widget.RadioExpandAnimate
			* @param {object} The widget node
			* @return	 {none}
			*
			*/
			this.init = function(node) {
				var me = node;
				var openRadio = me.find('[data-widget-role=open]');
				var closeRadio = me.find('[data-widget-role=close]');
				var myName = node.attr('data-widget-name');
				var toggleSection = $('[data-action-role=action-target][data-widget-name="' + myName + '"]');
				openRadio.on('change', function(){
					toggleSection.slideToggle(300);
				});
				closeRadio.on('change', function(){
					toggleSection.slideToggle(300);
				});
			}
		}


		/**
		* Controls the behavior of the contact selection widget.
		*
		* This widget is used on action flows like send and request.
		*
		* @class Contacts
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		HW.Contacts = new function() {

			/**
			* A simple function that just closes the contact area.
			*
			* @method closeContact
			* @namespace Hudson.Widget.Contacts
			* @param {none}
			* @return {none}
			*/
			function closeContacts() {
				$('*[data-action-role=tooltip-body]').css('display', 'none');
				$('input[data-widget-type=contact-field]').removeAttr('disabled');
			}


			/**
			* Opens the contact area
			*
			* @method open
			* @namespace Hudson.Widget.Contacts
			* @param {object} e The event object
			* @return {none}
			*/
			this.open = function(e) {
				var offsetCorrection, toolTipBodyHeight, documentHeight, scrollOffset, newScroll, toolTipTop;
				var tooltipName = $(this).attr('data-widget-name');
				var tooltipBody = $("*[data-action-role = 'tooltip-body'][data-widget-name = '" + tooltipName +"']");
				var closeBtn = tooltipBody.find('.close-btn');
				var documentHeight = $(window).height();

				e.preventDefault();
				e.stopPropagation();

				closeBtn.off('click');
				closeBtn.one('click', closeContacts);
				$('input[data-widget-type=contact-field]').attr('disabled', 'disabled');
				tooltipBody.css('display', 'block');
			}

			/**
			* Delegates clicks within the contact area to the individual contacts listed.
			* On click, assigns the value of the contact to the main contact selection field (like 'Send to'),
			* and closes the contact area
			*
			* @method delegateClick
			* @namespace Hudson.Widget.Contacts
			* @param {object} n The contact area, onto which the delegate is applied
			* @return {none}
			*/
			this.delegateClick = function(n) {
				var tooltipName = $(n).attr('data-widget-name');
				var tooltipBody = $("*[data-action-role = 'tooltip-body'][data-widget-name = '" + tooltipName +"']");
				var targetField = $("input[data-widget-type=contact-field][data-widget-name = '" + tooltipName +"']");

				tooltipBody.delegate('input[type=checkbox]', 'change', function() {
					var fieldVal;
					targetField.removeAttr('disabled');
					$('input[type=checkbox]').not(this).attr('checked', false).siblings('.cover').removeClass('active');
					fieldVal = $(this).closest('.check').siblings('label').html();
					targetField.val($.trim(fieldVal));
					closeContacts(this);
					targetField.removeAttr('disabled');
				})
			}
		}


		/**
		* Certain types of messages, like transaction completed, are not meant to persist.  This
		* method controls the fade behavior of these messages.
		*
		* This widget is used on throughout the site, including on the home page and on the funding sources
		* page, after a funding source is deleted.
		*
		* @class MessageFades
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		HW.MessageFades = new function() {

			/**
			* Defines the fade transitions, first animating opacity, then height/padding.
			*
			* @method init
			* @namespace Hudson.Widget.MessageFades
			* @param {object} n The node containing the message
			* @return {none}
			*/
			this.init = function(n) {
				window.setTimeout(function() {
					n.animate({
						opacity: 0
					}, 800, function() {
						n.animate({
							height: 0,
							padding: 0,
							margin: 0
						}, 800, function(){
							n.remove();
						})
					})
				}, 3000)
			};
		}


		/**
		* Controls a selective-reveal type behavior, where a certain field or set of fields should
		* only be revealed after another field receives focus.
		*
		* This widget is used on the forgot flows, on the 'One last step' pages where the user
		* must enter their PIN OR or their Serve Card info OR their linked account info
		*
		* @class AccordionReveal
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		HW.AccordionReveal = new function() {

			/**
			* On focus, the reveal target closes other reveal sections on the page, and then opens it's on section
			*
			* @method focus
			* @namespace Hudson.Widget.AccordionReveal
			* @param {object} e The event object
			* @return {none}
			*/
			this.focus = function(e) {
				var target;
				var myName = $(this).attr('data-widget-name');
				if (myName != undefined) {
					target = $('*[data-widget-type=reveal-accordion-target][data-widget-name=' + myName+ ']');
					if (target === undefined || target.attr('data-accordion-state') === undefined || target.attr('data-accordion-state') != 'open') {
						$('*[data-widget-type=reveal-accordion-target][data-accordion-state=open]').attr('data-accordion-state','closed').slideToggle(300);
						target.slideToggle(300).attr('data-accordion-state', 'open');
					}
				}
			}

			/**
			* This method is applied just to select elements that are meant to trigger accordion behavior.
			* It is necessary because certain older Android devices don't fire the focus event on select elements
			* as expected.
			*
			* @method change
			* @namespace Hudson.Widget.AccordionReveal
			* @param {object} e The event object
			* @return {none}
			*/
			this.change = function(e) {
				var target;
				var myName = $(this).attr('data-widget-name');
				if (myName != undefined) {
					target = $('*[data-widget-type=reveal-accordion-target][data-widget-name=' + myName+ ']');
					if (target.attr('data-accordion-state') != 'open') {
						$('*[data-widget-type=reveal-accordion-target][data-accordion-state=open]').attr('data-accordion-state','closed').slideToggle(300);
						target.slideToggle(300).attr('data-accordion-state', 'open');
					}
				}
			}
		}


		/**
		* A really simple affordance that writes a '$' to the beginning of amount input fields.
		*
		* This widget is used, for instance, in the money bar on large, and in the action flows.
		*
		* @class DollarInput
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		HW.DollarInput = new function() {
			/**
			* On focus, if the field is empty, print the '$' and a space.
			*
			* @method focus
			* @namespace Hudson.Widget.DollarInput
			* @param {object} e The event object
			* @return {none}
			*/
			this.focus = function (e) {
				var me = $(this);
				var value = me.val();
				if (value.substr(0, 1) != '$') {
					me.val('$' + value);
				}
			};

			/**
			* On blur, if has only a '$' in it, then clear it.
			*
			* @method keyup
			* @namespace Hudson.Widget.DollarInput
			* @param {object} e The event object
			* @return {none}
			*/
			this.blur = function (e) {
				var me = $(this);
				var value = me.val();
				if (value.length == 1) {
					me.val('');
				}


				if (value.length > 1) {
					value = parseFloat(value.substring(1));
					if (isNaN(value))
						value = 0;
					if (value == 0) {
						me.val('');
					}
					else {
						me.val("$" + value.toFixed(2).toString());
					}
				}
			};

			/**
			* On keyup, if the field doesn't start with a dollar sign , add it.
			*
			* @method keyup
			* @namespace Hudson.Widget.DollarInput
			* @param {object} e The event object
			* @return {none}
			*/
			this.keyup = function (e) {
				var me = $(this);
				var value = me.val();

				if (value.indexOf('$') < 0) {
				    //fixes early android incorrecly setting cursor position on input value insertion
				    setTimeout(function () {
				        me.val('$' + value);
				    }, 1);
				} else {
				    if (value.indexOf('$') != 0) {
				        setTimeout(function () {
				            me.val('$' + value.replace('$', ''));
				        }, 1);
				    }
				}

				if (value.indexOf('.') == 1) {
				    //fixes early android incorrecly setting cursor position on input value insertion
				    setTimeout(function () {
				        me.val(value.replace(".", "0."));
				    }, 1);
				}

				//~To avoid key press event
				//return false; // bug 410112
				return true;
			};

			/**
      * On keydown, if the field more than 13 digits, make sure is valid.
      * If has decimal point make it valid
      * @method keyup
      * @namespace Hudson.Widget.DollarInput
      * @param {object} e The event object
      * @return {none}
      */
      this.keydown = function (e) {
	      if ((e.keyCode == 8) || (e.keyCode == 46) || (e.keyCode == 36) ||
				(e.keyCode == 45) || (e.keyCode == 37) || (e.keyCode == 39))
	          return true;

	      var me = $(this);
	      var value = me.val();
	      var origDollarVal = value.substring(1);
	      var hasDecimalPoint = (value.indexOf('.') > -1);

	      if (hasDecimalPoint) {
	          if (e.keyCode == 190) return false;
	      }

	      if (origDollarVal.length == 10) {
	          me.val('$' + origDollarVal);
	          if (!hasDecimalPoint) {
	              me.val('$' + origDollarVal + '.');
	          }
	          return true;
	      }
	      else if (origDollarVal.length >= 13) {
	          me.val('$' + origDollarVal);
	          return false;
	      }
      };
		}

		HW.PercentageInput = new function() {

			/**
			* On blur, if value does not end with '%' then add it.
			*
			* @method blur
			* @namespace Hudson.Widget.PercentageInput
			* @param {object} e The event object
			* @return {none}
			*/
			this.blur = function(e) {
				var me = $(this);
				var value = me.val();
				var last = value.slice(-1);

				if (value && last !=='%'){
					me.val(value+"%");
				}
			}
		}


		/**
		* Controls the contextual help affordance that appears on the Enter Bank Account Information
		* screen on the extra large breakpoint.
		*
		* @class BankAccountHelper
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		HW.BankAccountHelper = new function() {

			/**
			* On init, assign the correct listeners to the account and routing number fields to hide
			* and show the helper box.
			*
			* @method init
			* @namespace Hudson.Widget.BankAccountHelper
			* @param {object} e The event object
			* @return {none}
			*/
			this.init = function(e) {
				$('input[data-widget-type=check-helper-acct-field]').focus(function() {
					var currentBreakpoint = $('html').attr('data-current-breakpoint');
					if (currentBreakpoint === 'xlarge' || currentBreakpoint === 'large') {
						$('.check-image-highlight').removeClass('hide routing').addClass('acct');
					}
				});

				$('input[data-widget-type=check-helper-acct-field]').blur(function() {
					var currentBreakpoint = $('html').attr('data-current-breakpoint');
					if (currentBreakpoint === 'xlarge' || currentBreakpoint === 'large') {
						$('.check-image-highlight').removeClass('acct routing').addClass('hide');
					}
				});

				$('input[data-widget-type=check-helper-routing-field]').focus(function() {
					var currentBreakpoint = $('html').attr('data-current-breakpoint');
					if (currentBreakpoint === 'xlarge' || currentBreakpoint === 'large') {
						$('.check-image-highlight').removeClass('hide acct').addClass('routing');
					}
				});

				$('input[data-widget-type=check-helper-routing-field]').blur(function() {
					var currentBreakpoint = $('html').attr('data-current-breakpoint');
					if (currentBreakpoint === 'xlarge' || currentBreakpoint === 'large') {
						$('.check-image-highlight').removeClass('acct routing').addClass('hide');
					}
				});
			}
		}


		/**
		* Controls the contextual help bubble used on the registration flow and forgot flows.
		*
		* @class HelpBubble
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		HW.HelpBubble = new function() {
			var linkClicked = false;
			this.linkMouseDown = function() {
				linkClicked = true;
			}
			this.linkMouseUp = function() {
			  linkClicked = false;
			  HW.HelpBubble.hide(null);
			}			
			/**
			* Hides the contextual help bubble, for instance, on blur of an input field
			*
			* @method hide
			* @namespace Hudson.Widget.HelpBubble
			* @param {object} e The event object
			* @return {none}
			*/
			this.hide = function(e) {
				var globalAttr = $('html').attr('data-current-breakpoint');

				if (globalAttr != 'medium' && globalAttr != 'small') {
					if (linkClicked == false) {
						$('#bubble').removeClass('active');
					} else {
						linkClicked = false;
					}
				}
			}

			/**
			* Reveals the contextual help bubble, for instance, on focus of an input field.
			* Also moves and/or animates the bubble as appropriate (animate from field to field,
			* move without animation if not going from field to field).
			*
			* @method reveal
			* @namespace Hudson.Widget.HelpBubble
			* @param {object} e The event object
			* @return {none}
			*/
			this.reveal = function(e) {
				var thisInput, parentNode, parentNodeName, parentOffset, parentHeight, modifier,
				theTop, helpTop, contextualHelpText, clearHelp, theBubble;
				var globalAttr = $('html').attr('data-current-breakpoint');

				if (globalAttr != 'medium' && globalAttr != 'small') {
					thisInput = $(this);
					theBubble = $('#bubble');

					parentNode = thisInput.closest('.input-fieldset');
					parentNodeName = (parentNode.attr('data-help-section') != undefined) ? parentNode.attr('data-help-section') : 'general';

					parentOffset = parentNode.position().top;  //20px of padding in content box on xl
					parentHalfHeight = parentNode.height() / 2;
					contextualHelpText = parentNode.find('.contextual-help').html();
					clearHelp = ($(this).attr('data-widget-property') === 'clear-help') ? true : false;

					if (contextualHelpText != undefined && contextualHelpText.length > 0 && !clearHelp) {
						theBubble.attr('data-current-section', parentNodeName);
						theBubble.find('.bubble-text').html(contextualHelpText);
						theTop = parentOffset + parentHalfHeight - theBubble.find('.bubble-container').height()/2 - 7;
						if (theBubble.hasClass('active') || !(theBubble.hasClass('first'))) {
							theBubble.addClass('active');
							theBubble.animate({
								top: theTop
							}, 400);
						}
						else {
							theBubble.css('top', theTop);
							theBubble.addClass('active');
						}
						theBubble.removeClass('first');

					} else {
						theBubble.addClass('first');
					}
				}
			}
		}

		HW.SegAccts = new function() {
			this.click = function(e) {
				var me = $(this);

				Hudson.Async.ajaxCall($(this), null, '/Master/lib/ajax/true_result.json', function() {
					open(e, me);
				});
			}

			/* copied directly from springboard.js.  not accessible here because of namespacing. */
			function open(e, jQueryNodeObj) {
				var drawerToOpen, originalDrawer, activeDrawer;
				var me = (jQueryNodeObj !== undefined) ? jQueryNodeObj : $(this);
				var parentTransactionNode = me.closest('[data-transaction-id]');
				var transactionID = parentTransactionNode.attr('data-transaction-id');
				var drawerName = me.attr('data-widget-name');
				var container = $('[data-transaction-id="' + transactionID + '"]');
				var outDelay = this.outDelay;
				var inDelay = this.inDelay;

				if (e) {
					e.preventDefault();
					e.stopPropagation();
				}

				if (me.hasClass('prompt-revealed')) {
					drawerToOpen = parentTransactionNode.find('[data-widget-property=replaced-by-prompt]');
					originalDrawer = parentTransactionNode.find('[data-widget-type=action-prompt-target][data-widget-name="' + drawerName + '"]');
					me.removeClass('prompt-revealed');
				} else {
					drawerToOpen = parentTransactionNode.find('[data-widget-type=action-prompt-target][data-widget-name="' + drawerName + '"]');
					activeDrawer = parentTransactionNode.find('.active.prompt-box');
						if (activeDrawer.length > 0) {
							originalDrawer = activeDrawer;
						} else {
							originalDrawer = parentTransactionNode.find('[data-widget-property=replaced-by-prompt]');
							outDelay = 0;
						}
					me.addClass('prompt-revealed');
				}

				originalDrawer.slideUp(outDelay, function() {
					originalDrawer.removeClass('active');

					drawerToOpen.slideDown(inDelay, function() {
						drawerToOpen.addClass('active');
					});
				});
			};
		}

		/**
		* Provides additional contextual help on Reserve recurring transfer screens
		* related to when and how much money will be transferred from available balance
		* to Reserve
		*
		* @method DynamicFrequency
		* @namespace Hudson.Widget
		* @param {Object} e The event object.
		* @return {none}
		*/

		HW.DynamicFrequency = new function() {

			/**
			* Assigns listeners to controls on page, contains all core functionality.
			*
			* @method init
			* @namespace Hudson.Widget.DynamicFrequency
			* @param {object} node jQuery object representing the particular input node
			* @return {none}
			*/
			this.init = function(node) {
				var parent = node;
        var amountField = node.find('[data-widget-role=amount-field]');
        var frequencyField = node.find('[name=frequencyOption]');
        var dateStart = node.find('#date-start');
        var dateEnd = node.find('#date-end');
        var noEndDate = node.find('#no-end-date');

        var recurringStatement = node.find('[data-widget-role=recurring-statement]');
        var recurringStatementOnce = node.find('[data-widget-role=recurring-statement-once]');

        var oneTimeToggle = node.find('#OneTime');
        var recurrenceField = node.find('#recurring');
        var scheduleFrequency = $('#frequencyOptionSchedule input:radio');

        function checkDateValidity() {
        	if (dateStart.val().length == 0) {
        		return false;
        	} else if (dateEnd.val().length > 0 || noEndDate.is(':checked')){
        		return true;
        	}

        	return false;
        };

        function getSelectedRadio(nodes) {
					var selected = nodes.filter(":checked");

					return selected;
				}

				function parseDate(date) {
					var unixDate = new Date(date);
					var value = date;
					var dayOfWeek = unixDate.getDate();
					var ordinalsEN = [null, '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th',
					'11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st',
					'22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31th'];
					var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
					var thisDay = daysOfWeek[unixDate.getUTCDay()];
					var thisOrdinal = ordinalsEN[dayOfWeek];
					return {
						"value" : value,
						"dayOfWeek" : dayOfWeek,
						"thisDay" : thisDay,
						"thisOrdinal" : thisOrdinal
					}
				}

				function textToDisplay() {
					var amountValue = amountField.val();
					var isAmountValid = amountValue.length > 0;
					var isDateValid = checkDateValidity();

					var startValue, endValue;
					var frequencyType, frequencyValue, frequencyStatement;

					if (isAmountValid) {

						if (oneTimeToggle.length > 0 && oneTimeToggle.is(':checked')) {
							recurringStatement.addClass('inactive');
							recurringStatementOnce.removeClass('inactive');
							frequencyStatement = amountValue + " will be transferred one time.";
							recurringStatementOnce.html(frequencyStatement);
						} 

						else if (isDateValid){
							startValue = parseDate(dateStart.val());
							endValue = parseDate(dateEnd.val());

							var selectedRadio = getSelectedRadio(frequencyField);				
							frequencyType = selectedRadio.attr('data-frequency');
							frequencyValue =	selectedRadio.val();
							var hasValidFrequency = false;

							switch (frequencyValue) {
								case '1' :
								frequencyStatement = amountValue + " will be transferred " + frequencyType + " starting on " + startValue['thisDay'] + ", " + startValue['value'] + " and on every day thereafter";
								hasValidFrequency = true;
								break;
								case '2' :
								frequencyStatement = amountValue + " will be transferred " + frequencyType + " starting on " + startValue['thisDay'] + ", " + startValue['value'] + " and on every " + startValue['thisDay'] + " thereafter";
								hasValidFrequency = true;
								break;
								case '3' :
								frequencyStatement = amountValue + " will be transferred " + frequencyType + " starting on " + startValue['thisDay'] + ", " + startValue['value'] + " and on every other " + startValue['thisDay'] + " thereafter";
								hasValidFrequency = true;
								break;
								case '4':
								frequencyStatement = amountValue + " will be transferred " + frequencyType + " starting on " + startValue['thisDay'] + ", " + startValue['value'];
								hasValidFrequency = true;
								break;
								default:
								frequencyStatement = "";
								break;
							} 

							if (noEndDate.is(':checked')) {
								frequencyStatement += ".";
							} else {
								frequencyStatement += " until " + endValue['value'] + ".";
							}

							if (hasValidFrequency) {
								recurringStatementOnce.addClass('inactive');
								recurringStatement.removeClass('inactive');
								recurringStatement.html(frequencyStatement);
							}
						} else { //if date is invalid
							recurringStatementOnce.addClass('inactive');
							recurringStatement.addClass('inactive');
						} 
					} else { //if amount is invalid
						recurringStatementOnce.addClass('inactive');
						recurringStatement.addClass('inactive');
					}
				}

				// event listeners that trigger textToDisplay to update
				amountField.on('blur', function() {
					textToDisplay();
				});

				recurrenceField.on('change', function() {
					textToDisplay();
				});

				frequencyField.on('change', function(){
					textToDisplay();
				});

				dateStart.on('change', function() {
					textToDisplay();
				});

				dateEnd.on('change', function() {
					textToDisplay();
				});

				noEndDate.on('change', function() {
					textToDisplay();
				});
			}
		}

		/**
		*
		* Used to control dynamic name editing within Reserve
		*
		* @method EditNameInline
		* @namespace Hudson.Widget
		* @param {Object} e The event object.
		* @return {none}
		*/

		HW.EditNameInline = new function() {

			/**
			* Assigns listeners to controls on page, contains all core functionality.
			*
			* @method init
			* @namespace Hudson.Widget.EditNameInline
			* @param {object} node jQuery object representing the particular input node
			* @return {none}
			*/
			this.init = function(node) {
				var parent = node;
				var viewState = node.find('[data-widget-property=view-state]');
				var viewField = viewState.find('[data-widget-property=view-field]');
				var editState = node.find('[data-widget-property=edit-state]');
				var editField = editState.find('[data-widget-property=edit-field]');
				var editBtn = node.find('[data-widget-role=edit-btn]');
				var saveBtn = node.find('[data-widget-role=save-btn]');
				var cancelBtn = node.find('[data-widget-role=cancel-btn]');

				function showEditState() {
					editField.val(viewField.text());
					viewState.fadeOut(0);
					editState.fadeIn(300);
				}

				function showViewState() {
					editState.fadeOut(0);
					viewState.fadeIn(300);
				}

				editBtn.on('click', showEditState);
				cancelBtn.on('click', showViewState);

				saveBtn.on('click', function() {
					Hudson.Async.ajaxCall($(this), parent, '/Master/lib/ajax/true_result.json', callBackFunction);
				});

				function callBackFunction(result) {
					if (result) {
						showViewState();
					}
				}
			}
		}

		/**
		*
		* Used to enable and disable the 'end date' field in those cases where
		* a user can elect to continue an action indefinitely, as in scheduled balance
		* alerts.
		*
		* @method ToggleField
		* @namespace Hudson.Widget
		* @param {Object} e The event object.
		* @return {none}
		*/
		HW.ToggleField = new function() {

			/**
			* Attached to 'change' of the end date checkbox, contains all widget functionality.
			*
			* @method init
			* @namespace Hudson.Widget.EditNameInline
			* @param {Object} e The event object.
			* @return {none}
			*/
			this.change = function() {
				var me = $(this);
				var myName = me.attr('data-widget-name');
				var fieldToChange = $('input[data-widget-property=date-input][data-widget-name=' + myName + ']');
				var isChecked = me.prop('checked');
				var label = fieldToChange.siblings("label")
				var labelText = label.find('span');

				if (isChecked) {
					fieldToChange.addClass("inactive").attr("disabled","disabled").val("");
					label.addClass("inactive")
					labelText.text(labelText.attr('data-text'));
				} else {
					fieldToChange.removeClass("inactive").removeAttr("disabled").val("");
					fieldToChange.siblings("label").removeClass("inactive");
				}
			}
		}

		/**
		*
		* Allows an entire module, like the subaccount module on springboard, to
		* inherit the click link behavior of one link contained within.
		*
		* @method enhanceLink
		* @namespace Hudson.Widget
		* @param {Object} node The node being enhanced.
		* @return {none}
		*/
		HW.enhanceLink = function(node) {
			var destinationURI;
			var me = node;
			var destinationLinkNode = me.find('a[data-widget-role=link-target]');
			if (destinationLinkNode.length > 0) {
				destinationURI = destinationLinkNode.attr('href');
				if (destinationURI.length > 0) {
					$(me).on('click',function() {
						window.open(destinationURI, '_blank');
					});
				}
			}
		}

		/**
		*
		* A specific widget for the pended doc upload flow that controls the front-end
		* behavior of adding a file.
		*
		* @method AddAnotherFile
		* @namespace Hudson.Widget
		* @param {Object} e The event object
		* @return {none}
		*/
		HW.AddAnotherFile = new function() {
			var AAF = this;

			/**
			* Contains all core widget behavior.
			*
			* @method init
			* @namespace Hudson.Widget.AddAnotherFile
			* @param {Object} node The add another file node.
			* @return {none}
			*/
			AAF.init = function(node) {
				var name = node.attr('data-widget-name');

				var fileTable = $('[data-widget-role=fileTable][data-widget-name=' + name + ']');
				var fileUploadBox = $('[data-widget-role=addBox][data-widget-name=' + name + ']');
				var addFileButton = node.find('input[type=button]');

				addFileButton.on('click', function(e) {

					node.remove();
					fileTable.addClass("has-add-another");
					fileUploadBox.removeClass('inactive');
				});
			}
		}

		/**
		*
		* A specific widget for the pended doc upload flow that controls the front-end
		* behavior of selecting a file and showing that selection as a filename without path.
		*
		* @method FileUpload
		* @namespace Hudson.Widget
		* @param {Object} e The event object
		* @return {none}
		*/
		HW.FileUpload = new function() {
			var FU = this;
			/**
			* A test based on Modernizr (https://github.com/Modernizr/Modernizr/blob/master/feature-detects/forms/fileinput.js)
			* to determine if a browser supports file upload
			*
			* @method init
			* @namespace Hudson.Widget.FileUpload
			* @param {Object} node The file upload node itself.
			* @return {none}
			*/
			FU.test = function(){
				if(navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
					return false;
				}
				var elem = document.createElement('input');
				elem.type = 'file';
				return !elem.disabled;
			},
			/**
			* Contains all core widget behavior.
			*
			* @method init
			* @namespace Hudson.Widget.FileUpload
			* @param {Object} node The file upload node itself.
			* @return {none}
			*/
			FU.init = function(node) {
				if(FU.test()){
					var name = node.attr('data-widget-name');
					var fileUploadButton = node;
					var fileUploadInput = $('[data-widget-role=fileUploadTarget][data-widget-name=' + name + ']');
					var fileReset = $('[data-widget-role=fileReset][data-widget-name=' + name + ']');
					var fileName = $(fileUploadInput).siblings('.item');
					var fileSubmitButton = $('[data-widget-role="fileSubmit"]');
					$('.no-file-upload-support').css('display', 'none');
					$('.yes-file-upload-support').css('display', 'block');
					if (fileUploadInput.length > 0) {
						node.on('click', function(e){
							fileUploadInput.click();
						});

						fileUploadInput.on('change', function(e) {
							var path = fileUploadInput[0].value
							var name = path.split('\\').pop();

							fileName.html(name);
							fileUploadInput.addClass('destroy');
							fileUploadButton.addClass('destroy');
							fileReset.removeClass("inactive");
							if (path){
								fileSubmitButton.prop("disabled", false);
							}else{
								fileSubmitButton.prop("disabled", true);
							}
						})

						fileReset.on('click', function(e) {
							var newFileNode = "<input type='file' class = 'fileUpload' data-widget-role='fileUploadTarget' data-widget-name = 'file-upload' />";
							fileUploadInput.remove();
							$(newFileNode).insertAfter(fileUploadButton);
							fileUploadButton.removeClass('destroy');
							fileReset.addClass("inactive");
							fileSubmitButton.prop("disabled", true);
							fileName.html('');

							node.unbind();
							fileUploadInput.unbind();
							fileReset.unbind();
							Hudson.Widget.FileUpload.init(fileUploadButton);

						});
					}
				}  /* end FU.test conditional */
			}
		}
		/**
		*
		* Allows adding more email fields to the 'refer a friend' page.
		*
		* @method ReferEmails
		* @namespace Hudson.Widget
		* @param {Object} e The event object
		* @return {none}
		*/
		HW.ReferEmails = new function() {
			var RE = this;

			/**
			* Contains all core widget behavior.
			*
			* @method init
			* @namespace Hudson.Widget.FileUpload
			* @param {Object} node The file upload node itself.
			* @return {none}
			*/
			RE.init = function(node) {
				var currentTotal;
				var maxEmails = 12;
				var tabIndex = 4;
				var me = node;
				var add_btn = me.find('[data-widget-type=add-link]');
				var add_parent = add_btn.closest('.help-link');
				var newEntry = "<div><input type = 'text' placeholder = 'Email (Optional)' aria-required = 'true' tabindex = '3'/><div class = 'contextual-error' role = 'alert' aria-live = 'polite'>[Error State]</div></div>"

				add_btn.on('click', function(e) {
					var added = 0;
					var insert, insertionPoint;
					e.preventDefault();
					currentTotal = countNodes(me);
					console.log(currentTotal);
					if (currentTotal < maxEmails) {
						while (added != 3) {
							insert = (added === 0) ? "data-role = 'insert'" : "";
							newEntry = $("<div><input type = 'text'" + insert + "placeholder = 'Email (Optional)' aria-required = 'true' tabindex = '" + tabIndex + "'/><div class = 'contextual-error' role = 'alert' aria-live = 'polite'>[Error State]</div></div>");
							newEntry.insertBefore(add_parent);
							add_btn.attr('tabindex', tabIndex+1);
							tabIndex++;
							added++;
						}

						$('button').attr('tabindex', parseInt($('button').attr('tabindex')) + 3);
						insertionPoint = $('[data-role=insert]').filter(':last');
						insertionPoint.focus();
						$('html, body').animate({
							scrollTop: insertionPoint.offset().top-40
						}, 300);
					} else {
						add_btn.remove();
					}
				});
			}
			/* AJAX CALL TO SET 'DISMISSED' PROPERTY GOES HERE */
			function countNodes(parent) {
				var count = parent.find('input').length;
				return count;
			}

		}

		HW.replaceLinkWithConfirm = new function() {
			this.resend = function(){
				/* replace this with ajax fucntion that calls HW.EmailResend.confirm() at finish */
				setTimeout(function(){HW.replaceLinkWithConfirm.confirm()},1000);

			},
			this.confirm = function(){;
				var replace = $('.email-resend-link');
				var confirmMsg =  $('.email-resend-link').attr('data-confirm-msg');
				replace.fadeOut('fast', function(){
					replace.html(confirmMsg);
					replace.fadeIn('fast');
				});
			}
		},



		/**
		* This class handles input fields that have been prefilled by values from the Serve backend,
		* like a billing address on a linked credit card.
		*
		*
		* @class clearPrefill
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		HW.ClearPrefill = new function() {

			/**
			* On init, write the original value to a data attribute
			*
			* @method init
			* @namespace Hudson.Widget
			* @param {object} n A jquery object representing the original input node
			* @return {none}
			*/
			this.init = function(n) {
				n.attr('data-starting-value', n.val());
			}


			/**
			* On keyup, if the new value does not match the original, clear the prefill class
			* and unbind this handler.
			*
			* @method keyup
			* @namespace Hudson.Widget
			* @param {object} e The event object
			* @return {none}
			*/
			this.keyup = function() {
				var me = $(this);
				var startingVal = me.attr('data-starting-value');
				if (typeof startingVal !== undefined && startingVal != '' ) {
					if (me.val() != startingVal) {
						me.removeClass('prefill');
						me.off('keyup', me.keyup);
					}
				}
			}
		}

		HW.PageView = new function(){

			var PV = this;
			var isActive = false;

			PV.init = function(node){
				var me = node;
				var nodeName = me.attr("data-widget-name");
				PV.refresh(false)
			}

			PV.change = function(e){
				var me = $(this);
				var nodeName = me.attr("data-widget-name");
				PV.refresh(true);
			}

			PV.refresh = function(animate){

				var activeName = $("*[data-widget-type=page-view-control]:checked").attr("data-widget-name");
				if(animate){
					$("*[data-widget-type=page-view]").fadeOut(300).css("overflow","visible");
					setTimeout(function(){
						$("*[data-widget-type=page-view][data-widget-name="+activeName+"]").fadeIn(300).css("overflow","visible");
					},300);

				}else{
					$("*[data-widget-type=page-view]").hide(0).css("overflow","visible");
					$("*[data-widget-type=page-view][data-widget-name="+activeName+"]").show(0).css("overflow","visible");
				}

			}

		}

		HW.LoadMore = new function(){
			var LM = this;
			var PROTO_CONTENTS = "<a href='#'><div class = 'search-result saved'><div class = 'search-result-content'><div class = 'payee-name has-caret'>Loaded Result</div></div></div></a>";


			LM.click = function(e){
				e.preventDefault();
				var me = $(this);
				var container = me.closest("*[data-widget-type=load-more-container]");
				me.find(".payee-name").addClass("inline-loading");
				setTimeout(function(){ LM.LoadComplete(me,container); },2500);
			}

			LM.LoadComplete = function(node, container){
				node.find(".payee-name").removeClass("inline-loading");
				for(var i=0; i<5; i++)
					node.before($(PROTO_CONTENTS));
			}


		}

		HW.DeletePayee = new function(){
			var DP = this;

			DP.init = function(me){
				me.find("*[data-property-action=delete]").click(DP.click)
			}

			DP.click = function(e){
				var me = $(this);
				var container = me.closest("*[data-widget-type=delete-payee-container]");
				$('.global-notice.processing').fadeIn(300);
				$('.global-overlay').fadeIn(300);

				//setimeout for prototype
				setTimeout(function(){ DP.DeleteComplete( container ) }, 2500);
			}

			DP.DeleteComplete = function(node){
				$('.global-notice.processing').fadeOut(300);
				$('.global-overlay').fadeOut(300);
				setTimeout(function(){
					node.find("*[data-widget-type=module-message-overlay]").fadeIn(300);
					node.find("*[data-widget-type=module-message-alert]").fadeIn(300);
				}, 500 );

				//refresh the page to reorder
				setTimeout(function(){ window.location.href = "index.php?key=flow-bill-pay&screen=my-payees-empty"; }, 2500);
			}
		}

		/**
		* Handled the showing and hiding behavior of the overlay
		*
		*
		*
		* @class ProcessingOverlay
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		HW.ProcessingOverlay = new function(){

			var PO = this;
			var me = null;
			var overlay = null;
			var processing = null;

			PO.init = function(n){
				me = n;
				overlay = n.find('.global-overlay');
				processing = n.find('.global-notice.processing');
				$("body").css("position","relative");
			}

			PO.show = function(showSpinner, callback){
				if(showSpinner === undefined) showSpinner = true;
				overlay.fadeTo(300, .5, function(){
					if(callback) callback.call();
				});
				if(showSpinner) processing.fadeIn(300);
				if(HW.BackToTop)
					HW.BackToTop.forceHidden(true);
			}

			PO.hide = function(callback){
				overlay.fadeOut(300, function(){
					if(callback) callback.call();
					if(HW.BackToTop)
						HW.BackToTop.forceHidden(false);
				});
				processing.fadeOut(300);
			}

			PO.fullscreen = function(bool){
				if(bool === undefined) bool = true;

				if(bool){
					me.closest("#page-content").css("position", "");
					if(processing.attr("data-pos-top") === undefined){
						processing.css("top", 30);
					}else{
						processing.attr("data-pos-top", 30);
						processing.attr("data-pos-type", "static");
					}
				}else{
					$("body").css("position","");
					me.closest("#page-content").css("position", "relative");
					if(processing.attr("data-pos-top") === undefined){
						processing.css("top", 30);
					}else{
						processing.css({"margin-top":0,"top":0});
						processing.attr("data-pos-top", 30);
						processing.attr("data-pos-type", "static");
					}
				}

			}

		}

		HW.LoadMoreTransaction = new function(){
			var LM = this;
			var PROTO_CONTENTS = "";


			LM.click = function(e){
				PROTO_CONTENTS = $(this).prev().clone().wrap('<p>').parent().html() //populate
				e.preventDefault();
				var me = $(this);
				var container = me.closest("*[data-widget-type=load-more-container]");
				me.find(".payee-name").addClass("inline-loading");
				setTimeout(function(){ LM.LoadComplete(me,container); },2500);
			}

			LM.LoadComplete = function(node, container){

				node.find(".payee-name").removeClass("inline-loading");
				for(var i=0; i<5; i++)
					node.before($(PROTO_CONTENTS));
			}


		}

		HW.PrintForm = new function(){
			var PF = this;
			var me;

			PF.init = function(node){

				me = node;
				//add ACTUAL buttons
				me.find('.cover').each(function(i){
					if (i === 0){
						$(this).append( '<img class="radio-deselected" src="Images/dd/radio-selected.png" width="30" alt="">' )
						.next().on('click', function(){
							//that item is selected

							$(this).prev().html('<img class="radio-selected" src="Images/dd/radio-selected.png" width="30" alt="">');
							$('.cover').not( $(this).prev() ).html('<img class="radio-deselected" src="Images/dd/radio-deselected.png" width="30" alt="">');
						});
					} else {
						$(this).append( '<img class="radio-deselected" src="Images/dd/radio-deselected.png" width="30" alt="">' )
						.next().on('click', function(){
							//that item is selected

							$(this).prev().html('<img class="radio-selected" src="Images/dd/radio-selected.png" width="30" alt="">');
							$('.cover').not( $(this).prev() ).html('<img class="radio-deselected" src="Images/dd/radio-deselected.png" width="30" alt="">');
						});
					}

				});
				//print button
				me.find('.dd-print-btn').on('click', function(e){
					e.preventDefault();
					window.print();

				});
			}
		}

		HW.ResponsiveImage = new function(){

			var RI = this;
			var img;
			var srcPoints = {};

			this.init = function(node){
				img = node;
				var breakpoints = node.attr("data-property-breakpoints").split(",");
				var src = node.attr("data-property-src").split(",");
				for(var i=0; i<breakpoints.length; i++)
					srcPoints[breakpoints[i]] = src[i];

				$(window).on('orientationchange orientationEvent resize', RI.updateSize);
			}

			this.updateSize = function(){
				var curr = $("html").attr("data-current-breakpoint");
				if( srcPoints.hasOwnProperty(curr) && srcPoints[curr] != img.attr("src") ){
					console.log("found");
					img.attr("src", srcPoints[curr]);
				}
			}

		}

		HW.BarChart = new function(){

			var BC = this;

			this.init = function(node){
				var max = parseFloat(node.attr("data-property-max"));
				var val = parseFloat(node.attr("data-property-value"));
				var bar = node.find("*[data-widget-property=bar-fill]");
				var per = Math.min( Math.max( 0, val/max ), 1 );
				bar.css("width", ""+parseInt(per*100)+"%");
				if(per >= 1) bar.addClass("full");
				if(node.find("*[data-widget-property=min-amount]").length==1 && node.find("*[data-widget-property=max-amount]").length==1){
					if(val>0) node.find("*[data-widget-property=min-amount]").html("&nbsp;");
					if(per === 1) node.find("*[data-widget-property=max-amount]").html("&nbsp;");
				}
			}

		}

		HW.DismissableNotification = new function() {
			var D = this;
			var title;
			var topParent;
			var directParent;

			D.init = function(node) {
				var me = node;
				topParent = me.closest(".container");
				directParent = me.parent();
				title = topParent.prev(".container.section-title-group");
				var close_btn = me.find('.close-btn');
				close_btn.on('click', function() {
					me.slideUp( 400, function(){ $(this).remove(); });
					if(directParent.children().length==1){
						title.animate({"height":0,opacity:0},400);
						topParent.animate({"height":0,opacity:0},400);
					}
					//ajaxCall()
				});
			}

			/* AJAX CALL TO SET 'DISMISSED' PROPERTY GOES HERE */
			function callBack() {
				//ajaxCall('as');
			}
		}

		/* TODO: Added by BSD and may be redundant - dedupe? remove? */

		/**
		* Controls the behaviors of action prompts, which are dynamic confirmation checks.  Action prompts
		* perform like modal windows on the old mobile site, allowing the user to confirm or cancel and action
		* before submitting it.
		*
		* This widget is used, for instance, on some types of pending transactions, and on the funding source
		* page to delete funding sources.
		*
		* @class ActionPrompt2
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		// HW.ActionPrompt2 = new function() {

			/**
			* Initializes the widget, defining the node to expand and behavior for the cancel button within the prompt
			*
			* @method init
			* @namespace Hudson.Widget.ActionPrompt2
			* @param {object} n The action prompt node
			* @return {none}
			*/

			// this.init = function(n) {
			// 	var me = n;
			// 	var thisWidget = me.attr('data-widget-name');
			// 	var sectionToExpand = $('*[data-widget-type=action-prompt-target][data-widget-name='+thisWidget+']');
			// 	var cancelBtn = sectionToExpand.find("*[data-widget-action=cancel]").filter(function(){ return sectionToExpand[0] === $(this).closest("*[data-widget-type=action-prompt-target]")[0] });
			// 	var thisTransitionType = (me.attr('data-transition-type') != undefined) ? me.attr('data-transition-type') : 'toggle';

			// 	if (thisTransitionType === 'fadeoutfadein') {
			// 		cancelBtn.on('click', function() {
			// 			var originalSection = me.closest('[data-widget-property=replaced-by-prompt]');

			// 			if(originalSection.length === 0){
			// 				originalSection = me.closest('*[data-widget-type=inline-actionable]').find('*[data-widget-property=replaced-by-prompt]');
			// 			}

			// 			me.removeClass('prompt-revealed');

			// 			sectionToExpand.fadeOut(300, function() {
			// 				originalSection.fadeIn(300);
			// 			});
			// 		})
			// 	} else {
			// 		cancelBtn.on('click', function() {
			// 			$('*[data-widget-type=action-prompt][data-widget-name='+thisWidget+']').removeClass('prompt-revealed');

			// 			if (sectionToExpand.length > 0) {
			// 				sectionToExpand.fadeOut(300, function() {
			// 					$(this).removeClass('active');
			// 				});
			// 			};
			// 		})
			// 	}
			// }

			/**
			* Defines the expand behavior of the action prompt.
			*
			* @method reveal
			* @namespace Hudson.Widget.ActionPrompt2
			* @param {object} e The event object
			* @return {none}
			*/

		// 	this.reveal = function(e) {
		// 		var replacementTarget;
		// 		var me = $(this);
		// 		var thisWidget = me.attr('data-widget-name');
		// 		var thisTransitionType = (me.attr('data-transition-type') != undefined) ? me.attr('data-transition-type') : 'toggle';
		// 		var sectionToExpand = $('[data-widget-type=action-prompt-target][data-widget-name='+ thisWidget +']');
		// 		var parent = me.closest('.funding-source-inner');
		// 		var openSection = me.closest('*[data-widget-type=inline-actionable]').find('[data-widget-type=action-prompt-target].active');

		// 		if (me.hasClass('prompt-revealed')) {
		// 			me.removeClass('prompt-revealed');
		// 		} else {
		// 			me.addClass('prompt-revealed');
		// 		}

		// 		if (thisTransitionType === 'fadeoutfadein') {
		// 			var replacementTarget = me.closest('*[data-widget-type=inline-actionable]').find('*[data-widget-property=replaced-by-prompt]');

		// 			replacementTarget.fadeOut(300, function() {
		// 				sectionToExpand.fadeIn(300);
		// 			});
		// 		} else {
		// 			if (openSection.length > 0) {
		// 				var currentOpenSectionName = openSection.attr('data-widget-name');
		// 				var sectionToExpandName = sectionToExpand.attr('data-widget-name');

		// 				$('[data-widget-type=action-prompt][data-widget-name=' + currentOpenSectionName + ']').removeClass('prompt-revealed');
		// 				openSection.fadeOut(300, function() {
		// 					sectionToExpand.fadeIn(300, function() {
		// 							$(this).addClass('active');
		// 							$('[data-widget-type=action-prompt][data-widget-name=' + sectionToExpandName + ']').addClass('prompt-revealed');
		// 							$(this).css("overflow","");
		// 						});

		// 					$(this).removeClass('active');
		// 				});
		// 			} else {
		// 				sectionToExpand.fadeIn(300, function() {
		// 					$(this).addClass('active');
		// 					$(this).css("overflow","");
		// 				});
		// 			}
		// 		}
		// 	}
		// }

		/* TODO: Added by BSD and may be redundant - dedupe? remove? */

		/**
		* Controls the behaviors of action prompts, which are dynamic confirmation checks.  Action prompts
		* perform like modal windows on the old mobile site, allowing the user to confirm or cancel and action
		* before submitting it.
		*
		* This widget is used, for instance, on some types of pending transactions, and on the funding source
		* page to delete funding sources.
		*
		* @class ActionPrompt2
		* @namespace Hudson.Widget
		* @constructor {function}
		*/
		// HW.MpActionPrompt2 = new function() {

			/**
			* Initializes the widget, defining the node to expand and behavior for the cancel button within the prompt
			*
			* @method init
			* @namespace Hudson.Widget.ActionPrompt2
			* @param {object} n The action prompt node
			* @return {none}
			*/
			// this.init = function(n) {
			// 	var me = n;
			// 	var thisWidget = me.attr('data-widget-name');
			// 	var sectionToExpand = $('*[data-widget-type=mp-action-prompt-target][data-widget-name='+thisWidget+']');
			// 	cancelBtn = sectionToExpand.find("*[data-widget-action=cancel]").filter(function(){ return sectionToExpand[0] === $(this).closest("*[data-widget-type=mp-action-prompt-target]")[0] });
			// 	var thisTransitionType = (me.attr('data-transition-type') != undefined) ? me.attr('data-transition-type') : 'toggle';

			// 	if (thisTransitionType === 'fadeoutfadein') {
			// 		cancelBtn.on('click', function() {
			// 			originalSection = me.closest('[data-widget-property=replaced-by-prompt]');
			// 			if(originalSection.length === 0){
			// 				originalSection = me.closest('*[data-widget-type=inline-actionable]').find('*[data-widget-property=replaced-by-prompt]');
			// 			}
			// 			me.removeClass('prompt-revealed');

			// 			sectionToExpand.fadeOut(300, function() {
			// 				originalSection.fadeIn(300);
			// 				cancelBtn.closest('[data-widget-type="enable-disable-phone-container"]').removeClass('changing');
			// 			});
			// 		})
			// 	} else {
			// 		cancelBtn.on('click', function() {
			// 			$('*[data-widget-type=mp-action-prompt][data-widget-name='+thisWidget+']').removeClass('prompt-revealed');
			// 			if (sectionToExpand.length > 0) {

			// 				$(this).closest(".payee-container").animate({backgroundColor: 'transparent'}, 300);
			// 				$(this).closest(".payee-container").siblings(".ruleset.with-or").fadeTo(300, 1);

			// 				sectionToExpand.fadeOut(
			// 					300,
			// 					function() {
			// 						$(this).removeClass('active');
			// 						cancelBtn.closest('[data-widget-type="enable-disable-phone-container"]').removeClass('changing');
			// 					}
			// 					);
			// 			};
			// 		})


			// 	}
			// }

			/**
			* Defines the expand behavior of the action prompt.
			*
			* @method reveal
			* @namespace Hudson.Widget.ActionPrompt2
			* @param {object} e The event object
			* @return {none}
			*/



			// this.reveal = function(e) {
			// 	var replacementTarget;
			// 	var me = $(this);
			// 	var thisWidget = me.attr('data-widget-name');
			// 	var thisTransitionType = (me.attr('data-transition-type') != undefined) ? me.attr('data-transition-type') : 'toggle';
			// 	var sectionToExpand = $('[data-widget-type=mp-action-prompt-target][data-widget-name='+thisWidget+']');
			// 	var parent = me.closest('.funding-source-inner');
			// 	//var openSection = me.closest('.grey-box').find('[data-widget-type=mp-action-prompt-target].active');
			// 	var openSection = me.closest('.payee-container').find('[data-widget-type=mp-action-prompt-target].active');
			// 	var parentPayee = me.closest(".payee-container");

			// 	me.closest('[data-widget-type=enable-disable-phone-container]').addClass('changing');

			// 	if (me.hasClass('prompt-revealed')) {
			// 		me.removeClass('prompt-revealed');
			// 	} else {
			// 		me.addClass('prompt-revealed');
			// 	}

			// 	if(openSection.hasClass('sms-opt-in') && openSection.find('#AgreeCommunicationsDisclosure').length && !openSection.find('#AgreeCommunicationsDisclosure').prop('checked') ){
			// 		openSection.find('#AgreeCommunicationsDisclosure').addClass('error').end().find('.inline-error').removeClass('hidden');
			// 		return false;
			// 	}else {
			// 		$('#AgreeCommunicationsDisclosure').removeClass('error');
			// 		openSection.find('.inline-error').addClass('hidden').end().find('.inline-processing').show();

			// 	}
			// 	if (thisTransitionType === 'fadeoutfadein') {
			// 		replacementTarget = me.closest('*[data-widget-type=inline-actionable]').find('*[data-widget-property=replaced-by-prompt]');
			// 		replacementTarget.fadeOut(300, function() {
			// 			sectionToExpand.fadeIn(300);
			// 		});
			// 	} else {
			// 		if (openSection.length > 0) {
			// 			var currentOpenSectionName = openSection.attr('data-widget-name');
			// 			var sectionToExpandName = sectionToExpand.attr('data-widget-name');

			// 			$('[data-widget-type=mp-action-prompt][data-widget-name=' + currentOpenSectionName + ']').removeClass('prompt-revealed');
			// 			openSection.fadeOut(
			// 				300,
			// 				function() {

			// 					sectionToExpand.fadeIn(
			// 						300,
			// 						function() {
			// 							$(this).addClass('active');
			// 							$('[data-widget-type=mp-action-prompt][data-widget-name=' + sectionToExpandName + ']').addClass('prompt-revealed');
			// 							$(this).css("overflow","");
			// 						}
			// 						);
			// 					$(this).removeClass('active');
			// 				}
			// 				);
			// 		} else {

			// 			parentPayee.animate({backgroundColor: '#F6F6F6'}, 300);
			// 			parentPayee.next(".ruleset.with-or").fadeTo(300, .01);
			// 			parentPayee.prev(".ruleset.with-or").fadeTo(300, .01);
			// 			sectionToExpand.fadeIn(
			// 				300,
			// 				function() {
			// 					$(this).addClass('active');
			// 					$(this).css("overflow","");
			// 				}
			// 				);
			// 		}
			// 	}
			// }
		// }
	}


	//test if baseline phone and detect modern phones
	var baselineSupportTest = function(){
		var UA = window.navigator.userAgent,
		androidRe = /(Android 4)/,
		iOSRe = /(iPhone|iPad)/;

		if (UA.match(androidRe) && window.FileReader){
			$('html').addClass('android-modern');
		}else if (UA.match(iOSRe) && window.FileReader){
			$('html').addClass('ios-modern');
		}

		if (isBaselinePhone()){
			$('html').addClass('baseline');
		}
	}

	//second level detection (rules out modern devices, and treats everythign else as baseline)
	var isBaselinePhone = function(){
		var boolIsBaselinePhone = false;
		var currentBreakpoint = $('html').attr('data-current-breakpoint');
		if (["medium","small"].indexOf(currentBreakpoint) !== -1){
			if (!$('html').hasClass('android-modern') && !$('html').hasClass('ios-modern')){
				if ($('html').hasClass('notouch') && currentBreakpoint === 'small'){
					//blackberry and windows phone
					boolIsBaselinePhone = true;
				}else if ($('html').hasClass('touch')){
					//android 2.x
					boolIsBaselinePhone = true;
				}
			}
		}
		return boolIsBaselinePhone;
	}



	$(document).ready(function() {
		Hudson.Widget.init();
		Hudson.Window.init();
		Hudson.Menu.init();
	});


})(jQuery);