module.exports = function (decoded, request) {
  if(decoded.id) {
    return {
      isValid: false
    };
  } else {
    return {
      isValid: true
    };
  }
}