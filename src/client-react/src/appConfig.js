import error401 from './assets/images/errors/error401.svg'
import error403 from './assets/images/errors/error403.svg'
import error404 from './assets/images/errors/error404.svg'
import error500 from './assets/images/errors/error500.svg'


const appConfig = Object.freeze({
    baseUrl: "http://localhost:5000/api/v1",
    rootUrl: "http://localhost:5000",
    isCORS: true,
    errorCodes: [401, 403, 404, 500],
    errorImages: {
        401: error401,
        403: error403,
        404: error404,
        500: error500,
    },
});


export default appConfig