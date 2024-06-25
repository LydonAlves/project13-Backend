const { getGapfillTextByID, postGapfillText, getAllGapfillText, getGapFillByUserID } = require('../controllers/gapFillText')


const gapfillTextRouter = require('express').Router()

gapfillTextRouter.get('/:id', getGapfillTextByID)
gapfillTextRouter.get('/by-userId/:userId', getGapFillByUserID)
gapfillTextRouter.get('/', getAllGapfillText)
gapfillTextRouter.post('/', postGapfillText)

module.exports = gapfillTextRouter 