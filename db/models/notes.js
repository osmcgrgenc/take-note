const {
  Model
} = require("objection");
const passwords = require("./passwords");

class Notes extends Model {
  static get tableName() {
    return "notes";
  }
  static get relationMappings () {
    return {
      passwords: {
        relation: Model.HasOneRelation,
        modelClass: passwords,
        join: {
          from: 'notes._Link',
          to: 'passwords.noteId'
        }
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