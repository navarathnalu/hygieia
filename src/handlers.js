const moment = require('moment')
const constants = require('./constants');

const help = ctx => {
  const features = [
    'Hygiea can show estimated next period date',
    'notify you about your period',
    'show statistics about your periods\\.',
  ];
  const featuresMsg = features.join(', ');
  const start =
    'Without any late, start tracking your periods with Hygieia by sending _/track_ command\\.';
  const message = `Welcome to Hygieia, a bot to track your periods\\.\n\n${featuresMsg}\n\n${start}`;
  ctx.replyWithMarkdownV2(message);
};

const track = async (ctx, details) => {
  const user = details || await ctx.db.getUser(ctx.chat.id);
  if (!user) {
    return ctx.scene.enter('TRACKER_DETAILS');
  }
  const lastDate = moment(user.lastDate);
  const nextDate = moment(user.lastDate);
  nextDate.add(user.cycleLength, constants.days);
  ctx.replyWithMarkdownV2(
    `*Cycle Details*\n\nNext period on: ${nextDate.format(
      constants.date_format
    )}\nLast period date: ${lastDate.format(
      constants.date_format
    )}\nCycle length: ${user.cycleLength}`
  );
};

module.exports = {help, track};
