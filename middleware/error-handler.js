const errorHandlerMiddleware = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let msg;

    if (err.name === 'ValidationError') {
        msg = Object.values(err.errors).map((item) => item.message).join(",")
        return res.status(400).json({ msg })
    }

    if (err.code && err.code === 11000) {
        msg = `${Object.keys(err.keyValue)} field has to be unique`
        return res.status(400).json({ msg })
    }


    // console.log(err.name);


    // defualt error
    msg = err.message || "somthing went wrong! please try again later";
    res.status(err.statusCode).json({ msg })
    // res.status(500).json({ err })


}

export default errorHandlerMiddleware;