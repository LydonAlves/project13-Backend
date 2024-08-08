const cleanJSONString = (inputString) => {
  let cleanedString = inputString
    .replace(/\n/g, '')
    .replace(/\\n/g, '')
    .replace(/\\'/g, "'")
    .replace(/\\/g, '')
    .replace(/\s*\+\s*/g, '');
  return cleanedString;
}

// module.exports = { cleanJSONString }
module.exports = cleanJSONString 