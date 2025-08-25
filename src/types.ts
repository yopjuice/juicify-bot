import { HydrateFlavor } from "@grammyjs/hydrate";
import { Context } from "grammy";

interface BotConfig {
	isAdmin: boolean;
}

export type MyContext = HydrateFlavor<Context> & {
	config: BotConfig;
};