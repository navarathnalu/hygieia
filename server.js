const { Telegraf, Scenes, session } = require('telegraf');
const { MongoClient } = require('mongodb');
const handlers = require('./src/handlers');
const Database = require('./src/db');
const trackForm = require('./src/scenes/trackForm');
const environmentConfig = require('./environmentConfig');

const port = environmentConfig.getPort();
const domain = environmentConfig.getHost();

const bot = new Telegraf(environmentConfig.getBotToken());
const db = new Database(new MongoClient(environmentConfig.getMongoUrl()));
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

const onError = error => {
  console.error(error);
  onStop('SIGQUIT');
};

bot.use((ctx, next) => {
  ctx.db = db;
  return next();
});
bot.use(session());
bot.use(stage.middleware());

bot.start(handlers.help);
bot.command('track', handlers.track);

bot.help(handlers.help);
bot.launch({ webhook: { domain, port } }).catch(onError);

// Enable graceful stop
process.once('SIGINT', () => onStop('SIGINT'));
process.once('SIGTERM', () => onStop('SIGTERM'));
