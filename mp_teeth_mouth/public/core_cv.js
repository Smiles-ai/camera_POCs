
function core_opencv(mat) {
    let r = "inside"
    let m = "complete"
    console.log(r)
    cv.cvtColor(mat, mat, cv.COLOR_RGB2GRAY, 0);
    console.log(mat)
    console.log(m)
    return mat
}



function face_detect(mat){

    let gray = new cv.Mat();
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
    let faces = new cv.RectVector();
    let classifier = new cv.CascadeClassifier();
    // load pre-trained classifiers
    let k = classifier.load("/Users/reyanzafir/workdir/projects/node_work/shells/opencv-demo/src/haarcascade_frontalface_default.xml");
    // detect faces
    console.log(k)

    classifier.detectMultiScale(gray, faces, 1.1, 3, 0);


    // for (let i = 0; i < faces.size(); ++i) {
    //     let roiGray = gray.roi(faces.get(i));
    //     let roiSrc = mat.roi(faces.get(i));
    //     let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
    //     let point2 = new cv.Point(faces.get(i).x + faces.get(i).width,
    //                               faces.get(i).y + faces.get(i).height);
    //     cv.rectangle(mat, point1, point2, [255, 0, 0, 255]);

    //     roiGray.delete(); roiSrc.delete();
    // }

    // return mat

    }
