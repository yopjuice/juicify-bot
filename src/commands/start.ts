import { InlineKeyboard } from "grammy";
import { MyContext } from "../types.js";
import { User } from "../models/user.js";

export const startCommand = async (ctx: MyContext) => {
	//await ctx.reply('Hello! I am a JuicifyBot!');
	if (!ctx.from) {
		return await ctx.reply('User info is not available')
	}
	const { id, first_name, username } = ctx.from;

	try {
		const keyBoard = new InlineKeyboard().text('Menu', 'menu');
		const exUser = await User.findOne({ telegramId: id });
		if (exUser) {
			return await ctx.reply('You are in system', {
				reply_markup: keyBoard,
			})
		}

		const newUser = new User({
			telegramId: id,
			firstName: first_name,
			userName: username,
		})

		await newUser.save();
		return await ctx.reply('You are registered!', {
				reply_markup: keyBoard,
			})
	} catch (e) {
		await ctx.reply('Auth failed...');
		console.error('Auth failed', e)
	}
}