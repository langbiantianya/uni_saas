const cloud = require('./cloud/index.js')
const js = require('./js/index.js')
const {
	BasicRepo,
	add,
	addList,
	update,
	deleteReal,
	reomve,
	info,
	list,
	page
} = require('./repo/index.js')
const logger = require('./logger/index.js')
const Context = require('./context/index.js')
const { callError, NotAuthorizedError, SourceError, UniError, UniAggregateError, HttpStatusCode, fmtError, ValidatorException } = require('./errors/index.js')
const { Action, ControllerAction } = require('./action/index.js')
const { After, Before } = require('./middleware/index.js')
const BasicService = require('./service/index.js')
const BasicController = require('./controller/index.js')
const enforcer = require('./casbin/index.js')
const { diff } = require("./utils/arrayUtils.js")

module.exports = {
	cloud,
	js,
	repo: {
		add,
		addList,
		update,
		deleteReal,
		reomve,
		info,
		list,
		page
	},
	logger,
	Context,
	Action,
	ControllerAction,
	errors: {
		callError,
		SourceError,
		NotAuthorizedError,
		UniError,
		UniAggregateError,
		HttpStatusCode,
		fmtError,
		ValidatorException
	},
	middleware: {
		After,
		Before
	},
	BasicController,
	BasicService,
	BasicRepo,
	enforcer,
	arrayUtils: {
		diff
	}
}