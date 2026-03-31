import { MemberType } from "@/libs/enums/member.enum";
import Errors, { HttpCode, Message } from "@/libs/Errors";
import { LoginInput, Member, MemberInput } from "@/libs/types/members";
import MemberModel from "@/schema/Member.model";
import bcrypt from "bcryptjs";

class MemberService {
    private readonly memberModel;

    constructor() {
        this.memberModel = MemberModel;
    }

    /** processSignup */
    public async processSignup(input: MemberInput): Promise<Member> {
        const exist = await this.memberModel.findOne({memberType: MemberType.SHOP}).exec();
        if(exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
        try {
            const result = await this.memberModel.create(input);
                const member = result.toObject() as Member;
                       member.memberPassword = "";
            return member;
        } catch (error) {
            console.log(error);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        } 
    }

        /** processLogin */
    public async processLogin(input: LoginInput): Promise<Member> {
        const member = await this.memberModel.findOne({memberNick: input.memberNick}, {memberNick: 1, memberPassword: 1}).exec();
        if(!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
        
        const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);
        if(!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        }
          const result = member.toObject()  as Member;
          result.memberPassword = "";
        return result
    }
}

export default MemberService;