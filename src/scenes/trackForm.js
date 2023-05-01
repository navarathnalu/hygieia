const {Scenes} = require('telegraf');
const moment = require('moment');
const constants = require('../constants');
const {track} = require('../handlers');
const {
  messages: {details_form: formConstants},
  cycle_length,
  period_length,
} = constants;

const askForName = ctx => {
  ctx.reply(formConstants.overview);
  ctx.reply(formConstants.get_name);
  return ctx.wizard.next();
};

const askForCycleLength = ctx => {
  const name = ctx.message.text;
  if (name.length < 3 || !name.match(/^[a-zA-Z]{3,}[ a-zA-Z]*$/)) {
    ctx.reply(formConstants.name_invalid);
    return;
  }
  ctx.wizard.state.name = ctx.message.text;
  ctx.reply(formConstants.get_cycle_length);
  return ctx.wizard.next();
};

const askForPeriodLength = ctx => {
  const cycleLength = ctx.message.text;
  if (!cycleLength.match(/\d+/)) {
    ctx.reply(formConstants.cycle_length_invalid);
    return;
  }
  if (+cycleLength < cycle_length.min || +cycleLength > cycle_length.max) {
    ctx.reply(formConstants.cycle_length_out_of_bounds);
    return;
  }
  ctx.wizard.state.cycleLength = +cycleLength;
  ctx.reply(formConstants.get_period_length);
  return ctx.wizard.next();
};

const askForPeriodDate = ctx => {
  const periodLength = ctx.message.text;
  if (!periodLength.match(/\d+/)) {
    ctx.reply(formConstants.period_length_invalid);
    return;
  }
  if (+periodLength < period_length.min || +periodLength > period_length.max) {
    ctx.reply(formConstants.period_length_out_of_bounds);
    return;
  }
  ctx.wizard.state.periodLength = +periodLength;
  ctx.reply(formConstants.get_last_date);
  return ctx.wizard.next();
};

const validateLastPeriodDate = ctx => {
  const lastDate = ctx.message.text;
  const date = moment(lastDate, constants.date_format);
  const currentTime = moment(
    moment().format(constants.date_format),
    constants.date_format
  );
  const ninetyDaysBefore = moment(currentTime);
  ninetyDaysBefore.subtract(constants.ninety, constants.days);
  if (!date.isValid()) {
    ctx.reply(formConstants.last_date_invalid);
    return;
  }
  if (currentTime.isBefore(date)) {
    ctx.reply(formConstants.last_date_future);
    return;
  }
  if (ninetyDaysBefore.isAfter(date)) {
    ctx.reply(formConstants.last_date_earlier_than_90);
    return;
  }

  ctx.wizard.state.lastDate = date.toDate();
  leave(ctx);
};

const leave = async ctx => {
  await ctx.db.insertUser(ctx.chat.id, ctx.wizard.state);
  ctx.scene.leave();
  track(ctx, ctx.wizard.state);
};

const trackForm = new Scenes.WizardScene(
  'TRACKER_DETAILS',
  askForName,
  askForCycleLength,
  askForPeriodLength,
  askForPeriodDate,
  validateLastPeriodDate
);

trackForm.command('cancel', leave);

module.exports = trackForm;
