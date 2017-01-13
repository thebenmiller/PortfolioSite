// OO JS for the payee reminder settings widget

$(document).ready(function(){

	var payee_reminder = {
		settings: {
			processor: $('.inline-processing'),
			date_element: $('#date-start'),
			frequency_value: $('#reminder-frequency'),
			edit_area: $('.edit-reminder-area'),
			complete_area: $('.complete-reminder-area'),
			existing_reminder: false
		},

		calculateNextDate: function(first_date, reminder_frequency){
			var frequency = parseInt(reminder_frequency.attr('data-frequency'));
			var frequency_type = reminder_frequency.attr('data-frequency-type');
			var localization = $('html').attr('lang') || "en-US";

			var next_date = new Date(first_date);

			if (frequency_type === "day"){
				next_date.setDate((next_date.getDate() + frequency));
			} else if (frequency_type === "month") {
				next_date.setMonth((next_date.getMonth() + frequency));
			}

			var next_date_formatted = next_date.toLocaleDateString(localization);
			return next_date_formatted;
		},

		checkDateField: function(){
			var first_date = Date.parse(payee_reminder.settings.date_element.val());
			return first_date;
		},

		clearFormValues: function(){
			payee_reminder.settings.date_element.val(null);
			payee_reminder.settings.frequency_value.prop('selectedIndex', 0).trigger('change');
		},

		deleteReminder: function(){
			// simulating ajax call, replace with actual ajax call
			
			payee_reminder.toggleProcessor(payee_reminder.processReminderDeleteForm);
		},

		processReminderDeleteForm: function(){
			payee_reminder.settings.existing_reminder = false;
			setTimeout(payee_reminder.showResetForm, 2000);
			return false; //catch form submission
		},

		processReminderFrequencyForm: function(){
			// simulating ajax call, replace with actual ajax call
			// on success, call payee_reminder.showReminderConfirmation();

			payee_reminder.settings.existing_reminder = true;
			setTimeout(payee_reminder.showReminderConfirmation, 2000);
		},

		setFrequencyMessage: function(){
			var first_date = payee_reminder.checkDateField();
			var reminder_frequency = payee_reminder.settings.frequency_value.find('option:selected');
			var reminder_frequency_value = payee_reminder.settings.frequency_value.attr('value');
			var frequency_message = $('#reminder-dates');

			if (first_date && reminder_frequency_value && reminder_frequency.attr('data-frequency') !== "0") {
				var next_date = payee_reminder.calculateNextDate(first_date, reminder_frequency);

				$('#reminder-start').text(payee_reminder.settings.date_element.val());
				$('#reminder-next').text(next_date);

				if (!frequency_message.hasClass("active")) {
					frequency_message.slideDown("fast", function(){
						$(this).addClass("active");
					});
				} 
			} else {
				frequency_message.slideUp("fast", function(){
					$(this).removeClass("active");
				});
			}
		},

		showCorrectCancelScreen: function() {
			if (payee_reminder.settings.existing_reminder) {
				payee_reminder.settings.edit_area.fadeOut(300, function(){
					payee_reminder.settings.complete_area.fadeIn(300);
				});
			} else {
				payee_reminder.settings.edit_area.fadeOut(300, function(){
					$('.set-reminder-area').fadeIn(300);
				});
			}
		},

		showEditReminderForm: function(){
			payee_reminder.settings.complete_area.fadeOut(300, function(){
				payee_reminder.settings.edit_area.fadeIn(300);
			});
		},

		showReminderConfirmation: function(){
			payee_reminder.settings.edit_area.fadeOut(300, function(){
				payee_reminder.settings.complete_area.fadeIn(300, function(){
					payee_reminder.toggleProcessor();
				});
			});
		},

		showResetForm: function(){	
			payee_reminder.settings.complete_area.fadeOut(300, function(){
				$('.set-reminder-area').fadeIn(300, function(){
					$('.delete-reminder-area').fadeOut(300);
					payee_reminder.toggleProcessor();
					payee_reminder.clearFormValues();
				});
			});
		},

		submitReminderFrequency: function(){
			var is_valid = payee_reminder.validateReminderFrequency();

			if (is_valid) {
				payee_reminder.toggleProcessor(payee_reminder.processReminderFrequencyForm);
			}

			return false; //catch the form submission
		},

		toggleProcessor: function(callback) {
			var p = payee_reminder.settings.processor;

			if (p.hasClass('active')) {
				p.fadeOut('fast', function(){
					p.removeClass('active');
				});
			} else {
				p.fadeIn('fast', function(){
					p.addClass('active');
				});
			}

			if (callback) {
				callback();
			}
		},

		validateReminderFrequency: function(){
			//validation logic here, replace with actual validation
			var is_valid = true;

			var date_field_value = payee_reminder.checkDateField();
			var reminder_frequency_value = payee_reminder.settings.frequency_value.val();

			$('.field-validation-error').css('display', 'none');

			if (!date_field_value) {
				// throw error
				$('#date-error').show();
				is_valid = false;
			} 

			if (!reminder_frequency_value) {
				// throw error
				$('#frequency-error').show();
				is_valid = false;
			}

			return is_valid;
		},

		init: function(){
			//bind events

			$('#set-reminder-frequency').on('submit', payee_reminder.submitReminderFrequency);
			$('.edit-reminder').on('click', payee_reminder.showEditReminderForm);
			$('#delete-reminder').on('submit', payee_reminder.deleteReminder);
			$('.cancel-action').on('click', payee_reminder.showCorrectCancelScreen);
			$('[data-role="date-calc"]').on('change', payee_reminder.setFrequencyMessage);
		}
	};

	payee_reminder.init();
});