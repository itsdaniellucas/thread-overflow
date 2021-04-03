const winston = require('./winstonConfig')
const { ServiceError } = require('./services/serviceUtils')

function globalErrorHandler(err, req, res, next) {
    const body = req.body || {};
    const uuid = res.locals.uuid;

    if(typeof(err) === 'string') {
        winston.error(`${new Date().toISOString()} ${uuid} ${req.method} ${req.url} ${req.user ? (req.user.data ? (req.user.data.username || '-') : '-') : '-'} ${JSON.stringify(body)} ${err}`)
        return res.status(400).json(ServiceError('Something went wrong'))
    }

    if(err.name === 'UnauthorizedError') {
        return res.status(401).json(ServiceError('Unauthorized'));
    }

    winston.error(`${new Date().toISOString()} ${uuid} ${req.method} ${req.url} ${req.user ? (req.user.data ? (req.user.data.username || '-') : '-') : '-'} ${JSON.stringify(body)} ${err.message}`)
    return res.status(500).json(ServiceError('Something went wrong'));
}


module.exports = globalErrorHandler