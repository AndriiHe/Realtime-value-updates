const { Pool } = require('pg');
const pool = new Pool();

process.on('message', async (config)=>{
  console.log('worker started');
  async function update_single_number() {
    await pool.query('update numbers set value = round(random()*32000) where id = round(random()*$1)', [config.number_of_numbers]);
  }
  setInterval(update_single_number, config.interval);
});
