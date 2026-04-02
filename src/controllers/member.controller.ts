import {Request, Response} from 'express';
import  MemberService  from "../models/Member.service";
import { T } from "../libs/types/common";
import { Member, MemberInput } from '@/libs/types/members';
import Errors from '@/libs/Errors';

//React
    const memberService = new MemberService();
    const memberController: T = {};

    memberController.signup = async (req: Request, res: Response) => {
        try {
            console.log("processSignup");
            const input: MemberInput = req.body,
             result: Member = await memberService.signup(input);

             res.json({member: result});
        } catch (error) {
           console.log('Error, Signup:', error);
           if(error instanceof Errors) res.status(error.code).json(error);
           else res.status(Errors.standard.code).json(Errors.standard);
        }
    };
    
    memberController.login = async (req: Request, res: Response) => {
        try {
            console.log("processLogin");
            const input: MemberInput = req.body,
             result: Member = await memberService.login(input);
             
             res.json({member: result});
        } catch (error) {
            console.log('Error, Login', error);
            if(error instanceof Errors) res.status(error.code).json(error);
            else res.status(Errors.standard.code).json(Errors.standard);
        }
    }

export default memberController;