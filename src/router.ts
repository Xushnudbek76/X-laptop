import express = require("express");
const router = express.Router();
import memberController from "./controllers/member.controller";
import uploader from "./libs/utils/uploader";
import itemController from "./controllers/item.controller";
import orderController from "./controllers/order.controller";

// Member
router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);
router.post(
  "/member/logout",
  memberController.verifyAuth,
  memberController.logout,
);
router.get(
  "/member/detail",
  memberController.verifyAuth,
  memberController.getMemberDetail,
);

router.post(
  "/member/update",
  memberController.verifyAuth,
  uploader("members").single("memberImage"),
  memberController.updateMember,
);

router.get("/member/top-users", memberController.getTopUsers);
router.get("/member/", memberController.verifyAuth);

// Items
router.get("/item/all", itemController.getItems);
router.get("/item/:id", memberController.retrieveAuth, itemController.getItem);

// Order

router.post(
  "/order/create",
  memberController.verifyAuth,
  orderController.createOrder,
);
router.get(
  "/order/all",
  memberController.verifyAuth,
  orderController.getMyOrders,
);
router.post(
  "/order/update",
  memberController.verifyAuth,
  orderController.updateOrder,
);
export default router;
