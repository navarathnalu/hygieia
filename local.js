const ngrok = require('ngrok');
const environmentConfig = require('./environmentConfig');

const port = environmentConfig.getPort();

(async function () {
  try {
    const url = await ngrok.connect(port);
    process.env.HOSTNAME = url.replace('https://', '');
    require('./server');
  } catch (e) {
    console.log(e);
  }
})();
