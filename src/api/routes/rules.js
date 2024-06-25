const { getRuleID, getAllRule, postRule } = require('../controllers/rules')


const ruleRouter = require('express').Router()

ruleRouter.get('/:id', getRuleID)
ruleRouter.get('/', getAllRule)
ruleRouter.post('/', postRule)

module.exports = ruleRouter 