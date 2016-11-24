const $ = require('jquery');
const slick = require('slick-carousel');

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
  if(document.createElement('video').canPlayType('video/mp4')){
    $html.addClass('has-video');
  }
});
