/**
 * 
 * @param {Array} before 
 * @param {Array} after 
 * @returns {{added:Array, deleted:Array}}
 */
function diff(before, after) {
    const added = after.filter(x => !arr1.includes(x));
    const deleted = before.filter(x => !arr2.includes(x));
    return { added, deleted }
}

module.exports = { diff }