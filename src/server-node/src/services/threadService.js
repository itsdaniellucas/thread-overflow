const { ThreadModel } = require('../db/models/thread')
const { ServiceSuccess, ServiceError } = require('../services/serviceUtils')
const { AssignDefaults } = require('../db/dbUtils')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types


function addThread(thread, contextUserId) {
    const model = AssignDefaults({
        title: thread.title,
        author: contextUserId,
        upvotes: [contextUserId],
        downvotes: [],
        messages: [
            AssignDefaults({
                content: thread.content,
                author: contextUserId,
                upvotes: [contextUserId],
                downvotes: [],
            }, contextUserId)
        ]
    }, contextUserId);

    return ThreadModel.create(model)
                .then(_ => ServiceSuccess())
                .catch(err => {
                    throw err;
                });
}

function removeThread(threadId, contextUserId) {
    let model = AssignDefaults({}, contextUserId, false);
    model.active = false;

    return ThreadModel.updateOne({ _id: threadId, author: contextUserId }, model)
                        .then(data => {
                            if(data.n == 0) {
                                return ServiceError('Thread was not removed.');
                            }

                            return ServiceSuccess();
                        })
                        .catch(err => {
                            throw err;
                        })
}

function getAllThreads(pagination, contextUserId) {
    const take = pagination.itemsPerPage;
    const skip = (pagination.page - 1) * take;

    return ThreadModel.find({ active: true }, { messages: {$slice: 1} })
                        .select('title upvotes downvotes author messages dateCreated')
                        .populate('author', 'username')
                        .skip(skip)
                        .limit(take)
                        .sort('-dateCreated')
                        .then(data => {
                            let threads = data.map(t => transformThread(t, contextUserId));
                            
                            return ThreadModel.countDocuments({ active: true })
                                                .then(count => {
                                                    return ServiceSuccess({
                                                        threads: threads,
                                                        totalPages: Math.ceil(count / take),
                                                    })
                                                })
                                                .catch(err => {
                                                    throw err;
                                                })
                        })
                        .catch(err => {
                            throw err;
                        })
}

function getSelfThreads(pagination, contextUserId) {
    const take = pagination.itemsPerPage;
    const skip = (pagination.page - 1) * take;

    return ThreadModel.find({ active: true, author: contextUserId }, { messages: {$slice: 1} })
                        .select('title upvotes downvotes author messages dateCreated')
                        .populate('author', 'username')
                        .skip(skip)
                        .limit(take)
                        .sort('-dateCreated')
                        .then(data => {
                            let threads = data.map(t => transformThread(t, contextUserId));
                            
                            return ThreadModel.countDocuments({ active: true, author: contextUserId })
                                                .then(count => {
                                                    return ServiceSuccess({
                                                        threads: threads,
                                                        totalPages: Math.ceil(count / take),
                                                    })
                                                })
                                                .catch(err => {
                                                    throw err;
                                                })
                        })
                        .catch(err => {
                            throw err;
                        })
}

function getThreadMessages(threadId, pagination, contextUserId) {
    const take = pagination.itemsPerPage;
    const skip = (pagination.page - 1) * take;

    return ThreadModel.aggregate([
        { '$match': { active: true, _id: ObjectId(threadId) } },
        { '$project': {
                title: 1, 
                messageCount: { 
                    '$size': {
                        '$filter': {
                            'input': '$messages',
                            'cond': {
                                '$eq': ['$$this.active', true]
                            }
                        }
                    }    
                },
                messages: { '$slice': ['$messages', skip, take] },
            } 
        },
        { '$unwind': '$messages' },
        { '$lookup': {
                from: 'users',
                localField: 'messages.author',
                foreignField: '_id',
                as: 'messages.author'
            } 
        },
        { '$unwind': '$messages.author' },
        {
            '$group': {
                '_id': '$_id',
                'messages': { '$push': '$messages' },
                'messageCount': { '$first': '$messageCount' },
                'title': { '$first': '$title' },
            }
        },
        {
            '$project': {
                'messages._id': 1,
                'messages.content': 1, 
                'messages.upvotes': 1, 
                'messages.downvotes': 1,
                'messages.dateCreated': 1,
                'messages.author.username': 1,
                'messages.active': 1,
                'messageCount': 1,
                'title': 1,
            }
        },
    ]).then(data => {
        if(data.length == 0) {
            return ServiceError('Thread not found');
        }

        let messages = data[0].messages.map(m => transformMessage(m, data[0]._id, contextUserId));
        let count = data[0].messageCount;
        let title = data[0].title;

        return ServiceSuccess({
            title: title,
            messages: messages,
            totalPages: Math.ceil(count / take),
        });
    }).catch(err => {
        throw err;
    })
}

function addMessage(threadId, message, contextUserId) {
    return ThreadModel.findById(threadId)
                        .select('messages')
                        .then(thread => {
                            thread.messages.push(AssignDefaults({
                                content: message,
                                upvotes: [contextUserId],
                                downvotes: [],
                                author: contextUserId,
                            }, contextUserId));

                            return thread.save()
                                        .then(_ => ServiceSuccess())
                                        .catch(err => {
                                            throw err;
                                        })
                        })
                        .catch(err => {
                            throw err;
                        })
}

function modifyMessage(threadId, messageId, message, contextUserId) {
    return ThreadModel.findById(threadId)
                        .select('messages')
                        .then(thread => {
                            let idx = thread.messages.findIndex(i => i._id == messageId && i.author == contextUserId);
                            
                            if(idx != -1) {
                                let target = thread.messages[idx];
                                target.content = message;
                                AssignDefaults(target, contextUserId, false);
                            } else {
                                return ServiceError('Message not found');
                            }

                            return thread.save()
                                        .then(_ => ServiceSuccess())
                                        .catch(err => {
                                            throw err;
                                        })
                        })
                        .catch(err => {
                            throw err;
                        })
}

function removeMessage(threadId, messageId, contextUserId) {
    return ThreadModel.findById(threadId)
                        .select('messages')
                        .then(thread => {
                            let idx = thread.messages.findIndex(i => i._id == messageId && i.author == contextUserId);
                            
                            if(idx != -1) {
                                let target = thread.messages[idx];
                                AssignDefaults(target, contextUserId, false);
                                target.active = false;
                            } else {
                                return ServiceError('Message not found');
                            }

                            return thread.save()
                                        .then(_ => ServiceSuccess())
                                        .catch(err => {
                                            throw err;
                                        })
                        })
                        .catch(err => {
                            throw err;
                        })
}

function upvoteThread(threadId, contextUserId) {
    return ThreadModel.findById(threadId)
                        .select('upvotes downvotes dateModified modifiedBy')
                        .then(thread => {
                            let upvotes = new Set(thread.upvotes.map(i => i.toString()));
                            let downvotes = new Set(thread.downvotes.map(i => i.toString()));

                            if(upvotes.has(contextUserId)) {
                                upvotes.delete(contextUserId);
                            } else {
                                upvotes.add(contextUserId);
                            }

                            if(downvotes.has(contextUserId)) {
                                downvotes.delete(contextUserId);
                            }
                            
                            thread.upvotes = [...upvotes];
                            thread.downvotes = [...downvotes];
                            AssignDefaults(thread, contextUserId, false);
                            return thread.save()
                                            .then(_ => ServiceSuccess())
                                            .catch(err => {
                                                throw err;
                                            })
                        })
                        .catch(err => {
                            throw err;
                        })
}

function downvoteThread(threadId, contextUserId) {
    return ThreadModel.findById(threadId)
                        .select('upvotes downvotes dateModified modifiedBy')
                        .then(thread => {
                            let upvotes = new Set(thread.upvotes.map(i => i.toString()));
                            let downvotes = new Set(thread.downvotes.map(i => i.toString()));

                            if(downvotes.has(contextUserId)) {
                                downvotes.delete(contextUserId)
                            } else {
                                downvotes.add(contextUserId);
                            }
                            
                            if(upvotes.has(contextUserId)) {
                                upvotes.delete(contextUserId);
                            }
                            
                            thread.upvotes = [...upvotes];
                            thread.downvotes = [...downvotes];
                            AssignDefaults(thread, contextUserId, false);
                            return thread.save()
                                            .then(_ => ServiceSuccess())
                                            .catch(err => {
                                                throw err;
                                            })
                        })
                        .catch(err => {
                            throw err;
                        })
}

function upvoteMessage(threadId, messageId, contextUserId) {
    return ThreadModel.findById(threadId)
                        .select('messages')
                        .then(thread => {
                            let idx = thread.messages.findIndex(i => i._id == messageId);

                            if(idx != -1) {
                                let upvotes = new Set(thread.messages[idx].upvotes.map(i => i.toString()));
                                let downvotes = new Set(thread.messages[idx].downvotes.map(i => i.toString()));

                                if(upvotes.has(contextUserId)) {
                                    upvotes.delete(contextUserId);
                                } else {
                                    upvotes.add(contextUserId);
                                }

                                if(downvotes.has(contextUserId)) {
                                    downvotes.delete(contextUserId);
                                }
                                
                                thread.messages[idx].upvotes = [...upvotes];
                                thread.messages[idx].downvotes = [...downvotes];
                                AssignDefaults(thread.messages[idx], contextUserId, false);
                            } else {
                                return ServiceError('Message not found');
                            }

                            return thread.save()
                                    .then(_ => ServiceSuccess())
                                    .catch(err => {
                                        throw err;
                                    });      
                        })
                        .catch(err => {
                            throw err;
                        })
}

function downvoteMessage(threadId, messageId, contextUserId) {
    return ThreadModel.findById(threadId)
                        .select('messages')
                        .then(thread => {
                            let idx = thread.messages.findIndex(i => i._id == messageId);

                            if(idx != -1) {
                                let upvotes = new Set(thread.messages[idx].upvotes.map(i => i.toString()));
                                let downvotes = new Set(thread.messages[idx].downvotes.map(i => i.toString()));

                                if(downvotes.has(contextUserId)) {
                                    downvotes.delete(contextUserId);
                                } else {
                                    downvotes.add(contextUserId);
                                }
                                
                                if(upvotes.has(contextUserId)) {
                                    upvotes.delete(contextUserId);
                                }
                                
                                thread.messages[idx].upvotes = [...upvotes];
                                thread.messages[idx].downvotes = [...downvotes];
                                AssignDefaults(thread.messages[idx], contextUserId, false);
                            } else {
                                return ServiceError('Message not found');
                            }
                            
                            return thread.save()
                                    .then(_ => ServiceSuccess())
                                    .catch(err => {
                                        throw err;
                                    });
                        })
                        .catch(err => {
                            throw err;
                        })
}



function transformMessage(message, threadId, contextUserId) {
    let userDidVote = null;
    if(message.upvotes.map(i => i.toString()).includes(contextUserId)) {
        userDidVote = true;
    } else if(message.downvotes.map(i => i.toString()).includes(contextUserId)) {
        userDidVote = false;
    }

    return {
        threadId: threadId,
        messageId: message._id,
        content: !message.active ? 'This message has been deleted by the user' :message.content,
        author: message.author.username,
        votes: message.upvotes.length - message.downvotes.length,
        userVoted: userDidVote,
        dateCreated: message.dateCreated,
        isDeleted: !message.active,
    }
}

function transformThread(thread, contextUserId) {
    let userDidVote = null;
    if(thread.upvotes.map(i => i.toString()).includes(contextUserId)) {
        userDidVote = true;
    } else if(thread.downvotes.map(i => i.toString()).includes(contextUserId)) {
        userDidVote = false;
    }
    
    return {
        threadId: thread._id,
        title: thread.title,
        content: thread.messages[0].content,
        author: thread.author.username,
        votes: thread.upvotes.length - thread.downvotes.length,
        userVoted: userDidVote,
        dateCreated: thread.dateCreated,
    }
}

module.exports = {
    addThread,
    removeThread,
    getAllThreads,
    getSelfThreads,
    getThreadMessages,
    addMessage,
    modifyMessage,
    removeMessage,
    upvoteThread,
    downvoteThread,
    upvoteMessage,
    downvoteMessage,
}