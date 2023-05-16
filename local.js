const ngrok = require('ngrok');
// const {bot, onError} = require('./server');
const environmentConfig = require('./environmentConfig');

const port = environmentConfig.getPort();

(async function() {
  const url = await ngrok.connect(port);
  const domain = url.replace('https://', '');
  process.env.HOSTNAME = domain;
  require('./server');
})();
