exports.up = function (knex) {
    knex.schema.createTable("notes", (table) => {
      table.increments();
      table.string("_link");
      table.text("_data");
      table.timestamps(true, true);
    })
    return knex.schema.createTable("history", (table) => {
      table.increments();
      table.string("_link");
      table.text("_data");
      table.timestamps(true,true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema
      .dropTableIfExists("notes")
  };