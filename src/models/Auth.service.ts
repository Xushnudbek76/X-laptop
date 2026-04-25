import { AUTH_TIMER } from "@/libs/config";
import Errors, { HttpCode, Message } from "@/libs/Errors";
import { Member } from "@/libs/types/members";
import jwt from "jsonwebtoken";

class AuthService {
  private getSecretToken(): string {
    const secret = process.env.SECRET_TOKEN || process.env.JWT_SECRET;
   
    return secret;
  }

  public async createToken(payload: Member) {
    return new Promise((resolve, reject) => {
      const duration = `${AUTH_TIMER}h`;
      jwt.sign(
        payload,
        this.getSecretToken(),
        { expiresIn: duration },
        (err, token) => {
          if (err)
            reject(
              new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED),
            );
          else resolve(token as string);
        },
      );
    });
  }

  public async checkAuth(token: string): Promise<Member> {
    const result: Member = jwt.verify(
        token,
        this.getSecretToken()
    ) as Member;
    return result;
  }
}
export default AuthService