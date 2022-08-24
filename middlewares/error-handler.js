import CustomApiError from '../errors/CustomError.js';
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  if (err instanceof CustomApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({ message: err });
};

export default errorHandlerMiddleware;
