const { Model } = require("objection");

class Passwords extends Model {
  static get tableName() {
    return "passwords";
  }
  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

module.exports = Passwords;
