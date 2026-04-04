import { T } from "@/libs/types/common";
import { LaptopInput } from "../libs/types/item";
import { Request, Response } from "express";
import { AdminRequest } from "@/libs/types/members";
import Errors, { HttpCode, Message } from "@/libs/Errors";
import ItemService from "../models/Item.service";

const itemService = new ItemService();
const itemController: T = {};

/** SPA */

/** SSR  */

itemController.getAllItems = async (req: AdminRequest, res: Response) => {
  try {
    console.log("getAllProducts");
    const data = await itemService.getAllProducts();
    res.render("product", {items: data});
  } catch (error) {
    console.log("Error, getAllProducts:", error);
    if (error instanceof Errors) res.status(error.code).json(error);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

itemController.createNewItem = async (req: AdminRequest, res: Response) => {
  try {
    console.log("createNewProduct");
    if (!req.files.length)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

    const data: LaptopInput = req.body;
    data.laptopImages = req.files.map((ele) => {
      return ele.path.replace(/\\/g, "/");
    });
    await itemService.createNewItem(data);
    res.send(
      `<script> alert("Successfully Added") window.location.replace('admin/product/all') </script>`,
    );
  } catch (error) {
    console.log("Error, createNewProduct:", error);
    const message =
      error instanceof Errors ? error.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert('${message}') window.location.replace('admin/product/all') </script>`,
    );
  }
};

itemController.updateChosenItem = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenProduct");
    const id = req.params.id as string;

    const result = await itemService.updateChosenItem(id, req.body);
  } catch (error) {
    console.log("Error, updateChosenProduct:", error);
    if (error instanceof Errors) res.status(error.code).json(error);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
export default itemController;
