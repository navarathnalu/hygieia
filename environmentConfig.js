const getPort = () => process.env.PORT || 2000;
const getHost = () => process.env.DOMAIN_URL;
const getBotToken = () => process.env.BOT_TOKEN;
const getMongoUrl = () => process.env.MONGO_URL || 'mongodb://localhost:27017';

module.exports = { getPort, getHost, getBotToken, getMongoUrl };