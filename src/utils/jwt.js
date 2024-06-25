const jwt = require('jsonwebtoken')

const generateKey = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '1y' })
}

const verifyKey = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY)
  } catch (error) {
    console.error('verification Error:', error)
  }
}

module.exports = { generateKey, verifyKey }