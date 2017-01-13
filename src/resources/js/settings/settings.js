(function($){

      var toggleTabs = {
        config: {
          sectionHeading: $('*[data-section-header]'),
          sectionContent: $('*[data-section]')
        },

        init: function() {
          toggleTabs.addEventListeners();
          toggleTabs.initHistory();
        },

        addEventListeners: function() {
          var t = toggleTabs.config;
          t.sectionHeading.on('click', toggleTabs.pushState);
        },

        initHistory: function() {
          var url = History.getState().hash;
          var sectionIndex = '';
          if(url.indexOf('?Account') != -1){
            sectionIndex = 0;
          }else if(url.indexOf('?Profile') != -1){
            sectionIndex = 1;
          }else if(url.indexOf('?Notifications') != -1){
            sectionIndex = 2;
          }

          History.replaceState({screenSize: 'large', section: sectionIndex}, '', url);
          toggleTabs.historyHandler();
          History.Adapter.bind(window, 'statechange', toggleTabs.historyHandler);
        },

        historyHandler: function() {
          var breakpoint = History.getState().data.screenSize;
          var section = History.getState().data.section;
          if(section === 0){
            toggleTabs.renderSection(0, breakpoint)
          }else if(section === 1){
            toggleTabs.renderSection(1, breakpoint)
          }else if(section === 2){
            toggleTabs.renderSection(2, breakpoint)
          }else{
            toggleTabs.renderSection(0, breakpoint)
          }
        },

        pushState: function(e) {
          var stackedTabHeader = e.target.getAttribute('data-section-switch');
          var section = e.target.getAttribute('data-section-header')
          var breakpoint = '';
          if(stackedTabHeader){
            breakpoint = 'small'
          }else{
            breakpoint = 'large'
          }

          if(section === '0'){
            History.replaceState({screenSize: breakpoint, section: 0}, '', '/Account/AccountSettings/?Account')
          }else if(section === '1'){
            History.replaceState({screenSize: breakpoint, section: 1}, '', '/Account/AccountSettings/?Profile')
          }else if (section === '2'){
            History.replaceState({screenSize: breakpoint, section: 2}, '', '/Account/AccountSettings/?Notifications')
          }
        },

        renderSection: function(sectionIndex, breakpoint){
          var t = toggleTabs.config;
          t.sectionHeading.removeClass('active').addClass('closed');
          $('*[data-section-header=' + sectionIndex + ']').addClass('active').removeClass('closed');

          if(breakpoint === 'small'){
            t.sectionContent.slideUp();
            $('[data-section=' + sectionIndex + ']').slideDown();
            $('body').animate( {scrollTop: $('.tabs-container').position().top }, 400)
          }else if(breakpoint === 'large'){
            t.sectionContent.hide();
            $('[data-section=' + sectionIndex + ']').fadeIn();
          }

        }

      };


  $(document).ready(function(){
    toggleTabs.init();
  });

})(jQuery);
