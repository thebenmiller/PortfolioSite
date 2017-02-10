(function($){

	var Hudson = {};
	window.PfmInteraction = Hudson;



	Hudson.hasSVG = (function () {
		var div = document.createElement('div'),
			ns = {'svg': 'http://www.w3.org/2000/svg'};
      	div.innerHTML = '<svg/>';
      	return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
	})();

	Hudson.Widget = new function () {
	    var HW = this;

		HW.init = function() {

			$('*[data-widget-type]').each(function() {
				var subConstructor,
					me = $(this),
					type = me.attr('data-widget-type');
				switch (type) {
					case 'radio-input':
						HW.RadioInput.init(me);
					break;
					case 'quick-categorize':
						HW.QuickCategorize.init(me);
					break;
					case 'edit-category':
						HW.EditCategory.init(me);
					break;
					case 'set-inline':
						HW.SetInline.init(me);
					break;
				    case 'set-category-inline':
				        HW.SetCategoryInline.init(me);
				        break;
					case 'set-alerts':
						HW.SetAlerts.init(me);
					break;
					case 'insight-tabs':
						HW.ToggleTabs.init(me);
					break;
					case 'pie-chart-placeholder':
						HW.PiePlaceholder.init(me);
					break;
					case 'pie-chart':
						HW.PieChart.init(me);
					break;
					case 'spend-history':
						HW.SpendHistoryChart.init(me);
					break;
					case 'add-limit-category':
						HW.AddLimitCategory.init(me);
					break;
					case 'add-category':
						HW.AddCategory.init(me);
					break;
					case 'amount-slider':
						HW.Slider.init(me);
					break;
					case 'annual-savings':
						HW.AnnualSavings.init(me);
					break;
					case 'reserve-transfer':
						HW.ReserveTransfer.init(me);
					break;
					case 'bar-chart':
						subConstructor = HW.BarChart;
						subConstructor.init(me);
					break;
				    case 'processing-overlay':
				        subConstructor = HW.ProcessingOverlay;
				        subConstructor.init(me);
				    break;
				}
			});
		}

		var AppendError = function (errors) {
		    var errorsection = "<section class='message global-error' role='alert'>	<div class='message-inner'>" +
            "<ul><li>" + errors + " </li></ul></div> ";
		    return errorsection;
		};

		var showErrors = function (errors, errorListNode) {
		    if (errors == undefined)
		        return;

		    var errorList = "";

		    if (typeof errors == "string" || errors instanceof String) {
		        errorList = "<li>" + errors + "</li>";
		    } else {
		        for (var i = 0; i < errors.length; i++) {
		            errorList += "<li>" + errors[i].Value + "</li>";
		        }
		    }
		    errorListNode.removeClass('hidden').addClass('field-validation-error').find("ul").html(errorList);
		};

		var removeErrors = function (ErrorListSelector) {
		    $(ErrorListSelector).removeClass('.field-validation-error').addClass('hidden').find("ul").html('');
		};

		HW.ProcessingOverlay = new function () {

		    var PO = this;
		    var me = null;
		    var overlay = null;
		    var processing = null;
		    var overlayArray = [], processingArray = [], containers;

		    PO.init = function (n) {
		        me = n;
		        overlay = n.find('.global-overlay');
		        processing = n.find('.global-notice.processing');
		        $("body").css("position", "relative");

		        overlayArray.push(overlay);
		        processingArray.push(processing);
		        containers = $('.quick-categorize-section');
		    }

		    PO.show = function (container, showSpinner, callback) {
		        var index = containers.index(container);

                if (index >= 0) {
                    if (showSpinner === undefined) showSpinner = true;
                    overlayArray[index].fadeTo(300, .5, function () {
                        //Springboard.Window.scrollHandler(processing);
                        if (callback) callback.call();
                    });
                    if (showSpinner) processingArray[index].fadeIn(300);
                    //Springboard.BackToTop.forceHidden(true);
                }
		    }

		    PO.hide = function (container, callback) {
		        var index = containers.index(container);

		        if (index >= 0) {
                    overlayArray[index].fadeOut(300, function () {
                        if (callback) callback.call();
                        //Springboard.BackToTop.forceHidden(false);
                    });
                    processingArray[index].fadeOut(300);
		        }
		    }

		}

		HW.RadioInput = new function(){
			this.init = function(node){
				node.find('input[type=text]').click(function(){
					node.siblings().find('.active').removeClass('active');
					node.find('input[type=radio]').attr('checked','checked').next('.cover').addClass('active');
				});
			}
		}

		HW.QuickCategorize = new function(){
			this.init = function(node){
				var transactions = node.find('[data-transaction-id]'),
					startProgress = (1 / transactions.length) * 100 + '%',
					progressTracker = node.find('[data-widget-property=quick-categorize-progress]'),
					totalCount = node.find('[data-widget-property=carousel-total]'),
					maxLength = parseFloat(node.attr('data-property-max')),
					activeState = node.find('[data-widget-property=categorize-active]'),
					carousel = activeState.find('[data-widget-property=quick-categorize-cycle]'),
					carouselNext = activeState.find('[data-widget-property=quick-categorize-next]'),
					carouselEnd = activeState.find('[data-widget-property=quick-categorize-end]'),
					remainingState = node.find('[data-widget-property=categorize-remaining]'),
					completeState = node.find('[data-widget-property=categorize-complete]'),
					nextStep = $('.container.has-learnvest .whats-next'),
					categorySection = node.find('[data-widget-property=quick-categorize-edit]'),
					categories = node.find('[data-widget-property=category-label-list]'),
					addCategorySection = node.find('[data-widget-property=add-category-section]'),
					showAddBtn = node.find('[data-widget-role=show-add-category-btn]'),
					addCategoryBtn = node.find('[data-widget-role=add-category-btn]'),
					editLabel = categorySection.attr('data-property-open-label'),
                    addCategoryForm = addCategorySection.find('form'),
                    addCategoryProcessingIndicator = addCategorySection.find('[data-widget-role=inline-process]'),
                    addCategoryContextualError = addCategorySection.find('.contextual-error'),
					confirmation = false;

			    nextStep.hide();
				totalCount.text(transactions.length);
				progressTracker.css('width', startProgress);

                if (totalCount.text() == 1) {
                    carouselNext.hide();
                    carouselEnd.show();
                }

				carousel.on('cycle-after',function(event, opts){
					var currentSlide = opts.slideNum,
						totalSlides = opts.slideCount,
						progress = (currentSlide / totalSlides) * 100 + '%';

					categorySection.find('.btn-primary').removeClass('btn-primary').addClass('btn-secondary');
					progressTracker.animate({ width: progress });
					node.find('[data-widget-property=carousel-current]').text(currentSlide);

					if($('.cycle-slide:nth-child('+(currentSlide+1)+') .category-label').length>0){
						categorySection.find('.category-btn').each(function(){
							if($(this).val()===$('.cycle-slide:nth-child('+(currentSlide+1)+') .category-label').text()){
								$(this).removeClass('btn-secondary').addClass('btn-primary');
							}
						});
					}

					if(currentSlide===totalSlides){
						carouselNext.hide();
						carouselEnd.show();
					} else {
						carouselEnd.hide();
						carouselNext.show();
					}
				});

			    node.find('[data-widget-property=quick-categorize-next], [data-widget-property=quick-categorize-end], [data-widget-property=quick-categorize-prev]').click(function() {
			        removeCategorizationError();
			    });

				carouselEnd.click(endCarousel);

				remainingState.find('[data-widget-role=carousel-restart]').click(function () {
				    removeCategorizationError();
					carousel.empty();
					carouselEnd.hide();
					addCategoryContextualError.removeClass('.field-validation-error').addClass('hidden').find("ul").html('');

					var recount = remainingState.find('.cycle-slide').length,
						restartProgress = (1 / recount) * 100 + '%';
					activeState.find('[data-widget-property=carousel-current]').text('1');
					totalCount.text(recount);
					progressTracker.css('width',restartProgress);
					remainingState.find('.transaction').each(function(){
						$(this).appendTo(carousel).find('.category-label').remove();
					});
					remainingState.hide();
					completeState.hide();
					nextStep.hide();
					remainingState.find('[data-widget-property=carousel-remaining-items]').empty();
					carousel.cycle();
					categorySection.removeClass('inline-category-module').insertAfter(carousel).show();
					confirmation = false;
					if(recount===1){
						carouselNext.hide();
						carouselEnd.show();
					} else {
						carouselNext.show();
					}
					activeState.show();
				});

				categories.find('.category-btn').on('click.cat',doCat);

				showAddBtn.click(function () {
				    addCategorySection.find('[data-widget-property=new-category-name]').val('');
					addCategorySection.slideDown();
				});

				addCategoryBtn.click(function (event) {
				    event.preventDefault();
				    if ($(addCategoryForm).valid()) {
				        removeErrors('[data-widget-property=add-category-section] .contextual-error');
				        addCategoryProcessingIndicator.show();
				        var newCategoryName = addCategorySection.find('[data-widget-property=new-category-name]').val();
				        var token = addCategorySection.find('input[name=__RequestVerificationToken]').val();
				        var formData = { Category: newCategoryName, __RequestVerificationToken: token };

					    $.ajax({
					        url: addCategoryForm.attr("action"),
					        dataType: "json",
					        data: formData,
					        type: "POST",
					        async: true,
					        success: function (data) {
					            addCategorySuccess(data, newCategoryName);
					        },
                            error: addCategoryError
					    });
					}
				});

				node.find('[data-widget-property=categorize-remaining-items] .transaction, [data-widget-property=categorize-complete-items] .transaction').live('click',function(){
					var category = '';
					remainingState.find('.category-edit').html(editLabel).removeClass('open');
					completeState.find('.category-edit').html(editLabel).removeClass('open');
					addCategoryContextualError.removeClass('.field-validation-error').addClass('hidden').find("ul").html('');

					if($(this).hasClass('open')){
						$(this).removeClass('open').find('.category-edit').html(editLabel);
						categorySection.slideUp();
					} else {
						if(node.find('.transaction.open').length!==0){
							categorySection.hide();
							node.find('.transaction.open').removeClass('open');
						}

						categories.find('.category-btn').removeClass('btn-primary');
						$(this).addClass('open');

						if($(this).find('.category-label').length!==0){
							category = $(this).find('.category-label').text();
							categories.find('.category-btn').each(function(){
								if($(this).val()===category) $(this).removeClass('.btn-secondary').addClass('btn-primary');
							});
						}

						categorySection.insertAfter($(this)).slideDown();
						$(this).find('.category-edit').html(categorySection.attr('data-property-close-label'));
					}
				});

				function doCat(){
					categories.find('.category-btn').off('click.cat');
					quickCategorize($(this),true);
				}

				function quickCategorize(item, recategorize) {
				    var transactionId;
				    var form = item.closest('form');
				    var token = form.find('input[name=__RequestVerificationToken]').val();
                    if (item.closest('.category-module').hasClass('inline-category-module')) {
                        transactionId = item.closest('.category-module').prev().attr('data-transaction-id');
                    } else {
                        transactionId = carousel.find('.cycle-slide-active').attr('data-transaction-id');
                    }
				    var formData = { CategoryId: item.next().val(), TransactionId: transactionId, __RequestVerificationToken: token };

				    categories.find('.btn-primary').removeClass('btn-primary').addClass('btn-secondary');
				    item.removeClass('btn-secondary').addClass('btn-primary');

				    HW.ProcessingOverlay.show(item.closest('.quick-categorize-section'));
				    removeCategorizationError();

				    $.ajax({
				        url: form.attr('action'),
				        dataType: "json",
				        data: formData,
				        type: "POST",
				        async: true,
				        success: function(data) {
				            categorizeTransactionSuccess(data, recategorize, item);
				        },
                        error:function(data) {
                            categorizeTransactionError(data, item);
                        }
				    });
				}

				function endCarousel(){
					carousel.cycle('destroy');
				    var categorized = activeState.find('.category-label').length + completeState.find('.category-label').length,
						remaining = 0;

					activeState.find('.transaction').each(function(){
						if($(this).find('.category-label').length===0){
							$(this).appendTo(remainingState.find('[data-widget-property=categorize-remaining-items]'));
							$(this).find('.trans-area-left').append('<p class="category-label" style="display: block;">'+categorySection.attr('data-property-new-label')+'</p>');
							remaining++;
						} else {
							$(this).prependTo(completeState.find('[data-widget-property=categorize-complete-items]')).find('.category-label').append('<span class="category-edit">'+editLabel+'</span>');
						}
					});
					activeState.hide();
					nextStep.show();
					categorySection.hide().addClass('inline-category-module').insertAfter(remainingState.find('[data-widget-property=categorize-remaining-items]'));
					categorySection.find('.btn-primary').removeClass('btn-primary').addClass('btn-secondary');
					addCategorySection.hide();

					if(remaining===0){
						completeState.find('[data-widget-property=categorize-complete-progress]').hide();
						completeState.show().find('[data-widget-property=categorize-complete-status]').show();
					} else {
						remainingState.find('[data-widget-property=categorize-remaining-count]').text(remaining);
						completeState.find('[data-widget-property=categorize-complete-count]').text(categorized);

						remainingState.show();
						if(remaining!==transactions.length) completeState.show();
					}
				}

				function addCategorySuccess(data, newCategoryName) {
				    categories.find('.category-btn').off('click.cat');
				    addCategoryProcessingIndicator.hide();
                    if (data.status == "OK") {
                        showAddBtn.before('<div><input class="category-btn btn-secondary new-category-btn" type="button" value="' + newCategoryName + '"><input id="CategoryId" type="hidden" value="' + data.categoryId + '"></div>');

                        categories.find('.category-btn').sort(function (a, b) {
                            return $(a).val().toLowerCase().localeCompare($(b).val().toLowerCase());
                        }).each(function () {
                            categories.find('form').append($(this).parent('div'));
                        });
                        showAddBtn.appendTo(categories);

                        quickCategorize($('.new-category-btn'), false);
                        addCategorySection.hide();

                        if (categories.find('.category-btn').length === maxLength) showAddBtn.hide();
                    } else {
                        showErrors(data.errors, addCategoryContextualError);
                    }
                }

                function addCategoryError(data) {
                    addCategoryProcessingIndicator.hide();
                    showErrors(data.errors, addCategoryContextualError);
                }

                function categorizeTransactionSuccess(data, recategorize, item) {
                    categories.find('.category-btn').on('click.cat', doCat);
                    HW.ProcessingOverlay.hide(item.closest('.quick-categorize-section'));
                    if (data.status == "OK") {
                        if (recategorize === false) item.removeClass('new-category-btn');
                        if (categorySection.hasClass('inline-category-module')) confirmation = true;

                        if (confirmation === true) {
                            categorySection.prev().find('.category-label').hide().html('<span data-widget-property="category-label">' + item.val() + '</span> <span class="category-edit" data-widget-role="edit-btn">' + editLabel + '</span>').fadeIn();
                            setTimeout(function () {
                                categorySection.hide().find('.category-btn').removeClass('btn-primary').addClass('btn-secondary');
                            }, 1000);
                        } else {
                            if (activeState.find('.cycle-slide-active .category-label').length === 0) {
                                $('<p class="category-label"><span data-widget-property="category-label">' + item.val() + '</span></p>').hide().appendTo('.cycle-slide-active .trans-area-left').fadeIn();
                            } else {
                                activeState.find('.cycle-slide-active .category-label').hide().text(item.val()).fadeIn();
                            }
                        }

                        setTimeout(function () {
                            if (confirmation === true) {
                                if (categorySection.parent().attr('data-widget-property') === 'categorize-remaining-items') {
                                    categorySection.prev().prependTo(completeState.find('[data-widget-property=categorize-complete-items]'));
                                    completeState.show();
                                    var remaining = remainingState.find('.transaction').length;
                                    if (remaining === 0) {
                                        remainingState.hide();
                                        completeState.find('[data-widget-property=categorize-complete-progress]').hide();
                                        completeState.show().find('[data-widget-property=categorize-complete-status]').show();
                                    } else {
                                        remainingState.find('[data-widget-property=categorize-remaining-count]').text(remaining);
                                        completeState.find('[data-widget-property=categorize-complete-count]').text(completeState.find('.transaction').length);
                                    }
                                }
                            } else {
                                if (activeState.find('.cycle-slide-active').index() === (activeState.find('.cycle-slide').length - 1)) {
                                    endCarousel();
                                } else {
                                    carousel.cycle('next');
                                    activeState.find('.btn-primary').removeClass('btn-primary').addClass('btn-secondary');
                                }
                            }
                        }, 1000);
                    } else {
                        setTimeout(function() {
                            showErrors(data.errors, item.closest('.quick-categorize-section').find('.message.global-error'));
                        }, 300);

                        categories.find('.btn-primary').removeClass('btn-primary').addClass('btn-secondary');
                    }
                }

                function categorizeTransactionError(data, item) {
                    HW.ProcessingOverlay.hide(item.closest('.quick-categorize-section'));
                    setTimeout(function() {
                        showErrors(data.errors, item.closest('.quick-categorize-section').find('.message.global-error'));
                    }, 300);
                    categories.find('.btn-primary').removeClass('btn-primary').addClass('btn-secondary');
                    categories.find('.category-btn').on('click.cat', doCat);
                }

                function removeCategorizationError() {
                    var remainingErrorContainer = remainingState.find('.message.global-error');
                    remainingErrorContainer.removeClass('.field-validation-error').addClass('hidden').find("ul").html('');

                    var activeErrorContainer = activeState.find('.message.global-error');
                    activeErrorContainer.removeClass('.field-validation-error').addClass('hidden').find("ul").html('');

                    var completeErrorContainer = completeState.find('.message.global-error');
                    completeErrorContainer.removeClass('.field-validation-error').addClass('hidden').find("ul").html('');
                }
			}
		}

		HW.EditCategory = new function(){
			this.init = function(node){
				var editBtn = node.find('[data-widget-role=edit-btn]'),
					undoBtn = node.find('[data-widget-role=edit-category-undo]'),
					showAddBtn = node.find('[data-widget-role=show-add-category]'),
					addBtn = node.find('[data-widget-role=add-category-btn]'),
					maxLength = parseFloat(node.attr('data-property-max')),
					editLabel = editBtn.text(),
					closeLabel = node.attr('data-property-toggle'),
					label = node.find('[data-widget-property=category-label]'),
					labelSection = node.find('[data-widget-property=edit-category-label]'),
					addCategory = node.find('[data-widget-property=edit-category-add]'),
					similarLabel = node.find('[data-widget-property=category-similar-label]'),
					similar = node.find('[data-widget-property=edit-category-similar]'),
					complete = node.find('[data-widget-property=edit-category-complete]');

				editBtn.click(function () {
					if (labelSection.hasClass('open')===true) {
						labelSection.slideUp().removeClass('open');
						similar.hide();
						addCategory.hide();
			            editBtn.text(editLabel);
			        } else {
			        	if($('html').attr('data-current-breakpoint')==='small') $('body').animate({ scrollTop: $(this).offset().top - 20 }, 400);
			  			complete.hide();
			  			if($('html').attr('data-current-breakpoint')==='small') {
			  				labelSection.show().addClass('open');
			  			} else {
			  				labelSection.slideDown().addClass('open');
			  			}
			            editBtn.html(closeLabel);
			        }
				});

				labelSection.find('.category-btn').live('click',function(){
					addCategory.hide();
					complete.hide();
					categorizeItem($(this),true);
				});

				showAddBtn.click(function(){
					similar.hide();
					addCategory.fadeIn();
					if($('html').attr('data-current-breakpoint')==='small') $('body').animate({ scrollTop: addCategory.offset().top }, 400);
				});

				addBtn.click(function(){
					var newNameField = addCategory.find('[data-widget-property=new-category-name]'),
						newName = newNameField.val(),
						labelList = labelSection.find('[data-widget-property=category-label-list]');

					if(newName){
						newNameField.val('').removeClass('error').siblings('[data-error-for=category-name]').removeClass('active');
						showAddBtn.before('<input class="category-btn btn-secondary new-category-btn" type="button" value="'+newName+'">');

						//Reorder alphabetically
					    labelSection.find('.category-btn').sort(function(a, b) {
					        return $(a).val().toLowerCase().localeCompare($(b).val().toLowerCase());
					    }).each(function() {
					        labelList.append(this);
					    });
					    showAddBtn.appendTo(labelList);

						addCategory.hide();
						categorizeItem($('.new-category-btn'),false);

						//Max categories state
						if(labelSection.find('.category-btn').length===maxLength){
							showAddBtn.hide();
							labelSection.find('[data-widget-property=category-max-label]').show();
						}
					} else {
						newNameField.addClass('error').siblings('[data-error-for=category-name]').addClass('active');
					}
				});

				function categorizeItem(item,recategorize){
					var oldCategory = labelSection.find('.btn-primary'),
						breakpoint = $('html').attr('data-current-breakpoint');

				    oldCategory.removeClass('btn-primary').addClass('btn-secondary');
					item.removeClass('btn-secondary').addClass('btn-primary');
					if(recategorize===false) item.removeClass('new-category-btn');

				    if(label.length!==0){
				    	label.parent().hide();
				    	label.text(item.val()).parent().fadeIn();
				    } else {
						node.find('[data-widget-property=transaction]').append('<p class="category-label"><span data-widget-property="category-label">'+item.val()+'</span> <span class="category-edit" data-widget-role="edit-btn">'+editLabel+'</span></p>');
					}

					similarLabel.text(item.val());
					complete.hide();
					similar.slideDown();

					if(breakpoint==='small') $('body').animate({ scrollTop: similar.offset().top - 50 }, 400);

					similar.find('.btn-secondary').click(function(){
						complete.find('p').hide();
						if($(this).attr('data-property-similar')==='1'){
							complete.find('[data-widget-property=categorize-similar]').show();
						} else {
							complete.find('[data-widget-property=categorize-single]').show();
						}

						var process = $(this).siblings('[data-widget-role=inline-process]');
						process.show();

						//setTimeout for prototype
						setTimeout(function() {
						    process.hide();
						    if(breakpoint==='small') $('body').animate({ scrollTop: 0 }, 400);
						    labelSection.hide().removeClass('open');
						    editBtn.html(editLabel);
							similar.hide();
							complete.show();
						}, 1000);
					});

					undoBtn.click(function(){
						complete.hide();
						labelSection.find('.btn-primary').removeClass('btn-primary').addClass('btn-secondary');
						oldCategory.removeClass('btn-secondary').addClass('btn-primary');
						label.parent().hide();
						label.text(oldCategory.val()).parent().fadeIn();
						labelSection.slideDown().addClass('open');
						editBtn.html(closeLabel);
					});
				}
			}
		}


		HW.SetInline = new function(){
			this.init = function(node){
				var initialState = node.find('[data-widget-property=initial-state]'),
					initialEditState = node.find('[data-widget-property=initial-edit-state]'),
					editState = node.find('[data-widget-property=edit-state]'),
					viewState = node.find('[data-widget-property=view-state]'),
					deleteState = node.find('[data-widget-property=delete-state]'),
					setBtn = node.find('[data-widget-role=set-btn]'),
					initialCancelBtn = initialEditState.find('[data-widget-role=initial-cancel-btn]'),
					initialSaveBtn = initialEditState.find('[data-widget-role=initial-save-btn]'),
					cancelBtn = node.find('[data-widget-role=cancel-btn]'),
					saveBtn = node.find('[data-widget-role=save-btn]'),
					editBtn = node.find('[data-widget-role=edit-btn]'),
					deleteBtn = node.find('[data-widget-role=delete-btn]'),
					confirmDeleteBtn = node.find('[data-widget-role=confirm-delete-btn]'),
				    initialInlineProcessing = initialEditState.find('[data-widget-role=inline-process]'),
				    inlineProcessing = editState.find('[data-widget-role=inline-process]'),
                    deleteInlineProcessing = deleteState.find('[data-widget-role=inline-process]'),
				    limitAlertAndLimitTrackingSections = $('.limit-alerts-section, .limit-tracking'),
				    ajaxError = $("*[data-widget-type=max-spending-errorcontainer]");

				var monthlyLimit = $("#existingMaxLimitAmount").val().replace("$", "");

				if (parseInt(monthlyLimit) == 0) {
				    initialState.fadeIn();
				    viewState.hide();
				    editState.hide();
				    limitAlertAndLimitTrackingSections.hide();
				    $("#newMaxLimitAmount").val("");
				}

				setBtn.click(function () {
					initialState.hide();
					initialEditState.fadeIn();
				});

				initialCancelBtn.click(function () {
				    ajaxError.hide();
					initialEditState.hide();
					initialState.fadeIn();
				});

				cancelBtn.click(function () {
				    ajaxError.hide();
					editState.hide();
					deleteState.hide();
					viewState.fadeIn();
				});

				var format = function (num) {
				    var str = num.toString().replace("$", ""), parts = false, output = [], i = 1, formatted = null;
				    if (str.indexOf(".") > 0) {
				        parts = str.split(".");
				        str = parts[0];
				    }
				    str = str.split("").reverse();
				    for (var j = 0, len = str.length; j < len; j++) {
				        if (str[j] != ",") {
				            output.push(str[j]);
				            if (i % 3 == 0 && j < (len - 1)) {
				                output.push(",");
				            }
				            i++;
				        }
				    }
				    formatted = output.reverse().join("");
				    return ("$" + formatted + ((parts) ? "." + parts[1].substr(0, 2) : ""));
				};

				initialSaveBtn.click(function () {
				    var monthlyLimit = $('#newMaxLimitAmount').val().replace("$", "");
				    var currentForm = $('#newMaxLimitAmountForm');
				    var token = $('input[name=__RequestVerificationToken]').val();
				    var formData = { CategoryId: $('input#category-id').val(), CategoryLimit: monthlyLimit, __RequestVerificationToken: token };

				    ajaxError.hide();
				    if ($(currentForm).valid()) {
				        initialInlineProcessing.show();
				        $(currentForm).submit(function (ev) {
				            $.ajax({
				                url: P2P_PATH + 'Account/Pfm/UpdateCategoryLimitAndAlerts',
				                dataType: "json",
				                data: formData,
				                type: "POST",
				                async: true,
				                success: function (result) {
				                    if (result.status == "Success") {
				                        initialInlineProcessing.hide();
						                initialEditState.hide();
						                viewState.fadeIn();

						                var amountSpent = $('.bar-chart.capsule-chart.capsule-chart-category').attr('data-property-value');
						                var overOrLeftAmount = Math.round((monthlyLimit - amountSpent) < 0 ? -1 * (monthlyLimit - amountSpent) : (monthlyLimit - amountSpent));

						                $('#track-spending-amount').text(format(overOrLeftAmount));
						                var bar = $('.bar-chart').find(".bar-fill");
						                var per = Math.min(Math.max(0, amountSpent / monthlyLimit), 1);
						                bar.css("width", "" + parseInt(per * 100) + "%");

						                if (per >= 1 && parseInt(amountSpent) > parseInt(monthlyLimit)) {
						                    bar.addClass("over-limit full");
						                    $('.limit-tracking .field-value p').text(format(overOrLeftAmount) + ' over');
						                } else if (per == 1 && parseInt(amountSpent) == parseInt(monthlyLimit)) {
						                    bar.removeClass("over-limit");
						                    bar.addClass("full");
						                    $('.limit-tracking .field-value p').text(format(overOrLeftAmount) + ' left to spend');
						                } else {
						                    bar.removeClass("over-limit full");
						                    $('.limit-tracking .field-value p').text(format(overOrLeftAmount) + ' left to spend');
						                }

						                limitAlertAndLimitTrackingSections.fadeIn();
						                node.find('[data-widget-role=maxLimit-initial]').text(format(parseInt(monthlyLimit)));
				                        $('#existingMaxLimitAmount').val(monthlyLimit);
				                    }
				                    else {
				                        ajaxError.html(AppendError(result.errors));
				                        ajaxError.show();
				                        initialInlineProcessing.hide();
				                    }
				                }
				            });
				            ev.preventDefault();
				            $(currentForm).unbind('submit');
				        });
				        $(currentForm).submit();
				    }
				});

				saveBtn.click(function () {
				    var monthlyLimit = $('#existingMaxLimitAmount').val().replace("$", "");
				    var currentForm = $('#existingMaxLimitAmountForm');
				    var token = $('input[name=__RequestVerificationToken]').val();
				    var formData = { CategoryId: $('input#category-id').val(), CategoryLimit: monthlyLimit, __RequestVerificationToken: token };

				    ajaxError.hide();
				    if ($(currentForm).valid()) {
				        inlineProcessing.show();
				        $(currentForm).submit(function (ev) {
				            $.ajax({
				                url: P2P_PATH + 'Account/Pfm/UpdateCategoryLimitAndAlerts',
				                dataType: "json",
				                data: formData,
				                type: "POST",
				                async: true,
				                success: function (result) {
				                    if (result.status == "Success") {
				                        inlineProcessing.hide();
				                        editState.hide();
				                        node.find('[data-widget-role=maxLimit-initial]').text(format(parseInt(monthlyLimit)));
				                        viewState.fadeIn();

				                        var amountSpent = $('.bar-chart.capsule-chart.capsule-chart-category').attr('data-property-value');
				                        var overOrLeftAmount = Math.round((monthlyLimit - amountSpent) < 0 ? -1 * (monthlyLimit - amountSpent) : (monthlyLimit - amountSpent));

				                        limitAlertAndLimitTrackingSections.show();
				                        $('#track-spending-amount').text(format(overOrLeftAmount));
				                        var bar = $('.bar-chart').find(".bar-fill");
				                        var per = Math.min(Math.max(0, amountSpent / monthlyLimit), 1);
				                        bar.css("width", "" + parseInt(per * 100) + "%");

				                        if (per >= 1 && parseInt(amountSpent) > (monthlyLimit)) {
				                            bar.addClass("over-limit full");
				                            $('.limit-tracking .field-value p').text(format(overOrLeftAmount) + ' over');
				                        } else if (per == 1 && parseInt(amountSpent) == parseInt(monthlyLimit)) {
				                            bar.removeClass("over-limit");
				                            bar.addClass("full");
				                            $('.limit-tracking .field-value p').text(format(overOrLeftAmount) + ' left to spend');
				                        } else {
				                            bar.removeClass("over-limit full");
				                            $('.limit-tracking .field-value p').text(format(overOrLeftAmount) + ' left to spend');
				                        }
				                    }
				                    else {
				                        ajaxError.html(AppendError(result.errors));
				                        ajaxError.show();
				                        inlineProcessing.hide();
				                    }
				                }
				            });
				            ev.preventDefault();
				            $(currentForm).unbind('submit');
				        });
				        $(currentForm).submit();
				    }
				    else {
				        editState.find('[data-widget-role=inline-process]').hide();
				    }
				});

				editBtn.click(function () {
					viewState.hide();
					editState.fadeIn();
				});

				deleteBtn.click(function () {
					viewState.hide();
					deleteState.fadeIn();
				});

				confirmDeleteBtn.click(function () {
				    ajaxError.hide();
				    deleteInlineProcessing.show();
				    var form = $(this).closest('form');
				    var limit = $('#existingMaxLimitAmount').val().replace("$", "");

				    $.ajax({
				        url: form.attr('action'),
				        dataType: "json",
				        data: { categoryId: $('.category-id').val(), CategoryLimit: limit, "__RequestVerificationToken": form.find('input[name=__RequestVerificationToken]').val() },
				        type: "POST",
				        async: true,
				        success: function (result) {
				            if (result.status == "Success") {
				                deleteInlineProcessing.hide();
						        deleteState.hide();
						        initialState.fadeIn();
						        $("#newMaxLimitAmount").val("");
						        limitAlertAndLimitTrackingSections.hide();
				            }
				            else {
				                ajaxError.html(AppendError(result.errors));
				                ajaxError.show();
				                deleteInlineProcessing.hide();
				            }
				        }
				    });
				});
			}
		}


		HW.SetCategoryInline = new function () {
		    this.init = function (node) {
		        var initialState = node.find('[data-widget-property=initial-state]'),
					initialEditState = node.find('[data-widget-property=initial-edit-state]'),
					editState = node.find('[data-widget-property=edit-state]'),
					viewState = node.find('[data-widget-property=view-state]'),
					deleteState = node.find('[data-widget-property=delete-state]'),
					setBtn = node.find('[data-widget-role=set-btn]'),
					initialCancelBtn = initialEditState.find('[data-widget-role=initial-cancel-btn]'),
					initialSaveBtn = initialEditState.find('[data-widget-role=initial-save-btn]'),
					cancelBtn = node.find('[data-widget-role=cancel-btn]'),
					saveBtn = node.find('[data-widget-role=save-btn]'),
					editBtn = node.find('[data-widget-role=edit-btn]'),
                    editNameBtn = node.find('[data-widget-role=edit-name-btn]'),
                    editInlineProcessing = editState.find('[data-widget-role=inline-process]'),
					ajaxError = $('*[data-widget-type=rename-category-errorcontainer]'),
                    renameField = editState.find('[data-widget-property=edit-field]'),
                    categoryTitle = $('#category-title');


		        setBtn.click(function () {
		            $("#newMaxLimitAmount").val("0");
		            initialState.hide();
		            initialEditState.fadeIn();
		        });

		        initialCancelBtn.click(function () {
		            ajaxError.hide();
		            initialEditState.hide();
		            initialState.fadeIn();
		        });

		        cancelBtn.click(function () {
		            closeWidget();
		        });

		        var closeWidget = function () {
		            ajaxError.hide();
		            editState.hide();
		            deleteState.hide();
		            viewState.fadeIn();
		        };

		        initialSaveBtn.click(function () {
		            ajaxError.hide();
		            initialEditState.find('[data-widget-role=inline-process]').show();

		            //setTimeout for prototype
		            setTimeout(function () {
		                initialEditState.find('[data-widget-role=inline-process]').hide();
		                initialEditState.hide();
		                viewState.fadeIn();
		                $('.limit-alerts-section, .limit-tracking').fadeIn();
		            }, 1000);
		        });

		        saveBtn.click(function(e) {
		            e.preventDefault();
		            var newCategoryName = $('input#text-category-name').val();
		            var previousCategoryName = $('#category-title').html(); //current category name value
		            var currentForm = $('#renameCategoryForm');
		            var token = $('input[name=__RequestVerificationToken]').val();
		            var formData = { CategoryId: $('input#category-id').val(), CategoryName: newCategoryName, __RequestVerificationToken: token };
		            if (newCategoryName.toLowerCase() == previousCategoryName.toLowerCase()) {
		                closeWidget();
		            } else {
		                ajaxError.hide();
		                if ($(currentForm).valid()) {
		                    editInlineProcessing.show();
		                    $(currentForm).submit(function(ev) {
		                        $.ajax({
		                            url: P2P_PATH + 'Account/Pfm/RenameCategory',
		                            dataType: "json",
		                            data: formData,
		                            type: "POST",
		                            async: true,
		                            success: function(result) {
		                                if (result.status == "Success") {
		                                    editInlineProcessing.hide();
		                                    editState.find('[data-widget-role=inline-process]').hide();
		                                    editState.hide();
		                                    node.find('[data-widget-role=categoryName-initial]').text(newCategoryName);
		                                    categoryTitle.text(newCategoryName);
		                                    viewState.fadeIn();
		                                } else {
		                                    $('#nameErrorList').removeClass('hidden').addClass('field-validation-error').html(result.errors);
		                                    editInlineProcessing.hide();
		                                }
		                            }
		                        });
		                        ev.preventDefault();
		                        $(currentForm).unbind('submit');
		                    });
		                    $(currentForm).submit();
		                }
		            }
		        });

		        renameField.on("keyup", function (event) { removeErrors('#nameErrorList') });
		        editBtn.click(function () {
		            $('input#text-category-name').val(node.find('[data-widget-role=categoryName-initial]').text());
		            $('input#text-category-name').addClass('prefill');
		            viewState.hide();
		            editState.fadeIn();
		        });
			}
		}


		HW.SetAlerts = new function(){
			this.init = function(node){
				var initialState = node.find('[data-widget-property=initial-state]'),
					editState = node.find('[data-widget-property=edit-state]'),
					viewState = node.find('[data-widget-property=view-state]'),
					setBtn = node.find('[data-widget-role=set-btn]'),
					initialCancelBtn = node.find('[data-widget-role=initial-cancel-btn]'),
					initialSaveBtn = node.find('[data-widget-role=initial-save-btn]'),
					cancelBtn = node.find('[data-widget-role=cancel-btn]'),
					saveBtn = node.find('[data-widget-role=save-btn]'),
					editBtn = node.find('[data-widget-role=edit-btn]'),
					nearLimit = node.find('[data-widget-role=near-limit]'),
					process = node.find('[data-widget-role=inline-process]'),
					error = node.closest('[data-error-for=transfer-amount]');

				setBtn.click(function(){
					initialState.hide();
					editState.fadeIn();
				});

				initialCancelBtn.click(function(){
					editState.hide();
					initialState.fadeIn();
				});

				initialSaveBtn.click(function(){
					process.show();

					//setTimeout for prototype
					setTimeout(function(){
						process.hide();
						editState.hide();
						viewState.fadeIn();
						node.find('[data-widget-property=initial-prompt-actions]').hide();
						node.find('[data-widget-property=prompt-actions]').show();
					}, 1000);
				});

				editBtn.click(function(){
					viewState.hide();
					editState.fadeIn();
				});

				cancelBtn.click(function(){
					error.hide();
					editState.hide();
					viewState.fadeIn();
				});

				saveBtn.click(function(){
					process.show();

					//setTimeout for prototype
					setTimeout(function(){
						process.hide();
						editState.hide();
						viewState.fadeIn();
					}, 1000);
				});

				nearLimit.change(function(){
					var editor = node.find('[data-widget-property=limit-editor]');
					if(editor.hasClass('disabled')) {
						editor.removeClass('disabled');
						node.find('[data-widget-property=amount-slider-button]').bind();
				        node.find('[data-widget-property=amount-slider-scale] input').attr('disabled',false).addClass('prefill');
				        var slider = node.find('[data-widget-type=amount-slider]');
				        HW.Slider.init(slider);
				    } else {
				        editor.addClass('disabled');
						node.find('[data-widget-property=amount-slider-button]').unbind();
				        node.find('[data-widget-property=amount-slider-scale] input').attr('disabled',true).removeClass('prefill');
				    }
				});
			}
		}

		HW.ToggleTabs = new function(){
			this.init = function(node) {
				var sectionTabs = node.find('[data-widget-role=insight-tab-content]'),
					sectionHeadings = node.find('[data-widget-role=insight-tab-heading]'),
					sectionTabList = node.find('[data-widget-role=insight-tab-list]').children();

				//Small breakpoint
				sectionHeadings.click(function(){
					if($(this).hasClass('closed')){
						sectionHeadings.addClass('closed');
						sectionTabs.slideUp();
						sectionTabList.removeClass('active').eq($(this).index()-1).addClass('active');
						$(this).removeClass('closed').next().slideDown();
						if($(this).eq(2)) {
							if($('[data-widget-role=spend-history-bar-chart]').highcharts()){
								$('[data-widget-role=spend-history-bar-chart]').highcharts().destroy();
								HW.SpendHistoryChart.init($('[data-widget-type=spend-history]'));
							}
						}
						$('body').animate({ scrollTop: node.offset().top },400);
					}
				});

				//Large breakpoint
				sectionTabList.click(function(){
					if(!$(this).hasClass('active')){
						sectionTabList.removeClass('active');
						$(this).addClass('active');
						sectionTabs.hide();
						sectionTabs.eq($(this).index()).fadeIn();

						//Animations specific to Insights tabs
						if($(this).index()===1) {
							sectionTabs.eq(1).find('.bar-fill').each(function(){
							    var width = $(this)[0].style.width;
								$(this).css('width', 0).delay(400).animate({ 'width': width}, 400);
							});
					    }

						if($(this).is(':last-child')) {
							if($('[data-widget-role=spend-history-bar-chart]').highcharts()){
								$('[data-widget-role=spend-history-bar-chart]').highcharts().destroy();
								HW.SpendHistoryChart.init($('[data-widget-type=spend-history]'));
							}
						}
					}
				});
			}
		}

		HW.PiePlaceholder = new function(){
			this.init = function(node) {
			    var chart,
			        colors = Highcharts.piePlaceholerTheme.colors,
			        data = [];

			    var dataValue = Math.floor(100 / Highcharts.LegendLength);

			    for (var i = 0; i < pieChartLegendLength; i++) {
			        data[i] = dataValue;
			    }

				Highcharts.setOptions(Highcharts.piePlaceholerTheme);

				node.find('[data-widget-role=pie-chart-legend] li span:first-child').each(function(i){
					$(this).css({'background-color':colors[i],'color':colors[i],'border-right':'7px solid '+colors[i]});
				});

			    chart = new Highcharts.Chart({
					chart: { renderTo: node.find('[data-widget-role=pie-chart]')[0], spacing: 0, margin: 0, padding: 0, backgroundColor: '#fff' },
			        legend: { enabled: false },
			        title: { text: null },
			        credits: { enabled: false },
			        tooltip: { enabled: false },
			        plotOptions: { pie: { allowPointSelect: false, dataLabels: { enabled: false } } },
			        series: [{ type: 'pie', name: null, innerSize: '70%', data: data, states: { hover: { enabled: false } } }]
				});
			}
		}

		HW.PieChart = new function(){
			this.init = function(node){

				node.removeClass("unloaded");

				var categorySpend = 0,
					spendTotal = node.find('[data-widget-property=pie-chart-total]').text(),
					spendTotalNum = parseFloat(spendTotal.replace('$','').replace(',','')),
					legendItem = node.find('[data-widget-role=pie-chart-legend]').children(),
					legendItemAmount = legendItem.find('.category-spend-amount'),
					categoryTotal = legendItem.length,
					totalSpend = node.find('[data-widget-property=pie-chart-total]'),
					label = node.find('[data-widget-property=pie-chart-category]'),
					originalLabel = label.text(),
					pieData = [],
					seriesData = [],
					chart;

				//Apply the theme from highcharts-themes.js
				var opts = Highcharts.setOptions(Highcharts.pieTheme);

				legendItemAmount.each(function(i){
					categorySpend = parseFloat($(this).text().replace('$','').replace(',',''));
					pieData.push(categorySpend);
					seriesData.push([$(this).text(),(categorySpend/spendTotalNum)*100]);
					//For mobile, we multiply by 300 to provide good visual contrast between amounts
					$(this).css({'height':(categorySpend/spendTotalNum)*300+'px','background-color':opts.colors[i],'border-right':'7px solid '+opts.colors[i]});
				});

			    chart = new Highcharts.Chart({
					chart: { renderTo: node.find('[data-widget-role=pie-chart]')[0], spacing: 0, margin: 0, padding: 0, backgroundColor: '#fff' },
			        legend: { enabled: false },
			        title: { text: null },
			        credits: { enabled: false },
			        tooltip: { enabled: false },
			        plotOptions: { pie: { allowPointSelect: false, dataLabels: { enabled: false } } },
			        series: [{ type: 'pie', name: null, innerSize: '70%', data: seriesData, states: { hover: { enabled: false } },
			        	point: {
				        	events: {
				                mouseOver: function () {
				        					this.graphic.attr('fill', opts.colors[this.x]);
				                	legendItemAmount.eq(this.x).removeClass('inactive');
				                	if(Math.floor(this.y)===0 || isNaN(this.y)){
				                		totalSpend.text('<1%');
				                	} else {
				                		totalSpend.text(Math.floor(this.y)+'%');
				                	}
				                	label.text(legendItemAmount.eq(this.x).next().text());
				                },
				                mouseOut: function () {
				                	legendItemAmount.eq(this.x).addClass('inactive');
				                	totalSpend.text(spendTotal);
				                	label.text(originalLabel);
				                }
				            }
				        }, events : {
				        	mouseOver: function () { animatePie(this,true) },
				        	mouseOut: function () { animatePie(this,false) }
				        }
			        }]
					});

					var animatePie = function(series,state){
						$.each(series.points, function(i){
							if(state===true){
								this.graphic.attr({ fill: hoverColors[i] });
							} else {
								this.graphic.attr({ fill: opts.colors[i] });
							}
				    });
					};

			    legendItem.hover(function(){
			    	var curr = $('html').attr('data-current-breakpoint');
			    	if(curr!=='small' && curr!=='medium'){
				    	var legendIndex = $(this).index(),
				    		activeLabel = legendItemAmount.eq(legendIndex);

						activeLabel.toggleClass('inactive');

						if(!activeLabel.hasClass('inactive')){
							animatePie(chart.series[0],true);
					        chart.series[0].points[legendIndex].graphic.attr("fill", opts.colors[legendIndex]);
					        var percentage = Math.floor(chart.series[0].points[legendIndex].y);
					        if(percentage===0 || isNaN(percentage)){
					        	totalSpend.text('<1%');
					        } else {
					        	totalSpend.text(percentage+'%');
					        }
					        label.text(activeLabel.next().text());
						} else {
					    animatePie(chart.series[0],false);
							totalSpend.text(spendTotal);
							label.text(originalLabel);
						}
					}
			  });
			}
		}

		HW.SpendHistoryChart = new function(){
			var me = this;

			this.init = function(node){
				if(Hudson.hasSVG){
					me.generateChart(node);
				}else{
					node.find('[data-widget-property=spend-history-amounts]').addClass("table");
					node.find('.spend-history-chart').hide(0);
					if(node.find('[data-widget-property=spend-history-amounts]').hasClass("inactive")) return;

					var num = node.find(".table").find("li").length;

					var resizeTable = function(){
						var curr = $("html").attr("data-current-breakpoint");
						node.find(".table").find("li").show(0);
						if(curr == "small" || curr == "medium"){
							node.find(".table").find("li").each(function(i,n){
								if(num - i > 4){
									$(n).hide(0);
								}
							});
						}else{
							node.find(".table").find("li").each(function(i,n){
								if(num - i > 6){
									$(n).hide(0);
								}
							});
						}
					}

					$(window).resize(resizeTable);

					resizeTable();
				}
			}

			this.generateChart = function(node){
				var months = node.find('[data-widget-property=spend-history-amounts]').children(),
					monthCount = months.length,
					spendAmounts = [],
					spendAmountsSmall = [],
					spendMonths = [],
					spendMonthsSmall = [],
					amountArray = spendAmounts,
					monthArray = spendMonths,
					labelStatus = true,
					maxValue = null,
					hoverStatus = false,
					xLabelStep = 1,
					yAxisWidth = 1,
					yAxisLabels = true,
					chartHeight = null,
					chartOption = node.attr('data-property-version'),
					colMax = node.attr('data-property-max'),
					chartSize = $('html').attr('data-current-breakpoint');

				months.each(function(){
					spendAmounts.push(parseFloat($(this).find('.spend-amount').text().replace('$','').replace(',','')));
					spendMonths.push($(this).find('.spend-month').text());
				});

				if(node.attr('data-property-status')==='disabled') maxValue = 5000;

				if(chartOption==='category'){
					yAxisWidth = 0;
					yAxisLabels = false;
					chartHeight = 120;
					if(monthCount>6) xLabelStep = 2;
				}

				if(chartSize==='small' || chartSize==='medium'){
					yAxisWidth = 0;
					yAxisLabels = false;
					hoverStatus = false;
				} else {
					if(monthCount>6){
						labelStatus = false;
						hoverStatus = true;
					}
				}

				if(monthCount>4){
					for(var j=monthCount-1;j>monthCount-5;j--){
						spendAmountsSmall.push(spendAmounts[j]);
						spendMonthsSmall.push(spendMonths[j]);
					}
					spendAmountsSmall.reverse();
					spendMonthsSmall.reverse();
					if(chartSize==='small' || chartSize==='medium'){
						amountArray = spendAmountsSmall;
						monthArray = spendMonthsSmall;
						xLabelStep = 1;
					}
				}

				//Apply the theme from highcharts-themes.js
				Highcharts.setOptions(Highcharts.columnTheme);

				var chart = new Highcharts.Chart({
				    chart: { renderTo: node.find('[data-widget-role=spend-history-bar-chart]')[0], type: 'column', height: chartHeight, spacingTop: 20 },
				    legend: { enabled: false },
				    credits: { enabled: false },
				    title: { text: null },
				    xAxis: { labels: { maxStaggerLines: 1, y: 25, step: xLabelStep }, tickLength: 10, tickmarkPlacement: 'on', categories: monthArray },
				    yAxis: { max: maxValue, gridLineWidth: 0, lineWidth: yAxisWidth, tickWidth: yAxisWidth, tickLength: 7, title: { text: null }, labels: { enabled: yAxisLabels, format: '${value}' } },
				    tooltip: { enabled: hoverStatus, backgroundColor: 'none', borderColor: 'none', headerFormat: '', shadow: false,
					    formatter: function(){
							if(this.point.x===monthCount-1) {
								return '<span style="color: '+chart.options.labelColor+';">$'+ this.y +'</span>';
							} else {
								return '$'+ this.y;
							}
						},
						positioner:
				    		function (boxWidth, boxHeight, point) {
					    		if(chartOption==='category') {
					    			return { x: point.plotX-20, y: -10 };
					    		} else {
					    			return { x: point.plotX+28, y: 0 };
					    		}
				    		}
				    	},
				    plotOptions: { column: { groupPadding: 0.1, pointPadding: 0, borderWidth: 0, dataLabels: { enabled: labelStatus, crop: false, overflow: 'none', x: -0.1, y: -5, format: '${y}' } } },
				    series: [{ name: null, data: amountArray, borderRadius: Highcharts.borderRadiusStyle, states: { hover: { enabled: hoverStatus } } }]
				});



				var l = chart.series[0].points.length,
					offset = 1;

				if (chart.series[0].points.length > 0) {
				    if (l === 3) {
				        if (chart.series[0].points[2].y === 0) {
						offset = 2;
				            if (chart.series[0].points[1].y === 0) offset = 3;
					}
				        for (var i = 0; i < 3; i++) {
						chart.series[0].data[i].dataLabel.css({ fontSize: '16px' });
				            if (chart.series[0].points[i].y === 0) {
							var chartFactor = 25;
				                if (chartOption === 'category') { chartFactor = 10; }
				                chart.series[0].data[i].update({ y: chart.yAxis[0].max / chartFactor, color: chart.options.inactiveColor });
							chart.series[0].data[i].dataLabel.hide();
						} else {
				                if (chart.series[0].points[l - offset].y >= colMax) {
				                    chart.series[0].data[l - offset].update({ color: '#ff5300' });
				                    chart.series[0].data[l - offset].dataLabel.css({ color: '#ff5300' });
                            } else {
				                    chart.series[0].data[l - offset].update({ color: chart.options.labelColor });
				                    chart.series[0].data[l - offset].dataLabel.css({ color: chart.options.labelColor });
                            }
						}
					}
				} else {
				        if (chart.series[0].points[l - offset].y >= colMax) {
				            chart.series[0].data[l - offset].update({ color: '#ff5300' });
				            chart.series[0].data[l - offset].dataLabel.css({ color: '#ff5300' });
                    } else {
				            chart.series[0].data[l - offset].update({ color: chart.options.labelColor });
				            if (l < 7) chart.series[0].data[l - offset].dataLabel.css({ color: chart.options.labelColor });
				        }
                    }
				}

				$(window).resize(function(){
					var curr = $('html').attr('data-current-breakpoint'),
						chart = $('[data-widget-role=spend-history-bar-chart]').highcharts();
				    if(curr==='small' || curr==='medium'){
				    	chart.yAxis[0].update({ lineWidth: 0, tickWidth: 0, labels : { enabled: false } });
				    	if(monthCount>6) chart.tooltip.options.enabled = false;
				        if(monthCount>4){
					        chart.series[0].options.dataLabels.enabled = true;
					        chart.series[0].setData(spendAmountsSmall);
					        chart.xAxis[0].setCategories(spendMonthsSmall);
					        chart.xAxis[0].update({ labels: { step: 1  } });
					        chart.series[0].data[3].update({ color: chart.options.labelColor });
					        chart.series[0].data[3].dataLabel.css({ color: chart.options.labelColor });
				        }
				    } else {
				    	if(chartOption==='overview') chart.yAxis[0].update({ lineWidth: 1, tickWidth: 1, labels : { enabled: true } });
				        if(monthCount>4){
					        chart.series[0].setData(spendAmounts);
					        chart.xAxis[0].setCategories(spendMonths);
					        if(monthCount>6) {
					    		chart.tooltip.options.formatter = function() {
									if(this.point.x===monthCount-1) {
										return '<span style="color: '+chart.options.labelColor+';">$'+ this.y +'</span>';
									} else {
										return '$'+ this.y;
									}
								};
					    		chart.xAxis[0].update({ labels: { step: xLabelStep } });
					    		chart.series[0].options.dataLabels.enabled = false;
					    	}
				        }
				    }
				    chart.redraw();
				});
			}
		}

		HW.AddLimitCategory = new function () {
		    this.init = function (node) {
		        var viewState = node.find('[data-widget-property=view-state]'),
					editState = node.find('[data-widget-property=edit-state]'),
					editField = editState.find('[data-widget-property=edit-field]'),
					editBtn = node.find('[data-widget-role=edit-btn]'),
					saveBtn = node.find('[data-widget-role=save-btn]'),
					cancelBtn = node.find('[data-widget-role=cancel-btn]'),
					defaultPrompt = node.attr('data-property-prompt'),
					maxLength = parseFloat(node.attr('data-property-max')),
					process = node.find('[data-widget-role=inline-process]');

		        editState.hide();

		        function showViewState() {
		            editState.hide();
		            viewState.fadeIn();
		        }

		        editBtn.click(function () {
		            editField.val('');
		            process.hide();
		            viewState.hide();
		            editState.fadeIn();
		        });

		        saveBtn.on("click", function (event) {
		            var form = $(this).closest('form');
		            if ($(form).valid()) {
		                event.preventDefault();
		                process.show();
		                $.ajax({
		                    url: P2P_PATH + 'Account/Pfm/AddCategory',
		                    dataType: "json",
		                    data: $(form).serialize(),
		                    type: "POST",
		                    async: true,
		                    success: function (data) {
		                        if (data.status == "OK") {
		                            process.hide();
		                            showViewState();
		                            var editUrl = data.categoryUrl + "/?categoryId=" + data.categoryId;
		                            node.before('<div class="limit-category cat-new"><h4>' + editField.val() + '</h4><div class="bar-chart capsule-chart" data-widget-type="bar-chart" data-property-value="0"><div class="bar-fill" data-widget-property="bar-fill"></div><span class="capsule-divider"></span></div><p class="limit-settings"><a href="' + editUrl + '">' + defaultPrompt + '</a></p></div>');
		                            var numLimits = $('.limit-category').length - 1;
		                            if (numLimits % 2 === 0 && numLimits !== maxLength) { node.before('<div class="PFMruleset full-width" style="clear: left"><div class="rule solid"></div></div>'); }
		                            if (numLimits === maxLength) node.hide();

		                            if (!editField.val()) {
		                                editField.siblings('.contextual-error').show();
		                            } else {
		                                editField.siblings('.contextual-error').hide();
		                                process.show();
		                            }
		                        }
		                        else {
		                            //debugger;
		                            process.hide();
		                            $('#insightsnameErrorList').removeClass('hidden').addClass('field-validation-error').html(data.errors);
		                        }
		                    }
		                });
		            }
		        });
		        cancelBtn.click(function () {
		            cancelAddCategoryLimitForm(event);
		            showViewState();
		        });

		        editField.on("keyup", function (event) { removeErrors('#insightsnameErrorList') });
		    }
		}

		var cancelAddCategoryLimitForm = function (event) {
		    event.preventDefault ? event.preventDefault() : event.returnValue = false;
		    cancelWidgetRemoveErrors('.insightsaddcategory-name-form', '#insightsnameErrorList', '.InsightsAddCategory-validation-message');
		};

		HW.AddCategory = new function(){
		    this.init = function(node){
		        var viewState = node.find('[data-widget-property=view-state]'),
                            editState = node.find('[data-widget-property=edit-state]'),
                            editField = editState.find('[data-widget-property=edit-field]'),
                            editBtn = node.find('[data-widget-role=edit-btn]'),
                            saveBtn = node.find('[data-widget-role=save-btn]'),
                            cancelBtn = node.find('[data-widget-role=cancel-btn]'),
                            defaultStatus = node.attr('data-property-status'),
                            alertStatus = node.attr('data-property-alert-status'),
                            defaultPrompt = node.attr('data-property-prompt'),
                            maxLength = parseFloat(node.attr('data-property-max')),
                            process = node.find('[data-widget-role=inline-process]');

		        editState.hide();

		        function showViewState() {
		            editState.hide();
		            viewState.fadeIn();
		        }

		        editBtn.click(function(){
		            editField.val('');
		            process.hide();
		            viewState.hide();
		            editState.fadeIn();
		        });

		        saveBtn.on("click", function (event) {
		            var form = $(this).closest('form');
		            if ($(form).valid()) {
		                event.preventDefault();
		                process.show();
		                var test = $(form).serialize();
		                $.ajax({
		                    url: P2P_PATH + 'Account/Pfm/AddCategory',
		                    type: "POST",
		                    data: $(form).serialize(),
		                    dataType: 'json',
		                    async: true,
		                    success: function (data) {
		                        if (data.status == "OK") {
		                            process.hide();
		                            showViewState();
		                            var editUrl = data.categoryUrl + "/?categoryId=" + data.categoryId;
		                            $('[data-widget-property=category-item]:last').after('<div class="ruleset"><div class="rule dashed"></div></div><section class="input-fieldset entry-field" data-widget-property="category-item"><div class="field-label"><header class="category-header">' + editField.val() + '</header></div><div class="field-value"><div class="funding-source category-setting"><div class="funding-source-inner"><div class="details-area"><div class="details"><div class="item">' + defaultStatus + '</div><div class="item">' + alertStatus + '</div><div class="item"><a href="' + editUrl + '">' + defaultPrompt + '</a></div></div></div></div></div></div></section>');
		                            var numCategories = $('[data-widget-property=category-item]').length;
		                            if (numCategories === maxLength) $('[data-widget-property=category-item-add]').hide().prev().hide();

		                            if (!editField.val()) {
		                                editField.siblings('.contextual-error').show();
		                            } else {
		                                editField.siblings('.contextual-error').hide();
		                            }
		                        }
		                        else {
		                            //debugger;
		                            process.hide();
		                            $('#nameErrorList').removeClass('hidden').addClass('field-validation-error').html(data.errors);
		                        }
		                    }
		                });
		            }
		        });
		        cancelBtn.click(function () {
		            cancelAddCategoryForm(event);
		            showViewState();
		        });

		        editField.on("keyup", function (event) { removeErrors('#nameErrorList') });
		    }
		}

		var cancelAddCategoryForm = function (event) {
		    event.preventDefault ? event.preventDefault() : event.returnValue = false;
		    cancelWidgetRemoveErrors('.addcategory-name-form', '#nameErrorList', '.AddCategory-validation-message');
		};

		var cancelWidgetRemoveErrors = function (FormSelector, ErrorListSelector, InlineValMessageSelector) {

		    event.preventDefault ? event.preventDefault() : event.returnValue = false;
		    removeErrors(ErrorListSelector);
		    $(FormSelector)[0].reset();
		    $(InlineValMessageSelector).empty();
		};

		HW.Slider = new function(){
			this.init = function(node){
			    var element = node.find('[data-input-type=dollar]'),
			    	goal = parseFloat(node.attr('data-property-goal')),
			    	goalDate = node.find('[data-widget-property=amount-slider-date]'),
			    	scale = node.find('[data-widget-property=amount-slider-scale]'),
			    	tooltip = node.find('[data-widget-property=amount-slider-tooltip]'),
			    	button = node.find('[data-widget-property=amount-slider-button]'),
					frequency = node.find('[data-widget-property=amount-slider-frequency]'),
			    	errorMessage = $('[data-error-for=transfer-amount]'),
			    	sliderType = node.attr('data-property-type'),
			    	currentVal = Math.floor(element.val().replace('$','')),
			    	isMouseDown = false,
			    	sliderStart = 0,
			    	sliderMin = 1,
			    	sliderMax = goal,
			    	alerts = false;

			    if(sliderType==='alerts'){
			    	sliderMin = goal * 0.05;
			    	sliderMax = goal * 0.95;
			    	alerts = true;
			    }

				element.on('keyup',function(){
			    	var newVal = Math.floor($(this).val().replace('$',''));
			    	errorMessage.hide();
		    		if(newVal>=sliderMin && newVal<=sliderMax){
		    			slide();
		    		} else {
		    			errorMessage.show();
		    		}
			    });

			    var tooltipControl = function(pos){
		        	if(pos-60<=0){
			        	tooltip.css('left', 0).addClass('left').removeClass('right');
			        } else if (pos-60>=scale.width()-160){
			        	tooltip.css({'left': 'auto', 'right': 0}).addClass('right').removeClass('left');
			        } else {
			        	tooltip.css('left', (pos-60)).removeClass('left').removeClass('right');
			        }
			    };

			    var getEndDate = function(){
			    	var start = $('[data-widget-property=date-input]').val(),
			    		freq = $('input[name=frequencyOption]:checked').data('slider-frequency'),
		    			diff = goal/currentVal,
		    			period = 'days',
		    			end = 0;

    				if(freq===31) {
    					period = 'months';
    				} else {
    					diff = diff*freq;
    				}
    				if(start){
    					end = moment(start).add(period, diff);
    				} else {
    					end = moment().add(period, diff);
    				}
					goalDate.text(end.format('MMM D, YYYY'));
			    };

			    var slide = function(){
			    	currentVal = Math.floor(element.val().replace('$',''));
			    	if(alerts===true) {
			    		sliderStart = ((scale.width()-button.width()) * ((goal-currentVal)) / goal);
			    		goalDate.text(Math.floor(100-((currentVal/goal)*100))+'%');
			    	} else {
			    		sliderStart = ((scale.width()-button.width()) * currentVal) / goal;
			    		getEndDate();
			    	}
			        button.css('left', sliderStart);
			        tooltipControl(sliderStart);
			    };

			    var startSlide = function(e){
					isMouseDown = true;
					var pos = getMousePosition(e);
					startMouseX = pos.x;
					lastElemLeft = ($(this).offset().left - $(this).parent().offset().left);
					updatePosition(e);
					return false;
			    };

			    var getMousePosition = function(e) {
					var posx = 0,
					  	posy = 0;
					if (!e) var e = window.event;
					if (e.pageX || e.pageY) {
						posx = e.pageX;
						posy = e.pageY;
					} else if (e.clientX || e.clientY) {
						posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
						posy = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
					}
					return { 'x': posx, 'y': posy };
			    };

			    var updatePosition = function(e) {
			      	var pos = getMousePosition(e),
			      	    spanX = (pos.x - startMouseX),
			      	  	newPos = (lastElemLeft + spanX),
			      	  	upperBound = (scale.width()-button.width());
			      	if(alerts===true){
			      		newPos = Math.max(Math.floor(upperBound*0.05),newPos);
			      		newPos = Math.min(newPos,Math.floor(upperBound*0.95));
			      		currentVal = goal - Math.round((newPos/upperBound)*goal,0);
			      		goalDate.text(100-Math.floor((currentVal/goal)*100)+'%');
			      	} else {
			      		newPos = Math.max((upperBound/goal),newPos);
			      		newPos = Math.min(newPos,upperBound);
			      		currentVal = Math.round((newPos/upperBound)*goal,0);
			      		getEndDate();
			      	}
			      	element.val('$'+currentVal+'.00');
			      	button.css("left", newPos);
			      	tooltipControl(newPos);
			    };

			    var moving = function(e) {
			    	if(isMouseDown){
			        	updatePosition(e);
			        	return false;
			    	}
			    };

			    slide();
			    button.bind('vmousedown mousedown',startSlide);
			    $(document).bind('vmousemove mousemove',function(e) { moving(e); });
			    $(document).bind('vmouseup mouseup',function(){ isMouseDown = false; });

			   	$('[data-widget-property=date-input]').on('change',getEndDate);
				$('input[name=frequencyOption]').change(function(){
					frequency.text($(this).attr('data-frequency-text'));
					getEndDate();
				});
			}
		}

		HW.AnnualSavings = new function(){
			this.init = function(node){
				$('input[name=recurrence]').change(function(){
					node.toggle();
				});

				$('[data-input-type=dollar]').focus(function(){
					$('input[name=amount]').next('.cover').removeClass('active');
					$(this).prev().find('input[type=radio]').attr('checked','checked').next().addClass('active');
				});

				$('input[name=amount], input[name=frequencyOption], [data-input-type=dollar]').bind('keyup change focus', function(){
					var freq = $('input[name=frequencyOption]:checked').attr('data-multiplier'),
						amount = $('input[name=amount]:checked').attr('id');
					if($('input[name=amount]').index($('input[name=amount]').filter(':checked'))===$('input[name=amount]').length-1) amount = $('[data-input-type=dollar]').val().replace('$','');
					node.find('[data-widget-property=annual-savings-amount]').text('$'+(freq*amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
				});
			}
		}

		HW.ReserveTransfer = new function(){
			this.init = function(node){
				var pauseState = node.find('[data-widget-name=reserve-pause]'),
					deleteState = node.find('[data-widget-name=reserve-delete]'),
					pauseBtn = node.find('[data-widget-role=pause]'),
					deleteBtn = node.find('[data-widget-role=delete]'),
					status = node.find('[data-widget-property=status]'),
					goal = node.find('[data-widget-property=reserve-settings-goal]');

				pauseBtn.click(function(){
					pauseState.find('[data-widget-role=inline-process]').show();

					//setTimeout for prototype
					setTimeout(function(){
						pauseState.find('[data-widget-role=inline-process]').hide();
						node.find('[data-widget-property=active-state]').addClass('inactive');
						node.find('[data-widget-property=paused-state]').removeClass('inactive');
						node.find('[data-widget-name=reserve-pause]').hide();
						goal.hide();
						status.hide();
						setTimeout(function(){
							status.text('Paused').fadeIn();
						},300);
					},1000);
				});

				deleteBtn.click(function(){
					deleteState.find('[data-widget-role=inline-process]').show();

					//setTimeout for prototype
					setTimeout(function() {
						deleteState.find('[data-widget-role=inline-process]').hide();
						deleteState.closest('.funding-source').remove();
						goal.hide();
						node.find('[data-widget-property=view-state]').hide();
						node.find('[data-widget-property=initial-state]').fadeIn();
						node.closest('.input-fieldset').next('.reserve-callout').show();
					}, 1000);
				});
			}
		}

		HW.BarChart = new function(){
		    var BC = this;

		    this.init = function(node){
		        var max = parseFloat(node.attr("data-property-max"));
		        var val = parseFloat(node.attr("data-property-value"));
		        var bar = node.find("*[data-widget-property=bar-fill]");
		        var per = Math.min( Math.max( 0, val/max ), 1 );
		        bar.css("width", "" + parseInt(per * 100) + "%");
		        if(per >= 1) bar.addClass("full");
		        if(node.find("*[data-widget-property=min-amount]").length==1 && node.find("*[data-widget-property=max-amount]").length==1){
		            if(val>0) node.find("*[data-widget-property=min-amount]").html("&nbsp;");
		            if(per == 1) node.find("*[data-widget-property=max-amount]").html("&nbsp;");
		        }
		    }
		}

	}

	$(document).ready(function() {
	    Hudson.Widget.init();
	});

})(jQuery);