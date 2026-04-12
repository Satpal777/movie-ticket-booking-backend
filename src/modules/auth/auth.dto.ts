import { z } from "zod";
import BaseDto from "../../utils/base.dto.js";


class LoginDto extends BaseDto {
    static schema = z.object({
        email: z.string().email().max(312),
        password: z.string().min(1).max(255),
    });
}

class RegisterDto extends BaseDto {
    static schema = z.object({
        name: z.string().min(2).max(225),
        email: z.string().email().max(312),
        password: z.string().min(1).max(255),
    });
}

class VerifyEmailDto extends BaseDto {
    static schema = z.object({
        token: z.string().min(1).max(255),
        userId: z.number().int(),
    });
}


export type LoginDtoType = z.infer<typeof LoginDto.schema>;
export type RegisterDtoType = z.infer<typeof RegisterDto.schema>;
export type VerifyEmailDtoType = z.infer<typeof VerifyEmailDto.schema>;

export { LoginDto, RegisterDto , VerifyEmailDto};