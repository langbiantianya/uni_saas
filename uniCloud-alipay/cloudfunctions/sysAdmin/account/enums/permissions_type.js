class PermissionType {
    static Action = new PermissionType("action")
    static Menu = new PermissionType("menu")
    constructor(value) {
        this.value = value
    }
    /**
     * 
     * @param {String} type 
     * @returns {Boolean}
     */
    equals(type) {
        return this.value === type || this == type
    }
    toString() {
        return this.value
    }
}
module.exports = PermissionType 