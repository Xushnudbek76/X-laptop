import { T } from "@/libs/types/common";
import { Request, Response } from "express";
import { AdminRequest } from "@/libs/types/members";
import Errors from "@/libs/Errors";

const productController: T = {};

productController.getAllProducts = async (req: AdminRequest, res: Response) => {
  try {
    console.log("getAllProducts");
    res.render("product");
  } catch (error) {
    console.log("Error, getAllProducts:", error);
    if (error instanceof Errors) res.status(error.code).json(error);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.createNewProduct = async (req: Request, res: Response) => {
  try {
    console.log("createNewProduct");
    res.send("done");
  } catch (error) {
    console.log("Error, createNewProduct:", error);
    if (error instanceof Errors) res.status(error.code).json(error);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenProduct");
  } catch (error) {
    console.log("Error, updateChosenProduct:", error);
    if (error instanceof Errors) res.status(error.code).json(error);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
export default productController;
