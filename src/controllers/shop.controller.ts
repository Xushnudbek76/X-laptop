import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "@/libs/types/members";
import { MemberType } from "@/libs/enums/member.enum";
import Errors, { HttpCode, Message } from "@/libs/Errors";
import { alertAndRedirect, alertOnly } from "@/libs/utils/ssr";
const shopController: T = {};
const memberService = new MemberService();
shopController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.render("home");
  } catch (error) {
    console.log("Error, goHome:", error);
    res.redirect("/admin");
  }
};

shopController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.render("login");
  } catch (error) {
    console.log("Error, getLogin:", error);
    res.redirect("/admin");
  }
};

shopController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("getSignup");
    res.render("signup");
  } catch (error) {
    console.log("Error, getSignup:", error);
    res.redirect("/admin");
  }
};

shopController.processSignup = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processSignup");
    const file = req.file;

    if (!file)
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

    const newMember: MemberInput = req.body;
    newMember.memberImage = file?.path.replace(/\\/g, "/");
    newMember.memberType = MemberType.SHOP;

    const result = await memberService.processSignup(newMember);

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/item/all");
    });
  } catch (error) {
    console.log("Error, processSignup:", error);
    const message =
      error instanceof Errors ? error.message : Message.SOMETHING_WENT_WRONG;
    alertAndRedirect(res, message, "/admin/signup");
  }
};

shopController.processLogin = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processLogin");
    const input: LoginInput = req.body,
      result = await memberService.processLogin(input);

    req.session.member = result;
    req.session.save(function () {
      console.log("saved session:", req.session.member);
      res.redirect("/admin/item/all");
    });
  } catch (error) {
    console.log("Error, processLogin:", error);
    const message =
      error instanceof Errors ? error.message : Message.SOMETHING_WENT_WRONG;
    alertAndRedirect(res, message, "/admin/login");
  }
};

shopController.logout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("logout");
    req.session.destroy(function () {
      res.redirect("/admin");
    });
  } catch (error) {
    console.log("Error, logout:", error);
    res.redirect("/admin");
  }
};

shopController.getUsers = async (req: Request, res: Response) => {
  try {
    console.log("getUsers");
    const result = await memberService.getUsers();

    res.render("users", { users: result });
  } catch (error) {
    console.log("Error, getUsers:", error);
    res.redirect("/admin/login");
  }
};

shopController.updateChosenUser = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenUser");
    const result = await memberService.updateChosenUser(req.body);
    res.status(HttpCode.OK).json({ data: result });
  } catch (error) {
    console.log("Error, updateChosenUser:", error);
    if (error instanceof Errors) res.status(error.code).json(error);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

shopController.checkAuthSession = async (req: AdminRequest, res: Response) => {
  try {
    console.log("checkAuthSession");

    if (req.session?.member)
      alertOnly(res, `Hi, ${req.session.member.memberNick}`);
    else alertOnly(res, Message.NOT_AUTHENTICATED);
  } catch (error) {
    console.log("Error, checkAuthSession:", error);
    alertOnly(res, Message.SOMETHING_WENT_WRONG);
  }
};

shopController.verifyShop = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.session?.member?.memberType === MemberType.SHOP) {
    req.member = req.session.member;
    next();
  } else {
    const message = Message.NOT_AUTHENTICATED;
    alertAndRedirect(res, message, "/admin/login");
  }
};
export default shopController;
