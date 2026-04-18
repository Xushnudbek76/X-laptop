import {
  LaptopStatus,
  LaptopBrand,
  LaptopCategory,
  LaptopCondition,
  LaptopRam,
  LaptopStorage,
} from "../enums/item.enum";

export interface Laptop {
  laptopStatus: LaptopStatus;
  laptopBrand: LaptopBrand;
  laptopCategory: LaptopCategory;
  laptopCondition: LaptopCondition;
  laptopName: string;
  laptopPrice: number;
  laptopLeftCount: number;
  laptopRam: LaptopRam;
  laptopStorage: LaptopStorage;
  laptopCpu: string;
  laptopGpu?: string | null;
  laptopDisplaySize: number;
  laptopDesc?: string | null;
  laptopImages: string[];
  laptopViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemInquiry {
  order: string;
  page: number;
  limit: number;
  laptopCategory?: LaptopCategory;
  laptopBrand?: LaptopBrand;
  search: string;
}
export interface LaptopInput {
  laptopStatus?: LaptopStatus;
  laptopBrand: LaptopBrand;
  laptopCategory: LaptopCategory;
  laptopCondition: LaptopCondition;
  laptopName: string;
  laptopPrice: number;
  laptopLeftCount: number;
  laptopRam: LaptopRam;
  laptopStorage: LaptopStorage;
  laptopCpu: string;
  laptopGpu?: string;
  laptopDisplaySize: number;
  laptopDesc?: string;
  laptopImages?: string[];
  laptopViews?: number;
}

export interface LaptopUpdateInput {
  laptopStatus?: LaptopStatus;
}
