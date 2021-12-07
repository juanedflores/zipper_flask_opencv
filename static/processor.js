let xcanvas = 0;
let ycanvas = 0;
let xzipper = 0;

let processor = {
  timerCallback: function () {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    let self = this;
    setTimeout(function () {
      self.timerCallback();
    }, 0);
  },

  doLoad: function () {
    this.video = document.getElementById('video');
    this.c1 = document.getElementById('c1');
    // this.c2 = document.getElementById('c2');
    this.ctx1 = this.c1.getContext('2d');
    // this.ctx2 = this.c2.getContext('2d');
    let self = this;

    this.video.addEventListener(
      'playing',
      function () {
        self.width = self.video.videoWidth;
        self.height = self.video.videoHeight;
        self.timerCallback();
        console.log('width: ' + self.width + ' height: ' + self.height);
      },
      false
    );
  },

  computeFrame: function () {
    let c1 = document.getElementById('c1').getContext('2d');
    // let c2 = document.getElementById('c2').getContext('2d');
    var canvas_width = c1.canvas.clientWidth;
    // var canvas2_width = c2.canvas.clientWidth;
    // var canvas2_height = c2.canvas.clientHeight;
    // 1236

    this.ctx1.drawImage(
      this.video,
      0,
      (this.height / 5) * 4,
      this.width,
      this.height,
      0,
      0,
      this.height / 5,
      canvas_width
    );

    // this.ctx2.drawImage(
    //   this.video,
    //   0,
    //   0,
    //   this.width,
    //   this.height,
    //   0,
    //   0,
    //   canvas2_width,
    //   canvas2_height
    // );
    return;
  },
};

document.addEventListener('DOMContentLoaded', () => {
  processor.doLoad();
});

var MotionDetector = (function () {
  var alpha = 0.5;
  var version = 0;
  var greyScale = false;

  var canvas = document.getElementById('canvas');
  var canvasFinal = document.getElementById('canvasFinal');
  var ctx = canvas.getContext('2d');
  var ctxFinal = canvasFinal.getContext('2d');
  // var localStream = null;
  var imgData = null;
  var imgDataPrev = [];

  function snapshot() {
    if (video.playing) {
      canvas.width = video.offsetWidth;
      canvas.height = video.offsetHeight;
      canvasFinal.width = video.offsetWidth;
      canvasFinal.height = video.offsetHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Must capture image data in new instance as it is a live reference.
      // Use alternative live referneces to prevent messed up data.
      imgDataPrev[version] = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      version = version == 0 ? 1 : 0;

      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      var length = imgData.data.length;
      // console.log('length' + length);
      var x = 0;
      while (x < length) {
        if (!greyScale) {
          // Alpha blending formula: out = (alpha * new) + (1 - alpha) * old.
          imgData.data[x] =
            alpha * (255 - imgData.data[x]) +
            (1 - alpha) * imgDataPrev[version].data[x];
          imgData.data[x + 1] =
            alpha * (255 - imgData.data[x + 1]) +
            (1 - alpha) * imgDataPrev[version].data[x + 1];
          imgData.data[x + 2] =
            alpha * (255 - imgData.data[x + 2]) +
            (1 - alpha) * imgDataPrev[version].data[x + 2];
          imgData.data[x + 3] = 255;
        }
        x += 4;
      }

      temp = 0;
      tempIndex = 0;
      indexCounter = 0;
      rgbaCounter = 0;
      imgData.data.forEach((element) => {
        if (rgbaCounter == !3) {
          if (temp < element) {
            temp = element;
            tempIndex = indexCounter;
          }
        }

        rgbaCounter += 1;
        if (rgbaCounter == 4) {
          rgbaCounter = 0;
          indexCounter += 1;
        }
      });

      console.log(indexCounter);
      console.log(canvasFinal.width);
      console.log(canvasFinal.height);
      xcanvas = tempIndex / canvasFinal.width;
      ycanvas = tempIndex % canvasFinal.width;
      xzipper = scale(xcanvas, 0, 400, 0, 24);

      // console.log(canvasFinal.width);
      console.log(
        `The largest number: ${temp} with x: ${xcanvas} and y: ${ycanvas}`
      );
      console.log('zipper: ' + xzipper);

      send_pos_data(xzipper);

      // console.log(imgData.data);
      ctxFinal.putImageData(imgData, 0, 0);
      // c1.putImageData(imgData, 0, 0);
    }
  }

  function init_() {
    // var video = document.getElementById('video');
    if (Hls.isSupported()) {
      var hls = new Hls({
        debug: false,
      });
      hls.loadSource('https://zoocams.elpasozoo.org/bridgesantafe4.m3u8');
      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, function () {
        video.muted = true;
        video.play();
      });
    }
    window.setInterval(snapshot, 1000);
  }

  return {
    init: init_,
  };
})();

MotionDetector.init();

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
  get: function () {
    return !!(
      this.currentTime > 0 &&
      !this.paused &&
      !this.ended &&
      this.readyState > 2
    );
  },
});

function scale(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function send_pos_data(xzipper) {
  // var dataURL = c2.toDataURL();
  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:5000/hook',
    data: {
      xpos: xzipper,
    },
  }).done(function () {
    console.log('sent');
  });
}
