
function if_teeth(roi, thres = 0.85){

    let dst = new cv.Mat();
    let mask = new cv.Mat();
    const size = roi.size();
    const totalPixelCount = size.width*size.height;

    if (totalPixelCount >0){
    cv.cvtColor(roi, dst, cv.COLOR_RGBA2RGB , 0);
    cv.cvtColor(dst, dst, cv.COLOR_RGB2HSV, 0);
    }
    else{
        dst = cv.Mat.zeros(10, 10, roi.type())
    }
    // let hsvPlanes = new cv.MatVector();
    // cv.split(dst, hsvPlanes);
    // let hue = hsvPlanes.get(0);
    // let sat = hsvPlanes.get(1);
    // let val = hsvPlanes.get(2);
    let low = new cv.Mat(dst.rows, dst.cols, dst.type(), [0, 10, 100, 0]);
    let high = new cv.Mat(dst.rows, dst.cols, dst.type(), [360, 140, 255, 255]);
    cv.inRange(dst, low, high, mask);
    const white_pixel = cv.countNonZero(mask)

    
    if (totalPixelCount==0){
        score = 0;
    }
    else{
        score = white_pixel/totalPixelCount;
    }

    dst.delete();
    mask.delete();

    if(score > thres){
        return "Teeth Visible"
    }
    else{
        return "Teeth Not Visible"

    }

}



function if_teeth_visible(cords, image){

    let mo_upper = cords[0]
    let mo_lower = cords[1]

    mo_upper = [[mo_upper[0].x, mo_upper[0].y], [mo_upper[1].x,mo_upper[1].y],
                     [mo_upper[2].x, mo_upper[2].y]]

    mo_lower = [[mo_lower[0].x, mo_lower[0].y], [mo_lower[1].x,mo_lower[1].y],
                     [mo_lower[2].x, mo_lower[2].y]]

    let min_upper = mo_upper.map((col, i) => Math.min(...mo_upper.map(row => row[i])));
    min_upper = min_upper.slice(0,2)
    let max_lower = mo_lower.map((col, i) => Math.max(...mo_lower.map(row => row[i])));
    max_lower = max_lower.slice(0,2)

    let top_left = new cv.Point(min_upper[0], min_upper[1])
    let bot_right = new cv.Point(max_lower[0], max_lower[1])
    let width = Math.abs(max_lower[0] - min_upper[0])
    let height = Math.abs(max_lower[1] - min_upper[1])
    //sometime rect height plus width is higher than the window size and its causing error
    // example error let rect = new cv.Rect(250, 506, 14, 1);
    let rect = new cv.Rect(min_upper[0], min_upper[1], width, height);
    let cropped = image.roi(rect);
    let result = if_teeth(cropped);

    if (result == "Teeth Visible"){
        cv.rectangle(image, top_left, bot_right,[0, 255, 0, 255], 2);
        }
    else{
        cv.rectangle(image, top_left, bot_right,[255, 0, 0, 255], 2);
        }

    return [image, result]

    }
    


function put_text(teeth_status, image){

    coordinates_teeth = new cv.Point(30, 30);

    if (teeth_status== "Teeth Visible"){
        cv.putText(image, teeth_status, coordinates_teeth, cv.FONT_HERSHEY_SIMPLEX, .7, [0,255,0,255], 2)
        }
    else{
        cv.putText(image, teeth_status, coordinates_teeth, cv.FONT_HERSHEY_SIMPLEX, .7, [255,0,0,255], 2)
        }

    return image


}



// logic functions

function get_landmarks(landmarks){

    let lm = landmarks[0];
    try {
        if (lm.length==478){
            let ol_upper = frozen_set["outer_lips_upper"].map(x=>lm[x])
            let ol_lower = frozen_set["outer_lips_lower"].map(x=>lm[x])
            let il_upper = frozen_set["inner_lips_upper"].map(x=>lm[x])
            let il_lower = frozen_set["inner_lips_lower"].map(x=>lm[x])
            return [ol_upper, ol_lower, il_upper, il_lower]
            }
        }
    catch (err) {
        console.log(err)
        return [0]
    }

}


function get_absolute_cords(mat, landmark_list){

    dimension = mat.size();
    width = dimension.width;
    height = dimension.height;

    var absolute_cords = []
    const arraylength = landmark_list.length;

    for (var i = 0; i < arraylength; i++){

        var temp_cords = []
        cord_list = landmark_list[i]
        cord_length = cord_list.length

        for (var j = 0; j < cord_length; j++){
            p = cord_list[j]
            x = Math.round(p.x*width)
            y = Math.round(p.y*height)
            cord = new cv.Point(x,y)
            temp_cords.push(cord)
        }

        absolute_cords.push(temp_cords)
    }

    return absolute_cords
}


function euclidean_dist(p1, p2){
    x1 = p1.x; y1 = p1.y;
    x2 = p2.x; y2 = p2.y;
    var dist = Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
    return dist
}


function get_lip_height(mat, list_cords){

    ol_upper = list_cords[0]
    ol_lower = list_cords[1]
    il_upper = list_cords[2]
    il_lower = list_cords[3]

    const arraylength = ol_upper.length;
    var mean_gap_upper = 0;
    var mean_gap_lower = 0;

    for (var i = 0; i < arraylength; i++){
        uL_outer_point = ol_upper[i]
        lL_outer_point = il_upper[i]
        dist = euclidean_dist(uL_outer_point, lL_outer_point)
        mean_gap_upper = dist + mean_gap_upper
    }

    for (var j = 0; j < arraylength; j++){
        uL_inner_point = ol_lower[j]
        lL_inner_point = il_lower[j]

        dist = euclidean_dist(uL_inner_point, lL_inner_point)
        mean_gap_lower = dist + mean_gap_lower
    }

    mean_gap = Math.min(mean_gap_lower, mean_gap_upper)
    mean_gap = mean_gap/(arraylength)

    return [mean_gap, mat]

    }

function get_mouth_height(mat, list_cords){
    // [ol_upper, ol_lower, il_upper, il_lower]
    il_upper = list_cords[2]
    il_lower = list_cords[3]

    const arraylength = il_upper.length;
    var mean_mouth_gap = 0;

    for (var i = 0; i < arraylength; i++){
        uL_inner_point = il_upper[i]
        lL_inner_point = il_lower[i]
        dist = euclidean_dist(uL_inner_point, lL_inner_point)
        mean_mouth_gap = dist + mean_mouth_gap

        }
    mean_mouth_gap = mean_mouth_gap/(arraylength)

    return [mean_mouth_gap, mat]

    }


function mouth_open_status(mat, list_cords, thres = 1.2){

    lip_height = get_lip_height(mat, list_cords)[0]
    mat = get_lip_height(mat, list_cords)[1]
    mouth_height = get_mouth_height(mat, list_cords)[0]
    mat = get_mouth_height(mat, list_cords)[1]
    score = mouth_height/lip_height
    if (mouth_height> thres*lip_height){
        return 1
        }
    else{
        return 0
    }

}






