import {HttpException, HttpStatus} from "@nestjs/common";
import {ErrorMessages} from "./error-messages";

type ICode = keyof typeof ErrorMessages

export const ThrowException = (code: ICode, status: number = HttpStatus.BAD_REQUEST) => {
    throw new HttpException(
        {
            message: ErrorMessages[code],
            code,
        },
        status
    )
}


