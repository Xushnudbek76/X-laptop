import { shapeIntoMongooseObjectId } from "@/libs/config";
import Errors, { HttpCode, Message } from "@/libs/Errors";
import { Laptop, LaptopInput, LaptopUpdateInput } from "@/libs/types/item";
import ItemModel from "@/schema/Item.model";

class ItemService {
  private readonly itemModel;

  constructor() {
    this.itemModel = ItemModel;
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
