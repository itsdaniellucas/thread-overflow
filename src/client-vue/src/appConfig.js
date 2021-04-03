const appConfig = Object.freeze({
    baseUrl: "http://localhost:5000/api/v1",
    rootUrl: "http://localhost:5000",
    isCORS: true,
    errorCodes: [401, 403, 404, 500],
    errorImages: {
        401: require("@/assets/images/errors/error401.svg"),
        403: require("@/assets/images/errors/error403.svg"),
        404: require("@/assets/images/errors/error404.svg"),
        500: require("@/assets/images/errors/error500.svg"),
    },
});


export default appConfig