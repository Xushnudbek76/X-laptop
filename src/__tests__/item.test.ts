import ItemService from "../models/Item.service";
import ItemModel from "../schema/Item.model";
import { LaptopStatus } from "../libs/enums/item.enum";
import Errors from "../libs/Errors";
beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});
// Mock the entire Item model
jest.mock("../schema/Item.model");
jest.mock("../models/View.service");

const mockLaptop = {
  _id: "64f1a2b3c4d5e6f7a8b9c0d1",
  laptopName: "MacBook Pro",
  laptopBrand: "APPLE",
  laptopCategory: "BUSINESS",
  laptopPrice: 2000,
  laptopRam: 16,
  laptopStorage: 512,
  laptopStatus: LaptopStatus.PROCESS,
  laptopCpu: "M3",
  laptopDisplaySize: 14,
  laptopViews: 0,
  laptopImages: [],
};

describe("ItemService", () => {
  let itemService: ItemService;

  beforeEach(() => {
    itemService = new ItemService();
    jest.clearAllMocks();
  });

  // ── getItems ──────────────────────────────────────
  describe("getItems", () => {
    it("should return list of laptops", async () => {
      (ItemModel.aggregate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockLaptop]),
      });

      const result = await itemService.getItems({
        order: "createdAt",
        page: 1,
        limit: 10,
        search: "",
      });

      expect(result).toHaveLength(1);
      expect(result[0].laptopName).toBe("MacBook Pro");
    });

    it("should return empty array when no laptops found", async () => {
      (ItemModel.aggregate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await itemService.getItems({
        order: "createdAt",
        page: 1,
        limit: 10,
        search: "",
      });

      expect(result).toHaveLength(0);
    });

    it("should filter by laptopBrand", async () => {
      (ItemModel.aggregate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockLaptop]),
      });

      const result = await itemService.getItems({
        order: "createdAt",
        page: 1,
        limit: 10,
        search: "",
        laptopBrand: "APPLE" as any,
      });

      expect(ItemModel.aggregate).toHaveBeenCalled();
      expect(result[0].laptopBrand).toBe("APPLE");
    });

    it("should filter by RAM and storage", async () => {
      (ItemModel.aggregate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockLaptop]),
      });

      const result = await itemService.getItems({
        order: "createdAt",
        page: 1,
        limit: 10,
        search: "",
        laptopRam: 16,
        laptopStorage: 512,
      });

      expect(result[0].laptopRam).toBe(16);
      expect(result[0].laptopStorage).toBe(512);
    });
  });

  // ── createNewItem ─────────────────────────────────
  describe("createNewItem", () => {
    it("should create and return a new laptop", async () => {
      (ItemModel.create as jest.Mock).mockResolvedValue(mockLaptop);

      const input = {
        laptopName: "MacBook Pro",
        laptopBrand: "APPLE" as any,
        laptopCategory: "BUSINESS" as any,
        laptopPrice: 2000,
        laptopRam: 16 as any,
        laptopStorage: 512 as any,
        laptopCondition: "NEW" as any,
        laptopCpu: "M3",
        laptopDisplaySize: 14,
        laptopLeftCount: 5,
        laptopDesc: "Great laptop",
        laptopImages: [],
      };

      const result = await itemService.createNewItem(input);
      expect(result.laptopName).toBe("MacBook Pro");
      expect(result.laptopPrice).toBe(2000);
    });

    it("should throw error when create fails", async () => {
      (ItemModel.create as jest.Mock).mockRejectedValue(new Error("DB error"));

      await expect(
        itemService.createNewItem({} as any)
      ).rejects.toThrow(Errors);
    });
  });

  // ── getAllProducts ─────────────────────────────────
  describe("getAllProducts", () => {
    it("should return all laptops", async () => {
      (ItemModel.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockLaptop, mockLaptop]),
      });

      const result = await itemService.getAllProducts();
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no products", async () => {
      (ItemModel.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await itemService.getAllProducts();
      expect(result).toHaveLength(0);
    });
  });
});