
exports.up = function(knex) {
    return knex.schema.createTable("passwords", (table) => {
        table.increments();
        table.string("note_id");
        table.string("password");
        table.string("password_confirmation");
        table.timestamps(true,true);
      });
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists("password")
};