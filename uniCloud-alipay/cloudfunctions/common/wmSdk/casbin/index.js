const { newEnforcer, newModelFromString } = require("casbin")
const { newFilteredAdapter } = require('./uniCloudAdapter')

const m = newModelFromString(`
[request_definition]
r = sub, dom, obj, act

[policy_definition]
p = sub, dom, obj, act

[role_definition]
g = _, _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub, r.dom) && r.dom == p.dom && r.obj == p.obj && r.act == p.act
`)
const enforcer = newEnforcer(m, newFilteredAdapter(uniCloud.database()))

module.exports = enforcer