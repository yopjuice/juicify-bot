import { InlineKeyboard } from "grammy";

export const menuKeyboard = new InlineKeyboard()
	.text('Buy Premium', 'premium')
	.text('Profile', 'profile')

export const profileKeyboard = new InlineKeyboard()
	.text('Back', 'menu')

export const premiumKeyboard = new InlineKeyboard()
	.text('Back', 'menu')