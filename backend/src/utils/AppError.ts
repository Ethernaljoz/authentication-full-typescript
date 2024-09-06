import { HttpStatusCode } from "../constants/httpCode";

export default class AppError extends Error{
    constructor(
        public statusCode:HttpStatusCode,
        public message :string
    ){
        super(message)
    }
}