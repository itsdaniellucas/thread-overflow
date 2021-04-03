const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const { JWT } = require('../config.json')
const { UserModel } = require('../db/models/user')
const { ServiceSuccess, ServiceError } = require('../services/serviceUtils')
const { AssignDefaults  } = require('../db/dbUtils')

function authenticate({ Username, Password }) {
    let hash = crypto.createHash('sha256').update(Password).digest('hex');

    return UserModel.findOne({
        username: Username,
        password: hash,
        active: true,
    }).select('username role')
    .then(user => {
        if(!user) {
            return ServiceError('User not found');
        }

        const expiration = Math.floor(Date.now() / 1000) + (60 * 60);

        const token = jwt.sign({ data: user, exp: expiration }, 
                                JWT.Secret, 
                                { 
                                    audience: JWT.Audience, 
                                    issuer: JWT.Issuer,
                                });

        return ServiceSuccess({
            User: user,
            Token: token,
            TokenExpiration: expiration * 1000,
        });
    })
    .catch(err => {
        throw err
    });
}

function addUser({username, password, role}) {
    let hash = crypto.createHash('sha256').update(password).digest('hex');
    let model = AssignDefaults({
        username: username,
        password: hash,
        role: role,
    });

    return UserModel.create(model).then(data => {
        return data;
    }).catch(err => {
        throw err;
    })
}


module.exports = {
    authenticate,
    addUser
}