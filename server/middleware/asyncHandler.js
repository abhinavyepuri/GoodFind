// Express 4 does not catch errors thrown inside async handlers.
// Wrapping them here means one bad request returns a 500 instead of killing the server.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
