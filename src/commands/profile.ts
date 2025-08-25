import { CallbackQueryContext } from "grammy";
import { profileKeyboard } from "../keyboards/index.js";
import { User } from "../models/user.js";
import { MyContext } from "../types.js";

export const profileCommand = async (
	ctx: CallbackQueryContext<MyContext>
) => {
	const user = await User.findOne({
		telegramId: ctx.from?.id,
	});
	if (!user) return ctx.callbackQuery.message?.editText(
		'You need to register first. Run /start command'
	)
	const createdDate = user.createdAt.toLocaleDateString();
	const premiumMessage = user.hasPremium ? 'You have premium' : 'You do not have premium now. Run /premium command.'
	ctx.answerCallbackQuery();
	ctx.callbackQuery.message?.editText(
		`You are in profile.\nInfo:\nUsername: ${user.userName}\nRegistration date: ${createdDate}\n${premiumMessage}`,
		{
			reply_markup: profileKeyboard,
		}
	)
}