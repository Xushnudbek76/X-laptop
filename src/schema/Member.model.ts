import { Schema, model, Document } from "mongoose";
import { MemberType, MemberStatus } from "../libs/enums/member.enum";

export interface IAddress {
  label: string;
  street: string;
  city: string;
  isDefault: boolean;
}

export interface IMember extends Document {
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberImage?: string;
  memberPoints: number;
  memberDescription?: string;
  address: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    label: { type: String },
    street: { type: String },
    city: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const memberSchema = new Schema<IMember>(
  {
    memberType: {
      type: String,
      enum: Object.values(MemberType),
      required: true,
    },
    memberStatus: {
      type: String,
      enum: Object.values(MemberStatus),
      required: true,
      default: MemberStatus.ACTIVE,
    },
    memberNick: { type: String, required: true, unique: true },
    memberPhone: { type: String, required: true, unique: true },
    memberPassword: { type: String, required: true },
    memberImage: { type: String },
    memberPoints: { type: Number, required: true, default: 0 },
    memberDescription: { type: String },
    address: { type: [addressSchema], default: [] },
  },
  { timestamps: true }
);

export default model<IMember>("Member", memberSchema);