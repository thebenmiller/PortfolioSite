(function($){

  /**
  * Utility functions for determining certain types of devices
  */

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

  /**
  * The "Hudson" object is used to namespace all of the code defined on the Serve site.  Although technically a class, it's role is purely for namespacing.
  *
  * @class Hudson
  * @constructor function
  */

  var Hudson = {};

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
      }
    }
  }

  $(document).ready(function(){
    Hudson.Window.init();
    Hudson.Menu.init();
  });

})(jQuery);
