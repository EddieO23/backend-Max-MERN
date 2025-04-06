class HttpError extends Error {
  constructor(message, errorCode) {
    super(message) // Add a "message" property
    this.code = errorCode // This adds a code property
  }
}

module.exports = HttpError