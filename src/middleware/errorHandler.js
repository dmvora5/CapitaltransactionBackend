const { logEvents } = require("./logger")


const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    const status = err.status || 500; // server error 

    return res.status(err.status || 500).json({
        success: false,
        status: err.status || 500,
        data: null,
        message: err.message,
        isError: true
    });

}

module.exports = errorHandler;