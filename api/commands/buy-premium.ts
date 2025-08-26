import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { MyContext } from "../types.js";
import { premium } from "../consts/premium.js";
import 'dotenv/config';
import { Order } from "../models/order.js";
import { User } from "../models/user.js";

export const buyPremiumCommand = async (
	ctx: CallbackQueryContext<MyContext>
) => {
	ctx.answerCallbackQuery();
	const itemId = +ctx.callbackQuery.data.split('-')[1]
	const item = premium.find((p) => p.id === itemId);

	if (!item) return ctx.callbackQuery.message?.editText('Ah...There is and error', {
		reply_markup: new InlineKeyboard().text('Back', 'premium')
	});

	try {
		const chatId = ctx.chatId;
		if (!chatId) throw new Error('chat id is not defined');

		const providerData = {
			receipt: {
				items: [
					{
						description: item.decription || 'no description',
						quantity: 1,
						amount: {
							value: `${item.price}.00`,
							currency: 'RUB'
						},
						vat_code: 1,
					}
				]
			}
		}
		ctx.api.sendInvoice(chatId, item.name, item.decription || 'no description', item.id.toString(),
			'RUB', [
			{
				label: 'RUB',
				amount: item.price * 100,
			}
		], {
			provider_token: process.env.PAYMENT_TOKEN,
			need_email: true,
			send_email_to_provider: true,
			provider_data: JSON.stringify(providerData),
		}
		)
	} catch (e) {
		console.error('Error while purchasing');
		return ctx.callbackQuery.message?.editText('Ah...There is and error', {
			reply_markup: new InlineKeyboard().text('Back', 'premium')
		});
	}
}

export const successHandler = async (ctx: MyContext) => {
	const itemId = Number(ctx.message?.successful_payment?.invoice_payload);
	const item = premium.find((p) => p.id === itemId);

	if (!item) return ctx.reply('Could not find item. Run /premium command to buy something.');
	if (!ctx.from) return ctx.reply('User info is not available');
	const user = await User.findOne({ telegramId: ctx.from.id });
	if (!user) return ctx.reply('User info is not available');

	await Order.create({ itemId, userId: user._id });


	if (!user) return ctx.reply('You need to register first. Run /start command');

	user.hasPremium = true;
	await user.save();

	console.log(`User ${ctx.from?.username} bought ${item.name} now`)

	ctx.reply(`You bought ${item.name} successfully!`, {
		reply_markup: new InlineKeyboard().text('Menu', 'menu')
	});
}