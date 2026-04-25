import { T } from "@/libs/types/common";
import {
  ItemInquiry,
  LaptopInput,
  LaptopUpdateInput,
} from "../libs/types/item";
import { Request, Response } from "express";
import { AdminRequest, ExtendedRequest } from "@/libs/types/members";
import Errors, { HttpCode, Message } from "@/libs/Errors";
import ItemService from "../models/Item.service";
import { LaptopBrand, LaptopCategory } from "@/libs/enums/item.enum";

const itemService = new ItemService();
const itemController: T = {};

/** SPA */
itemController.getItems = async (req: Request, res: Response) => {
  try {
    console.log("getItems");
    const {
      page,
      limit,
      order,
      laptopBrand,
      laptopCategory,
      laptopRam,
      laptopStorage,
      search,
    } = req.query;

    const inquiry: ItemInquiry = {
      order: String(order),
      page: Number(page),
      limit: Number(limit),
      search: "",
    };

    if (laptopBrand) inquiry.laptopBrand = laptopBrand as LaptopBrand;
    if (laptopCategory)
      inquiry.laptopCategory = laptopCategory as LaptopCategory;

    // Add these two
    if (laptopRam !== undefined) inquiry.laptopRam = Number(laptopRam);
    if (laptopStorage !== undefined)
      inquiry.laptopStorage = Number(laptopStorage);

    if (search) inquiry.search = String(search);

    const result = await itemService.getItems(inquiry);
    res.status(HttpCode.OK).json(result);
  } catch (error) {
    console.log("Error, getItems:", error);
    if (error instanceof Errors) res.status(error.code).json(error);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

itemController.getItem = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getItem");
    const { id } = req.params;
    const memberId = req.member?._id ?? null,
      result = await itemService.getItem(memberId, id);

    res.status(HttpCode.OK).json(result);
  } catch (error) {
    console.log("Error, getItem:", error);
    if (error instanceof Errors) res.status(error.code).json(error);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
/** SSR  */

itemController.getAllItems = async (req: AdminRequest, res: Response) => {
  try {
    console.log("getAllProducts");
    const data = await itemService.getAllProducts();
    res.render("products", { laptops: data });
  } catch (error) {
    console.log("Error, getAllProducts:", error);
    if (error instanceof Errors) res.status(error.code).json(error);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

itemController.createNewItem = async (req: AdminRequest, res: Response) => {
  try {
    console.log("createNewProduct");
    if (!req.files?.length)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

    const data: LaptopInput = req.body;
    data.laptopImages = req.files.map((ele) => {
      return ele.path.replace(/\\/g, "/");
    });
    await itemService.createNewItem(data);
    res.send(
      `<script> alert("Successfully Added"); window.location.replace('/admin/item/all');</script>`,
    );
  } catch (error) {
    console.log("Error, createNewProduct:", error);
    const message =
      error instanceof Errors ? error.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert('${message}') window.location.replace('/admin/item/all');</script>`,
    );
  }
};

itemController.updateChosenItem = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenProduct");
    const { _id, laptopStatus } = req.body;
    const input: LaptopUpdateInput = { laptopStatus };
    const result = await itemService.updateChosenItem(_id, input);
    res.json({ data: result });
  } catch (error) {
    console.log("Error, updateChosenProduct:", error);
    if (error instanceof Errors) res.status(error.code).json(error);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
export default itemController;
