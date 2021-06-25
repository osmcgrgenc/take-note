
exports.up = function(knex) {
    return knex.schema.createTable("history", (table) => {
        table.increments();
        table.string("_link");
        table.text("_data");
        table.timestamps(true,true);
      });
};

exports.down = function(knex) {
  
};
