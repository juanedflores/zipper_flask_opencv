// let c2 = document.getElementById('c2');

// function test() {
//   var dataURL = c2.toDataURL();
//   $.ajax({
//     type: 'POST',
//     url: 'http://127.0.0.1:5000/hook',
//     data: {
//       imageBase64: dataURL,
//     },
//   }).done(function () {
//     console.log('sent');
//   });
// }

let video_feed = document.getElementById('video');
let src = new cv.Mat(video_feed.height, video_feed.width, cv.CV_8UC4);
let dst = new cv.Mat(video_feed.height, video_feed.width, cv.CV_8UC4);
let gray = new cv.Mat();
let cap = new cv.VideoCapture(video_feed);
let faces = new cv.RectVector();
let classifier = new cv.CascadeClassifier();

// load pre-trained classifiers
// let utils = new Utils('errorMessage');
// let faceCascadeFile = 'static/haarcascades/haarcascade_fullbody.xml';
// utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
//   console.log('cascade ready to load.');
// });
var loc = window.location.pathname;
console.log(loc);

let b = classifier.load('haarcascade_fullbody.xml');
console.log('NNLOAD', b, classifier.empty());

const FPS = 30;
function processVideo() {
  try {
    let begin = Date.now();
    // start processing.
    cap.read(src);
    src.copyTo(dst);
    cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
    // detect faces.
    classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
    // draw faces.
    for (let i = 0; i < faces.size(); ++i) {
      let face = faces.get(i);
      let point1 = new cv.Point(face.x, face.y);
      let point2 = new cv.Point(face.x + face.width, face.y + face.height);
      cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
    }
    cv.imshow('canvasOutput', dst);
    // schedule the next one.
    let delay = 1000 / FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);
  } catch (err) {
    console.error(err);
  }
}

// schedule the first one.
setTimeout(processVideo, 0);
