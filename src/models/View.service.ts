import Errors, { HttpCode, Message } from "../libs/Errors";
import { View, ViewInput } from "../libs/types/view";
import ViewModel from "../schema/View.model";

class ViewService {
  private readonly viewModel;

  constructor() {
    this.viewModel = ViewModel;
  }

  public async checkViewExistence(input: ViewInput): Promise<View | null> {
    return await this.viewModel
      .findOne({ memberId: input.memberId, viewRefId: input.viewRefId })
      .lean()
      .exec() as View | null;
  }

  public async insertMemberView(input: ViewInput): Promise<View> {
    try {
      return await this.viewModel.create(input as any) as unknown as View;
    } catch (error) {
      console.log("Error, model: insertMemberView", error);
      throw new Errors(HttpCode.OK, Message.CREATE_FAILED);
    }
  }
}

export default ViewService;
