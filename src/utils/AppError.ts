import { HttpStatusCode } from "../constants/httpCode";
import assert from "node:assert"



export default class AppError extends Error{
    constructor(
        public statusCode:HttpStatusCode,
        public message :string
    ){
        super(message)
    }
}



type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
) => asserts condition;
/**
 * Asserts a condition and throws an AppError if the condition is falsy.
 */

export const appAssert: AppAssert = (
  condition,
  httpStatusCode,
  message,
) => assert(condition, new AppError(httpStatusCode, message));
