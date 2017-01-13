$(document).ready(function(){

	var form = {
		config:{
			page1: $("[data-page-one]"),
			page2: $("[data-page-two]"),
			radioOptions: $("[data-page-two-radio-opt]"),
			inputOption: $("[data-page-two-input-opt]"),
			//event listener hooks
			formMain: $("[data-form-main]"),
			formEdit: $("[data-form-edit]"),
			formRadioOpt: $("[data-form-radio]"),
			buttonGoBack: $("[data-link-go-back]"),
			linkEdit: $("[data-link-edit]"),
			//dust hooks
			targetSuggested: $("#template-target--suggested"),
			targetOriginal:$("#template-target--original"),
			templateRadioOpt: $("#template--radio-options"),
			//object variables
			browserIndex: 0,
			addressValidated: false
		},

		init: function(){
			form.addEventListeners();
			form.initHistory();
		},

		addEventListeners: function(){
			var f = form.config;
			f.formMain.on("submit", form.jqueryValidate);
			f.formEdit.on("submit", form.jqueryValidate);
			f.formRadioOpt.on("submit", form.submitUpdates);
			f.linkEdit.on("click", function(){ form.pushState({index: 2}, "/Signup/AddressValidation/edit-address"); });
			f.buttonGoBack.on("click", form.goBack);
		},

		initHistory: function(){
			var url = History.getState().hash;
			History.replaceState({index: 0}, "", url);
			History.Adapter.bind(window, 'hashchange statechange', form.historyHandler);
		},

		historyHandler: function(){
			var f = form.config;
			var State = History.getState();
			if(State.data.index === 0){
				form.revealMainForm();
			}else if(State.data.index === 1 && f.browserIndex < State.data.index){//checking if radio button State is coming from main form (no transition needed)
				form.revealRadioOptions();
			}else if(State.data.index === 1 && f.browserIndex > State.data.index){//checking if radio button State is coming from edit form (transition needed)
				form.transitionOutEditForm();
			}else if(State.data.index === 2 && f.browserIndex === 0){//checking if edit form State is coming from main form (no transition needed)
				form.revealEditForm();
			}else if(State.data.index === 2){//else if edit form State (transition needed)
				form.transitionInEditForm();
			}
		},

		pushState: function(data, url){
			History.pushState(data, "", url);
		},

		goBack: function(){
			History.back();
		},

		jqueryValidate: function(e){
		var f = form.config;
		if(f.addressValidated === false){
				e.preventDefault();
				var State = History.getState();
				if(State.data.index === 0){//if function called from formMain
					if(f.formMain.valid()){//and the form is valid
						form.ajaxAddressAPI(e);//run function
					}
				}else if(State.data.index === 2){//if function called from formEdit
					if(f.formEdit.valid()){//and the form is valid
						form.submitUpdates(e);//run function
					}
				}
			}
		},

		ajaxAddressAPI: function(e){

      // PROTOTYPE only replace this sample data with actual AJAX call for data
			////////========================
			var suggestedAddress = {
				Address:{
					Line1: "250 HUDSON",
					Line2: "6 FL",
					City: "New York",
					State: {
						stateVal: '35',
						stateName: 'New York'
					},
					PostalCode: "10013-1234"
				}
			};
			////////========================

			form.config.suggestedAddress = suggestedAddress;

			//ON SUCCESS
			form.renderAddress(suggestedAddress);

			//ON ERROR
			// form.config.addressValidated = true;
			// form.config.formMain.submit();

			//ON EMPTYSET
			// form.renderAddress();

		},

		getOriginalAddress: function(){

			var originalAddress = {
				Address:{}
			};

			var originalFields = $("[data-address-fields]").find("input, select");
			//grabbing original input values and declaring in originalAddress hash object
			$.each(originalFields, function(){
				var key = $(this).attr('name');
				if(key === 'State'){
					var numVal = $(this).val();
					var textVal = $(this).find('[value=' + numVal + ']').text();
					originalAddress.Address[key] = {stateVal: numVal, stateName: textVal};
				}else{
					var value = $(this).val();
					originalAddress.Address[key] = value;
				}
			});

			return originalAddress;
		},

		renderAddress: function(suggestedAddress){
			var f = form.config;
			var originalAddress = form.getOriginalAddress();
			//setting values of edit form to original address values
			$.each(originalAddress.Address, function(key, value){
				if(key === "State"){
					f.formEdit.find("[name=" + key + "]").val(value.stateVal);
					f.formEdit.find(".filter-text-inner").text(value.stateName);
				}else{
					f.formEdit.find("[name=" + key + "]").val(value);
				}
			});

			if(suggestedAddress){
				form.clientSideCompile(suggestedAddress, f.templateRadioOpt, f.targetSuggested);
				form.clientSideCompile(originalAddress, f.templateRadioOpt, f.targetOriginal);
				form.pushState({index: 1}, "/Signup/AddressValidation/radio-options");
			}else{
				form.pushState({index: 2}, "/Signup/AddressValidation/edit-address");
			}
		},

		clientSideCompile: function(address, template, target){
			var source = template.html();
    	var compiled = dust.compile(source, "address");
    	dust.loadSource(compiled);

  		dust.render("address", address, function(err, out){
  			target.html(out);
  		});
		},

		revealMainForm: function(){
			var f = form.config;
			f.browserIndex = 0;
			f.page2.hide();
			f.page1.show();
		},

		revealRadioOptions: function(){
			var f = form.config;
			f.browserIndex = 1;
			f.page1.hide();
			f.page2.show();
			f.inputOption.hide();
			f.radioOptions.show();
			window.scrollTo(0,0);
		},

		revealEditForm: function(){
			var f = form.config;
			f.browserIndex = 2;
			f.page1.hide();
			f.page2.show();
			f.radioOptions.hide();
			f.inputOption.show();
			window.scrollTo(0,0);
		},

		transitionInEditForm: function(){
			var f = form.config;
			f.browserIndex = 2;
			f.page1.hide();
			f.page2.show();
			form.animateForm(f.radioOptions, f.inputOption);
		},

		transitionOutEditForm: function(){
			var f = form.config;
			f.browserIndex = 1;
			f.page1.hide();
			f.page2.show();
			form.animateForm(f.inputOption, f.radioOptions);
		},

		animateForm: function(objectOut, objectIn){
			var topOut = objectOut.find(".top");
			var bottomOut = objectOut.find(".bottom");
			var topIn = objectIn.find(".top");
			var bottomIn = objectIn.find(".bottom");

			topIn.css({"opacity": 0});
			bottomIn.css({"opacity": 0});

			if(objectOut.hasClass("page-2--radio-opt")){
				topOut.animate({
					"left": "-100%",
					"opacity": 0
				}, 300);
				bottomOut.delay(100).animate({
					"opacity": 0,
				}, 300, function(){
					objectOut.css({"display": "none"});
					objectIn.css({"display": "block"});
					topIn.css({"right": "-100%"}).animate({
						"right": 0,
						"opacity": 1
					}, 300);
					bottomIn.delay(100).animate({
						"opacity": 1
					}, 300);
				});
			}else if(objectOut.hasClass("page-2--input-opt")){
				topOut.animate({
					"right": "-100%",
					"opacity": 0
				}, 300);
				bottomOut.delay(100).animate({
					"opacity": 0,
				}, 300, function(){
					objectOut.css({"display": "none"});
					objectIn.css({"display": "block"});
					topIn.css({"left": "-100%"}).animate({
						"left": 0,
						"opacity": 1
					}, 300);
					bottomIn.delay(100).animate({
						"opacity": 1
					}, 300);
				});
			}
		},

		submitUpdates: function(e){
			e.preventDefault();
			var f = form.config;
			var State = History.getState();
			if(State.data.index === 1){//if function called from formRadioOpt
				if($("#suggested")[0].checked){//and the suggested address is checked
					//update formMain values with suggested address values
					$.each(f.suggestedAddress.Address, function(key, value){
						if(key === 'State'){
							f.formMain.find("[name=" + key + "]").val(value.stateVal);
						}else{
							f.formMain.find("[name=" + key + "]").val(value);
						}
					});
					f.addressValidated = true;
					f.formMain.submit();
				}else{//if the suggested address isn't checked, submit formMain as is
					f.addressValidated = true;
					f.formMain.submit();
				}
			}else if(State.data.index === 2){//if function called from formEdit
				var updateFields = $("[data-address-fields-update]").find('input, select');
				//update formMain values with updated address values
				$.each(updateFields, function(){
					var key = $(this).attr('name');
					var value = $(this).val();
					f.formMain.find("[name=" + key + "]").val(value);
				});
				f.addressValidated = true;
				f.formMain.submit();
			}
		}

	};

form.init();


});
