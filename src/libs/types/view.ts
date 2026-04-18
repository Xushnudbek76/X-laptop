import { ObjectId, Types } from "mongoose";
import { ViewGroup } from "../enums/view.enum";

export interface View {
  _id: ObjectId;
  memberId: ObjectId;
  viewRefId: ObjectId;
  viewGroup: ViewGroup;
  createdAt: Date;
  updatedAt: Date;
}

export interface ViewInput {
  memberId: ObjectId;
  viewRefId: ObjectId;
  viewGroup: ViewGroup;
}
