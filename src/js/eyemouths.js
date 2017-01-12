var vid = document.getElementById('videoel');
var lcanvas = document.getElementById('l_eye');
var lctx = lcanvas.getContext('2d');
var rcanvas = document.getElementById('r_eye');
var rctx = rcanvas.getContext('2d');
//var overlayCtx = overlay.getContext('2d');

var renderCanvas = document.createElement('canvas');
renderCanvas.width = 400;
renderCanvas.height = 300;
var renderCtx = renderCanvas.getContext('2d');

var videoCanvas = document.getElementById("vidcanvas");
var videoCtx = videoCanvas.getContext('2d');

var ctrack = new clm.tracker({useWebGL : true});
ctrack.init(pModel);

stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.getElementById('project-container').appendChild( stats.domElement );

function enablestart() {
  var startbutton = document.getElementById('startbutton');
  startbutton.innerText = "Start!";
  startbutton.classList = 'button';
  startbutton.addEventListener('click', startVideo);
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

  // check for camerasupport
  if (navigator.getUserMedia) {
    // set up stream

    var videoSelector = {video : true};
    if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
      var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
      if (chromeVersion < 20) {
        videoSelector = "video";
      }
    };

    navigator.getUserMedia(videoSelector, function( stream ) {
      if (vid.mozCaptureStream) {
        vid.mozSrcObject = stream;
      } else {
        vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
      }
      vid.play();
    }, function() {
      fail('error');
    });
  } else {
    fail('no video');
  }

  vid.addEventListener('canplay', enablestart, false);

  function startVideo() {
    document.getElementById("info").remove();
    // start video
    vid.play();
    // start tracking
    ctrack.start(vid);
    // start loop to draw face
    drawLoop();
  }

  function fail(type){
    var message;
    var info = document.getElementById("info");
    var header = info.getElementsByTagName('h2')[0];
    var detail = info.getElementsByTagName('p')[0];
    var startbutton = document.getElementById('startbutton');
    if(type == 'error'){
      message = 'Something went wrong getting video, try again or with a different browser.';
    }else if(type == 'no video'){
      message = 'Something went wrong getting video, try again or with a different browser.';
    }
    header.innerText = 'Oh No!'
    detail.innerText = message;
    startbutton.remove();
  }

  var stop = false;
  function drawLoop() {
    if(!stop)
      requestAnimFrame(drawLoop);
    //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
    if (ctrack.getCurrentPosition()) {
      //console.log("found");
      //ctrack.draw(overlay);
      drawShapes(ctrack.getCurrentPosition());
      //stop = true;
    }
  }
  function drawShapes(positions){
    //overlayCtx.beginPath();
    var r_eye = [
    positions[23],
    positions[19],
    positions[22],
    positions[25],
    positions[26],
    positions[23]
    ];

    var r_eye_vert = [
    positions[26],
    positions[24]
    ];

    var l_eye = [
    positions[30],
    positions[18],
    positions[15],
    positions[28],
    positions[31],
    positions[30]
    ];

    var l_eye_vert = [
    positions[31],
    positions[29]
    ];

    var mouth = [
    positions[44],
    positions[45],
    positions[46],
    positions[48],
    positions[49],
    positions[50],
    positions[51],
    positions[52],
    positions[53],
    positions[54],
    positions[55],
    positions[44]
    ];

    var mouth_vert = [
    positions[47],
    positions[53]
    ];

    var r_pos = getEyeParameters(r_eye,r_eye_vert);
    var l_pos = getEyeParameters(l_eye,l_eye_vert);

    videoCtx.drawImage(vid,0,0,400,300);
    var videoImageData = videoCtx.getImageData(0, 0, 400, 300);
    var videoData = videoImageData.data;

    rctx.clearRect(0,0,rcanvas.width,rcanvas.height);
    lctx.clearRect(0,0,lcanvas.width,lcanvas.height);

    var mouthMask = getMouthParameters(mouth, mouth_vert);
    var _x = mouthMask.x - mouthMask.rX;
    var _y = mouthMask.y - mouthMask.rY;
    var _w = mouthMask.rX;
    var _lw = (l_pos.rX + _w) / 2;
    var _rw = (r_pos.rX + _w) / 2;
    var _h = mouthMask.rY;

    lctx.save();
    drawScaledGradient(lcanvas,lctx,positions[27][0],positions[27][1],_lw,_h);
    lctx.restore();
    lctx.save();
    lctx.globalCompositeOperation = "source-atop";
    lctx.translate(positions[27][0]-mouthMask.x, positions[27][1]-mouthMask.y);
    lctx.drawImage(vid,0,0,lcanvas.width,lcanvas.height);
    lctx.restore();

    rctx.save();
    drawScaledGradient(rcanvas,rctx,positions[32][0],positions[32][1],_rw,_h);
    rctx.restore();
    rctx.save();
    rctx.globalCompositeOperation = "source-atop";
    rctx.translate(positions[32][0]-mouthMask.x, positions[32][1]-mouthMask.y);
    rctx.drawImage(vid,0,0,rcanvas.width,rcanvas.height);
    rctx.restore();

  }

  function drawScaledGradient(canvas,context, x, y, rx, ry){

    var rectW = canvas.width;
    var rectH = canvas.height;

    var scaleX;
    var scaleY;
    var invScaleX;
    var invScaleY;
    var grad;

    if (rx >= ry) {
      scaleX = 1;
      invScaleX = 1;
      scaleY = ry/rx;
      invScaleY = rx/ry;
      grad = context.createRadialGradient(x, y*invScaleY, 0, x, y*invScaleY, rx);
    }
    else {
      scaleY = 1;
      invScaleY = 1;
      scaleX = rx/ry;
      invScaleX = ry/rx;
      grad = context.createRadialGradient(x*invScaleX, y, 0, x*invScaleX, y, ry);
    }

    context.fillStyle = grad;

    grad.addColorStop(0, 'rgba(255,0,0,1)');
    grad.addColorStop(.7, 'rgba(255,0,0,1)');
    grad.addColorStop(1, 'rgba(255,0,0,0)');

    context.setTransform(scaleX,0,0,scaleY,0,0);
    context.clearRect(0,0,rectW*(1/scaleX),rectH*(1/scaleY));
    context.rect(0,0,rectW*(1/scaleX),rectH*(1/scaleY));
    context.fill();
  }

  function getMin(arr,param){
    var min = 999999;
    for(var i=0; i<arr.length; i++){
     min = Math.min(arr[i][param],min);
   }
   return min;
 }

 function getMax(arr,param){
  var max = -999999;
  for(var i=0; i<arr.length; i++){
    max = Math.max(arr[i][param],max);
  }
  return max;
}

function getMouthParameters(mouth,mouth_vert){
  var _xMin = getMin(mouth,0);
  var _xMax = getMax(mouth,0);
  var _yMin = getMin(mouth,1);
  var _yMax = getMax(mouth,1);
  var _mouthCenter = getCenter(mouth);
  var _rot = Math.atan2(mouth[5][1]-mouth[0][1],mouth[5][0]-mouth[0][0]);
  var _rX = _xMax-_xMin;
  var _rY = _yMax-_yMin;
  return {
    x: _mouthCenter[0],
    y: _mouthCenter[1],
    rX: _rX/1.8,
    rY: _rY/1.5,
    rot: _rot
  };
}

function getEyeParameters(eye,eye_vert){
    //eye = [positions[0],positions[N]]
    var _eyeCenter = getCenter(eye);
    var _rot = Math.atan2(eye[3][1]-eye[0][1],eye[3][0]-eye[0][0]);
    var _rX = Math.sqrt( Math.pow(eye[2][1]-eye[1][1],2) + Math.pow(eye[2][0]-eye[1][0],2) ) / 2;
    var _rY = Math.sqrt( Math.pow(eye_vert[0][1]-eye_vert[1][1],2) + Math.pow(eye_vert[0][0]-eye_vert[1][0],2) );
    return {
      x: _eyeCenter[0],
      y: _eyeCenter[1],
      rX: _rX,
      rY: _rY,
      rot: _rot
    };
  }

  var getCenter = function (polygon) {
      //polygon = [[x0,y0],[xN,yN]];
      var i, j, len, p1, p2, f, area, x, y
      area = x = y = 0;
      for (i = 0, len = polygon.length, j = len - 1; i < len; j = i++) {
        p1 = polygon[i];
        p2 = polygon[j];
        f = p1[1] * p2[0] - p2[1] * p1[0];
        x += (p1[0] + p2[0]) * f;
        y += (p1[1] + p2[1]) * f;
        area += f * 3;
      }
      return [x / area, y / area];
    }

  // update stats on every iteration
  document.addEventListener('clmtrackrIteration', function(event) {
    stats.update();
  }, false);
