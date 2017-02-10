$(document).ready(function(){

  var manageOffers = {

    addOffer: function($context, offerID) {
        // This function should make an AJAX call to attach an offer to a user via the OfferId, passed into this function

      // clear any errors first
      manageOffers.errorHide();


      // fires before AJAX call to "lock" processing
      $context.attr('data-wait-offer-add','1');


    // replace this with an AJAX call that fires "manageOffers.addOfferCallback($context" on Done
      setTimeout(function(){
           manageOffers.addOfferCallback($context);
      }, 3000);


      // On Success
      //manageOffers.addOfferCallback($context);

      // If Error fire:
        // manageOffers.errorShow($('.offer-add-error'));

    },

    addOfferCallback: function($context){
      // On success call back for adding offers

        // remove "lock"
        $context.removeAttr('data-wait-offer-add');

        // switch offer to added mode
        $context.removeClass('pre-activated-offer').addClass('activated-offer');

        // try to hide processor, if no locks present
        manageOffers.processorOut($context);
    },

    attachOffer: function($context){
      //  process offer link click, dispatch addOffer request and also seek offer additional info drawer

       var offerID = $context.attr('data-offer-id'); // get OfferId from HTML
       var offersInfo = manageOffers.checkForOfferInfo($context);

       // show processor
        manageOffers.processorIn($context, offerID);

        // run add offer
        manageOffers.addOffer($context, offerID);

        // check for offer info, get info if not present
        if(!offersInfo){
            manageOffers.getMoreOfferInfo($context, offerID);
        }

    },

    bindOfferEvents: function(){
      // attach click events when new HTML is added to the page

      var linkModal =  $("[data-widget-type=link-modal]");
      Hudson.ModalLink.init(linkModal);

         $('.pre-activated-offer a[data-link-offer]').on('click', function(e){
          var $context = $(this).parents('[data-offer-block]');
          e.preventDefault();
         if(!$context.hasClass('activated-offer')){
            manageOffers.attachOffer($context);
         }

      });

     $('a[data-toggle-offer-info]').on('click', function(e){
          var $context = $(this).parents('[data-offer-block]');
          e.preventDefault();
          manageOffers.toggleOfferInfoDrawer($context);
     });

     $('a[data-location-list-toggle]').on('click', function(e){
          var $context = $(this).parents('[data-offer-block]');
          e.preventDefault();
          manageOffers.toggleLocationListDrawer($context);
     });

     $('a[data-offer-terms-toggle]').on('click', function(e){
          var $context = $(this).parents('[data-offer-block]');
          e.preventDefault();
          manageOffers.toggleOfferTerms($context);
     });
    },

    checkForOfferInfo: function($context){
      // Checks for offer info content in drawer, returns true or false
        var offerDrawer = $context.find('[data-toggle-collapsible]');

        if(offerDrawer.html() != ''){
          return true;
        } else {
          return false;
        }
    },

    clientSideCompile: function($context, data, template, target, postRenderCallback){
      // Utitlity function for compiling Dust Templates
      // Uses DustJS (http://linkedin.github.io/dustjs/) to compile offer into JSON using client-side templating
            var source   = template.html();
            var compiled = dust.compile(source, "content");

            dust.loadSource(compiled);

            dust.render("content", data, function(err, out) {
                  target.html(out);
                  if (postRenderCallback){
                      postRenderCallback($context);
                  }
            });
    },

    drawerClose: function($context){
      // Close offer into drawer
       var offerDrawer = $context.find('[data-toggle-collapsible]');
         offerDrawer.slideUp('fast', function(){
            $context.removeClass('opened');
        });
    },

    drawerOpen: function($context){
      // Open offer into drawer
      var offerDrawer = $context.find('[data-toggle-collapsible]');
        offerDrawer.slideDown('fast', function(){
            $context.addClass('opened');
        });
    },

    drawerToggle: function($context){
      // Utility function for info drawer
      if ($context.hasClass('opened')){

          manageOffers.drawerClose($context);
      } else {
           manageOffers.drawerOpen($context);
      }

    },

    emptySetShow : function($emptySet){
        // shows empty sets when necessary
        // takes a valid jquery selector as $emptySet

        $emptySet.find('.empty-set').fadeIn('fast');

    },

    errorShow: function($error){
      // Show error box by revealing the error message then showing the error box
        var errorBox = $('.offers-errors');
        $error.css('display', "inline-block");
        errorBox.fadeIn('fast');
    },

    errorHide: function(){
      // Hide all errors
        $('.offers-errors').fadeOut('fast', function(){
          $('.error-message').css('display', 'none');
        });
    },


    filterViewAdded: function() {
      // Switch to "Added Offers" view
      var openDrawers =  $('#offers-all-filter .offer.opened');
       $('#offers-all-filter').fadeOut('fast', function(){
          // Close any open drawers in View All
          openDrawers.removeClass('opened');
          openDrawers.find('[data-toggle-collapsible]').css('display', 'none');

          // go get added offers
          manageOffers.offerAddedFilterTemplateGetData();
       });
    },

    filterViewAll: function() {
      // Show all available offers again
      $('#offers-added-filter').fadeOut('fast', function(){
          $('#offers-all-filter').fadeIn('fast');
       });

    },

    getMoreOfferInfo: function($context, offerID) {
      // fetch additional offer info from Offers API by OfferId.

        $context.attr('data-wait-offer-info','1');




      // PROTYPE ONLY: The timeout is just to simulate the timing of a data call. just call infoTemplateGetData function without the timeout wrapper
      setTimeout(function(){
          manageOffers.infoTemplateGetData($context,offerID);
      }, 2000);

      // Instead just call this
      // manageOffers.infoTemplateGetData($context,offerID);

    },

    infoTemplateGetData: function($context,offerID){
      // clear any errors
       manageOffers.errorHide();



         // PROTOTYPE only replace this sample data with actual AJAX call for data
         // Switch which data is commented out to see different offerInfo response templates
         //The offerID variable receives the offer ID from the data attribute in the HTML of the $context object

// THIS IS A "STANDARD" Offer
      var data = {
        "OfferList" : [{
          "OfferInfo": [
                    {
                     "OfferFulfillmentType" : "COUPONLESS",
                      "OfferSummaryContent": {
                           "ShortDescription": "Get a one-time statement credit by using your enrolled card to spend a total of $100 or more in-store at Columbia or online at Columbia.com by 1/1/2016.",
                            "MerchantURL" : "http://www.amazon.com"
                        },
                         "OfferLocationList": {
                            "Location" : [
                                      {"LocationId" : "1",
                                            "AddressDef": {
                                                    "StreetAddressLine1DS" : "250 Hudson Street",
                                                    "StreetAddressLine2DS" : "6th Floor",
                                                    "CityNM" : "New York",
                                                    "StateNM" : "NY",
                                                    "AddrPostalCd": "10013"
                                              }
                                        },
                                         {
                                            "LocationId" : "2",
                                            "AddressDef": {
                                                    "StreetAddressLine1DS" : "200 Central Avenue",
                                                    "StreetAddressLine2DS" : "",
                                                    "CityNM" : "St. Petersburg",
                                                    "StateNM" : "FL",
                                                    "AddrPostalCd": "33701"
                                                  }
                                        }]
                    },

                          "OfferDetailContent": {
                               "TermsAndConditions" :  "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent magna elit, suscipit id neque sit amet, tempus suscipit tellus. Curabitur sapien ex, pretium ac accumsan at, commodo non dui. Praesent ut aliquet mi. Donec vitae tellus lorem. Nulla luctus lorem sapien, mattis auctor libero venenatis ut. Quisque tincidunt est non metus lacinia, quis congue urna fermentum. Nam feugiat tincidunt libero sed volutpat. Suspendisse vehicula in urna non eleifend. Etiam porttitor diam massa, non rutrum ex vulputate nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean consequat nisi ipsum, at accumsan massa vulputate quis. Praesent accumsan rutrum nisi, id mollis felis scelerisque nec.</p><p>Sed facilisis, odio eu efficitur hendrerit, metus risus finibus mi, at rutrum sapien sem in metus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec orci libero, consequat id semper elementum, tincidunt ut nulla. Proin bibendum lacinia ipsum, at finibus felis. In ac orci sit amet elit tempus pellentesque. Nunc hendrerit nisl porta odio pharetra molestie. Phasellus egestas erat justo, quis luctus mi venenatis at. Vivamus auctor quam et mattis cursus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque gravida sem mi, sit amet commodo elit euismod at. Aliquam sollicitudin efficitur mi, nec feugiat felis blandit at. Integer vel mauris nunc. Praesent fringilla ornare elit, eget porttitor ante eleifend eu. Curabitur rutrum pretium lectus sed egestas. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla pretium ultrices condimentum.</p><p>Ut vulputate purus quis justo elementum, ut condimentum diam maximus. Mauris sem nibh, cursus sed vehicula in, egestas sit amet mauris. Pellentesque tincidunt libero vestibulum, egestas nisl at, egestas nisi. Quisque suscipit, odio a pretium aliquet, justo metus venenatis erat, a porttitor ligula dolor in sem. Curabitur nec ullamcorper neque. Aliquam non quam eu ante tincidunt laoreet non imperdiet nisl. Aenean ornare eget sem eu tincidunt. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>"
                       }
                    }]
              }]
          };
// THIS IS WHAT A PROMO CODE OFFER MIGHT LOOK LIKE
/*
      var data = {
        "OfferList" : [{
          "OfferInfo": [
                    {
                     "OfferFulfillmentType" : "COUPONFUL",
                      "OfferSummaryContent": {
                           "ShortDescription": "Get a one-time statement credit by using your enrolled card to spend a total of $100 or more in-store at Columbia or online at Columbia.com by 1/1/2016.",
                            "MerchantURL" : "http://www.amazon.com"
                        },
                         "OfferLocationList": {
                            "Location" : [
                                      {"LocationId" : "1",
                                            "AddressDef": {
                                                    "StreetAddressLine1DS" : "250 Hudson Street",
                                                    "StreetAddressLine2DS" : "6th Floor",
                                                    "CityNM" : "New York",
                                                    "StateNM" : "NY",
                                                    "AddrPostalCd": "10013"
                                              }
                                        },
                                         {
                                            "LocationId" : "2",
                                            "AddressDef": {
                                                    "StreetAddressLine1DS" : "200 Central Avenue",
                                                    "StreetAddressLine2DS" : "",
                                                    "CityNM" : "St. Petersburg",
                                                    "StateNM" : "FL",
                                                    "AddrPostalCd": "33701"
                                                  }
                                        }]
                    },

                     "OfferCharacteristicList" :
                          {
                                  "OfferCharacterstics" : [
                                        {
                                          "CharType": "PROMO_CODE",
                                          "CharValue": "AMEX30",
                                        }
                                  ]
                          },
                          "OfferDetailContent": {
                               "TermsAndConditions" :  "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent magna elit, suscipit id neque sit amet, tempus suscipit tellus. Curabitur sapien ex, pretium ac accumsan at, commodo non dui. Praesent ut aliquet mi. Donec vitae tellus lorem. Nulla luctus lorem sapien, mattis auctor libero venenatis ut. Quisque tincidunt est non metus lacinia, quis congue urna fermentum. Nam feugiat tincidunt libero sed volutpat. Suspendisse vehicula in urna non eleifend. Etiam porttitor diam massa, non rutrum ex vulputate nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean consequat nisi ipsum, at accumsan massa vulputate quis. Praesent accumsan rutrum nisi, id mollis felis scelerisque nec.</p><p>Sed facilisis, odio eu efficitur hendrerit, metus risus finibus mi, at rutrum sapien sem in metus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec orci libero, consequat id semper elementum, tincidunt ut nulla. Proin bibendum lacinia ipsum, at finibus felis. In ac orci sit amet elit tempus pellentesque. Nunc hendrerit nisl porta odio pharetra molestie. Phasellus egestas erat justo, quis luctus mi venenatis at. Vivamus auctor quam et mattis cursus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque gravida sem mi, sit amet commodo elit euismod at. Aliquam sollicitudin efficitur mi, nec feugiat felis blandit at. Integer vel mauris nunc. Praesent fringilla ornare elit, eget porttitor ante eleifend eu. Curabitur rutrum pretium lectus sed egestas. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla pretium ultrices condimentum.</p><p>Ut vulputate purus quis justo elementum, ut condimentum diam maximus. Mauris sem nibh, cursus sed vehicula in, egestas sit amet mauris. Pellentesque tincidunt libero vestibulum, egestas nisl at, egestas nisi. Quisque suscipit, odio a pretium aliquet, justo metus venenatis erat, a porttitor ligula dolor in sem. Curabitur nec ullamcorper neque. Aliquam non quam eu ante tincidunt laoreet non imperdiet nisl. Aenean ornare eget sem eu tincidunt. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>"
                       }
                    }]
              }]
          };
          */

// THIS IS WHAT A SPECIAL URL OFFER MIGHT LOOK LIKE

/*
   var data = {
        "OfferList" : [{
          "OfferInfo": [
                    {
                     "OfferFulfillmentType" : "COUPONLESS",
                      "OfferSummaryContent": {
                           "ShortDescription": "Get a one-time statement credit by using your enrolled card to spend a total of $100 or more in-store at Columbia or online at Columbia.com by 1/1/2016.",
                            "MerchantURL" : "http://www.amazon.com"
                        },
                         "DestinationURL": "http://www.ftd.com/promo/AMEX30",
                          "DestinationURLText": "Redeem Offer",
                         "OfferLocationList": {
                            "Location" : [
                                      {"LocationId" : "1",
                                            "AddressDef": {
                                                    "StreetAddressLine1DS" : "250 Hudson Street",
                                                    "StreetAddressLine2DS" : "6th Floor",
                                                    "CityNM" : "New York",
                                                    "StateNM" : "NY",
                                                    "AddrPostalCd": "10013"
                                              }
                                        },
                                         {
                                            "LocationId" : "2",
                                            "AddressDef": {
                                                    "StreetAddressLine1DS" : "200 Central Avenue",
                                                    "StreetAddressLine2DS" : "",
                                                    "CityNM" : "St. Petersburg",
                                                    "StateNM" : "FL",
                                                    "AddrPostalCd": "33701"
                                                  }
                                        }]
                    },

                          "OfferDetailContent": {
                               "TermsAndConditions" :  "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent magna elit, suscipit id neque sit amet, tempus suscipit tellus. Curabitur sapien ex, pretium ac accumsan at, commodo non dui. Praesent ut aliquet mi. Donec vitae tellus lorem. Nulla luctus lorem sapien, mattis auctor libero venenatis ut. Quisque tincidunt est non metus lacinia, quis congue urna fermentum. Nam feugiat tincidunt libero sed volutpat. Suspendisse vehicula in urna non eleifend. Etiam porttitor diam massa, non rutrum ex vulputate nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean consequat nisi ipsum, at accumsan massa vulputate quis. Praesent accumsan rutrum nisi, id mollis felis scelerisque nec.</p><p>Sed facilisis, odio eu efficitur hendrerit, metus risus finibus mi, at rutrum sapien sem in metus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec orci libero, consequat id semper elementum, tincidunt ut nulla. Proin bibendum lacinia ipsum, at finibus felis. In ac orci sit amet elit tempus pellentesque. Nunc hendrerit nisl porta odio pharetra molestie. Phasellus egestas erat justo, quis luctus mi venenatis at. Vivamus auctor quam et mattis cursus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque gravida sem mi, sit amet commodo elit euismod at. Aliquam sollicitudin efficitur mi, nec feugiat felis blandit at. Integer vel mauris nunc. Praesent fringilla ornare elit, eget porttitor ante eleifend eu. Curabitur rutrum pretium lectus sed egestas. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla pretium ultrices condimentum.</p><p>Ut vulputate purus quis justo elementum, ut condimentum diam maximus. Mauris sem nibh, cursus sed vehicula in, egestas sit amet mauris. Pellentesque tincidunt libero vestibulum, egestas nisl at, egestas nisi. Quisque suscipit, odio a pretium aliquet, justo metus venenatis erat, a porttitor ligula dolor in sem. Curabitur nec ullamcorper neque. Aliquam non quam eu ante tincidunt laoreet non imperdiet nisl. Aenean ornare eget sem eu tincidunt. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>"
                       }
                    }]
              }]
          };
          */



      // If Sucessful:
      manageOffers.infoTemplateCompile($context, data);

      // IF Error:
      //manageOffers.errorShow($('.offer-info-error'));

    },

    infoTemplateCompile: function($context, data){
      // take returned data and compile it to HTML

          var template =  $("#offers-info-template");
          var target =  $context.find('[data-toggle-collapsible]');

           manageOffers.clientSideCompile ($context, data, template, target, manageOffers. infoTemplateCompileCallback);

    },

    infoTemplateCompileCallback: function($context){
      // Fires after template compiles

      // remove "lock"
        $context.removeAttr('data-wait-offer-info');

        // bind events to new HTML
          manageOffers.bindOfferEvents();

        // Hide processor
          manageOffers.processorOut($context);

        // Open drawer to see offerInfo
          manageOffers.drawerOpen($context);
    },

     offerAddedFilterTemplateGetData: function($context){
      // Go get added offers

        // clear any errors
       manageOffers.errorHide();

        /* Run this before AJAXcall */
      manageOffers.offersLoadingShow();

        /* replace this sample data with actual AJAX call for data */
        var data = {
            "OfferList" : [{
              "OfferInfo": [
                    {
                     "OfferId" : "1234",
                     "CustomerOfferStatus": "ENROLLED",
                      "OfferFulfillmentType" : "COUPONLESS",
                      "OfferSummaryContent" : {
                            "MerchantName" : "Amazon.com",
                            "OfferName" : "Spend $1000 or more, get $5000 back"
                      },
                      "OfferDuration" : {
                          "DisplayEndDate" : "02/12/15",
                          "RemainingActiveDays" : "1"
                        }
                   },
                    {
                     "OfferId" : "1236",
                     "CustomerOfferStatus": "ENROLLED",
                     "OfferFulfillmentType" : "COUPONFUL",
                     "OfferSummaryContent" : {
                          "MerchantName" : "Ftd.com",
                            "OfferName" : "Get 25% off your next purchase"
                     },

                     "OfferDuration" : {
                          "DisplayEndDate" : "02/16/15",
                          "RemainingActiveDays" : "10"
                        }
                   },
                      {
                     "OfferId" : "1235",
                     "CustomerOfferStatus": "ENROLLED",
                      "OfferFulfillmentType" : "COUPONFUL",
                      "OfferSummaryContent" : {
                                  "MerchantName" : "FromYouFlowers.com",
                                  "OfferName" : "Get $15 off your purch of $24.99+"
                     },

                     "OfferDuration" : {
                          "DisplayEndDate" : "04/0315",
                          "RemainingActiveDays" : "6"
                        }
                   }]
              }]
          };

      // If Successful:
      manageOffers.offerAddedFilterTemplateCompile($context, data);

      // IF Error
     // manageOffers.errorShow($('.offer-get-error'));

     // IF Empty Set
     // manageOffers.emptySetShow($('#offers-added-filter'));
    },


    offerAddedFilterTemplateCompile: function($context, data){
      // take returned data and compile it
           var template =  $("#offers-block-template");
          var target =  $('#offers-added-filter .payload');

           manageOffers.clientSideCompile ($context, data, template, target, manageOffers. offerAddedFilterTemplateCompileCallback);

    },

     offerAddedFilterTemplateCompileCallback: function($context){
      // fires when template compilation is done

      // bind events to HTML again
          manageOffers.bindOfferEvents();

      // Hide processing
          manageOffers.offersLoadingHide();

      // show offers
          $('#offers-added-filter').fadeIn('fast');
    },

    offerBlockTemplateGetData: function($context){
      // get all available offers


      // clear any errors
       manageOffers.errorHide();

      /* PROTOTYPE ONLY: replace this sample data with actual AJAX call for data */
       var data = {
            "OfferList" : [{
                "OfferInfo": [
                      {
                     "OfferId" : "1234",
                     "CustomerOfferStatus": "ELIGIBLE",
                     "OfferFulfillmentType" : "COUPONLESS",
                     "OfferSummaryContent" : {
                          "MerchantName" : "Amazon.com",
                          "OfferName" : "Spend $1000 or more, get $5000 back"
                     },

                     "OfferDuration" : {
                           "DisplayEndDate" : "02/12/15",
                          "RemainingActiveDays" : "1"
                        }
                   },
                   {
                     "OfferId" : "1235",
                     "CustomerOfferStatus": "ELIGIBLE",
                     "OfferFulfillmentType" : "COUPONFUL",
                     "OfferSummaryContent" : {
                           "MerchantName" : "FromYouFlowers.com",
                           "OfferName" : "Get $15 off your purch of $24.99+",
                     },

                     "OfferDuration" : {
                          "DisplayEndDate" : "04/03/15",
                          "RemainingActiveDays" : "90"
                        }


                   },
                       {
                       "OfferId" : "1236",
                     "CustomerOfferStatus": "ELIGIBLE",
                     "OfferFulfillmentType" : "COUPONFUL",
                     "OfferSummaryContent" : {
                           "MerchantName" : "Ftd.com",
                            "OfferName" : "Get 25% off your next purchase"
                     },

                     "OfferDuration" : {
                          "DisplayEndDate" : "02/16/15",
                          "RemainingActiveDays" : "6"
                        }


                   },

                     {
                       "OfferId" : "1237",
                     "CustomerOfferStatus": "ELIGIBLE",
                     "OfferFulfillmentType" : "COUPONLESS",
                     "OfferSummaryContent" : {
                           "MerchantName" : "Blue Bottle Coffee",
                            "OfferName" : "Spend $100 or more, get $25 back"
                     },

                     "OfferDuration" : {
                          "DisplayEndDate" : "06/12/15",
                           "RemainingActiveDays" : "94"
                        }
                   },

                       {
                        "OfferId" : "1238",
                     "CustomerOfferStatus": "ELIGIBLE",
                     "OfferFulfillmentType" : "COUPONFUL",
                     "OfferSummaryContent" : {
                           "MerchantName" : "Whisk",
                            "OfferName" : "Get 20% off purchase of $100 or more"
                     },

                     "OfferDuration" : {
                          "DisplayEndDate" : "04/03/15",
                          "RemainingActiveDays" : "60"
                        }
                   },
                       {
                         "OfferId" : "1239",
                     "CustomerOfferStatus": "ELIGIBLE",
                     "OfferFulfillmentType" : "COUPONFUL",
                     "OfferSummaryContent" : {
                           "MerchantName" : "J. Crew",
                            "OfferName" : "Get 20% off purchase"
                     },

                     "OfferDuration" : {
                          "DisplayEndDate" : "02/16/15",
                          "RemainingActiveDays" : "10"
                        }
                   }

                   ]
              }]
          };

      // this function should be called on success
      manageOffers.offerBlockTemplateCompile($context, data);

      // IF Error
      // manageOffers.errorShow($('.offer-get-error'));

      // IF Empty Set
      // manageOffers.emptySetShow($('#offers-all-filter'));
    },

    offerBlockTemplateCompile: function($context, data){
        // comile data to HTML


          var template =  $("#offers-block-template");
          var target =  $('#offers-all-filter .payload');

           manageOffers.clientSideCompile ($context, data, template, target, manageOffers.offerBlockTemplateCompileCallback);

    },

    offerBlockTemplateCompileCallback: function($context){
      // runs after template compile
          manageOffers.bindOfferEvents();
          manageOffers.offersLoadingHide();
    },

        offersLoadingShow: function(){
            // shows processing message when offers are loading

          $('#offers-landing-module').css('display', 'none');
          $('#processing-offers').fadeIn('fast');
    },

    offersLoadingHide: function(){
      // hides processing when offers are done loading

        // PROTOTYPE ONLY: simulating API lag.. fadeIn offers module without timeout.
        setTimeout(function(){
              $('#processing-offers').fadeOut('fast', function(){
              $('#offers-landing-module').fadeIn('fast');
           }); }, 1000);

        // Should just be:
          //$('#processing-offers').fadeOut('fast', function(){
          //$('#offers-landing-module').fadeIn('fast');

    },



      processorIn: function($context) {
        // Show processing message
          var o = $context.find(".processing-overlay");
          if (!o.hasClass("CustomerOfferStatus")) {
              o.fadeIn("slow", function() {
                o.addClass("CustomerOfferStatus");
              });
          }
      },

      processorOut: function($context) {
         // Hide processing message but only if no "lock" attributes are present
         // These attributes are assigned to waitOffer and waitInfo
            var o = $context.find(".processing-overlay");
            var waitOffer = $context.attr('[data-wait-offer-add]');
            var waitInfo = $context.attr('[data-wait-offer-info]');
                    if(waitOffer || waitInfo){
                      return false;
                    } else {
                      o.fadeOut("slow", function() {
                      o.removeClass("CustomerOfferStatus");
                    });
                }
        },

    toggleOfferInfoDrawer: function($context){
      // show/hide offerInfo drawer
        var offerInfo = manageOffers.checkForOfferInfo($context);
        var offerDrawer = $context.find('[data-toggle-collapsible]');
        if (offerInfo){
            manageOffers.drawerToggle($context);
        } else{
          manageOffers.processorIn($context);
          manageOffers.getMoreOfferInfo($context);
        }
    },

    toggleLocationListDrawer: function($context){
      // show/hide location drawer
          var wrap = $context.find('.offer-location-wrap');
          var drawer = wrap.find('.location-list-drawer');


          if(wrap.hasClass('opened')){
              drawer.slideUp('fast', function(){
                  wrap.removeClass('opened');
              });
          } else {
              drawer.slideDown('fast', function(){
                  wrap.addClass('opened');
              });
          }
    },

    toggleOfferTerms: function($context){
      // show/hide offer terms

        var wrap = $context.find('.offer-terms-wrap');
          var drawer = wrap.find('.offer-terms');


          if(wrap.hasClass('opened')){
              drawer.slideUp('fast', function(){
                  wrap.removeClass('opened');
                  wrap.addClass('closed');
              });
          } else {
              drawer.slideDown('fast', function(){
                  wrap.removeClass('closed');
                  wrap.addClass('opened');
              });
          }
    },


    init: function() {
      // Initial event binding

       manageOffers.offerBlockTemplateGetData();

     $('a[data-view-added-offers-filter]').on('click', function(e){
        e.preventDefault();
        if (!$(this).hasClass('active')){
            $('.offers-filter a').removeClass('active');
            $(this).addClass('active');
        };
          manageOffers.filterViewAdded();
     });

      $('a[data-view-all-offers-filter]').on('click', function(e){
          e.preventDefault();
           if (!$(this).hasClass('active')){
              $('.offers-filter a').removeClass('active');
              $(this).addClass('active');
          };
          manageOffers.filterViewAll();
     });

       $('#offers-added-empty .offers-btn').on('click', function(e){
        var offersFilterLink = $('a[data-view-all-offers-filter]');
        e.preventDefault();
        if (!offersFilterLink.hasClass('active')){
            $('.offers-filter a').removeClass('active');
            offersFilterLink.addClass('active');
        };
          manageOffers.filterViewAdded();
     });

    }

} // end manageOffers

	manageOffers.init();
}); // end document.ready()