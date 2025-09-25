import { Controller, Route, Post, Body } from "tsoa";
import { CustomError } from "../middlewares/errorHandler";
import { authenticationService } from "../services/authentication.service";
import { AuthenticationDTO } from "../dto/authentication.dto";

@Route("auth")
export class AuthController extends Controller {

    @Post("/")
    public async login(@Body() payload: AuthenticationDTO) {
        const { grant_type: type, username: user, password: pass } = payload;

        if (type !== "password") {
            const err: CustomError = new Error("Grant type not supported");
            err.status = 400;
            throw err;
        }

        const authToken = await authenticationService.authenticate(user, pass);

        return { token: authToken };
    }
}
