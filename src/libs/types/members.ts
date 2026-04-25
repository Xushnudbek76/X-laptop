import { ObjectId, Types } from "mongoose";
import { MemberStatus, MemberType } from "../enums/member.enum";
import { Session } from "express-session";
import { Request } from "express";

export interface Member {
  _id: Types.ObjectId;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberAddress: string;
  memberPassword: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberInput {
  memberType: MemberType;
  memberNick: string;
  memberPhone: string;
  memberAddress: string;
  memberPassword: string;
  memberDesc?: string;
  memberImage?: string;
}

export interface LoginInput {
  memberNick: string;
  memberPassword: string;
}

export interface MemberUpdateInput {
  memberNick?: string;
  memberPassword?: string;
  memberPhone?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
}

export interface ExtendedRequest extends Request {
  member: Member;
  file: Express.Multer.File;
  files: Express.Multer.File[];
}

export interface AdminRequest extends Request {
  member: Member;
  session: Session & { member: Member };
  file: Express.Multer.File;
  files: Express.Multer.File[];
}
