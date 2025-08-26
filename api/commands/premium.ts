import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { premiumKeyboard } from "../keyboards/index.js";
import { MyContext } from "../types.js";
import { premium } from "../consts/premium.js";

export const premiumCommand = (
	ctx: CallbackQueryContext<MyContext>
) => {
	ctx.answerCallbackQuery();
	const buttons = premium.map(p => {
		return InlineKeyboard.text(p.name, `buyprem-${p.id}`)
	})
	const premList = premium.reduce((acc: string, p) => {
		return acc + `---${p.name}---\nPrice: ${p.price}\nDescription: ${p.decription}\n\n`
	}, '')
	ctx.callbackQuery.message?.editText(
		`All premium variants:\n\n${premList}`,
		{
			reply_markup: InlineKeyboard.from([
				buttons,
				[InlineKeyboard.text('Back', 'menu')]
			]),
		}
	)
}