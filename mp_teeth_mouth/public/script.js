
const Source_video = document.getElementById('video')
Source_video.style.visibility = "hidden";
let canvas = document.getElementById('canvasOutput')
let canvasCtx = canvas.getContext('2d');

let mirror_image = 1
let landmark_cords = null;
let mouth_open = 0;

const frozen_set = {
    // "outer_lips_upper": [61,185,40,39,37,0,267,269,270,409,291],
    "outer_lips_upper": [37,0,267],
    // "outer_lips_lower": [375,321,405,314,17,84,181,91,146],
     "outer_lips_lower": [84,17,314],
    // "inner_lips_upper": [78,191,80,81,82,13,312,311,310,415,308],
     "inner_lips_upper": [82,13,312],
    // "inner_lips_lower": [324,318,402,317,14,87,178,88,95]
     "inner_lips_lower": [87,14,317]
}



function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvas.width, canvas.height);
  if (results.multiFaceLandmarks) {
    landmark_cords = results.multiFaceLandmarks
  }
  canvasCtx.restore();
}


function load_model() {

    const faceMesh = new FaceMesh({locateFile: (file) => {
    console.log(`/face_mesh/${file}`)
    return `/face_mesh/${file}`;
    }});

    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    return faceMesh

}

faceMesh = load_model()

faceMesh.onResults(onResults);


function startSource_Video() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

startSource_Video()


// [ol_upper, ol_lower, il_upper, il_lower]
cv['onRuntimeInitialized'] = () => {

    let srcImage = new cv.Mat(Source_video.height, Source_video.width, cv.CV_8UC4);
    let dstImage = new cv.Mat(Source_video.height, Source_video.width, cv.CV_8UC4);
    let cap = new cv.VideoCapture(Source_video);

    const FPS = 30;
    async function processSource_Video() {

        await faceMesh.send({image: canvas});
        cap.read(srcImage);
        let begin_delay = Date.now();

        if (mirror_image){cv.flip(srcImage,srcImage, 1)}

        lips_cords = get_landmarks(landmark_cords)

        if (lips_cords.length==4){
            abs_lip_cords = get_absolute_cords(srcImage, lips_cords)
            mouth_open = mouth_open_status(srcImage, abs_lip_cords)

            if (mouth_open){
                abs_lip_cords = [2,3].map(x=>abs_lip_cords[x]);
                result = if_teeth_visible(abs_lip_cords, srcImage)
                srcImage = result[0]
                teeth_status = result[1]
                srcImage = put_text(teeth_status, srcImage)
                }

            else {
                srcImage = put_text("Teeth Not Visible - Please open your mouth", srcImage)
                }
            }

        else {
            srcImage = put_text("Loading",  srcImage)
        }
        
        cv.imshow(canvas, srcImage);
        faceMesh.send({image: canvas});

        let delay = 1000 / FPS - (Date.now() - begin_delay); 
        
        setTimeout(processSource_Video, delay);
    }
    setTimeout(processSource_Video, 0);
}


