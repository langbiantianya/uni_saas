const Context = require('../context/index')

class Basic {
    id = ""
    regExp = []
    description = ""
    index
    enable
    /**
     * 
     * @param {Context} ctx 
     * @returns {Promise<any>}
     */
    main = async function (ctx) {
        console.log(ctx)
    }
    /**
     * 
     * @param {string} id 
     * @param {string[]} regExp  匹配云对象正则
     * @param {String} description 说明
     * @param {Number} index   
     * @param {Boolean} enable 通过设置enable=false可以关闭该中间件
     * @param {(Context)=>Promise<any>} main 
     */
    constructor(id, regExp, description, index, enable, main) {
        this.id = id
        this.regExp = regExp
        this.description = description
        this.index = index
        this.enable = enable
        this.main = main
    }
}

class After extends Basic {
}

class Before extends Basic {
}

module.exports = { After, Before }