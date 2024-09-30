const Context = require('../context/index.js')
const BasicController = require('../controller/index.js')
const { SourceError, UniAggregateError, ValidatorException } = require('../errors/error.js')
const { fmtError } = require('../errors/index.js')
const logger = require('../logger/index.js')

class Action {
    scope
    context
    funcName
    /**
     * 
     * @param {(Context)=>Promise} call 可传可不传
     * @param {(Context)=>Promise} before 调用实际方法前执行
     * @param {(Context,object)=>Promise} after 调用方法之后执行
     * @param {(SourceError|UniAggregateError)=>SourceError|UniAggregateError} errorCall 异常处理
     * @returns {Promise<{res,Context}>}
     */
    async invok(before, after, errorCall, call) {
        try {
            if (before) {
                await before(this.context)
            }
        } catch (error) {
            throw errorCall(fmtError(error, this.context, "wmsdk.Action.invok"))
        }
        let res
        try {
            // 传入作用域调用controller层方法，controller统一转换上下文到service层调用
            res = call ? await call(this.context) : await uniCloud.importObject(this.scope)[this.controller](this.context)
        } catch (error) {
            throw errorCall(fmtError(error, this.context, "wmsdk.Action.invok"))
        }
        try {
            if (after) {
                await after(this.context, res)
            }
        } catch (error) {
            throw errorCall(fmtError(error, this.context, "wmsdk.Action.invok"))
        }

        return res
    }
    /**
     * 
     * @param {object} scope 
     * @param {Context} context 
     */
    constructor(context) {
        let scopeObj = context.scopeObj
        this.scope = scopeObj.scope
        this.controller = scopeObj.controller
        this.context = context
    }
}

class ControllerAction {
    /**
     * 
     * @param {object} funcName 
     * @param {Context} context 
     *  @returns {Promise}
     */
    async invok() {
        try {
            // 入参校验 按需添加
            if (!this.controller.validator(this.funcName, this.context)) {
                throw new ValidatorException()
            }
            // 入参裁剪转换 按需添加
            return await this.controller[this.funcName](this.controller.converter(this.funcName, this.context) ?? this.context)
        } catch (error) {
            throw fmtError(error, this.context, "wmsdk.ControllerAction.invok")
        }

    }
    /**
     * 
     * @param {BasicController} controller 
     * @param {String} funcName 
     * @param {Context} context 
     */
    constructor(controller, context) {
        let scopeObj = context.scopeObj
        this.controller = controller
        this.funcName = scopeObj.funcName
        this.context = context
    }
}

module.exports = { Action, ControllerAction }


