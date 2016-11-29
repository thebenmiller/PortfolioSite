
            $(document).ready(function(){
                    // unique page interactions

                    var privPrefIframe = {
                        ri: null,
                        emailChoiceExpose: function(e){

                            // show appropriate sub-choices for email toggle
                            var thisVal = $('input[name="Email"]:checked').val();

                            if(thisVal === '0'){

                                privPrefIframe.switchIt('.no-email-options', '.yes-email-options');

                            } else if(thisVal === '1'){

                                privPrefIframe.switchIt('.yes-email-options', '.no-email-options');

                            }
                        },

                        switchIt: function(on, off){
                                $(off).fadeOut('fast', function(){
                                    $(on).fadeIn('fast',  privPrefIframe.ri.resizeForce);
                                });
                          },

                        mobileIntroToggle: function(){
                            // open if closed, close if open
                            var content = $('.mobile-toggled-content');
                            if(content.hasClass('opened')){
                                $('.mobile-toggle-control .close-text').css('display', 'none');
                                $('.mobile-toggle-control .open-text').css('display', 'inline');
                                $('.mobile-toggle-control .toggle-arrow').removeClass('opened');
                                content.css('display', 'none');
                                content.removeClass('opened');
                            } else {
                                $('.mobile-toggle-control .open-text').css('display', 'none');
                                $('.mobile-toggle-control .close-text').css('display', 'inline');
                                $('.mobile-toggle-control .toggle-arrow').addClass('opened');
                                content.css('display', 'inline');
                                content.addClass('opened');

                            }
                        },

                        showDetailsToggle: function(e, ri){
                            // open if closed, close if open
                            var target = $(e.target);
                            var targetLink =  target.parent('a.show-details');
                              var content = targetLink.siblings('.detailReveal');
                            var openText = targetLink.find('.open-link-text');
                            var closeText = targetLink.find('.close-link-text');


                            if(targetLink.hasClass('opened')){
                             closeText.fadeOut('fast', function(){
                                  targetLink.removeClass('opened');
                                 openText.fadeIn('fast');
                                });

                            } else {

                               openText.fadeOut('fast', function(){
                                    targetLink.addClass('opened');
                                  closeText.fadeIn('fast');
                                });
                            }

                            console.log(content.html());
                            content.toggle('fast', privPrefIframe.ri.resizeForce);
                        },

                        init: function(){
                            var that = this;
                            // enables responsive iframe
                            privPrefIframe.ri = responsiveIframe();
                            privPrefIframe.ri.allowResponsiveEmbedding();

                            // attach listener for exposing granular email choices
                            $('.email-pref-radio input[type="radio"]').on('click', function(){
                                that.emailChoiceExpose();
                            });

                            //attach listener for show/hide long intro text on small-screen
                            $('.mobile-toggle-control').on('click', function(){
                                that.mobileIntroToggle();
                            });

                            $('.show-details').on('click', function(e){
                                that.showDetailsToggle(e, privPrefIframe.ri);
                                e.preventDefault();
                            });

                        }
                    };

                    privPrefIframe.init();
            });