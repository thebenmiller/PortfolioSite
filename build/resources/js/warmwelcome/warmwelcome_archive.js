!function($){

	var ww;
	var ani = window.animations;
	var oldAndroid = false;
	var URLs = ["/activate/", "welcome", "funding", "directdeposit", "cash", "alerts", "spending"];
	var titles = ["Activate Card", "Welcome", "Funding", "Direct Deposit", "Cash", "Alerts", "Spending"];
	var baseTitle = " | Serve from American Express";

	//attach button click events to clickhandler
	var init = function(){
		ww = $(".ww");

		if (window.navigator.userAgent.match(/Android/) && ! window.navigator.userAgent.match(/Android 4/) && ! window.FileReader ){
		//if(true){
			oldAndroid = true;
			$("html").addClass("old-android");
			// var $meta = $("meta[name=viewport]");
			// $meta.attr("content",$meta.attr("content")+", maximum-scale=1.0, user-scalable=no");
		}

		ww.find( "[data-screen-action]" ).click(clickHandler);

		$("#activate").click(openWW);
		$("#LowBalanceAlert").on("change", balanceToggle);
		$("#DollarAmount").on("focus", balanceToggle);

		History.Adapter.bind(window,'statechange', historyHandler);
		var State = History.getState();
		for(var i=URLs.length; i>=0; i--){
			if(State.url.indexOf(URLs[i]) != -1){
				//historyHandler();

				if(i!=0){
					History.replaceState({screenCurr:0, screenAction:"", screenNext:1, screenAction:"in"}, "", URLs[0]);
				}
				openWW();
				break;
			}
		}
		// if(State.hash == URLs[0]){
		// 	History.replaceState({screenCurr:0, screenAction:"", screenNext:1, screenAction:"in"}, "", URLs[0]);
		// 	historyHandler();
		// }else{

		// }
	};

	var openWW = function(event){
		if(event){
			console.log(event);
			event.preventDefault();
			History.pushState({ignore:true, screenCurr:0, screenAction:"", screenNext:1, screenAction:"in"}, "", URLs[0]);
		}

		if(!oldAndroid){
			$("body").addClass("ww-overlay");
			$("html").addClass("ww-overlay");
			ww.fadeIn(300);
			setTimeout(function(){
				ww.find(".inner").css({"opacity":0,"display":"block"}).animate({"opacity":1},300);
			}, 150);
		}else{
			$("html,body").animate({"scrollTop":0},0);
			ww.show(0);
			ww.find(".inner").show(0);
		}

		// $(document).on('touchstart', function(e){
		// 	console.log("touch");
		// 	console.log(e.target);
		//   //e.preventDefault();
		// });
}

var closeWW = function(){
	ww.find(".inner").fadeOut();
	setTimeout(function(){
		ww.fadeOut(300, function(){
			$("body").removeClass("ww-overlay");
			$("html").removeClass("ww-overlay");
		});
	}, 150);
}

var balanceToggle = function(){
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
}



	//collect click events
	//check for event type on button
	//pass to screenHandler (in,out)
	//or
	//pass to separate ajax request function
	var clickHandler = function(event){

		event.preventDefault();

		var $me = $(this);
		var action = $me.attr("data-screen-action");

		var $screen = $me.closest(".inline-screen");
		var screenNum = parseInt($screen.attr("data-screen"));

		switch(action){

			case "goto":
			//screenHandler(["screen"+screenNum, "out", "screen"+(parseInt($me.attr("data-screen-to"))), "in"]);
			stateHandler({screenCurr:screenNum, actionCurr:"out", screenNext:(parseInt($me.attr("data-screen-to"))), actionNext:"in"});
			break;

			case "next":
			stateHandler({screenCurr:screenNum, actionCurr:"out", screenNext:(screenNum+1), actionNext:"in"});
			break;

			case "back":
			//stateHandler({screenCurr:screenNum, actionCurr:"backout", screenNext:(parseInt($me.attr("data-screen-to"))), actionNext:"backin"});
			History.back();
			break;

			case "funding-toggle":
			if($(".more-ways").is(":visible")){
				screenHandler([screenNum, "less"]);
			}else{
				screenHandler([screenNum, "more"]);
			}
			break;

			case "activate":
			processActivateCard();
			break;

			case "alerts":
			processAlerts();
			break;

			case "exit":
			closeWW();
			break;
		}

	}

	var stateHandler = function(options){
		var _options = {
			screenCurr : null,
			screenNext : null,
			actionCurr : null,
			actionNext : null,
			ignore : false
		};
		$.extend(_options,options);
		//console.log(_options, titles[_options.screenCurr], URLs[_options.screenCurr]);
		History.pushState(_options, titles[_options.screenNext-1]+baseTitle, URLs[_options.screenNext-1]);
	}

	var lastState,debugState;

	var historyHandler = function(){
		var State = History.getState();
		//History.log('statechange:', State.data, State.title, State.url);

		//console.log("state",State, "last",lastState);

		if(lastState == undefined) debugState = {data:{"screenCurr":null,"screenNext":null}}; else debugState = lastState;

		console.log("ignore: " + State.data.ignore, debugState.data.ignore);
		console.log("thisCurrent: "+State.data.screenCurr, " lastCurrent: "+debugState.data.screenCurr);
		console.log("thisNext: "+State.data.screenNext, " lastNext: "+debugState.data.screenNext);

		if(State.data.ignore == undefined || State.data.ignore == false){

			//console.log("IGNORE");

			if(State.data.screenCurr == undefined){
				//back on activate card screen, clear and reset
				History.replaceState({ignore:true},"","");
				closeWW();
			}else if(State.data.screenCurr == 0 && lastState == undefined){


			}else if(lastState != undefined && State.data.screenCurr == 0 &&  lastState.data.screenCurr == 1){
				//on welcome, trying to get back to activate
				//console.log("WELCOME");
				// State.data.ignore = true;
				// History.replaceState(State.data,titles[1],URLs[1]);
				window.location.href="/Account/Dashboard/post-activate.html";
			}else if(lastState != undefined && lastState.data.screenCurr == State.data.screenNext){
				//back
				//console.log("BACK");
				screenHandler([lastState.data.screenCurr, "backin", lastState.data.screenNext, "backout"]);
			}else{
				//next & goto
				//console.log("NEXT");
				screenHandler([State.data.screenCurr, State.data.actionCurr, State.data.screenNext, State.data.actionNext]);
			}
		}
		lastState = State;
	};

	//accepts an array of screen, state pairs. might change to objects later
	var screenHandler = function(screenStates){

		console.log("screenHandler", screenStates);

		if(screenStates === undefined || screenStates.length === 0 || screenStates%2 === 1)
			return console.error("screenHandler needs an array of screens and state pairs");

		var scrolled = ww.scrollTop() > 0;
		var scrollDelay = (scrolled ? 75 : 0);
		var checkScroll = $.grep(screenStates,
			function(n,i){ return n=="in" || n=="out" || n=="back" || n=="backin" || n=="backout" });

		if(oldAndroid){
			$("html,body").animate({"scrollTop":0},0);
		}else if(scrolled && checkScroll.length>0){
			ww.animate({"scrollTop" : 0}, 50);
		}

		setTimeout(function(){
			stepHandler(screenStates);
		}, scrollDelay );
	}

	var stepHandler = function(screenStates){
		for(var i=0; i<screenStates.length; i+=2){

			step("screen"+screenStates[i], screenStates[i+1]);

		}
	}

	var step = function(scr,state){

		var $scr = ww.find("."+scr);
		var stateObj = ani[scr][state];
		var hasProp = false;

		if(stateObj === undefined){
			console.warn("step.stateObj has an undefined state: screen: "+scr+"; state: "+state);
		}

		if(stateObj.hasOwnProperty("el")){
			applyFromObject($scr,stateObj["el"]);
			hasProp = true;
		}

		if(stateObj.hasOwnProperty("children")){
			for(var item in stateObj["children"]){
				applyFromObject($scr.find(item),stateObj["children"][item]);
			}
			hasProp = true;
		}

		if(!hasProp){
			console.warn("step.stateObj has no el or children");
		}

	}

	var applyFromObject = function($el, props){

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
				console.warn("applyFromObject unknown property: "+item);
			}
		}
	}

	var processActivateCard = function(){

		if($("#activate-card").validate().form()){
			ww.find("#processing").fadeIn(300);
			setTimeout(processActivateComplete, 1000);
		}
	}

	var processActivateComplete = function(){
		var activateScreen = $(".activate-screen");
		var screenNum = parseInt(activateScreen.attr("data-screen"));
		ww.find("#processing").fadeOut(300);
		setTimeout(function(){
			stateHandler({screenCurr:screenNum, actionCurr:"out", screenNext:(screenNum+1), actionNext:"in"});
		}, 400)
	}

	var processActivateError = function(){

	}

	var processAlerts = function(){
		if( $("#balance-alerts").validate().form() ){
			ww.find("#processing").fadeIn(300);
			setTimeout(processAlertsComplete, 1000);
		}
	}

	var processAlertsComplete = function(){
		var alertsScreen = $(".alerts-screen");
		var screenNum = parseInt(alertsScreen.attr("data-screen"));
		ww.find("#processing").fadeOut(300);
		setTimeout(function(){
			stateHandler({screenCurr:screenNum, actionCurr:"out", screenNext:(screenNum+1), actionNext:"in"});
		}, 400)
	}

	init();

}(jQuery);