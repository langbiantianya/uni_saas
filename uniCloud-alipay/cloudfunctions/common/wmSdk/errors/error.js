const Context = require("../context")
const HttpStatusCode = require("./httpStatusCode")

// https://uniapp.dcloud.net.cn/tutorial/err-spec.html#unierror
class SourceError extends Error {
    //  源错误（如app端三方SDK）的原始错误描述信息
    message
    //  源错误（如app端三方SDK）模块名称，如uni-AD中的穿山甲广告SDK的模块名称为"csj"
    subject
    // 源错误（如app端三方SDK）的原始错误码
    code
    //  上级源错误，只有一个源错误时是SourceError，包含多个源错误时封装成AggregateError
    cause
    // 上下文
    context
    // 调用堆栈
    stack
    /**
     * 
     * @param {String} message 
     * @param {String|null} subject 
     * @param {Number|null} code 
     * @param {SourceError|UniAggregateError|null} cause 
     * @param {String|null} stack 
     * @param {string|null} name 
     * @param {Context|null} context 
     */
    constructor(message, subject, code, cause, stack, name, context) {
        super(message)
        this.stack = stack
        this.name = name ?? "SourceError"
        this.message = message
        this.subject = subject
        this.code = code
        this.cause = cause
        this.context = context
    }
}

class UniAggregateError extends SourceError {
    errors
    /**
     * @param {String|null} message 
     * @param {String|null} subject 
     * @param {Number|null} code 
     * @param {SourceError|UniAggregateError} cause 
     * @param {Context|null} context 
     * @param {Array<SourceError|UniAggregateError>} errors 
     */
    constructor(message, subject, code, cause, stack, name, context, errors) {
        super(message, subject, code, cause, stack, name, context)
        this.name = "UniAggregateError"
        this.errors = errors
    }
}

class UniError {
    // errSubject 统一错误主题（模块）名称，字符串类型，存在多级模块时使用"::"分割，即"模块名称::二级模块名称"，参考errSubject（模块/主题）名称
    errSubject
    /**
     * errCode 统一错误码，数字类型，通常0表示成功，其它为错误码。
     * 对于已经实现的API，继续保留现有errCode规范（保留向下兼容）。
     * 错误码长度及规范参考微信小程序的Errno错误码，使用 7 位数错误码，第 1 - 2 位标识 API 接口的一级类目，第 3 - 4 位标识 API 接口的二级类目，第 5 - 7 位表示具体的错误类型。 其他平台，与微信小程序相同的错误，错误码应尽量保持一致。定义平台专有错误码时，为了避免冲突，错误码的第 5 - 7 位按以下规则：
     * 跨端（App/Web）：使用6xx
     * App-Android端：使用7xx
     * App-iOS端：使用8xx
     * Web端：使用9xx
     */
    errCode
    // errMsg 统一错误描述信息，字符串类型，应准确描述引起的错误原因
    errMsg
    // data 可选，错误时返回的数据，比如获取设备信息时，如部分数据获取成功，部分数据获取失败，此时触发错误回调，需将获取成功的数据放到data属性中
    data
    // cause 可选，源错误信息，可以包含多个错误，详见SourceError
    cause
    /**
     * 
     * @param {SourceError|UniAggregateError} error 
     * @param {String|null} errSubject 
     * @param {object|null} data 
     */
    constructor(error, errSubject, data) {
        this.errSubject = errSubject
        this.errCode = error.code??HttpStatusCode.BadRequest.value
        this.errMsg = error.message
        this.cause = error.cause
        this.data = data
    }
}

class NotAuthorizedError extends Error {
    constructor(){
        super("NotAuthorizedException")
        this.code = HttpStatusCode.Forbidden.value
    }
}
class ValidatorException extends Error{
    constructor(){
        super("ValidatorException")
    }
}

module.exports = {
    NotAuthorizedError,
    SourceError,
    UniAggregateError,
    UniError,
    ValidatorException
}