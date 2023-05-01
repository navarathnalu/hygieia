const {Telegraf, Scenes, session} = require('telegraf');
const {MongoClient} = require('mongodb');
const handlers = require('./src/handlers');
const Database = require('./src/db');
const trackForm = require('./src/scenes/trackForm');
const port = process.env.PORT || 2000;
const domain = process.env.HOSTNAME;

const bot = new Telegraf(process.env.BOT_TOKEN);
const db = new Database(new MongoClient(process.env.MONGO_URL));
const stage = new Scenes.Stage([trackForm]);

(async () => {
  try {
    await db.connect();
    console.log('Connected to database');
  } catch (e) {
    console.error(`Error connecting to database: ${e}`);
  }
})();

const onStop = signal => {
  db.close();
  bot.stop(signal);
};

bot.use((ctx, next) => {
  ctx.db = db;
  return next()
});
bot.use(session());
bot.use(stage.middleware());

bot.start(handlers.help);
bot.command('track', handlers.track);

bot.help(handlers.help);
bot.launch({webhook: {domain, port}});

// Enable graceful stop
process.once('SIGINT', () => onStop('SIGINT'));
process.once('SIGTERM', () => onStop('SIGTERM'));
