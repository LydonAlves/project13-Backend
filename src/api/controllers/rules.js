const Rule = require("../models/rules")


const getRuleID = async (req, res, next) => {
  try {
    const { id } = req.params
    const rule = await Rule.findById(id)
    return res.status(200).json(rule)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const getAllRule = async (req, res, next) => {
  try {
    const rule = await Rule.find()
    return res.status(200).json(rule)
  } catch (error) {
    return res.status(400).json(error)
  }
}


const postRule = async (req, res, next) => {
  try {
    const newRule = new Rule(req.body)
    const rule = await newRule.save()

    return res.status(201).json(rule)
  } catch (error) {
    console.error('Error in postEvent:', error)
    return res.status(400).json(error)
  }
}

module.exports = {
  getRuleID,
  getAllRule,
  postRule
}