import dotenv from 'dotenv';
import { Bot, GrammyError, HttpError, webhookCallback} from 'grammy';
import mongoose from 'mongoose';
import { MyContext } from './types.js';
import { hydrate } from '@grammyjs/hydrate';
import { premiumCommand, profileCommand, startCommand, successHandler } from './commands/index.js';
import { menuKeyboard, premiumKeyboard} from './keyboards/index.js';
import { commands } from './consts/commands.js';
import { buyPremiumCommand } from './commands/index.js';
import { User } from './models/user.js';



dotenv.config();

const bot = new Bot<MyContext>(process.env.API_TOKEN!);

bot.on('pre_checkout_query', async (ctx) => {
	const user = await User.findOne({telegramId: ctx.from.id});
	const isOk = !(!user || user.hasPremium);
	ctx.answerPreCheckoutQuery(isOk, {error_message: 'You cannot buy this item'});
})

bot.api.setMyCommands(commands)

bot.use(hydrate());
bot.use(async (ctx, next) => {
	ctx.config = {
		isAdmin: ctx.from?.id === process.env.ADMIN_ID,
	};
	await next();
})

bot.command('start', startCommand);

bot.callbackQuery('menu', (ctx) => {
	ctx.answerCallbackQuery();
	ctx.callbackQuery.message?.editText(
		'You are in main menu. Click buttons below:',
		{
			reply_markup: menuKeyboard,
		}
	)
});

bot.callbackQuery('profile', profileCommand);

bot.callbackQuery('premium', premiumCommand);

bot.callbackQuery(/^buyprem-\d+$/, buyPremiumCommand);

bot.on(':successful_payment', successHandler);

bot.command('id', async (ctx) => {
	await ctx.reply(`Your id: ${ctx.from?.id || 'unknown'}`)
})

bot.command('restart', async (ctx) => {
	await ctx.reply('Restarting...');
	await startCommand(ctx);
})

bot.on('message', async (ctx) => {
	const response = ctx.message.text ? `Unknown command "${ctx.message.text}"` : 'Action is unknown';
	await ctx.reply(response)
});

bot.catch(async (err) => {
	const ctx = err.ctx;
	console.error(`Error here: ${ctx.update.update_id}`);
	const e = err.error;

	if (e instanceof GrammyError) {
		console.error('Error in request', e.description);
	} else if (e instanceof HttpError) {
		console.error('Could not connect to Telegram', e);
	} else {
		console.error('Unknown error', e);
	}
	await ctx.reply('Unhandled error occured! Try /support for more.')
})

async function start() {
	try {
		await mongoose.connect(process.env.MONGO_URL!)
		// bot.start()
		console.log('Mongo connected');
	} catch (e) {
		console.error('Error starting bot', e)
	}
}
start()

import express from 'express';

const app = express() // or whatever you're using

app.use(webhookCallback(bot, 'express'))

app.listen(3000, async () => {
	console.log('Listening on port 3000');
	await start();
})



"node --loader ts-node/esm --no-warnings src/index.ts"
