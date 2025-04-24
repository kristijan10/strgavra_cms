import errorMessages from "../utils/errorMessages.js";

export default (error, req, res, next) => {
  console.log(error.message, error.status);
  return res
    .status(error.status || errorMessages.INTERNAL_ERROR.status)
    .send({ message: error.message || errorMessages.INTERNAL_ERROR.message });
};
