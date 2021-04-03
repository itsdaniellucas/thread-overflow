const express = require('express')
const { authorize } = require('../auth/authorize')
const router = express.Router();
const loginService = require('../services/loginService')
const { ServiceSuccess } = require('../services/serviceUtils')

router.post('/Authenticate', authenticate);
router.get('/GetUser', authorize(), getUser);

function authenticate(req, res) {
    loginService.authenticate(req.body)
                .then(data => res.json(data));
}

function getUser(req, res) {
    res.json(ServiceSuccess(req.user.data))
}


module.exports = router;