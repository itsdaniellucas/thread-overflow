const jwt = require('express-jwt')
const { JWT } = require('../config.json')

function authorize(roles = []) {
    if(typeof roles === 'string') {
        roles = [roles];
    }

    const roleValidation = (req, res, next) => {
        if(roles.length && !roles.includes(req.user.data.role)) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        next();
    };

    return [
        jwt({ 
            secret: JWT.Secret, 
            audience: JWT.Audience, 
            issuer: JWT.Issuer, 
            algorithms: ['HS256'],
            getToken: (req) => req.headers['x-access-token']
        }),
        roleValidation
    ];
}

function conditionalAuthorize(req, res, next) {
    if(req.headers['x-access-token']) {
        return authorize()[0](req, res, next);
    } else {
        next();
    }
}


module.exports = { 
    authorize,
    conditionalAuthorize,
};