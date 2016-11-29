  $(document).ready(function(){
    var privacyFrame = $('.privacy-frame');
    if (privacyFrame.length){
      privacyFrame.responsiveIframe({ xdomain: '*'});
    }
     });