$(document).ready(function(){

	var form = {
		config:{
			page1: $(".form--page-1"),
			page2: $(".form--page-2"),
			radioOptions: $(".page-2--radio-options"),
			updateFields: $(".page-2--input-field"),
			//event listener hooks
			formMain: $("#form--main"),
			formEdit: $("#form--edit"),
			formRadioOpt: $("#form--radio-opt"),
			buttonGoBack: $("#goBackButton"),
			linkEdit: $("#edit-address--link"),
			//dust hooks
			targetSuggested: $("#target--suggested"),
			targetOriginal:$("#target--original"),
			templateRadioOpt: $("#template--radio-options"),
			addressValidated: false
		},

		init: function(){
			form.addEventListeners();
			form.initHistory();
		},

		addEventListeners: function(){
			var f = form.config;
			f.formMain.on("submit", form.ajaxAddressAPI);
			f.formEdit.on("submit", form.jqueryValidate);
			f.formRadioOpt.on("submit", form.submitUpdates);
			f.linkEdit.on("click", function(){ form.pushState("/Signup/AddressValidation/edit-address"); });
			f.buttonGoBack.on("click", form.goBack);
		},

		initHistory: function(){
			History.Adapter.bind(window, 'statechange', form.historyHandler);
		},

		historyHandler: function(){
			var State = History.getState();

			if(State.hash === '/Signup/AddressValidation/'){
				form.revealForm();
			}else if(State.hash === '/Signup/AddressValidation/radio-options'){
				form.revealRadioOptions();
			}else if(State.hash === '/Signup/AddressValidation/edit-address'){
				form.revealAddressEdit();
			}

		},

		pushState: function(url){
			History.pushState({}, "", url);
		},

		goBack: function(){
			History.back();
		},

		jqueryValidate: function(e){
			e.preventDefault();
			var formContent = $("#" + e.target.id);
			var State = History.getState();

			if( formContent.valid() && State.hash === '/Signup/AddressValidation/' ){
				form.ajaxAddressAPI(e);
			}else if( formContent.valid() && State.hash === '/Signup/AddressValidation/edit-address'){
				form.submitUpdates(e);
			}
	
		},

		ajaxAddressAPI: function(e){
			var f = form.config;
			f.addressValidated = true;

			////////========================
			//placeholder data
			var suggestedAddress = {
				Address:{
					Line1: "250 HUDSON",
					Line2: "6 FL",
					City: "New York",
					State: "NY",
					PostalCode: "10013-1234" 
				}
			};
			////////========================
			
			//ON SUCCESS
			form.renderAddress(suggestedAddress);
			
			//ON FAIL

		},

		getOriginalAddress: function(){
			//grab from input fields and return
			var originalAddress = {
				Address:{
					Line1: "250 Hudson",
					Line2: "6th Floor",
					City: "New York City",
					State: "35",
					PostalCode: "10013" 
				}
			};
			return originalAddress;
		},

		renderAddress: function(suggestedAddress){
			var f = form.config;
			var originalAddress = form.getOriginalAddress();

			form.clientSideCompile(suggestedAddress, f.templateRadioOpt, f.targetSuggested);
			form.clientSideCompile(originalAddress, f.templateRadioOpt, f.targetOriginal);

			$.each(originalAddress.Address, function(key, value){
				f.formEdit.find("[name=" + key + "]").val(value);
			});

  		form.pushState("/Signup/AddressValidation/radio-options");

		},

		clientSideCompile: function(address, template, target){
			var source = template.html();
    	var compiled = dust.compile(source, "address");
    	dust.loadSource(compiled);

  		dust.render("address", address, function(err, out){
  			target.html(out);
  		});
		},

		revealForm: function(){
			var f = form.config;
			f.page2.hide();
			f.page1.show();
		},

		revealRadioOptions: function(){
			var f = form.config;
			f.page1.hide();
			f.page2.show();
			f.radioOptions.show();
			f.updateFields.addClass('hidden');
			window.scrollTo(0,0);
		},

		revealAddressEdit: function(){
			var f = form.config;
			f.radioOptions.hide();
			f.updateFields.removeClass("hidden");
		},

		submitUpdates: function(e){
			e.preventDefault();
			var f = form.config;

			if(e.target.id === "form--radio-opt"){	
				if($("#suggested")[0].checked){
					f.targetSuggested.children().each(function(){
						f.formMain.find("[name=" + $(this).attr("name") + "]").val($(this).text());				
					});
					// f.formMain.submit();
					console.log("submit from suggested opt");
				}else{
					// f.formMain.submit();
					console.log("submit from original opt");
				}
			}else if(e.target.id ==="form--edit"){
				for(var i=0; i<5; i++){
					f.formMain.find("[name="+ e.target[i].id + "]").val(e.target[i].value);
				}
				// f.formMain.submit();
				console.log('submit from input fields');
			}
		
		}

	};

form.init();


});

