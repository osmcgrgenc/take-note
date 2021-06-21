exports.up = function (knex) {
    return knex.schema.createTable("notes", (table) => {
      table.increments();
      table.string("_link");
      table.text("_data");
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema
      .dropTableIfExists("notes")
  };