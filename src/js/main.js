const $ = require('jquery');
const slick = require('slick-carousel');

$(function(){
  $('html').removeClass('no-js');
  $('.js-slides').slick({
    speed: 500,
    infinite: false,
    dots: true,
    appendDots: '#content-inner'
  });
});
