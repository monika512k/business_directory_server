let returnTrue = function (req, res, message, arr,remainingCount=0){

    let api_response={
    success: true,
    message: message,
    "data": arr,
    remainingCount
    }
    if(remainingCount==0){
        delete api_response.remainingCount
    }
    return res.status(200).json(api_response);
};

let returnFalse = function (req, res, message, arr, error_code=0){
let responseObj={
    success: false,
    message: message,
    "data": arr
}
if(error_code !=0){
    responseObj.error_code=461
}
    return res.status(200).json(
        responseObj
    );
};

let response = {
    returnTrue: returnTrue,
    returnFalse: returnFalse
};

module.exports = response;
