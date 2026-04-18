import { shapeIntoMongooseObjectId } from "@/libs/config";
import { LaptopStatus } from "@/libs/enums/item.enum";
import Errors, { HttpCode, Message } from "@/libs/Errors";
import { T } from "@/libs/types/common";
import {
  ItemInquiry,
  Laptop,
  LaptopInput,
  LaptopUpdateInput,
} from "@/libs/types/item";
import ItemModel from "@/schema/Item.model";
import ViewService from "./View.service";
import { ObjectId } from "mongoose";
import { ViewGroup } from "@/libs/enums/view.enum";
import { ViewInput } from "@/libs/types/view";

class ItemService {
  private readonly itemModel;
  public viewService;
  constructor() {
    this.itemModel = ItemModel;
    this.viewService = new ViewService();
  }

  public async getItems(inquiry: ItemInquiry): Promise<Laptop[]> {
    const match: T = { laptopStatus: LaptopStatus.PROCESS };

    if (inquiry.laptopBrand) match.laptopBrand = inquiry.laptopBrand;
    if (inquiry.laptopCategory) match.laptopCategory = inquiry.laptopCategory;
    if (inquiry.search) {
      match.laptopName = { $regex: new RegExp(inquiry.search, "i") };
    }

    const sort: T =
      inquiry.order === "laptopPage"
        ? { [inquiry.order]: 1 }
        : { [inquiry.order]: -1 };

    const result = await this.itemModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit },
        { $limit: inquiry.limit * 1 },
      ])
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async getItem(memberId: ObjectId, id: string): Promise<Laptop> {
    const itemId = shapeIntoMongooseObjectId(id);

    let result = await this.itemModel
      .findOne({ _id: itemId, laptopStatus: LaptopStatus.PROCESS })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (memberId) {
      const input: ViewInput = {
        memberId: memberId,
        viewRefId: itemId,
        viewGroup: ViewGroup.LAPTOP,
      };

      const existView = await this.viewService.checkViewExistence(input);
      if (!existView) {
        console.log("planning to insert new view");
        await this.viewService.insertMemberView(input);
        result = await this.itemModel
          .findByIdAndUpdate(
            itemId,
            { $inc: { laptopViews: +1 } },
            { new: true },
          )
          .exec();
      }
    }

    return result as Laptop;
  }

  public async getAllProducts(): Promise<Laptop[]> {
    const result = await this.itemModel.find().exec();
    return result;
  }

  public async createNewItem(input: LaptopInput): Promise<Laptop> {
    try {
      return await this.itemModel.create(input);
    } catch (error) {
      console.log("Error, model:createNewItem:", error);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateChosenItem(
    id: string,
    input: LaptopUpdateInput,
  ): Promise<Laptop> {
    id = shapeIntoMongooseObjectId(id);
    const result = await this.itemModel.findOneAndUpdate({ _id: id }, input, {
      new: true,
    });
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.UPDATE_FAILED);
    return result as unknown as Laptop;
  }
}

export default ItemService;
