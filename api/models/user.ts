import { Document, Model, model, Schema } from "mongoose";

export interface IUser extends Document {
	telegramId: number,
	firstName: string,
	userName: string,
	hasPremium: boolean,
	createdAt: Date,
}

const userSchema = new Schema<IUser>({
	telegramId: {
		type: Number,
		required: true,
		unique: true,
	},
	firstName: { type: String },
	userName: { type: String },
	hasPremium: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
})

export const User = model<IUser>('User', userSchema);