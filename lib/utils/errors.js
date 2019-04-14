class KeyAlreadyExistsError extends Error {
  constructor(error){
    const detail = error.detail
    const err = _parseErrorMessage(detail)
    const message = `There exists an account with a similar ${err.key} as ${err.value}.`
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

function _parseErrorMessage(message) {
  const keyNameReg = /\(([^)]+)\)/g
  const key = keyNameReg.exec(message)[1]
  const value = keyNameReg.exec(message)[1]
  return {key,value}
}

function determineError(error) {
  if(error.detail.indexOf('already exits')) return new KeyAlreadyExistsError(error)
  else return new Error(error)
}

module.exports = {
determineError
}