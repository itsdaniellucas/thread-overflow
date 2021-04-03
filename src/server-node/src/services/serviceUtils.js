
function ServiceResult(data, success = true, error = '') {
    return {
        Data: data,
        IsSuccessful: success,
        Error: error,
    }
}

function ServiceSuccess(data) {
    return {
        Data: data,
        IsSuccessful: true,
        Error: ''
    };
}

function ServiceError(error) {
    return {
        Data: null,
        IsSuccessful: false,
        Error: error
    };
}

module.exports = {
    ServiceResult,
    ServiceSuccess,
    ServiceError
}