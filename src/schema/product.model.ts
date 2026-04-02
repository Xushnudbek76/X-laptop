import mongoose, { Schema } from "mongoose";
import {
  LaptopBrand,
  LaptopCategory,
  LaptopStatus,
  LaptopRam,
  LaptopStorage,
  LaptopCondition,
} from "../libs/enums/product.enum";

const laptopSchema = new Schema(
  {
    laptopStatus: {
      type: String,
      enum: LaptopStatus,
      default: LaptopStatus.PAUSE,
    },

    laptopBrand: {
      type: String,
      enum: LaptopBrand,
      required: true,
    },

    laptopCategory: {
      type: String,
      enum: LaptopCategory,
      required: true,
    },

    laptopName: {
      type: String,
      required: true,
    },

    laptopPrice: {
      type: Number,
      required: true,
    },

    laptopLeftCount: {
      type: Number,
      required: true,
    },

    laptopRam: {
      type: Number,
      enum: LaptopRam,
      default: LaptopRam.EIGHT,
    },

    laptopStorage: {
      type: Number,
      enum: LaptopStorage,
      default: LaptopStorage.TWO_FIFTY_SIX,
    },

    laptopCondition: {
      type: String,
      enum: LaptopCondition,
      default: LaptopCondition.NEW,
    },

    laptopDesc: {
      type: String,
      required: true,
    },

    laptopImages: {
      type: [String],
      default: [],
    },

    laptopViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }, // createdAt, updatedAt
);

laptopSchema.index(
  { laptopName: 1, laptopBrand: 1, laptopRam: 1, laptopStorage: 1 },
  { unique: true },
);

export default mongoose.model("Laptop", laptopSchema);
