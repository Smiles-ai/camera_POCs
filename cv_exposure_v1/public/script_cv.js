// function blur_detect(mat, threshold=35){
//     // good threshold=30
//     let dst = new cv.Mat();
//     let laplacian_mat = new cv.Mat();

//     cv.cvtColor(mat, dst, cv.COLOR_RGBA2GRAY, 0);
//     cv.threshold(dst, dst, 200, 255, cv.THRESH_BINARY);
//     cv.Laplacian(dst, laplacian_mat, cv.CV_64F, 1, 1, 0, cv.BORDER_DEFAULT);
//     let myMean = new cv.Mat();
//     let myStddev = new cv.Mat();
//     cv.mean(dst, myMean)
//     cv.meanStdDev(laplacian_mat, myMean, myStddev);
//     myStddev = myStddev.doubleAt(0,0);
//     dst.delete();
//     laplacian_mat.delete();
//     myMean.delete();
//     if (myStddev < threshold){
//         return "Blurry"
//     }
//     else{
//         return "Not Blurry"
//     }
    
// }


function exposure_detect(mat, dark_thres=0.4, bright_thres=0.3){

    let dst = new cv.Mat();
    let dark_part = new cv.Mat();
    let bright_part = new cv.Mat();

    cv.cvtColor(mat, dst, cv.COLOR_RGBA2RGB, 0);
    const GreaterThanZero = arr => arr.filter(x => x > 0).length;
    let data = dst.data

    cv.cvtColor(dst, dst, cv.COLOR_RGB2GRAY, 0);
    let gray_chan = dst.channels();
    let gray_size = dst.size();
    let gray_rows = gray_size.width;
    let gray_cols = gray_size.height;
    let total_pixel = gray_chan*gray_rows*gray_cols;

    let low_dark = new cv.Mat(dst.rows, dst.cols, dst.type(), [0,0,0,0]);
    let high_dark = new cv.Mat(dst.rows, dst.cols, dst.type(), [50,50,50,255]);
    cv.inRange(dst, low_dark, high_dark, dark_part)
    let threshold_dark = dark_part.data
    let dark_pixel = GreaterThanZero(threshold_dark)

    let low_bright = new cv.Mat(dst.rows, dst.cols, dst.type(), [210,210,210,0]);
    let high_bright = new cv.Mat(dst.rows, dst.cols, dst.type(), [255,255,255,255]);
    cv.inRange(dst, low_bright, high_bright, bright_part)
    let threshold_bright = bright_part.data
    let bright_pixel = GreaterThanZero(threshold_bright)


    dst.delete();
    dark_part.delete();
    bright_part.delete();
    low_dark.delete();
    high_dark.delete();
    low_bright.delete();
    high_bright.delete();

    // console.log("under")
    // console.log(dark_pixel/total_pixel)

    // console.log("over")
    // console.log(bright_pixel)
    // console.log(bright_pixel/total_pixel)

    // console.log("Under", dark_pixel/total_pixel,dark_pixel, total_pixel)
    // console.log("Over", bright_pixel/total_pixel,bright_pixel, total_pixel)


     if (dark_pixel/total_pixel > bright_thres){
        // console.log("less light")
        // console.log(dark_pixel/total_pixel)
        return "Underexposed"
        }
    if (bright_pixel/total_pixel > dark_thres){
        // console.log(bright_pixel/total_pixel)
        return "Overexposed"
        }

    return "Good Lighting"

}

// function put_text(blur_status, exposure_status, image){

//     coordinates_blur = new cv.Point(30, 30);
//     coordinates_exposure = new cv.Point(400, 30);


//     if (blur_status== "Not Blurry"){
//         // console.log("I am inside not blurry")

//         cv.putText(image, blur_status, coordinates_blur, cv.FONT_HERSHEY_SIMPLEX, .7, [255,255,255,255], 2)
//         }
//     else{
//         // console.log("I am inside blurry")
//         cv.putText(image, blur_status, coordinates_blur, cv.FONT_HERSHEY_SIMPLEX, .7, [255,0,0,255], 2)
//         }

//     if (exposure_status=="Good Lighting"){
//         cv.putText(image, exposure_status, coordinates_exposure, cv.FONT_HERSHEY_SIMPLEX, .7, [255,255,255,255], 2)
//         }
//     else{
//         cv.putText(image, exposure_status, coordinates_exposure, cv.FONT_HERSHEY_SIMPLEX, .7, [255,0,0,255], 2)
//         }
    
//     return image


// }


function put_text_exposure(exposure_status, image){

    coordinates_exposure = new cv.Point(30, 30);

    if (exposure_status== "Good Lighting"){
        // console.log("I am inside not blurry")
        cv.putText(image, exposure_status, coordinates_exposure, cv.FONT_HERSHEY_SIMPLEX, .7, [0,255,0,255], 2)
        }
    else{
        // console.log("I am inside blurry")
        cv.putText(image, exposure_status, coordinates_exposure, cv.FONT_HERSHEY_SIMPLEX, .7, [255,0,0,255], 2)
        }
    return image


}


