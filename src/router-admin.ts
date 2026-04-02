import express, { Router } from "express";
const routerAdmin = express.Router();
import shopController from "./controllers/shop.controller";
import makeUploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";

/** Restaurant */
routerAdmin.get("/", shopController.goHome);
routerAdmin
  .get("/login", shopController.getLogin)
  .post("/login/process", shopController.processLogin);
routerAdmin
  .get("/signup", shopController.getSignup)
  .post(
    "/signup/process",
    makeUploader("members").single("memberImage"),
    shopController.processSignup,
  );
routerAdmin.get("/logout", shopController.logout);

/** Product */
routerAdmin.get(
  "product/all",
  shopController.verifyShop,
  productController.getAllProducts,
);
routerAdmin.post(
  "product/create",
  shopController.verifyShop,
  makeUploader('products').array('productImages', 5),
  productController.createNewProduct,
);
routerAdmin.post(
  "/product/:id",
  shopController.verifyRestaurant,
  productController.updateChosenProduct,
);

export default routerAdmin;
