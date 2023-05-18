const getPort = () => process.env.PORT || 2000;
const getHost = () => process.env.HOSTNAME;
const getBotToken = () => process.env.BOT_TOKEN;
const getMongoUrl = () => process.env.MONGO_URL || "mongodb://localhost:30001/?replicaSet=my-replica-set";

module.exports = { getPort, getHost, getBotToken, getMongoUrl };