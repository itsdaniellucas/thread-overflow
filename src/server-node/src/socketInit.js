const socketIO = require('socket.io')
const { thread: threadConstants } = require('./constants')
const { CORS } = require('./config.json')

module.exports = (server) => {
    const io = socketIO(server, {
        cors: CORS
    });
    
    io.on('connection', (socket) => {
        socket.on('SendThreadChanges', (threadId) => {
            if(threadId == threadConstants.self) {
                socket.emit('ReceiveThreadChanges', threadId);
            } else {
                io.emit('ReceiveThreadChanges', threadId);
            }
        });
    });
}

