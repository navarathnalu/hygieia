const moment = require('moment');
const constants = require('./constants');
const {
  messages: {track: trackMessages},
} = constants;

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

const getToday = () => {
  return moment(moment().format(constants.date_format), constants.date_format);
};

const sendTracker = (ctx, lastDate, nextDate, cycleLength, message) => {
  ctx.replyWithMarkdownV2(
    `*Cycle Details*\n\nNext period on: ${nextDate.format(
      constants.date_format
    )}\nLast period date: ${lastDate.format(
      constants.date_format
    )}\nCycle length: ${cycleLength}\n\n${message}`
  );
};

const replyWithStatus = (ctx, user) => {
  const today = getToday();
  const lastDate = moment(user.dates[user.dates.length - 1]);
  const nextDate = moment(user.nextDate);
  if (nextDate.isSame(today)) {
    return sendTracker(
      ctx,
      lastDate,
      nextDate,
      user.cycleLength,
      trackMessages.period_today
    );
  }
  const exceedsCycleBy2days = moment(today).subtract(
    user.cycleLength + 1,
    constants.days
  );
  const exceeds35days = moment(today).subtract(35, constants.days);
  if (
    exceedsCycleBy2days.isSame(lastDate) ||
    lastDate.isBetween(exceeds35days, exceedsCycleBy2days) ||
    exceeds35days.isSame(lastDate)
  ) {
    return sendTracker(
      ctx,
      lastDate,
      nextDate,
      user.cycleLength,
      trackMessages.period_exceeds_by_2_days
    );
  }

  const exceeds36Days = moment(today).subtract(36, constants.days);
  const exceeds90Days = moment(today).subtract(90, constants.days);
  if (
    exceeds36Days.isSame(lastDate) ||
    lastDate.isBetween(exceeds90Days, exceeds36Days) ||
    exceeds90Days.isSame(lastDate)
  ) {
    return sendTracker(
      ctx,
      lastDate,
      nextDate,
      user.cycleLength,
      trackMessages.period_exceeds_by_35_days
    );
  }
  return sendTracker(ctx, lastDate, nextDate, user.cycleLength, '');
};

const track = async ctx => {
  const user = await ctx.db.getUser(ctx.chat.id);
  if (!user) {
    return ctx.scene.enter('TRACKER_DETAILS');
  }
  replyWithStatus(ctx, user);
};

module.exports = { help, track, replyWithStatus };
