!(function($){

	var screenAnimations = {"screen1":{"in":{"el":{"css":{"display":"block"}}},"out":{"el":{"delay":600,"css":{"display":"none"}},"children":{".headline":{"animate":{"margin-left":"-100%","opacity":0}},".actions":{"animate":{"margin-left":"-100%","opacity":0}},".navigation":{"animate":{"opacity":0}}}}},"screen2":{"in":{"el":{"css":{"display":"block"},"animate":{"opacity":1}},"children":{".headline":{"css":{"margin-left":"100%","opacity":0},"delay":150,"animate":{"margin-left":"0","opacity":1}},".navigation":{"css":{"opacity":0},"delay":300,"animate":{"opacity":1}},".ww-card-shadow-default":{"duration":150,"css":{"opacity":0},"delay":150,"animate":{"opacity":1}},".ww-card":{"duration":400,"css":{"opacity":0},"delay":150,"animate":{"opacity":1}},".ww-shimmers":{"duration":550,"css":{"opacity":0},"delay":400,"animate":{"opacity":1}}}},"backin":{"el":{"css":{"display":"block"},"animate":{"opacity":1}},"children":{".headline":{"css":{"margin-left":"-100%","opacity":0},"delay":150,"animate":{"margin-left":"0","opacity":1}},".navigation":{"css":{"opacity":0},"delay":300,"animate":{"opacity":1}},".ww-card-shadow-default":{"duration":150,"css":{"opacity":0},"delay":150,"animate":{"opacity":1}},".ww-card":{"duration":400,"css":{"opacity":0},"delay":150,"animate":{"opacity":1}},".ww-shimmers":{"duration":550,"css":{"opacity":0},"delay":400,"animate":{"opacity":1}}}},"out":{"el":{"delay":600,"css":{"display":"none"}},"children":{".headline":{"animate":{"margin-left":"-100%","opacity":0}},".actions":{"animate":{"margin-left":"-100%","opacity":0}},".navigation":{"animate":{"opacity":0}},".ww-shimmers":{"animate":{"opacity":0}}}},"backout":{"el":{"delay":600,"css":{"display":"none"}},"children":{".headline":{"animate":{"margin-left":"100%","opacity":0}},".actions":{"animate":{"margin-left":"100%","opacity":0}},".navigation":{"animate":{"opacity":0}},".ww-shimmers":{"animate":{"opacity":0}}}}},"screen3":{"in":{"el":{"css":{"display":"block"},"animate":{"opacity":1}},"children":{".headline":{"css":{"margin-left":"100%","opacity":0},"delay":150,"animate":{"margin-left":"0","opacity":1}},".actions":{"css":{"margin-left":"100%","opacity":0},"delay":150,"animate":{"margin-left":"0%","opacity":1}},".navigation":{"css":{"opacity":0},"delay":300,"animate":{"opacity":1}},".ww-card-shadow-funding":{"duration":150,"css":{"opacity":0},"delay":400,"animate":{"opacity":1}},".ww-l-cash":{"duration":450,"css":{"opacity":0,"left":"75%"},"delay":400,"animate":{"opacity":1,"left":"50%"}},".ww-r-coin-1":{"duration":150,"css":{"opacity":0,"margin-top":"-10px"},"delay":750,"animate":{"opacity":1,"margin-top":0}},".ww-r-coin-2":{"duration":150,"css":{"opacity":0,"margin-top":"-20px"},"delay":650,"animate":{"opacity":1,"margin-top":0}}}},"out":{"el":{"delay":600,"css":{"display":"none"}},"children":{".headline":{"animate":{"margin-left":"-100%","opacity":0}},".actions":{"animate":{"margin-left":"-100%","opacity":0}},".navigation":{"animate":{"opacity":0}},".ww-l-cash":{"animate":{"opacity":0,"left":"75%"}},".ww-r-coin-1":{"animate":{"opacity":0}},".ww-r-coin-2":{"animate":{"opacity":0}},".ww-card-shadow-funding":{"animate":{"opacity":0}}}},"backin":{"el":{"css":{"display":"block"}},"children":{".headline":{"css":{"margin-left":"-100%","opacity":0},"delay":150,"animate":{"margin-left":"0","opacity":1}},".actions":{"css":{"margin-left":"-100%","opacity":0},"delay":150,"animate":{"margin-left":"0%","opacity":1}},".navigation":{"css":{"opacity":0},"delay":300,"animate":{"opacity":1}},".ww-card-shadow-funding":{"duration":150,"css":{"opacity":0},"delay":400,"animate":{"opacity":1}},".ww-l-cash":{"duration":450,"css":{"opacity":0,"left":"75%"},"delay":400,"animate":{"opacity":1,"left":"50%"}},".ww-r-coin-1":{"duration":150,"css":{"opacity":0,"margin-top":"-10px"},"delay":750,"animate":{"opacity":1,"margin-top":0}},".ww-r-coin-2":{"duration":150,"css":{"opacity":0,"margin-top":"-20px"},"delay":650,"animate":{"opacity":1,"margin-top":0}}}},"backout":{"el":{"delay":600,"css":{"display":"none"}},"children":{".headline":{"animate":{"margin-left":"100%","opacity":0}},".actions":{"animate":{"margin-left":"100%","opacity":0}},".navigation":{"animate":{"opacity":0}},".ww-l-cash":{"animate":{"opacity":0,"left":"75%"}},".ww-r-coin-1":{"animate":{"opacity":0}},".ww-r-coin-2":{"animate":{"opacity":0}},".ww-card-shadow-funding":{"animate":{"opacity":0}}}},"more":{"children":{".more-ways":{"css":{"display":"inline-block","opacity":0},"animate":{"opacity":1}}}},"less":{"children":{".more-ways":{"animate":{"opacity":0},"cssPost":{"display":"none"},"duration":150}}}},"screen4":{"in":{"el":{"css":{"display":"block"},"animate":{"opacity":1}},"children":{".headline":{"css":{"margin-left":"100%","opacity":0},"delay":150,"animate":{"margin-left":"0","opacity":1}},".actions":{"css":{"margin-left":"100%","opacity":0},"delay":150,"animate":{"margin-left":"0%","opacity":1}},".navigation":{"css":{"opacity":0},"delay":300,"animate":{"opacity":1}},".ww-card-shadow-default":{"duration":150,"css":{"opacity":0},"delay":400,"animate":{"opacity":1}},".ww-r-paycheck":{"duration":350,"css":{"width":0,"opacity":1},"delay":400,"animate":{"width":"156px"}},".ww-card":{"css":{"opacity":0},"delay":550,"cssPost":{"opacity":1}}}},"backin":{"el":{"css":{"display":"block"},"animate":{"opacity":1}},"children":{".headline":{"css":{"margin-left":"-100%","opacity":0},"delay":150,"animate":{"margin-left":"0","opacity":1}},".actions":{"css":{"margin-left":"-100%","opacity":0},"delay":150,"animate":{"margin-left":"0%","opacity":1}},".navigation":{"css":{"opacity":0},"delay":300,"animate":{"opacity":1}},".ww-card-shadow-default":{"duration":150,"css":{"opacity":0},"delay":400,"animate":{"opacity":1}},".ww-r-paycheck":{"duration":350,"css":{"width":0,"opacity":1},"delay":400,"animate":{"width":"156px"}},".ww-card":{"css":{"opacity":0},"delay":550,"cssPost":{"opacity":1}}}},"out":{"el":{"delay":600,"css":{"display":"none"}},"children":{".headline":{"animate":{"margin-left":"-100%","opacity":0}},".actions":{"animate":{"margin-left":"-100%","opacity":0}},".navigation":{"animate":{"opacity":0}},".ww-r-paycheck":{"animate":{"opacity":0}}}},"backout":{"el":{"delay":500,"css":{"display":""}},"children":{".headline":{"animate":{"margin-left":"100%","opacity":0}},".actions":{"animate":{"margin-left":"100%","opacity":0}},".navigation":{"animate":{"opacity":0}},".ww-r-paycheck":{"animate":{"opacity":0}}}}},"screen5":{"in":{"el":{"css":{"display":"block"}},"children":{".headline":{"css":{"margin-left":"100%","opacity":0},"delay":150,"animate":{"margin-left":"0","opacity":1}},".actions":{"css":{"margin-left":"100%"},"delay":150,"animate":{"margin-left":"0%"}},".navigation":{"css":{"opacity":0},"delay":300,"animate":{"opacity":1}},".ww-card-shadow-default":{"duration":150,"css":{"opacity":0},"delay":400,"animate":{"opacity":1}},".ww-r-cash":{"duration":350,"css":{"width":0,"opacity":1},"delay":400,"animate":{"width":"156px"}},".ww-card":{"css":{"opacity":0},"delay":550,"cssPost":{"opacity":1}}}},"backin":{"el":{"css":{"display":"block"}},"children":{".headline":{"css":{"margin-left":"-100%","opacity":0},"delay":150,"animate":{"margin-left":"0","opacity":1}},".actions":{"css":{"margin-left":"-100%","opacity":1},"delay":150,"animate":{"margin-left":"0%"}},".navigation":{"css":{"opacity":0},"delay":300,"animate":{"opacity":1}},".ww-card-shadow-default":{"duration":150,"css":{"opacity":0},"delay":400,"animate":{"opacity":1}},".ww-r-cash":{"duration":350,"css":{"width":0,"opacity":1},"delay":400,"animate":{"width":"156px"}},".ww-card":{"css":{"opacity":0},"delay":550,"cssPost":{"opacity":1}}}},"out":{"el":{"delay":600,"css":{"display":"none"}},"children":{".headline":{"animate":{"margin-left":"-100%","opacity":0}},".actions":{"animate":{"margin-left":"-100%"}},".navigation":{"animate":{"opacity":0}},".ww-r-cash":{"animate":{"opacity":"0"}}}},"backout":{"el":{"delay":500,"css":{"display":""}},"children":{".headline":{"animate":{"margin-left":"100%","opacity":0}},".actions":{"animate":{"margin-left":"100%","opacity":0}},".navigation":{"animate":{"opacity":0}},".ww-r-cash":{"animate":{"opacity":"0"}}}}},"screen6":{"in":{"el":{"css":{"display":"block"},"animate":{"opacity":1}},"children":{".headline":{"css":{"margin-left":"100%","opacity":0},"delay":150,"animate":{"margin-left":"0","opacity":1}},".actions":{"css":{"margin-left":"100%","opacity":0},"delay":150,"animate":{"margin-left":"0%","opacity":1}},".navigation":{"css":{"opacity":0},"delay":300,"animate":{"opacity":1}},".ww-alert":{"duration":350,"css":{"opacity":0,"margin-top":"20px","width":"128px","height":"116"},"delay":400,"animate":{"opacity":1,"margin-top":0,"width":"136px","height":"124"}},".ww-card":{"css":{"opacity":0},"delay":550,"cssPost":{"opacity":1}}}},"out":{"el":{"delay":600,"css":{"display":"none"}},"children":{".headline":{"animate":{"margin-left":"-100%","opacity":0}},".actions":{"animate":{"margin-left":"-100%","opacity":0}},".navigation":{"animate":{"opacity":0}},".ww-alert":{"animate":{"opacity":0}}}},"backout":{"el":{"delay":500,"css":{"display":""}},"children":{".headline":{"animate":{"margin-left":"100%","opacity":0}},".actions":{"animate":{"margin-left":"100%","opacity":0}},".navigation":{"animate":{"opacity":0}},".ww-alert":{"animate":{"opacity":0}}}},"backin":{"el":{"css":{"display":"block"}},"children":{".headline":{"css":{"margin-left":"-100%","opacity":0},"delay":150,"animate":{"margin-left":"0","opacity":1}},".actions":{"css":{"margin-left":"-100%","opacity":0},"delay":150,"animate":{"margin-left":"0%","opacity":1}},".navigation":{"css":{"opacity":0},"delay":300,"animate":{"opacity":1}},".ww-alert":{"duration":450,"css":{"opacity":0,"margin-top":"-20px"},"delay":400,"animate":{"opacity":1,"margin-top":0}}}}},"screen7":{"in":{"el":{"css":{"display":"block"},"animate":{"opacity":1}},"children":{".headline":{"css":{"margin-left":"100%","opacity":0},"delay":150,"animate":{"margin-left":"0","opacity":1}},".actions":{"css":{"margin-left":"100%","opacity":0},"delay":150,"animate":{"margin-left":"0%","opacity":1}},".navigation":{"css":{"opacity":0},"delay":300,"animate":{"opacity":1}},".ww-card-shadow-use":{"duration":150,"css":{"opacity":0},"delay":400,"animate":{"opacity":1}},".ww-receipt":{"duration":450,"css":{"opacity":0,"margin-left":"60px"},"delay":400,"animate":{"opacity":1,"margin-left":"34px"}},".ww-card":{"css":{"opacity":0},"delay":550,"cssPost":{"opacity":1}}}},"out":{"el":{"delay":600,"css":{"display":"none"}},"children":{".headline":{"animate":{"margin-left":"-100%","opacity":0}},".actions":{"delay":50,"animate":{"margin-left":"-100%","opacity":0}},".navigation":{"delay":100,"animate":{"opacity":0}}}},"backin":{"el":{"css":{"display":"block"},"animate":{"opacity":1}},"children":{".headline":{"css":{"margin-left":"-100%","opacity":0},"delay":150,"animate":{"margin-left":"0","opacity":1}},".actions":{"css":{"margin-left":"-100%","opacity":0},"delay":150,"animate":{"margin-left":"0%","opacity":1}},".navigation":{"css":{"opacity":0},"delay":300,"animate":{"opacity":1}},".ww-card-shadow-use":{"duration":150,"css":{"opacity":0},"delay":400,"animate":{"opacity":1}},".ww-receipt":{"duration":450,"css":{"opacity":0,"margin-left":"60px"},"delay":400,"animate":{"opacity":1,"margin-left":"34px"}},".ww-card":{"css":{"opacity":0},"delay":550,"cssPost":{"opacity":1}}}},"backout":{"el":{"delay":500,"css":{"display":""}},"children":{".headline":{"animate":{"margin-left":"100%","opacity":0}},".actions":{"delay":50,"animate":{"margin-left":"100%","opacity":0}},".navigation":{"delay":100,"animate":{"opacity":0}},".ww-receipt":{"animate":{"opacity":0}}}}}};

	var WW = function(){

		var me = null;
		var oldAndroid = null;
		var animation = null;
		var defaultDuration = 300;
		var URLs = ["/activate/", "welcome", "funding", "directdeposit", "cash", "alerts", "spending"];
		var titles = ["Activate Card", "Welcome", "Funding", "Direct Deposit", "Cash", "Alerts", "Spending"];
		var baseTitle = " | Serve from American Express";
		var lastState = null;

		var init = function(){
			me = $(".ww");

			//To use global animations object, change this to window.screenAnimations
			animation = screenAnimations;

			checkAndroidVersion();
			addInteractionHandlers();
			initHistory();
		};

		this.checkAndroidVersion = function(){
			if (window.navigator.userAgent.match(/Android/) &&
				! window.navigator.userAgent.match(/Android 4/) &&
				! window.FileReader ){
				oldAndroid = true;
			$("html").addClass("old-android");
		};

		this.addInteractionHandlers = function(){
			me.find( "[data-screen-action]" ).click(screenClickHandler);
			$("#activate").click(openOverlay);
			$("#LowBalanceAlert").on("change", balanceToggle);
			$("#DollarAmount").on("focus", balanceToggle);
		};

		this.initHistory = function(){
			History.Adapter.bind(window,'statechange', historyHandler);
			var State = History.getState();
			var found = false;
			for(var i=URLs.length; i>=0; i--){
				if(State.hash.indexOf(URLs[i]) != -1){
					if(i!=0){
						History.replaceState({screenCurr:0, screenAction:"", screenNext:1, screenAction:"in"}, "", URLs[0]);
					}
					openOverlay(null);
					found = true;
					break;
				}
			}
			if(found==false && State.url.indexOf(URLs[0]) != -1){
				openOverlay(null);
			}
		};

		this.openOverlay = function(event){
			if(event){
				event.preventDefault();
				History.pushState({ignore:true, screenCurr:0, screenAction:"", screenNext:1, screenAction:"in"}, "", URLs[0]);
			}
			if(!oldAndroid){
				$("body").addClass("ww-overlay");
				$("html").addClass("ww-overlay");
				me.fadeIn(300);
				setTimeout(function(){
					me.find(".inner").css({"opacity":0,"display":"block"}).animate({"opacity":1},300);
				}, 150);
			}else{
				$("html,body").animate({"scrollTop":0},0);
				me.show(0);
				me.find(".inner").show(0);
			}
		};

		this.closeOverlay = function(){
			me.find(".inner").fadeOut();
			setTimeout(function(){
				me.fadeOut(300, function(){
					$("body").removeClass("ww-overlay");
					$("html").removeClass("ww-overlay");
				});
			}, 150);
		};

		this.finish = function(){
			window.location.href="/Account/Dashboard/post-activate.html";
		}

		this.screenClickHandler = function(event){

			event.preventDefault();

			var $me = $(this);
			var action = $me.attr("data-screen-action");

			var $screen = $me.closest(".inline-screen");
			var screenNum = parseInt($screen.attr("data-screen"));

			switch(action){

				case "goto":
				stateHandler({screenCurr:screenNum, actionCurr:"out", screenNext:(parseInt($me.attr("data-screen-to"))), actionNext:"in"});
				break;

				case "next":
				stateHandler({screenCurr:screenNum, actionCurr:"out", screenNext:(screenNum+1), actionNext:"in"});
				break;

				case "back":
				History.back();
				break;

				case "funding-toggle":
				fundingToggleEvent(screenNum, $screen.find(".more-ways").is(":visible"));
				break;

				case "activate":
				processActivateCard();
				break;

				case "alerts":
				processAlerts();
				break;

				case "exit":
				closeOverlay();
				break;

				case "done":
				finish();
				break;
			}

		}

	};

	this.stateHandler = function(options){
		var _options = {
			screenCurr : null,
			screenNext : null,
			actionCurr : null,
			actionNext : null,
			ignore : false
		};
		$.extend(_options,options);
		History.pushState(_options, titles[_options.screenNext-1]+baseTitle, URLs[_options.screenNext-1]);
	};

	this.historyHandler = function(){
		var State = History.getState();
		if(State.data.ignore == undefined || State.data.ignore == false){
			if(State.data.screenCurr == undefined){
				//back on activate card screen, clear and reset
				History.replaceState({ignore:true},"","");
				closeOverlay();
			}else if(lastState != undefined && lastState.data.screenCurr == State.data.screenNext){
				//back
				screenHandler([lastState.data.screenCurr, "backin", lastState.data.screenNext, "backout"]);
			}else{
				//next & goto
				screenHandler([State.data.screenCurr, State.data.actionCurr, State.data.screenNext, State.data.actionNext]);
			}
		}
		lastState = State;
	};

	//accepts an array of screen, state pairs. might change to objects later
	this.screenHandler = function(screenStates){
		if(screenStates === undefined || screenStates.length === 0 || screenStates%2 === 1){
			return console.error("screenHandler needs an array of screens and state pairs");
		}
		var scrolled = me.scrollTop() > 0;
		var scrollDelay = (scrolled ? 75 : 0);
		var checkScroll = $.grep(screenStates,
			function(n,i){ return n=="in" || n=="out" || n=="back" || n=="backin" || n=="backout" });
		if(oldAndroid){
			$("html,body").animate({"scrollTop":0},0);
		}else if(scrolled && checkScroll.length>0){
			me.animate({"scrollTop" : 0}, 50);
		}
		setTimeout(function(){
			stepThroughAnimation(screenStates);
		}, scrollDelay );
	};

	this.stepThroughAnimation = function(screenStates){
		for(var i=0; i<screenStates.length; i+=2){
			animateScreen("screen"+screenStates[i], screenStates[i+1]);
		}
	};

	this.animateScreen = function(scr,state){
		console.log(scr);
		var $scr = me.find("."+scr);
		var stateObj = animation[scr][state];
		var hasProp = false;
		if(stateObj === undefined){
			console.warn("step.stateObj has an undefined state: screen: "+scr+"; state: "+state);
		}
		if(stateObj.hasOwnProperty("el")){
			queueAnimationProperties($scr,stateObj["el"]);
			hasProp = true;
		}
		if(stateObj.hasOwnProperty("children")){
			for(var item in stateObj["children"]){
				queueAnimationProperties($scr.find(item),stateObj["children"][item]);
			}
			hasProp = true;
		}
		if(!hasProp){
			console.warn("step.stateObj has no el or children");
		}
	};

	this.queueAnimationProperties = function($el, props){
		var val, found;
		var duration = props["duration"];
		if(duration===undefined){
			duration = defaultDuration;
		}
		for(var item in props){
			if(item === "duration"){
				continue;
			}
			found = false;
			val = props[item];
			if(item.indexOf("css") !== -1){
				$el.queue(function(){
					$(this).css(val);
					$(this).dequeue();
				});
				found = true;
			}else if(item.indexOf("delay") !== -1){
				$el.delay(val);
				found = true;
			}else if(item.indexOf("animate") !== -1){
				$el.animate(val, duration);
				found = true;
			}
			if(found === false){
				console.warn("queueAnimationProperties unknown property: "+item);
			}
		}
	};


	///////////////////////////////////////////
	//																			 //
	//  BEGIN SCREEN SPECIFIC FUNCTIONALITY  //
	//																			 //
	///////////////////////////////////////////


	this.balanceToggle = function(){
		var check = $("#LowBalanceAlert");
		var text = $("#DollarAmount");
		var placeholderFallback = text.siblings("label");

		if($(this).attr("id") == "DollarAmount"){
			if(!check.is(":checked")){
				check.trigger("click");
			}
		}else{
			if(check.is(":checked")){
				text.removeClass("inactive");
				text.val(text.attr('placeholder'));
				if(placeholderFallback.length){
					placeholderFallback.hide(0);
				}
			}else{
				text.addClass("inactive");
				if(text.val().length>0 || text.val() == "$"){
					text.attr('placeholder', text.val());
					if(placeholderFallback.length){
						placeholderFallback.text(text.val());
					}
				}else{
					text.attr('placeholder', '$25.00');
					if(placeholderFallback.length){
						placeholderFallback.text('$25.00');
					}
				}
				text.val('');
				if(placeholderFallback.length){
					placeholderFallback.show(0);
				}
			}
		}
	};

	this.fundingToggleEvent = function(screenNum, toggleClosed){
		var action = (toggleClosed ? "less" : "more" );
		screenHandler([screenNum, action]);
	};

	this.processActivateCard = function(){

		if($("#activate-card").validate().form()){
			me.find("#processing").fadeIn(300);
			setTimeout(processActivateComplete, 1000);
		}
	};

	this.processActivateComplete = function(){
		var activateScreen = $(".activate-screen");
		var screenNum = parseInt(activateScreen.attr("data-screen"));
		if(activateScreen.hasClass("subaccount-activate-screen")){
			window.location.href="/Account/Dashboard/subaccount-post-activate.html";
		}else if(activateScreen.hasClass("replacement-activate-screen")){
			window.location.href="/Account/Dashboard/L3.html";
		}else{
			me.find("#processing").fadeOut(300);
			setTimeout(function(){
			stateHandler({screenCurr:screenNum, actionCurr:"out", screenNext:(screenNum+1), actionNext:"in"});
			}, 400)
		}
	};

	this.processAlerts = function(){
		if( $("#balance-alerts").validate().form() ){
			me.find("#processing").fadeIn(300);

			/////////////////////////////////////////////////
			//																						 //
			//  THIS SHOULD BE REPLACED WITH AJAX CALL     //
			//  SETTIMEOUT IS ONLY TO SIMULATE PROCESSING  //
			//																						 //
			/////////////////////////////////////////////////

			setTimeout(processAlertsComplete, 1000);
		}
	};

	this.processAlertsComplete = function(){
		var alertsScreen = $(".alerts-screen");
		var screenNum = parseInt(alertsScreen.attr("data-screen"));
		me.find("#processing").fadeOut(300);

		/////////////////////////////////////////////////
		//																						 //
		//  THIS SHOULD BE REPLACED WITH AJAX CALL     //
		//  SETTIMEOUT IS ONLY TO SIMULATE PROCESSING  //
		//																						 //
		/////////////////////////////////////////////////

		setTimeout(function(){
			stateHandler({screenCurr:screenNum, actionCurr:"out", screenNext:(screenNum+1), actionNext:"in"});
		}, 400)
	};

	init();

}();

})(jQuery);