const { BatchAdapter, FilteredAdapter, Model, Helper, UpdatableAdapter } = require('casbin')
// 不支持并发
class UniCloudAdapter {
    /**
     * 
     * @param {string} sec Section of the policy
     * @param {string} pType Type of the policy (e.g. "p" or "g")
     * @param {string[][]} rules  rules Policy rule to add into enforcer
     * @returns  {Promise<void>}
     */
    async addPolicies(sec, pType, rules) {
        if (this.isSynced) {
            const session = await this.getTransaction()
            try {
                const promises = rules.map(async (rule) => this.addPolicy(sec, pType, rule))
                await Promise.all(promises)
                this.autoCommit && session && await this.commitTransaction()
            } catch (err) {
                this.autoAbort && session && await this.abortTransaction()
                throw err
            }
        } else {
            throw new Error(
                'addPolicies is only supported by SyncedAdapter. See newSyncedAdapter'
            )
        }
    }
    /**
     * 
     * @param {string} sec 
     * @param {string} ptype 
     * @param {string[][]} rules
     * @returns  {Promise<void>}
     */
    async removePolicies(sec, pType, rules) {
        if (this.isSynced) {
            try {
                const session = await this.getTransaction()
                const promises = rules.map(async (rule) => this.removePolicy(sec, pType, rule))
                await Promise.all(promises)
                this.autoCommit && session && await this.commitTransaction()
            } catch (err) {
                this.autoAbort && session && await this.abortTransaction()
                throw err
            }

        } else {
            throw new Error(
                'removePolicies is only supported by SyncedAdapter. See newSyncedAdapter'
            )
        }
    }
    /**
     * 
     * @param {Model} model 
     * @returns {Promise<void>}
     */
    loadPolicy(model) {
        return this.loadFilteredPolicy(model, null)
    }
    /**
     * 
     * @param {Model} model 
     * @returns {Promise<boolean>}
     */
    async savePolicy(model) {
        let session
        let sessionf
        if (this.isSynced) {
            sessionf = await this.getTransaction()
        } else {
            session = await this.getSession()
        }
        try {
            const lines = []
            const policyRuleAST = model.model.get('p') instanceof Map ? model.model.get('p') : new Map()
            const groupingPolicyAST = model.model.get('g') instanceof Map ? model.model.get('g') : new Map()
            for (const [ptype, ast] of policyRuleAST) {
                for (const rule of ast.policy) {
                    lines.push(this.savePolicyLine(ptype, rule))
                }
            }

            for (const [ptype, ast] of groupingPolicyAST) {
                for (const rule of ast.policy) {
                    lines.push(this.savePolicyLine(ptype, rule))
                }
            }
            await (session || sessionf).add(lines)
            this.autoCommit && sessionf && await this.commitTransaction()
        } catch (err) {
            this.autoAbort && sessionf && await this.abortTransaction()
            return false
        }
        return true
    }
    /**
     * 
     * @param {string} sec sec Section of the policy
     * @param {string} ptype Type of the policy (e.g. "p" or "g")
     * @param {string[]} rule  Policy rule to add into enforcer
     * @returns  {Promise<void>}
     */
    async addPolicy(sec, ptype, rule) {
        let session
        let sessionF
        try {
            if (this.isSynced) {
                sessionF = await this.getTransaction()
            } else {
                session = await this.getSession()
            }
            const line = this.savePolicyLine(ptype, rule)
            await (sessionF || session).add(line)
            this.autoCommit && sessionF && await this.commitTransaction()
        } catch (err) {
            this.autoAbort && sessionF && await this.abortTransaction()
            throw err
        }
    }
    /**
     * 
     * @param {string} sec 
     * @param {string} ptype 
     * @param {string[]} rule 
     * @returns  {Promise<void>}
     */
    async removePolicy(sec, pType, rule) {
        let session
        let sessionF
        try {
            if (this.isSynced) {
                sessionF = await this.getTransaction()
            } else {
                session = await this.getSession()
            }
            const where = this.savePolicyLine(pType, rule)
            await (sessionF || session).where(where).remove()
            this.autoCommit && sessionF && this.commitTransaction()
        } catch (err) {
            this.autoAbort && sessionF && await this.abortTransaction()
            throw err
        }
    }
    /**
     * 
     * @param {string} sec 
     * @param {string} ptype 
     * @param {number} fieldIndex 
     * @param  {...string[]} fieldValues 
     * @returns  {Promise<void>}
     */
    async removeFilteredPolicy(sec, pType, fieldIndex, ...fieldValues) {
        let session
        let sessionF
        try {
            if (this.isSynced) {
                sessionF = await this.getTransaction()
            } else {
                session = await this.getSession()
            }
            const where = pType ? { ptype: pType } : {}

            if (fieldIndex <= 0 && fieldIndex + fieldValues.length > 0 && fieldValues[0 - fieldIndex]) {
                if (pType === 'g') {
                    where.$or = [{ v0: fieldValues[0 - fieldIndex] }, { v1: fieldValues[0 - fieldIndex] }];
                } else {
                    where.v0 = fieldValues[0 - fieldIndex];
                }
            }

            if (fieldIndex <= 1 && fieldIndex + fieldValues.length > 1 && fieldValues[1 - fieldIndex]) {
                where.v1 = fieldValues[1 - fieldIndex];
            }

            if (fieldIndex <= 2 && fieldIndex + fieldValues.length > 2 && fieldValues[2 - fieldIndex]) {
                where.v2 = fieldValues[2 - fieldIndex];
            }

            if (fieldIndex <= 3 && fieldIndex + fieldValues.length > 3 && fieldValues[3 - fieldIndex]) {
                where.v3 = fieldValues[3 - fieldIndex];
            }

            if (fieldIndex <= 4 && fieldIndex + fieldValues.length > 4 && fieldValues[4 - fieldIndex]) {
                where.v4 = fieldValues[4 - fieldIndex];
            }

            if (fieldIndex <= 5 && fieldIndex + fieldValues.length > 5 && fieldValues[5 - fieldIndex]) {
                where.v5 = fieldValues[5 - fieldIndex];
            }

            await (sessionF || session).where(where).remove()
            this.autoCommit && sessionF && await this.commitTransaction()
        } catch (err) {
            this.autoAbort && sessionF && await this.abortTransaction()
            throw err
        }
    }
    /**
     * 
     * @param {Model} model 
     * @param {any} filter 
     * @returns  {Promise<void>}
     */
    async loadFilteredPolicy(model, filter) {
        if (filter) {
            this.setFiltered(true)
        } else {
            this.setFiltered(false)
        }
        let lines = []
        if (this.isSynced) {
            const session = await this.getTransaction()
            let count = (await session.where(filter || {}).count()).total
            let skip = 0
            while (count > 0) {
                let line = (await session.where(filter || {}).limit(1000).skip(skip).get()).data
                lines.push(...line)
                count -= skip
                skip += 1000
            }
            this.autoCommit && session && await this.commitTransaction()
        } else {
            const session = await this.getSession()
            let count = (await session.where(filter || {}).count()).total
            let skip = 0
            while (count > 0) {
                let line = (await session.where(filter || {}).limit(1000).skip(skip).get()).data
                lines.push(...line)
                count -= skip
                skip += 1000
            }
        }
        for (const line of lines) {
            this.loadPolicyLine(line, model);
        }
    }

    /**
    * Loads one policy rule into casbin model.
    * This method is used by casbin and should not be called by user.
    *
    * @param {Object} line Record with one policy rule from MongoDB
    * @param {Object} model Casbin model to which policy rule must be loaded
    */
    loadPolicyLine(line, model) {
        let lineText = `${line.ptype}`
        for (const word of [line.v0, line.v1, line.v2, line.v3, line.v4, line.v5]) {
            if (word !== undefined) {
                let wrappedWord = /^".*"$/.test(word) ? word : `"${word}"`
                lineText = `${lineText},${wrappedWord}`
            } else {
                break;
            }
        }
        if (lineText) {
            Helper.loadPolicyLine(lineText, model)
        }
    }

    /**
     * @param {String} pType Policy type to save into MongoDB
     * @param {Array<String>} rules An array which consists of policy rule elements to store
     * @returns {{ptype:String,v0:String,v1:String,v2:String,v3:String,v4:String}} 
     */

    savePolicyLine(pType, rule) {
        const model = {
            ptype: pType
        }
        if (rule.length > 0) {
            model.v0 = rule[0]
        }
        if (rule.length > 1) {
            model.v1 = rule[1]
        }
        if (rule.length > 2) {
            model.v1 = rule[2]
        }
        if (rule.length > 3) {
            model.v1 = rule[3]
        }
        if (rule.length > 4) {
            model.v1 = rule[4]
        }
        if (rule.length > 5) {
            model.v1 = rule[5]
        }
        return model
    }

    /**
     * 
     * @returns  {boolean}
     */
    isFiltered() {
        return this.filtered
    }
    /**
     * 
     * @param {string} sec 
     * @param {string} ptype 
     * @param {string[]} oldRule 
     * @param {string[]} newRule 
     * @returns  {Promise<void>}
     */
    async updatePolicy(sec, pType, oldRule, newRule) {
        let seesionF
        let seesion
        try {
            if (this.isSynced) {
                seesionF = await this.getTransaction()
            } else {
                seesion = await this.getSession()
            }
            const { ptype, v0, v1, v2, v3, v4, v5 } = this.savePolicyLine(pType, oldRule)
            const newRuleLine = this.savePolicyLine(pType, newRule)
            const newModel = {
                ptype: newRuleLine.ptype,
                v0: newRuleLine.v0,
                v1: newRuleLine.v1,
                v2: newRuleLine.v2,
                v3: newRuleLine.v3,
                v4: newRuleLine.v4,
                v5: newRuleLine.v5
            }
            await (seesionF || seesion).where({ ptype, v0, v1, v2, v3, v4, v5 }).update(newModel)
            this.autoCommit && seesionF && await this.commitTransaction()
        } catch (err) {
            this.autoAbort && seesionF && await this.abortTransaction()
            throw err
        }


    }

    setFiltered(enable = true) {
        this.isFiltered = enable
    }
    setSynced(synced = true) {
        this.isSynced = synced
    }
    setAutoAbort(abort = true) {
        if (this.isSynced) this.autoAbort = abort
    }
    setAutoCommit(commit = true) {
        if (this.isSynced) this.autoCommit = commit
    }

    async getSession() {
        // if (this.isSynced) {
        return this.session ? this.session : this.db.collection(this.tableName)
        // } else
        //     throw new Error(
        //         'Transactions are only supported by SyncedAdapter. See newSyncedAdapter'
        //     )
    }

    async setSession(collection) {
        if (this.isSynced) {
            this.session = collection
        } else {
            throw new Error(
                'Sessions are only supported by SyncedAdapter. See newSyncedAdapter'
            )
        }
    }

    async commitTransaction() {
        if (this.isSynced) {
            if (!this.transaction) {
                await this.transaction.commit()
            }
            this.transaction = null
        } else
            throw new Error(
                'Transactions are only supported by SyncedAdapter. See newSyncedAdapter'
            )
    }

    async abortTransaction() {
        if (this.isSynced) {
            if (!this.transaction) {
                await this.transaction.rollback()
            }
            this.transaction = null
        } else
            throw new Error(
                'Transactions are only supported by SyncedAdapter. See newSyncedAdapter'
            )
    }

    async getTransaction() {
        if (this.isSynced) {
            if (!this.transaction) {
                this.transaction = await db.startTransaction()
            }
            return this.transaction.collection(this.tableName)
        } else {
            throw new Error(
                'Transactions are only supported by SyncedAdapter. See newSyncedAdapter'
            )
        }

    }
    /**
     * 
     * @param {object} db 云数据库
     */
    constructor(db) {
        this.tableName = "casbin-rule"
        this.db = db ?? uniCloud.database()
        this.filtered = false
        this.isSynced = false
        this.autoAbort = false
        this.autoCommit = false
    }
}

function newAdapter(db, adapterOptions = {}) {
    const adapter = new UniCloudAdapter(db)
    const {
        filtered = false,
        synced = false,
        autoAbort = false,
        autoCommit = false
    } = adapterOptions
    adapter.setFiltered(filtered)
    adapter.setSynced(synced)
    adapter.setAutoAbort(autoAbort)
    adapter.setAutoCommit(autoCommit)
    return adapter
}
/**
 * 
 * @param {object} db 
 * @returns 
 */
function newFilteredAdapter(db) {
    const adapter = newAdapter(db, {
        filtered: true
    })
    return adapter
}
/**
 * 
 * @param {object} db 
 * @param {boolean} autoAbort 
 * @param {boolean} autoCommit 
 * @returns 
 */
function newSyncedAdapter(
    db,
    autoAbort = true,
    autoCommit = true
) {
    const adapter = newAdapter(db, {
        synced: true,
        autoAbort,
        autoCommit
    })
    return adapter
}

module.exports = {
    newFilteredAdapter, newSyncedAdapter
}