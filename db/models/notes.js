const { Model } = require("objection");
const passwords = require("./passwords");

class Notes extends Model {
  static get tableName() {
    return "notes";
  }
  static relationMappings = {
    passwords: {
      relation: Model.BelongsToOneRelation,
      modelClass: passwords,
      join: {
        from: 'notes._link',
        to: 'passwords.note_id'
      }
    }
  };
  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

module.exports = Notes;
