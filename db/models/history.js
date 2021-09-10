const { Model } = require("objection");

class History extends Model {
  static get tableName() {
    return "history";
  }
  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }
}

module.exports = History;
