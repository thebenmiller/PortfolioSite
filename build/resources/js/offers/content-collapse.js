var contentCollapse;

$(document).ready(function(){

  contentCollapse = {

    config: {
      fireSelector: "[data-toggle]",
      contentSelector: "[data-toggle-collapsible]",
      openClass: "open",
      animate: true,
      duration: 300,
      easing: "swing"
    },

    init: function(config) {

      $.extend(contentCollapse.config, config);

      // Set 'on click' event listener for [data-toggle] that expands and collapses content
      $(contentCollapse.config.fireSelector).on('click', function(e) {

        var $activeTarget = $(this).closest($("[data-toggle-container]"));

        if ($activeTarget.hasClass(contentCollapse.config.openClass)) {
          contentCollapse.close($activeTarget);
          return;
        }

        contentCollapse.open($activeTarget);
      });
    },

    open: function($openSelector) {

      if(contentCollapse.config.animate){

        var $content = $openSelector.children(contentCollapse.config.contentSelector);
        
        $content.slideDown({
          'duration': contentCollapse.config.duration,
          'easing': contentCollapse.config.easing
        }).css("overflow", "visible"); //overwrite jQuery default of overflow hidden

        $openSelector.addClass(contentCollapse.config.openClass);  

        return;
      }
      
      $openSelector.toggleClass('open');    
    },

    close: function($closeSelector) {

      if(contentCollapse.config.animate){

        var $content = $closeSelector.children(contentCollapse.config.contentSelector);

        $content.slideUp({
          'duration': contentCollapse.config.duration,
          'easing': contentCollapse.config.easing
        });
        $closeSelector.removeClass(contentCollapse.config.openClass);

        return;
      }
      
      $closeSelector.toggleClass('open');    
    }
  }

  contentCollapse.init();
});