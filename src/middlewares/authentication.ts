import * as express from "express";
import * as jwt from "jsonwebtoken";

export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    if (securityName !== "jwt") {
        throw new Error("Only support JWT authentication");
    }

    const authHeader = request.headers["authorization"];
    if (!authHeader) {
        return Promise.reject(new Error("No token provided"));
    }

    const token = authHeader.split(" ")[1];

    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded: any) => {
            if (err) return reject(new Error("Invalid token"));

            console.log(scopes)
            if (scopes && scopes.length > 0) {
                const userRights: string[] = decoded.rights || [];

                console.log("User rights:", userRights);
                console.log("Required scopes:", scopes);

                const hasAllScopes = scopes.every(scope => userRights.includes(scope));
                if (!hasAllScopes) {
                    return reject(new Error("Insufficient permissions"));
                }
            }

            
            resolve(decoded);
        });
    });
}
