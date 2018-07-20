const { fork } = require('child_process');

const { Pool } = require('pg');
const pool = new Pool();

const config = {
  interval: process.env.GENERATOR_INTERVAL || 10,
  number_of_numbers: process.env.GENERATOR_NUMBER_OF_NUMBERS || 5000,
  workers: process.env.GENERATOR_WORKERS || 8
};
console.log(config);

async function init() {
  await pool.query('delete from numbers;');
  await pool.query('insert into numbers(id,value) select id, id from generate_series(1, $1, 1) as id', [config.number_of_numbers]);
}

init();

for (let i = 0; i < config.workers; i++)
  fork('./worker.js').send(config);
