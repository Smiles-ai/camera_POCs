const mirror_image = 1;
// function onResults(results) {
//   canvasCtx.save();
//   canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
//   canvasCtx.drawImage(
//       results.image, 0, 0, canvas.width, canvas.height);
//   if (results.multiFaceLandmarks) {
//     for (const landmarks of results.multiFaceLandmarks) {
//       drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION,
//                      {color: '#C0C0C070', lineWidth: 1});
//       drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {color: '#FF3030'});
//       drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'});
//       drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {color: '#FF3030'});
//       drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {color: '#30FF30'});
//       drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {color: '#30FF30'});
//       drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {color: '#30FF30'});
//       drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
//       drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {color: '#E0E0E0'});
//     }
//   }
//   canvasCtx.restore();
// }


// const faceMesh = new FaceMesh({locateFile: (file) => {
//   console.log(`/face_mesh/${file}`)
//   return `/face_mesh/${file}`;
// }});
// faceMesh.setOptions({
//   maxNumFaces: 1,
//   refineLandmarks: true,
//   minDetectionConfidence: 0.5,
//   minTrackingConfidence: 0.5
// });
// faceMesh.onResults(onResults);

function startSource_Video() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

startSource_Video()

const Source_video = document.getElementById('video')
Source_video.style.visibility = "hidden";
let canvas = document.getElementById('canvasOutput')
const canvasCtx = canvas.getContext('2d');



cv['onRuntimeInitialized'] = () => {

    let srcImage = new cv.Mat(Source_video.height, Source_video.width, cv.CV_8UC4);
    let dstImage = new cv.Mat(Source_video.height, Source_video.width, cv.CV_8UC4);
    let cap = new cv.VideoCapture(Source_video);

    const FPS = 30;
    async function processSource_Video() {

        // await faceMesh.send({image: canvas});
        cap.read(srcImage);
        let begin_delay = Date.now();

        blur_status = blur_detect(srcImage);
        // exposure_status = exposure_detect(srcImage);
        // dstImage = put_text(blur_status, exposure_status, srcImage);
        if (mirror_image){cv.flip(dstImage,dstImage, 1)}
        dstImage = put_text_blur(blur_status, srcImage)
        cv.imshow(canvas, dstImage);
        // faceMesh.send({image: canvas});
        let delay = 1000 / FPS - (Date.now() - begin_delay); 
        
        setTimeout(processSource_Video, delay);
    }
    setTimeout(processSource_Video, 0);
}

