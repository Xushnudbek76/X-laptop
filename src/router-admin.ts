import express, { Router } from "express";
const routerAdmin = express.Router();
import shopController from "./controllers/shop.controller";
import makeUploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";

/** Restaurant */
routerAdmin.get("/", shopController.goHome);
routerAdmin
  .get("/login", shopController.getLogin)
  .post("/login", shopController.processLogin);
routerAdmin
  .get("/signup", shopController.getSignup)
  .post(
    "/signup",
    makeUploader("members").single("memberImage"),
    shopController.processSignup,
  );
routerAdmin.get("/logout", shopController.logout);

/** Product */
routerAdmin.get(
  "/item/all",
  shopController.verifyShop,
  productController.getAllItems,
);
routerAdmin.post(
  "/item/create",
  shopController.verifyShop,
  makeUploader("products").array("laptopImages", 5),
  productController.createNewItem,
);
routerAdmin.post(
  "/item/update",
  shopController.verifyShop,
  productController.updateChosenItem,
);

/** User*/

routerAdmin.get(
  "/user/all",
  shopController.verifyShop,
  shopController.getUsers,
);
routerAdmin.post(
  "/user/update",
  shopController.verifyShop,
  shopController.updateChosenUser,
);
export default routerAdmin;
