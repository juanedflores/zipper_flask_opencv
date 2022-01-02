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
    // the video that we are grabbign from
    this.video = document.getElementById('video');

    // the canvas to draw on
    this.c1 = document.getElementById('c1');
    this.ctx1 = this.c1.getContext('2d');

    c1.style.width = window.innerWidth;
    console.log(window.innerWidth);

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

    // activate zipper
    activate_zipper();
  },

  computeFrame: function () {
    let c1 = document.getElementById('c1').getContext('2d');
    var canvas_width = c1.canvas.clientWidth;

    this.ctx1.drawImage(
      this.video,
      0,
      (this.height / 5) * 3,
      this.width,
      this.height,
      0,
      0,
      this.height/1.8,
      canvas_width
    );

    return;
  },
};

document.addEventListener('DOMContentLoaded', () => {
  processor.doLoad();
});

function activate_zipper() {
  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:5000/hook',
  }).done(function () {
    console.log('sent');
  });
}


// Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
//   get: function () {
//     return !!(
//       this.currentTime > 0 &&
//       !this.paused &&
//       !this.ended &&
//       this.readyState > 2
//     );
//   },
// });
