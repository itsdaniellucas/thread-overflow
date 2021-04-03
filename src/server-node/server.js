const express = require('express')

const app = express()
const morgan = require('morgan')
const { v4: uuidv4 } = require('uuid')
const http = require('http');
const server = http.createServer(app);
const cors = require('cors')
const { port, CORS } = require('./src/config.json')
const globalErrorHandler = require('./src/globalErrorHandler')
const winstonConfig = require('./src/winstonConfig')
const threadController = require('./src/controllers/threadController')
const loginController = require('./src/controllers/loginController')

// inits
require('./src/db/dbInit')
require('./src/socketInit')(server);

// server configs
app.use(cors(CORS));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.uuid = uuidv4();
    next();
});

// logging
morgan.token('body', (req, res) => {
    if(!req.url.includes('/Authenticate')) {
        return JSON.stringify(req.body);
    }
    return JSON.stringify({})
});
morgan.token('user', (req, res) => req.user ? (req.user.data ? (req.user.data.username || '-') : '-') : '-');
morgan.token('uuid', (req, res) => res.locals.uuid);
app.use(morgan(':date[iso] :uuid :method :url :response-time ms :user :body', { stream: winstonConfig.stream }));

// routes
app.use('/api/v1/Login', loginController);
app.use('/api/v1/Thread', threadController);
app.get('/', (req, res) => res.json('Thread Overflow API'));
app.use(globalErrorHandler)


// server start
server.listen(port, () => {
    console.log(`ThreadOverflow listening at http://localhost:${port}`)
})
