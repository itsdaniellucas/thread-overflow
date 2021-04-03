const express = require('express')
const router = express.Router()
const threadService = require('../services/threadService')
const { authorize, conditionalAuthorize } = require('../auth/authorize')

router.get('/All', conditionalAuthorize, getAllThreads)
router.get('/Self', authorize(), getSelfThreads)
router.get('/:threadId/Messages', conditionalAuthorize, getThreadMessages)
router.post('/Add', authorize(), addThread)
router.post('/:threadId/Remove', authorize(), removeThread)
router.post('/:threadId/Messages/Add', authorize(), addMessage)
router.post('/:threadId/Messages/:messageId/Modify', authorize(), modifyMessage)
router.post('/:threadId/Messages/:messageId/Remove', authorize(), removeMessage)
router.post('/:threadId/Upvote', authorize(), upvoteThread)
router.post('/:threadId/Downvote', authorize(), downvoteThread)
router.post('/:threadId/Messages/:messageId/Upvote', authorize(), upvoteMessage)
router.post('/:threadId/Messages/:messageId/Downvote', authorize(), downvoteMessage)


function getAllThreads(req, res) {
    let contextUserId = req.user ? (req.user.data ? req.user.data._id : -1) : -1;
    threadService.getAllThreads({ 
                    page: parseInt(req.query.Page) || 1,
                    itemsPerPage: parseInt(req.query.ItemsPerPage) || 10
                }, contextUserId)
                .then(data => res.json(data))
                .catch(err => {
                    throw err;
                })
}

function getSelfThreads(req, res) {
    threadService.getSelfThreads({ 
                    page: parseInt(req.query.Page) || 1,
                    itemsPerPage: parseInt(req.query.ItemsPerPage) || 10
                }, req.user.data._id)
                .then(data => res.json(data))
                .catch(err => {
                    throw err;
                })
}

function getThreadMessages(req, res) {
    let contextUserId = req.user ? (req.user.data ? req.user.data._id : -1) : -1;

    threadService.getThreadMessages(req.params.threadId, { 
                    page: parseInt(req.query.Page) || 1,
                    itemsPerPage: parseInt(req.query.ItemsPerPage) || 10
                }, contextUserId)
                .then(data => res.json(data))
                .catch(err => {
                    throw err;
                })
}

function addThread(req, res) {
    threadService.addThread(req.body, req.user.data._id)
                .then(data => res.json(data))
                .catch(err => {
                    throw err;
                })
}

function removeThread(req, res) {
    threadService.removeThread(req.params.threadId, req.user.data._id)
                .then(data => res.json(data))
                .catch(err => {
                    throw err;
                })
}

function addMessage(req, res) {
    threadService.addMessage(req.params.threadId, req.body.message, req.user.data._id)
                .then(data => res.json(data))
                .catch(err => {
                    throw err;
                })
}

function modifyMessage(req, res) {
    threadService.modifyMessage(req.params.threadId, req.params.messageId, req.body.message, req.user.data._id)
                .then(data => res.json(data))
                .catch(err => {
                    throw err;
                })
}

function removeMessage(req, res) {
    threadService.removeMessage(req.params.threadId, req.params.messageId, req.user.data._id)
                .then(data => res.json(data))
                .catch(err => {
                    throw err;
                })
}

function upvoteThread(req, res) {
    threadService.upvoteThread(req.params.threadId, req.user.data._id)
                .then(data => res.json(data))
                .catch(err => {
                    throw err;
                })
}

function downvoteThread(req, res) {
    threadService.downvoteThread(req.params.threadId, req.user.data._id)
                .then(data => res.json(data))
                .catch(err => {
                    throw err;
                })
}

function upvoteMessage(req, res) {
    threadService.upvoteMessage(req.params.threadId, req.params.messageId, req.user.data._id)
                .then(data => res.json(data))
                .catch(err => {
                    throw err;
                })
}

function downvoteMessage(req, res) {
    threadService.downvoteMessage(req.params.threadId, req.params.messageId, req.user.data._id)
                .then(data => res.json(data))
                .catch(err => {
                    throw err;
                })
}

module.exports = router;