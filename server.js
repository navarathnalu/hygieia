const {Telegraf} = require('telegraf');
const port = process.env.PORT || 2000;
const domain = process.env.HOSTNAME;

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(ctx => ctx.reply('Welcome'));
bot.help(ctx => ctx.reply('Test'));
bot.hears('hi', ctx => ctx.reply('Hey there'));
bot.launch({webhook: {domain, port}});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
