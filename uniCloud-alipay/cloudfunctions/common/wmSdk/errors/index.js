const { SourceError, NotAuthorizedError, UniError, ValidatorException, UniAggregateError } = require("./error")
const Context = require('../context/index.js')
const logger = require("../logger/index")
const HttpStatusCode = require("./httpStatusCode")

/**
 * 最外层处理异常
 * @param {SourceError|UniAggregateError} error 
 * @returns 
 */
// TODO 记录异常到数据库
function callError(error) {
    logger.error(error)
    return new UniError(error)
}

/**
 * 格式化异常
 * @param {Error} error 
 * @param {Context} context 
 * @param {String|null} subject 
 * @returns {SourceError|UniAggregateError}
 */
function fmtError(error, context, subject) {
    if (error instanceof SourceError || error instanceof UniAggregateError) {
        if (error.context) {
            error.context = context
        }
        return error
    } else {
        return new SourceError(error.message, subject, HttpStatusCode.BadRequest.value, null, error.stack, error.name, context)
    }
}

module.exports = {
    callError,
    SourceError,
    UniError,
    UniAggregateError,
    NotAuthorizedError,
    HttpStatusCode,
    ValidatorException,
    fmtError
}