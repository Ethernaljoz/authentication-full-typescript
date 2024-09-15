import { NOT_FOUND,OK } from "../constants/httpCode";
import UserModel, { UserDocument } from "../models/user.model";
import { refreshUserAccessToken } from "../services/auth.service";
import { appAssert } from "../utils/AppError";
import catchErrors from "../utils/catchErrors";

export const getAllUserHandler = catchErrors(
    async(req, res)=>{
        let users = await UserModel.find()
        appAssert(users,NOT_FOUND,"")
        const user = users.map(user => user.omitPassword())
        return res.status(OK).json(user)
    }
)