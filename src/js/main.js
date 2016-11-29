const $ = require('jquery');
const slick = require('slick-carousel');
const debounce = require('debounce');

$(function(){
  const $html = $('html');
  $html.removeClass('no-js');
  let $slides = $('.js-slides');
  $slides.slick({
    speed: 500,
    infinite: false,
    dots: true,
    appendDots: '#content-inner'
  }).on('afterChange', function(event, slick, currentSlide){
    let $currentSlideVideo = $('.slick-slide.slick-current.slick-active video');
    if($currentSlideVideo.length){
      $currentSlideVideo[0].play();
    }
  });
  if($slides.length){
    // $('body').on('mousewheel DOMMouseScroll', debounce(function(e){slideScrollEvent(e)},50));
  }
  if(document.createElement('video').canPlayType('video/mp4')){
    $html.addClass('has-video');
  }
  function slideScrollEvent(e){
    console.log('triggered');
    let delta = (e.originalEvent.wheelDelta || -e.originalEvent.detail);
    if(delta < 0) {
      $slides.slick("slickNext");
    }else if (delta > 0) {
      $slides.slick("slickPrev");
    }
  }
});
