import { CustomError } from "../middlewares/errorHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export class AuthenticationService {
    public async authenticate(username: string, password: string): Promise<string> {
        const user = await User.findOne({ where: { username, password } });

        if (!user) {
            const error: CustomError = new Error("Invalid username or password");
            error.status = 401;
            throw error;
        }

        
        let rights: string[] = [];
        switch (username) {
            case "admin":
                rights = ["admin", "read", "write", "update", "delete"];
                break;
            case "gerant":
                rights = ["read", "write", "update", "delete:BookCopy"];
                break;
            case "user":
                rights = ["read", "write:Book"];
                break;
            default:
                rights = []; 
        }

        return jwt.sign(
            { username, rights },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );
    }
}

export const authenticationService = new AuthenticationService();
