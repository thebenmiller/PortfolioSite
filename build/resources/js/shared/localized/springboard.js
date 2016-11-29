(function($){

    /**
    * The "Springboard" object is used to namespace all of the code defined as part of the responsive Springboard project.
    *
    * @class Springboard
    * @constructor function
    */    
    var Springboard={};


    /* Springboard.Window contains methods and properties related to the viewport and content resizing around changes in viewport size
    *
    * @class Window
    * @namespace Springboard
    * @constructor function
    */
    Springboard.Window=new function () {
        var W=this;
        var fixies=[".back-to-top", ".processing-overlay .global-notice.processing"] ;

        /**
        * A simple test to see if this is a touch device.  Necessary to change the menu system
        * at the large breakpoint
        *    
        * @method testTouch
        * @namespace Hudson.Window    
        * @return {none} 
        */        
        W.testTouch=function() {            
            return !!('ontouchstart' in window) || !!('onmsgesturechange' in window) || (navigator.appVersion.toLowerCase().indexOf("mobile") != -1);
        };


        /**
        * A test to see if a fixed positioned element is being positioned correctly vertically.
        *    
        * @method testFixed
        * @namespace Hudson.Window    
        * @return Boolean
        */    
        W.testFixed=function() {
            
            //insert new elment, check position, remove element

            var fixed=true;
            var el=$("<div id='a1'>").css({'position':'fixed','width':1,'height':1,'top':'50%'});
            $("body").append(el);
            //different browsers handle sub pixel positioning differently, this solves for rounding issues
            if( el.offset().top >= $(window).height()/2-1 && el.offset().top <= $(window).height()/2+1 ) fixed=true;
                else fixed=false;
            el.remove();
            //force artificial fixed for mobile browsers
            //Springboard.Window.testFixedResult(fixed && !Springboard.Window.testTouch());
            Springboard.Window.testFixedResult(!W.isBaselinePhone());
            
        }

        //test if baseline phone and detect modern phones
        W.baselineSupportTest = function(){
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
        };

        //second level detection (rules out modern devices, and treats everythign else as baseline)
        W.isBaselinePhone = function(){
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
        };

        W.updateFixedResult=function(){
            $.each(fixies, function(i,el){
                var el=$(el);
                fixies[i]=el;
                el.removeAttr('style');
                el.removeAttr('data-pos-top');
                el.removeAttr('data-pos-type');
                var hidden=! el.is(":visible");
                if(hidden) el.toggle(0);
                el.css({"position":"absolute"});
                var percent=parseFloat(el.css("top"))/el.offsetParent().height();
                el.offsetParent().height("+=2");
                if( percent == parseFloat(el.css("top")) / el.offsetParent().height() ){
                    el.attr("data-pos-top", percent);
                    el.attr("data-pos-type", "percent")
                }else{
                    el.attr("data-pos-top", parseFloat(el.css("top")));
                    el.attr("data-pos-type", "static");
                    el.css("margin-top", parseFloat(el.css("top")));
                }
                el.offsetParent().height("");
                el.css("top", 0);
                if(hidden) el.toggle(0);
            });
            fixies=$(fixies);
            Springboard.Window.enableScrollHandlers(true, fixies);

        }

        W.testFixedResult=function(fixed){
            if(fixed) return;
            //Had to use element specific code, the global check breaks in ie9 mobile
            $.each(fixies, function(i,el){
                var el=$(el);
                fixies[i]=el;
                var hidden=! el.is(":visible");
                if(hidden) el.toggle(0);
                el.css({"position":"absolute"});
                var percent=parseFloat(el.css("top"))/el.offsetParent().height();
                el.offsetParent().height("+=2");
                if( percent == parseFloat(el.css("top")) / el.offsetParent().height() ){
                    el.attr("data-pos-top", percent);
                    el.attr("data-pos-type", "percent")
                }else{
                    el.attr("data-pos-top", parseFloat(el.css("top")));
                    el.attr("data-pos-type", "static");
                    el.css("margin-top", parseFloat(el.css("top")));
                }
                el.offsetParent().height("");
                el.css("top", 0);
                if(hidden) el.toggle(0);
            });
            fixies=$(fixies);
            Springboard.Window.enableScrollHandlers(true, fixies);
        }


        /**
        * Enable / Disable scroll handlers for position fixed fix
        *    
        * @method enableScrollHandlers
        * @namespace Hudson.Window    
        * @return {none} 
        */    
        W.enableScrollHandlers=function(bool, el) {
            if(bool){
                $(window).scroll(function(){W.scrollHandler(el)});
                $(window).bind( 'orientationchange', function(e){ W.orientationHandler(el) });
            }else{
                $(window).unbind('scroll');
            }
        }


        /**
        * Handlers for browsers not supporting fixed positioning
        *    
        * @method scrollHandler
        * @namespace Hudson.Window    
        * @return {none} 
        */    
        W.scrollHandler=function (el) {
            el.each(function(){
                var element=$(this);
                if(element.is(":visible") && !!element.attr("data-pos-type")){
                    if(element.attr("data-pos-type") == "percent"){
                        element.css("margin-top", parseFloat(element.attr("data-pos-top")) * $(window).height() + $(window).scrollTop() );
                    } else {
                        element.css("margin-top", parseFloat(element.attr("data-pos-top")) / 2 + $(window).scrollTop() );
                    }
                }
            })
        }

        W.orientationHandler=function(el){
            $.each(fixies, function(i,el){
                var el=$(el);
                fixies[i]=el;
                var hidden=! el.is(":visible");
                if(hidden) el.toggle(0);
                el.css({"position":"absolute"});
                if(parseFloat(el.css("top"))!=0){
                    var percent=parseFloat(el.css("top"))/el.offsetParent().height();
                    el.offsetParent().height("+=2");
                    if( percent == parseFloat(el.css("top")) / el.offsetParent().height() ){
                        el.attr("data-pos-top", percent);
                        el.attr("data-pos-type", "percent")
                    }else{
                        el.attr("data-pos-top", parseFloat(el.css("top")));
                        el.attr("data-pos-type", "static");
                        el.css("margin-top", parseFloat(el.css("top")));
                    }
                    el.offsetParent().height("");
                    el.css("top", 0);
                    if(hidden) el.toggle(0);
                }
            })
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
    Springboard.Widget=new function () {
        var SW=this;

        /**
        * Initializes all of the widget and progressive enhancement items.  
        *
        * @method init
        * @namespace Hudson.Widget
        * @param {none}
        * @return {none} 
        */            
        SW.init=function() {


            Springboard.Window.testFixed();

            $('*[data-widget-type]').each(function() {    
                var subConstructor;
                var me=$(this);            
                var type=me.attr('data-widget-type');
                switch (type) {                    
                    case 'transaction-drawer-prompt': 
                        me.on('click', Springboard.Transaction.Drawers.open);
                        break;
                    case 'action-prompt-target' :
                        //action-prompt-target is an attribute used in Responsive
                        //so do this additional test so we don't break functionality in that track
                        //TO DO - assign unique attr name to just the Eames action drawers
                        if (me.closest('.transaction').length > 0) {
                            Springboard.Transaction.init(me);
                        }
                        break;            
                    case 'module-message':
                        subConstructor=SW.ModuleMessage;
                        Springboard.Widget.ProcessingOverlay.init(me);
                        me.on('click', subConstructor.reveal);
                        break;    
                    case 'confirm-modifier':
                        subConstructor=SW.ConfirmModifier;
                        me.on('click', subConstructor.populate);
                        break;    
                    case 'transaction-summary':
                        SW.enhanceTransactionDetailLink(me);
                        break;
                    case 'back-to-top':
                        subConstructor = Springboard.BackToTop;
                        subConstructor.init(me);
                        me.on('click', subConstructor.clickHandler);
                        break;
                    case 'date-filter':
                        subConstructor = Springboard.Async.DateFilter;
                        subConstructor.init(me);
                        break;
                    case 'load-more':
                        subConstructor = Springboard.Async.LoadMore;
                        subConstructor.init(me);
                        break;
                    case 'processing-overlay':
                        subConstructor = SW.ProcessingOverlay;
                        subConstructor.init(me);
                    case 'interstitial-message':
                        subConstructor = SW.InterstitialMessage;
                        me.on('click', subConstructor.reveal);
                        break;
                    case 'transaction-detail-submit':
                        subConstructor = SW.TransactionDetailActions;
                        me.on('click', subConstructor.submitForm);
                        break;
                    case 'load-more':
                        subConstructor=Springboard.Async.LoadMore;
                        subConstructor.init(me);
                        break;
                }
            });

            //are we using a link only to trigger javascript? remove all native events
            $('a[href="#"]').click(function(event){event.preventDefault();});

            Date.prototype.toMMDDYYYYString=function () {return isNaN (this) ? 'NaN' : [this.getMonth() > 8 ? this.getMonth() + 1 : '0' +  (this.getMonth() + 1), this.getDate() > 9 ? this.getDate() : '0' + this.getDate(),  this.getFullYear()].join('/')}
            Date.prototype.toYYYYMMDDString=function () {return isNaN (this) ? 'NaN' : [this.getFullYear(), this.getMonth() > 8 ? this.getMonth() + 1 : '0' +  (this.getMonth() + 1), this.getDate() > 9 ? this.getDate() : '0' + this.getDate()].join('-')}

        }


        /**
        */
        //SW.enhanceTransactionDetailLink=function(node) {
        //    var destinationURI;
        //    var me=node;
        //    var nodeToLink=me.find('.transaction-inner');
        //    var destinationLinkNode=me.find('a.detail-link');
        //    if (nodeToLink.length > 0 && destinationLinkNode.length > 0) {
        //        destinationURI=destinationLinkNode.attr('href');            
        //        if (destinationURI.length > 0) {
        //            $(nodeToLink).addClass('full-link');
        //            $(nodeToLink).on('click',function() {
        //                window.location=destinationURI;
        //            });
        //        }
        //    }
        //}

        SW.enhanceTransactionDetailLink = function (node) {
            var destinationURI;
            var me = node;
            var nodeToLink = me.find('.transaction-inner');
            var destinationLinkNode = me.find('a.detail-link');
            if (nodeToLink.length > 0 && destinationLinkNode.length > 0) {
                destinationURI = destinationLinkNode.attr('href');
                if (destinationURI.length > 0) {
                    $(nodeToLink).addClass('full-link');
                    $(nodeToLink).on('click', function (event) {
                        var me = $(this);

                        var limitClass = event.srcElement.className;
                        if (limitClass != "learnlimit") {

                            var parentTransactionNode = me.closest('[data-transaction-id]');
                            Springboard.Async.TransactionDetailRequest(Springboard.Transaction.Router, parentTransactionNode);
                        }
                    });
                }
            }

        }

        SW.InterstitialMessage = new function () {

            /**
            * Defines the show behavior of the action prompt.
            * The module is set on a timeout, so only the first interaction by the user is required
            *
            * @method reveal
            * @namespace Hudson.Widget.InterstitialMessage
            * @param {object} e The event object
            * @return {none} 
            */
            this.reveal = function (e) {
                var me = $(this);
                var parentTransactionNode = me.closest('[data-transaction-id]');
                Springboard.Async.TransactionDetailRequest(Springboard.Transaction.Router, parentTransactionNode);
            }
        }
        /**
        * Controls module level messages for things like processing bubbles.
        * This also handles the global overla and processing bubble event, module level changes, and a page refresh
        *
        * /TODO/ clean this up into a few different events that trigger one another instead of one cluster
        *
        * This widget is used, for instance, on some types of pending transactions, and on the funding source
        * page to delete funding sources.
        *
        * @class ModuleMessage
        * @namespace Hudson.Widget
        * @constructor {function}
        */    
        SW.ModuleMessage=new function() {    

            /**
            * Defines the show behavior of the action prompt.
            * The module is set on a timeout, so only the first interaction by the user is required
            *
            * @method reveal
            * @namespace Hudson.Widget.ModuleMessage
            * @param {object} e The event object
            * @return {none} 
            */    
            this.reveal=function(e, noGlobal) {

                var me=$(this);

                var parentTransactionNode=me.closest('[data-transaction-id]');
                
                //container=me.closest('*[data-widget-type=module-message-container]');
                var container=me.closest('[data-transaction-id]');

                //am I a notification?  If not, then show the global processing spinner
                var showGlobalProcess=container.closest('.notification').length == 0 ? true : false;

                //global notification
                if(showGlobalProcess){
                    SW.ProcessingOverlay.show();
                    Springboard.Async.TransactionRequest(Springboard.Transaction.Router, parentTransactionNode);
                }else{
                    Springboard.Async.NotificationRequest(Springboard.Transaction.Router, parentTransactionNode);
                }

            }
        }

        /**
        * Handled the showing and hiding behavior of the overlay
        * 
        *
        *
        * @class ProcessingOverlay
        * @namespace Springboard.Widget
        * @constructor {function}
        */        
        SW.ProcessingOverlay=new function(){

            var PO=this;
            var me=null;
            var overlay=null;
            var processing=null;

            PO.init=function(n){
                me=n;
                overlay=n.find('.global-overlay');
                processing=n.find('.global-notice.processing');
                $("body").css("position","relative");
            }

            PO.show=function(showSpinner, callback){
                if(showSpinner === undefined) showSpinner=true;
                overlay.fadeTo(300, .5, function(){  
                        Springboard.Window.scrollHandler(processing);
                        if(callback) callback.call();
                    });
                if(showSpinner) processing.fadeIn(300);
                Springboard.BackToTop.forceHidden(true);
            }

            PO.hide=function(callback){
                overlay.fadeOut(300, function(){ 
                    if(callback) callback.call(); 
                    Springboard.BackToTop.forceHidden(false);
                });
                processing.fadeOut(300);
            }

            PO.fullscreen=function(bool){
                if(bool === undefined) bool=true;

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

    }

    Springboard.Transaction=new function() {
        var ST=this;    
        
        /**
        * Initializes the widget, defining the node to expand and behavior for the cancel button within the prompt
        *
        * @method init
        * @namespace Hudson.Widget.ActionPrompt
        * @param {object} n The action prompt node
        * @return {none} 
        */    
        ST.init=function(n) {
            var me=n;
            var thisWidget=me.attr('data-widget-name');
            var container=me.closest(".container");
            var sectionToExpand=container.find('[data-widget-type=action-prompt-target][data-widget-name='+thisWidget+']');
            var cancelBtn=$(sectionToExpand).find('*[data-widget-action=cancel]');
            var thisTransitionType=(me.attr('data-transition-type') != undefined) ? me.attr('data-transition-type') : 'toggle';
            //var container=sectionToExpand.closest(".container");
            var changeLink=container.find('.adjust-link');

            cancelBtn.on('click', function() {
                var scrollto=(container.offset().top < $(window).scrollTop() ? container.offset().top : $(window).scrollTop());
                //console.log(changeLink);        
                var originalSection=me.closest('.container').find('[data-widget-property=replaced-by-prompt]');    
                sectionToExpand.fadeOut(
                    300, 
                    function() {
                        originalSection.fadeIn(
                            300,
                            function() {
                                $(this).addClass('active');    
                            }
                        );
                        $(this).removeClass('active');
                    }
                );

                /* toggle the adjust link */
                container.find('.prompt-revealed').removeClass('prompt-revealed');
                changeLink.removeClass('adjust-active').addClass('adjust-inactive');

                $('html, body').animate({
                    scrollTop: scrollto
                },200);
            })
        }    


        ST.Drawers=new function() {
            var D=this;
            var outDelay=300;
            var inDelay=300;

            D.closeOne=function(containerNode) {
                containerNode.find('.prompt-box.active').fadeOut(this.outDelay);
                $('html, body').animate({
                    scrollTop: (containerNode.offset().top < $(window).scrollTop() ? container.offset().top : $(window).scrollTop())
                },200);
            }    

            D.restoreToOriginalState=function(containerNode) {
                var drawerToOpen, originalDrawer;

                drawerToOpen=containerNode.find('[data-widget-property=replaced-by-prompt]');
                originalDrawer=containerNode.find('.prompt-box.active');

                originalDrawer.fadeOut(
                    outDelay, 
                    function() {
                        drawerToOpen.fadeIn(
                            inDelay,
                            function() {
                                drawerToOpen.addClass('active');
                            }
                        );
                        originalDrawer.removeClass('active');
                    }
                )

            }

            D.open=function(e, jQueryNodeObj) {
                var drawerToOpen, originalDrawer, activeDrawer;
                var me=(jQueryNodeObj !== undefined) ? jQueryNodeObj : $(this);
                var parentTransactionNode=me.closest('[data-transaction-id]');
                var transactionID=parentTransactionNode.attr('data-transaction-id');
                var drawerName=me.attr('data-widget-name'); 
                var container=$('[data-transaction-id="' + transactionID + '"]');
                var outDelay=this.outDelay;
                var inDelay=this.inDelay;

                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                if (me.hasClass('prompt-revealed')) {
                    drawerToOpen=parentTransactionNode.find('[data-widget-property=replaced-by-prompt]');
                    originalDrawer=parentTransactionNode.find('[data-widget-type=action-prompt-target][data-widget-name="' + drawerName + '"]');                
                    me.removeClass('prompt-revealed')
                } else {
                    drawerToOpen=parentTransactionNode.find('[data-widget-type=action-prompt-target][data-widget-name="' + drawerName + '"]');
                    activeDrawer=parentTransactionNode.find('.active.prompt-box');                        
                    if (activeDrawer.length > 0) { 
                        originalDrawer=activeDrawer;
                    } else {
                        originalDrawer=parentTransactionNode.find('[data-widget-property=replaced-by-prompt]');                    
                        outDelay=0;
                    }
                    me.addClass('prompt-revealed')
                }

                originalDrawer.fadeOut(
                    outDelay, 
                    function() {
                        drawerToOpen.fadeIn(
                            inDelay,
                            function() {
                                drawerToOpen.addClass('active');
                            }
                        );
                        originalDrawer.removeClass('active');
                    }
                )
            }  
            
        };

        ST.Router=function(parentTransactionNode, status, msg, route, destinationDrawer, isGlobalNotice) {
            var message=parentTransactionNode.find('[data-widget-type=module-message-alert]');
            var overlay=parentTransactionNode.find('*[data-widget-type=module-message-overlay]');
            var messageSuccessDelayNewLoad=3300;
            var interstitialDrawer;
            var newClass;

            Springboard.Widget.ProcessingOverlay.hide();

            /* CAN BE M SUMMARY.  SHOULD ROUTE TO NEW PAGE*/
            if (status == 'pass' || status == 'decline' ) {                
                if (status == 'pass') {
                    newClass='complete-dynamic';
                    parentTransactionNode.find('[data-widget-property=expiration-date]').addClass('inactive');
                } else if (status == 'decline') {
                    newClass='declined-trans';
                    parentTransactionNode.find('[data-widget-property=expiration-date]').html('Declined');
                }

                /*change the parent transaction node state to show new */
                parentTransactionNode.addClass(newClass);
                /* isGlobalNotice == true for modules.  It == false for springboard notifications (like resend email) */
                if (isGlobalNotice) {
                    overlay.delay(600).fadeTo(300, .7).delay(3500).fadeOut(300);
                    message.addClass('global-notice').removeClass('global-error').delay(600).fadeIn(300).delay(2500).fadeOut(300);
                } else {
                    overlay.fadeTo(300, .7).delay(2500).fadeOut(300);
                    message.addClass('global-notice').removeClass('global-error').fadeIn(300).delay(2500).fadeOut(300);
                }

                /* update the message text to reflect pass or fail */
                message.find('[data-widget-property=message-body]').html(msg);

                /* close the action drawer */
                this.Drawers.closeOne(parentTransactionNode);

                /* hide change link */                        
                parentTransactionNode.find('[data-widget-property=change-prompt]').fadeTo(500, 0);

                if(status!="decline")
                    parentTransactionNode.find('.trans-label').fadeTo(500, 0);

                /* route to new page */
                if (route !== false) {
                    window.setTimeout(
                        function(){
                            window.location=route;
                        }
                        , messageSuccessDelayNewLoad
                    );
                }
            } 

            /* module level error */
            else if (status == 'fail') {        
                message.removeAttr('class').addClass('global-error message transaction active');
                message.find('[data-widget-property=message-body]').html(msg);
                this.Drawers.restoreToOriginalState(parentTransactionNode);
            }

            /* field-specific error */
            else if (status == 'fail-inline') {        
                /* get the bad field from the fake results */
                var badField=parentTransactionNode.find('[name="' + fakeResponse.fieldActive + '"]');

                /* modify it */
                badField.addClass('error');
                badField.siblings('.contextual-error').addClass('active');
            }

            /* this condition is for things like add funding source and insufficient funds */
            else if (status == 'interstitial') {
                /* find the interstitial drawer, update it's text, and open it */
                interstitialDrawer=parentTransactionNode.find('[data-widget-type=action-prompt-target][data-widget-name=drawer-interstitial]');
                interstitialDrawer.find('[data-widget-property=message-body]').html(msg);                
                Springboard.Transaction.Drawers.open(false, interstitialDrawer);

                /* change link to detail page so that it routes to a version with an open drawer */
                /* this behavior might be achieved differently in production */
                
                /*
                moduleLink=parentTransactionNode.find("a[data-detail-link]");
                moduleLinkURI=moduleLink.attr('href');                 
                moduleLink.attr('href', moduleLinkURI + "&drawer=" + destinationDrawer);
                */

                /* pass the message contents */
                /* this behavior will definitely be achieved differently in production 
                if (interstitialDrawer.attr('data-msg-to-pass')) {
                    moduleLinkURI=moduleLink.attr('href');                 
                    moduleLink.attr('href', moduleLinkURI + "&message=" + interstitialDrawer.attr('data-msg-to-pass'));
                }
                */
            }
        }
    }


    /**
    * Contains UI elements that control Asynchronous event flows
    * This includes Filters and Load More
    *
    * @class Async
    * @namespace Springboard
    * @constructor function
    */

    Springboard.Async=new function(){
        
        var SA=this;
        var loadingMoreProcessing=false;
        var loadMoreEnabled=true;
        var completedTransactionsLoaded=20;
        var applyingFiltersProcessing=false;

        var PROTO_delay=2500;

        SA.init=function(){

        }


        SA.LoadMoreRequest=function(callback){
            setTimeout(callback, PROTO_delay);
        }

        //date filter request
        //fromFilter and toFilter are html dom objects
        SA.FilterRequest=function(callback, fromFilter, toFilter){
            setTimeout(callback, PROTO_delay);
        }

        //right now the only notification request is send email
        //parentTransactionNode is the notification section jquery element
        SA.NotificationRequest=function(callback, parentTransactionNode){
            //console.log(parentTransactionNode)
            callback.call(Springboard.Transaction, parentTransactionNode, fakeResponse.status, fakeResponse.message, fakeResponse.route, fakeResponse.destinationDrawer, false );
        }

        //this currently handles all drawer based transaction requests
        //parentTransactionNode is the transaction summary container jquery element
        SA.TransactionRequest=function(callback, parentTransactionNode){
            //currentTransactionDrawer is the currently active (open) drawer
            var currentTransactionDrawer=parentTransactionNode.find('.prompt-box.active');
            setTimeout(function(){ callback.call(Springboard.Transaction, parentTransactionNode, fakeResponse.status, fakeResponse.message, fakeResponse.route, fakeResponse.destinationDrawer, true) }, PROTO_delay );
        }

        SA.TransactionDetailRequest = function (callback, parentTransactionNode, actionSource) {
            var currentForm = parentTransactionNode.find('[data-widget-name=transaction-detail] form');
            SA.SendRequest(parentTransactionNode, currentForm, actionSource);
        }

        SA.SendRequest = function (parentTransactionNode, currentForm, actionSource) {
            if ($(currentForm).valid()) {
                $('input', currentForm).each(function () {
                    if (this.id.length > 0) {
                        $(this).attr("name", this.id);

                        if ($(this).attr("id") === "ActionSource" && actionSource !== undefined) {
                            $(this).val(actionSource)
                        }
                        else if ($(this).attr("id") === "Message") {
                            $(this).val(parentTransactionNode.find('textarea[value!=""]#Message').val());
                        }

                    }
                });
                currentForm.submit();
            }
        }

        /**
        * Controls the Date Filter UI elements and events
        * 
        *
        * @class DateFilter
        * @namespace Springboard.Async
        * @constructor function
        */

        SA.DateFilter=new function(){

            var DF=this;
            DF.SA=SA;
            var me;
            var dateInputs=[];
            var useDefaultPicker=true;
            var filtersApplied=false;
            var filterValues=["",""];
            var pickerHasFocus=null;
            var closeFiltersOnComplete;
            var hasErrors=0;

            DF.init=function(n){
                me=n;
                useDefaultPicker=DF.getDateCapabilities();
                closeFiltersOnComplete=true;
                dateInputs=me.find('[data-widget-property=date-input]');
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
                            dateInputs[i].type="date";
                        }catch(e){
                            // ie has a time changing the type
                        }
                    }
                }
                DF.attachHandlers();


                //clean this up some
                $("[data-widget-property=input-container]").each(function () {
                    var $this=$(this).find("input");
                    var placeholder=$(this).find("label");
                    placeholder.find("span").attr("data-text", placeholder.find("span").text());
                    inputVal=$.trim($this.val());
                    if (inputVal) {
                        placeholder.hide()
                    };
                     $this.focus(function () {
                         if(pickerHasFocus == $this[0]) return;
                         pickerHasFocus=$this[0];
                        if (!$.trim($this.val())) {
                            placeholder.find("span").text("");
                        }
                        if(!useDefaultPicker){
                            var maxmin=($this[0] == dateInputs[0] ? "maxDate" : "minDate");
                            var todate=null;
                            if(maxmin=="maxDate")
                                todate=($.trim(dateInputs[1].value) && dateInputs[1].value < $.datepicker.formatDate('mm/dd/yyyy', new Date())) ? dateInputs[1].value : 0
                            else
                                todate=$.trim(dateInputs[0].value) ? dateInputs[0].value : null;
                            $this.datepicker( "option", maxmin, todate );
                        }
                    });
                    $this.blur(function () {
                        var datepickerOpen=!!$.datepicker._lastInput && $.datepicker._lastInput == $this[0];
                        if(!datepickerOpen) pickerHasFocus=null;
                        setTimeout(DF.placeholderHandler, 200, $this, placeholder)
                    })
                })

            }

            DF.getDateCapabilities=function(){
                return Springboard.Window.testTouch();
            }

            DF.attachHandlers=function(){
                dateInputs.keyup(DF.keyHandler);
                me.find('[data-widget-property=filter-open]').click(DF.openFilters);
                me.find('[data-widget-property=filter-close]').click(DF.closeFilters);
                me.find('[data-widget-property=filter-apply]').click(DF.applyFilters);
                me.find('[data-widget-property=filter-reset]').click(DF.resetFilters);
                me.find('[data-widget-property=filter-clear]').click(DF.clearFilters);

            }

            DF.keyHandler=function(event){
                if (event.keyCode == 13) DF.dateValidate();
            }

            DF.openFilters=function(){
                closeFiltersOnComplete=true;
                if(filterValues[0] && useDefaultPicker) dateInputs[0].value=( filterValues[0] );
                if(filterValues[1] && useDefaultPicker) dateInputs[1].value=( filterValues[1] ) ;
                DF.placeholderHandler($(dateInputs[0]), $(dateInputs[0]).closest("[data-widget-property=input-container]").find("label"));
                DF.placeholderHandler($(dateInputs[1]), $(dateInputs[1]).closest("[data-widget-property=input-container]").find("label"));
                $("[data-widget-property=date-filter-closed]").fadeOut(300, function(){ $("[data-widget-property=date-filter-open]").fadeIn(300).css("display","inline-block"); })
                $("[data-widget-property=filter-result-count]").fadeOut(300);
            }

            DF.closeFilters=function(){
                pickerHasFocus=null;
                if(filtersApplied) $("[data-widget-property=filter-text]").text( new Date( filterValues[0]+"T12:00" ).toMMDDYYYYString() +" - "+ new Date( filterValues[1]+"T12:00" ).toMMDDYYYYString() );
                else $("[data-widget-property=filter-text]").text("Filter By Date");
                $("[data-widget-property=date-filter-open]").fadeOut(300, function(){
                    $("[data-widget-property=date-filter-closed]").fadeIn(300);
                    if(filtersApplied) $("[data-widget-property=filter-result-count]").fadeIn(300);
                })
            }

            DF.applyFilters=function(){
                //style date filters on small date bar instead of on filter save, keep native filter text the same
                if($(this).hasClass("disabled") || applyingFiltersProcessing) return;
            applyingFiltersProcessing=filtersApplied=true;
            DF.processFilters();
            filterValues=[ 
                dateInputs[0].value,
                dateInputs[1].value
                //new Date(dateInputs[0].value).toMMDDYYYYString(),
                //new Date(dateInputs[1].value).toMMDDYYYYString(),
                ];
            }

            DF.clearFilters=function(){
                $("[data-widget-property=input-container]").each(function () {
                    var $this=$(this).find("input");
                    var placeholder=$(this).find("label");
                    $this.val("");
                    placeholder.find("span").text(placeholder.find("span").attr("data-text"));
                })
                $("[data-widget-property=filter-result-count]").fadeOut(300);
                filtersApplied=false;
                filterValues=["",""];
                DF.processFilters();
                $("[data-widget-property=filter-text]").text("Filter By Date");

            }

            DF.resetFilters=function(){
                $("[data-widget-property=input-container]").each(function () {
                    var $this=$(this).find("input");
                    var placeholder=$(this).find("label");
                    $this.val("");
                    placeholder.find("span").text(placeholder.find("span").attr("data-text"));
                })
                if(filtersApplied){
                    closeFiltersOnComplete=false;
                    DF.processFilters();
                    filterValues=["",""];
                    filtersApplied=false;
                }
            }

            DF.placeholderHandler=function($this, $placeholder){
                var datepickerOpen=!!$.datepicker._lastInput && $.datepicker._lastInput == $this[0];
                DF.dateValidate();
                if (!$.trim($this.val())) {
                    if(!datepickerOpen && $this[0] != pickerHasFocus ){
                        $placeholder.find("span").text($placeholder.find("span").attr("data-text"));
                    }
                }else{
                    $placeholder.find("span").text("");
                }
            }

            DF.dateValidate=function(){
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
                            hasErrors=0;
                            DF.triggerError($(this), "Please enter a valid date")
                        }
                });
                if(isValid==2) $("[data-widget-property=filter-apply]").removeClass("disabled");
                else $("[data-widget-property=filter-apply]").addClass("disabled");
            }

            DF.processFilters=function(){
                loadMoreEnabled=false;
                Springboard.Widget.ProcessingOverlay.fullscreen(false);
                Springboard.Widget.ProcessingOverlay.show();
                SA.FilterRequest(DF.PROTO_changeItems, dateInputs[0], dateInputs[1]);
                
            }

            DF.applyFiltersComplete=function(){
                Springboard.Widget.ProcessingOverlay.hide(Springboard.Widget.ProcessingOverlay.fullscreen);
                if(filtersApplied) $("[data-widget-property=filter-result-count]").fadeIn(300);
                loadMoreEnabled=!filtersApplied;
                applyingFiltersProcessing=false;
                if(closeFiltersOnComplete)
                    DF.closeFilters();
            
            }

            DF.pickerCloseHandler=function(){
                var $this=$(this)
                var placeholder=$(this).closest("[data-widget-property=input-container]").find("label");
                setTimeout(DF.placeholderHandler, 200, $this, placeholder);
                if( this == dateInputs[0] && dateInputs[1].value == "" && this.value != "")
                    setTimeout(function(){$(dateInputs[1]).datepicker("show")},100);
            }

            DF.triggerError=function($this, errorText){
                $this.addClass("error");
                $this.parent().find(".contextual-error").text(errorText).show(0);
                $(".sb-filters .grid-row").addClass("error-state");
                hasErrors++;
            }

            DF.removeError=function($this){
                $this.removeClass("error");
                $this.parent().find(".contextual-error").hide(0);
                hasErrors--;
                if(hasErrors<0)
                    $(".sb-filters .grid-row").removeClass("error-state");
            }

            DF.PROTO_changeItems=function(filtersApplied){
                /*
                if(filtersApplied){
                    $(".active-container").html(activeTransactionsFiltered);
                    $(".sm-content-box.transaction-dt.related-trans").html(completedTransactionsFiltered);
                }else{
                    compeltedLoad=20;
                    $(".active-container").html(activeTransactionsFull);
                    $(".sm-content-box.transaction-dt.related-trans").html(completedTransactionsFull);
                }
                */
                DF.applyFiltersComplete();
            }

        }


        /**
        * Controls the Load More UI elements and events
        * 
        *
        * @class LoadMore
        * @namespace Springboard.Async
        * @constructor function
        */
        SA.LoadMore=new function(){
            var LM=this;
            LM.SA=SA;
            var me=null;

            LM.init=function(n){
                me=n;
                //PROTO CONDITIONAL
                if($(".sm-content-box.transaction-dt.related-trans").children().length>=20)
                    $(window).scroll(LM.scrollHandler);
            }

            LM.scrollHandler=function(){
                var scrollPos=$(window).scrollTop();
                if (scrollPos >= $(document).height() - $(window).height() - $('.footer').height()  && !loadingMoreProcessing && loadMoreEnabled) {
                    LM.doLoad();
                   }
            }

            LM.doLoad=function(){
                loadingMoreProcessing=true;
                $(me).fadeIn(300);
                $("[data-widget-property=load-more-text]").text("Loading Transactions " + (completedTransactionsLoaded+1) + " to " + (completedTransactionsLoaded+=30) );
                SA.LoadMoreRequest(LM.PROTO_addItems);
            }

            LM.PROTO_addItems=function(){
                var toPopulate;
                for(var i=0; i<15; i++) toPopulate += insertHTML;
                var populateWith=$(toPopulate);
                $(".sm-content-box.transaction-dt.related-trans").append(populateWith);
                LM.loadComplete();
            }

            LM.loadComplete=function(){
                $(me).fadeOut(300);
                loadingMoreProcessing=false;
            }

        }

    }


    /**
    * Implements all back to top actions, including buttton positioning and scroll events
    *
    * @class BackToTop
    * @namespace Springboard
    * @constructor function
    */

    Springboard.BackToTop=new function(){

        var SBT=this;
        var scrollTimeout=null;
        var timeoutDuration=2000;
        var disabled=false;

        SBT.init=function(){
            $(window).resize(SBT.resizeHandler);
            $(window).scroll(SBT.scrollHandler);

        }

        SBT.scrollHandler=function(){
            if(disabled) return;
            var scrollPos=$(window).scrollTop();
            if(scrollPos > $(".subnav").height()+$(".subnav").offset().top){
                   if( $(window).width() <= 896 ){
                       if(scrollTimeout) clearTimeout(scrollTimeout);
                       scrollTimeout=setTimeout(SBT.visibilityHandler,timeoutDuration);
                       $(".back-to-top").css({"display":"block", "opacity":1});
                   }else{
                       SBT.visibilityHandler(false);
                   }
               }else{
                   SBT.visibilityHandler(true);
               }
        }

        SBT.resizeHandler=function(){
            if( $(window).width() <= 896 ){
                if(scrollTimeout)
                       $(".back-to-top").css({"display":"block", "opacity":1});
                   else
                       $(".back-to-top").css({"display":"none"});
            }else{
                SBT.scrollHandler();
            }
        }

        SBT.visibilityHandler=function(hide){
            if(scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout=null;
            if(hide === undefined)
                hide=$(window).width() <= 896;
            if(hide)
                $(".back-to-top").fadeOut(300);
            else
                $(".back-to-top").css({"display":"block", "opacity":1});
        }

        SBT.forceHidden=function(hide){
            disabled=hide;
        }

        SBT.clickHandler=function(event){
            $('html, body').animate(
                { scrollTop:0 },
                200
            );
        }

    }

    $(document).ready(function() {
        if(!this["console"])this["console"]={log:function(){}};
        Springboard.Widget.init();        
    });

    $(window).resize(function(){
        Springboard.Window.updateFixedResult();
    })

})(jQuery);

