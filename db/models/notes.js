const { Model } = require("objection");

class Notes extends Model {
  static get tableName() {
    return "notes";
  }
  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

module.exports = Notes;
