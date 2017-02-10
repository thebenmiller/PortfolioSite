$(document).ready(function(){
	// Send Money Flow
	$('#send-review').protoLinkRoute('/Actions/SendMoney/Review/');

	$('#send-entry').protoLinkRoute('/Actions/SendMoney');

	$('#send-confirm').protoLinkRoute('/Actions/SendMoney/Complete');

	$('#add-money-review').protoLinkRoute('/Actions/AddMoney/Review');

	$('#back-to-add-money').protoLinkRoute('/Actions/AddMoney/DD-Funding.html');

	$('#submit-add-money').protoLinkRoute('/Actions/AddMoney/Complete');
});
