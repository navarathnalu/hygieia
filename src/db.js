class Database {
  constructor(client) {
    this.client = client;
    this.dbName = 'hygieia';
    this.collectionName = 'users';
  }

  async connect() {
    await this.client.connect();
    this.users = this.client.db(this.dbName).collection(this.collectionName);
  }

  close() {
    this.client.close();
  }

  async insertUser(id, user) {
    user._id = id;
    return await this.users.insertOne(user);
  }

  async getUser(_id) {
    return await this.users.findOne({ _id });
  }
}

module.exports = Database;
