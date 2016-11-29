$(document).ready(function(){
  // Show Play Store banner if on Android device
  var smartbanner = $('#smartbanner');

  if (navigator.userAgent.match(/Android/i)) {
    smartbanner.html('<div class="sb-container"><a href="#" class="sb-close">&times;</a><div class="sb-info">Serve for Android<span>Available in the Play Store</span></div><a href="market://details?id=com.serve.mobile" class="sb-button"><span>View</span></a></div>');
  }

  // Make Android banner dismissable
  var sb_close = smartbanner.find('.sb-close');

  sb_close.on('click', function() {
    smartbanner.slideUp(200);
  });
});
