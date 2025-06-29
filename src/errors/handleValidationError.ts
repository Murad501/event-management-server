import mongoose from "mongoose";
import { IGenericErrorResponse } from "../app/interfaces/common";
import { IGenericErrorMessage } from "../app/interfaces/error";

const handleValidationError = (
  error: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = Object.values(error.errors).map(
    (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: el.path,
        message: el.message,
      };
    }
  );
  return {
    statusCode: 500,
    message: "Validation Error",
    errorMessages: errors,
  };
};

export default handleValidationError;
