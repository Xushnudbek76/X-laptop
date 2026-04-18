import mongoose, { Schema } from "mongoose";

const orderItemsSchema = new Schema(
  {
    itemQuantity: {
      type: Number,
      required: true,
    },
    itemPrice: {
      type: Number,
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
  },
  { timestamps: true, collection: "orderItems" },
);

export default mongoose.model("OrderItem", orderItemsSchema);
