const ngrok = require('ngrok');
const environmentConfig = require('./environmentConfig');

const port = environmentConfig.getPort();

(async function () {
  const url = await ngrok.connect(port).catch(console.error);
  process.env.HOSTNAME = url.replace('https://', '');
  require('./server');
})();
