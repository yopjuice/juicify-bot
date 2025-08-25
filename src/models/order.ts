import { Document, model, Schema, Types } from "mongoose";

export interface IOrder extends Document {
	userId: Types.ObjectId,
	itemId: number,
	createdAt: Date,
}

const orderSchema = new Schema<IOrder>({
	itemId: {type: Number, required: true},
	userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	createdAt: {
		type: Date,
		default: Date.now
	}
})

export const Order = model<IOrder>('Order', orderSchema);