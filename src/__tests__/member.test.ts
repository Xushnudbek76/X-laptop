import MemberService from "../models/Member.service";
import MemberModel from "../schema/Member.model";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import Errors from "../libs/Errors";
import bcrypt from "bcryptjs";
beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

jest.mock("../schema/Member.model");
jest.mock("bcryptjs");

const mockMember = {
  _id: "64f1a2b3c4d5e6f7a8b9c0d1",
  memberNick: "Xushnudbek",
  memberPhone: "1234567890",
  memberPassword: "hashed_password",
  memberType: MemberType.USER,
  memberStatus: MemberStatus.ACTIVE,
  memberPoints: 5,
  memberAddress: "",
  toJSON: jest.fn().mockReturnThis(),
  toObject: jest.fn().mockReturnThis(),
};

describe("MemberService", () => {
  let memberService: MemberService;

  beforeEach(() => {
    memberService = new MemberService();
    jest.clearAllMocks();
  });

  // ── signup ────────────────────────────────────────
  describe("signup", () => {
    it("should create a new member and clear password", async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
      (MemberModel.create as jest.Mock).mockResolvedValue(mockMember);

      const result = await memberService.signup({
        memberNick: "Xushnudbek",
        memberPhone: "1234567890",
        memberPassword: "password123",
        memberType: MemberType.USER,
        memberAddress: "",
      });

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result.memberPassword).toBe("");
    });

    it("should throw error when nick/phone already used", async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
      (MemberModel.create as jest.Mock).mockRejectedValue(new Error("duplicate"));

      await expect(
        memberService.signup({
          memberNick: "Xushnudbek",
          memberPhone: "1234567890",
          memberPassword: "password123",
          memberType: MemberType.USER,
          memberAddress: "",
        })
      ).rejects.toThrow(Errors);
    });
  });

  // ── login ─────────────────────────────────────────
  describe("login", () => {
    it("should throw error when member not found", async () => {
      (MemberModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        memberService.login({
            memberNick: "unknown",
            memberPassword: "password",
            memberType: MemberType.USER,
            memberAddress: "",
            memberPhone: "",
        })
      ).rejects.toThrow(Errors);
    });

    it("should throw error when password is wrong", async () => {
      (MemberModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMember),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        memberService.login({
            memberNick: "Xushnudbek",
            memberPassword: "wrongpassword",
            memberType: MemberType.USER,
            memberPhone: "",
            memberAddress: "",
        })
      ).rejects.toThrow(Errors);
    });

    it("should throw error when member is blocked", async () => {
      (MemberModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockMember,
          memberStatus: MemberStatus.BLOCK,
        }),
      });

      await expect(
        memberService.login({
            memberNick: "Xushnudbek",
            memberPassword: "password123",
            memberType: MemberType.USER,
            memberPhone: "",
            memberAddress: "",
        })
      ).rejects.toThrow(Errors);
    });
  });

  // ── getTopUsers ───────────────────────────────────
  describe("getTopUsers", () => {
    it("should return top users sorted by points", async () => {
      const topUsers = [
        { ...mockMember, memberPoints: 10 },
        { ...mockMember, memberPoints: 5 },
      ];

      (MemberModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(topUsers),
          }),
        }),
      });

      const result = await memberService.getTopUsers();
      expect(result).toHaveLength(2);
      expect(result[0].memberPoints).toBe(10);
    });
  });
});